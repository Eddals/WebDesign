import { motion } from "framer-motion"
import { Star, Quote, Users, ThumbsUp, Award, MessageSquare } from "lucide-react"
import { useEffect } from "react"

const ReviewsSection = () => {
  useEffect(() => {
    // Load the Tagembed script if not already loaded
    if (!document.querySelector('script[src="https://widget.tagembed.com/embed.min.js"]')) {
      const script = document.createElement('script')
      script.src = 'https://widget.tagembed.com/embed.min.js'
      script.type = 'text/javascript'
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

  const stats = [
    { icon: <Star className="w-5 h-5" />, value: "5.0", label: "Average Rating" },
    { icon: <Users className="w-5 h-5" />, value: "150+", label: "Happy Clients" },
    { icon: <ThumbsUp className="w-5 h-5" />, value: "98%", label: "Satisfaction Rate" },
    { icon: <Award className="w-5 h-5" />, value: "50+", label: "5-Star Reviews" }
  ]

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030718] via-[#0a0e24] to-[#030718] opacity-90"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiIgZD0iTTAgMGg2MHY2MEgweiIvPjxwYXRoIGQ9Ik0zNiAxOGgtMXYyNGgxeiIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjA0Ii8+PHBhdGggZD0iTTI0IDE4aC0xdjI0aDF6IiBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDQiLz48cGF0aCBkPSJNNjAgMzZ2MUgzNnYtMXoiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCIvPjxwYXRoIGQ9Ik02MCAyNHYxSDM2di0xeiIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjA0Ii8+PC9nPjwvc3ZnPg==')] opacity-15"></div>
      
      {/* Enhanced background with dark overlay */}
      <div className="absolute inset-0 bg-[#030718]/70"></div>
      
      {/* Animated gradient orbs with improved visibility */}
      <motion.div 
        className="absolute -top-20 -right-20 w-96 h-96 bg-purple-600 rounded-full opacity-20 blur-[100px]"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
      />
      <motion.div 
        className="absolute bottom-0 -left-20 w-80 h-80 bg-indigo-500 rounded-full opacity-20 blur-[100px]"
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.25, 0.35, 0.25]
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="inline-block px-5 py-1.5 mb-4 text-purple-200 border border-purple-500/50 rounded-full text-sm backdrop-blur-sm relative overflow-hidden shadow-md"
            whileHover={{ scale: 1.05 }}
          >
            <span className="relative z-10 font-medium">Client Reviews</span>
            <motion.div 
              className="absolute inset-0 bg-purple-500/30"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6 }}
            />
          </motion.div>
          
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400 drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Real Stories from Real Clients
          </motion.h2>
          
          <motion.p 
            className="text-white/80 max-w-2xl mx-auto text-lg leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Don't just take our word for it. See what our clients have to say about their experience working with DevTone.
          </motion.p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 + (index * 0.1) }}
              whileHover={{ y: -5 }}
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-purple-500/30 transition-all duration-300">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="text-purple-400">
                    {stat.icon}
                  </div>
                  <span className="text-2xl font-bold text-white">{stat.value}</span>
                </div>
                <p className="text-white/60 text-sm">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Google Reviews Widget Container */}
        <motion.div 
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {/* Decorative Frame */}
          <div className="relative group">
            {/* Glow effect */}
            <motion.div 
              className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur-lg opacity-25 group-hover:opacity-50"
              animate={{ 
                opacity: [0.25, 0.4, 0.25],
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Main container with enhanced styling */}
            <div className="relative bg-[#0a0e24]/90 backdrop-blur-md border border-purple-500/20 rounded-2xl p-8 overflow-hidden shadow-xl">
              {/* Top decorative element */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-70"></div>
              
              {/* Side decorative elements */}
              <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-transparent via-purple-500/40 to-transparent"></div>
              <div className="absolute top-0 bottom-0 right-0 w-1 bg-gradient-to-b from-transparent via-purple-500/40 to-transparent"></div>
              
              {/* Google Reviews Widget */}
              <div className="relative z-10">
                <div 
                  className="tagembed-widget rounded-xl overflow-hidden" 
                  style={{
                    width: "100%",
                    height: "600px",
                    overflow: "auto",
                    background: "rgba(10, 14, 36, 0.7)"
                  }} 
                  data-widget-id="289312" 
                  data-website="1"
                ></div>
              </div>
              
              {/* Bottom decorative element */}
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-70"></div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.p 
            className="text-white/70 mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            Ready to join our growing list of satisfied clients?
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <motion.button
              onClick={() => window.location.href = "/estimate"}
              className="group relative px-8 py-4 bg-gradient-to-br from-purple-600/90 via-purple-700/90 to-indigo-800/90
                rounded-xl font-semibold text-lg overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 transform translate-x-full group-hover:translate-x-[-150%] transition-transform duration-700">
                <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
              </div>
              <span className="relative text-white">Start Your Project</span>
            </motion.button>
            
            <motion.button
              onClick={() => window.location.href = "/contact"}
              className="group relative px-8 py-4 bg-transparent border-2 border-purple-500/20
                rounded-xl font-semibold text-lg overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative text-white flex items-center justify-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Leave a Review
              </span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div 
          className="mt-16 flex flex-wrap justify-center items-center gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className="flex items-center gap-2 text-white/60">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
            </svg>
            <span className="text-sm">Google Reviews</span>
          </div>
          
          <div className="flex items-center gap-1 text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-current" />
            ))}
            <span className="text-white/60 ml-2 text-sm">5.0 Rating</span>
          </div>
          
          <div className="flex items-center gap-2 text-white/60">
            <Award className="w-6 h-6" />
            <span className="text-sm">Verified Business</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ReviewsSection