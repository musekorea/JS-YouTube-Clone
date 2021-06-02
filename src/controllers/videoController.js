const fakeUser = {
  userName: 'moya',
  isLogined: true,
};
let videoDB = [
  {
    title: '1st Video',
    rating: 5,
    comments: 2,
    createdAt: '2 minutes ago',
    views: 1,
    id: 1,
  },
  {
    title: '2nd Video',
    rating: 5,
    comments: 2,
    createdAt: '2 minutes ago',
    views: 59,
    id: 2,
  },
  {
    title: '3rd Video',
    rating: 5,
    comments: 2,
    createdAt: '2 minutes ago',
    views: 59,
    id: 3,
  },
];

export const homeController = (req, res) => {
  const pageTitle = req.originalUrl;
  res.render('home.pug', { pageTitle, fakeUser, videoDB });
};

export const searchController = (req, res) => {
  res.send('Search Videos');
};

export const videoWatchController = (req, res) => {
  const videoID = req.params.id;
  const video = videoDB[videoID - 1];
  const pageTitle = `Watching ${video.title}`;
  res.render('watch', { pageTitle, fakeUser, video });
};

export const videoGetEditController = (req, res) => {
  const videoID = req.params.id;
  const video = videoDB[videoID - 1];
  const pageTitle = `Edit ${video.title}`;
  res.render('editVideo', { pageTitle, fakeUser, video });
};

export const videoPostEditController = (req, res) => {
  const videoID = req.params.id;
  const video = videoDB[videoID - 1];
  console.log(req.body);
  video.title = req.body.title;
  res.redirect('edit');
};

export const videoGetUploadController = (req, res) => {
  res.render('uploadVideo');
};
export const videoPostUploadController = (req, res) => {
  console.log(req.body);
  const newVideo = {
    title: req.body.title,
    rating: 0,
    comments: 0,
    createdAt: 'just now',
    views: 1,
    id: videoDB.length + 1,
  };
  videoDB.push(newVideo);
  res.redirect('/');
};

export const videoDeleteController = (req, res) => {
  res.send('Delete Video');
};
