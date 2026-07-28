import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, ArrowLeft, Share2, Sparkles, ExternalLink } from 'lucide-react';
import { api } from '../api/axios';
import dhikr from '../assets/dhikr.jpg';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events`);
        const items = res.data.items || res.data;
        const found = items.find(e => e._id === id);
        if (found) {
          setEvent(found);
          // Set dynamic metadata/OG tags
          document.title = `${found.title} - JSC Events`;
          updateMeta('og:title', found.title);
          updateMeta('og:description', found.description);
          updateMeta('og:image', found.imageUrl || dhikr);
          updateMeta('og:url', window.location.href);
        }
      } catch (err) {
        console.error('Failed to fetch event', err);
      }
      setLoading(false);
    };
    fetchEvent();
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

  const formatTimeTo12Hr = (timeString) => {
    if (!timeString) return '—';
    const parts = timeString.split(':');
    if (parts.length < 2) return timeString;
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedHours = hours < 10 ? '0' + hours : hours;
    return `${formattedHours}:${minutes} ${ampm}`;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Event link copied to clipboard!');
    }
  };

  const handleExploreAll = () => {
    navigate('/');
    setTimeout(() => {
      document.getElementById('upcomingEvents')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  if (loading) {
    return <div className="min-h-screen pt-32 pb-20 text-center text-xl font-semibold text-gray-600">Loading Event Details...</div>;
  }

  if (!event) {
    return <div className="min-h-screen pt-32 pb-20 text-center text-xl font-semibold text-gray-600">Event not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-emerald-50/30 pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-emerald-700 hover:text-emerald-800 font-semibold transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <button
            onClick={handleExploreAll}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-full text-sm shadow-md transition-all duration-300"
          >
            Explore All Events
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
        >
          {/* Islamic Greeting & Welcome Banner */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 md:p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg width="100%" height="100%">
                <pattern id="greet-star" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M20 0L25 15L40 20L25 25L20 40L15 25L0 20L15 15Z" fill="#fff" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#greet-star)" />
              </svg>
            </div>
            <Sparkles className="w-8 h-8 text-amber-300 mx-auto mb-3 animate-pulse" />
            <h2 className="text-xl md:text-2xl font-bold font-serif mb-2 text-white">
              Assalamu Alaikum wa Rahmatullahi wa Barakatuh
            </h2>
            <p className="text-emerald-100 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              We warmly welcome you to this blessed gathering. Join us in these gatherings of knowledge, remembrance, and community fellowship.
            </p>
          </div>

          {/* Event Cover Image */}
          <div className="w-full relative h-72 md:h-[400px] overflow-hidden">
            <img 
              src={event.imageUrl || dhikr} 
              alt={event.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-white drop-shadow-md">
                {event.title}
              </h1>
            </div>
          </div>

          {/* Event Content Details */}
          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-gray-100">
              {/* Date Column */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 flex-shrink-0">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block">Date</span>
                  <span className="text-gray-900 font-bold text-base">
                    {event.date ? new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
                  </span>
                </div>
              </div>

              {/* Time Column */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 flex-shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block">Time</span>
                  <span className="text-gray-900 font-bold text-base">
                    {event.time ? formatTimeTo12Hr(event.time) : 'After Maghrib'}
                  </span>
                </div>
              </div>

              {/* Venue Column */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 flex-shrink-0 mt-0.5">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block">Venue</span>
                  <span className="text-gray-900 font-bold text-base block whitespace-pre-wrap break-words">
                    {event.venue || 'Jeelani Masjid'}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-3">About the Program</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-gray-100">
              {event.venueLocationUrl && (
                <a 
                  href={event.venueLocationUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex-1 min-w-[200px]"
                >
                  <button className="w-full inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg transition-all duration-300 gap-2">
                    <MapPin className="w-5 h-5" />
                    <span>Get Directions / Map</span>
                    <ExternalLink className="w-4 h-4 opacity-75" />
                  </button>
                </a>
              )}
              <button 
                onClick={handleShare}
                className="inline-flex items-center justify-center bg-gray-100 hover:bg-emerald-50 text-emerald-700 font-semibold py-3.5 px-8 rounded-2xl transition-colors border border-gray-200 gap-2 ml-auto"
              >
                <Share2 className="w-5 h-5" />
                <span>Share Event</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EventDetail;
