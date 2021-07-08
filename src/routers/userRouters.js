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
import { protectMiddleware, publicOnlyMiddleware } from '../middlewares';

const userRouter = express.Router();

userRouter
  .route('/edit')
  .all(protectMiddleware)
  .get(getEditProfileController)
  .post(postEditProfileController);
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
