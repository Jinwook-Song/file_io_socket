import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import mime from 'mime';
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

  //
  socket.on(
    'load video file',
    (fileName = '소방시연용_Remote_mov_201103_lite') => {
      console.log('video file name: ' + fileName);

      // video
      const videoPath = path.join(
        __dirname,
        '..',
        `assets/videos/${fileName}.mp4`
      );
      try {
        const videoBuffer = fs.readFileSync(videoPath);
        const videoMime = mime.getType(videoPath);
        io.emit('send video file', videoBuffer, videoMime); // emit event to everyone
      } catch (error) {
        console.log(error);
      }
    }
  );
});

server.listen(port, () => {
  console.log(`✅ Listening on http://localhost:${port}`);
});
