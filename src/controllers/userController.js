import User from '../models/User.js';

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
    res.status(400).render('join', {
      pageTitle: 'Join',
      errorMessage: `Username(${username}) or Email(${email})is already taken`,
    });
  } else {
    await User.create({
      name,
      username,
      email,
      password,
      password2,
      location,
    });
    res.redirect('/login');
  }
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
