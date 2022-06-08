// Connect Socket from FE to BE
const socket = io();

const messages = document.getElementById('messages');
const form = document.getElementById('form');
const input = document.getElementById('input');
const videoInput = document.getElementById('videoInput');
const imageInput = document.getElementById('imageInput');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit('load file', input.value);
    input.value = '';
  } else {
    const pdf = messages.childNodes[0];
    pdf.style.width = '20%';
    pdf.style.height = '20vh';
    pdf.style.position = 'relative';
    pdf.style.bottom = 'inherit';
  }
});

videoInput.addEventListener('change', function (event) {
  const video = event.target.files[0];
  const videoName = video.name;

  const reader = new FileReader();
  reader.readAsArrayBuffer(video);
  reader.onload = (event) => {
    videoBuffer = event.target.result;

    socket.emit('add video file', videoBuffer, videoName);
  };
});

imageInput.addEventListener('change', function (event) {
  const image = event.target.files[0];
  const imageName = image.name;

  const reader = new FileReader();
  reader.readAsArrayBuffer(image);
  reader.onload = (event) => {
    imageBuffer = event.target.result;

    socket.emit('add image file', imageBuffer, imageName);
  };
});

socket.on('send video file', function (videoBuffer, videoName) {
  const videoMime = videoName.split('.')[1];
  const videoBlob = new Blob([videoBuffer], { type: videoMime });
  const videoUrl = URL.createObjectURL(videoBlob);
  const video = document.createElement('video');
  video.controls = true;
  video.width = 320;
  video.height = 180;

  video.src = videoUrl;
  messages.appendChild(video);
  window.scrollTo(0, document.body.scrollHeight);

  video.addEventListener('dblclick', (event) => {
    console.log('move');
  });
});

socket.on('send image file', function (imageBuffer, imageName) {
  const imageMime = imageName.split('.')[1];
  console.log(imageMime);
  const imageBlob = new Blob([imageBuffer], { type: 'application/pdf' });
  const imageUrl = URL.createObjectURL(imageBlob);
  const embed = document.createElement('embed');
  embed.width = 320;
  embed.height = 180;

  embed.src = imageUrl;
  messages.appendChild(embed);
  window.scrollTo(0, document.body.scrollHeight);
  embed.addEventListener('mousemove', () => {
    console.log('moved');
    // image.width = 640;
    // image.height = 360;
  });
});

messages.addEventListener('dblclick', () => {
  console.log('clicked');
  let pdf = messages.childNodes[0];

  pdf.style.width = '100%';
  pdf.style.height = '100vh';
  pdf.style.position = 'absolute';
  pdf.style.bottom = 0;

  pdf = messages.childNodes[1];

  pdf.style.width = '100%';
  pdf.style.height = '100vh';
  pdf.style.position = 'absolute';
  pdf.style.bottom = 0;
});

const body = document.querySelector('body');
body.addEventListener('keydown', (event) => {
  const pdf = messages.childNodes[0];
  pdf.style.width = '20%';
  pdf.style.height = '20vh';
  pdf.style.position = 'relative';
  pdf.style.bottom = 'inherit';
});
