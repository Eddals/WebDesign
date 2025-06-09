import { Link } from "react-router-dom"
import { Home as HomeIcon } from "lucide-react"

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-purple-500 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-6">Page Not Found</h2>
        <p className="text-white/70 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 
            hover:bg-purple-600 text-white rounded-lg transition-colors"
        >
          <HomeIcon size={20} />
          Go Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound