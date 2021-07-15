import User from '../models/User.js';
import bcrypt from 'bcrypt';
import fetch from 'node-fetch';

//=============JOIN============================
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
      location,
    });
    res.redirect('/login');
    //이거 그냥 홈으로 보내면 안될까?
  } catch (error) {
    return res.status(400).render('join', {
      pageTitle: 'Join',
      errorMessage: error._message,
    });
  }
};

//============LOGIN===============================//
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
  req.session.isLoggedIn = true;
  req.session.user = user;
  res.redirect('/');
};

//==========GITHUB==========================================
export const startGithubLoginController = (req, res) => {
  const baseURL = `https://github.com/login/oauth/authorize`;
  const config = {
    client_id: '6a927958e6957f67a3a3',
    allow_signup: true,
    scope: `read:user user:email`,
  };
  const params = new URLSearchParams(config).toString();
  const finalURL = `${baseURL}?${params}`;
  console.log(finalURL);
  res.redirect(finalURL);
};
export const finishGithubLoginController = async (req, res) => {
  const config = {
    client_id: '6a927958e6957f67a3a3',
    client_secret: process.env.GithubSecret,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const baseURL = 'https://github.com/login/oauth/access_token';
  const finalURL = `${baseURL}?${params}`;
  const tokenRequest = await fetch(finalURL, {
    method: 'post',
    headers: {
      Accept: 'application/json',
    },
  });
  const json = await tokenRequest.json();
  if ('access_token' in json) {
    const access_token = json.access_token;
    const userRequest = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `token ${access_token}`,
      },
    });
    const userJson = await userRequest.json();
    console.log(userJson);
    const emailRequest = await fetch(`https://api.github.com/user/emails`, {
      headers: {
        Authorization: `token ${access_token}`,
      },
    });
    const emailJson = await emailRequest.json();
    const emailObj = emailJson.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      return res.redirect('/login');
    }
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        name: userJson.name,
        username: userJson.login,
        email: emailObj.email,
        password: '',
        location: userJson.location,
        socialOnly: true,
        avatarURL: userJson.avatar_url,
      });
    }
    req.session.isLoggedIn = true;
    req.session.user = user;
    return res.redirect('/');
  } else {
    return res.redirect('/login');
  }
};

//==========LOGOUT=============================
export const logoutController = (req, res) => {
  req.session.destroy();
  return res.redirect('/');
};

//=========EDIT PROFILE==========================

export const getEditProfileController = (req, res) => {
  res.render('editProfile', { pageTitle: `Edit Profile` });
};

export const postEditProfileController = async (req, res) => {
  const currentUser = req.session.user;
  const { name, email, username, location } = req.body;
  const id = req.session.user._id;

  if (currentUser.username !== username) {
    const existUser = await User.exists({ username });
    if (existUser) {
      req.session.Message = `This username is already taken 🐱‍👤`;
      return res.status(400).redirect('/users/edit');
    }
  }
  if (currentUser.email !== email) {
    const existUser = await User.exists({ email });
    if (existUser) {
      req.session.Message = `This email is already taken 🐱‍👤`;
      return res.status(400).redirect('/users/edit');
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    {
      avatarURL: req.file ? req.file.path : currentUser.avatarURL,
      name,
      email,
      username,
      location,
    },
    { new: true }
  );
  req.session.user = updatedUser;
  req.session.Message = 'Successfully Updated 🐱‍👤';
  res.redirect('/users/edit');
};

//==========CHANGE PASSWORD=======================================

export const getChangePasswordController = (req, res) => {
  if (req.session.user.socialOnly === true) {
    return res.redirect('/');
  }
  return res.render(`user/changePassword`, { pageTitle: `Change Password` });
};
export const postChangePasswordController = async (req, res) => {
  const { oldPwd, newPwd1, newPwd2 } = req.body;
  const { _id: id, password } = req.session.user;
  const ok = await bcrypt.compare(oldPwd, password);
  if (!ok) {
    return res.status(400).render('user/changePassword.pug', {
      pageTitle: `Change Password`,
      errorMessage: 'The current password is incorrect',
    });
  }

  if (newPwd1 !== newPwd2) {
    return res.status(400).render('user/changePassword.pug', {
      pageTitle: `Change Password`,
      errorMessage: 'The password does not match',
    });
  }

  const user = await User.findById(id);
  user.password = newPwd1;
  await user.save();
  req.session.user.password = user.password;

  return res.redirect(`/users/logout`);
};

//===========USER PROFILE===================================
export const getProfileController = async (req, res) => {
  const { id } = req.params;
  const userData = await User.findById(id);
  if (!userData) {
    return res.status(404).render('404', { pageTItle: 'User not found.' });
  }
  res.render('userProfile', {
    pageTitle: `${userData.name}'s Profile`,
    userData,
  });
};
