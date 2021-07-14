import express from 'express';
import {
  getEditProfileController,
  postEditProfileController,
  logoutController,
  startGithubLoginController,
  finishGithubLoginController,
  getChangePasswordController,
  postChangePasswordController,
} from '../controllers/userController';
import {
  protectMiddleware,
  publicOnlyMiddleware,
  avatarUploadMiddleware,
} from '../middlewares.js';

const userRouter = express.Router();

userRouter
  .route('/edit')
  .all(protectMiddleware)
  .get(getEditProfileController)
  .post(avatarUploadMiddleware.single(`avatar`), postEditProfileController);
userRouter.get('/logout', protectMiddleware, logoutController);
userRouter.get(
  '/github/start',
  publicOnlyMiddleware,
  startGithubLoginController
);
userRouter.get(
  '/github/callback',
  publicOnlyMiddleware,
  finishGithubLoginController
);

userRouter
  .route('/changePassword')
  .all(protectMiddleware)
  .get(getChangePasswordController)
  .post(postChangePasswordController);

export default userRouter;
