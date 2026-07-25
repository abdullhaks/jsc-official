import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { App as AntApp } from 'antd';
import axios from 'axios';
import Header from './components/Header';
import Hero from './components/Hero';
import Leaders from './components/Leaders';
import UpcomingEvents from './components/UpcomingEvents';
import RecentUploads from './components/RecentUploads';
import PublicEvents from './components/PublicEvents';
import Publications from './components/Publications';
import Downloads from './components/Downloads';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Articles from './components/Articles';
import ArticleDetail from './components/ArticleDetail';
import EventDetail from './components/EventDetail';
import { Routes, Route } from 'react-router-dom';
import QuranSurahs from './components/QuranSurahs';
import Surah from './components/Surah';

// Admin Imports
import Login from './admin/pages/Login';
import PrivateRoute from './admin/components/PrivateRoute';
import AdminLayout from './admin/components/AdminLayout';
import DashboardOverview from './admin/pages/DashboardOverview';
import EventsPage from './admin/pages/EventsPage';
import LatestContentPage from './admin/pages/LatestContentPage';
import MemoriesPage from './admin/pages/MemoriesPage';
import PublicationsPage from './admin/pages/PublicationsPage';
import DownloadsPage from './admin/pages/DownloadsPage';
import ArticlesPage from './admin/pages/ArticlesPage';

// Inner component so we can use useApp() hook
const AppContent = () => {
  const { message } = AntApp.useApp();
  const [activeSection, setActiveSection] = useState('hero');

  // ── Initial Backend Health Check ─────────────────────────────────────────
  useEffect(() => {
    const baseURL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';
    axios.get(baseURL + '/')
      .then((res) => {
        if (res.data?.status === 'ok') {
          message.success({
            content: `🌙 ${res.data.message}`,
            duration: 4,
            style: { fontWeight: 600, fontSize: '16px' },
          });
        }
      })
      .catch(() => {
        message.error({
          content: '❌ Backend is offline. Please check the server.',
          duration: 5,
        });
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // ─────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'leaders', 'upcomingEvents', 'recentUploads', 'publicEvents', 'publications', 'downloads', 'articles', 'contact'];
      const scrollPosition = window.scrollY + 200;
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && element.offsetTop <= scrollPosition && element.offsetTop + element.offsetHeight > scrollPosition) {
          setActiveSection(section);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen font-sans relative overflow-x-hidden bg-gray-50">
      {/* Animated SVG Background for public routes */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          className="absolute inset-0 opacity-[0.03]"
          animate={{
            backgroundPosition: ['0px 0px', '100px 100px'],
          }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: "linear"
          }}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>
      <div className="relative z-10">
        <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <>
            <Header activeSection={activeSection} setActiveSection={setActiveSection} />
            <Hero />
            <UpcomingEvents />
            <Leaders />
            <RecentUploads />
            <PublicEvents />
            <Publications />
            <Downloads />
            <Articles />
            <Contact />
            <Footer />
          </>
        } />
        <Route path="/article/:id" element={<><Header activeSection={activeSection} setActiveSection={setActiveSection} /><ArticleDetail /><Footer /></>} />
        <Route path="/events/:id" element={<><Header activeSection={activeSection} setActiveSection={setActiveSection} /><EventDetail /><Footer /></>} />
        <Route path="/event/:id" element={<><Header activeSection={activeSection} setActiveSection={setActiveSection} /><EventDetail /><Footer /></>} />
        <Route path="/quran" element={<><Header activeSection={activeSection} setActiveSection={setActiveSection} /><QuranSurahs /><Footer /></>} />
        <Route path="/surah/:id" element={<><Header activeSection={activeSection} setActiveSection={setActiveSection} /><Surah /><Footer /></>} />

        {/* Admin Login */}
        <Route path="/admin/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<PrivateRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="latest-content" element={<LatestContentPage />} />
            <Route path="memories" element={<MemoriesPage />} />
            <Route path="publications" element={<PublicationsPage />} />
            <Route path="downloads" element={<DownloadsPage />} />
            <Route path="articles" element={<ArticlesPage />} />
          </Route>
        </Route>
      </Routes>
      </div>
    </div>
  );
};

const App = () => <AppContent />;

export default App;