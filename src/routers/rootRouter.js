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
import { publicOnlyMiddleware } from '../middlewares';
import { get } from 'mongoose';

const rootRouter = express.Router();

rootRouter.get('/', homeController);
rootRouter.get('/join', publicOnlyMiddleware, joinGetController);
rootRouter.post('/join', publicOnlyMiddleware, joinPostController);
rootRouter
  .route('/login')
  .all(publicOnlyMiddleware)
  .get(loginGetController)
  .post(loginPostController);
rootRouter.get('/search', searchController);

export default rootRouter;
