import Video from '../models/Video.js';

export const homeController = async (req, res) => {
  const pageTitle = req.originalUrl;
  try {
    const videoDB = await Video.find();
    res.render('home.pug', { pageTitle, videoDB });
  } catch (error) {
    res.render('serverError', { error });
  }
};

export const searchController = (req, res) => {
  res.send('Search Videos');
};

export const videoWatchController = (req, res) => {
  const pageTitle = `Watching `;
  res.render('watch', { pageTitle });
};

export const videoGetEditController = (req, res) => {
  const videoID = req.params.id;
  const pageTitle = `Edit`;
  res.render('editVideo', { pageTitle });
};

export const videoPostEditController = (req, res) => {
  const videoID = req.params.id;
  res.redirect('edit');
};

export const videoGetUploadController = (req, res) => {
  res.render('uploadVideo');
};
export const videoPostUploadController = async (req, res) => {
  const { title, description, hashTags } = req.body;
  await Video.create({
    title,
    description,
    createdAt: Date.now(),
    hashTags: hashTags.split(',').map((word) => `#${word}`),
    meta: {
      views: 0,
      rating: 0,
    },
  });
  res.redirect('/');
};

export const videoDeleteController = (req, res) => {
  res.send('Delete Video');
};
