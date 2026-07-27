import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Users, MapPin, ArrowLeft, Share2, Sparkles, Camera, Star, Heart } from 'lucide-react';
import { api } from '../api/axios';

const MemoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [memory, setMemory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchMemory = async () => {
      try {
        const res = await api.get(`/memories/${id}`);
        const found = res.data;
        if (found) {
          setMemory(found);
          // Set dynamic OG meta tags for social sharing
          document.title = `${found.title} — JSC Memories`;
          updateMeta('og:title', found.title);
          updateMeta('og:description', found.description);
          updateMeta('og:image', found.imageUrl || '');
          updateMeta('og:url', window.location.href);
          updateMeta('og:type', 'article');
        }
      } catch (err) {
        console.error('Failed to fetch memory', err);
      }
      setLoading(false);
    };
    fetchMemory();
  }, [id]);

  const updateMeta = (property, content) => {
    if (!content) return;
    let el = document.querySelector(`meta[property="${property}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('property', property);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: memory.title,
          text: memory.description,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch {
        prompt('Copy this link to share:', shareUrl);
      }
    }
  };

  const handleExploreAll = () => {
    navigate('/');
    setTimeout(() => {
      document.getElementById('publicEvents')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full mx-auto mb-4"
          />
          <p className="text-gray-500 font-medium">Loading memory...</p>
        </div>
      </div>
    );
  }

  if (!memory) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center gap-4">
        <Camera className="w-16 h-16 text-amber-300" />
        <h2 className="text-2xl font-bold text-gray-700">Memory not found.</h2>
        <Link to="/" className="text-amber-600 hover:text-amber-700 font-semibold underline">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/40 via-orange-50/20 to-white pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">

        {/* Top Nav */}
        <div className="flex justify-between items-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-amber-700 hover:text-amber-800 font-semibold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <button
            onClick={handleExploreAll}
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold px-5 py-2.5 rounded-full text-sm shadow-md transition-all duration-300"
          >
            Browse All Memories
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
        >
          {/* Warm Islamic Welcome Banner */}
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-6 md:p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg width="100%" height="100%">
                <pattern id="mem-star" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M20 0L25 15L40 20L25 25L20 40L15 25L0 20L15 15Z" fill="#fff" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#mem-star)" />
              </svg>
            </div>
            <Sparkles className="w-8 h-8 text-white/80 mx-auto mb-3 animate-pulse" />
            <h2 className="text-xl md:text-2xl font-bold mb-2">Cherished Memories</h2>
            <p className="text-amber-100 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              Every moment spent in the remembrance of Allah is a blessing. Relive these beautiful
              gatherings of our community.
            </p>
          </div>

          {/* Memory Cover Image */}
          {memory.imageUrl && (
            <div className="w-full relative h-72 md:h-[420px] overflow-hidden">
              <img
                src={memory.imageUrl}
                alt={memory.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h1 className="text-3xl md:text-5xl font-extrabold leading-tight drop-shadow-md">
                  {memory.title}
                </h1>
              </div>
            </div>
          )}

          {/* If no image, show title in header */}
          {!memory.imageUrl && (
            <div className="px-8 md:px-12 pt-8">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">{memory.title}</h1>
            </div>
          )}

          {/* Memory Details */}
          <div className="p-8 md:p-12">
            {/* Info Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pb-8 border-b border-gray-100">
              {/* Date */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 flex-shrink-0">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block">Date</span>
                  <span className="text-gray-900 font-bold text-base">{formatDate(memory.date || memory.createdAt)}</span>
                </div>
              </div>

              {/* Attendees */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 flex-shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block">Attendees</span>
                  <span className="text-gray-900 font-bold text-base">{memory.attendees || 'Community Gathering'}</span>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 flex-shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block">Location</span>
                  <span className="text-gray-900 font-bold text-base">{memory.location || 'JSC'}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Heart className="w-5 h-5 text-amber-500" />
                About this Memory
              </h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line text-base">
                {memory.description}
              </p>
            </div>

            {/* Event Highlights */}
            {memory.eventHighlights && memory.eventHighlights.length > 0 && (
              <div className="mb-8 bg-amber-50/60 rounded-2xl border border-amber-100 p-6">
                <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500" />
                  Event Highlights
                </h4>
                <div className="flex flex-wrap gap-2">
                  {memory.eventHighlights.map((highlight, idx) => (
                    <span
                      key={idx}
                      className="bg-amber-100 text-amber-800 px-3 py-1.5 rounded-xl text-sm font-semibold"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Share Action */}
            <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-gray-100 justify-end">
              <button
                onClick={handleShare}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-3.5 px-8 rounded-2xl shadow-lg transition-all duration-300"
              >
                <Share2 className="w-5 h-5" />
                <span>{copied ? '✓ Link Copied!' : 'Share this Memory'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MemoryDetail;
