import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { motion } from 'framer-motion'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    this.setState({ error, errorInfo })
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-[#030718] flex items-center justify-center px-4">
          {/* Background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
            <div className="absolute top-1/3 -left-20 w-60 h-60 bg-purple-300 rounded-full opacity-10 blur-3xl"></div>
          </div>

          <div className="text-center relative z-10 max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Error Icon */}
              <motion.div
                className="w-20 h-20 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <AlertTriangle className="w-10 h-10 text-red-400" />
              </motion.div>

              {/* Error Message */}
              <motion.h1
                className="text-3xl md:text-4xl font-bold text-white mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Something went wrong
              </motion.h1>

              <motion.p
                className="text-white/70 text-lg mb-8 max-w-md mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                We're sorry, but something unexpected happened. Please try refreshing the page or go back to the homepage.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <button
                  onClick={this.handleReload}
                  className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 
                    hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-semibold 
                    transition-all duration-300 transform hover:scale-105"
                >
                  <RefreshCw size={20} />
                  <span>Refresh Page</span>
                </button>

                <button
                  onClick={this.handleGoHome}
                  className="group flex items-center gap-2 px-6 py-3 border border-purple-500/30 
                    hover:border-purple-500/50 bg-purple-500/10 hover:bg-purple-500/20 
                    text-white rounded-lg font-semibold transition-all duration-300"
                >
                  <Home size={20} />
                  <span>Go Home</span>
                </button>
              </motion.div>

              {/* Error Details (Development only) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <motion.div
                  className="mt-12 p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-left"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1 }}
                >
                  <h3 className="text-red-400 font-semibold mb-2">Error Details (Development)</h3>
                  <pre className="text-red-300 text-sm overflow-auto max-h-40">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary