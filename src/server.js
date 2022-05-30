import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = 3000;

// public 경로의 파일들을 static 경로로 접근하여 사용할 수 있다.
// static은 임의의 경로로 설정하여 사용이 가능
app.use('/static', express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

io.on('connection', (socket) => {
  const { id } = socket;
  console.log('🎉 a user connected:', id);
  socket.on('disconnect', () => {
    console.log('🚀 user disconnected:', id);
  });

  // chat message
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', msg); // emit event to everyone
  });
});

server.listen(port, () => {
  console.log(`✅ Listening on http://localhost:${port}`);
});
