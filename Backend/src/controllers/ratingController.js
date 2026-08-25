import Rating from '../models/Rating.js';

// @desc   Set/update rating
// @route  POST /api/ratings/:movieId
export const setRating = async (req, res) => {
  const movieId = parseInt(req.params.movieId);
  const { rating } = req.body;
  if (!rating || rating < 0.5 || rating > 5) {
    return res.status(400).json({ success: false, message: 'Rating must be between 0.5 and 5' });
  }
  const userId = req.user._id;
  const existing = await Rating.findOne({ user: userId, movieId });
  if (existing) {
    existing.rating = rating;
    await existing.save();
    return res.json({ success: true, message: 'Rating updated' });
  } else {
    await Rating.create({ user: userId, movieId, rating });
    return res.json({ success: true, message: 'Rating added' });
  }
};

// @desc   Get user's rating for a movie
// @route  GET /api/ratings/:movieId
export const getRating = async (req, res) => {
  const movieId = parseInt(req.params.movieId);
  const rating = await Rating.findOne({ user: req.user._id, movieId });
  res.json({ success: true, data: rating ? rating.rating : null });
};