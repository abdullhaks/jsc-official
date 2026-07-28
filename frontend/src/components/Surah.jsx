import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Eye, EyeOff, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

const PAGE_SIZE = 50;

const Surah = () => {
  const { id } = useParams();
  const [surah, setSurah] = useState(null);
  const [arabicVerses, setArabicVerses] = useState([]);
  const [translationVerses, setTranslationVerses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTranslation, setShowTranslation] = useState(false); // hidden by default
  const [currentPage, setCurrentPage] = useState(1);
  const [showAllVerses, setShowAllVerses] = useState(false);
  const navigate = useNavigate();

  // Manual Fatiha data with Ameen
  const fatihaData = useMemo(() => ({
    surah: {
      id: 1,
      name_simple: 'Al-Fatihah',
      name_arabic: 'الفاتحة',
      translated_name: { name: 'The Opener' },
      revelation_place: 'makkah',
      verses_count: 7,
    },
    arabicVerses: [
      { id: 1, verse_key: '1:1', text_uthmani: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' },
      { id: 2, verse_key: '1:2', text_uthmani: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ' },
      { id: 3, verse_key: '1:3', text_uthmani: 'الرَّحْمَٰنِ الرَّحِيمِ' },
      { id: 4, verse_key: '1:4', text_uthmani: 'مَالِكِ يَوْمِ الدِّينِ' },
      { id: 5, verse_key: '1:5', text_uthmani: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ' },
      { id: 6, verse_key: '1:6', text_uthmani: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ' },
      {
        id: 7,
        verse_key: '1:7',
        text_uthmani:
          'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
      },
    ],
    translationVerses: [
      { text: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.' },
      { text: 'All praise is due to Allah, Lord of the worlds -' },
      { text: 'The Entirely Merciful, the Especially Merciful,' },
      { text: 'Sovereign of the Day of Recompense.' },
      { text: 'It is You we worship and You we ask for help.' },
      { text: 'Guide us to the straight path -' },
      {
        text:
          'The path of those upon whom You have bestowed favor, not of those who have evoked Your anger or of those who are astray.',
      },
    ],
  }), []);

  useEffect(() => {
    const fetchSurah = async () => {
      setLoading(true);
      setError(null);
      setCurrentPage(1);
      setShowAllVerses(false);

      try {
        if (id === '1') {
          setSurah(fatihaData.surah);
          setArabicVerses(fatihaData.arabicVerses);
          setTranslationVerses(fatihaData.translationVerses);
          setLoading(false);
          return;
        }
        const [surahInfoRes, arabicRes, translationRes] = await Promise.all([
          axios.get(`https://api.quran.com/api/v4/chapters/${id}?language=en`),
          axios.get(`https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=${id}`),
          axios.get(`https://api.quran.com/api/v4/quran/translations/131?chapter_number=${id}`),
        ]);
        setSurah(surahInfoRes.data.chapter);
        setArabicVerses(arabicRes.data.verses || []);
        setTranslationVerses(translationRes.data.translations || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to load Surah. Please try again later.');
        setLoading(false);
      }
    };
    fetchSurah();
  }, [id, fatihaData]);

  const totalPages = useMemo(() => {
    if (!arabicVerses.length) return 1;
    return Math.ceil(arabicVerses.length / PAGE_SIZE);
  }, [arabicVerses.length]);

  const displayedVerses = useMemo(() => {
    if (showAllVerses || arabicVerses.length <= PAGE_SIZE) {
      return arabicVerses;
    }
    const start = (currentPage - 1) * PAGE_SIZE;
    return arabicVerses.slice(start, start + PAGE_SIZE);
  }, [arabicVerses, currentPage, showAllVerses]);

  const displayedTranslations = useMemo(() => {
    if (showAllVerses || translationVerses.length <= PAGE_SIZE) {
      return translationVerses;
    }
    const start = (currentPage - 1) * PAGE_SIZE;
    return translationVerses.slice(start, start + PAGE_SIZE);
  }, [translationVerses, currentPage, showAllVerses]);

  /* ── Build full Arabic text as a single flowing page ── */
  const fullArabicText = useMemo(() => {
    return displayedVerses
      .map((v, i) => {
        const num = v.verse_key?.split(':')[1] || ((currentPage - 1) * PAGE_SIZE + i + 1);
        return `${v.text_uthmani} ۝${num}`;
      })
      .join('  ');
  }, [displayedVerses, currentPage]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-emerald-50 to-teal-50">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-16 h-16 rounded-full border-4 border-emerald-200 border-t-emerald-600"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className="text-emerald-700 font-medium text-sm tracking-wide">Loading Surah…</p>
        </motion.div>
      </div>
    );
  }

  if (error || !surah) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-emerald-50">
        <p className="text-red-600 font-semibold text-center px-4">{error || 'Surah not found.'}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-emerald-50 pb-16"
    >
      {/* ── Background texture ── */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23059669' fill-opacity='1'%3E%3Cpath d='M30 0l4 12H18L30 0zm0 60l4-12H18L30 60zM0 30l12 4V18L0 30zm60 0l-12 4V18l12 12z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative max-w-3xl mx-auto px-4 py-8 pt-24">

        {/* ── Back button ── */}
        <button
          className="flex items-center gap-2 text-emerald-700 mb-8 hover:text-emerald-900 transition-colors font-medium group cursor-pointer"
          onClick={() => navigate('/quran')}
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Surahs
        </button>

        {/* ══════════════════════════════════════════
            QURAN PAGE — outer parchment border
        ══════════════════════════════════════════ */}
        <div className="relative rounded-2xl shadow-2xl overflow-hidden">
          {/* Outer golden border decoration */}
          <div className="bg-gradient-to-b from-amber-800 via-amber-700 to-amber-800 p-[3px] rounded-2xl">
            <div className="bg-gradient-to-b from-amber-50 via-[#fefcf3] to-amber-50 rounded-[14px] overflow-hidden">

              {/* ── Inner ornamental border ── */}
              <div className="m-3 border-2 border-amber-300/70 rounded-xl overflow-hidden">

                {/* ── Surah Header ── */}
                <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-800 text-white px-6 py-6 text-center relative">
                  {/* Corner ornaments */}
                  <span className="absolute top-2 left-3 text-amber-300 text-lg opacity-60 select-none">✦</span>
                  <span className="absolute top-2 right-3 text-amber-300 text-lg opacity-60 select-none">✦</span>

                  <p className="text-amber-300 text-xs tracking-[0.25em] uppercase font-semibold mb-1 opacity-90">
                    Surah {surah.id}
                  </p>
                  <h1
                    className="text-3xl md:text-4xl font-bold mb-2"
                    style={{ fontFamily: "'Amiri', serif" }}
                  >
                    {surah.name_arabic}
                  </h1>
                  <p className="text-amber-100 font-semibold text-lg">{surah.name_simple}</p>
                  <p className="text-emerald-200 text-xs mt-1">
                    {surah.translated_name?.name} •{' '}
                    {surah.revelation_place.charAt(0).toUpperCase() + surah.revelation_place.slice(1)}{' '}
                    • {surah.verses_count} Ayahs
                  </p>

                  {/* Decorative divider */}
                  <div className="mt-4 flex items-center justify-center gap-3">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-400/50" />
                    <span className="text-amber-300 text-base select-none">❋</span>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-400/50" />
                  </div>
                </div>

                {/* ── Translation Toggle & Controls ── */}
                <div className="bg-amber-50/80 border-b border-amber-200/60 px-6 py-3 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-amber-700 font-medium tracking-wide uppercase">
                    {surah.name_simple} {totalPages > 1 && !showAllVerses ? `— Ayahs ${(currentPage - 1) * PAGE_SIZE + 1} to ${Math.min(currentPage * PAGE_SIZE, arabicVerses.length)} of ${arabicVerses.length}` : '— Full Chapter'}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    {totalPages > 1 && (
                      <button
                        onClick={() => setShowAllVerses(v => !v)}
                        className="text-xs px-3 py-1.5 rounded-full border border-amber-300 bg-white text-amber-800 hover:bg-amber-100 font-medium transition-colors"
                      >
                        {showAllVerses ? 'Show Paginated' : 'Show All Ayahs'}
                      </button>
                    )}

                    <button
                      onClick={() => setShowTranslation((v) => !v)}
                      className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold transition-all duration-200 ${
                        showTranslation
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50'
                      }`}
                    >
                      {showTranslation ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                      {showTranslation ? 'Hide Meaning' : 'Show Meaning'}
                    </button>
                  </div>
                </div>

                {/* ── Pagination Controls (Top) ── */}
                {totalPages > 1 && !showAllVerses && (
                  <div className="bg-amber-100/60 border-b border-amber-200 px-6 py-2 flex items-center justify-between text-xs font-medium text-amber-900">
                    <button
                      onClick={() => {
                        setCurrentPage(p => Math.max(p - 1, 1));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 px-3 py-1 bg-white border border-amber-300 rounded hover:bg-amber-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </button>

                    <span>Page {currentPage} of {totalPages}</span>

                    <button
                      onClick={() => {
                        setCurrentPage(p => Math.min(p + 1, totalPages));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1 px-3 py-1 bg-white border border-amber-300 rounded hover:bg-amber-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* ── Bismillah (for all surahs except 9, show on page 1) ── */}
                {surah.id !== 9 && (currentPage === 1 || showAllVerses) && (
                  <div className="text-center py-6 px-6 border-b border-amber-200/50 bg-gradient-to-b from-[#fefcf3] to-amber-50/30">
                    <p
                      className="text-3xl md:text-4xl text-emerald-900 leading-relaxed"
                      style={{ fontFamily: "'Amiri', serif", direction: 'rtl' }}
                    >
                      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                    </p>
                    {showTranslation && (
                      <p className="mt-3 text-sm text-teal-700 font-medium italic">
                        In the name of Allah, the Entirely Merciful, the Especially Merciful.
                      </p>
                    )}
                  </div>
                )}

                {/* ── Main Quran Page — flowing Arabic text ── */}
                <div className="px-6 md:px-10 py-8 bg-gradient-to-b from-[#fefcf3] to-amber-50/20">
                  <p
                    className="text-2xl md:text-3xl lg:text-[1.75rem] leading-[3.2rem] text-gray-900 text-right"
                    style={{
                      fontFamily: "'Amiri', serif",
                      direction: 'rtl',
                      wordSpacing: '0.1em',
                      lineHeight: '3.4rem',
                    }}
                  >
                    {fullArabicText}
                  </p>

                  {/* Ameen for Al-Fatiha */}
                  {id === '1' && (
                    <div className="text-center pt-8 mt-6 border-t border-amber-200">
                      <p
                        className="text-4xl text-emerald-700"
                        style={{ fontFamily: "'Amiri', serif" }}
                      >
                        آمين
                      </p>
                      <p className="text-gray-500 text-sm mt-1 italic">Ameen</p>
                    </div>
                  )}
                </div>

                {/* ── Verse-by-Verse Translations ── */}
                <AnimatePresence>
                  {showTranslation && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden border-t border-amber-200/60 bg-teal-50/40"
                    >
                      <div className="px-6 md:px-10 py-6">
                        <p className="text-xs font-semibold text-teal-700 uppercase tracking-widest mb-5 text-center">
                          ✦ English Translation ✦
                        </p>
                        <div className="space-y-4">
                          {displayedVerses.map((verse, index) => {
                            const verseNum = verse.verse_key?.split(':')[1] || ((currentPage - 1) * PAGE_SIZE + index + 1);
                            return (
                              <div
                                key={verse.id || `${currentPage}-${index}`}
                                className="flex gap-3 items-start p-2 rounded-lg hover:bg-emerald-50/50 transition-colors"
                              >
                                <span className="flex-shrink-0 mt-0.5 w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center border border-emerald-200">
                                  {verseNum}
                                </span>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                  {displayedTranslations[index]?.text}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ── Pagination Controls (Bottom) ── */}
                {totalPages > 1 && !showAllVerses && (
                  <div className="bg-amber-100/60 border-t border-amber-200 px-6 py-3 flex items-center justify-between text-xs font-medium text-amber-900">
                    <button
                      onClick={() => {
                        setCurrentPage(p => Math.max(p - 1, 1));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 px-3 py-1.5 bg-white border border-amber-300 rounded hover:bg-amber-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous Page
                    </button>

                    <span>Page {currentPage} of {totalPages}</span>

                    <button
                      onClick={() => {
                        setCurrentPage(p => Math.min(p + 1, totalPages));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1 px-3 py-1.5 bg-white border border-amber-300 rounded hover:bg-amber-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                    >
                      Next Page <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* ── Bottom ornament ── */}
                <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-800 py-3 flex items-center justify-center gap-3">
                  <span className="text-amber-300 text-sm select-none opacity-70">❋</span>
                  <span className="text-amber-200 text-xs tracking-widest opacity-60 font-medium">
                    {surah.name_simple}
                  </span>
                  <span className="text-amber-300 text-sm select-none opacity-70">❋</span>
                </div>

              </div>{/* inner ornamental border */}
            </div>{/* parchment bg */}
          </div>{/* golden border */}
        </div>
      </div>
    </motion.div>
  );
};

export default Surah;