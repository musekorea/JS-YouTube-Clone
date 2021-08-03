const recStartBtn = document.querySelector('.videoRecorderContainer');

const handleStart = async () => {
  let stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
  console.log(stream);
};

recStartBtn.addEventListener('click', handleStart);
