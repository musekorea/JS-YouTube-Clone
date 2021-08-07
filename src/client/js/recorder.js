import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const actionBtn = document.querySelector('.videoRecorderContainer');
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
  actionBtn.classList.add('active');
  actionBtn.style.backgroundColor = `red`;

  stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: { width: 350, height: 240 },
  });
  if (stream) {
    console.log(stream);
    readySpan.classList.add('hide');
    startSpan.classList.remove('hide');
    actionBtn.removeEventListener('click', handleReady);
    actionBtn.addEventListener('click', handleStartRecord);
    preview.srcObject = stream;
    preview.play();
  }
};

const handleStartRecord = () => {
  console.log('start record');
  startSpan.classList.add('hide');
  stopSpan.classList.remove('hide');
  actionBtn.style.backgroundColor = `green`;
  actionBtn.classList.remove('active');
  preview.classList.add('recording');
  actionBtn.removeEventListener('click', handleStartRecord);
  actionBtn.addEventListener('click', handleStopRecord);
  recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
  recorder.start();
};

const handleStopRecord = () => {
  console.log('stop record');
  stopSpan.classList.add('hide');
  actionBtn.style.backgroundColor = `steelblue`;
  actionBtn.removeEventListener('click', handleStopRecord);
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

  preview.classList.remove('recording');
  finalSpan.classList.remove('hide');

  downloadFile(mp4URL, 'myRecording.mp4');
  downloadFile(jpgURL, 'MyThumbnail.jpg');

  ffmpeg.FS('unlink', files.input);
  ffmpeg.FS('unlink', files.output);
  ffmpeg.FS('unlink', files.thumb);

  URL.revokeObjectURL(mp4URL);
  URL.revokeObjectURL(jpgURL);

  const tracks = stream.getTracks();
  console.log(tracks);
  tracks.forEach((track) => track.stop());
  stream = null;
};

actionBtn.addEventListener('click', handleReady);
