import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, LogOut, Heart, Home, Film, TrendingUp, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-red-600 text-2xl font-bold">CINEVO</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-red-500 transition-colors flex items-center gap-2">
              <Home size={18} />
              Home
            </Link>
            <Link to="/movies" className="text-white hover:text-red-500 transition-colors flex items-center gap-2">
              <Film size={18} />
              Movies
            </Link>
            <Link to="/trending" className="text-white hover:text-red-500 transition-colors flex items-center gap-2">
              <TrendingUp size={18} />
              Trending
            </Link>
            <Link to="/favorites" className="text-white hover:text-red-500 transition-colors flex items-center gap-2">
              <Heart size={18} />
              Favorites
            </Link>
          </div>

          {/* Search and Auth */}
          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-neutral-900 text-white px-4 py-2 rounded-full text-sm w-48 focus:w-64 transition-all duration-300 border border-neutral-700 focus:border-red-500 focus:outline-none"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                <Search size={18} className="text-neutral-400" />
              </button>
            </form>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 text-white hover:text-red-500 transition-colors"
                >
                  <User size={20} />
                  <span className="text-sm">{user.username || user.email}</span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-neutral-900 border border-neutral-800 rounded-lg shadow-lg py-2">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-white hover:bg-neutral-800 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/favorites"
                      className="block px-4 py-2 text-sm text-white hover:bg-neutral-800 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Favorites
                    </Link>
                    <Link
                      to="/history"
                      className="block px-4 py-2 text-sm text-white hover:bg-neutral-800 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      History
                    </Link>
                    <hr className="border-neutral-800 my-2" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-neutral-800 transition-colors"
                    >
                      <LogOut size={16} className="inline mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white hover:text-red-500 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/95 border-b border-neutral-800 py-4 px-4">
          <div className="flex flex-col space-y-4">
            <Link
              to="/"
              className="text-white hover:text-red-500 transition-colors flex items-center gap-3"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home size={20} />
              Home
            </Link>
            <Link
              to="/movies"
              className="text-white hover:text-red-500 transition-colors flex items-center gap-3"
              onClick={() => setIsMenuOpen(false)}
            >
              <Film size={20} />
              Movies
            </Link>
            <Link
              to="/trending"
              className="text-white hover:text-red-500 transition-colors flex items-center gap-3"
              onClick={() => setIsMenuOpen(false)}
            >
              <TrendingUp size={20} />
              Trending
            </Link>
            <Link
              to="/favorites"
              className="text-white hover:text-red-500 transition-colors flex items-center gap-3"
              onClick={() => setIsMenuOpen(false)}
            >
              <Heart size={20} />
              Favorites
            </Link>

            <form onSubmit={handleSearch} className="relative mt-2">
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-900 text-white px-4 py-2 rounded-full text-sm border border-neutral-700 focus:border-red-500 focus:outline-none"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                <Search size={18} className="text-neutral-400" />
              </button>
            </form>

            {user ? (
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-400 transition-colors flex items-center gap-3"
              >
                <LogOut size={20} />
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-center font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;