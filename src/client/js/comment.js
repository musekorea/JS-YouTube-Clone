const playerWrap = document.querySelector('.playerWrap');
const textarea = document.querySelector('textarea');
const commentRendering = document.querySelector('.commentRendering');
let delBtns = document.querySelectorAll('#delBtn');
console.log(delBtns);
let commentUserInfos = document.querySelectorAll('.commentUserInfo');

//==============ADD REALTIME===============================
const addRealtimeComment = (res) => {
  const commentID = res._id;
  const commentUserInfo = document.createElement('div');
  commentUserInfo.className = `commentUserInfo`;
  commentUserInfo.dataset.commentid = commentID;
  const img = document.createElement('img');
  img.src = `${res.avatarURL}`;
  commentUserInfo.appendChild(img);
  const div = document.createElement('div');
  commentUserInfo.appendChild(div);
  const span = document.createElement('span');
  span.innerHTML = `${res.username}`;
  div.appendChild(span);
  const small = document.createElement('small');
  small.innerHTML = `${String(res.createdAt).substring(0, 10)}`;
  div.appendChild(small);
  const button = document.createElement('button');
  button.className = `delBtn`;
  button.id = `delBtn`;
  button.innerHTML = `delete`;
  div.appendChild(button);
  const p = document.createElement('p');
  p.innerHTML = `${res.text}`;
  p.className = `comment`;
  div.appendChild(p);
  commentRendering.prepend(commentUserInfo);
};

//============SUBMIT====================================
const handleSubmit = async (e) => {
  e.preventDefault();
  const commentForm = document.querySelector('#commentForm');
  const textarea = commentForm.querySelector('textarea');
  const text = textarea.value;
  const videoID = playerWrap.dataset.videoid;
  if (text === '') {
    return;
  }
  const response = await fetch(`/api/videos/${videoID}/comment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  const resJSON = await response.json();
  console.log(resJSON._id);
  if (response.status === 201) {
    addRealtimeComment(resJSON);
  }
  textarea.value = '';

  delBtns = document.querySelectorAll('#delBtn');
  delBtns.forEach((delbtn) => {
    delbtn.addEventListener('click', handleDelete);
  });
};

//=============TEXTAREA HEIGHT=======================
function handleTextareaHeight(e) {
  if (textarea.scrollHeight === 36) {
    return;
  }
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
}
//=================DELETE REALTIME====================
const realtimeDelete = (commentID) => {
  commentUserInfos = document.querySelectorAll('.commentUserInfo');
  commentUserInfos.forEach((target) => {
    if (target.dataset.commentid === commentID) {
      return target.remove();
    }
  });
};
//=================DELETE COMMENT======================
const handleDelete = async (e) => {
  const commentID = e.path[2].dataset.commentid;
  console.log(commentID);
  const delFetch = await fetch(`/api/videos/${commentID}/delete`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  console.log(delFetch);

  if (delFetch.status === 200) {
    realtimeDelete(commentID);
  }
};

//============EVENT LISTENER==========================
if (commentForm) {
  commentForm.addEventListener('submit', handleSubmit);
}
textarea.addEventListener('keyup', handleTextareaHeight);
delBtns.forEach((delbtn) => {
  delbtn.addEventListener('click', handleDelete);
});
