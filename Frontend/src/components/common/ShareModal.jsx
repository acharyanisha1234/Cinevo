import React, { useState, useEffect } from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { MdEmail, MdContentCopy, MdCheck } from 'react-icons/md';
import { IoShareSocial } from 'react-icons/io5';
import { FiX } from 'react-icons/fi';

const ShareModal = ({ isOpen, onClose, movie, url }) => {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    if (movie) {
      const movieUrl = url || `${window.location.origin}/movie/${movie.id}`;
      setShareUrl(movieUrl);
    }
  }, [movie, url]);

  if (!isOpen) return null;

  const shareData = {
    title: movie?.title || 'Cinevo Movie',
    text: `Watch "${movie?.title}" on Cinevo! ${movie?.overview?.slice(0, 100)}...`,
    url: shareUrl,
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareData.text)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareData.text}\n${shareUrl}`)}`,
    instagram: `https://www.instagram.com/`,
    email: `mailto:?subject=${encodeURIComponent(`Watch "${movie?.title}" on Cinevo`)}&body=${encodeURIComponent(`${shareData.text}\n\n${shareUrl}`)}`,
    copy: shareUrl,
  };

  const handleShare = (platform) => {
    if (platform === 'copy') {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
      return;
    }

    if (platform === 'instagram') {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        alert('Link copied to clipboard! Open Instagram and share it in your story or post.');
      });
      return;
    }

    if (platform === 'facebook' || platform === 'twitter' || platform === 'whatsapp' || platform === 'email') {
      window.open(shareLinks[platform], '_blank', 'width=600,height=400');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareData.title,
          text: shareData.text,
          url: shareUrl,
        });
        onClose();
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Share error:', err);
        }
      }
    }
  };

  const shareOptions = [
    { id: 'facebook', label: 'Facebook', icon: FaFacebook, color: 'bg-[#1877F2] hover:bg-[#1877F2]/80' },
    { id: 'twitter', label: 'Twitter', icon: FaTwitter, color: 'bg-[#000000] hover:bg-[#000000]/80' },
    { id: 'whatsapp', label: 'WhatsApp', icon: FaWhatsapp, color: 'bg-[#25D366] hover:bg-[#25D366]/80' },
    { id: 'instagram', label: 'Instagram', icon: FaInstagram, color: 'bg-[#E4405F] hover:bg-[#E4405F]/80' },
    { id: 'email', label: 'Email', icon: MdEmail, color: 'bg-[#EA4335] hover:bg-[#EA4335]/80' },
    { id: 'copy', label: copied ? 'Copied!' : 'Copy Link', icon: copied ? MdCheck : MdContentCopy, color: 'bg-neutral-700 hover:bg-neutral-600' },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      
      <div 
        className="relative w-full max-w-md bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <IoShareSocial size={20} className="text-red-500" />
            <h2 className="text-lg font-bold text-white">Share</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-800 rounded-full transition-colors"
          >
            <FiX size={20} className="text-neutral-400 hover:text-white" />
          </button>
        </div>

        {movie && (
          <div className="flex items-center gap-3 p-4 bg-neutral-800/50">
            <img
              src={movie.posterPath}
              alt={movie.title}
              className="w-12 h-16 object-cover rounded"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/100x150/1a1a1a/ffffff?text=No+Poster';
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate">{movie.title}</p>
              <p className="text-sm text-neutral-400 truncate">{movie.year || 'N/A'}</p>
            </div>
          </div>
        )}

        <div className="p-4">
          <p className="text-sm text-neutral-400 mb-4">Share this movie with your friends</p>
          
          <div className="grid grid-cols-3 gap-3">
            {shareOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleShare(option.id)}
                className={`
                  flex flex-col items-center gap-2 p-3 rounded-xl transition-all
                  ${option.color}
                  text-white
                `}
              >
                <option.icon size={24} />
                <span className="text-xs font-medium">{option.label}</span>
              </button>
            ))}
          </div>

          {navigator.share && (
            <button
              onClick={handleNativeShare}
              className="w-full mt-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <IoShareSocial size={20} />
              Share via...
            </button>
          )}

          <div className="mt-4 flex items-center gap-2 bg-neutral-800 rounded-lg p-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 bg-transparent text-sm text-neutral-300 outline-none px-2"
            />
            <button
              onClick={() => handleShare('copy')}
              className="p-2 hover:bg-neutral-700 rounded-lg transition-colors"
            >
              {copied ? (
                <MdCheck size={16} className="text-green-500" />
              ) : (
                <MdContentCopy size={16} className="text-neutral-400" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;