import { useState, useEffect } from "react"
import {
  Globe,
  MessageCircle,
  Code,
  Star,
  Award,
  Target,
  ArrowRight,
  TrendingUp,
  Users,
  CheckCircle,
  MapPin,
  Mail,
  Phone
} from "lucide-react"
import { motion } from "framer-motion"
import SEO from '@/components/SEO'

const About = () => {
  // Animated counting effect for stats
  const [counts, setCounts] = useState({
    projects: 0,
    clients: 0,
    experience: 0,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setCounts((prev) => {
        const next = {
          projects: prev.projects < 100 ? prev.projects + 2 : prev.projects,
          clients: prev.clients < 50 ? prev.clients + 1 : prev.clients,
          experience: prev.experience < 5 ? prev.experience + 1 : prev.experience,
        }
        // Stop interval if all targets reached
        if (next.projects === 100 && next.clients === 50 && next.experience === 5) {
          clearInterval(interval)
        }
        return next
      })
    }, 50)
    return () => clearInterval(interval)
  }, [])

  // Skills categories
  const skills = [
    {
      category: "Web Development",
      icon: <Code size={24} />,
      items: ["React", "Next.js", "JavaScript", "HTML/CSS", "PHP"]
    },
    {
      category: "Digital Marketing",
      icon: <TrendingUp size={24} />,
      items: ["SEO", "Google Analytics & Ads", "Content Strategy", "Social Media Marketing"]
    },
    {
      category: "Design",
      icon: <Globe size={24} />,
      items: ["UI/UX Design", "Responsive Design", "Branding", "Figma"]
    },
    {
      category: "Platforms",
      icon: <Target size={24} />,
      items: ["AWS Amplify"]
    }
  ]

  // Agency values
  const values = [
    {
      icon: <Award size={32} />,
      title: "Quality First",
      description: "We deliver exceptional results that exceed expectations"
    },
    {
      icon: <Users size={32} />,
      title: "Client-Focused",
      description: "Your success is our priority, always"
    },
    {
      icon: <Star size={32} />,
      title: "Innovation",
      description: "Using cutting-edge technologies and creative solutions"
    },
    {
      icon: <CheckCircle size={32} />,
      title: "Reliability",
      description: "Consistent delivery and ongoing support you can count on"
    }
  ]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  }

  return (
    <>
      <SEO
        title="About Us - Expert Web Development Agency"
        description="Learn about DevTone, a professional web development agency specializing in custom websites, digital marketing, and innovative solutions. Meet our team and discover our commitment to excellence."
        keywords={['about DevTone', 'web development agency', 'digital marketing experts', 'professional team', 'web design services', 'development expertise']}
        ogUrl="https://devtone.agency/about"
      />
      <div className="min-h-screen pt-24 bg-[#030718]">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden -z-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute top-1/3 -left-20 w-60 h-60 bg-purple-300 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-20 right-1/4 w-60 h-60 bg-purple-700 rounded-full opacity-10 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <motion.section
            className="py-20 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-block px-4 py-1 mb-6 text-purple-300 border border-purple-500/50 rounded-full text-sm backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              About Us
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-6 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Your Digital <span className="text-purple-400">Success Partner</span>
            </motion.h1>

            <motion.p
              className="text-xl text-white/80 max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              DevTone is a professional web development agency dedicated to creating exceptional digital experiences.
              We combine technical expertise with creative vision to help businesses thrive online.
            </motion.p>
          </motion.section>

          {/* Stats Section */}
          <motion.section
            className="py-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            aria-label="Company statistics"
            role="region"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto" aria-live="polite">
              {[
                { value: counts.projects, label: "Projects Completed", suffix: "+" },
                { value: counts.clients, label: "Happy Clients", suffix: "+" },
                { value: counts.experience, label: "Years Experience", suffix: "+" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center p-6 backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  role="status"
                  aria-label={stat.label + ': ' + stat.value + stat.suffix}
                >
                  <div className="text-4xl font-bold text-purple-400 mb-2">{stat.value}{stat.suffix}</div>
                  <div className="text-white/70">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* About Content */}
          <motion.section
            className="py-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <motion.h2
                  className="text-3xl font-bold mb-6 text-white"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  About <span className="text-purple-400">Our Agency</span>
                </motion.h2>

                <motion.div
                  className="space-y-4 text-white/80"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <motion.p variants={itemVariants}>
                    DevTone is a full-service web development agency founded with a mission to help businesses
                    establish a powerful online presence. We specialize in creating custom websites, e-commerce
                    solutions, and digital marketing strategies that drive real results.
                  </motion.p>
                  <motion.p variants={itemVariants}>
                    Our team combines years of experience in web development, design, and digital marketing to
                    deliver comprehensive solutions. We work with businesses of all sizes, from startups to
                    established enterprises, helping them achieve their digital goals.
                  </motion.p>
                  <motion.p variants={itemVariants}>
                    At DevTone, we believe in building long-term partnerships with our clients. We don't just
                    deliver projects – we provide ongoing support and optimization to ensure your digital
                    presence continues to grow and evolve with your business.
                  </motion.p>
                </motion.div>
              </div>

              <div className="space-y-6">
                <motion.div
                  className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <MapPin className="text-purple-400" size={24} />
                    <h3 className="text-xl font-semibold text-white">Location</h3>
                  </div>
                  <p className="text-white/80">Based globally, serving clients worldwide</p>
                </motion.div>

                <motion.div
                  className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Mail className="text-purple-400" size={24} />
                    <h3 className="text-xl font-semibold text-white">Contact</h3>
                  </div>
                  <p className="text-white/80">support@devtone.agency</p>
                </motion.div>

                <motion.div
                  className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Phone className="text-purple-400" size={24} />
                    <h3 className="text-xl font-semibold text-white">Support</h3>
                  </div>
                  <p className="text-white/80">24/7 client support available</p>
                </motion.div>
              </div>
            </div>
          </motion.section>

          {/* Skills Section */}
          <motion.section
            className="py-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <motion.h2
                className="text-3xl font-bold mb-4 text-white"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Our <span className="text-purple-400">Expertise</span>
              </motion.h2>
              <motion.p
                className="text-white/70 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                We offer a comprehensive range of services to help your business succeed online
              </motion.p>
            </div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {skills.map((skill, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <div className="text-purple-400">{skill.icon}</div>
                    </div>
                    <h3 className="text-xl font-semibold text-white">{skill.category}</h3>
                  </div>

                  <ul className="space-y-2">
                    {skill.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-white/80">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          {/* Values Section */}
          <motion.section
            className="py-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <motion.h2
                className="text-3xl font-bold mb-4 text-white"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Our <span className="text-purple-400">Values</span>
              </motion.h2>
              <motion.p
                className="text-white/70 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                The principles that guide everything we do
              </motion.p>
            </div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 text-center"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <div className="text-purple-400">{value.icon}</div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                  <p className="text-white/70">{value.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          {/* CTA Section */}
          <motion.section
            className="py-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="max-w-4xl mx-auto backdrop-blur-lg bg-gradient-to-r from-purple-500/20 to-purple-700/20 border border-white/10 rounded-2xl p-8 md:p-12 text-center">
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-4 text-white"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Ready to Work <span className="text-purple-400">Together</span>?
              </motion.h2>

              <motion.p
                className="text-xl text-white/80 mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Let's discuss your project and see how DevTone can help bring your digital vision to life.
              </motion.p>

              <motion.a
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 rounded-full font-semibold text-white transition-all"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                tabIndex={0}
                aria-label="Contact DevTone - Get In Touch"
                role="button"
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" focusable="false" />
                Get In Touch
                <ArrowRight className="h-4 w-4" aria-hidden="true" focusable="false" />
              </motion.a>
            </div>
          </motion.section>
        </div>
      </div>
    </>
  )
}

export default About