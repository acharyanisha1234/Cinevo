import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { normalizeMovie } from '../services/api';

const FavoritesContext = createContext(null);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('cinevo_token');

      if (token) {
        const res = await api.get('/favorites');
        console.log('Favorites API response:', res.data);
        
        const rawList = res.data?.data || res.data?.favorites || [];
        const normalized = rawList.map(normalizeMovie).filter(Boolean);
        
        console.log('Normalized favorites:', normalized);
        
        setFavorites(normalized);
        setFavoriteIds(normalized.map((m) => String(m.id)));
        
        // Also store in localStorage for offline access
        localStorage.setItem('cinevo_favorites_data', JSON.stringify(normalized));
        localStorage.setItem('cinevo_favorites', JSON.stringify(normalized.map((m) => String(m.id))));
      } else {
        // Try to get from localStorage if no token
        const localFavs = JSON.parse(localStorage.getItem('cinevo_favorites_data') || '[]');
        const localIds = JSON.parse(localStorage.getItem('cinevo_favorites') || '[]');
        
        console.log('Loading favorites from localStorage:', localFavs);
        
        if (localFavs.length > 0) {
          setFavorites(localFavs);
          setFavoriteIds(localIds.map(String));
        } else {
          setFavoriteIds(localIds.map(String));
        }
      }
    } catch (err) {
      console.warn('Backend favorites fetch issue, using local storage cache:', err);
      const localFavs = JSON.parse(localStorage.getItem('cinevo_favorites_data') || '[]');
      const localIds = JSON.parse(localStorage.getItem('cinevo_favorites') || '[]');
      
      if (localFavs.length > 0) {
        setFavorites(localFavs);
        setFavoriteIds(localIds.map(String));
      } else {
        setFavoriteIds(localIds.map(String));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const isFavorite = (movieId) => {
    if (!movieId) return false;
    return favoriteIds.includes(String(movieId));
  };

  const toggleFavorite = async (movie) => {
    if (!movie) return;
    
    console.log('Toggling favorite for movie:', movie);
    
    // Normalize the movie object
    const targetMovie = normalizeMovie(movie);
    if (!targetMovie) {
      console.error('Failed to normalize movie:', movie);
      return;
    }
    
    console.log('Normalized movie:', targetMovie);
    
    const idStr = String(targetMovie.id);
    
    // Check if movie exists in favorites
    const exists = favoriteIds.includes(idStr);
    let updatedIds = [];
    let updatedList = [];

    if (exists) {
      // Remove from favorites
      updatedIds = favoriteIds.filter((id) => id !== idStr);
      updatedList = favorites.filter((m) => String(m.id) !== idStr);
      console.log('Removed from favorites:', idStr);
    } else {
      // Add to favorites
      updatedIds = [...favoriteIds, idStr];
      updatedList = [...favorites, targetMovie];
      console.log('Added to favorites:', targetMovie);
    }

    // Update state
    setFavoriteIds(updatedIds);
    setFavorites(updatedList);
    
    // Store in localStorage
    localStorage.setItem('cinevo_favorites', JSON.stringify(updatedIds));
    localStorage.setItem('cinevo_favorites_data', JSON.stringify(updatedList));

    console.log('Updated favorites list:', updatedList);
    console.log('Updated favorite IDs:', updatedIds);

    // Sync with backend if logged in
    const token = localStorage.getItem('cinevo_token');
    if (token) {
      try {
        await api.post('/favorites/toggle', { 
          movieId: idStr,
          movieData: targetMovie
        });
        console.log('Successfully synced with backend');
      } catch (err) {
        console.error('Failed to sync favorite with backend:', err);
      }
    }
  };

  const value = {
    favorites,
    favoriteIds,
    loading,
    isFavorite,
    toggleFavorite,
    refreshFavorites: fetchFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    console.warn('useFavorites must be used within a FavoritesProvider');
    return {
      favorites: [],
      favoriteIds: [],
      loading: false,
      isFavorite: () => false,
      toggleFavorite: () => {},
      refreshFavorites: () => {},
    };
  }
  return context;
};