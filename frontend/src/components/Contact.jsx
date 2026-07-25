
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, ArrowRight, Clock, MessageCircle, Users, CheckCircle, AlertCircle, Globe, Heart } from 'lucide-react';
import {message} from 'antd'
import emailjs from '@emailjs/browser';


const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null
  const [focusedField, setFocusedField] = useState(null);
  const [selectedInquiryType, setSelectedInquiryType] = useState('general');

  const inquiryTypes = [
    { id: 'general', label: 'General Inquiry', icon: <MessageCircle className="w-4 h-4" /> },
    { id: 'education', label: 'Education Programs', icon: <Users className="w-4 h-4" /> },
    { id: 'spiritual', label: 'Spiritual Guidance', icon: <Heart className="w-4 h-4" /> },
    { id: 'publications', label: 'Publications', icon: <Globe className="w-4 h-4" /> }
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (submitStatus) setSubmitStatus(null); // Clear status when user starts typing
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      message.error('Please enter your name properly');
      setSubmitStatus('error');
      return;
    }
    if (!validateEmail(formData.email)) {
      message.error('Please enter valied email');
      setSubmitStatus('error');
      return;
    }
    if (!formData.message.trim()) {
      message.error('Please send a valied message');
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
       const templateParams = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || "Not provided",
        subject: formData.subject || "No subject",
        inquiryType: inquiryTypes.find(t => t.id === selectedInquiryType)?.label || "General",
        message: formData.message,
        date: new Date().toLocaleString()
      };



        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID, // first template
          templateParams,
          import.meta.env.VITE_EMAILJS_USER_ID
        );

        // await emailjs.send(
        //   import.meta.env.VITE_EMAILJS_SERVICE_ID,
        //   import.meta.env.VITE_EMAILJS_AUTO_REPLY_TEMPLATE_ID, // second template
        //   templateParams,
        //   import.meta.env.VITE_EMAILJS_USER_ID
        // );


      message.success('Enquiry sent successfully!');

      // message.info('Sorry! message service is under maintenance now.please try later. Shukran');

      
      // setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '', phone: '' });
      setSelectedInquiryType('general');
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6 text-white" />,
      label: 'Email Address',
      value: '',
      link: 'mailto:',
      description: 'Send us an email anytime',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      icon: <Phone className="w-6 h-6 text-white" />,
      label: 'Phone Number',
      value: '+91 0000000000000',
      link: 'tel:+91 ',
      description: 'Call us during business hours',
      gradient: 'from-blue-500 to-indigo-500'
    },
    {
      icon: <MapPin className="w-6 h-6 text-white" />,
      label: 'Our Location',
      value: 'Jeelani Studies Centre, Valanchery, Malappuram, Kerala, India',
      link: 'https://maps.app.goo.gl/VY6p12Zt2vt8C8W69',
      description: 'Visit our center',
      gradient: 'from-purple-500 to-pink-500'
    },
    // {
    //   icon: <Clock className="w-6 h-6 text-orange-600" />,
    //   label: 'Working Hours',
    //   value: '9:00 AM - 6:00 PM',
    //   description: 'Sunday to Thursday',
    //   gradient: 'from-orange-500 to-red-500'
    // }
  ];

  const formFields = [
    {
      name: 'name',
      type: 'text',
      label: 'Full Name',
      placeholder: 'Enter your full name',
      required: true,
      icon: <Users className="w-5 h-5" />
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email Address',
      placeholder: 'Enter your email address',
      required: true,
      icon: <Mail className="w-5 h-5" />
    },
    {
      name: 'phone',
      type: 'tel',
      label: 'Phone Number',
      placeholder: 'Enter your phone number (optional)',
      required: false,
      icon: <Phone className="w-5 h-5" />
    },
    {
      name: 'subject',
      type: 'text',
      label: 'Subject',
      placeholder: 'What is this regarding?',
      required: false,
      icon: <MessageCircle className="w-5 h-5" />
    }
  ];

  return (
    <section id="contact" className="py-32 relative overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50/30 to-blue-50/40">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-emerald-200/30 to-blue-200/30 rounded-full blur-3xl"
          animate={{
            x: [0, -60, 0],
            y: [0, 60, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Floating geometric shapes */}
      <motion.div
        className="absolute inset-0 opacity-8"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L50 30L30 60L10 30Z' fill='%23059669' opacity='0.1'/%3E%3C/svg%3E")`,
        }}
        animate={{ backgroundPosition: ['0px 0px', '60px 60px'] }}
        transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Header Section */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, type: "spring", stiffness: 100 }}
        >
          <motion.div
            className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
          >
            <MessageCircle className="w-6 h-6 text-emerald-600" />
            <span className="text-emerald-700 font-semibold">Connect With Us</span>
          </motion.div>
          
          <motion.h2
            className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-emerald-800 via-blue-700 to-emerald-800 bg-clip-text text-transparent mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Get in Touch
          </motion.h2>
          
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, type: "spring", stiffness: 80 }}
            className="relative"
          >
            <motion.div
              className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden"
              whileHover={{ boxShadow: "0 30px 60px rgba(0,0,0,0.15)" }}
              transition={{ duration: 0.3 }}
            >
              {/* Form Header */}
              <div className="bg-gradient-to-r from-emerald-500 to-blue-500 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">Send us a Message</h3>
                <p className="text-emerald-100">Fill out the form below and we'll get back to you soon</p>
              </div>

              <div className="p-8">
                {/* Inquiry Type Selection */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-4">Type of Inquiry</label>
                  <div className="grid grid-cols-2 gap-3">
                    {inquiryTypes.map((type) => (
                      <motion.button
                        key={type.id}
                        type="button"
                        onClick={() => setSelectedInquiryType(type.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                          selectedInquiryType === type.id
                            ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-200'
                            : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'
                        }`}
                      >
                        {type.icon}
                        {type.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Form Fields */}
                  {formFields.map((field, index) => (
                    <motion.div
                      key={field.name}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <label htmlFor={field.name} className="block text-sm font-semibold text-gray-700 mb-2">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                          {field.icon}
                        </div>
                        <motion.input
                          type={field.type}
                          id={field.name}
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleInputChange}
                          onFocus={() => setFocusedField(field.name)}
                          onBlur={() => setFocusedField(null)}
                          whileFocus={{ scale: 1.01 }}
                          className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl transition-all duration-300 bg-white/80 ${
                            focusedField === field.name
                              ? 'border-emerald-400 ring-4 ring-emerald-100'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          placeholder={field.placeholder}
                        />
                      </div>
                    </motion.div>
                  ))}

                  {/* Message Field */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-4 text-gray-400">
                        <MessageCircle className="w-5 h-5" />
                      </div>
                      <motion.textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('message')}
                        onBlur={() => setFocusedField(null)}
                        rows={5}
                        whileFocus={{ scale: 1.01 }}
                        className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl transition-all duration-300 resize-none bg-white/80 ${
                          focusedField === 'message'
                            ? 'border-emerald-400 ring-4 ring-emerald-100'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        placeholder="Tell us more about your inquiry..."
                      />
                    </div>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-4 px-6 rounded-2xl flex items-center justify-center space-x-3 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Send Message</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </form>

                {/* Status Messages */}
                <AnimatePresence>
                  {submitStatus && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`mt-6 p-4 rounded-2xl flex items-center gap-3 ${
                        submitStatus === 'success'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {submitStatus === 'success' ? (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          <span>Message sent successfully! We'll get back to you soon.</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-5 h-5" />
                          <span>Please fill in all required fields correctly.</span>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, type: "spring", stiffness: 80 }}
            className="space-y-8"
          >
            {/* Contact Info Cards */}
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-gray-900 mb-8">Contact Information</h3>
              
              {contactInfo.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 15px 30px rgba(0,0,0,0.1)"
                  }}
                  className="group relative"
                >
                  <motion.div className="flex items-start gap-4 p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${item.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-lg mb-1">{item.label}</h4>
                      <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                      {item.link ? (
                        <motion.a
                          href={item.link}
                          whileHover={{ scale: 1.02 }}
                          className="text-emerald-600 font-medium hover:text-emerald-700 transition-colors"
                        >
                          {item.value}
                        </motion.a>
                      ) : (
                        <span className="text-gray-900 font-medium">{item.value}</span>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Additional Info Card */}
            <motion.div
              className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-3xl p-8 border border-white/50"
              whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="text-center mb-6">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Heart className="w-8 h-8 text-white" />
                </motion.div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">We're Here to Help</h4>
                <p className="text-gray-600 leading-relaxed">
                  Whether you have questions about our programs, need spiritual guidance, or want to learn more about Islamic education, 
                  our team is dedicated to providing you with the support and information you need.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-white/60 rounded-xl p-4">
                  <div className="text-2xl font-bold text-emerald-600">24hrs</div>
                  <div className="text-sm text-gray-600">Response Time</div>
                </div>
                <div className="bg-white/60 rounded-xl p-4">
                  <div className="text-2xl font-bold text-blue-600">100%</div>
                  <div className="text-sm text-gray-600">Support</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* FAQ or Quick Links Section */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="inline-flex flex-col items-center gap-6 bg-gradient-to-br from-white/70 to-emerald-50/70 backdrop-blur-sm rounded-3xl p-10 border border-white/50 shadow-lg"
            whileHover={{ scale: 1.02, boxShadow: "0 25px 50px rgba(0,0,0,0.15)" }}
          >
            <h3 className="text-3xl font-bold text-gray-900">Quick Questions?</h3>
            <p className="text-gray-600 text-center max-w-2xl leading-relaxed">
              Before reaching out, you might find answers to common questions in our FAQ section or explore our programs and services.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-6 py-3 rounded-2xl font-semibold"
              >
                View FAQ
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-gray-700 px-6 py-3 rounded-2xl font-semibold border-2 border-gray-200 hover:border-emerald-300"
              >
                Our Programs
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;