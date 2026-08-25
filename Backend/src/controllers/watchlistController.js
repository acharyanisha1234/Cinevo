import User from '../models/User.js';

// @desc   Get user's watchlist
// @route  GET /api/watchlist
export const getWatchlist = async (req, res) => {
  const user = await User.findById(req.user._id).select('watchlist');
  res.json({ success: true, data: user.watchlist });
};

// @desc   Add movie to watchlist
// @route  POST /api/watchlist/:movieId
export const addToWatchlist = async (req, res) => {
  const movieId = parseInt(req.params.movieId);
  const user = await User.findById(req.user._id);

  if (user.watchlist.some(item => item.movieId === movieId)) {
    return res.status(400).json({ success: false, message: 'Movie already in watchlist' });
  }

  user.watchlist.push({ movieId });
  await user.save();
  res.json({ success: true, message: 'Added to watchlist' });
};

// @desc   Remove from watchlist
// @route  DELETE /api/watchlist/:movieId
export const removeFromWatchlist = async (req, res) => {
  const movieId = parseInt(req.params.movieId);
  const user = await User.findById(req.user._id);
  user.watchlist = user.watchlist.filter(item => item.movieId !== movieId);
  await user.save();
  res.json({ success: true, message: 'Removed from watchlist' });
};