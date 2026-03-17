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

// Sync all room occupancies based on current student assignments
const syncAllRoomOccupancies = async () => {
    try {
        const { data: rooms } = await supabase.from('rooms').select('roomNumber');
        if (!rooms) return;

        for (const room of rooms) {
            const { count } = await supabase
                .from('students')
                .select('*', { count: 'exact', head: true })
                .eq('roomNumber', room.roomNumber);

            await supabase
                .from('rooms')
                .update({ occupancy: count || 0 })
                .eq('roomNumber', room.roomNumber);
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    // Auto-sync on server start
    await syncAllRoomOccupancies();
});
