import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Calendar, Clock, MapPin, ExternalLink, Sparkles, Users, Star, ArrowRight, Share2 } from 'lucide-react';
import { api } from '../api/axios';
import dhikr from '../assets/dhikr.jpg';

const jeelaniLocation = "https://maps.app.goo.gl/VY6p12Zt2vt8C8W69";
const sjiaLocation = "https://maps.app.goo.gl/tRXGDLnN5P8Ac8z46";

const UpcomingEvents = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const [events, setEvents] = useState([]);
  const [timeLeft, setTimeLeft] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/events?limit=4');
        const fetchedEvents = res.data.items || res.data;
        // Transform the dates to Date objects
        const transformedEvents = fetchedEvents.map(ev => {
          const now = new Date();
          const eventDate = ev.date ? new Date(ev.date) : new Date();
          const isSameDay =
            eventDate.getFullYear() === now.getFullYear() &&
            eventDate.getMonth() === now.getMonth() &&
            eventDate.getDate() === now.getDate();
          
          let computedStatus = 'Upcoming';
          if (isSameDay) computedStatus = 'Ongoing';
          else if (eventDate < now) computedStatus = 'Ended';

          return {
            ...ev,
            dateAndTime: eventDate,
            eventName: ev.title,
            eventPosterImage: ev.imageUrl,
            location: ev.venue || 'Venue',
            locationLink: ev.venueLocationUrl || jeelaniLocation,
            status: computedStatus,
            category: ev.time ? `Time: ${formatTimeTo12Hr(ev.time)}` : 'Event',
          };
        }).sort((a, b) => {
          const now = new Date();
          const diffA = a.dateAndTime - now;
          const diffB = b.dateAndTime - now;
          return diffB > 0 ? (diffA > 0 ? a.dateAndTime - b.dateAndTime : 1) : (diffA > 0 ? -1 : b.dateAndTime - a.dateAndTime);
        });
        setEvents(transformedEvents);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch events", err);
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    if (events.length === 0) return;
    const calculateTimeLeft = () => {
      const now = new Date();
      const updatedTimeLeft = {};
      events.forEach((event, index) => {
        const difference = event.dateAndTime - now;
        if (difference > 0) {
          updatedTimeLeft[index] = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
          };
        } else {
          updatedTimeLeft[index] = null;
        }
      });
      setTimeLeft(updatedTimeLeft);
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [events]);

  const formatTimeTo12Hr = (timeString) => {
    if (!timeString) return '';
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

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };

  return (
    <section id="upcomingEvents" className="py-16 sm:py-20 lg:py-32 relative overflow-hidden" ref={containerRef}>
      {/* Soft Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50/30 to-pink-50/50" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%236366f1' fill-opacity='1'%3E%3Cpath d='M30 0l4 15H15L30 0zm0 60l4-15H15L30 60zM0 30l15 4V15L0 30zm60 0l-15 4V15L60 30z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-12 sm:mb-16 lg:mb-24"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="inline-flex items-center space-x-2 bg-indigo-100/50 backdrop-blur-sm border border-indigo-200/50 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-4 sm:mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 text-indigo-600" />
            <span className="text-indigo-700 font-semibold text-sm sm:text-base">What's Coming</span>
          </motion.div>

          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Upcoming
            </span>
            <br />
            <motion.span 
              className="bg-gradient-to-r from-purple-600 via-indigo-700 to-purple-800 bg-clip-text text-transparent"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{ backgroundSize: '200% 200%' }}
            >
              Events & Programs
            </motion.span>
          </motion.h2>

          {/* ── Recurring Programme Notice Cards ── */}
          <motion.div
            className="max-w-3xl mx-auto mb-12 sm:mb-16 grid grid-cols-1 sm:grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Weekly Notice */}
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-indigo-200/60 shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300">
              {/* Top accent bar */}
              <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500" />
              <div className="p-5">
                {/* Badge */}
                <span className="inline-flex items-center gap-1.5 bg-indigo-100 text-indigo-700 text-[11px] font-semibold px-3 py-1 rounded-full mb-3 tracking-wide uppercase">
                  <Calendar className="w-3 h-3" />
                  Weekly · Every Friday
                </span>
                {/* Title */}
                <h3 className="font-bold text-gray-900 text-base leading-snug mb-2">
                  Swalath Majlis
                </h3>
                {/* Time */}
                <div className="flex items-center gap-2 text-gray-500 text-xs mb-3">
                  <Clock className="w-3.5 h-3.5 flex-shrink-0 text-indigo-400" />
                  <span>After Maghrib Prayers</span>
                </div>
                {/* Location */}
                <div className="flex items-start gap-2 text-gray-600 text-xs mb-4">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-purple-500 mt-0.5" />
                  <span className="leading-relaxed">
                    Jeelani Masjid, Valanchery,<br />Malappuram, Kerala
                  </span>
                </div>
                {/* Map link */}
                <a
                  href={jeelaniLocation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Open in Maps
                </a>
              </div>
            </div>

            {/* Monthly Notice */}
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-200/60 shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300">
              <div className="h-1.5 bg-gradient-to-r from-purple-500 to-pink-500" />
              <div className="p-5">
                <span className="inline-flex items-center gap-1.5 bg-purple-100 text-purple-700 text-[11px] font-semibold px-3 py-1 rounded-full mb-3 tracking-wide uppercase">
                  <Calendar className="w-3 h-3" />
                  Monthly · 2nd Sunday
                </span>
                <h3 className="font-bold text-gray-900 text-base leading-snug mb-2">
                  Swalath Majlis
                </h3>
                <div className="flex items-center gap-2 text-gray-500 text-xs mb-3">
                  <Clock className="w-3.5 h-3.5 flex-shrink-0 text-purple-400" />
                  <span>After Maghrib Prayers</span>
                </div>
                <div className="flex items-start gap-2 text-gray-600 text-xs mb-4">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-pink-500 mt-0.5" />
                  <span className="leading-relaxed">
                    Sheikh Jeelani Islamic Academy,<br />Mankery, Irimbiliyam, Malappuram, Kerala
                  </span>
                </div>
                <a
                  href={sjiaLocation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-800 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Open in Maps
                </a>
              </div>
            </div>

            {/* Warm invite note spanning both columns */}
            <div className="sm:col-span-2 flex items-center gap-3 bg-indigo-50/60 rounded-xl px-5 py-3 border border-indigo-100">
              <Sparkles className="w-4 h-4 text-indigo-500 flex-shrink-0" />
              <p className="text-sm text-indigo-800 leading-relaxed">
                You are warmly invited to join us in these blessed gatherings of remembrance and prayers.
              </p>
            </div>
          </motion.div>

          <motion.p
            className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed mb-12 sm:mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Join our transformative events designed to nurture spiritual growth, expand knowledge,
            and strengthen our community bonds through Islamic teachings and fellowship.
          </motion.p>
        </motion.div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 max-w-4xl mx-auto">
          {events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.3 }}
              className="group relative w-full max-w-md mx-auto sm:max-w-none"
            >
              {/* Main Event Card */}
              <motion.div
                className="relative bg-white/90 rounded-3xl overflow-hidden shadow-2xl border border-white/50"
                whileHover={{ 
                  y: -15,
                  scale: 1.02,
                  rotateX: 5,
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Status Badge */}
                <motion.div
                  className={`absolute top-4 sm:top-6 left-4 sm:left-6 z-20 px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold backdrop-blur-sm ${
                    event.status === 'Registration Open' 
                      ? 'bg-emerald-500/90 text-white' 
                      : 'bg-orange-500/90 text-white'
                  }`}
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  transition={{ delay: index * 0.3 + 0.5, duration: 0.6 }}
                >
                  {event.status}
                </motion.div>

                {/* Category Badge */}
                <motion.div
                  className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20 px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/90 text-white backdrop-blur-sm"
                  initial={{ scale: 0, rotate: 180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  transition={{ delay: index * 0.3 + 0.7, duration: 0.6 }}
                >
                  {event.category}
                </motion.div>

                {/* Image Section with Adaptive Sizing */}
                <div className="relative h-56 sm:h-64 lg:h-80 overflow-hidden">
                  <motion.img
                    src={event.eventPosterImage || dhikr}
                    alt={event.eventName}
                    className="w-full h-full object-cover object-center"
                    style={{
                      objectFit: 'cover',
                      objectPosition: 'center',
                    }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.8 }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Floating Countdown */}
                  {timeLeft[index] && (
                    <motion.div
                      className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.3 + 1, duration: 0.6 }}
                    >
                      <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4">
                        <div className="text-center">
                          <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2">Event Starts In</p>
                          <div className="grid grid-cols-4 gap-1 sm:gap-2 text-center">
                            <div className="bg-indigo-100 rounded-lg p-1 sm:p-2">
                              <div className="text-sm sm:text-lg font-bold text-indigo-700">{timeLeft[index].days}</div>
                              <div className="text-xs text-gray-500">Days</div>
                            </div>
                            <div className="bg-purple-100 rounded-lg p-1 sm:p-2">
                              <div className="text-sm sm:text-lg font-bold text-purple-700">{timeLeft[index].hours}</div>
                              <div className="text-xs text-gray-500">Hours</div>
                            </div>
                            <div className="bg-pink-100 rounded-lg p-1 sm:p-2">
                              <div className="text-sm sm:text-lg font-bold text-pink-700">{timeLeft[index].minutes}</div>
                              <div className="text-xs text-gray-500">Min</div>
                            </div>
                            <div className="bg-orange-100 rounded-lg p-1 sm:p-2">
                              <div className="text-sm sm:text-lg font-bold text-orange-700">{timeLeft[index].seconds}</div>
                              <div className="text-xs text-gray-500">Sec</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {!timeLeft[index] && (
                    <motion.div
                      className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.3 + 1, duration: 0.6 }}
                    >
                      <div className="bg-red-500/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center">
                        <p className="text-white font-semibold text-xs sm:text-sm">Event Has Started/Ended</p>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-4 sm:p-6 lg:p-8">
                  {/* Event Title */}
                  <motion.h3
                    className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 group-hover:text-indigo-700 transition-colors"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.3 + 0.3, duration: 0.6 }}
                  >
                    {event.eventName}
                  </motion.h3>

                  {/* Description */}
                  <motion.p
                    className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4 sm:mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.3 + 0.4, duration: 0.6 }}
                  >
                    {event.description}
                  </motion.p>

                  {/* Event Details */}
                  <motion.div
                    className="space-y-3 sm:space-y-4 mb-4 sm:mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.3 + 0.5, duration: 0.6 }}
                  >
                    <div className="flex items-center space-x-3 text-gray-700">
                      <div className="w-8 sm:w-10 h-8 sm:h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <Calendar className="w-4 sm:w-5 h-4 sm:h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm sm:text-base">{formatDate(event.dateAndTime)}</p>
                      </div>
                    </div>

                    {event.time && (
                      <div className="flex items-center space-x-3 text-gray-700">
                        <div className="w-8 sm:w-10 h-8 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Clock className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm sm:text-base">{formatTimeTo12Hr(event.time)}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-3 text-gray-700">
                      <div className="w-8 sm:w-10 h-8 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <MapPin className="w-4 sm:w-5 h-4 sm:h-5 text-purple-600" />
                      </div>
                      <div>
                        <a 
                          href={event.locationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium hover:text-purple-600 transition-colors flex items-center space-x-1 text-sm sm:text-base"
                        >
                          <span>{event.location}</span>
                          <ExternalLink className="w-4 sm:w-5 h-4 sm:h-5" />
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 text-gray-700">
                      <div className="w-8 sm:w-10 h-8 sm:h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 sm:w-5 h-4 sm:h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm sm:text-base">{event.attendees}</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* CTA Buttons */}
                  <div className="flex space-x-3">
                    <a href={event.locationLink} className="flex-1">
                      <motion.button
                        className="w-full group/btn flex items-center justify-center space-x-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.3 + 0.8, duration: 0.6 }}
                      >
                        <span className="text-sm sm:text-base">Get Location</span>
                        <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 group-hover/btn:translate-x-1 transition-transform" />
                      </motion.button>
                    </a>
                    
                    {/* Share Button */}
                    <motion.button
                      onClick={async () => {
                        const eventUrl = `${window.location.origin}/events/${event._id}`;
                        if (navigator.share) {
                          try {
                            await navigator.share({
                              title: event.eventName,
                              text: event.description,
                              url: eventUrl,
                            });
                          } catch (error) {
                            console.error('Error sharing:', error);
                          }
                        } else {
                          navigator.clipboard.writeText(eventUrl);
                          alert('Event link copied to clipboard!');
                        }
                      }}
                      className="flex items-center justify-center bg-gray-100 hover:bg-indigo-50 text-indigo-600 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.3 + 0.9, duration: 0.6 }}
                    >
                      <Share2 className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-2 -right-2 w-3 sm:w-4 h-3 sm:h-4 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-70" />
                <div className="absolute -bottom-2 -left-2 w-4 sm:w-6 h-4 sm:h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-70" />
              </motion.div>

              {/* Floating Stars */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${20 + i * 30}%`,
                    top: `${10 + i * 20}%`,
                  }}
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 360],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                >
                  <Star className="w-3 sm:w-4 h-3 sm:h-4 text-indigo-400 fill-current" />
                </motion.div>
              ))}
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-12 sm:mt-16 lg:mt-24"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <motion.button
            className="group inline-flex items-center space-x-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Calendar className="w-5 sm:w-6 h-5 sm:h-6" />
            <span className="text-sm sm:text-base">View All Events</span>
            <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default UpcomingEvents;