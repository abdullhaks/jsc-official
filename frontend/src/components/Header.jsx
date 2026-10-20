import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, BookOpen, Users, Calendar, Youtube, FileText, Download, Mail, Globe, ChevronDown, Star, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import jsc_logo1 from '../assets/jsc_logo1.png';

export const Header = ({ activeSection, setActiveSection, activeEventCount = 0 }) => {
  const { i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'hero',          label: 'Home',         icon: <Globe    className="w-4 h-4" /> },
    { id: 'events',        label: 'Events',        icon: <Calendar className="w-4 h-4" />, badge: activeEventCount, to: '/events' },
    { id: 'leaders',       label: 'Leaders',       icon: <Users    className="w-4 h-4" /> },
    { id: 'recentUploads', label: 'Uploads',       icon: <Youtube  className="w-4 h-4" /> },
    { id: 'memories',      label: 'Memories',      icon: <Calendar className="w-4 h-4" />, to: '/memories' },
    { id: 'publications',  label: 'Publications',  icon: <BookOpen className="w-4 h-4" /> },
    { id: 'downloads',     label: 'Downloads',     icon: <Download className="w-4 h-4" /> },
    { id: 'articles',      label: 'Articles',      icon: <FileText className="w-4 h-4" /> },
    { id: 'contact',       label: 'Contact',       icon: <Mail     className="w-4 h-4" /> },
  ];
  const primaryNavItems = navItems.filter((item) => ['hero', 'events', 'leaders', 'publications', 'articles'].includes(item.id));
  const moreNavItems = navItems.filter((item) => !primaryNavItems.includes(item));

  const languages = [
    { code: 'en', label: 'English',  flag: '🇺🇸' },
    { code: 'ml', label: 'മലയാളം', flag: '🇮🇳' },
    { code: 'ur', label: 'اردو',    flag: '🇵🇰' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    e.stopPropagation();
    const navItem = navItems.find((item) => item.id === sectionId);
    if (navItem?.to) {
      navigate(navItem.to);
    } else if (sectionId === 'articles') {
      navigate('/articles');
    } else if (sectionId === 'dhikr') {
      navigate('/dhikr');
    } else if (location.pathname !== '/') {
      navigate(`/?section=${encodeURIComponent(sectionId)}`);
    } else {
      const target = document.getElementById(sectionId);
      if (target) {
        window.scrollTo({ top: Math.max(0, target.getBoundingClientRect().top + window.scrollY - 72), behavior: 'smooth' });
      }
      setActiveSection(sectionId);
    }
    setTimeout(() => { setIsMenuOpen(false); setShowLangDropdown(false); setShowMoreDropdown(false); }, 300);
  };

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setShowLangDropdown(false);
    setIsMenuOpen(false);
  };

  const getCurrentLanguage = () =>
    languages.find(lang => lang.code === i18n.language) || languages[0];

  const isActive = (id) => {
    if (id === 'events') return location.pathname === '/events' || location.pathname.startsWith('/events/') || location.pathname.startsWith('/event/');
    if (id === 'memories') return location.pathname === '/memories' || location.pathname.startsWith('/memories/');
    if (id === 'articles') return location.pathname === '/articles' || location.pathname.startsWith('/article/');
    return activeSection === id && location.pathname === '/';
  };

  return (
    <>
      {/* ── Sticky Header ─────────────────────────────────────────── */}
      <motion.header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/96 backdrop-blur-2xl shadow-[0_2px_24px_rgba(0,0,0,0.08)] border-b border-emerald-100/60'
            : 'bg-white/90 backdrop-blur-xl border-b border-transparent'
        }`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* ── Logo ── */}
            <motion.div
              className="flex items-center gap-3 cursor-pointer select-none flex-shrink-0"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => scrollToSection(e, 'hero')}
            >
              <div className="relative flex-shrink-0">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-xl blur opacity-20 transition-opacity duration-300 hover:opacity-40" />
                <img
                  src={jsc_logo1}
                  alt="Jeelani Studies Centre"
                  className="relative w-10 h-10 rounded-lg object-cover shadow-md"
                />
                <motion.span
                  className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <Star className="w-2 h-2 text-white" />
                </motion.span>
              </div>
              <div className="flex flex-col leading-tight min-w-0">
                <span className="text-sm sm:text-base font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent truncate">
                  Jeelani Studies Centre
                </span>
                <span className="text-[10px] text-gray-400 font-medium truncate">
                  Islamic Education &amp; Spiritual Excellence
                </span>
              </div>
            </motion.div>

            {/* ── Desktop Nav ── */}
            <nav className="hidden lg:flex min-w-0 items-center gap-0.5" aria-label="Main navigation">
              {primaryNavItems.map((item, i) => (
                <motion.button
                  key={item.id}
                  onClick={(e) => scrollToSection(e, item.id)}
                  className="relative px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 group outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                  style={{ color: isActive(item.id) ? '#059669' : '#374151' }}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  aria-current={isActive(item.id) ? 'page' : undefined}
                >
                  {/* Hover fill */}
                  <span className="absolute inset-0 rounded-lg bg-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                  {/* Active pill underline */}
                  {isActive(item.id) && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-x-1 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}

                  <span className="relative z-10 flex items-center gap-1.5">
                    <span className={`transition-colors duration-200 ${isActive(item.id) ? 'text-emerald-600' : 'text-gray-400 group-hover:text-emerald-500'}`}>
                      {item.icon}
                    </span>
                    <span className={isActive(item.id) ? 'text-emerald-700 font-semibold' : 'group-hover:text-emerald-700'}>
                      {item.label}
                    </span>
                    {item.badge > 0 && <span className="grid min-w-4 h-4 place-items-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">{item.badge > 99 ? '99+' : item.badge}</span>}
                  </span>
                </motion.button>
              ))}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => { setShowMoreDropdown(!showMoreDropdown); setShowLangDropdown(false); }}
                  className="flex items-center gap-1 rounded-lg px-2.5 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                  aria-expanded={showMoreDropdown}
                >
                  More <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showMoreDropdown ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {showMoreDropdown && (
                    <motion.div initial={{ opacity: 0, y: -6, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.96 }} transition={{ duration: 0.16 }} className="absolute right-0 mt-2 w-44 overflow-hidden rounded-xl border border-gray-100 bg-white p-1.5 shadow-2xl">
                      {moreNavItems.map((item) => (
                        <button key={item.id} onClick={(event) => scrollToSection(event, item.id)} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-700">
                          <span className="text-emerald-600">{item.icon}</span>{item.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* ── Right Controls ── */}
            <div className="flex items-center gap-2 flex-shrink-0">

              {/* Desktop Language Dropdown */}
              <div className="relative hidden lg:block">
                <motion.button
                  onClick={() => { setShowLangDropdown(!showLangDropdown); setShowMoreDropdown(false); }}
                  className="flex items-center gap-1.5 rounded-lg border border-emerald-100 bg-emerald-50/70 px-3 py-2 text-sm font-semibold text-emerald-800 transition-all duration-200 hover:bg-emerald-100"
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="text-base leading-none">{getCurrentLanguage().flag}</span><span className="hidden xl:inline">Language</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showLangDropdown ? 'rotate-180' : ''}`} />
                </motion.button>
                <AnimatePresence>
                  {showLangDropdown && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.94, y: -6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.94, y: -6 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
                    >
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => changeLanguage(lang.code)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors ${
                            i18n.language === lang.code
                              ? 'bg-emerald-50 text-emerald-700 font-semibold'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <span className="text-base">{lang.flag}</span>
                          <span>{lang.label}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile language button */}
              <div className="relative lg:hidden">
                <motion.button
                  onClick={() => { setShowLangDropdown(!showLangDropdown); setShowMoreDropdown(false); }}
                  className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  <Languages className="w-4 h-4" />
                </motion.button>
                <AnimatePresence>
                  {showLangDropdown && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.94, y: -6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.94, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
                    >
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => changeLanguage(lang.code)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left transition-colors ${
                            i18n.language === lang.code
                              ? 'bg-emerald-50 text-emerald-700 font-semibold'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <span>{lang.flag}</span>
                          <span>{lang.label}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Hamburger */}
              <motion.button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 transition-colors"
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isMenuOpen ? (
                    <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
                      <X className="w-5 h-5 text-gray-700" />
                    </motion.span>
                  ) : (
                    <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
                      <Menu className="w-5 h-5 text-gray-700" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>

          {/* ── Mobile Menu ── */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                key="mobile-menu"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="lg:hidden overflow-hidden border-t border-gray-100"
              >
                <div className="py-3 flex flex-col gap-0.5 bg-white/95 backdrop-blur-xl">
                  {navItems.map((item, i) => (
                    <motion.button
                      key={item.id}
                      onClick={(e) => scrollToSection(e, item.id)}
                      className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg mx-2 text-sm font-medium transition-colors duration-150 ${
                        isActive(item.id)
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-emerald-700'
                      }`}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.2 }}
                    >
                      {/* Active indicator dot */}
                      <span className={`flex-shrink-0 ${isActive(item.id) ? 'text-emerald-600' : 'text-gray-400'}`}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                      {item.badge > 0 && <span className="ml-auto grid min-w-5 h-5 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">{item.badge > 99 ? '99+' : item.badge}</span>}
                      {isActive(item.id) && (
                        <motion.span
                          layoutId="mobile-dot"
                          className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Backdrop for dropdowns */}
      {(showLangDropdown || showMoreDropdown || isMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setShowLangDropdown(false); setShowMoreDropdown(false); setIsMenuOpen(false); }}
        />
      )}
    </>
  );
};

export default Header;
