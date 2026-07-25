import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Globe, ShoppingCart, ExternalLink, Star, Calendar, User, Tag, Search } from 'lucide-react';
import { api } from '../api/axios';

const Publications = () => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const res = await api.get('/publications?limit=100');
        const items = res.data.items || res.data;
        const mapped = items.map(item => {
          let originalLink = item.purchaseLink || '#';
          let cleanLink = originalLink.trim();
          if (cleanLink && cleanLink !== '#' && !/^(f|ht)tps?:\/\//i.test(cleanLink)) {
            cleanLink = `https://${cleanLink}`;
          }

          let formattedPrice = 'Free';
          if (item.price) {
            const trimmedPrice = String(item.price).trim();
            if (/^(free|rs|inr|\$)/i.test(trimmedPrice)) {
              formattedPrice = trimmedPrice;
            } else if (!isNaN(trimmedPrice)) {
              formattedPrice = `Rs. ${trimmedPrice}`;
            } else {
              formattedPrice = trimmedPrice;
            }
          }

          return {
            id: item._id,
            title: item.title,
            author: item.author || 'JSC Scholar',
            description: item.description,
            image: item.coverImageUrl,
            purchaseLink: cleanLink,
            price: formattedPrice,
            featured: Boolean(item.featured),
            category: item.category || 'Islamic Studies',
            tags: item.tags || [],
            rating: item.rating || 5.0,
            type: 'book',
            publishedDate: item.date ? new Date(item.date).toLocaleDateString() : new Date(item.createdAt).toLocaleDateString(),
          };
        });
        setPublications(mapped);
      } catch (err) {
        console.error('Failed to fetch publications', err);
      }
      setLoading(false);
    };
    fetchPublications();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -10 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <section id="publications" className="py-32 relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/40">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-emerald-200/20 to-blue-200/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 80, 0],
            scale: [1, 0.9, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Floating geometric shapes */}
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 10L45 25L30 40L15 25Z' fill='%23059669' opacity='0.3'/%3E%3C/svg%3E")`,
        }}
        animate={{ backgroundPosition: ['0px 0px', '60px 60px'] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Header Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, type: "spring", stiffness: 100 }}
        >
          <motion.div
            className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
          >
            <BookOpen className="w-6 h-6 text-emerald-600" />
            <span className="text-emerald-700 font-semibold">Knowledge Center</span>
          </motion.div>
          
          <motion.h2
            className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-emerald-800 via-blue-700 to-emerald-800 bg-clip-text text-transparent mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Publications
          </motion.h2>
          
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Discover our collection of scholarly works, insightful articles, and comprehensive guides on Islamic studies and spirituality
          </motion.p>
        </motion.div>

        {/* Publications Grid */}
        <motion.div
          className="grid md:grid-cols-2 xl:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <AnimatePresence>
            {publications.map((pub, index) => (
              <motion.div
                key={pub.id}
                variants={itemVariants}
                layout
                onHoverStart={() => setHoveredItem(pub.id)}
                onHoverEnd={() => setHoveredItem(null)}
                className="group relative"
              >
                <motion.div
                  className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/50"
                  whileHover={{ 
                    y: -10,
                    boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
                  }}
                >
                  {/* Featured Badge */}
                  {pub.featured && (
                    <motion.div
                      className="absolute top-4 left-4 z-10 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold"
                      initial={{ scale: 0, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                    >
                      ⭐ FEATURED
                    </motion.div>
                  )}

                  {/* Book Cover or Blog Icon */}
                  {pub.type === 'book' ? (
                    <div className="relative h-72 overflow-hidden">
                      <motion.img
                        src={pub.image}
                        alt={pub.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        whileHover={{ scale: 1.05 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      
                      {/* Price Tag */}
                      <motion.div
                        className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2"
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.7 }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-emerald-600">{pub.price}</span>
                          {pub.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">{pub.originalPrice}</span>
                          )}
                        </div>
                        <div className="text-xs text-emerald-600 font-semibold">{pub.availability}</div>
                      </motion.div>
                    </div>
                  ) : (
                    <div className="relative h-48 bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center">
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
                      >
                        <Globe className="w-10 h-10 text-white" />
                      </motion.div>
                      
                      {/* Blog Stats */}
                      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1">
                        <span className="text-xs font-semibold text-emerald-600">{pub.views}</span>
                      </div>
                      
                      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1">
                        <span className="text-xs font-semibold text-blue-600">{pub.readTime}</span>
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-8">
                    {/* Category & Date */}
                    <div className="flex items-center justify-between mb-4">
                      <motion.span
                        className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Tag className="w-3 h-3" />
                        {pub.category}
                      </motion.span>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        {pub.publishedDate}
                      </div>
                    </div>

                    {/* Title */}
                    <motion.h3
                      className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-emerald-700 transition-colors duration-300"
                      whileHover={{ scale: 1.02 }}
                    >
                      {pub.title}
                    </motion.h3>

                    {/* Author */}
                    <div className="flex items-center text-gray-600 text-sm mb-3">
                      <User className="w-4 h-4 mr-2" />
                      <span>by {pub.author}</span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                      {pub.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {pub.tags?.map((tag, tagIndex) => (
                        <motion.span
                          key={tagIndex}
                          className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-lg"
                          whileHover={{ scale: 1.1, backgroundColor: "#dbeafe" }}
                        >
                          #{tag}
                        </motion.span>
                      ))}
                    </div>

                    {/* Rating for books */}
                    {pub.rating && (
                      <div className="flex items-center gap-2 mb-6">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(pub.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{pub.rating}</span>
                        <span className="text-sm text-gray-500">({pub.reviews} reviews)</span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {pub.type === 'book' ? (
                      <motion.a
                        href={pub.purchaseLink}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex items-center justify-center w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 px-6 rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg group"
                      >
                        <ShoppingCart className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
                        Purchase Now
                        <motion.div
                          className="ml-2"
                          animate={{ x: hoveredItem === pub.id ? 5 : 0 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </motion.div>
                      </motion.a>
                    ) : (
                      <motion.a
                        href={pub.link}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex items-center justify-center w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg group"
                      >
                        <BookOpen className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
                        Read Article
                        <motion.div
                          className="ml-2"
                          animate={{ x: hoveredItem === pub.id ? 5 : 0 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </motion.div>
                      </motion.a>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="inline-flex flex-col items-center gap-4 bg-gradient-to-br from-emerald-50 to-blue-50 backdrop-blur-sm rounded-3xl p-8 border border-white/50"
            whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
          >
            <h3 className="text-2xl font-bold text-gray-900">Stay Updated</h3>
            <p className="text-gray-600 text-center max-w-md">
              Subscribe to our newsletter to get notified about new publications and articles
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-8 py-3 rounded-2xl font-semibold"
            >
              Subscribe Now
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Publications;
