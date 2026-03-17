const supabase = require('../config/supabase');

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Public
const getRooms = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('rooms')
            .select('*')
            .order('roomNumber', { ascending: true });
            
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a room
// @route   POST /api/rooms
// @access  Public
const createRoom = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('rooms')
            .insert([req.body])
            .select();

        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a room
// @route   PUT /api/rooms/:id
// @access  Public
const updateRoom = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('rooms')
            .update(req.body)
            .eq('id', req.params.id)
            .select();

        if (error) throw error;
        if (!data || data.length === 0) return res.status(404).json({ message: 'Room not found' });
        
        res.status(200).json(data[0]);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a room
// @route   DELETE /api/rooms/:id
// @access  Public
const deleteRoom = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('rooms')
            .delete()
            .eq('id', req.params.id)
            .select();
            
        if (error) throw error;
        if (!data || data.length === 0) return res.status(404).json({ message: 'Room not found' });
        
        res.status(200).json({ message: 'Room removed' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getRooms,
    createRoom,
    updateRoom,
    deleteRoom
};
