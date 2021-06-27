import express from 'express';
import morgan from 'morgan';
import session from 'express-session';
import rootRouter from './routers/rootRouter';
import userRouter from './routers/userRouters';
import videoRouter from './routers/videoRouters';
import { localsMiddleware } from './middlewares';
import MongoStore from 'connect-mongo';

const app = express();

app.use(morgan('dev'));
app.set('view engine', 'pug');
app.set('views', process.cwd() + '/src/views');
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'moya',
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: `mongodb://127.0.0.1:27017/newTube`,
    }),
  })
);
app.use(localsMiddleware);

app.use('/', rootRouter);
app.use('/videos', videoRouter);
app.use('/users', userRouter);

export default app;
