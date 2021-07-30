const video = document.querySelector('video');
const play = document.querySelector('#playerPlayBtn');
const mute = document.querySelector('#playerMuteBtn');
const time = document.querySelector('#playerTimeSpan');
const volume = document.querySelector('#playerVolumeRange');
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

play.addEventListener('click', handlePlay);
mute.addEventListener('click', handleMute);
volume.addEventListener('input', handelVolume);
