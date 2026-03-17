const supabase = require('../config/supabase');

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Public
const getComplaints = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('complaints')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a complaint
// @route   POST /api/complaints
// @access  Public
const createComplaint = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('complaints')
            .insert([req.body])
            .select();

        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a complaint
// @route   PUT /api/complaints/:id
// @access  Public
const updateComplaint = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('complaints')
            .update(req.body)
            .eq('id', req.params.id)
            .select();

        if (error) throw error;
        if (!data || data.length === 0) return res.status(404).json({ message: 'Complaint not found' });
        
        res.status(200).json(data[0]);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a complaint
// @route   DELETE /api/complaints/:id
// @access  Public
const deleteComplaint = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('complaints')
            .delete()
            .eq('id', req.params.id)
            .select();
            
        if (error) throw error;
        if (!data || data.length === 0) return res.status(404).json({ message: 'Complaint not found' });
        
        res.status(200).json({ message: 'Complaint removed' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getComplaints,
    createComplaint,
    updateComplaint,
    deleteComplaint
};
