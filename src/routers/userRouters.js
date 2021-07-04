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

const userRouter = express.Router();

userRouter
  .route('/edit')
  .get(getEditProfileController)
  .post(postEditProfileController);
userRouter.get('/delete', userDeleteController);
userRouter.get('/logout', logoutController);
userRouter.get('/github/start', startGithubLoginController);
userRouter.get('/github/callback', finishGithubLoginController);
userRouter.get(':id', userProfileController);

export default userRouter;
