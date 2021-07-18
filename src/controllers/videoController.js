import Video from '../models/Video.js';
import User from '../models/User.js';

//====================HOME=====================================
export const homeController = async (req, res) => {
  const pageTitle = `Welcome Home`;
  try {
    const videoDB = await Video.find().sort({ createdAt: 'descending' });
    res.render('home.pug', { pageTitle, videoDB });
  } catch (error) {
    res.status(404).render('serverError', { error });
  }
};

//==================SEARCH=====================================
export const searchController = async (req, res) => {
  const { keyword } = req.query;
  let videoDB = [];
  if (keyword) {
    console.log(keyword);
    videoDB = await Video.find({
      title: {
        $regex: new RegExp(`${keyword}$`, 'i'),
      },
    });
  }
  res.render('search', { pageTitle: `Search`, videoDB });
};

//======================PROFILE===================================
export const videoDetailController = async (req, res) => {
  const pageTitle = `Watching `;
  const videoID = req.params;
  const videoDB = await Video.findById(videoID.id).populate('owner');
  console.log(typeof videoDB.owner._id);
  console.log(typeof res.locals.loggedInUser.id);

  if (videoDB) {
    res.render('videoDetail', { pageTitle, videoDB });
  } else {
    res
      .status(404)
      .render('status404', { pageTitle: `404 error! Video not found` });
  }
};

//======================EDIT=================================
export const videoGetEditController = async (req, res) => {
  const videoID = req.params.id;
  const videoDB = await Video.findById(videoID);
  console.log(videoDB);
  const pageTitle = `Edit`;
  if (!videoDB) {
    return res
      .status(404)
      .render('status404', { pageTitle: 'Video not found!' });
  } else {
    return res.render('editVideo', {
      pageTitle: `Edit: ${videoDB.title}`,
      videoDB,
    });
  }
};

export const videoPostEditController = async (req, res) => {
  console.log(req.body);
  const videoID = req.params.id;
  const videoExist = await Video.exists({ _id: videoID });
  if (!videoExist) {
    return res
      .status(404)
      .render('status404', { pageTitle: 'Video not found!' });
  }
  const { title, description, hashTags } = req.body;
  await Video.findByIdAndUpdate(videoID, {
    title,
    description,
    hashTags: Video.formatHashTags(hashTags),
  });
  res.redirect('edit');
};

//==================UPLOAD=================================
export const videoGetUploadController = (req, res) => {
  const pageTitle = `Upload Video`;
  res.render('uploadVideo', { pageTitle });
};
export const videoPostUploadController = async (req, res) => {
  const ownerID = req.session.user._id;
  const videoFile = req.file;
  const { title, description, hashTags } = req.body;
  try {
    const newVideo = await Video.create({
      title,
      description,
      fileURL: videoFile.path,
      hashTags: Video.formatHashTags(hashTags),
      owner: ownerID,
    });
    const user = await User.findById(ownerID).populate('videos');
    await user.videos.push(newVideo._id);
    await user.save();

    res.redirect('/');
  } catch (error) {
    const errorMessage = error._message;
    res.status(400).render('uploadVideo', { errorMessage });
  }
};

//===============DELETE=====================================
export const videoDeleteController = async (req, res) => {
  const videoID = req.params.id;
  console.log(videoID);
  await Video.findByIdAndDelete(videoID);
  res.redirect('/');
};
