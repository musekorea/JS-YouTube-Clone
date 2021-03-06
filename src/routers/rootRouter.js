import express from 'express';
import { homeController } from '../controllers/videoController';
import {
  joinGetController,
  joinPostController,
  loginGetController,
  loginPostController,
} from '../controllers/userController';
import { publicOnlyMiddleware } from '../middlewares';

const rootRouter = express.Router();

rootRouter.get('/', homeController);
rootRouter.get('/join', publicOnlyMiddleware, joinGetController);
rootRouter.post('/join', publicOnlyMiddleware, joinPostController);
rootRouter
  .route('/login')
  .all(publicOnlyMiddleware)
  .get(loginGetController)
  .post(loginPostController);

export default rootRouter;
