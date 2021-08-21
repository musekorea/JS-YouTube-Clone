import express from 'express';
import morgan from 'morgan';
import session from 'express-session';
import rootRouter from './routers/rootRouter';
import userRouter from './routers/userRouters';
import videoRouter from './routers/videoRouters';
import apiRouter from './routers/apiRouter';
import { localsMiddleware, protectMiddleware } from './middlewares';
import MongoStore from 'connect-mongo';
import flash from 'express-flash';
import cors from 'cors';
import helmet from 'helmet';

const app = express();
//app.use(helmet());
app.use(cors());
app.get(`/videos/upload`, (req, res, next) => {
  console.log('ok');
  res.header('Cross-Origin-Embedder-Policy', 'require-corp');
  res.header('Cross-Origin-Opener-Policy', 'same-origin');
  next();
});
app.use(morgan('dev'));
app.set('view engine', 'pug');
app.set('views', process.cwd() + '/src/views');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());
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

app.use(flash());
app.use(localsMiddleware);
app.use('/uploads', express.static('uploads'));
app.use('/assets', express.static('assets'));
app.use('/', rootRouter);
app.use('/videos', videoRouter);
app.use('/users', userRouter);
app.use('/api', apiRouter);

export default app;
