import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const recordContainer = document.querySelector('.videoRecorderContainer');
const readySpan = document.querySelector('#readySpan');
const startSpan = document.querySelector('#startSpan');
const stopSpan = document.querySelector('#stopSpan');
const finalSpan = document.querySelector('#finalSpan');
const preview = document.querySelector('#preview');
const recMessage = document.querySelector('#recMessage');

let stream;
let recorder;
let videoURL;

const handleReady = async () => {
  preview.classList.remove('hide');
  recordContainer.classList.add('active');
  recordContainer.style.backgroundColor = `red`;

  stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: { width: 500, height: 250 },
  });
  if (stream) {
    readySpan.classList.add('hide');
    startSpan.classList.remove('hide');
    recordContainer.removeEventListener('click', handleReady);
    recordContainer.addEventListener('click', handleStartRecord);
    preview.srcObject = stream;
    preview.play();
  }
};

const handleStartRecord = () => {
  startSpan.classList.add('hide');
  stopSpan.classList.remove('hide');
  recordContainer.style.backgroundColor = `green`;
  recordContainer.classList.remove('active');
  preview.classList.add('recording');
  recMessage.classList.remove('hide');

  recordContainer.removeEventListener('click', handleStartRecord);
  recordContainer.addEventListener('click', handleStopRecord);
  recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
  recorder.start();
};

const handleStopRecord = () => {
  preview.classList.remove('recording');
  recMessage.innerHTML = `Please wait, it's processing now`;
  recMessage.classList.add('active');
  recMessage.style.color = `black`;
  recordContainer.style.backgroundColor = `gray`;
  stopSpan.innerHTML = `Please wait`;
  recordContainer.removeEventListener('click', handleStopRecord);
  recorder.stop();
  recorder.ondataavailable = (e) => {
    videoURL = URL.createObjectURL(e.data);
    preview.srcObject = null;
    preview.src = videoURL;
    preview.loop = true;
    preview.width = 500;
    preview.height = 250;
    preview.play();
    handleDownload();
  };
};

const files = {
  input: 'recording.webm',
  output: 'output.mp4',
  thumb: 'thumbnail.jpg',
};

const downloadFile = (fileURL, fileName) => {
  const a = document.createElement('a');
  a.href = fileURL;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
};

const handleDownload = async () => {
  const ffmpeg = createFFmpeg({ log: true });
  await ffmpeg.load();
  ffmpeg.FS('writeFile', files.input, await fetchFile(videoURL));
  await ffmpeg.run('-i', files.input, '-r', '60', files.output);
  await ffmpeg.run(
    '-i',
    files.input,
    '-ss',
    '00:00:01',
    '-frames:v',
    '1',
    files.thumb
  );
  const mp4File = ffmpeg.FS('readFile', files.output);
  const thumbFile = ffmpeg.FS('readFile', files.thumb);
  const mp4Blob = new Blob([mp4File.buffer], { type: 'video/mp4' });
  const thumbBlob = new Blob([thumbFile.buffer], { type: 'image/jpg' });
  const mp4URL = URL.createObjectURL(mp4Blob);
  const jpgURL = URL.createObjectURL(thumbBlob);
  recordContainer.style.backgroundColor = `steelblue`;
  stopSpan.classList.add('hide');
  recMessage.classList.add('hide');
  finalSpan.classList.remove('hide');

  downloadFile(mp4URL, 'myRecording.mp4');
  downloadFile(jpgURL, 'MyThumbnail.jpg');

  ffmpeg.FS('unlink', files.input);
  ffmpeg.FS('unlink', files.output);
  ffmpeg.FS('unlink', files.thumb);

  URL.revokeObjectURL(mp4URL);
  URL.revokeObjectURL(jpgURL);

  const tracks = stream.getTracks();
  tracks.forEach((track) => track.stop());
  stream = null;
};

recordContainer.addEventListener('click', handleReady);
