const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase'); // Service role key bypasses RLS

// Get all leave requests (joined with student names and rooms)
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('leave_requests')
            .select(`
                *,
                students (
                    full_name,
                    room_number,
                    student_id
                )
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error fetching leaves:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update leave status (Approve / Reject)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const { data, error } = await supabase
            .from('leave_requests')
            .update({ status })
            .eq('id', id)
            .select();

        if (error) throw error;
        res.json(data[0]);
    } catch (error) {
        console.error('Error updating leave status:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
