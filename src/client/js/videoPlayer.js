const video = document.querySelector('video');
const play = document.querySelector('#playerPlayBtn');
const mute = document.querySelector('#playerMuteBtn');
const volume = document.querySelector('#playerVolumeRange');
const totalTime = document.querySelector('#playerTotalTime');
const currentTime = document.querySelector('#playerCurrentTime');
const timeLine = document.querySelector('#timeLine');
const fullScreen = document.querySelector('#playerFullScreen');
const playerWrap = document.querySelector('.playerWrap');

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
  totalTime.innerHTML = timeFormat(Math.floor(video.duration));
  timeLine.max = Math.floor(video.duration);
};

const handleCurrentTime = (e) => {
  currentTime.innerHTML = timeFormat(Math.floor(video.currentTime));
  timeLine.value = Math.floor(video.currentTime);
};

const timeFormat = (time) => {
  if (time < 60 * 60 * 24) {
    return new Date(time * 1000).toISOString().substr(14, 5);
  } else {
    return new Date(time * 1000).toISOString().substr(11, 8);
  }
};

const handleTimeLine = (e) => {
  video.currentTime = e.target.value;
};

const handleFullScreen = (e) => {
  if (document.fullscreenElement === null) {
    playerWrap.requestFullscreen();
    fullScreen.className = `fas fa-compress`;
  } else {
    document.exitFullscreen();
    fullScreen.className = `fas fa-expand`;
  }
};

play.addEventListener('click', handlePlay);
mute.addEventListener('click', handleMute);
volume.addEventListener('input', handelVolume);
video.addEventListener('loadedmetadata', handleMetaData);
video.addEventListener('timeupdate', handleCurrentTime);
timeLine.addEventListener('input', handleTimeLine);
fullScreen.addEventListener('click', handleFullScreen);
