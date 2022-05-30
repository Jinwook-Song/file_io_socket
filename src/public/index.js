// Connect Socket from FE to BE
const socket = io();

const messages = document.getElementById('messages');
const form = document.getElementById('form');
const input = document.getElementById('input');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit('load video file', input.value);
    input.value = '';
  }
});

socket.on('send video file', function (videoBuffer, videoMime = 'video/mp4') {
  const videoBlob = new Blob([videoBuffer], { type: videoMime });
  const videoUrl = URL.createObjectURL(videoBlob);
  const video = document.createElement('video');
  video.controls = true;
  video.width = 320;
  video.height = 180;

  video.src = videoUrl;
  messages.appendChild(video);
  window.scrollTo(0, document.body.scrollHeight);
});
