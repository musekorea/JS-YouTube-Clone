import express from 'express';
import {
  userEditController,
  userDeleteController,
  logoutController,
  userProfileController,
  startGithubLoginController,
  finishGithubLoginController,
} from '../controllers/userController';

const userRouter = express.Router();

userRouter.get('/edit', userEditController);
userRouter.get('/delete', userDeleteController);
userRouter.get('/logout', logoutController);
userRouter.get('/github/start', startGithubLoginController);
userRouter.get('/github/callback', finishGithubLoginController);
userRouter.get(':id', userProfileController);

export default userRouter;
