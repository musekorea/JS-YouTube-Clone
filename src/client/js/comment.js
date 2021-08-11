const playerWrap = document.querySelector('.playerWrap');

const handleSubmit = (e) => {
  e.preventDefault();
  const commentForm = document.querySelector('#commentForm');
  const textarea = commentForm.querySelector('textarea');
  const text = textarea.value;
  const videoID = JSON.parse(playerWrap.dataset.video)._id;
  fetch(`/api/videos/${videoID}/comment`, {
    method: 'POST',
    body: { text },
  });
};

if (commentForm) {
  commentForm.addEventListener('submit', handleSubmit);
}
