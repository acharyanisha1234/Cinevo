import User from '../models/User.js';
import Movie from '../models/Movie.js';

// @desc    Get user's favorited movies
// @route   GET /api/favorites
// @access  Private
export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }

    const favIds = user.favorites || [];
    const validMongoIds = favIds.filter((id) => typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/));

    const movies = await Movie.find({
      $or: [{ _id: { $in: validMongoIds } }, { tmdbId: { $in: favIds } }],
    }).lean();

    res.status(200).json({ success: true, favoriteIds: favIds, data: movies });
  } catch (error) {
    console.error('Error in getFavorites:', error);
    res.status(500).json({ success: false, message: 'Error retrieving user favorites.' });
  }
};

// @desc    Add or remove a movie from user's favorites
// @route   POST /api/favorites/toggle
// @access  Private
export const toggleFavorite = async (req, res) => {
  try {
    const { movieId } = req.body;
    if (!movieId) {
      return res.status(400).json({ success: false, message: 'movieId is required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }

    const targetId = String(movieId);
    const index = user.favorites.indexOf(targetId);

    let isFavorite = false;
    if (index > -1) {
      user.favorites.splice(index, 1);
    } else {
      user.favorites.push(targetId);
      isFavorite = true;
    }

    await user.save();
    res.status(200).json({ success: true, isFavorite, favorites: user.favorites });
  } catch (error) {
    console.error('Error in toggleFavorite:', error);
    res.status(500).json({ success: false, message: 'Error updating favorite status.' });
  }
};