import express from 'express';

const PORT = 8080;
const app = express();

const handleHome = (req, res) => {
  return res.send(`<h1>Hello</h1>`);
};
app.get('/', handleHome);

const handleListening = () => {
  console.log(`Server is listening on Port ${PORT}👵`);
};

app.listen(PORT, handleListening);
