import 'regenerator-runtime';
import 'dotenv/config';
import './db.js';
import './models/Video.js';
import './models/User.js';
import './models/Comment.js';
import app from './server';

const PORT = process.env.PORT || 8080;
const handleListening = () => {
  console.log(`Server is listening on Port ${PORT}👵`);
};

app.listen(PORT, handleListening);
