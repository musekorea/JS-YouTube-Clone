import User from '../models/User.js';

export const joinGetController = (req, res) => {
  res.render('join', { pageTitle: 'Join' });
};
export const joinPostController = async (req, res) => {
  console.log(req.body);
  const { name, username, email, password, location } = req.body;
  await User.create({
    name,
    username,
    email,
    password,
    location,
  });
  res.redirect('/login');
};

export const loginController = (req, res) => {
  res.send('Login');
};

export const logoutController = (req, res) => {
  res.send('Logout');
};

export const userProfileController = (req, res) => {
  res.send('User Profile');
};

export const userEditController = (req, res) => {
  res.send('Edit User');
};

export const userDeleteController = (req, res) => {
  res.send('Delete User');
};
