import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download as DownloadIcon, FileText, Calendar, Eye, ExternalLink, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';
import { api } from '../api/axios';

const Downloads = () => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [downloads, setDownloads] = useState([]);
  const [categories, setCategories] = useState([{ label: 'All', value: 'all' }]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchDownloads();
  }, []);

  const fetchDownloads = async () => {
    try {
      const res = await api.get('/downloads?limit=100');
      const items = res.data.items || res.data;
      const mapped = items.map(item => ({
        id: item._id,
        title: item.title,
        description: item.description,
        link: item.fileUrl,
        category: item.category || 'General',
        type: item.fileType || 'pdf',
        downloadCount: item.downloadCount || 0,
        publishedDate: item.date ? new Date(item.date).toLocaleDateString() : new Date(item.createdAt).toLocaleDateString(),
      }));
      setDownloads(mapped);

      // Compute dynamic categories
      const rawCategories = mapped.map(item => item.category.trim());
      const uniqueCats = ['All', ...new Set(rawCategories)];
      const categoriesList = uniqueCats.map(cat => ({
        label: cat,
        value: cat.toLowerCase()
      }));
      setCategories(categoriesList);
    } catch (err) {
      console.error('Failed to fetch downloads', err);
    }
    setLoading(false);
  };

  const handleDownloadClick = async (download) => {
    try {
      // Track download count in database
      await api.post(`/downloads/${download.id}/track`);
      // Update local download count
      setDownloads(prev => prev.map(d => d.id === download.id ? { ...d, downloadCount: d.downloadCount + 1 } : d));
    } catch (err) {
      console.error('Failed to track download', err);
    }
    // Open file in new tab so browser displays / prompts save for Cloudinary file
    if (download.link) {
      window.open(download.link, '_blank', 'noopener,noreferrer');
    }
  };

  const filteredDownloads = downloads.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const renderFileTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'image':
        return <ImageIcon className="w-6 h-6 text-white" />;
      case 'video':
        return <VideoIcon className="w-6 h-6 text-white" />;
      default:
        return <FileText className="w-6 h-6 text-white" />;
    }
  };

  return (
    <section
      id="downloads"
      className="py-24 relative overflow-hidden bg-gradient-to-br from-emerald-50 via-blue-50/30 to-teal-50/40"
    >
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-emerald-300/20 to-teal-300/20 rounded-full blur-3xl"
          animate={{
            x: [0, 120, 0],
            y: [0, -60, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Header Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 bg-emerald-100/60 backdrop-blur-sm rounded-full px-5 py-2 mb-4 text-emerald-800 font-semibold text-sm">
            <DownloadIcon className="w-4 h-4 text-emerald-600" />
            <span>Resource Library</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-800 bg-clip-text text-transparent mb-4">
            Downloads & Documents
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Access our collection of official literature, educational guides, media, and handbooks.
          </p>
        </motion.div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                selectedCategory === cat.value
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white/80 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 border border-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Downloads Grid */}
        <motion.div
          className="grid md:grid-cols-2 xl:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <AnimatePresence>
            {filteredDownloads.map((download) => (
              <motion.div
                key={download.id}
                variants={itemVariants}
                layout
                onHoverStart={() => setHoveredItem(download.id)}
                onHoverEnd={() => setHoveredItem(null)}
                className="group relative h-full flex flex-col"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-white/60 h-full flex flex-col">
                  {/* Card Header Banner */}
                  <div className="relative h-24 bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-between px-6">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      {renderFileTypeIcon(download.type)}
                    </div>
                    <span className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                      {download.type}
                    </span>
                  </div>

                  {/* Content Body */}
                  <div className="p-6 flex-1 flex flex-col">
                    <span className="inline-block bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-xs font-semibold mb-3 self-start border border-emerald-100">
                      {download.category}
                    </span>

                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
                      {download.title}
                    </h3>

                    <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">
                      {download.description}
                    </p>

                    {/* Metadata Row */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-6 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{download.publishedDate}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-medium text-emerald-700">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{download.downloadCount} downloads</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleDownloadClick(download)}
                      className="w-full inline-flex items-center justify-center bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg group mt-auto gap-2"
                    >
                      <DownloadIcon className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
                      <span>Open / Download</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-70 ml-1" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredDownloads.length === 0 && !loading && (
          <div className="text-center py-16 text-gray-500 font-medium">
            No downloads available in this category.
          </div>
        )}
      </div>
    </section>
  );
};

export default Downloads;