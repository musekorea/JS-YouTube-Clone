const video = document.querySelector('video');
const play = document.querySelector('#playerPlayBtn');
const mute = document.querySelector('#playerMuteBtn');
const volume = document.querySelector('#playerVolumeRange');
const totalTime = document.querySelector('#playerTotalTime');
const currentTime = document.querySelector('#playerCurrentTime');
console.log(totalTime, currentTime);
let currentVolume;

const handlePlay = (e) => {
  if (video.paused) {
    video.play();
    play.className = `fas fa-pause`;
  } else {
    video.pause();
    play.className = `fas fa-play`;
  }
};

const handleMute = (e) => {
  if (video.muted) {
    video.muted = false;
    mute.className = `fas fa-volume-down`;
    volume.value = currentVolume;
  } else {
    video.muted = true;
    mute.className = `fas fa-volume-mute`;
    volume.value = 0;
  }
};

const handelVolume = (e) => {
  console.log(e.target.value);
  if (video.muted) {
    video.muted = false;
    mute.className = `fas fa-volume-down`;
  }
  if (e.target.value < '0.1') {
    video.muted = true;
    mute.className = `fas fa-volume-mute`;
  }
  video.volume = e.target.value;
  currentVolume = e.target.value;
};
const handleMetaData = (e) => {
  totalTime.innerHTML = Math.floor(video.duration);
};

const handleCurrentTime = (e) => {
  currentTime.innerHTML = Math.floor(video.currentTime);
};

play.addEventListener('click', handlePlay);
mute.addEventListener('click', handleMute);
volume.addEventListener('input', handelVolume);
video.addEventListener('loadedmetadata', handleMetaData);
video.addEventListener('timeupdate', handleCurrentTime);
