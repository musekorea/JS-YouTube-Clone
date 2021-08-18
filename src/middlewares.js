import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';

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
    bucket: 'clonetubetest',
    acl: 'public-read',
  }),
  acl: 'public-read',
});
export const videoUploadMiddleware = multer({
  dest: `uploads/videos/`,
  limits: { fileSize: 10485760 },
  storage: multerS3({
    s3: s3,
    bucket: 'clonetubetest',
    acl: 'public-read',
  }),
});
