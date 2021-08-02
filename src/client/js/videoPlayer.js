const video = document.querySelector('video');
const play = document.querySelector('#playerPlayBtn');
const mute = document.querySelector('#playerMuteBtn');
const volume = document.querySelector('#playerVolumeRange');
const totalTime = document.querySelector('#playerTotalTime');
const currentTime = document.querySelector('#playerCurrentTime');
const timeLine = document.querySelector('#timeLine');
const fullScreen = document.querySelector('#playerFullScreen');
const playerWrap = document.querySelector('.playerWrap');
const controllers = document.querySelector('.player-controllers');

let currentVolume;
let viewsCheck;
let playingTimeCheck = 0;

const handlePlay = (e) => {
  if (video.paused) {
    video.play();
    play.className = `fas fa-pause`;
    viewsCheck = setInterval(() => {
      if (playingTimeCheck === Math.floor(video.duration * 0.01)) {
        console.log(`view+1`);
        const videoID = document.location.href.split('/')[4];
        console.log(videoID);
        fetch(`/api/videos/views`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ videoID }),
        });
        clearInterval(viewsCheck);
        viewsCheck = null;
      } else {
        console.log(`playTIME`, playingTimeCheck);
        playingTimeCheck++;
      }
    }, 1000);
  } else {
    video.pause();
    clearInterval(viewsCheck);
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

let timeoutCheck = null;
let mouseStopCheck = null;

const handleMouseMove = (e) => {
  if (timeoutCheck) {
    clearTimeout(timeoutCheck);
    timeoutCheck = null;
  }
  if (mouseStopCheck) {
    clearTimeout(mouseStopCheck);
    mouseStopCheck = null;
  }
  if (video.paused) {
    return;
  }
  mouseStopCheck = setTimeout(() => {
    controllers.classList.add('hide');
  }, 3000);
  controllers.classList.remove('hide');
};

const handleMouseLeave = (e) => {
  if (video.paused) {
    return;
  } else {
    timeoutCheck = setTimeout(() => {
      controllers.classList.add('hide');
    }, 3000);
  }
};

const keyboardShortcut = (e) => {
  if (e.code === 'Space' && video.paused) {
    play.className = `fas fa-pause`;
    video.play();
  } else if (e.code === 'Space' && !video.paused) {
    video.pause();
    play.className = `fas fa-play`;
  } else if (
    (e.code === 'Enter' || e.code === 'NumpadEnter') &&
    document.fullscreenElement === null
  ) {
    fullScreen.className = `fas fa-compress`;
    playerWrap.requestFullscreen();
  } else {
    fullScreen.className = `fas fa-expand`;
    document.exitFullscreen();
  }
};

const handleClickPlay = () => {
  if (video.paused) {
    video.play();
    play.className = `fas fa-pause`;
  } else {
    video.pause();
    play.className = `fas fa-play`;
  }
};

play.addEventListener('click', handlePlay);
mute.addEventListener('click', handleMute);
volume.addEventListener('input', handelVolume);
video.addEventListener('loadedmetadata', handleMetaData);
video.addEventListener('timeupdate', handleCurrentTime);
timeLine.addEventListener('input', handleTimeLine);
fullScreen.addEventListener('click', handleFullScreen);
playerWrap.addEventListener('mousemove', handleMouseMove);
playerWrap.addEventListener('mouseleave', handleMouseLeave);
document.addEventListener('keydown', keyboardShortcut);
video.addEventListener('click', handleClickPlay);
