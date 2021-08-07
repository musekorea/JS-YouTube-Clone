import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

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
  recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
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

const handleDownload = async () => {
  const ffmpeg = createFFmpeg({ log: true });
  await ffmpeg.load();
  ffmpeg.FS('writeFile', 'recording.webm', await fetchFile(videoURL));
  await ffmpeg.run('-i', 'recording.webm', '-r', '60', 'output.mp4');
  await ffmpeg.run(
    '-i',
    'recording.webm',
    '-ss',
    '00:00:01',
    '-frames:v',
    '1',
    'thumbnail.jpg'
  );
  const mp4File = ffmpeg.FS('readFile', 'output.mp4');
  const thumbFile = ffmpeg.FS('readFile', 'thumbnail.jpg');
  const mp4Blob = new Blob([mp4File.buffer], { type: 'video/mp4' });
  const thumbBlob = new Blob([thumbFile.buffer], { type: 'image/jpg' });
  const mp4URL = URL.createObjectURL(mp4Blob);
  const jpgURL = URL.createObjectURL(thumbBlob);
  console.log(jpgURL);

  const videoDownload = document.createElement('a');
  preview.classList.remove('recording');
  finalSpan.classList.remove('hide');
  videoDownload.href = mp4URL;
  videoDownload.download = 'MyRecording.mp4';
  document.body.appendChild(videoDownload);
  //videoDownload.innerHTML = 'ok';
  videoDownload.click();

  const thumbDownload = document.createElement('a');
  thumbDownload.href = jpgURL;
  thumbDownload.download = 'thumbnail.jpg';
  document.body.appendChild(thumbDownload);
  //thumbDownload.innerHTML = 'ok';
  thumbDownload.click();

  ffmpeg.FS('unlink', 'recording.webm');
  ffmpeg.FS('unlink', 'output.mp4');
  ffmpeg.FS('unlink', 'thumbnail.jpg');

  URL.revokeObjectURL(mp4URL);
  URL.revokeObjectURL(jpgURL);

  const tracks = stream.getTracks();
  console.log(tracks);
  tracks.forEach((track) => track.stop());
  stream = null;
};

recStartBtn.addEventListener('click', handleReady);
