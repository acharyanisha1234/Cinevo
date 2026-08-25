import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Search, Menu, X, User, LogOut, Film, Home, List, Star, Clock } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/movies', label: 'Movies', icon: Film },
    { to: '/my-list', label: 'My List', icon: List },
    { to: '/favorites', label: 'Favorites', icon: Star },
    { to: '/history', label: 'History', icon: Clock },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/95 shadow-lg' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-3xl font-bold text-red-600 tracking-tight">CINEVO</Link>
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navLinks.map(link => <Link key={link.to} to={link.to} className="text-gray-300 hover:text-white transition">{link.label}</Link>)}
        </div>
        <div className="flex items-center space-x-4">
          <form onSubmit={handleSearch} className="relative hidden md:block">
            <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="bg-black/50 text-white rounded-full py-1 px-4 pr-10 focus:outline-none focus:ring-1 focus:ring-red-600 border border-gray-700" />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"><Search size={18} /></button>
          </form>
          <button className="md:hidden text-gray-300 hover:text-white" onClick={() => setShowSearch(!showSearch)}><Search size={22} /></button>
          {isAuthenticated ? (
            <div className="relative group">
              <button className="flex items-center space-x-2 text-gray-300 hover:text-white">
                <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=red&color=fff&size=32`} alt={user?.name} className="w-8 h-8 rounded-full object-cover" />
                <span className="hidden md:inline">{user?.name}</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-black/95 rounded-md shadow-lg py-1 hidden group-hover:block transition-all">
                <Link to="/profile" className="block px-4 py-2 text-gray-300 hover:bg-red-600 hover:text-white"><User size={16} className="inline mr-2" /> Profile</Link>
                {user?.role === 'admin' && <Link to="/admin" className="block px-4 py-2 text-gray-300 hover:bg-red-600 hover:text-white">Dashboard</Link>}
                <button onClick={logout} className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-red-600 hover:text-white"><LogOut size={16} className="inline mr-2" /> Logout</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="text-gray-300 hover:text-white">Login</Link>
          )}
          <button className="md:hidden text-gray-300 hover:text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>
      {showSearch && (
        <div className="md:hidden px-4 pb-3">
          <form onSubmit={handleSearch} className="relative">
            <input type="text" placeholder="Search movies..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-black/70 text-white rounded-full py-2 px-4 pr-10 focus:outline-none focus:ring-1 focus:ring-red-600 border border-gray-700" />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><Search size={20} /></button>
          </form>
        </div>
      )}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/95 px-4 pb-4 pt-2">
          <div className="flex flex-col space-y-2">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} className="flex items-center space-x-2 text-gray-300 hover:text-white py-2 border-b border-gray-800" onClick={() => setIsMobileMenuOpen(false)}>
                <link.icon size={18} /><span>{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;