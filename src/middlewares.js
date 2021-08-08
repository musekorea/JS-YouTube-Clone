import multer from 'multer';

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
});
export const videoUploadMiddleware = multer({
  dest: `uploads/videos/`,
  limits: { fileSize: 10485760 },
});
