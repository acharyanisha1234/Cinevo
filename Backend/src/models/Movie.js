import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
  {
    tmdbId: { type: Number, required: true, unique: true },
    title: { type: String, required: true, index: true },
    overview: String,
    posterPath: String,
    backdropPath: String,
    releaseDate: String,
    genres: [String],
    runtime: Number,
    rating: Number,
    voteCount: Number,
    trailerUrl: String,
    tagline: String,
    status: { type: String, default: 'Released' },
    videoUrl: String,
    videoType: { type: String, enum: ['mp4', 'hls', 'dash', null], default: null },
    subtitles: [{
      language: String,
      label: String,
      url: String,
    }],
    published: { type: Boolean, default: false, index: true },
    featured: { type: Boolean, default: false, index: true },
    sourceType: { type: String, default: 'user-uploaded' },
  },
  { timestamps: true }
);

const Movie = mongoose.model('Movie', movieSchema);
export default Movie;