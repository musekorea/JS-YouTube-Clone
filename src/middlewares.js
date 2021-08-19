import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
import Video from './models/Video.js';

const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = 'newTube';
  res.locals.isLoggedIn = Boolean(req.session.isLoggedIn);
  res.locals.loggedInUser = req.session.user || {};

  next();
};

export const protectMiddleware = (req, res, next) => {
  if (req.session.isLoggedIn) {
    return next();
  } else {
    req.flash('error', 'Need to Login');
    res.redirect('/login');
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return next();
  } else {
    req.flash('error', `You're already logged in`);
    res.redirect('/');
  }
};

export const avatarUploadMiddleware = multer({
  dest: `uploads/avatars/`,
  limits: { fileSize: 3145728 },
  storage: multerS3({
    s3: s3,
    bucket: 'clonetubetest/images',
    acl: 'public-read',
  }),
  acl: 'public-read',
});
export const videoUploadMiddleware = multer({
  dest: `uploads/videos/`,
  limits: { fileSize: 10485760 },
  storage: multerS3({
    s3: s3,
    bucket: 'clonetubetest/videos',
    acl: 'public-read',
  }),
});

export const s3DeleteAvatarMiddleware = (req, res, next) => {
  if (!req.file || !req.session.user.avatarURL) {
    return next();
  }
  s3.deleteObject(
    {
      Bucket: `clonetubetest`,
      Key: `images/${req.session.user.avatarURL.split('/')[4]}`,
    },
    (err, data) => {
      if (err) {
        throw err;
      }
      console.log(`s3 deleteObject`, data);
    }
  );
  next();
};

export const s3DeleteVideoMiddleware = async (req, res, next) => {
  const videoDB = await Video.findById(req.params.id);
  const video = videoDB.videoURL.split('/')[4];
  const thumb = videoDB.thumbURL.split('/')[4];

  const params = {
    Bucket: `clonetubetest`,
    Delete: {
      Objects: [{ Key: `videos/${video}` }, { Key: `videos/${thumb}` }],
    },
  };
  s3.deleteObjects(params, (err, data) => {
    if (err) console.log(err, err.stack);
    else console.log(`success`, data);
  });

  next();
};
