const supabase = require('../config/supabase');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Get all payments (for Admin)
// @route   GET /api/payments
const getAllPayments = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('payments')
            .select(`
                *,
                students!student_id(full_name, room_number)
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all payments for a student
// @route   GET /api/payments/student/:student_id
const getPaymentsByStudent = async (req, res) => {
    try {
        const { student_id } = req.params;
        const { data, error } = await supabase
            .from('payments')
            .select('*')
            .eq('student_id', student_id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Record a manual (Cash/Offline) payment
// @route   POST /api/payments/manual
const recordManualPayment = async (req, res) => {
    try {
        const { student_id, amount, status, note } = req.body;
        
        const { data: student, error: sErr } = await supabase
            .from('students')
            .select('*')
            .eq('student_id', student_id)
            .single();
            
        if (sErr || !student) return res.status(404).json({ message: 'Student not found' });

        const { data, error } = await supabase
            .from('payments')
            .insert([{ 
                student_id, 
                amount, 
                status: status || 'Paid', 
                note: note || 'Manual Payment',
                razorpay_order_id: 'manual',
                razorpay_payment_id: 'manual'
            }])
            .select();

        if (error) throw error;

        // Update student fee status if fully paid
        if (status === 'Paid') {
            await supabase
                .from('students')
                .update({ fee_status: 'Paid' })
                .eq('student_id', student_id);
        }

        res.status(201).json(data[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a Razorpay order
// @route   POST /api/payments/create-order
// @access  Private
const createOrder = async (req, res) => {
    try {
        const { amount, currency, student_id } = req.body;

        const options = {
            amount: amount * 100, // amount in paise
            currency: currency || 'INR',
            receipt: `receipt_${Date.now()}`,
            notes: {
                student_id
            }
        };

        const order = await razorpay.orders.create(options);

        if (!order) {
            return res.status(500).send("Some error occured");
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payments/verify-payment
// @access  Private
const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            student_id,
            amount
        } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            // Update Supabase
            const { data, error } = await supabase
                .from('payments')
                .insert([
                    {
                        student_id,
                        amount,
                        status: 'Paid',
                        razorpay_order_id,
                        razorpay_payment_id,
                        razorpay_signature,
                    }
                ])
                .select();

            if (error) throw error;

            // Also update student's fee_status
            await supabase
                .from('students')
                .update({ fee_status: 'Paid' })
                .eq('student_id', student_id);

            return res.status(200).json({ message: "Payment verified successfully", data: data[0] });
        } else {
            return res.status(400).json({ message: "Invalid signature sent!" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a payment
// @route   DELETE /api/payments/:id
// @access  Private
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
    getAllPayments,
    getPaymentsByStudent,
    createOrder,
    verifyPayment,
    deletePayment,
    recordManualPayment
};
