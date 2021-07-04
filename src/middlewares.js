export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = 'newTube';
  res.locals.isLoggedIn = Boolean(req.session.isLoggedIn);
  res.locals.loggedInUser = req.session.user || {};
  //console.log(res.locals);
  next();
};
