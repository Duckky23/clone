// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Cấu hình CORS cho Express
app.use(cors({
  origin: ['http://localhost:3000', 'https://clone-six-coral.vercel.app'], // Các origin chấp nhận
  methods: ['GET', 'POST'],
  credentials: true,
}));

// Cấu hình Socket.io với CORS
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'https://clone-six-coral.vercel.app'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Lắng nghe kết nối từ client
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Nhận tin nhắn từ client và phát tới các client khác
  socket.on('send_message', (message) => {
    io.emit('receive_message', message);
  });

  // Xử lý khi user ngắt kết nối
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Lắng nghe cổng 4000
server.listen(4000, () => {
  console.log('Server is running on port 4000');
});
