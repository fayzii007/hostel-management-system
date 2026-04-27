const dotenv = require('dotenv');
// Only load dotenv if not in production and not on Vercel
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    dotenv.config();
}

const express = require('express');
const cors = require('cors');
const supabase = require('./config/supabase');

// Route files
const studentRoutes = require('./routes/studentRoutes');
const roomRoutes = require('./routes/roomRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const swapRoutes = require('./routes/swapRoutes');
const leaveRoutes = require('./routes/leaveRoutes');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS with more explicit settings for Vercel
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Mount routers
app.use('/api/students', studentRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/swap', swapRoutes);
app.use('/api/leaves', leaveRoutes);

// Sync all room occupancies based on current student assignments
const syncAllRoomOccupancies = async () => {
    try {
        console.log('Starting room occupancy sync...');
        const { data: rooms, error: roomError } = await supabase.from('rooms').select('room_number');
        
        if (roomError) throw roomError;
        if (!rooms) return;

        // Use Promise.all for faster sync if possible, or keep sequential if many rooms
        for (const room of rooms) {
            const { count, error: countError } = await supabase
                .from('students')
                .select('*', { count: 'exact', head: true })
                .eq('room_number', room.room_number);

            if (countError) {
                console.error(`Error counting for room ${room.room_number}:`, countError.message);
                continue;
            }

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
    res.json({ 
        status: 'ok', 
        message: 'HMS API is running',
        environment: process.env.VERCEL ? 'vercel' : 'local',
        supabase_connected: !!process.env.SUPABASE_URL,
        timestamp: new Date().toISOString()
    });
});

// Root path for Vercel deployment verification
app.get('/', (req, res) => {
    res.send('HMS Backend is Live 🚀');
});

const PORT = process.env.PORT || 5000;

// Export for Vercel
module.exports = app;

// Listen only when local
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, async () => {
        console.log(`Server running on port ${PORT}`);
        // Auto-sync on server start
        await syncAllRoomOccupancies();
    });
}

