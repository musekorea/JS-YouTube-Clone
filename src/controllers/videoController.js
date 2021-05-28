export const homeController = (req, res) => {
  res.send('Home Page');
};

export const searchController = (req, res) => {
  res.send('Search Videos');
};

export const videoWatchController = (req, res) => {
  res.send('Watch Video');
};

export const videoEditController = (req, res) => {
  res.send('Edit Video');
};

export const videoUploadController = (req, res) => {
  res.send('Upload Video');
};

export const videoDeleteController = (req, res) => {
  res.send('Delete Video');
};
