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

    try {
      const response = await fetch('/api/newsletter-brevo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          preferredContact
        })
      });

      if (!response.ok) throw new Error('Failed to subscribe');

      setStatus('success');
      setEmail('');
      setFirstName('');
      setLastName('');
      setPhone('');
      setTimeout(() => setOpen(false), 3000);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setError('There was a problem subscribing. Please try again.');
    }
  };

  return (
    <>
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
              className="relative bg-gradient-to-br from-[#12082a] via-[#1a103a] to-[#12082a] border border-white/10 rounded-3xl shadow-2xl p-4 sm:p-8 w-full max-w-xs sm:max-w-md mx-auto text-center"
            >
              <button
                onClick={handleClose}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 focus:outline-none border border-white/20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center mb-2">
                <motion.img
                  src="https://i.imgur.com/qZ9tgbe.png"
                  alt="DevTone Logo"
                  className="w-20 h-20 sm:w-28 sm:h-28 object-contain"
                  initial={{ scale: 0.95, y: 0 }}
                  animate={{ scale: [0.95, 1.05, 0.95], y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white mt-2">Get exclusive news and offers!</h2>
              <p className="text-white/70 text-xs sm:text-sm mt-1">Join our newsletter for updates, tips, and exclusive offers.</p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-4">
                <div className="flex gap-2 flex-col sm:flex-row">
                  <div className="relative w-full sm:w-1/2">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 w-5 h-5" />
                    <input
                      type="text"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/50 text-sm"
                      placeholder="First Name"
                      required
                      disabled={status==='loading'||status==='success'}
                    />
                  </div>
                  <div className="relative w-full sm:w-1/2">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 w-5 h-5" />
                    <input
                      type="text"
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/50 text-sm"
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
                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/50 text-sm"
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
                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/50 text-sm"
                    placeholder="Phone number"
                    required
                    disabled={status==='loading'||status==='success'}
                  />
                </div>

                <div className="text-white text-sm">Preferred contact method:</div>
                <div className="flex gap-2 justify-center">
                  <button
                    type="button"
                    onClick={() => setPreferredContact('email')}
                    className={`px-4 py-2 rounded-full border text-white ${preferredContact==='email' ? 'bg-purple-600' : 'bg-white/10'}`}
                    disabled={status==='loading'||status==='success'}
                  >
                    <Mail className="w-4 h-4 inline mr-1" /> Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreferredContact('phone')}
                    className={`px-4 py-2 rounded-full border text-white ${preferredContact==='phone' ? 'bg-indigo-600' : 'bg-white/10'}`}
                    disabled={status==='loading'||status==='success'}
                  >
                    <Phone className="w-4 h-4 inline mr-1" /> Phone
                  </button>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={status==='loading'||status==='success'}
                  className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-full font-bold mt-2"
                >
                  {status==='loading' ? <Loader className="w-5 h-5 animate-spin mx-auto" /> : 'Subscribe'}
                </motion.button>

                {status==='success' && <div className="text-green-400 text-sm mt-2">Subscription successful! 🎉</div>}
                {status==='error' && <div className="text-red-400 text-sm mt-2">{error}</div>}
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NewsletterPopup;
