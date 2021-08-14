import Video from '../models/Video.js';
import User from '../models/User.js';
import Comment from '../models/Comment.js';

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
  const videoDB = await Video.findById(videoID.id)
    .populate('owner')
    .populate({
      path: 'comments',
      options: { sort: { createdAt: 'descending' } },
    });

  //console.log(videoDB);
  if (videoDB) {
    //console.log(videoDB);
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
    req.flash('error', `You're not the owner of the video`);
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
  const videoFile = req.files.video;
  const thumbFile = req.files.thumb;
  console.log(thumbFile[0].path);
  console.log(videoFile[0].path);
  const { title, description, hashTags } = req.body;
  try {
    const newVideo = await Video.create({
      title,
      description,
      videoURL: videoFile[0].path,
      thumbURL: thumbFile[0].path,
      hashTags: Video.formatHashTags(hashTags),
      owner: ownerID,
    });
    const user = await User.findById(ownerID).populate('videos');
    await user.videos.push(newVideo._id);
    await user.save();
    req.flash('success', 'Upload OK');
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
//==========VIEWS CONTROLLER=======================//
export const videoViewsController = async (req, res) => {
  const videoID = req.body.videoID;
  const videoData = await Video.findById(videoID);
  if (!videoData) {
    return res.sendStatus(404);
  }
  console.log(videoData);
  videoData.meta.views = videoData.meta.views + 1;
  await videoData.save();
  return res.status(200).end();
};
//==========COMMENT CONTROLLER===================//

export const commentController = async (req, res) => {
  const commentText = req.body.text;
  const videoID = req.params.id;
  const userID = req.session.user._id;
  console.log(userID);
  const video = await Video.findById(videoID).populate('owner');
  if (!video) {
    return res.sendStatus(404);
  }
  const user = await User.findById(userID);
  const comment = await Comment.create({
    text: commentText,
    owner: user._id,
    video: videoID,
    avatarURL: user.avatarURL,
    username: user.name,
  });
  video.comments.push(comment._id);
  user.comments.push(comment._id);
  await video.save();
  await user.save();
  return res.status(201).json(comment);
};
//======DELETE COMMENT==================
export const deleteCommentController = async (req, res) => {
  const commentID = req.params.id;
  const delComment = await Comment.findByIdAndDelete(commentID);
  return res.sendStatus(200);
};
