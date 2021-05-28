import express from 'express';
import {
  homeController,
  searchController,
} from '../controllers/videoController';
import { joinController, loginController } from '../controllers/userController';

const globalRouter = express.Router();

globalRouter.get('/', homeController);
globalRouter.get('/join', joinController);
globalRouter.get('/login', loginController);
globalRouter.get('/search', searchController);

export default globalRouter;
