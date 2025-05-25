import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

const users = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('user:join', (username) => {
    users.set(socket.id, { id: socket.id, username, isOnline: true });
    io.emit('users:update', Array.from(users.values()));
  });

  socket.on('message:send', (message) => {
    socket.broadcast.emit('message:received', message);
  });

  socket.on('disconnect', () => {
    users.delete(socket.id);
    io.emit('users:update', Array.from(users.values()));
    console.log('User disconnected:', socket.id);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});