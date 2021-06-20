export const joinGetController = (req, res) => {
  res.render('join', { pageTitle: 'Join' });
};
export const joinPostController = (req, res) => {
  console.log(req.body);
  res.end();
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
