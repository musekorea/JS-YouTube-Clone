import express from 'express';
import {
  homeController,
  searchController,
} from '../controllers/videoController';
import {
  joinGetController,
  joinPostController,
  loginController,
} from '../controllers/userController';

const rootRouter = express.Router();

rootRouter.get('/', homeController);
rootRouter.get('/join', joinGetController);
rootRouter.post('/join', joinPostController);

rootRouter.get('/login', loginController);
rootRouter.get('/search', searchController);

export default rootRouter;
