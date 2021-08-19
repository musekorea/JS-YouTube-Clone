import express from 'express';
import {
  getEditProfileController,
  postEditProfileController,
  logoutController,
  startGithubLoginController,
  finishGithubLoginController,
  getChangePasswordController,
  postChangePasswordController,
  getProfileController,
} from '../controllers/userController';
import {
  protectMiddleware,
  publicOnlyMiddleware,
  avatarUploadMiddleware,
  s3DeleteAvatarMiddleware,
} from '../middlewares.js';

const userRouter = express.Router();

userRouter
  .route('/edit')
  .all(protectMiddleware)
  .get(getEditProfileController)
  .post(
    avatarUploadMiddleware.single(`avatar`),
    s3DeleteAvatarMiddleware,
    postEditProfileController
  );
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

userRouter.get('/:id', getProfileController);

export default userRouter;
