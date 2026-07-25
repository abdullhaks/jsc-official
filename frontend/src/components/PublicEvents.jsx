import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Camera, Calendar, Users, Heart, Star, MapPin, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { api } from '../api/axios';

const PublicEvents = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [publicEvents, setPublicEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const res = await api.get('/memories?limit=100');
        const items = res.data.items || res.data;
        const mapped = items.map(item => ({
          id: item._id,
          publicEventName: item.title,
          eventImage: item.imageUrl,
          date: item.date || item.createdAt,
          description: item.description,
          attendees: item.attendees || 'Community Gathering',
          location: item.location || 'JSC',
          highlights: item.eventHighlights || []
        }));
        setPublicEvents(mapped);
      } catch (err) {
        console.error('Failed to fetch memories', err);
      }
      setLoading(false);
    };
    fetchMemories();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getGridClass = (index) => {
    // Create dynamic grid layout for collage effect
    const patterns = [
      'md:col-span-2 md:row-span-2', // Large square
      'md:col-span-1 md:row-span-1', // Small square
      'md:col-span-1 md:row-span-2', // Tall rectangle
      'md:col-span-2 md:row-span-1', // Wide rectangle
      'md:col-span-1 md:row-span-1', // Small square
      'md:col-span-1 md:row-span-1', // Small square
    ];
    return patterns[index % patterns.length];
  };

  const getImageHeight = (index) => {
    // Varying heights for collage effect
    const heights = ['h-48 md:h-64', 'h-40 md:h-48', 'h-64 md:h-80', 'h-32 md:h-40', 'h-56 md:h-64', 'h-44 md:h-56'];
    return heights[index % heights.length];
  };

  return (
    <section id="publicEvents" className="py-20 lg:py-32 relative overflow-hidden" ref={containerRef}>
      {/* Multi-layered Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50/30 to-rose-50/50" />
        
        {/* Animated Memory Pattern */}
        <motion.div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f59e0b' fill-opacity='1'%3E%3Cpath d='M40 0L50 30L80 40L50 50L40 80L30 50L0 40L30 30Z' /%3E%3Ccircle cx='40' cy='40' r='15' fill='none' stroke='%23f59e0b' stroke-width='2'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
          animate={{ 
            backgroundPosition: ['0px 0px', '80px 80px'],
            rotate: [0, 360],
          }}
          transition={{ 
            backgroundPosition: { duration: 50, repeat: Infinity, ease: 'linear' },
            rotate: { duration: 100, repeat: Infinity, ease: 'linear' }
          }}
        />

        {/* Floating Memory Icons */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, Math.random() * 40 - 20, 0],
              rotate: [0, 360],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: Math.random() * 12 + 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {i % 4 === 0 ? (
              <Camera className="w-6 h-6 text-amber-400" />
            ) : i % 4 === 1 ? (
              <Heart className="w-5 h-5 text-rose-400" />
            ) : i % 4 === 2 ? (
              <Star className="w-5 h-5 text-orange-400" />
            ) : (
              <Users className="w-6 h-6 text-yellow-400" />
            )}
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16 lg:mb-24"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="inline-flex items-center space-x-2 bg-amber-100/50 backdrop-blur-sm border border-amber-200/50 rounded-full px-6 py-3 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-5 h-5 text-amber-600" />
            <span className="text-amber-700 font-semibold">Cherished Memories</span>
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-amber-700 via-orange-600 to-rose-600 bg-clip-text text-transparent">
              Community
            </span>
            <br />
            <motion.span 
              className="bg-gradient-to-r from-orange-600 via-amber-700 to-orange-800 bg-clip-text text-transparent"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{ backgroundSize: '200% 200%' }}
            >
              Memories & Events
            </motion.span>
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Relive the beautiful moments and meaningful connections we've shared through our 
            community events, celebrations, and gatherings that strengthen our bonds.
          </motion.p>
        </motion.div>

        {/* Events Collage Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 lg:gap-6 auto-rows-max">
          {publicEvents.map((event, index) => (
            <motion.div
              key={index}
              className={`group relative ${getGridClass(index)} cursor-pointer`}
              initial={{ opacity: 0, y: 100, rotate: Math.random() * 10 - 5 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.1,
                type: "spring",
                bounce: 0.3
              }}
              whileHover={{ 
                scale: 1.03,
                rotate: Math.random() * 4 - 2,
                zIndex: 10
              }}
              onClick={() => setSelectedEvent(event)}
            >
              {/* Memory Card */}
              <div className="relative bg-white rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl border-4 border-white group-hover:shadow-2xl transition-all duration-500">
                {/* Polaroid-style top margin */}
                <div className="bg-white p-3 pb-2">
                  <div className={`relative ${getImageHeight(index)} overflow-hidden rounded-xl`}>
                    <motion.img
                      src={event.eventImage}
                      alt={event.publicEventName}
                      className="w-full h-full object-cover object-center"
                      style={{
                        objectFit: 'cover',
                        objectPosition: 'center',
                      }}
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                    {/* Date Badge */}
                    <motion.div
                      className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-gray-800 text-xs font-bold px-2 py-1 rounded-full border"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                    >
                      {new Date(event.date).getDate()}
                    </motion.div>

                    {/* Attendees Badge */}
                    <motion.div
                      className="absolute bottom-3 left-3 flex items-center space-x-1 bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
                    >
                      <Users className="w-3 h-3" />
                      <span>{event.attendees}</span>
                    </motion.div>

                    {/* Heart Icon - Floating */}
                    <motion.div
                      className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity"
                      animate={{
                        y: [0, -5, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Heart className="w-5 h-5 text-red-500 fill-current" />
                    </motion.div>
                  </div>
                </div>

                {/* Polaroid-style caption */}
                <div className="bg-white px-4 pb-4">
                  <motion.h3
                    className="text-sm lg:text-base font-bold text-gray-900 mb-1 line-clamp-1"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.4, duration: 0.5 }}
                  >
                    {event.publicEventName}
                  </motion.h3>
                  
                  <motion.div
                    className="flex items-center space-x-2 text-xs text-gray-500"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.6, duration: 0.5 }}
                  >
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(event.date)}</span>
                  </motion.div>

                  {/* Highlights - Only for larger cards */}
                  {(index === 0 || index === 2) && (
                    <motion.div
                      className="mt-2 space-y-1"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.8, duration: 0.5 }}
                    >
                      <p className="text-xs text-gray-600 line-clamp-2">{event.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {event.highlights.slice(0, 2).map((highlight, i) => (
                          <span key={i} className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full">
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Tape Effect */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-6 bg-yellow-200/60 backdrop-blur-sm border border-yellow-300/50 rounded-sm rotate-12 opacity-70"></div>

                {/* Corner fold effect */}
                <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-gray-200 to-transparent rounded-tr-2xl opacity-50"></div>
              </div>

              {/* Floating sparkles on hover */}
              <motion.div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-amber-400 rounded-full"
                    style={{
                      left: `${20 + i * 30}%`,
                      top: `${20 + i * 25}%`,
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          className="mt-20 lg:mt-32"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {[
              { number: '500+', label: 'Events Organized', icon: <Calendar className="w-6 h-6" /> },
              { number: '2000+', label: 'Community Members', icon: <Users className="w-6 h-6" /> },
              { number: '500+', label: 'Photos Captured', icon: <Camera className="w-6 h-6" /> },
              { number: '100%', label: 'Memorable Moments', icon: <Heart className="w-6 h-6" /> },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <motion.div
                  className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {stat.icon}
                </motion.div>
                <motion.div
                  className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }}
                >
                  {stat.number}
                </motion.div>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16 lg:mt-24"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <motion.button
            className="group inline-flex items-center space-x-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => document.getElementById('upcomingEvents')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Camera className="w-6 h-6" />
            <span>Join Our Next Event</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedEvent(null)}
        >
          <motion.div
            className="relative max-w-xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] border border-gray-100"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center shadow-md hover:bg-black/70 transition-colors font-bold"
            >
              ×
            </button>

            {/* Content Scroll Area */}
            <div className="overflow-y-auto w-full">
              {/* Image */}
              <div className="relative h-56 md:h-64 overflow-hidden">
                <img
                  src={selectedEvent.eventImage}
                  alt={selectedEvent.publicEventName}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Event Location Badge */}
                <div className="absolute bottom-4 left-4 bg-amber-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {selectedEvent.location || 'Community Gathering'}
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                  {selectedEvent.publicEventName}
                </h3>

                <div className="flex flex-wrap items-center gap-4 mb-4 text-xs text-gray-500 font-medium">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4 text-amber-600" />
                    <span>{formatDate(selectedEvent.date)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-orange-600" />
                    <span>{selectedEvent.attendees} Attendees</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {selectedEvent.description}
                </p>

                {/* Highlights */}
                {selectedEvent.highlights && selectedEvent.highlights.length > 0 && (
                  <div className="mb-6 bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                    <h4 className="font-semibold text-gray-900 text-xs uppercase tracking-wider mb-2">Event Highlights</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedEvent.highlights.map((highlight, index) => (
                        <span
                          key={index}
                          className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-lg text-xs font-semibold"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Share Button only */}
                <button 
                  onClick={async () => {
                    if (navigator.share) {
                      try {
                        await navigator.share({
                          title: selectedEvent.publicEventName,
                          text: selectedEvent.description,
                          url: window.location.href,
                        });
                      } catch (error) {
                        console.error('Error sharing:', error);
                      }
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Memory link copied to clipboard!');
                    }
                  }}
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold py-3.5 rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-300 text-sm shadow-md"
                >
                  Share Memory
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default PublicEvents;