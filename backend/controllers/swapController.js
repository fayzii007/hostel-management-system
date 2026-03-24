const supabase = require('../config/supabase');

// Helper: sync room occupancy
const syncRoomOccupancy = async (roomNumber) => {
    if (!roomNumber) return;
    const { count } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })
        .eq('room_number', roomNumber);

    await supabase
        .from('rooms')
        .update({ occupancy: count || 0 })
        .eq('room_number', roomNumber);
};

// @desc    Toggle swap status for a student
// @route   POST /api/swap/toggle-status
const toggleSwapStatus = async (req, res) => {
    try {
        const { studentId, status } = req.body;
        const { data, error } = await supabase
            .from('students')
            .update({ wants_room_change: status })
            .eq('id', studentId)
            .select();

        if (error) throw error;
        res.status(200).json(data[0]);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get candidates for swap
// @route   GET /api/swap/candidates?exclude=:id
const getSwapCandidates = async (req, res) => {
    try {
        const { exclude } = req.query;
        const { data, error } = await supabase
            .from('students')
            .select('id, full_name, room_number, course, sleep_time, cleanliness, study_preference, noise_tolerance')
            .eq('wants_room_change', true)
            .neq('id', exclude);

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Send a swap request
// @route   POST /api/swap/request
const sendSwapRequest = async (req, res) => {
    try {
        const { requesterId, targetId, reason } = req.body;

        // Check for existing pending request
        const { data: existing } = await supabase
            .from('room_swap_requests')
            .select('*')
            .eq('requester_id', requesterId)
            .eq('target_id', targetId)
            .eq('status', 'pending');

        if (existing && existing.length > 0) {
            return res.status(400).json({ message: 'Request already pending' });
        }

        const { data, error } = await supabase
            .from('room_swap_requests')
            .insert([{ requester_id: requesterId, target_id: targetId, reason, status: 'pending' }])
            .select();

        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Handle swap request (Accept/Reject)
// @route   POST /api/swap/handle
const handleSwapRequest = async (req, res) => {
    try {
        const { requestId, action } = req.body; // action: 'accepted' or 'rejected'

        if (action === 'rejected') {
            await supabase.from('room_swap_requests').update({ status: 'rejected' }).eq('id', requestId);
            return res.status(200).json({ message: 'Request rejected' });
        }

        // 1. Get request details
        const { data: request, error: rError } = await supabase
            .from('room_swap_requests')
            .select('*, requester:students!requester_id(*), target:students!target_id(*)')
            .eq('id', requestId)
            .single();

        if (rError || !request) {
            console.error('Swap Error - Request not found:', requestId);
            return res.status(404).json({ message: 'Request not found' });
        }

        const requester = request.requester;
        const target = request.target;

        if (!requester || !target) {
            return res.status(404).json({ message: 'Could not find one of the swap students' });
        }

        if (!requester.room_number || !target.room_number) {
            return res.status(400).json({ message: 'Both students must have rooms assigned before swapping' });
        }

        const oldReqRoom = requester.room_number;
        const oldTarRoom = target.room_number;

        // 2. ONLY MARK AS ACCEPTED - DO NOT SWAP YET
        // Actual swap happens when admin approves
        const { error: reqErr } = await supabase
            .from('room_swap_requests')
            .update({ status: 'accepted' })
            .eq('id', requestId);
            
        if (reqErr) throw reqErr;

        res.status(200).json({ message: 'Request accepted! Waiting for admin approval.', status: 'accepted' });
    } catch (error) {
        console.error('Swap Accept Error:', error.message);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all swap requests for admin
// @route   GET /api/swap/admin/all
const getAllSwapsAdmin = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('room_swap_requests')
            .select(`
                *,
                requester:students!requester_id(full_name, room_number, course),
                target:students!target_id(full_name, room_number, course)
            `)
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Admin Handle Swap (Approve/Reject)
// @route   POST /api/swap/admin/handle
const adminHandleSwap = async (req, res) => {
    try {
        const { requestId, action } = req.body; // action: 'admin_approved' or 'admin_rejected'
        
        if (action === 'admin_rejected') {
            await supabase.from('room_swap_requests').update({ status: 'admin_rejected' }).eq('id', requestId);
            return res.status(200).json({ message: 'Swap rejected by admin' });
        }

        // 1. Get request details with current student room info
        const { data: request, error: rError } = await supabase
            .from('room_swap_requests')
            .select('*, requester:students!requester_id(*), target:students!target_id(*)')
            .eq('id', requestId)
            .single();
            
        if (rError || !request) return res.status(404).json({ message: 'Request not found' });
        
        const requester = request.requester;
        const target = request.target;
        
        if (!requester || !target || !requester.room_number || !target.room_number) {
            return res.status(400).json({ message: 'Both students must have rooms assigned' });
        }

        const roomA = requester.room_number;
        const roomB = target.room_number;

        // 2. ATOMIC SWAP
        const update1 = await supabase.from('students').update({ 
            room_number: roomB, 
            wants_room_change: false,
            roommate_id: null
        }).eq('id', requester.id);
        
        const update2 = await supabase.from('students').update({ 
            room_number: roomA, 
            wants_room_change: false,
            roommate_id: null
        }).eq('id', target.id);

        const updateReq = await supabase.from('room_swap_requests').update({ 
            status: 'admin_approved' 
        }).eq('id', requestId);
        
        if (update1.error || update2.error || updateReq.error) throw (update1.error || update2.error || updateReq.error);

        // 3. Sync room occupancy
        await syncRoomOccupancy(roomA);
        await syncRoomOccupancy(roomB);

        res.status(200).json({ message: 'Swap approved and rooms exchanged successfully!' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get top 3 swap suggestions based on compatibility
// @route   GET /api/swap/suggestions/:studentId
const getSwapSuggestions = async (req, res) => {
    try {
        const { studentId } = req.params;

        // 1. Get current student preferences
        const { data: me, error: meError } = await supabase
            .from('students')
            .select('*')
            .eq('id', studentId)
            .single();

        if (meError) {
            console.error('SwapSuggestion - Me Fetch Error:', meError.message);
            return res.status(404).json({ message: 'Student profile not found' });
        }
        if (!me) return res.status(404).json({ message: 'Student not found' });

        // 2. Get candidates
        const { data: candidates, error: cError } = await supabase
            .from('students')
            .select('*')
            .eq('wants_room_change', true)
            .neq('id', studentId);

        if (cError) {
            console.error('SwapSuggestion - Candidates Fetch Error:', cError.message);
            throw cError;
        }

        // 3. Scoring Algorithm
        const suggestions = candidates.map(cand => {
            let score = 0;
            const matches = [];

            if (cand.sleep_time === me.sleep_time) { score++; matches.push('Sleep Time'); }
            if (cand.cleanliness === me.cleanliness) { score++; matches.push('Cleanliness'); }
            if (cand.study_preference === me.study_preference) { score++; matches.push('Study Preference'); }
            if (cand.noise_tolerance === me.noise_tolerance) { score++; matches.push('Noise Tolerance'); }

            return {
                id: cand.id,
                full_name: cand.full_name,
                room_number: cand.room_number,
                course: cand.course,
                score,
                percentage: (score / 4) * 100,
                matches,
                labels: {
                    sleep_time: cand.sleep_time,
                    cleanliness: cand.cleanliness,
                    study_preference: cand.study_preference,
                    noise_tolerance: cand.noise_tolerance
                }
            };
        });

        // 4. Sort and take top 3 with score >= 2
        const topSuggestions = suggestions
            .filter(s => s.score >= 2)
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);

        res.status(200).json(topSuggestions);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get swap requests for a student
// @route   GET /api/swap/requests/:studentId
const getStudentRequests = async (req, res) => {
    try {
        const { studentId } = req.params;

        // Incoming requests
        const { data: incoming, error: iError } = await supabase
            .from('room_swap_requests')
            .select('*, requester:students!requester_id(id, full_name, room_number)')
            .eq('target_id', studentId)
            .eq('status', 'pending');

        // Outgoing requests
        const { data: outgoing, error: oError } = await supabase
            .from('room_swap_requests')
            .select('*, target:students!target_id(id, full_name, room_number)')
            .eq('requester_id', studentId);

        if (iError || oError) throw iError || oError;

        res.status(200).json({ incoming, outgoing });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    toggleSwapStatus,
    getSwapCandidates,
    getSwapSuggestions,
    sendSwapRequest,
    handleSwapRequest,
    getStudentRequests,
    getAllSwapsAdmin,
    adminHandleSwap
};
