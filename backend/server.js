const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const supabase = require('./config/supabase');

// Route files
const studentRoutes = require('./routes/studentRoutes');
const roomRoutes = require('./routes/roomRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const swapRoutes = require('./routes/swapRoutes');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/students', studentRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/swap', swapRoutes);

// Sync all room occupancies based on current student assignments
const syncAllRoomOccupancies = async () => {
    try {
        const { data: rooms } = await supabase.from('rooms').select('room_number');
        if (!rooms) return;

        for (const room of rooms) {
            const { count } = await supabase
                .from('students')
                .select('*', { count: 'exact', head: true })
                .eq('room_number', room.room_number);

            await supabase
                .from('rooms')
                .update({ occupancy: count || 0 })
                .eq('room_number', room.room_number);
        }
        console.log('Room occupancies synced successfully.');
    } catch (err) {
        console.error('Error syncing room occupancies:', err.message);
    }
};

// API endpoint to manually trigger sync
app.get('/api/sync-occupancy', async (req, res) => {
    await syncAllRoomOccupancies();
    res.json({ message: 'Room occupancies synced!' });
});

// Health check for deployment
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'HMS API is running' });
});

// Global Error Handler for Vercel Debugging
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err.stack);
    res.status(500).json({ 
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Check Vercel Logs'
    });
});

const PORT = process.env.PORT || 5000;

// Only listen if not running as a serverless function (optional logic for Vercel)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, async () => {
        console.log(`Server running on port ${PORT}`);
        await syncAllRoomOccupancies();
    });
}

module.exports = app;
