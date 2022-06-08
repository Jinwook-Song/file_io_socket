import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import mime from 'mime';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  maxHttpBufferSize: 1e9, // 100 MB
});

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
  socket.on('load file', (fileName) => {
    console.log('file name: ' + fileName);

    // video file
    const videoPath = path.join(
      __dirname,
      '..',
      `assets/videos/${fileName}.mp4`
    );
    try {
      const videoBuffer = fs.readFileSync(videoPath);
      console.log(videoBuffer);
      const videoMime = mime.getType(videoPath);
      io.emit('send video file', videoBuffer, videoMime); // emit event to everyone
    } catch (error) {
      console.log(error);
    }

    // image file
    const imagePath = path.join(
      __dirname,
      '..',
      `assets/images/${fileName}.pdf`
    );
    try {
      const imageBuffer = fs.readFileSync(imagePath);
      console.log(imageBuffer);
      const imageMime = mime.getType(imagePath);
      io.emit('send image file', imageBuffer, imageMime); // emit event to everyone
    } catch (error) {
      console.log(error);
    }
  });

  socket.on('add video file', (videoFile, videoName) => {
    const videoBuffer = Buffer.from(videoFile);
    const videoPath = path.join(__dirname, '..', `assets/videos/${videoName}`);
    fs.writeFileSync(videoPath, videoBuffer);
    io.emit('send video file', videoBuffer, videoName);
  });

  socket.on('add image file', (imageFile, imageName) => {
    const imageBuffer = Buffer.from(imageFile);
    const imagePath = path.join(__dirname, '..', `assets/images/${imageName}`);
    fs.writeFileSync(imagePath, imageBuffer);
    io.emit('send image file', imageBuffer, imageName);
  });
});

server.listen(port, () => {
  console.log(`✅ Listening on http://localhost:${port}`);
});
