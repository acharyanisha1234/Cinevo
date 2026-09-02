# 🎬 Cinevo - Modern Movie Streaming Platform

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4.4.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.0-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TMDB](https://img.shields.io/badge/TMDB-API-01D277?logo=themoviedatabase&logoColor=white)](https://www.themoviedb.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📖 Overview

Cinevo is a modern, full-featured movie streaming platform built with React and Vite. It uses **The Movie Database (TMDB) API** for movie data including posters, backdrops, ratings, and cast information. The application provides users with a seamless experience to browse movies, add favorites, track watch history, and share movies with friends.

**Live Demo:** [Coming Soon](#)

---

## 🎬 TMDB Integration

### What is TMDB?
The Movie Database (TMDB) is a community-built movie and TV database. Every piece of data has been added by our amazing community dating back to 2008. TMDB's powerful API allows us to fetch:

- **Movie Details**: Titles, overviews, release dates, ratings
- **Images**: Posters, backdrops, and profile images
- **Cast & Crew**: Actor information and crew details
- **Genres**: Movie categorization
- **Trending**: Current trending movies
- **Popular**: Most popular movies
- **Top Rated**: Highest rated movies
- **Now Playing**: Currently in theaters
- **Upcoming**: Future releases

### How We Use TMDB

#### 1. Poster Images
```javascript
// TMDB Image Base URL
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const TMDB_BACKDROP_BASE = 'https://image.tmdb.org/t/p/w1280';

// Constructing image URL
const posterUrl = `${TMDB_IMAGE_BASE}${movie.poster_path}`;
const backdropUrl = `${TMDB_BACKDROP_BASE}${movie.backdrop_path}`;
