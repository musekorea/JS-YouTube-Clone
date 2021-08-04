const { set } = require('mongoose');

const recStartBtn = document.querySelector('.videoRecorderContainer');
const preview = document.querySelector('#preview');
const readySpan = document.querySelector('#startBtn');
const startSpan = document.querySelector('#recBtn');
const stopSpan = document.querySelector('#stopBtn');
const finalSpan = document.querySelector('#finalBtn');

let stream;
let recorder;
let videoURL;

const handleReady = async () => {
  preview.classList.remove('hide');
  recStartBtn.classList.add('active');
  recStartBtn.style.backgroundColor = `red`;

  stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: { width: 350, height: 240 },
  });
  if (stream) {
    console.log(stream);
    readySpan.classList.add('hide');
    startSpan.classList.remove('hide');
    recStartBtn.removeEventListener('click', handleReady);
    recStartBtn.addEventListener('click', handleStartRecord);
    preview.srcObject = stream;
    preview.play();
  }
};

const handleStartRecord = () => {
  console.log('start record');
  startSpan.classList.add('hide');
  stopSpan.classList.remove('hide');
  recStartBtn.style.backgroundColor = `green`;
  recStartBtn.classList.remove('active');
  preview.classList.add('recording');
  recStartBtn.removeEventListener('click', handleStartRecord);
  recStartBtn.addEventListener('click', handleStopRecord);
  recorder = new MediaRecorder(stream, { MimeType: 'video/webm' });
  recorder.start();
};

const handleStopRecord = () => {
  console.log('stop record');
  stopSpan.classList.add('hide');

  recStartBtn.style.backgroundColor = `steelblue`;
  recStartBtn.removeEventListener('click', handleStopRecord);
  recorder.stop();
  recorder.ondataavailable = (e) => {
    videoURL = URL.createObjectURL(e.data);
    preview.srcObject = null;
    preview.src = videoURL;
    preview.loop = true;
    preview.play();
    handleDownload();
  };
};

const handleDownload = () => {
  const videoDownload = document.createElement('a');
  preview.classList.remove('recording');
  finalSpan.classList.remove('hide');
  videoDownload.href = videoURL;
  videoDownload.download = 'MyRecording.webm';
  document.body.appendChild(videoDownload);
  videoDownload.innerHTML = 'ok';
  videoDownload.click();
  const tracks = stream.getTracks();
  console.log(tracks);
  tracks.forEach((track) => track.stop());
  stream = null;
};

recStartBtn.addEventListener('click', handleReady);
