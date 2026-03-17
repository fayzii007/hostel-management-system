const supabase = require('../config/supabase');

// @desc    Get all payments
// @route   GET /api/payments
// @access  Public
const getPayments = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('payments')
            .select('*')
            .order('paymentDate', { ascending: false });

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a payment
// @route   POST /api/payments
// @access  Public
const createPayment = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('payments')
            .insert([req.body])
            .select();

        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a payment
// @route   DELETE /api/payments/:id
// @access  Public
const deletePayment = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('payments')
            .delete()
            .eq('id', req.params.id)
            .select();
            
        if (error) throw error;
        if (!data || data.length === 0) return res.status(404).json({ message: 'Payment not found' });
        
        res.status(200).json({ message: 'Payment removed' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getPayments,
    createPayment,
    deletePayment
};
