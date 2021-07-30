const video = document.querySelector('video');
const play = document.querySelector('#playerPlayBtn');
const mute = document.querySelector('#playerMuteBtn');
const time = document.querySelector('#playerTimeSpan');
const volume = document.querySelector('#playerVolumeRange');

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
    volume.value = 0.5;
  } else {
    video.muted = true;
    mute.className = `fas fa-volume-mute`;
    volume.value = 0;
  }
};

play.addEventListener('click', handlePlay);
mute.addEventListener('click', handleMute);
