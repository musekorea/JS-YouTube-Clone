const playerWrap = document.querySelector('.playerWrap');

const handleSubmit = (e) => {
  e.preventDefault();
  const commentForm = document.querySelector('#commentForm');
  const textarea = commentForm.querySelector('textarea');
  const text = textarea.value;
  const videoID = JSON.parse(playerWrap.dataset.video)._id;
  if (text === '') {
    return;
  }
  fetch(`/api/videos/${videoID}/comment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  textarea.value = '';
};

if (commentForm) {
  commentForm.addEventListener('submit', handleSubmit);
}

const textarea = document.querySelector('textarea');

function handleTextareaHeight(e) {
  if (textarea.scrollHeight === 36) {
    return;
  }
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
}

textarea.addEventListener('keyup', handleTextareaHeight);
