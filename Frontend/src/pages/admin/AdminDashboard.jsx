import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Plus, Edit, Trash2, Eye, EyeOff, Star } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddMovie, setShowAddMovie] = useState(false);
  const [searchTmdbQuery, setSearchTmdbQuery] = useState('');
  const [tmdbResults, setTmdbResults] = useState([]);
  const [tmdbLoading, setTmdbLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [formData, setFormData] = useState({
    videoUrl: '',
    videoType: 'mp4',
    featured: false,
  });
  const [notification, setNotification] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, moviesRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/movies'),
      ]);
      setStats(statsRes.data.data);
      setMovies(moviesRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const searchTmdb = async (e) => {
    e.preventDefault();
    if (!searchTmdbQuery.trim()) return;

    setTmdbLoading(true);
    try {
      const res = await api.get('/movies/search', { params: { q: searchTmdbQuery, page: 1 } });
      setTmdbResults(res.data.data.results || []);
    } catch (error) {
      console.error('Error searching TMDB:', error);
      showNotification('Error searching movies');
    } finally {
      setTmdbLoading(false);
    }
  };

  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
    setFormData({ videoUrl: '', videoType: 'mp4', featured: false });
    setTmdbResults([]);
    setSearchTmdbQuery('');
  };

  const handleAddMovie = async (e) => {
    e.preventDefault();
    if (!selectedMovie || !formData.videoUrl.trim()) {
      showNotification('Please select a movie and provide a video URL');
      return;
    }

    try {
      const res = await api.post('/admin/movies', {
        tmdbId: selectedMovie.id,
        videoUrl: formData.videoUrl,
        videoType: formData.videoType,
        featured: formData.featured,
      });

      setMovies([res.data.data, ...movies]);
      setSelectedMovie(null);
      setFormData({ videoUrl: '', videoType: 'mp4', featured: false });
      setShowAddMovie(false);
      showNotification('Movie added successfully');
      fetchData();
    } catch (error) {
      console.error('Error adding movie:', error);
      showNotification(error.response?.data?.message || 'Error adding movie');
    }
  };

  const handleDeleteMovie = async (movieId) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) return;

    try {
      await api.delete(`/admin/movies/${movieId}`);
      setMovies(movies.filter(m => m._id !== movieId));
      showNotification('Movie deleted successfully');
    } catch (error) {
      console.error('Error deleting movie:', error);
      showNotification('Error deleting movie');
    }
  };

  const togglePublished = async (movieId, currentState) => {
    try {
      // Update endpoint - we'll need to add this to the backend
      const movie = movies.find(m => m._id === movieId);
      const res = await api.put(`/admin/movies/${movieId}`, {
        published: !currentState,
      });
      setMovies(movies.map(m => m._id === movieId ? res.data.data : m));
      showNotification(`Movie ${!currentState ? 'published' : 'unpublished'}`);
    } catch (error) {
      console.error('Error updating movie:', error);
      showNotification('Error updating movie');
    }
  };

  const toggleFeatured = async (movieId, currentState) => {
    try {
      const res = await api.put(`/admin/movies/${movieId}`, {
        featured: !currentState,
      });
      setMovies(movies.map(m => m._id === movieId ? res.data.data : m));
      showNotification(`Movie ${!currentState ? 'marked as' : 'unmarked from'} featured`);
    } catch (error) {
      console.error('Error updating movie:', error);
      showNotification('Error updating movie');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6 text-white bg-black min-h-screen">
      {/* Notification */}
      {notification && (
        <div className="fixed top-20 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
          {notification}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Admin Dashboard</h2>
          <p className="text-gray-400">Manage Cinevo content and users</p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-linear-to-br from-red-600 to-red-800 p-6 rounded-lg">
              <p className="text-gray-200 text-sm">Total Users</p>
              <p className="text-4xl font-bold mt-2">{stats.totalUsers}</p>
            </div>
            <div className="bg-linear-to-br from-blue-600 to-blue-800 p-6 rounded-lg">
              <p className="text-gray-200 text-sm">Movies in DB</p>
              <p className="text-4xl font-bold mt-2">{stats.totalMoviesInDb}</p>
            </div>
            <div className="bg-linear-to-br from-purple-600 to-purple-800 p-6 rounded-lg">
              <p className="text-gray-200 text-sm">Watchlist Items</p>
              <p className="text-4xl font-bold mt-2">{stats.totalWatchlistItems}</p>
            </div>
            <div className="bg-linear-to-br from-yellow-600 to-yellow-800 p-6 rounded-lg">
              <p className="text-gray-200 text-sm">Total Ratings</p>
              <p className="text-4xl font-bold mt-2">{stats.totalRatings}</p>
            </div>
          </div>
        )}

        {/* Recent Users */}
        {stats && stats.recentUsers && stats.recentUsers.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Recent Users</h3>
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              {stats.recentUsers.map(user => (
                <div key={user._id} className="border-b border-gray-800 p-4 flex justify-between items-center hover:bg-gray-800 transition">
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-gray-400">{user.email}</p>
                  </div>
                  <span className="text-sm text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Movies Management */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Manage Movies</h3>
            <button
              onClick={() => setShowAddMovie(!showAddMovie)}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition font-semibold"
            >
              <Plus size={20} /> Add Movie
            </button>
          </div>

          {/* Add Movie Form */}
          {showAddMovie && (
            <div className="bg-gray-900 rounded-lg p-6 mb-8 border border-gray-800">
              <h4 className="text-lg font-bold mb-4">Add New Movie</h4>

              {!selectedMovie ? (
                <form onSubmit={searchTmdb} className="mb-6">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={searchTmdbQuery}
                      onChange={(e) => setSearchTmdbQuery(e.target.value)}
                      placeholder="Search TMDB for movies..."
                      className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                    <button
                      type="submit"
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                    >
                      Search
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mb-6 p-4 bg-gray-800 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {selectedMovie.posterPath && (
                      <img
                        src={`https://image.tmdb.org/t/p/w92${selectedMovie.posterPath}`}
                        alt={selectedMovie.title}
                        className="w-12 h-16 rounded object-cover"
                      />
                    )}
                    <div>
                      <p className="font-semibold">{selectedMovie.title}</p>
                      <p className="text-sm text-gray-400">
                        {new Date(selectedMovie.releaseDate).getFullYear()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedMovie(null)}
                    className="text-gray-400 hover:text-white transition"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* TMDB Search Results */}
              {tmdbResults.length > 0 && !selectedMovie && (
                <div className="mb-6">
                  <p className="text-sm text-gray-400 mb-3">Found {tmdbResults.length} results</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                    {tmdbResults.map(movie => (
                      <button
                        key={movie.id}
                        onClick={() => handleSelectMovie(movie)}
                        className="bg-gray-800 hover:bg-gray-700 p-3 rounded-lg text-left transition"
                      >
                        {movie.posterPath && (
                          <img
                            src={`https://image.tmdb.org/t/p/w154${movie.posterPath}`}
                            alt={movie.title}
                            className="w-full h-auto rounded mb-2 object-cover"
                          />
                        )}
                        <p className="font-semibold text-sm line-clamp-1">{movie.title}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(movie.releaseDate).getFullYear()}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Video URL Form */}
              {selectedMovie && (
                <form onSubmit={handleAddMovie}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Video URL</label>
                      <input
                        type="url"
                        value={formData.videoUrl}
                        onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                        placeholder="https://example.com/movie.mp4"
                        className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Video Type</label>
                      <select
                        value={formData.videoType}
                        onChange={(e) => setFormData({ ...formData, videoType: e.target.value })}
                        className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                      >
                        <option value="mp4">MP4</option>
                        <option value="hls">HLS</option>
                        <option value="dash">DASH</option>
                      </select>
                    </div>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-sm">Mark as Featured</span>
                    </label>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                      >
                        Add Movie
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedMovie(null);
                          setFormData({ videoUrl: '', videoType: 'mp4', featured: false });
                        }}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {tmdbLoading && (
                <p className="text-center text-gray-400">Searching...</p>
              )}
            </div>
          )}

          {/* Movies Table */}
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            {movies.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                No movies added yet. Click "Add Movie" to get started.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800 bg-gray-800">
                      <th className="px-6 py-4 text-left text-sm font-semibold">Movie</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Release Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Rating</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Video</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movies.map(movie => (
                      <tr key={movie._id} className="border-b border-gray-800 hover:bg-gray-800 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {movie.posterPath && (
                              <img
                                src={`https://image.tmdb.org/t/p/w92${movie.posterPath}`}
                                alt={movie.title}
                                className="w-8 h-12 rounded object-cover"
                              />
                            )}
                            <div>
                              <p className="font-semibold">{movie.title}</p>
                              <p className="text-xs text-gray-400">TMDB ID: {movie.tmdbId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {new Date(movie.releaseDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <Star size={16} className="text-yellow-400 fill-yellow-400" />
                            <span className="text-sm">{movie.rating?.toFixed(1)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {movie.videoUrl ? (
                            <span className="bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-xs">
                              Available
                            </span>
                          ) : (
                            <span className="bg-red-900/30 text-red-400 px-3 py-1 rounded-full text-xs">
                              Missing
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => togglePublished(movie._id, movie.published)}
                              className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                                movie.published
                                  ? 'bg-green-900/30 text-green-400'
                                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                              }`}
                              title={movie.published ? 'Published' : 'Draft'}
                            >
                              {movie.published ? 'Published' : 'Draft'}
                            </button>
                            {movie.featured && (
                              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-900/30 text-yellow-400">
                                Featured
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            {movie.featured ? (
                              <button
                                onClick={() => toggleFeatured(movie._id, true)}
                                className="p-2 hover:bg-gray-700 rounded transition text-yellow-400"
                                title="Remove from featured"
                              >
                                <Star size={16} fill="currentColor" />
                              </button>
                            ) : (
                              <button
                                onClick={() => toggleFeatured(movie._id, false)}
                                className="p-2 hover:bg-gray-700 rounded transition text-gray-400 hover:text-yellow-400"
                                title="Mark as featured"
                              >
                                <Star size={16} />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteMovie(movie._id)}
                              className="p-2 hover:bg-red-900/30 rounded transition text-red-400"
                              title="Delete movie"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;