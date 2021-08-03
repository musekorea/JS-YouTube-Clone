const recStartBtn = document.querySelector('.videoRecorderContainer');
const preview = document.querySelector('#preview');
console.log(preview);

const handleStart = async () => {
  let stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: { width: 400, height: 240 },
  });
  console.log(stream);
  preview.srcObject = stream;
  preview.play();
};

recStartBtn.addEventListener('click', handleStart);
