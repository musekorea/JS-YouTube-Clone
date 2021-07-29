import Video from '../models/Video.js';
import User from '../models/User.js';

//====================HOME=====================================
export const homeController = async (req, res) => {
  const pageTitle = `Welcome Home`;
  try {
    let videoDB = [];
    videoDB = await Video.find()
      .sort({ createdAt: 'descending' })
      .populate('owner');

    const keyword = req.query.keyword;
    if (keyword) {
      console.log(keyword);
      videoDB = await Video.find({
        title: { $regex: new RegExp(`${keyword}$`, 'i') },
      }).populate('owner');
      return res.render('search', { pageTitle: `Search`, videoDB });
    }

    res.render('home.pug', { pageTitle, videoDB });
  } catch (error) {
    res.status(404).render('serverError', { error });
  }
};

//======================Video Detail=============================
export const videoDetailController = async (req, res) => {
  const pageTitle = `Watching `;
  const videoID = req.params;
  const videoDB = await Video.findById(videoID.id).populate('owner');

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
  const pageTitle = `Edit`;
  if (String(videoDB.owner) !== String(req.session.user._id)) {
    return res.status(403).redirect('/');
  }
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
  const videoDB = await Video.findById(videoID);
  if (String(videoDB.owner) !== String(req.session.user._id)) {
    return res.status(403).redirect('/');
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
  const videoDB = await Video.findById(videoID);
  if (!videoDB) {
    return res.status(404).render('404', { pageTitle: `Video not found.` });
  }
  if (String(videoDB.owner) !== String(req.session.user._id)) {
    return res.status(403).redirect('/');
  }
  const userDB = await User.findById(String(videoDB.owner));
  console.log(userDB.videos);
  await userDB.videos.splice(userDB.videos.indexOf(`ObjectId(${videoID})`), 1);
  await userDB.save();
  await Video.findByIdAndDelete(videoID);
  res.redirect('/');
};
