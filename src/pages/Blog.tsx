import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Calendar, MessageCircle, ThumbsUp, BookmarkPlus,
  Share2, TrendingUp, Filter, Clock, Eye, Tag
} from 'lucide-react'
import SEO from '@/components/SEO'

interface BlogPost {
  id: number
  title: string
  excerpt: string
  content: string
  author: {
    name: string
    avatar: string
    role: string
  }
  date: string
  readTime: string
  category: string
  tags: string[]
  imageUrl: string
  likes: number
  views: number
  comments: Comment[]
  isFeatured?: boolean
}

interface Comment {
  id: number
  author: string
  content: string
  date: string
  likes: number
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [activePost, setActivePost] = useState<BlogPost | null>(null)
  const [sortBy, setSortBy] = useState('latest')
  const searchRef = useRef<HTMLInputElement>(null)

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "Advanced SEO Strategies for 2025: AI-Driven Optimization",
      excerpt: "Discover how artificial intelligence is revolutionizing SEO practices and learn to leverage these tools for better rankings.",
      content: "Detailed content about AI-driven SEO...",
      author: {
        name: "Matheus Silva",
        avatar: "/images/author-avatar.jpg",
        role: "SEO Specialist"
      },
      date: "2025-04-14",
      readTime: "8 min read",
      category: "SEO",
      tags: ["SEO", "AI", "Digital Marketing"],
      imageUrl: "/images/seo-ai-strategies.jpg",
      likes: 156,
      views: 1234,
      comments: [
        {
          id: 1,
          author: "John Doe",
          content: "This is exactly what I needed! The AI tools mentioned are game-changers.",
          date: "2025-04-14",
          likes: 12
        }
      ],
      isFeatured: true
    },
    // Add more posts...
  ]

  useEffect(() => {
    // Simulate loading posts
    setTimeout(() => {
      setPosts(blogPosts)
      setIsLoading(false)
    }, 1000)
  }, [])

  const filterAndSortPosts = () => {
    let filtered = [...posts]
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => 
        post.category.toLowerCase() === selectedCategory.toLowerCase()
      )
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Sort posts
    switch (sortBy) {
      case 'latest':
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        break
      case 'popular':
        filtered.sort((a, b) => b.views - a.views)
        break
      case 'trending':
        filtered.sort((a, b) => b.likes - a.likes)
        break
    }

    return filtered
  }

  return (
    <>
      <SEO
        title="DevTone Blog - Web Development & Digital Marketing Insights"
        description="Stay updated with the latest web development trends, SEO strategies, and digital marketing insights from DevTone's expert team. Learn, grow, and succeed online."
        keywords={['web development blog', 'SEO tips', 'digital marketing insights', 'DevTone blog', 'web design trends', 'development tutorials']}
        ogUrl="https://devtone.com/blog"
      />
      <div className="min-h-screen bg-[#030718]">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-32 pb-16 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 to-blue-900/30" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Digital Marketing Insights
          </motion.h1>
          <motion.p 
            className="text-xl text-center text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Expert tips and strategies on SEO, marketing, and web development
          </motion.p>
        </div>
      </motion.section>

      {/* Advanced Search and Filter Section */}
      <section className="py-8 border-b border-purple-500/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="relative w-full md:w-96 group">
              <input
                ref={searchRef}
                type="text"
                placeholder="Search articles..."
                className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute right-3 top-3 text-gray-400 group-hover:text-purple-400 transition-colors" />
            </div>

            <div className="flex flex-wrap gap-3">
              {["All", "SEO", "Marketing", "Development", "Analytics"].map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setSelectedCategory(category.toLowerCase())}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category.toLowerCase()
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/5 text-gray-300 hover:bg-purple-500/20'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts Carousel */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-8">Featured Posts</h2>
          {/* Add carousel component here */}
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filterAndSortPosts().map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 rounded-lg overflow-hidden border border-purple-500/20 hover:border-purple-500/40 transition-all group"
                >
                  {/* Post content */}
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}

export default Blog