import User from '../models/User.js';
import bcrypt from 'bcrypt';

export const joinGetController = (req, res) => {
  res.render('join', { pageTitle: 'Join' });
};
export const joinPostController = async (req, res) => {
  console.log(req.body);
  const { name, username, email, password, password2, location } = req.body;
  if (password != password2) {
    return res.status(400).render('join', {
      pageTitle: 'Join',
      errorMessage: `Password confirmation does not match`,
    });
  }
  const userExists = await User.exists({ $or: [{ username }, { email }] });
  if (userExists) {
    return res.status(400).render('join', {
      pageTitle: 'Join',
      errorMessage: `Username(${username}) or Email(${email})is already taken`,
    });
  }
  try {
    await User.create({
      name,
      username,
      email,
      password,
      password2,
      location,
    });
    res.redirect('/login');
  } catch (error) {
    return res.status(400).render('join', {
      pageTitle: 'Join',
      errorMessage: error._message,
    });
  }
};

export const loginGetController = (req, res) => {
  res.render('login', { pageTitle: 'Login' });
};
export const loginPostController = async (req, res) => {
  console.log(req.body);
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).render('login', {
      pageTitle: 'login',
      errorMessage: 'An account with this username does not exists',
    });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render('login', {
      pageTitle: 'login',
      errorMessage: 'Wrong Password',
    });
  }
  res.redirect('/');
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
