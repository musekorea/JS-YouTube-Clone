import express from 'express';
import { homeController } from '../controllers/videoController';
import { joinController, loginController } from '../controllers/userController';

const globalRouter = express.Router();

globalRouter.get('/', homeController);
globalRouter.get('/join', joinController);
globalRouter.get('/login', loginController);

export default globalRouter;
