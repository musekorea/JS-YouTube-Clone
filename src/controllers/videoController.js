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

export const videoWatchController = async (req, res) => {
  const pageTitle = `Watching `;
  const videoID = req.params;
  console.log(videoID);
  const videoDB = await Video.findById(videoID.id).exec();
  console.log(videoDB);
  res.render('watch', { pageTitle, videoDB });
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
  try {
    await Video.create({
      title,
      description,
      hashTags: hashTags.split(',').map((word) => `#${word}`),
    });
    res.redirect('/');
  } catch (error) {
    const errorMessage = error._message;
    res.render('uploadVideo', { errorMessage });
  }
};

export const videoDeleteController = (req, res) => {
  res.send('Delete Video');
};
