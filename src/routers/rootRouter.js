import express from 'express';
import {
  homeController,
  searchController,
} from '../controllers/videoController';
import {
  joinGetController,
  joinPostController,
  loginGetController,
  loginPostController,
} from '../controllers/userController';
import { get } from 'mongoose';

const rootRouter = express.Router();

rootRouter.get('/', homeController);
rootRouter.get('/join', joinGetController);
rootRouter.post('/join', joinPostController);
rootRouter.route('/login').get(loginGetController).post(loginPostController);
rootRouter.get('/search', searchController);

export default rootRouter;
