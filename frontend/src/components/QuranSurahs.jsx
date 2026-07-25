import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ChevronRight } from 'lucide-react';
import axios from 'axios';

const QuranSurahs = () => {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const response = await axios.get('https://api.quran.com/api/v4/chapters?language=en');
        setSurahs(response.data.chapters);
        setLoading(false);
      } catch (err) {
        setError('Failed to load Quran surahs. Please try again later.');
        setLoading(false);
      }
    };
    fetchSurahs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <BookOpen className="w-12 h-12 text-green-600" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <p className="text-red-600 font-semibold text-center px-4">{error}</p>
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen py-8 px-4 bg-gradient-to-br from-green-50 to-emerald-100"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-8"
          initial={{ y: -30 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
            القرآن الكريم
          </h1>
          <p className="text-lg text-green-700 font-medium">Holy Quran - 114 Surahs</p>
        </motion.div>

        <div className="bg-white rounded-2xl shadow-xl border border-green-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4">
            <div className="flex items-center justify-center">
              <BookOpen className="w-6 h-6 mr-2" />
              <h2 className="text-xl font-semibold">Surahs of the Quran</h2>
            </div>
          </div>
          
          <div className="divide-y divide-green-100">
            {surahs.map((surah, index) => (
              <motion.div
                key={surah.id}
                className="group flex items-center justify-between p-4 hover:bg-green-50 cursor-pointer transition-all duration-300"
                onClick={() => navigate(`/surah/${surah.id}`)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                whileHover={{ x: 5 }}
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {surah.id}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-green-700 transition-colors">
                          {surah.name_simple}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {surah.translated_name?.name} • {surah.verses_count} Ayahs • {surah.revelation_place.charAt(0).toUpperCase() + surah.revelation_place.slice(1)}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-xl font-arabic text-green-700" style={{ fontFamily: "'Amiri', serif" }}>
                          {surah.name_arabic}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors ml-4" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default QuranSurahs;