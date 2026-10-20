import React from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, Phone, MapPin, ArrowUp, Instagram, Youtube,
  BookOpen, Users, Heart, Globe, Clock
} from 'lucide-react';
import { PushNotificationSettings } from './PushNotificationPrompt';

const Footer = () => {
  const socialLinks = [
    { 
      icon: <Instagram className="w-5 h-5" aria-hidden="true" />,
      label: 'Instagram', 
      href: 'https://www.instagram.com/jeelanistudiescentre?igsh=MWkzaGxrMGIzc3MxMw==', 
      bgGradient: 'from-fuchsia-500 to-rose-500',
    },
    { 
      icon: <Youtube className="w-5 h-5" aria-hidden="true" />,
      label: 'YouTube', 
      href: 'https://youtube.com/@vijayamargam8134?si=fz2oIv68ra9id0u5', 
      bgGradient: 'from-red-600 to-red-700',
    },
  ];

  const quickLinks = [
    { label: 'About Us', href: '#leaders', icon: <Users className="w-4 h-4" /> },
    { label: 'Our Programs', href: '#upcomingEvents', icon: <BookOpen className="w-4 h-4" /> },
    { label: 'Publications', href: '#publications', icon: <Globe className="w-4 h-4" /> },
    { label: 'Downloads', href: '#downloads', icon: <ArrowUp className="w-4 h-4" /> },
    { label: 'Contact Us', href: '#contact', icon: <Mail className="w-4 h-4" /> },
  ];

  const services = [
    { name: 'Islamic Education', desc: 'Comprehensive learning programs', icon: <BookOpen className="w-4 h-4" /> },
    { name: 'Sufi Guidance', desc: 'Spiritual mentorship and counseling', icon: <Heart className="w-4 h-4" /> },
    { name: 'Thareeqath Workshops', desc: 'Traditional practice sessions', icon: <Users className="w-4 h-4" /> },
    { name: 'Community Outreach', desc: 'Social service initiatives', icon: <Globe className="w-4 h-4" /> },
  ];

  const achievements = [
    { number: '1000+', label: 'Students Guided', icon: <Users className="w-5 h-5" /> },
    { number: '500+', label: 'Publications', icon: <BookOpen className="w-5 h-5" /> },
    { number: '25+', label: 'Years of Service', icon: <Clock className="w-5 h-5" /> },
    { number: '300+', label: 'Community Programs', icon: <Heart className="w-5 h-5" /> }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.footer
      className="relative bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 text-white overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 80, 0],
            scale: [1, 0.9, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Geometric pattern overlay */}
      <motion.div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 10L50 30L30 50L10 30Z' fill='%23ffffff'/%3E%3C/svg%3E")`,
        }}
        animate={{ backgroundPosition: ['0px 0px', '60px 60px'] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 relative z-10">
        {/* Header Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-4 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div 
              className="w-16 h-20 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl"
              whileHover={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.5 }}
            >
              <img src="https://ik.imagekit.io/aksWebSolutions/JSC/JSC_APP_ICON2.png?updatedAt=1754539864015" alt="Jeelani Studies Centre" className="w-full h-full rounded-2xl " />
            </motion.div>
            <div className="text-left">
              <motion.h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Jeelani Studies Centre
              </motion.h3>
              <motion.p className="text-emerald-300 text-lg">Islamic Education & Sufism</motion.p>
            </div>
          </motion.div>
          
          <motion.p 
            className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Dedicated to promoting Islamic education, Sufism, and Thowheed through professional institutions and spiritual guidance. 
            Join us in our mission to spread knowledge and spiritual enlightenment.
          </motion.p>
        </motion.div>

        {/* Achievements Section */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <motion.div
                className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-xl flex items-center justify-center"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                {achievement.icon}
              </motion.div>
              <div className="text-3xl font-bold text-emerald-400 mb-2">{achievement.number}</div>
              <div className="text-gray-300 text-sm">{achievement.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h4 className="mb-8 text-2xl font-bold text-white">
              Quick Links
            </motion.h4>
            <ul className="space-y-4">
              {quickLinks.map((link, index) => (
                <motion.li 
                  key={index} 
                  whileHover={{ x: 10 }}
                  className="!text-white transition-transform duration-300"
                >
                  <a href={link.href} className="flex items-center gap-3 !text-white hover:!text-white">
                    {link.icon}
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.h4 className="text-2xl font-bold mb-8 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              Our Services
            </motion.h4>
            <ul className="space-y-4">
              {services.map((service, index) => (
                <motion.li 
                  key={index} 
                  whileHover={{ x: 10 }}
                  className="text-gray-300 transition-colors duration-300"
                >
                  <div className="flex items-center gap-3">
                    {service.icon}
                    <div>
                      <div className="font-semibold hover:text-emerald-400">{service.name}</div>
                      <div className="text-sm text-gray-400">{service.desc}</div>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.h4 className="text-2xl font-bold mb-8 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              Contact Us
            </motion.h4>
            <div className="space-y-4">
              <motion.div className="flex items-center gap-3 text-gray-300">
                <Mail className="w-5 h-5 text-emerald-400" />
                <span>info@jeelani.org</span>
              </motion.div>
              <motion.div className="flex items-center gap-3 text-gray-300">
                <Phone className="w-5 h-5 text-emerald-400" />
                <span>+91 9876543210</span>
              </motion.div>
              <motion.div className="flex items-center gap-3 text-gray-300">
                <MapPin className="w-5 h-5 text-emerald-400" />
                <span>Malappuram, Kerala, India</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.h4 className="text-2xl font-bold mb-8 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              Follow Us
            </motion.h4>
            <p className="mb-5 text-sm leading-6 text-gray-300">Keep in touch with our latest talks, activities and community updates.</p>
            <motion.div>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.08, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`Visit JSC on ${social.label}`}
                    title={social.label}
                    className={`flex items-center justify-center w-12 h-12 bg-gradient-to-br ${social.bgGradient} rounded-full text-white shadow-lg ring-1 ring-white/30 transition-shadow hover:shadow-xl`}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
            <PushNotificationSettings />
          </motion.div>
        </div>

        {/* Footer Bottom */}
        <motion.div
          className="border-t border-white/10 pt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.p className="text-sm text-gray-300">
            © {new Date().getFullYear()} Jeelani Studies Centre. All rights reserved.
          </motion.p>
          <motion.p className="mt-3 text-xs text-gray-400">
            Website by{' '}
            <a href="https://www.linkedin.com/in/abdullhaks" target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-full border border-emerald-200/60 bg-emerald-400/20 px-2.5 py-1 font-bold !text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-400/30 hover:!text-white">
              AKS-WebSolutions
            </a>
          </motion.p>
        </motion.div>

        {/* Scroll to Top Button */}
        <motion.button
          className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-emerald-500 to-blue-500 text-white rounded-full flex items-center justify-center shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToTop}
        >
          <ArrowUp className="w-6 h-6" />
        </motion.button>
      </div>
    </motion.footer>
  );
};

export default React.memo(Footer);
