import express from 'express';
import morgan from 'morgan';
import session from 'express-session';
import rootRouter from './routers/rootRouter';
import userRouter from './routers/userRouters';
import videoRouter from './routers/videoRouters';
import { localsMiddleware, protectMiddleware } from './middlewares';
import MongoStore from 'connect-mongo';

const app = express();

app.use(morgan('dev'));
app.set('view engine', 'pug');
app.set('views', process.cwd() + '/src/views');
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {}, //no option
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
    }),
  })
);
app.use(localsMiddleware);
app.use('/uploads', express.static('uploads'));
app.use('/', rootRouter);
app.use('/videos', videoRouter);
app.use('/users', userRouter);

export default app;
