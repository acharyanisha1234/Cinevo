import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
  {
    tmdbId: { type: Number, required: true, unique: true },
    title: String,
    overview: String,
    posterPath: String,
    backdropPath: String,
    releaseDate: String,
    genres: [String],
    runtime: Number,
    rating: Number,
    trailerUrl: String,
    videoUrl: String,
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Movie = mongoose.model('Movie', movieSchema);
export default Movie;