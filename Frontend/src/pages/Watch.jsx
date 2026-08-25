import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { getMovieDetails } from '../services/movieService';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Watch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await getMovieDetails(id);
        setMovie(res.data.data);
        const historyRes = await api.get('/history');
        const entry = historyRes.data.data.find(h => h.movieId === parseInt(id));
        if (entry) setProgress(entry.progress || 0);
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchMovie();
  }, [id]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current && !videoRef.current.paused) {
        const currentTime = videoRef.current.currentTime;
        const duration = videoRef.current.duration;
        api.post('/history', { movieId: parseInt(id), progress: Math.floor(currentTime), duration: Math.floor(duration) }).catch(console.error);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [id]);

  const handleLoadedMetadata = () => {
    if (videoRef.current && progress > 0) videoRef.current.currentTime = progress;
  };

  if (loading) return <LoadingSpinner />;
  if (!movie) return <div className="text-white p-8">Movie not found</div>;
  const videoSrc = movie.videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4';

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="relative bg-black flex-1 flex items-center justify-center">
        <video ref={videoRef} src={videoSrc} className="w-full max-h-screen" controls autoPlay onLoadedMetadata={handleLoadedMetadata} />
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 text-white bg-black/50 rounded-full p-2 hover:bg-red-600 transition">✕</button>
      </div>
    </div>
  );
};

export default Watch;