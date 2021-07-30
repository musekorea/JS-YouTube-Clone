const video = document.querySelector('video');
const play = document.querySelector('#playerPlayBtn');
const mute = document.querySelector('#playerMuteBtn');
const time = document.querySelector('#playerTimeSpan');
const volume = document.querySelector('#playerVolumeRange');
console.log(video, play, mute, time, volume);

const handlePlay = (e) => {
  play.classList;
  if (video.paused) {
    video.play();
    play.className = `fas fa-pause`;
  } else {
    video.pause();
    play.className = `fas fa-play`;
  }
};
const handleMute = (e) => {};

play.addEventListener('click', handlePlay);
mute.addEventListener('click', handleMute);
