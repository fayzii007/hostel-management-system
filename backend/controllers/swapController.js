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
            .select('*, requester:requester_id(*), target:target_id(*)')
            .eq('id', requestId)
            .single();
            
        if (rError || !request) return res.status(404).json({ message: 'Request not found' });
        
        const requester = request.requester;
        const target = request.target;
        
        if (!requester.room_number || !target.room_number) {
            return res.status(400).json({ message: 'Both students must have rooms already assigned' });
        }

        // 2. SWAP ROOMS
        const tempRoom = requester.room_number;
        
        const update1 = supabase.from('students').update({ 
            room_number: target.room_number,
            wants_room_change: false 
        }).eq('id', requester.id);
        
        const update2 = supabase.from('students').update({ 
            room_number: tempRoom,
            wants_room_change: false 
        }).eq('id', target.id);
        
        const updateReq = supabase.from('room_swap_requests').update({ status: 'accepted' }).eq('id', requestId);

        const results = await Promise.all([update1, update2, updateReq]);
        const errors = results.filter(r => r.error);
        if (errors.length > 0) throw errors[0].error;

        // 3. Sync occupancies (optional if roommates count stays the same, but safer)
        await syncRoomOccupancy(requester.room_number);
        await syncRoomOccupancy(target.room_number);

        res.status(200).json({ message: 'Room swap successful!', new_room: target.room_number });
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
            .select('*, requester:requester_id(id, full_name, room_number)')
            .eq('target_id', studentId)
            .eq('status', 'pending');
            
        // Outgoing requests
        const { data: outgoing, error: oError } = await supabase
            .from('room_swap_requests')
            .select('*, target:target_id(id, full_name, room_number)')
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
    sendSwapRequest,
    handleSwapRequest,
    getStudentRequests
};
