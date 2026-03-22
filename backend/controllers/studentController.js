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
    await supabase
        .from('rooms')
        .update({ occupancy: count })
        .eq('room_number', roomNumber);
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
            .select('full_name, student_id')
            .eq('room_number', roomNumber)
            .neq('student_id', exclude || '');

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    getRoommates
};


