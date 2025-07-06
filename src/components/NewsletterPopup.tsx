import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, X, Loader, Phone, User } from 'lucide-react';

const NEWSLETTER_KEY = 'newsletter_popup_closed_v2';

const NewsletterPopup: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredContact, setPreferredContact] = useState<'email'|'phone'>('email');
  const [status, setStatus] = useState<'idle'|'success'|'error'|'loading'>('idle');
  const [error, setError] = useState('');

  // Show popup after delay if not closed before
  useEffect(() => {
    const closed = localStorage.getItem(NEWSLETTER_KEY);
    if (!closed) {
      const timer = setTimeout(() => setOpen(true), 3500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem(NEWSLETTER_KEY, '1');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError('');
    // Simulate API call
    setTimeout(() => {
      if (
        email && email.includes('@') &&
        firstName && lastName &&
        phone &&
        preferredContact
      ) {
        setStatus('success');
        setEmail('');
        setFirstName('');
        setLastName('');
        setPhone('');
        setTimeout(() => setOpen(false), 2000);
      } else {
        setStatus('error');
        setError('Please fill in all fields with valid information.');
      }
    }, 1200);
  };

  return (
    <>
      {/* Popup modal only, no floating button */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="newsletter-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 40 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              className="relative bg-gradient-to-br from-[#12082a] via-[#1a103a] to-[#12082a] border border-white/10 rounded-3xl shadow-2xl p-4 sm:p-8 w-full max-w-xs sm:max-w-md mx-auto text-center animate-fade-in"
            >
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-all focus:outline-none border border-white/20 shadow"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              {/* Logo - larger, transparent, with subtle motion, centered */}
              <div className="flex flex-col items-center justify-center gap-2 mb-2">
                <motion.img
                  src="https://i.imgur.com/qZ9tgbe.png"
                  alt="DevTone Logo"
                  className="w-20 h-20 sm:w-28 sm:h-28 object-contain mx-auto"
                  initial={{ scale: 0.95, y: 0 }}
                  animate={{ scale: [0.95, 1.05, 0.95], y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ background: 'transparent' }}
                />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-2 gradient-text animate-gradient">Get exclusive news and offers!</h2>
              <p className="text-white/70 text-xs sm:text-sm mt-1">Join our newsletter for updates, tips, and exclusive offers.</p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4 mt-4 sm:mt-6 w-full max-w-xs sm:max-w-md mx-auto">
                <div className="flex gap-2 flex-col sm:flex-row">
                  <div className="relative w-full sm:w-1/2">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 w-5 h-5" />
                    <input
                      type="text"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-colors text-sm sm:text-base"
                      placeholder="First Name"
                      required
                      disabled={status==='loading'||status==='success'}
                    />
                  </div>
                  <div className="relative w-full sm:w-1/2 mt-2 sm:mt-0">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 w-5 h-5" />
                    <input
                      type="text"
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-colors text-sm sm:text-base"
                      placeholder="Last Name"
                      required
                      disabled={status==='loading'||status==='success'}
                    />
                  </div>
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-colors text-sm sm:text-base"
                    placeholder="Your best email"
                    required
                    disabled={status==='loading'||status==='success'}
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 w-5 h-5" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-colors text-sm sm:text-base"
                    placeholder="Phone number"
                    required
                    disabled={status==='loading'||status==='success'}
                  />
                </div>
                <div className="flex flex-col gap-2 items-start">
                  <span className="text-white/80 font-medium mb-1">Preferred contact method:</span>
                  <div className="flex gap-4 w-full justify-center">
                    <button
                      type="button"
                      onClick={() => setPreferredContact('email')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 focus:outline-none shadow-sm text-white text-sm ${preferredContact==='email' ? 'bg-purple-600 border-purple-400' : 'bg-white/10 border-white/20 hover:border-purple-400'}`}
                      disabled={status==='loading'||status==='success'}
                    >
                      <Mail className="w-5 h-5" /> Email
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreferredContact('phone')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 focus:outline-none shadow-sm text-white text-sm ${preferredContact==='phone' ? 'bg-indigo-600 border-indigo-400' : 'bg-white/10 border-white/20 hover:border-indigo-400'}`}
                      disabled={status==='loading'||status==='success'}
                    >
                      <Phone className="w-5 h-5" /> Phone
                    </button>
                  </div>
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={status==='loading'||status==='success'}
                  className="w-full px-3 py-2 sm:px-6 sm:py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-full font-bold text-base sm:text-lg transition-all duration-200 shadow-lg disabled:opacity-60 mt-2"
                >
                  {status==='loading' ? (
                    <Loader className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    'Subscribe'
                  )}
                </motion.button>
                {status==='success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-green-400 text-sm mt-2"
                  >
                    Subscription successful! 🎉
                  </motion.div>
                )}
                {status==='error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm mt-2"
                  >
                    {error}
                  </motion.div>
                )}
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NewsletterPopup; 