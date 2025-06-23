import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ThumbsUp, MessageCircle, User, Calendar, ArrowLeft, ArrowRight, ChevronDown, ChevronUp, CheckCircle } from "lucide-react";

// Define the review interface
interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  source: string;
  verified: boolean;
  helpful?: number;
  tags?: string[];
  response?: {
    author: string;
    date: string;
    content: string;
  };
}

interface CustomerReviewsWidgetProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

const CustomerReviewsWidget = ({
  title = "Customer Reviews",
  subtitle = "See what our clients have to say about working with us",
  className = "",
}: CustomerReviewsWidgetProps) => {
  // Sample reviews data
  const reviews: Review[] = [
    {
      id: "1",
      author: "Anonymous User",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5,
      date: "2024-06-25",
      title: "Good service, excellent!",
      content: "Good service, excellent!",
      source: "Google",
      verified: true,
      helpful: 4,
      tags: ["Service Quality"],
      response: {
        author: "DevTone Team",
        date: "2024-06-25",
        content: "Thanks for sharing your experience with us. We are working to make this even better."
      }
    },
    {
      id: "2",
      author: "Lulemba Angelica",
      avatar: "https://randomuser.me/api/portraits/women/22.jpg",
      rating: 5,
      date: "2024-06-25",
      title: "Great marketing team",
      content: "Great marketing team. And you can find them on Instagram as well guys :) 🎁🥰",
      source: "Google",
      verified: true,
      helpful: 5,
      tags: ["Marketing", "Social Media"]
    },
    {
      id: "3",
      author: "Natalia Austin",
      avatar: "https://randomuser.me/api/portraits/women/33.jpg",
      rating: 5,
      date: "2024-06-24",
      title: "Soooo Grateful guys",
      content: "Soooo Grateful guys my beautiful marketing website is not active and functionally. Thx 🥰🥰 Best.. Agency also amazing designs!",
      source: "Google",
      verified: true,
      helpful: 8,
      tags: ["Web Development", "Marketing"],
      response: {
        author: "DevTone Team",
        date: "2024-06-25",
        content: "Thanks for sharing your experience with us. We are working to make this even better."
      }
    },
    {
      id: "4",
      author: "Luan Pereira",
      avatar: "https://randomuser.me/api/portraits/men/42.jpg",
      rating: 5,
      date: "2024-06-25",
      title: "Melhor investimento que fiz",
      content: "Melhor investimento que fiz !! (Best investment I've made!!)",
      source: "Google",
      verified: true,
      helpful: 7,
      tags: ["Investment", "ROI"],
      response: {
        author: "DevTone Team",
        date: "2024-06-25",
        content: "Thanks for sharing your experience with us. We are working to make this even better."
      }
    },
    {
      id: "5",
      author: "Alice Martins",
      avatar: "https://randomuser.me/api/portraits/women/56.jpg",
      rating: 5,
      date: "2024-06-25",
      title: "Ótimo trabalho",
      content: "Ótimo trabalho!! (Great work!!)",
      source: "Google",
      verified: true,
      helpful: 4,
      tags: ["Service Quality"],
      response: {
        author: "DevTone Team",
        date: "2024-06-25",
        content: "Thanks for sharing your experience with us. We are working to make this even better."
      }
    },
    {
      id: "6",
      author: "João Vitor",
      avatar: "https://randomuser.me/api/portraits/men/72.jpg",
      rating: 5,
      date: "2024-06-25",
      title: "Recomendo muito",
      content: "Recomendo muito! (Highly recommend!)",
      source: "Google",
      verified: true,
      helpful: 6,
      tags: ["Recommendation"],
      response: {
        author: "DevTone Team",
        date: "2024-06-25",
        content: "Thanks for sharing your experience with us. We are working to make this even better."
      }
    },
    {
      id: "7",
      author: "Snoopy Lenda",
      avatar: "https://randomuser.me/api/portraits/men/29.jpg",
      rating: 5,
      date: "2024-06-25",
      title: "Recomendo me ajudaram muito",
      content: "Recomendo me ajudaram muito nos meus projetos! (I recommend them, they helped me a lot with my projects!)",
      source: "Google",
      verified: true,
      helpful: 9,
      tags: ["Project Support", "Assistance"],
      response: {
        author: "DevTone Team",
        date: "2024-06-25",
        content: "Thanks for sharing your experience with us. We are working to make this even better."
      }
    },
    {
      id: "8",
      author: "Natasha Leyla",
      avatar: "https://randomuser.me/api/portraits/women/28.jpg",
      rating: 5,
      date: "2024-06-25",
      title: "",
      content: "",
      source: "Google",
      verified: true,
      helpful: 3,
      tags: ["Service"],
      response: {
        author: "DevTone Team",
        date: "2024-06-25",
        content: "Thanks for sharing your experience with us. We are working to make this even better."
      }
    },
    {
      id: "9",
      author: "Matheus Silva",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      rating: 5,
      date: "2024-06-25",
      title: "",
      content: "",
      source: "Google",
      verified: true,
      helpful: 4,
      tags: ["Service"],
      response: {
        author: "DevTone Team",
        date: "2024-06-25",
        content: "Thanks for sharing your experience with us. We are working to make this even better."
      }
    },
    {
      id: "10",
      author: "Sweep Ease",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
      rating: 5,
      date: "2024-06-25",
      title: "",
      content: "",
      source: "Google",
      verified: true,
      helpful: 2,
      tags: ["Service"],
      response: {
        author: "DevTone Team",
        date: "2024-06-25",
        content: "Thanks for sharing your experience with us. We are working to make this even better."
      }
    },
    {
      id: "11",
      author: "NATALIA CRISTINA AUSTIN",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5,
      date: "2024-06-25",
      title: "",
      content: "",
      source: "Google",
      verified: true,
      helpful: 5,
      tags: ["Service"],
      response: {
        author: "DevTone Team",
        date: "2024-06-25",
        content: "Thanks for sharing your experience with us. We are working to make this even better."
      }
    },
    {
      id: "12",
      author: "Matheus Silva",
      avatar: "https://randomuser.me/api/portraits/men/52.jpg",
      rating: 5,
      date: "2024-06-25",
      title: "",
      content: "",
      source: "Google",
      verified: true,
      helpful: 3,
      tags: ["Service"],
      response: {
        author: "DevTone Team",
        date: "2024-06-25",
        content: "Thanks for sharing your experience with us. We are working to make this even better."
      }
    },
    {
      id: "13",
      author: "MATTHEUS",
      avatar: "https://randomuser.me/api/portraits/men/62.jpg",
      rating: 5,
      date: "2024-06-25",
      title: "",
      content: "",
      source: "Google",
      verified: true,
      helpful: 4,
      tags: ["Service"],
      response: {
        author: "DevTone Team",
        date: "2024-06-25",
        content: "Thanks for sharing your experience with us. We are working to make this even better."
      }
    },
    {
      id: "14",
      author: "Guilerxz B7",
      avatar: "https://randomuser.me/api/portraits/men/37.jpg",
      rating: 5,
      date: "2024-06-25",
      title: "Trabalho sensacional",
      content: "Trabalho sensacional! (Sensational work!)",
      source: "Google",
      verified: true,
      helpful: 8,
      tags: ["Quality Work"],
      response: {
        author: "DevTone Team",
        date: "2024-06-25",
        content: "Thanks for sharing your experience with us. We are working to make this even better."
      }
    },
    {
      id: "15",
      author: "Guilherme Nascimento",
      avatar: "https://randomuser.me/api/portraits/men/18.jpg",
      rating: 5,
      date: "2024-06-25",
      title: "Recomendo muito",
      content: "Recomendo muito ! (Highly recommend!)",
      source: "Google",
      verified: true,
      helpful: 5,
      tags: ["Recommendation"],
      response: {
        author: "DevTone Team",
        date: "2024-06-25",
        content: "Thanks for sharing your experience with us. We are working to make this even better."
      }
    },
    {
      id: "16",
      author: "Sanyznx Pretozn",
      avatar: "https://randomuser.me/api/portraits/men/23.jpg",
      rating: 5,
      date: "2024-06-25",
      title: "Empresa muito boa",
      content: "Empresa muito boa me surpreendi com o trabalho deles! (Very good company, I was surprised by their work!)",
      source: "Google",
      verified: true,
      helpful: 7,
      tags: ["Company Quality", "Surprise"],
      response: {
        author: "DevTone Team",
        date: "2024-06-25",
        content: "Thanks for sharing your experience with us. We are working to make this even better."
      }
    },
    {
      id: "17",
      author: "Guilerxz B7",
      avatar: "https://randomuser.me/api/portraits/men/37.jpg",
      rating: 5,
      date: "2024-06-25",
      title: "Trabalho surpreendente",
      content: "Trabalho surpreendente ❤️ (Surprising work ❤️)",
      source: "Google",
      verified: true,
      helpful: 9,
      tags: ["Quality Work", "Surprise"],
      response: {
        author: "DevTone Team",
        date: "2024-06-25",
        content: "Thanks for sharing your experience with us. We are working to make this even better."
      }
    },
    {
      id: "18",
      author: "MATHEUS SILVA",
      avatar: "https://randomuser.me/api/portraits/men/55.jpg",
      rating: 5,
      date: "2024-06-25",
      title: "",
      content: "",
      source: "Google",
      verified: true,
      helpful: 3,
      tags: ["Service"],
      response: {
        author: "DevTone Team",
        date: "2024-06-25",
        content: "Thanks for sharing your experience with us. We are working to make this even better."
      }
    },
    {
      id: "19",
      author: "Mohammed Kande",
      avatar: "https://randomuser.me/api/portraits/men/77.jpg",
      rating: 5,
      date: "2024-06-25",
      title: "",
      content: "",
      source: "Google",
      verified: true,
      helpful: 2,
      tags: ["Service"]
    },
    {
      id: "20",
      author: "Ricardo Souza",
      avatar: "https://randomuser.me/api/portraits/men/61.jpg",
      rating: 5,
      date: "2024-06-25",
      title: "Superou todas minhas expectativas",
      content: "Superou todas minhas expectativas, investimento top recomendo muito. (Exceeded all my expectations, top investment, highly recommend.)",
      source: "Google",
      verified: true,
      helpful: 12,
      tags: ["Expectations", "Investment"]
    },
    {
      id: "21",
      author: "guillerzx Dxs",
      avatar: "https://randomuser.me/api/portraits/men/83.jpg",
      rating: 5,
      date: "2024-06-25",
      title: "Ótimo trabalho recomendo",
      content: "Ótimo trabalho recomendo! (Great work, I recommend!)",
      source: "Google",
      verified: true,
      helpful: 6,
      tags: ["Quality Work", "Recommendation"],
      response: {
        author: "DevTone Team",
        date: "2024-06-25",
        content: "Thanks for sharing your experience with us. We are working to make this even better."
      }
    },
    {
      id: "22",
      author: "Rafael Nunes",
      avatar: "https://randomuser.me/api/portraits/men/75.jpg",
      rating: 5,
      date: "2024-06-25",
      title: "Meu projeto ficou ótimo",
      content: "Meu projeto ficou ótimo recomendo demais ! (My project turned out great, highly recommend!)",
      source: "Google",
      verified: true,
      helpful: 8,
      tags: ["Project Quality", "Recommendation"]
    },
    {
      id: "23",
      author: "Juliana Alves",
      avatar: "https://randomuser.me/api/portraits/women/66.jpg",
      rating: 5,
      date: "2024-06-25",
      title: "Melhor atendimento recomendo",
      content: "Melhor atendimento recomendo! (Best service, I recommend!)",
      source: "Google",
      verified: true,
      helpful: 7,
      tags: ["Customer Service", "Recommendation"],
      response: {
        author: "DevTone Team",
        date: "2024-06-25",
        content: "Thanks for sharing your experience with us. We are working to make this even better."
      }
    },
    {
      id: "24",
      author: "Bruno Gomes",
      avatar: "https://randomuser.me/api/portraits/men/83.jpg",
      rating: 5,
      date: "2024-06-25",
      title: "Recomendo muito",
      content: "Recomendo muito, fiquei satisfeito com o projeto! (Highly recommend, I was satisfied with the project!)",
      source: "Google",
      verified: true,
      helpful: 9,
      tags: ["Satisfaction", "Project Quality"],
      response: {
        author: "DevTone Team",
        date: "2024-06-25",
        content: "Thanks for sharing your experience with us. We are working to make this even better."
      }
    },
    {
      id: "25",
      author: "Letícia Nunes",
      avatar: "https://randomuser.me/api/portraits/women/75.jpg",
      rating: 5,
      date: "2024-06-25",
      title: "Melhor investimento que fiz",
      content: "Melhor investimento que fiz recomendo muito!! (Best investment I've made, highly recommend!!)",
      source: "Google",
      verified: true,
      helpful: 11,
      tags: ["Investment", "Recommendation"],
      response: {
        author: "DevTone Team",
        date: "2024-06-25",
        content: "Thanks for sharing your experience with us. We are working to make this even better."
      }
    },
    {
      id: "26",
      author: "Natalia Austin",
      avatar: "https://randomuser.me/api/portraits/women/33.jpg",
      rating: 5,
      date: "2024-06-25",
      title: "",
      content: "",
      source: "Google",
      verified: true,
      helpful: 4,
      tags: ["Service"],
      response: {
        author: "DevTone Team",
        date: "2024-06-25",
        content: "Thanks for sharing your experience with us. We are working to make this even better."
      }
    }
  ];

  // State for active review and pagination
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  const [visibleReviews, setVisibleReviews] = useState(6);
  const [expandedReviews, setExpandedReviews] = useState<string[]>([]);
  const [expandedResponses, setExpandedResponses] = useState<string[]>([]);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [filterSource, setFilterSource] = useState<string | null>(null);
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [helpfulClicked, setHelpfulClicked] = useState<string[]>([]);
  
  // Refs
  const reviewsContainerRef = useRef<HTMLDivElement>(null);

  // Filter reviews based on selected filters
  const filteredReviews = reviews.filter(review => {
    if (filterRating !== null && review.rating !== filterRating) return false;
    if (filterSource !== null && review.source !== filterSource) return false;
    if (filterTag !== null && !review.tags?.includes(filterTag)) return false;
    return true;
  });

  // Handle pagination
  const loadMoreReviews = () => {
    setVisibleReviews(prev => Math.min(prev + 6, filteredReviews.length));
  };

  const loadLessReviews = () => {
    setVisibleReviews(prev => Math.max(prev - 6, 6));
  };

  // Handle review expansion
  const toggleReviewExpansion = (id: string) => {
    setExpandedReviews(prev => 
      prev.includes(id) ? prev.filter(reviewId => reviewId !== id) : [...prev, id]
    );
  };

  // Handle response expansion
  const toggleResponseExpansion = (id: string) => {
    setExpandedResponses(prev => 
      prev.includes(id) ? prev.filter(reviewId => reviewId !== id) : [...prev, id]
    );
  };

  // Handle helpful click
  const handleHelpfulClick = (id: string) => {
    if (!helpfulClicked.includes(id)) {
      setHelpfulClicked(prev => [...prev, id]);
      // Update the helpful count in the reviews array
      // In a real app, this would be an API call
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilterRating(null);
    setFilterSource(null);
    setFilterTag(null);
  };

  // Get all unique sources
  const sources = Array.from(new Set(reviews.map(review => review.source)));
  
  // Get all unique tags
  const tags = Array.from(new Set(reviews.flatMap(review => review.tags || [])));

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 15 
      }
    },
    hover: {
      y: -5,
      boxShadow: "0 10px 25px -5px rgba(168, 85, 247, 0.3)",
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div 
      className={`w-full ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div 
        className="text-center mb-12"
        variants={itemVariants}
      >
        <motion.div 
          className="inline-block px-5 py-1.5 mb-4 text-purple-200 border border-purple-500/50 rounded-full text-sm backdrop-blur-sm relative overflow-hidden shadow-md"
          whileHover={{ scale: 1.05 }}
        >
          <span className="relative z-10 font-medium">Customer Feedback</span>
          <motion.div 
            className="absolute inset-0 bg-purple-500/30"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6 }}
          />
        </motion.div>
        
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400">
          {title}
        </h2>
        
        <p className="text-white/80 max-w-2xl mx-auto text-lg">
          {subtitle}
        </p>
      </motion.div>

      {/* Featured Review Carousel */}
      <motion.div 
        className="mb-16"
        variants={itemVariants}
      >
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur-lg opacity-25"></div>
          <div className="relative bg-[#0a0e24]/90 backdrop-blur-md border border-purple-500/20 rounded-2xl p-8 overflow-hidden shadow-xl">
            {/* Top decorative element */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-70"></div>
            
            {/* Side decorative elements */}
            <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-transparent via-purple-500/40 to-transparent"></div>
            <div className="absolute top-0 bottom-0 right-0 w-1 bg-gradient-to-b from-transparent via-purple-500/40 to-transparent"></div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeReviewIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="relative z-10"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Avatar and author info */}
                  <div className="flex flex-col items-center md:items-start">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-purple-500/30 mb-3">
                      <img 
                        src={reviews[activeReviewIndex].avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(reviews[activeReviewIndex].author)}&background=8B5CF6&color=fff`} 
                        alt={reviews[activeReviewIndex].author}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="text-white font-semibold text-lg">{reviews[activeReviewIndex].author}</h4>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < reviews[activeReviewIndex].rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} 
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-white/60 text-sm">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(reviews[activeReviewIndex].date)}</span>
                    </div>
                    <div className="mt-3 px-3 py-1 bg-purple-500/20 rounded-full text-xs text-white">
                      {reviews[activeReviewIndex].source}
                    </div>
                  </div>
                  
                  {/* Review content */}
                  <div className="flex-1">
                    <div className="text-purple-300 mb-2">
                      <Quote className="w-8 h-8 opacity-50" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">{reviews[activeReviewIndex].title}</h3>
                    <p className="text-white/80 mb-4 leading-relaxed">
                      {reviews[activeReviewIndex].content}
                    </p>
                    
                    {/* Tags */}
                    {reviews[activeReviewIndex].tags && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {reviews[activeReviewIndex].tags.map(tag => (
                          <span 
                            key={tag} 
                            className="px-3 py-1 bg-white/10 rounded-full text-xs text-white"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Response */}
                    {reviews[activeReviewIndex].response && (
                      <div className="mt-4 bg-white/5 border border-purple-500/20 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-purple-500/30 flex items-center justify-center">
                            <MessageCircle className="w-3 h-3 text-purple-300" />
                          </div>
                          <span className="text-white font-medium text-sm">Response from {reviews[activeReviewIndex].response.author}</span>
                        </div>
                        <p className="text-white/70 text-sm">
                          {reviews[activeReviewIndex].response.content}
                        </p>
                        <div className="text-white/50 text-xs mt-2">
                          {formatDate(reviews[activeReviewIndex].response.date)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Navigation controls */}
            <div className="flex justify-between mt-8">
              <motion.button
                onClick={() => setActiveReviewIndex(prev => (prev === 0 ? reviews.length - 1 : prev - 1))}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              
              <div className="flex items-center gap-1">
                {reviews.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setActiveReviewIndex(index)}
                    className={`w-2 h-2 rounded-full ${activeReviewIndex === index ? 'bg-purple-500' : 'bg-white/30'}`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>
              
              <motion.button
                onClick={() => setActiveReviewIndex(prev => (prev === reviews.length - 1 ? 0 : prev + 1))}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
            
            {/* Bottom decorative element */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-70"></div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div 
        className="mb-8 flex flex-wrap gap-4 items-center"
        variants={itemVariants}
      >
        <div className="text-white font-medium">Filter by:</div>
        
        {/* Rating filter */}
        <div className="relative">
          <select
            value={filterRating === null ? "" : filterRating.toString()}
            onChange={(e) => setFilterRating(e.target.value === "" ? null : parseInt(e.target.value))}
            className="appearance-none bg-white/10 border border-white/20 rounded-lg px-4 py-2 pr-8 text-white focus:outline-none focus:border-purple-500"
          >
            <option value="" className="bg-gray-800">All Ratings</option>
            {[5, 4, 3, 2, 1].map(rating => (
              <option key={rating} value={rating} className="bg-gray-800">
                {rating} {rating === 1 ? 'Star' : 'Stars'}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
        </div>
        
        {/* Source filter */}
        <div className="relative">
          <select
            value={filterSource === null ? "" : filterSource}
            onChange={(e) => setFilterSource(e.target.value === "" ? null : e.target.value)}
            className="appearance-none bg-white/10 border border-white/20 rounded-lg px-4 py-2 pr-8 text-white focus:outline-none focus:border-purple-500"
          >
            <option value="" className="bg-gray-800">All Sources</option>
            {sources.map(source => (
              <option key={source} value={source} className="bg-gray-800">
                {source}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
        </div>
        
        {/* Tag filter */}
        <div className="relative">
          <select
            value={filterTag === null ? "" : filterTag}
            onChange={(e) => setFilterTag(e.target.value === "" ? null : e.target.value)}
            className="appearance-none bg-white/10 border border-white/20 rounded-lg px-4 py-2 pr-8 text-white focus:outline-none focus:border-purple-500"
          >
            <option value="" className="bg-gray-800">All Categories</option>
            {tags.map(tag => (
              <option key={tag} value={tag} className="bg-gray-800">
                {tag}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
        </div>
        
        {/* Reset filters */}
        {(filterRating !== null || filterSource !== null || filterTag !== null) && (
          <motion.button
            onClick={resetFilters}
            className="px-4 py-2 text-sm text-white bg-purple-500/20 hover:bg-purple-500/30 rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Reset Filters
          </motion.button>
        )}
      </motion.div>

      {/* Reviews list */}
      <motion.div 
        className="space-y-6"
        variants={containerVariants}
        ref={reviewsContainerRef}
      >
        {filteredReviews.length === 0 ? (
          <motion.div 
            className="text-center py-12 bg-white/5 rounded-xl"
            variants={itemVariants}
          >
            <p className="text-white/70">No reviews match your selected filters.</p>
            <motion.button
              onClick={resetFilters}
              className="mt-4 px-6 py-2 bg-purple-500 hover:bg-purple-600 rounded-full text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Show All Reviews
            </motion.button>
          </motion.div>
        ) : (
          filteredReviews.slice(0, visibleReviews).map((review, index) => {
            const isExpanded = expandedReviews.includes(review.id);
            const isResponseExpanded = expandedResponses.includes(review.id);
            const isHelpfulClicked = helpfulClicked.includes(review.id);
            
            return (
              <motion.div
                key={review.id}
                variants={cardVariants}
                whileHover="hover"
                className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-500/30 rounded-xl p-6 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Author info */}
                  <div className="flex md:flex-col items-center md:items-start gap-3 md:gap-0 md:w-48">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20">
                        <img 
                          src={review.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.author)}&background=8B5CF6&color=fff`} 
                          alt={review.author}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="md:mt-3">
                        <h4 className="text-white font-medium">{review.author}</h4>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:items-start mt-2">
                      <div className="flex items-center gap-1 text-white/60 text-xs">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(review.date)}</span>
                      </div>
                      <div className="mt-2 px-2 py-0.5 bg-purple-500/20 rounded-full text-xs text-white">
                        {review.source}
                      </div>
                      {review.verified && (
                        <div className="mt-2 flex items-center gap-1 text-green-400 text-xs">
                          <CheckCircle className="w-3 h-3" />
                          <span>Verified Customer</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Review content */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{review.title}</h3>
                    
                    <div className="relative">
                      <p className={`text-white/80 ${!isExpanded && review.content.length > 200 ? 'line-clamp-3' : ''}`}>
                        {review.content}
                      </p>
                      
                      {review.content.length > 200 && (
                        <motion.button
                          onClick={() => toggleReviewExpansion(review.id)}
                          className="mt-1 text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="w-4 h-4" />
                              <span>Show less</span>
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4" />
                              <span>Read more</span>
                            </>
                          )}
                        </motion.button>
                      )}
                    </div>
                    
                    {/* Tags */}
                    {review.tags && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {review.tags.map(tag => (
                          <span 
                            key={tag} 
                            className="px-2 py-0.5 bg-white/10 rounded-full text-xs text-white"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Response */}
                    {review.response && (
                      <div className="mt-4 bg-white/5 border border-purple-500/20 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-5 h-5 rounded-full bg-purple-500/30 flex items-center justify-center">
                            <MessageCircle className="w-3 h-3 text-purple-300" />
                          </div>
                          <span className="text-white font-medium text-sm">Response from {review.response.author}</span>
                        </div>
                        
                        <div className="relative">
                          <p className={`text-white/70 text-sm ${!isResponseExpanded && review.response.content.length > 150 ? 'line-clamp-2' : ''}`}>
                            {review.response.content}
                          </p>
                          
                          {review.response.content.length > 150 && (
                            <motion.button
                              onClick={() => toggleResponseExpansion(review.id)}
                              className="mt-1 text-purple-400 hover:text-purple-300 text-xs flex items-center gap-1"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {isResponseExpanded ? (
                                <>
                                  <ChevronUp className="w-3 h-3" />
                                  <span>Show less</span>
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-3 h-3" />
                                  <span>Read more</span>
                                </>
                              )}
                            </motion.button>
                          )}
                        </div>
                        
                        <div className="text-white/50 text-xs mt-2">
                          {formatDate(review.response.date)}
                        </div>
                      </div>
                    )}
                    
                    {/* Helpful button */}
                    <div className="mt-4 flex justify-end">
                      <motion.button
                        onClick={() => handleHelpfulClick(review.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                          isHelpfulClicked 
                            ? 'bg-purple-500/30 text-purple-300' 
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={isHelpfulClicked}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>Helpful {review.helpful !== undefined && `(${isHelpfulClicked ? review.helpful + 1 : review.helpful})`}</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </motion.div>

      {/* Pagination controls */}
      {filteredReviews.length > 0 && (
        <motion.div 
          className="mt-8 flex justify-center gap-4"
          variants={itemVariants}
        >
          {visibleReviews > 3 && (
            <motion.button
              onClick={loadLessReviews}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronUp className="w-4 h-4" />
              Show Less
            </motion.button>
          )}
          
          {visibleReviews < filteredReviews.length && (
            <motion.button
              onClick={loadMoreReviews}
              className="px-6 py-2 bg-purple-500 hover:bg-purple-600 rounded-full text-white flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronDown className="w-4 h-4" />
              Load More Reviews
            </motion.button>
          )}
        </motion.div>
      )}

      {/* Review stats */}
      <motion.div 
        className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        variants={containerVariants}
      >
        <motion.div 
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center"
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(168, 85, 247, 0.2)" }}
        >
          <div className="text-3xl font-bold text-white mb-1">5.0</div>
          <div className="flex justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
          <p className="text-white/60 text-sm">Average Rating</p>
        </motion.div>
        
        <motion.div 
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center"
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(168, 85, 247, 0.2)" }}
        >
          <div className="text-3xl font-bold text-white mb-1">26</div>
          <p className="text-white/60 text-sm">Total Reviews</p>
        </motion.div>
        
        <motion.div 
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center"
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(168, 85, 247, 0.2)" }}
        >
          <div className="text-3xl font-bold text-white mb-1">100%</div>
          <p className="text-white/60 text-sm">Satisfaction Rate</p>
        </motion.div>
        
        <motion.div 
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center"
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(168, 85, 247, 0.2)" }}
        >
          <div className="text-3xl font-bold text-white mb-1">24h</div>
          <p className="text-white/60 text-sm">Response Time</p>
        </motion.div>
      </motion.div>

      {/* Call to action */}
      <motion.div 
        className="mt-16 text-center"
        variants={itemVariants}
      >
        <h3 className="text-2xl font-bold text-white mb-4">Ready to Experience Our Service?</h3>
        <p className="text-white/70 mb-6 max-w-2xl mx-auto">
          Join our growing list of satisfied clients and see how we can help transform your digital presence.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.a
            href="/contact"
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-700 rounded-full text-white font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Us
          </motion.a>
          <motion.a
            href="/estimate"
            className="px-8 py-3 bg-white/10 border border-purple-500/30 rounded-full text-white font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get a Quote
          </motion.a>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CustomerReviewsWidget;