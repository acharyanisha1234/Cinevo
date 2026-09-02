import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Movie from './models/Movie.js';

dotenv.config();

// Sample public MP4 video streams for testing video playback
const sampleMovies = [
  {
    tmdbId: "550", // Fight Club
    title: "Fight Club",
    overview: "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into something much more.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    posterPath: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    backdropPath: "/hZkgoQY85wUODBDR2b0Y3BI3wW1.jpg",
    rating: 8.4,
    published: true
  },
  {
    tmdbId: "27205", // Inception
    title: "Inception",
    overview: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    posterPath: "/oYuLEW9W2B432PlvWbH7T8xWyFi.jpg",
    backdropPath: "/8ZTVqvKDQ8emSGUEMjsS4yHAVaw.jpg",
    rating: 8.4,
    published: true
  },
  {
    tmdbId: "157336", // Interstellar
    title: "Interstellar",
    overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    posterPath: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdropPath: "/xJHokMbljvjADYdit5fKSuVQwio.jpg",
    rating: 8.4,
    published: true
  },
  {
    tmdbId: "299536", // Avengers: Infinity War
    title: "Avengers: Infinity War",
    overview: "The Avengers and their allies must be willing to sacrifice all in an attempt to defeat the powerful Thanos.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    posterPath: "/7WsyChLLEzFiDOVTGfaZaE3zRBV.jpg",
    backdropPath: "/mMg270K7r0I7Vq0n0R6Sj0bV.jpg",
    rating: 8.3,
    published: true
  },
  {
    tmdbId: "1066262", // The Movie displayed on TMDB Home trending
    title: "Cinevo Featured Stream",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    published: true
  }
];

const seedMovies = async () => {
  try {
    await connectDB();
    console.log('Database connected for movie seeding...');

    for (const movieData of sampleMovies) {
      await Movie.findOneAndUpdate(
        { tmdbId: String(movieData.tmdbId) },
        { ...movieData, tmdbId: String(movieData.tmdbId) },
        { upsert: true, new: true }
      );
      console.log(`Seeded movie: ${movieData.title || movieData.tmdbId}`);
    }

    console.log('Successfully seeded playable movies into MongoDB!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedMovies();