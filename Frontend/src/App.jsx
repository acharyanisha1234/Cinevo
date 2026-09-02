import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoriteContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Movies from './pages/Movies';
import Trending from './pages/Trending';
import Login from './pages/Login';
import Register from './pages/Register';
import MovieDetails from './pages/MovieDetails';
import Search from './pages/Search';
import MyList from './pages/MyList';
import Favorites from './pages/Favorites';
import History from './pages/History';
import Profile from './pages/Profile';
import Watch from './pages/Watch';
import Genre from './pages/Genre';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <div className="min-h-screen bg-black flex flex-col text-white">
          <Navbar />
          <main className="flex-1 pt-16">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected User Routes */}
              <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/movies" element={<ProtectedRoute><Movies /></ProtectedRoute>} />
              <Route path="/trending" element={<ProtectedRoute><Trending /></ProtectedRoute>} />
              <Route path="/movie/:id" element={<ProtectedRoute><MovieDetails /></ProtectedRoute>} />
              <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
              <Route path="/my-list" element={<ProtectedRoute><MyList /></ProtectedRoute>} />
              <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
              <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/watch/:id" element={<ProtectedRoute><Watch /></ProtectedRoute>} />
              <Route path="/genre/:genre" element={<ProtectedRoute><Genre /></ProtectedRoute>} />

              {/* Protected Admin Routes */}
              <Route path="/admin/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

              {/* Catch-all Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;