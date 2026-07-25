import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Crown, Star, Award, Users, BookOpen, Heart, Quote, ChevronRight, Sparkles } from 'lucide-react';
import leader1 from '../assets/leader1.jpg';
import leader2 from '../assets/shaikuna.JPG'
import leader3 from '../assets/Hamza_usthad.jpg'


const leaders = [
  
  { 
    name: 'Dr. Quthubuzzaman Sheikh Yusuf Sulthan Shah Qadiri Chishthi (QA)', 
    role: 'Spiritual Leader & Founder',
    image: leader2,
    description: 'A renowned Islamic scholar with over 50 years of experience in Islamic jurisprudence and Sufi teachings.',
    expertise: [''],
    quote: 'Education is the foundation upon which we build a righteous society.',
    achievements: '',
    icon: <Crown className="w-6 h-6" />
  },
  { 
    name: 'Sheikh Usthad Muhammed Abdu Raheem Musliyar, Valapuram', 
    role: 'Spiritual Leader & Scholar',
    image: leader1,
    description: 'A renowned Islamic scholar with over 50 years of experience in Islamic jurisprudence and Sufi teachings.',
    expertise: ['Islamic Jurisprudence', 'Sufi Mysticism', 'Quranic Studies'],
    quote: 'Knowledge is the light that illuminates the path to spiritual excellence.',
    achievements: '50+ Years Experience',
    icon: <BookOpen className="w-6 h-6" />
    
  },
  { 
    name: 'Sheikh Hamaza Usthad, Moonaakkal', 
    role: 'Spiritual Leader & Scholar',
    image: leader3,
    description: 'Dedicated community leader with extensive experience in social work and Islamic counseling.',
    expertise: ['Community Building', 'Social Work',],
    quote: 'True strength lies in serving our community with compassion and wisdom.',
    achievements: '50+ Years Service',
    icon: <Heart className="w-6 h-6" />
  },
];

const Leaders = () => {
  const containerRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <section id="leaders" className="py-20 lg:py-32 relative overflow-hidden">
      {/* Multi-layered Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/50" />
        
        {/* Animated Geometric Pattern */}
        <motion.div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23059669' fill-opacity='1'%3E%3Cpath d='M40 0L50 30H30L40 0Z M40 80L50 50H30L40 80Z M0 40L30 50V30L0 40Z M80 40L50 50V30L80 40Z' /%3E%3Ccircle cx='40' cy='40' r='15' fill='none' stroke='%23059669' stroke-width='1'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
          animate={{ 
            backgroundPosition: ['0px 0px', '80px 80px'],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />

        {/* Floating Orbs */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-emerald-200/20 to-teal-200/20 blur-xl"
            style={{
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
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
            className="inline-flex items-center space-x-2 bg-emerald-100/50 backdrop-blur-sm border border-emerald-200/50 rounded-full px-6 py-3 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <span className="text-emerald-700 font-semibold">Our Leadership</span>
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-800 bg-clip-text text-transparent">
              Guiding Lights
            </span>
            <br />
            {/* <motion.span 
              className="bg-gradient-to-r from-teal-600 via-emerald-700 to-teal-800 bg-clip-text text-transparent"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{ backgroundSize: '200% 200%' }}
            >
                
              Islamic Excellence
            </motion.span> */}
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Meet the distinguished scholars and leaders who dedicate their lives to preserv and spread 
            the authentic teachings of Islam through wisdom, compassion, and unwavering commitment.
          </motion.p>
        </motion.div>

        {/* Leaders Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {leaders.map((leader, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="group relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Card Container */}
              <motion.div
                className="relative bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl border border-white/20"
                whileHover={{ 
                  y: -10,
                  scale: 1.02,
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {/* Animated Background Gradient */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5"
                  animate={hoveredIndex === index ? {
                    backgroundPosition: ['0% 0%', '100% 100%'],
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                />

                {/* Image Section */}
                <div className="relative overflow-hidden">
                  <motion.img 
                    src={leader.image} 
                    alt={leader.name} 
                    className="w-full h-64 lg:h-72 object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  />
                  
                  {/* Image Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                  
                  {/* Role Icon */}
                  <motion.div
                    className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: index * 0.2 + 0.5, duration: 0.5 }}
                  >
                    <div className="text-emerald-600">
                      {leader.icon}
                    </div>
                  </motion.div>

                  {/* Achievement Badge */}
                  <motion.div
                    className="absolute bottom-4 left-4 bg-emerald-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 + 0.7, duration: 0.5 }}
                  >
                    {leader.achievements}
                  </motion.div>
                </div>

                {/* Content Section */}
                <div className="p-6 lg:p-8 relative">
                  {/* Name and Role */}
                  <div className="mb-4">
                    <motion.h3
                      className="text-xl lg:text-2xl font-bold text-gray-900 mb-2"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 + 0.3, duration: 0.5 }}
                    >
                      {leader.name}
                    </motion.h3>
                    <motion.p
                      className="text-emerald-600 font-semibold text-lg"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 + 0.4, duration: 0.5 }}
                    >
                      {leader.role}
                    </motion.p>
                  </div>

                  {/* Description */}
                  <motion.p
                    className="text-gray-600 leading-relaxed mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 + 0.5, duration: 0.5 }}
                  >
                    {leader.description}
                  </motion.p>

                  {/* Expertise Tags */}
                  <motion.div
                    className="flex flex-wrap gap-2 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 + 0.6, duration: 0.5 }}
                  >
                    {leader.expertise.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </motion.div>

                  {/* Quote Section */}
                  <motion.div
                    className="relative bg-gray-50 rounded-2xl p-4 border-l-4 border-emerald-500"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 + 0.7, duration: 0.5 }}
                  >
                    <Quote className="w-5 h-5 text-emerald-500 mb-2" />
                    <p className="text-gray-700 italic text-sm leading-relaxed">
                      "{leader.quote}"
                    </p>
                  </motion.div>

                  {/* Hover Effect - Learn More Button */}
                  <motion.div
                    className="absolute inset-x-6 bottom-6 opacity-0 group-hover:opacity-100 transition-all duration-300"
                    initial={{ y: 20 }}
                    whileHover={{ y: 0 }}
                  >
                    <button className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                      {/* <span>Learn More</span>
                      <ChevronRight className="w-4 h-4" /> */}
                    </button>
                  </motion.div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-emerald-200/20 to-transparent rounded-bl-full" />
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-teal-200/20 to-transparent rounded-tr-full" />
              </motion.div>

              {/* Floating Particles around each card */}
              {hoveredIndex === index && (
                <>
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-emerald-400 rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                        x: [0, (Math.random() - 0.5) * 100],
                        y: [0, (Math.random() - 0.5) * 100],
                      }}
                      transition={{ 
                        duration: 2,
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

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16 lg:mt-24"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <motion.button
            className="group inline-flex items-center space-x-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Users className="w-6 h-6" />
            <span>Join Our Community</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Leaders;