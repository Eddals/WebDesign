import { motion } from 'framer-motion'
import { Shield, Eye, Lock, UserCheck, FileText, Mail } from 'lucide-react'
import SEO from '@/components/SEO'

export default function Privacy() {
  return (
    <>
      <SEO
        title="Privacy Policy - DevTone"
        description="Learn how DevTone protects your privacy and handles your personal information. Our comprehensive privacy policy explains our data practices and your rights."
        keywords={['privacy policy', 'data protection', 'DevTone privacy', 'personal information', 'data security']}
      />
      
      <div className="min-h-screen bg-[#030718] pt-24 pb-16">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute top-1/3 -left-20 w-60 h-60 bg-purple-300 rounded-full opacity-10 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-purple-300 border border-purple-500/50 rounded-full text-sm backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Shield size={16} />
              <span>Privacy Policy</span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Your Privacy Matters
            </motion.h1>
            
            <motion.p 
              className="text-white/70 text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              We're committed to protecting your privacy and being transparent about how we collect, use, and protect your information.
            </motion.p>
            
            <motion.p 
              className="text-purple-300 text-sm mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </motion.p>
          </motion.div>

          {/* Content */}
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-8">
              {/* Information We Collect */}
              <motion.section 
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Eye className="w-6 h-6 text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Information We Collect</h2>
                </div>
                
                <div className="space-y-4 text-white/80">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Personal Information</h3>
                    <p>When you contact us or request services, we may collect:</p>
                    <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                      <li>Name and contact information (email, phone number)</li>
                      <li>Business information (company name, website)</li>
                      <li>Project requirements and preferences</li>
                      <li>Communication history and feedback</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Automatically Collected Information</h3>
                    <p>We may automatically collect:</p>
                    <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                      <li>IP address and browser information</li>
                      <li>Pages visited and time spent on our site</li>
                      <li>Referring website information</li>
                      <li>Device and operating system information</li>
                    </ul>
                  </div>
                </div>
              </motion.section>

              {/* How We Use Information */}
              <motion.section 
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">How We Use Your Information</h2>
                </div>
                
                <div className="space-y-4 text-white/80">
                  <p>We use your information to:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Provide and improve our web development and digital marketing services</li>
                    <li>Communicate with you about projects, updates, and support</li>
                    <li>Send you relevant information about our services (with your consent)</li>
                    <li>Analyze website usage to improve user experience</li>
                    <li>Comply with legal obligations and protect our rights</li>
                    <li>Prevent fraud and ensure website security</li>
                  </ul>
                </div>
              </motion.section>

              {/* Information Sharing */}
              <motion.section 
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Lock className="w-6 h-6 text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Information Sharing</h2>
                </div>
                
                <div className="space-y-4 text-white/80">
                  <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in these limited circumstances:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li><strong>Service Providers:</strong> Trusted third-party services that help us operate our business (hosting, analytics, email services)</li>
                    <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                    <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets</li>
                    <li><strong>With Your Consent:</strong> When you explicitly agree to share information</li>
                  </ul>
                </div>
              </motion.section>

              {/* Data Security */}
              <motion.section 
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Data Security</h2>
                </div>
                
                <div className="space-y-4 text-white/80">
                  <p>We implement appropriate security measures to protect your information:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>SSL encryption for data transmission</li>
                    <li>Secure servers and databases</li>
                    <li>Regular security updates and monitoring</li>
                    <li>Limited access to personal information</li>
                    <li>Employee training on data protection</li>
                  </ul>
                  <p className="text-sm text-white/60 mt-4">
                    While we strive to protect your information, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
                  </p>
                </div>
              </motion.section>

              {/* Your Rights */}
              <motion.section 
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Your Rights</h2>
                </div>
                
                <div className="space-y-4 text-white/80">
                  <p>You have the right to:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                    <li><strong>Correct:</strong> Request correction of inaccurate or incomplete information</li>
                    <li><strong>Delete:</strong> Request deletion of your personal information (subject to legal requirements)</li>
                    <li><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time</li>
                    <li><strong>Portability:</strong> Request your data in a portable format</li>
                    <li><strong>Object:</strong> Object to certain uses of your information</li>
                  </ul>
                  <p className="text-sm text-white/60 mt-4">
                    To exercise these rights, please contact us using the information provided below.
                  </p>
                </div>
              </motion.section>

              {/* Contact Information */}
              <motion.section 
                className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Contact Us</h2>
                </div>
                
                <div className="text-white/80">
                  <p className="mb-4">
                    If you have questions about this Privacy Policy or want to exercise your rights, please contact us:
                  </p>
                  <div className="space-y-2">
                    <p><strong>Email:</strong> privacy@devtone.com</p>
                    <p><strong>Website:</strong> <a href="/contact" className="text-purple-400 hover:text-purple-300 transition-colors">Contact Form</a></p>
                  </div>
                  <p className="text-sm text-white/60 mt-6">
                    We will respond to your request within 30 days of receipt.
                  </p>
                </div>
              </motion.section>

              {/* Updates to Policy */}
              <motion.div 
                className="text-center py-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <p className="text-white/60 text-sm">
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}