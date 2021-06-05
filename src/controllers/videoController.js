import Video from '../models/Video.js';

export const homeController = (req, res) => {
  const pageTitle = req.originalUrl;
  Video.find({}, (error, videos) => {});
  res.render('home.pug', { pageTitle });
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
export const videoPostUploadController = (req, res) => {
  res.redirect('/');
};

export const videoDeleteController = (req, res) => {
  res.send('Delete Video');
};
