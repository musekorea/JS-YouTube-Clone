export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = 'newTube';
  res.locals.isLoggedIn = Boolean(req.session.isLoggedIn);
  res.locals.loggedInUser = req.session.user || {};
  //console.log(res.locals);
  next();
};

export const protectMiddleware = (req, res, next) => {
  if (req.session.isLoggedIn) {
    return next();
  } else {
    res.redirect('/login');
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return next();
  } else {
    res.redirect('/');
  }
};
