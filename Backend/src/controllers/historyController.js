import WatchHistory from '../models/WatchHistory.js';

export const getHistory = async (req, res) => {
  const history = await WatchHistory.find({ user: req.user._id }).sort({ lastWatchedAt: -1 });
  res.json({ success: true, data: history });
};

export const updateHistory = async (req, res) => {
  const { movieId, progress, duration } = req.body;
  if (!movieId) return res.status(400).json({ success: false, message: 'movieId required' });
  const userId = req.user._id;
  const entry = await WatchHistory.findOne({ user: userId, movieId });
  if (entry) {
    if (progress !== undefined) entry.progress = progress;
    if (duration) entry.duration = duration;
    entry.lastWatchedAt = new Date();
    await entry.save();
  } else {
    await WatchHistory.create({ user: userId, movieId, progress: progress || 0, duration: duration || 0 });
  }
  res.json({ success: true, message: 'History updated' });
};

export const deleteHistory = async (req, res) => {
  const movieId = parseInt(req.params.movieId);
  await WatchHistory.findOneAndDelete({ user: req.user._id, movieId });
  res.json({ success: true, message: 'History entry removed' });
};