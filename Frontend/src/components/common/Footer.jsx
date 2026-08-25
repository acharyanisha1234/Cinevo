import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-black text-gray-400 py-8 border-t border-gray-800">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div><h3 className="text-red-600 text-2xl font-bold mb-4">CINEVO</h3><p className="text-sm">Your ultimate streaming destination.</p></div>
        <div><h4 className="text-white font-semibold mb-3">Browse</h4><ul className="space-y-2 text-sm"><li><Link to="/movies" className="hover:text-white">Movies</Link></li><li><Link to="/trending" className="hover:text-white">Trending</Link></li><li><Link to="/popular" className="hover:text-white">Popular</Link></li></ul></div>
        <div><h4 className="text-white font-semibold mb-3">Your Account</h4><ul className="space-y-2 text-sm"><li><Link to="/profile" className="hover:text-white">Profile</Link></li><li><Link to="/my-list" className="hover:text-white">My List</Link></li><li><Link to="/history" className="hover:text-white">History</Link></li></ul></div>
        <div><h4 className="text-white font-semibold mb-3">Support</h4><ul className="space-y-2 text-sm"><li><a href="#" className="hover:text-white">Help</a></li><li><a href="#" className="hover:text-white">Privacy</a></li><li><a href="#" className="hover:text-white">Terms</a></li></ul></div>
      </div>
      <div className="border-t border-gray-800 mt-6 pt-4 text-center text-xs">&copy; {new Date().getFullYear()} Cinevo. All rights reserved.</div>
    </div>
  </footer>
);

export default Footer;