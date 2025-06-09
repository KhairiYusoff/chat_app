import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import { authenticateSocket } from './middleware/auth.js';
import { User } from './models/User.js';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI environment variable is not set');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    console.log('📊 Database: chatapp');
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Socket authentication middleware
io.use(authenticateSocket);

const connectedUsers = new Map();

io.on('connection', async (socket) => {
  console.log('👤 User connected:', socket.user.username);
  
  // Update user online status
  await User.findByIdAndUpdate(socket.user._id, {
    isOnline: true,
    lastSeen: new Date()
  });

  // Store user connection
  connectedUsers.set(socket.user._id.toString(), {
    socketId: socket.id,
    user: {
      id: socket.user._id,
      username: socket.user.username,
      avatar: socket.user.avatar,
      isOnline: true
    }
  });

  // Broadcast updated user list
  const userList = Array.from(connectedUsers.values()).map(conn => conn.user);
  io.emit('users:update', userList);

  // Join user to their personal room for private messages
  socket.join(socket.user._id.toString());

  socket.on('message:send', (message) => {
    // Broadcast to all other users
    socket.broadcast.emit('message:received', {
      ...message,
      sender: socket.user.username,
      senderAvatar: socket.user.avatar
    });
  });

  socket.on('disconnect', async () => {
    console.log('👋 User disconnected:', socket.user.username);
    
    // Update user offline status
    await User.findByIdAndUpdate(socket.user._id, {
      isOnline: false,
      lastSeen: new Date()
    });

    // Remove from connected users
    connectedUsers.delete(socket.user._id.toString());

    // Broadcast user left and updated user list
    socket.broadcast.emit('user:left', socket.user.username);
    const userList = Array.from(connectedUsers.values()).map(conn => conn.user);
    io.emit('users:update', userList);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Frontend: http://localhost:5173`);
  console.log(`🔗 Backend: http://localhost:${PORT}`);
});