import { useState, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import {
  ExternalLink,
  Github,
  Globe,
  Smartphone,
  Monitor,
  Zap,
  Star,
  ArrowRight,
  Eye,
  Calendar,
  Users,
  TrendingUp,
  Award,
  CheckCircle,
  Play
} from "lucide-react"
import SEO from '@/components/SEO'

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedProject, setSelectedProject] = useState(null)
  
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8])

  const filters = [
    { id: 'all', label: 'All Projects', count: 12 },
    { id: 'web-design', label: 'Web Design', count: 5 },
    { id: 'ecommerce', label: 'E-commerce', count: 3 },
    { id: 'landing', label: 'Landing Pages', count: 4 }
  ]

  const projects = [
    {
      id: 1,
      title: "TechFlow Solutions",
      category: "web-design",
      type: "Business Website",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      description: "Modern corporate website for a technology consulting firm with advanced animations and interactive elements.",
      technologies: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
      features: ["Responsive Design", "SEO Optimized", "Fast Loading", "Interactive UI"],
      liveUrl: "#",
      githubUrl: "#",
      completedDate: "2024-01-15",
      client: "TechFlow Inc.",
      duration: "3 weeks",
      results: {
        traffic: "+150%",
        conversion: "+85%",
        performance: "98/100"
      }
    },
    {
      id: 2,
      title: "EcoStore Marketplace",
      category: "ecommerce",
      type: "E-commerce Platform",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
      description: "Sustainable products marketplace with advanced filtering, payment integration, and inventory management.",
      technologies: ["Next.js", "Stripe", "MongoDB", "Node.js"],
      features: ["Payment Gateway", "Inventory System", "User Accounts", "Admin Dashboard"],
      liveUrl: "#",
      githubUrl: "#",
      completedDate: "2024-02-20",
      client: "EcoStore Ltd.",
      duration: "6 weeks",
      results: {
        sales: "+200%",
        users: "5,000+",
        rating: "4.9/5"
      }
    },
    {
      id: 3,
      title: "FitLife Gym Landing",
      category: "landing",
      type: "Landing Page",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
      description: "High-converting landing page for a fitness center with membership signup and class booking features.",
      technologies: ["React", "Tailwind CSS", "EmailJS", "AOS"],
      features: ["Lead Generation", "Class Booking", "Testimonials", "Mobile First"],
      liveUrl: "#",
      githubUrl: "#",
      completedDate: "2024-01-30",
      client: "FitLife Gym",
      duration: "2 weeks",
      results: {
        conversion: "+120%",
        leads: "800+",
        bounce: "-45%"
      }
    },
    {
      id: 4,
      title: "Digital Agency Pro",
      category: "web-design",
      type: "Agency Website",
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop",
      description: "Creative agency portfolio website with stunning animations and project showcases.",
      technologies: ["Vue.js", "GSAP", "Sass", "Netlify"],
      features: ["Portfolio Gallery", "Contact Forms", "Blog System", "Dark Mode"],
      liveUrl: "#",
      githubUrl: "#",
      completedDate: "2024-03-10",
      client: "Creative Pro Agency",
      duration: "4 weeks",
      results: {
        inquiries: "+180%",
        engagement: "+95%",
        awards: "3"
      }
    },
    {
      id: 5,
      title: "RestaurantHub",
      category: "web-design",
      type: "Restaurant Website",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
      description: "Elegant restaurant website with online menu, reservation system, and delivery integration.",
      technologies: ["React", "Firebase", "Stripe", "Google Maps API"],
      features: ["Online Menu", "Reservations", "Delivery", "Reviews"],
      liveUrl: "#",
      githubUrl: "#",
      completedDate: "2024-02-05",
      client: "Bella Vista Restaurant",
      duration: "3 weeks",
      results: {
        reservations: "+160%",
        orders: "+140%",
        reviews: "4.8/5"
      }
    },
    {
      id: 6,
      title: "StartupLaunch",
      category: "landing",
      type: "Product Launch",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop",
      description: "Product launch landing page with email capture, countdown timer, and social proof elements.",
      technologies: ["React", "Tailwind CSS", "Mailchimp", "Analytics"],
      features: ["Email Capture", "Countdown Timer", "Social Proof", "Analytics"],
      liveUrl: "#",
      githubUrl: "#",
      completedDate: "2024-01-20",
      client: "InnovateTech Startup",
      duration: "1 week",
      results: {
        signups: "2,500+",
        conversion: "+95%",
        shares: "1,200+"
      }
    }
  ]

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeFilter)

  const stats = [
    { label: "Projects Completed", value: "50+", icon: <CheckCircle className="w-6 h-6" /> },
    { label: "Happy Clients", value: "40+", icon: <Users className="w-6 h-6" /> },
    { label: "Years Experience", value: "5+", icon: <Award className="w-6 h-6" /> },
    { label: "Success Rate", value: "98%", icon: <TrendingUp className="w-6 h-6" /> }
  ]

  return (
    <>
      <SEO
        title="Portfolio - DevTone Creative Showcase"
        description="Explore our portfolio of stunning websites, e-commerce platforms, and digital solutions. See how DevTone transforms ideas into exceptional digital experiences."
        keywords={['portfolio', 'web design showcase', 'DevTone projects', 'website examples', 'digital portfolio', 'creative work']}
        ogUrl="https://devtone.agency/portfolio"
      />
      <div className="min-h-screen bg-[#030718] overflow-hidden">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden -z-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute top-1/3 -left-20 w-60 h-60 bg-purple-300 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-20 right-1/4 w-60 h-60 bg-purple-700 rounded-full opacity-10 blur-3xl"></div>
        </div>

        {/* Hero Section */}
        <motion.section
          ref={heroRef}
          className="relative pt-32 pb-20 overflow-hidden"
          style={{ opacity, scale }}
        >
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="inline-block px-6 py-2 mb-6 text-purple-300 border border-purple-500/50 rounded-full text-sm backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                ✨ Our Creative Work
              </motion.div>

              <motion.h1
                className="text-5xl md:text-7xl font-bold mb-6 text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Our <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">Portfolio</span>
              </motion.h1>

              <motion.p
                className="text-xl text-white/70 max-w-2xl mx-auto mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Discover our collection of stunning websites, innovative digital solutions, and successful client projects that showcase our expertise and creativity.
              </motion.p>

              {/* Stats */}
              <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-white/60">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        <div className="container mx-auto px-4 pb-24">
          {/* Filter Tabs */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {filters.map((filter) => (
              <motion.button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all ${
                  activeFilter === filter.id
                    ? "bg-purple-500/20 text-white border-2 border-purple-500/50"
                    : "bg-white/5 text-white/70 border-2 border-white/10 hover:border-purple-500/30"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{filter.label}</span>
                <span className="text-xs bg-white/10 px-2 py-1 rounded-full">{filter.count}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Projects Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            layout
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                layout
              >
                {/* Project Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex gap-3">
                      <motion.a
                        href={project.liveUrl}
                        className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-purple-500/50 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ExternalLink className="w-5 h-5" />
                      </motion.a>
                      <motion.button
                        onClick={() => setSelectedProject(project)}
                        className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-purple-500/50 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Eye className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-purple-400 font-medium uppercase tracking-wider">
                      {project.type}
                    </span>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-white/70 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="text-xs bg-white/10 text-white/60 px-2 py-1 rounded-full">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Project Meta */}
                  <div className="flex items-center justify-between text-xs text-white/50">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(project.completedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{project.client}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Section */}
          <motion.div
            className="text-center mt-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto">
              Let's create something amazing together. Contact us to discuss your project and see how we can bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/estimate"
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </motion.a>
              <motion.a
                href="/contact"
                className="px-8 py-3 border border-white/20 hover:border-white/40 text-white rounded-full font-semibold hover:bg-white/5 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Us
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Agency Credits */}
        <motion.div
          className="border-t border-white/10 py-8 mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <img
                src="https://i.imgur.com/N2muQIS.png"
                alt="DevTone Logo"
                className="w-8 h-8 object-contain"
              />
              <span className="text-white font-semibold">DevTone Agency</span>
            </div>
            <p className="text-white/60 text-sm max-w-2xl mx-auto">
              Professional web development and digital marketing agency specializing in creating exceptional digital experiences. 
              All projects showcased are examples of our capabilities and commitment to excellence.
            </p>
            <div className="flex items-center justify-center gap-6 mt-4 text-white/40 text-xs">
              <span>© 2024 DevTone. All rights reserved.</span>
              <span>•</span>
              <span>Professional Portfolio</span>
              <span>•</span>
              <span>Creative Showcase</span>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}

export default Portfolio
