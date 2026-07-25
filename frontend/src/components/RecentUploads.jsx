import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Play, ExternalLink, Youtube, Instagram, Eye, Heart, Share2, Clock, Sparkles, ArrowRight } from 'lucide-react';
import { api } from '../api/axios';

const RecentUploads = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  useEffect(() => {
    const fetchLatestContent = async () => {
      try {
        const res = await api.get('/latest-content?limit=100');
        const items = res.data.items || res.data;
        const mapped = items.map(item => ({
          title: item.title,
          link: item.contentUrl || '#',
          thumbnail: item.imageUrl,
          platform: item.type || 'youtube',
          views: item.views ? `${item.views} views` : '',
          uploadDate: item.date ? new Date(item.date).toLocaleDateString() : new Date(item.createdAt).toLocaleDateString(),
          description: item.description,
          category: 'Latest'
        }));
        setUploads(mapped);
      } catch (err) {
        console.error('Failed to fetch latest content', err);
      }
      setLoading(false);
    };
    fetchLatestContent();
  }, []);

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'youtube':
        return <Youtube className="w-5 h-5 text-red-500" />;
      case 'instagram':
        return <Instagram className="w-5 h-5 text-pink-500" />;
      default:
        return <Play className="w-5 h-5 text-blue-500" />;
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Spiritual': 'from-purple-500 to-indigo-500',
      'Educational': 'from-blue-500 to-cyan-500',
      'Islamic': 'from-emerald-500 to-teal-500',
      'Youth': 'from-orange-500 to-pink-500',

    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  return (
    <section id="recentUploads" className="py-20 lg:py-32 relative overflow-hidden">
      {/* Multi-layered Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/50" />
        
        {/* Animated Tech Pattern */}
        <motion.div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%232563eb' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='8' fill='none' stroke='%232563eb' stroke-width='2'/%3E%3Cpath d='M30 10L40 20L30 30L20 20Z M30 50L40 40L30 30L20 40Z' /%3E%3Cpath d='M10 30L20 40L30 30L20 20Z M50 30L40 40L30 30L40 20Z' /%3E%3C/g%3E%3C/svg%3E")`,
          }}
          animate={{ 
            backgroundPosition: ['0px 0px', '60px 60px'],
            opacity: [0.03, 0.08, 0.03],
          }}
          transition={{ 
            backgroundPosition: { duration: 25, repeat: Infinity, ease: 'linear' },
            opacity: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
          }}
        />

        {/* Floating Media Icons */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, Math.random() * 30 - 15, 0],
              rotate: [0, 360],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: Math.random() * 8 + 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {i % 3 === 0 ? (
              <Play className="w-6 h-6 text-blue-400" />
            ) : i % 3 === 1 ? (
              <Youtube className="w-6 h-6 text-red-400" />
            ) : (
              <Instagram className="w-6 h-6 text-pink-400" />
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
            className="inline-flex items-center space-x-2 bg-blue-100/50 backdrop-blur-sm border border-blue-200/50 rounded-full px-6 py-3 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span className="text-blue-700 font-semibold">Latest Content</span>
          </motion.div>

          <motion.h2
            className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <motion.span 
                          className="bg-gradient-to-r from-yellow-500 via-fuchsia-700 to-purple-800 bg-clip-text text-transparent"
                          animate={{ 
                            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                          }}
                          transition={{ duration: 5, repeat: Infinity }}
                          style={{ backgroundSize: '200% 200%' }}
                        >
            Stay connected with our latest teachings, discussions, and spiritual content 
            shared across our social media platforms and video channels.


              </motion.span>
          </motion.h2>
        </motion.div>

        {/* Uploads Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
          {uploads.map((upload, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              className="group relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Main Upload Card */}
              <motion.a
                href={upload.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block relative bg-white/90 backdrop-blur-sm rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl border border-white/50"
                whileHover={{ 
                  y: -10,
                  scale: 1.02,
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {/* Thumbnail Section with Adaptive Image Handling */}
                <div className="relative aspect-video overflow-hidden">
                  <motion.img
                    src={upload.thumbnail}
                    alt={upload.title}
                    className="w-full h-full object-cover object-center"
                    style={{
                      objectFit: 'cover',
                      objectPosition: 'center',
                      minHeight: '200px', // Ensures minimum height for small images
                    }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                  {/* Platform Badge */}
                  <motion.div
                    className="absolute top-3 left-3 flex items-center space-x-2 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1"
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                  >
                    {getPlatformIcon(upload.platform)}
                    <span className="text-xs font-semibold text-gray-700 capitalize">
                      {upload.platform}
                    </span>
                  </motion.div>

                  {/* Duration Badge */}
                  <motion.div
                    className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded"
                    initial={{ scale: 0, rotate: 180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
                  >
                    {upload.duration}
                  </motion.div>

                  {/* Play Button Overlay */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                  >
                    <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                      <Play className="w-8 h-8 text-gray-800 ml-1" />
                    </div>
                  </motion.div>

                  {/* Category Badge */}
                  <motion.div
                    className={`absolute bottom-3 left-3 bg-gradient-to-r ${getCategoryColor(upload.category)} text-white text-xs font-semibold px-3 py-1 rounded-full`}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.7, duration: 0.5 }}
                  >
                    {upload.category}
                  </motion.div>
                </div>

                {/* Content Section */}
                <div className="p-4 lg:p-6">
                  {/* Title */}
                  <motion.h3
                    className="text-lg lg:text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                  >
                    {upload.title}
                  </motion.h3>

                  {/* Description */}
                  <motion.p
                    className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.4, duration: 0.5 }}
                  >
                    {upload.description}
                  </motion.p>

                  {/* Stats Row */}
                  <motion.div
                    className="flex items-center justify-between text-sm text-gray-500"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{upload.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{upload.uploadDate}</span>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </motion.div>

                  {/* Action Buttons (Visible on Hover) */}
                  <motion.div
                    className="mt-4 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
                    initial={{ y: 10 }}
                    whileHover={{ y: 0 }}
                  >
                    <button className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full transition-colors">
                      <Heart className="w-3 h-3" />
                      <span>Like</span>
                    </button>
                    <button className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full transition-colors">
                      <Share2 className="w-3 h-3" />
                      <span>Share</span>
                    </button>
                  </motion.div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-200/20 to-transparent rounded-bl-full" />
                <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-cyan-200/20 to-transparent rounded-tr-full" />
              </motion.a>

              {/* Floating Sparkles on Hover */}
              {hoveredIndex === index && (
                <>
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-blue-400 rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                        x: [0, (Math.random() - 0.5) * 60],
                        y: [0, (Math.random() - 0.5) * 60],
                      }}
                      transition={{ 
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2 
                      }}
                    />
                  ))}
                </>
              )}
            </motion.div>
          ))}
        </div>

        {/* Platform Links */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mt-16 lg:mt-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <motion.a
            href="https://youtube.com/@vijayamargam8134?si=fz2oIv68ra9id0u5"
            className="group flex items-center space-x-3 bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Youtube className="w-5 h-5" />
            <span>Visit YouTube Channel</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.a>

          <motion.a
            href="https://www.instagram.com/jeelanistudiescentre?igsh=MWkzaGxrMGIzc3MxMw=="
            className="group flex items-center space-x-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Instagram className="w-5 h-5" />
            <span>Follow on Instagram</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default RecentUploads;