import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Calendar, ArrowLeft, Share2, Eye } from 'lucide-react';
import { api } from '../api/axios';

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await api.get(`/articles/${id}`);
        setArticle(res.data);
        api.post(`/articles/${id}/view`).catch(err => console.error(err));
      } catch (err) {
        console.error('Failed to fetch article', err);
      }
      setLoading(false);
    };
    fetchArticle();
  }, [id]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt || article.title,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return <div className="min-h-screen pt-32 pb-20 text-center text-xl font-semibold text-gray-600">Loading Article...</div>;
  }

  if (!article) {
    return <div className="min-h-screen pt-32 pb-20 text-center text-xl font-semibold text-gray-600">Article not found.</div>;
  }

  const coverUrl = article.coverImageUrl || article.coverImage;
  const inlineImages = (article.inlineImages || []).sort((a, b) => (a.position || 0) - (b.position || 0));

  // Helper to split content into parts and interleave images evenly
  const renderSplittedContent = () => {
    const rawContent = article.content || '';
    
    // Split content by </p> tags if present, or by double line breaks \n\n
    let blocks = [];
    if (rawContent.includes('</p>')) {
      blocks = rawContent.split('</p>').map(b => b.trim() ? b + '</p>' : '').filter(Boolean);
    } else {
      blocks = rawContent.split(/\n\s*\n/).map(b => `<p class="mb-4 leading-relaxed">${b.replace(/\n/g, '<br/>')}</p>`).filter(Boolean);
    }

    if (blocks.length === 0) {
      return <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: rawContent }} />;
    }

    const numImages = inlineImages.length;

    if (numImages === 1) {
      const mid = Math.ceil(blocks.length / 2);
      const part1 = blocks.slice(0, mid).join('');
      const part2 = blocks.slice(mid).join('');

      return (
        <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed space-y-6">
          <div dangerouslySetInnerHTML={{ __html: part1 }} />
          {inlineImages[0]?.url && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="my-8 rounded-2xl overflow-hidden shadow-lg border border-gray-100"
            >
              <img 
                src={inlineImages[0].url} 
                alt={`${article.title} illustration 1`} 
                className="w-full h-auto max-h-[500px] object-cover rounded-2xl"
              />
            </motion.div>
          )}
          <div dangerouslySetInnerHTML={{ __html: part2 }} />
        </div>
      );
    }

    if (numImages >= 2) {
      const third = Math.ceil(blocks.length / 3);
      const part1 = blocks.slice(0, third).join('');
      const part2 = blocks.slice(third, third * 2).join('');
      const part3 = blocks.slice(third * 2).join('');

      return (
        <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed space-y-6">
          <div dangerouslySetInnerHTML={{ __html: part1 }} />
          {inlineImages[0]?.url && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="my-8 rounded-2xl overflow-hidden shadow-lg border border-gray-100"
            >
              <img 
                src={inlineImages[0].url} 
                alt={`${article.title} illustration 1`} 
                className="w-full h-auto max-h-[500px] object-cover rounded-2xl"
              />
            </motion.div>
          )}
          <div dangerouslySetInnerHTML={{ __html: part2 }} />
          {inlineImages[1]?.url && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="my-8 rounded-2xl overflow-hidden shadow-lg border border-gray-100"
            >
              <img 
                src={inlineImages[1].url} 
                alt={`${article.title} illustration 2`} 
                className="w-full h-auto max-h-[500px] object-cover rounded-2xl"
              />
            </motion.div>
          )}
          <div dangerouslySetInnerHTML={{ __html: part3 }} />
        </div>
      );
    }

    return (
      <div 
        className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: rawContent }}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-emerald-50/20 pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center space-x-2 text-emerald-700 hover:text-emerald-800 font-semibold mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
        >
          {/* Cover Image Header with Title Overlay */}
          {coverUrl ? (
            <div className="w-full relative h-72 md:h-[420px] overflow-hidden">
              <img 
                src={coverUrl} 
                alt={article.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 text-white">
                <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4 text-white drop-shadow-md">
                  {article.title}
                </h1>
                <div className="flex flex-wrap items-center space-x-6 text-sm text-gray-200">
                  <span className="flex items-center"><User className="w-4 h-4 mr-2 text-emerald-400" /> {article.author?.name || 'JSC'}</span>
                  <span className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-emerald-400" /> {new Date(article.createdAt).toLocaleDateString()}</span>
                  {article.views !== undefined && article.views !== null && (
                    <span className="flex items-center"><Eye className="w-4 h-4 mr-2 text-emerald-400" /> {article.views + 1} views</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 md:p-12 pb-0">
              <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                {article.title}
              </h1>
            </div>
          )}
          
          <div className="p-8 md:p-12">
            {/* Meta & Share bar */}
            <div className="flex flex-wrap items-center justify-between pb-6 mb-8 border-b border-gray-100 gap-4">
              {!coverUrl && (
                <div className="flex flex-wrap items-center space-x-6 text-sm text-gray-500">
                  <span className="flex items-center"><User className="w-4 h-4 mr-2 text-emerald-600" /> {article.author?.name || 'JSC'}</span>
                  <span className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-emerald-600" /> {new Date(article.createdAt).toLocaleDateString()}</span>
                  {article.views !== undefined && article.views !== null && (
                    <span className="flex items-center"><Eye className="w-4 h-4 mr-2 text-emerald-600" /> {article.views + 1} views</span>
                  )}
                </div>
              )}
              {article.author?.bio && (
                <p className="text-sm text-gray-500 italic">By {article.author.name} — {article.author.bio}</p>
              )}
              <button 
                onClick={handleShare}
                className="flex items-center space-x-2 text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-full transition-colors font-medium text-sm ml-auto"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Article</span>
              </button>
            </div>
            
            {/* Split Content Body */}
            {renderSplittedContent()}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ArticleDetail;