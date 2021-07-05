import express from 'express';
import {
  getEditProfileController,
  postEditProfileController,
  userDeleteController,
  logoutController,
  userProfileController,
  startGithubLoginController,
  finishGithubLoginController,
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
userRouter.get('/delete', userDeleteController);
userRouter.get(':id', userProfileController);

export default userRouter;
