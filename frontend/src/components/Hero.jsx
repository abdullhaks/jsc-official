import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowDown, Sparkles, BookOpen, Heart, Star, Calendar, Book, Compass, Clock, Users, Mic, GraduationCap } from 'lucide-react';
import {useNavigate} from 'react-router-dom'
import jsc_logo2 from '../assets/jsc_logo2.png'

const LogoPlaceholder = () => (
  <div className="relative">
    {/* Glowing rings around logo */}
    {[...Array(4)].map((_, i) => (
      <motion.div
        key={i}
        className={`absolute inset-${-i * 4 - 4} border-2 rounded-full`}
        style={{
          borderImage: `linear-gradient(${i * 90}deg, rgba(34, 197, 94, ${0.6 - i * 0.1}), rgba(16, 185, 129, ${0.4 - i * 0.1}), rgba(5, 150, 105, ${0.3 - i * 0.05})) 1`
        }}
        animate={{
          rotate: [0, 360],
          scale: [1, 1.05, 1],
          opacity: [0.8, 0.4, 0.8],
        }}
        transition={{
          rotate: { duration: 15 + i * 3, repeat: Infinity, ease: "linear" },
          scale: { duration: 3 + i, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 2 + i * 0.5, repeat: Infinity, ease: "easeInOut" },
        }}
      />
    ))}
    
    {/* Main logo container with enhanced styling */}
    <motion.div 
      className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 flex items-center justify-center shadow-2xl border-4 border-white/80"
      whileHover={{ 
        scale: 1.1, 
        rotate: 5,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 40px rgba(34, 197, 94, 0.4)"
      }}
      animate={{
        boxShadow: [
          "0 20px 40px -12px rgba(0, 0, 0, 0.15), 0 0 20px rgba(34, 197, 94, 0.2)",
          "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 40px rgba(34, 197, 94, 0.4)",
          "0 20px 40px -12px rgba(0, 0, 0, 0.15), 0 0 20px rgba(34, 197, 94, 0.2)"
        ]
      }}
      transition={{
        boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      <img 
        src={jsc_logo2} 
        alt="JSC Logo"
        className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 drop-shadow-lg" 
      />
      
      {/* Decorative stars around logo */}
      {/* {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 text-amber-300"
          style={{
            top: '50%',
            left: '50%',
            transformOrigin: '50% 80px',
            transform: `rotate(${i * 60}deg) translateY(-80px)`,
          }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.5, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            rotate: { duration: 8, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 },
            opacity: { duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 },
          }}
        >
          ✦
        </motion.div>
      ))} */}



    </motion.div>

    {/* Premium badge */}
    {/* <motion.div
      className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-3 border-white"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ 
        scale: 1, 
        rotate: 0,
        y: [0, -5, 0],
      }}
      transition={{ 
        scale: { delay: 1, duration: 0.5, type: "spring" },
        rotate: { delay: 1, duration: 0.5 },
        y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      <Star className="w-6 h-6 text-white" />
    </motion.div> */}
  </div>
);

const Hero = () => {
  const { t } = useTranslation();
  const { scrollY } = useScroll();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  
  const y = useTransform(scrollY, [0, 1000], [0, -200]);
  const opacity = useTransform(scrollY, [0, 1800], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Enhanced dot particles
  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    opacity: Math.random() * 0.4 + 0.2,
    duration: Math.random() * 4 + 3,
    color: ['emerald', 'green', 'teal', 'blue'][Math.floor(Math.random() * 4)]
  }));

  // Floating Islamic elements
  const floatingElements = [
    { symbol: '✦', color: 'text-green-400', size: 'text-xl', x: 85, y: 25 },
    { symbol: '◈', color: 'text-teal-400', size: 'text-lg', x: 10, y: 70 },
    { symbol: '⬟', color: 'text-amber-400', size: 'text-2xl', x: 90, y: 65 },
    { symbol: '✧', color: 'text-emerald-300', size: 'text-sm', x: 25, y: 85 },
    { symbol: '◊', color: 'text-green-300', size: 'text-lg', x: 75, y: 15 },
    { symbol: '✦', color: 'text-amber-300', size: 'text-lg', x: 95, y: 40 },
  ];


  // Islamic app data with more vibrant colors
  const islamicApps = [
   { icon: Book, label: 'Quran', color: 'from-emerald-500 via-green-500 to-teal-500', onClick: () => navigate('/quran') },
    // { icon: Clock, label: 'Prayer', color: 'from-blue-500 via-indigo-500 to-purple-500' },
    // { icon: Compass, label: 'Qibla', color: 'from-purple-500 via-pink-500 to-rose-500' },
    { icon: Mic, label: 'Dhikr', color: 'from-teal-500 via-cyan-500 to-blue-500' },
    // { icon: Users, label: 'Community', color: 'from-orange-500 via-amber-500 to-yellow-500' },
    // { icon: Heart, label: 'Dua', color: 'from-rose-500 via-pink-500 to-purple-500' },
    // { icon: Star, label: 'Islamic', color: 'from-green-500 via-emerald-500 to-teal-500' },
    // { icon: BookOpen, label: 'Hadith', color: 'from-indigo-500 via-blue-500 to-cyan-500' },
  ];

  // Enhanced Islamic geometric pattern
  const IslamicPattern = () => (
    <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="islamicStars" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <g className="text-blue-500">
            <path d="M50,15 L55,30 L70,25 L65,40 L80,45 L65,50 L70,65 L55,60 L50,75 L45,60 L30,65 L35,50 L20,45 L35,40 L30,25 L45,30 Z" 
                  fill="currentColor" opacity="0.3" />
            <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
          </g>
        </pattern>
        
        <pattern id="geometricGrid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="0.3" className="text-green-400" opacity="0.3">
            <polygon points="30,5 45,15 45,45 30,55 15,45 15,15" />
            <circle cx="30" cy="30" r="8" />
          </g>
        </pattern>
        
        <pattern id="crescentPattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <g className="text-teal-400" opacity="0.2">
            <path d="M40,10 Q50,25 40,40 Q30,25 40,10 Z" fill="currentColor" />
            <circle cx="45" cy="20" r="3" fill="currentColor" />
          </g>
        </pattern>
      </defs>
      
      <rect width="100%" height="100%" fill="url(#islamicStars)" />
      <rect width="100%" height="100%" fill="url(#geometricGrid)" />
      <rect width="100%" height="100%" fill="url(#crescentPattern)" />
    </svg>
  );

  return (
    <motion.section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50"
      style={{ y, opacity }}
    >
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        {/* Multiple gradient layers for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/30 via-white to-green-100/30" />
        <div className="absolute inset-0 bg-gradient-to-tl from-teal-100/20 via-transparent to-amber-100/20" />
        
        {/* Animated Islamic patterns */}
        <motion.div
          className="absolute inset-0"
          animate={{ 
            rotate: [0, 360],
          }}
          transition={{ 
            rotate: { duration: 200, repeat: Infinity, ease: 'linear' }
          }}
        >
          <IslamicPattern />
        </motion.div>

        {/* Interactive mouse gradient */}
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(34, 197, 94, 0.15) 0%, rgba(16, 185, 129, 0.1) 30%, rgba(5, 150, 105, 0.05) 50%, transparent 70%)`,
          }}
        />

        {/* Colorful floating particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className={`absolute rounded-full bg-${particle.color}-400`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
            }}
            animate={{
              y: [-30, -80, -30],
              x: [-10, 10, -10],
              opacity: [particle.opacity, particle.opacity * 1.8, particle.opacity],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Floating Islamic elements */}
        {floatingElements.map((element, index) => (
          <motion.div
            key={index}
            className={`absolute ${element.color} ${element.size} select-none pointer-events-none hidden md:block`}
            style={{ left: `${element.x}%`, top: `${element.y}%` }}
            animate={{
              y: [-20, -40, -20],
              rotate: [0, 15, -15, 0],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 4 + index * 0.5,
              repeat: Infinity,
              delay: index * 0.3,
              ease: "easeInOut"
            }}
          >
            {element.symbol}
          </motion.div>
        ))}

        {/* Enhanced light rays */}
        <div className="absolute inset-0 flex items-center justify-center">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 bg-gradient-to-t from-transparent via-emerald-300/30 to-transparent origin-center"
              style={{
                height: '60%',
                transform: `rotate(${(i * 45)}deg)`,
              }}
              animate={{
                opacity: [0.1, 0.4, 0.1],
                scaleY: [0.6, 1.4, 0.6],
                scaleX: [0.5, 2, 0.5],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-32">
        <div className="text-center space-y-2 sm:space-y-8">
          
          {/* Enhanced Logo section */}
          <motion.div
            className="relative mx-auto w-fit pt-8"
            initial={{ opacity: 0, scale: 0.5, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut", type: "spring" }}
          >
            <motion.div
              className="absolute -inset-12 bg-gradient-to-r from-emerald-900/20  via-blue-900/20 to-emerald-700/30 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{
                scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              }}
            />
            <LogoPlaceholder />
          </motion.div>

          {/* Enhanced Main title */}
          <motion.div 
            className="space-y-4 sm:space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold "
              animate={{
                textShadow: [
                  '0 0 20px rgba(34, 197, 94, 0.3)',
                  '0 0 40px rgba(16, 185, 129, 0.4)',
                  '0 0 20px rgba(5, 150, 105, 0.3)',
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <span className="block bg-gradient-to-r from-emerald-700 via-green-600  to-emerald-700 bg-clip-text text-transparent">
                Jeelani Studies
              </span>
              <span className="block bg-gradient-to-r from-green-700 via-emerald-600  to-green-700 bg-clip-text text-transparent">
                Centre
              </span>
            </motion.h1>

            {/* Enhanced Subtitle badges */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 lg:space-x-6">
              <motion.div
                className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm border-2 border-emerald-200 rounded-full px-4 sm:px-6 py-2 sm:py-3 shadow-lg"
                whileHover={{ 
                  scale: 1.05, 
                  borderColor: 'rgb(34, 197, 94)',
                  boxShadow: '0 10px 30px rgba(34, 197, 94, 0.2)'
                }}
                animate={{
                  boxShadow: [
                    '0 4px 15px rgba(34, 197, 94, 0.1)',
                    '0 8px 25px rgba(34, 197, 94, 0.2)',
                    '0 4px 15px rgba(34, 197, 94, 0.1)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                <span className="font-semibold text-gray-700 text-sm sm:text-base">Islamic Education</span>
              </motion.div>
              <motion.div
                className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm border-2 border-green-200 rounded-full px-4 sm:px-6 py-2 sm:py-3 shadow-lg"
                whileHover={{ 
                  scale: 1.05, 
                  borderColor: 'rgb(22, 163, 74)',
                  boxShadow: '0 10px 30px rgba(22, 163, 74, 0.2)'
                }}
                animate={{
                  boxShadow: [
                    '0 4px 15px rgba(22, 163, 74, 0.1)',
                    '0 8px 25px rgba(22, 163, 74, 0.2)',
                    '0 4px 15px rgba(22, 163, 74, 0.1)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                <span className="font-semibold text-gray-700 text-sm sm:text-base">Spiritual Excellence</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Enhanced Quranic verse */}
          <motion.div
            className="max-w-5xl mx-auto px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <motion.div 
              className="bg-white/90 backdrop-blur-md border-2 border-emerald-200 rounded-3xl px-6 sm:px-8 py-6 sm:py-8 shadow-xl relative overflow-hidden"
              animate={{
                boxShadow: [
                  '0 10px 40px rgba(34, 197, 94, 0.15)',
                  '0 20px 60px rgba(16, 185, 129, 0.25)',
                  '0 10px 40px rgba(5, 150, 105, 0.15)'
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/50 via-transparent to-green-50/50" />
              <div className="relative">
                <p
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-emerald-800 mb-3 sm:mb-4 leading-relaxed"
                  style={{ 
                    fontFamily: "'Amiri', 'Times New Roman', serif",
                    direction: 'rtl',
                    unicodeBidi: 'embed',
                  }}
                >
                  وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِلْعَالَمِينَ
                </p>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 italic font-medium">
                  "And We sent you not except as a mercy to the worlds" (Qur'an 21:107)
                </p>
              </div>
              
              {/* Decorative corners */}
              <div className="absolute top-3 left-3 w-4 h-4 border-l-2 border-t-2 border-emerald-400 rounded-tl-lg" />
              <div className="absolute top-3 right-3 w-4 h-4 border-r-2 border-t-2 border-green-400 rounded-tr-lg" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-l-2 border-b-2 border-teal-400 rounded-bl-lg" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-r-2 border-b-2 border-emerald-400 rounded-br-lg" />
            </motion.div>
          </motion.div>

          {/* Enhanced Description */}
          <motion.p
            className="text-base sm:text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed bg-white/70 backdrop-blur-sm rounded-2xl px-6 sm:px-8 py-4 sm:py-6 border border-emerald-100 shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            {t('hero_description') || 'Dedicated to preserving and spreading the authentic teachings of Islam through education, research, and spiritual guidance. Join us in our journey towards knowledge and enlightenment in the light of the Quran and Sunnah.'}
          </motion.p>

          {/* Enhanced Islamic Apps Grid with smaller icons */}
          <motion.div
            className="space-y-6 sm:space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
              <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                Islamic Resources
              </span>
            </h3>
            
            <div className="flex flex-col-6 sm:flex-row items-center justify-center gap-3 sm:gap-6 max-w-2xl sm:max-w-4xl mx-auto px-4">
                {islamicApps.map((app, index) => (
                  <motion.div
                    key={index}
                    className="group relative cursor-pointer" // Add cursor-pointer
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay:0, duration: 0.5, type: "spring" }}
                    whileHover={{ y: -6, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={app.onClick} // Add onClick handler
                  >
                    <motion.div 
                      className={`relative bg-gradient-to-br ${app.color} p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg border border-white/30 backdrop-blur-sm transition-all duration-300 group-hover:shadow-2xl aspect-square flex flex-col items-center justify-center`}
                      animate={{
                        boxShadow: [
                          '0 4px 15px rgba(0, 0, 0, 0.1)',
                          '0 8px 25px rgba(0, 0, 0, 0.15)',
                          '0 4px 15px rgba(0, 0, 0, 0.1)'
                        ]
                      }}
                      transition={{ duration: 1, repeat: Infinity, delay:0.0 }}
                    >
                      <app.icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white mb-1 sm:mb-2" />
                      <h4 className="text-white font-semibold text-xs sm:text-sm text-center leading-tight">{app.label}</h4>
                      
                      {/* Shine effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100"
                        animate={{
                          x: ['-100%', '100%']
                        }}
                        transition={{
                          duration: 0.6,
                          repeat: 0,
                          ease: "easeInOut"
                        }}
                        style={{
                          transform: 'skewX(-20deg)'
                        }}
                      />
                    </motion.div>
                  </motion.div>
                ))}
              </div>

            {/* Enhanced Inspirational quote */}
            <motion.div
              className="text-center pt-4 sm:pt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              <motion.p 
                className="text-xs sm:text-sm md:text-base text-gray-500 italic bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 rounded-full px-4 sm:px-6 py-2 sm:py-3 border border-emerald-200 inline-block shadow-md"
                animate={{
                  boxShadow: [
                    '0 2px 10px rgba(34, 197, 94, 0.1)',
                    '0 4px 20px rgba(16, 185, 129, 0.15)',
                    '0 2px 10px rgba(5, 150, 105, 0.1)'
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                "Seek knowledge from the cradle to the grave" - Prophet Muhammad (ﷺ)
              </motion.p>
            </motion.div>
          </motion.div>

          {/* Enhanced Call to action buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-6 pt-6 sm:pt-8 px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0 }}
          >
            <motion.button
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white font-semibold rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => document.getElementById('upcomingEvents')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                animate={{
                  x: ['-100%', '100%']
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <span className="relative flex items-center justify-center space-x-2 text-base sm:text-lg">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Explore Programs</span>
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
            </motion.button>

            <motion.button
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-emerald-600 text-emerald-600 font-semibold rounded-xl sm:rounded-2xl hover:bg-emerald-600 hover:text-white transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-xl hover:shadow-2xl relative overflow-hidden group"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
              />
              <span className="relative flex items-center justify-center space-x-2 text-base sm:text-lg">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Get Started</span>
                <motion.div
                  className="w-2 h-2 bg-current rounded-full"
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </span>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Scroll indicator */}
      <motion.div
        className="absolute bottom-4 sm:bottom left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
        }}
        transition={{ delay: 2.2, duration: 0.8 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center space-y-2 cursor-pointer group"
          onClick={() => document.getElementById('leaders')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <span className="text-xs sm:text-sm font-medium text-gray-600 bg-white/90 backdrop-blur-sm px-3 sm:px-4 py-1 sm:py-2 rounded-full border border-emerald-200 group-hover:bg-emerald-50 group-hover:border-emerald-300 transition-all duration-300 shadow-lg">
            Scroll to explore
          </span>
          <motion.div 
            className="p-2 sm:p-3 rounded-full border-2 border-emerald-300 bg-white/90 backdrop-blur-sm hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-300 shadow-lg"
            animate={{
              boxShadow: [
                '0 4px 15px rgba(34, 197, 94, 0.2)',
                '0 8px 25px rgba(34, 197, 94, 0.3)',
                '0 4px 15px rgba(34, 197, 94, 0.2)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowDown className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default Hero;