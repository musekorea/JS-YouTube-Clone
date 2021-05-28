import express from 'express';
import {
  userEditController,
  userDeleteController,
  logoutController,
  userProfileController,
} from '../controllers/userController';

const userRouter = express.Router();

userRouter.get('/edit', userEditController);
userRouter.get('/delete', userDeleteController);
userRouter.get('/logout', logoutController);
userRouter.get(':id', userProfileController);

export default userRouter;
