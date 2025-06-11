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
    { id: 'all', label: 'All Projects', count: 6 },
    { id: 'ecommerce', label: 'E-commerce', count: 2 },
    { id: 'web-design', label: 'Web Applications', count: 4 }
  ]

  const projects = [
    {
      id: 1,
      title: "StyleHub E-commerce",
      category: "ecommerce",
      type: "E-commerce Platform",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
      description: "Complete e-commerce platform for fashion retail with modern design, shopping cart, user authentication, and payment integration. Built with PHP, MySQL, and responsive design.",
      technologies: ["PHP 8.0+", "MySQL", "HTML5", "CSS3", "JavaScript"],
      features: ["Shopping Cart", "User Authentication", "Payment Gateway", "Admin Dashboard", "Product Reviews", "Wishlist"],
      liveUrl: "https://stylehub-demo.devtone.agency",
      githubUrl: "https://github.com/devtone-agency/stylehub-ecommerce",
      completedDate: "2024-01-15",
      client: "StyleHub Fashion",
      duration: "4 weeks",
      results: {
        conversion: "+180%",
        performance: "95/100",
        mobile: "100%"
      }
    },
    {
      id: 2,
      title: "DevTone Agency Website",
      category: "web-design",
      type: "Agency Website",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      description: "Modern agency website with advanced animations, service showcases, portfolio gallery, and integrated contact forms. Built with React and TypeScript.",
      technologies: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "Supabase"],
      features: ["Responsive Design", "SEO Optimized", "Contact Forms", "Portfolio Gallery", "Service Pages"],
      liveUrl: "https://devtone.agency",
      githubUrl: "#",
      completedDate: "2024-02-20",
      client: "DevTone Agency",
      duration: "3 weeks",
      results: {
        traffic: "+250%",
        leads: "+190%",
        performance: "98/100"
      }
    },
    {
      id: 3,
      title: "Restaurant Management System",
      category: "web-design",
      type: "Business Application",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
      description: "Complete restaurant management system with online ordering, table reservations, menu management, and POS integration. Built with modern web technologies.",
      technologies: ["PHP", "MySQL", "Bootstrap", "jQuery", "Chart.js"],
      features: ["Online Ordering", "Table Reservations", "Menu Management", "POS Integration", "Analytics Dashboard"],
      liveUrl: "https://restaurant-demo.devtone.agency",
      githubUrl: "#",
      completedDate: "2024-01-30",
      client: "Bella Vista Restaurant",
      duration: "5 weeks",
      results: {
        orders: "+160%",
        efficiency: "+85%",
        revenue: "+140%"
      }
    },
    {
      id: 4,
      title: "Real Estate Platform",
      category: "web-design",
      type: "Property Portal",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
      description: "Modern real estate platform with property listings, advanced search filters, virtual tours, and agent management system.",
      technologies: ["React", "Node.js", "MongoDB", "Express", "Socket.io"],
      features: ["Property Search", "Virtual Tours", "Agent Portal", "Mortgage Calculator", "Real-time Chat"],
      liveUrl: "https://realestate-demo.devtone.agency",
      githubUrl: "#",
      completedDate: "2024-03-10",
      client: "Prime Properties",
      duration: "6 weeks",
      results: {
        listings: "2,500+",
        inquiries: "+220%",
        sales: "+175%"
      }
    },
    {
      id: 5,
      title: "Healthcare Management Portal",
      category: "web-design",
      type: "Healthcare System",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop",
      description: "Comprehensive healthcare management system with patient records, appointment scheduling, and telemedicine integration.",
      technologies: ["PHP", "MySQL", "Bootstrap", "Chart.js", "WebRTC"],
      features: ["Patient Records", "Appointment Scheduling", "Telemedicine", "Billing System", "Reports"],
      liveUrl: "https://healthcare-demo.devtone.agency",
      githubUrl: "#",
      completedDate: "2024-02-05",
      client: "MedCare Clinic",
      duration: "8 weeks",
      results: {
        efficiency: "+200%",
        patients: "1,500+",
        satisfaction: "4.9/5"
      }
    },
    {
      id: 6,
      title: "Educational Learning Platform",
      category: "ecommerce",
      type: "E-learning Platform",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
      description: "Modern e-learning platform with course management, video streaming, progress tracking, and certification system.",
      technologies: ["React", "Node.js", "MongoDB", "Socket.io", "AWS S3"],
      features: ["Course Management", "Video Streaming", "Progress Tracking", "Certifications", "Live Classes"],
      liveUrl: "https://learning-demo.devtone.agency",
      githubUrl: "#",
      completedDate: "2024-01-20",
      client: "EduTech Academy",
      duration: "7 weeks",
      results: {
        students: "3,200+",
        completion: "+85%",
        revenue: "+300%"
      }
    }
  ]

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeFilter)

  const stats = [
    { label: "Projects Completed", value: "25+", icon: <CheckCircle className="w-6 h-6" /> },
    { label: "Happy Clients", value: "20+", icon: <Users className="w-6 h-6" /> },
    { label: "Years Experience", value: "3+", icon: <Award className="w-6 h-6" /> },
    { label: "Success Rate", value: "100%", icon: <TrendingUp className="w-6 h-6" /> }
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
