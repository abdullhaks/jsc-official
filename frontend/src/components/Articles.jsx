import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, User, Calendar, ExternalLink, ArrowRight, Eye } from 'lucide-react';
import { api } from '../api/axios';
import { Link } from 'react-router-dom';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await api.get('/articles?limit=100');
        const items = res.data.items || res.data;
        setArticles(items);
      } catch (err) {
        console.error('Failed to fetch articles', err);
      }
      setLoading(false);
    };
    fetchArticles();
  }, []);

  if (loading) {
    return <div className="py-20 text-center">Loading Articles...</div>;
  }

  return (
    <section id="articles" className="py-20 lg:py-32 relative overflow-hidden bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <motion.div 
          className="text-center mb-16 lg:mb-24"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="inline-flex items-center space-x-2 bg-indigo-100/50 backdrop-blur-sm border border-indigo-200/50 rounded-full px-6 py-3 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span className="text-indigo-700 font-semibold">Articles & Blogs</span>
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Latest Insights
            </span>
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Read our latest articles on spirituality, education, and community development.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.div
              key={article._id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
            >
              <div className="h-48 overflow-hidden relative flex-shrink-0">
                <img 
                  src={article.coverImageUrl || article.coverImage || 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&q=80&w=800'} 
                  alt={article.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-indigo-700">
                  {article.category || 'Article'}
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-4">
                    <span className="flex items-center"><User className="w-4 h-4 mr-1 text-indigo-500" /> {article.author?.name || 'JSC'}</span>
                    <span className="flex items-center"><Calendar className="w-4 h-4 mr-1 text-indigo-500" /> {new Date(article.createdAt).toLocaleDateString()}</span>
                    {article.views !== undefined && article.views !== null && (
                      <span className="flex items-center"><Eye className="w-4 h-4 mr-1 text-indigo-500" /> {article.views} views</span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
                <Link to={`/article/${article._id}`} className="inline-flex items-center space-x-2 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors mt-auto">
                  <span>Read More</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(Articles);