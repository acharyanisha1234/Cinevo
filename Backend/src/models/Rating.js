import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    movieId: { type: Number, required: true },
    rating: { type: Number, required: true, min: 0.5, max: 5 },
  },
  { timestamps: true }
);

ratingSchema.index({ user: 1, movieId: 1 }, { unique: true });

const Rating = mongoose.model('Rating', ratingSchema);
export default Rating;