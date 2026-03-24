const supabase = require('../config/supabase');

// Helper: recalculate and update occupancy for a given roomNumber
const syncRoomOccupancy = async (roomNumber) => {
    if (!roomNumber) return;

    // Count students currently in this room
    const { count, error: countError } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })
        .eq('room_number', roomNumber);

    if (countError) {
        console.error('Error counting students for room:', countError.message);
        return;
    }

    // Update the room's occupancy
    const { error: updateError } = await supabase
        .from('rooms')
        .update({ occupancy: count })
        .eq('room_number', roomNumber);

    if (updateError) {
        throw new Error('Occupancy Sync Failed: ' + updateError.message);
    }
};

// @desc    Get all students
// @route   GET /api/students
// @access  Public
const getStudents = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a student
// @route   POST /api/students
// @access  Public
const createStudent = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('students')
            .insert([req.body])
            .select();

        if (error) throw error;

        // Sync room occupancy if a roomNumber was provided
        if (req.body.room_number) {
            await syncRoomOccupancy(req.body.room_number);
        }

        res.status(201).json(data[0]);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a student
// @route   PUT /api/students/:id
// @access  Public
const updateStudent = async (req, res) => {
    try {
        // Get old student data to check if room assignment changed
        const { data: oldData } = await supabase
            .from('students')
            .select('room_number')
            .eq('id', req.params.id)
            .single();

        const { data, error } = await supabase
            .from('students')
            .update(req.body)
            .eq('id', req.params.id)
            .select();

        if (error) throw error;
        if (!data || data.length === 0) return res.status(404).json({ message: 'Student not found' });

        // Sync occupancy for old room and new room if room changed
        const oldRoom = oldData?.room_number;
        const newRoom = req.body.room_number;
        if (oldRoom) await syncRoomOccupancy(oldRoom);
        if (newRoom && newRoom !== oldRoom) await syncRoomOccupancy(newRoom);

        res.status(200).json(data[0]);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a student
// @route   DELETE /api/students/:id
// @access  Public
const deleteStudent = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('students')
            .delete()
            .eq('id', req.params.id)
            .select();
            
        if (error) throw error;
        if (!data || data.length === 0) return res.status(404).json({ message: 'Student not found' });

        // Sync room occupancy if student had a room assigned
        if (data[0].room_number) {
            await syncRoomOccupancy(data[0].room_number);
        }

        res.status(200).json({ message: 'Student removed' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get roommates for a student in a specific room
// @route   GET /api/students/roommates/:roomNumber?exclude=:studentId
// @access  Public
const getRoommates = async (req, res) => {
    try {
        const { roomNumber } = req.params;
        const { exclude } = req.query;

        if (!roomNumber) return res.status(400).json({ message: 'Room number is required' });

        const { data, error } = await supabase
            .from('students')
            .select('full_name, student_id, sleep_time, cleanliness, study_preference, noise_tolerance')
            .eq('room_number', roomNumber)
            .neq('student_id', exclude || '');

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Find best roommate match for a student
// @route   GET /api/students/find-match/:id
const findMatch = async (req, res) => {
    try {
        const studentId = req.params.id;

        // 1. Get current student preferences
        const { data: me, error: meError } = await supabase
            .from('students')
            .select('*')
            .eq('id', studentId)
            .single();

        if (meError || !me) return res.status(404).json({ message: 'Student not found' });
        if (me.room_assigned) return res.status(400).json({ message: 'Room already assigned' });

        // 2. Get all other unassigned students
        const { data: candidates, error: cError } = await supabase
            .from('students')
            .select('*')
            .neq('id', studentId)
            .eq('room_assigned', false);

        if (cError) throw cError;

        let bestMatch = null;
        let highestScore = -1;

        // 3. Scoring Algorithm
        candidates.forEach(candidate => {
            let score = 0;
            if (candidate.sleep_time === me.sleep_time) score++;
            if (candidate.cleanliness === me.cleanliness) score++;
            if (candidate.study_preference === me.study_preference) score++;
            if (candidate.noise_tolerance === me.noise_tolerance) score++;

            if (score > highestScore) {
                highestScore = score;
                bestMatch = { ...candidate, matchScore: score };
            }
        });

        if (bestMatch && highestScore >= 3) {
            res.status(200).json({
                found: true,
                match: {
                    id: bestMatch.id,
                    full_name: bestMatch.full_name,
                    course: bestMatch.course,
                    preferences: {
                        sleep_time: bestMatch.sleep_time,
                        cleanliness: bestMatch.cleanliness,
                        study_preference: bestMatch.study_preference,
                        noise_tolerance: bestMatch.noise_tolerance
                    },
                    score: highestScore,
                    percentage: (highestScore / 4) * 100
                }
            });
        } else {
            res.status(200).json({ found: false, message: 'No strong match found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Accept roommate match
// @route   POST /api/students/accept-match
const acceptMatch = async (req, res) => {
    try {
        const { studentId, roommateId } = req.body;

        if (!studentId || !roommateId) {
            return res.status(400).json({ message: 'Student ID and Roommate ID are required' });
        }

        // 1. Check if both are still unassigned
        const { data: students, error: sError } = await supabase
            .from('students')
            .select('id, room_assigned, room_number')
            .in('id', [studentId, roommateId]);

        if (sError) throw sError;
        if (students.length !== 2) return res.status(404).json({ message: 'One or both students not found' });
        if (students.some(s => s.room_assigned)) {
            return res.status(400).json({ message: 'One or both students already assigned' });
        }

        // 2. Find an available room that has at least 2 empty spots
        // We look for rooms where capacity - occupancy >= 2
        const { data: rooms, error: rError } = await supabase
            .from('rooms')
            .select('room_number, capacity, occupancy')
            .order('occupancy', { ascending: true });

        if (rError) throw rError;
        
        const room = rooms?.find(r => (r.capacity - r.occupancy) >= 2);

        if (!room) return res.status(400).json({ message: 'No rooms found with 2 available spots' });

        // 3. Update both students
        const update1 = supabase
            .from('students')
            .update({ 
                roommate_id: roommateId, 
                room_assigned: true,
                room_number: room.room_number 
            })
            .eq('id', studentId);

        const update2 = supabase
            .from('students')
            .update({ 
                roommate_id: studentId, 
                room_assigned: true,
                room_number: room.room_number 
            })
            .eq('id', roommateId);

        const results = await Promise.all([update1, update2]);
        const errors = results.filter(r => r.error);
        if (errors.length > 0) throw errors[0].error;

        // 4. Sync room occupancy
        await syncRoomOccupancy(room.room_number);

        res.status(200).json({ 
            message: 'Match accepted and room assigned!',
            room_number: room.room_number
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    getRoommates,
    findMatch,
    acceptMatch
};


