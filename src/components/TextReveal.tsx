import { motion } from 'framer-motion'

interface TextRevealProps {
  text: string
  className?: string
  delay?: number
}

const TextReveal = ({ text, className = '', delay = 0 }: TextRevealProps) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, delay, ease: [0.33, 1, 0.68, 1] }}
      >
        {text}
      </motion.div>
      <motion.div
        className="absolute inset-0 bg-purple-500"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ duration: 1, delay: delay + 0.2, ease: [0.33, 1, 0.68, 1] }}
      />
    </div>
  )
}

export default TextReveal