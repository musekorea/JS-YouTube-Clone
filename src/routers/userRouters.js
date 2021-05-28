import express from 'express';
import {
  userEditController,
  userDeleteController,
} from '../controllers/userControllers';

const userRouter = express.Router();

userRouter.get('/edit', userEditController);
userRouter.get('/delete', userDeleteController);

export default userRouter;
