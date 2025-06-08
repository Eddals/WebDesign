"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Calculator } from 'lucide-react';
import EstimateForm from '../components/EstimateForm';
import SEO from '@/components/SEO';

const Estimate = () => {
  return (
    <>
      <SEO
        title="Get a Free SEO Estimate | Professional SEO Services"
        description="Get a detailed estimate for your SEO project. Fill out our form to receive a customized quote based on your specific needs and goals."
        keywords={['SEO estimate', 'SEO quote', 'SEO pricing', 'SEO services cost']}
        ogUrl="https://matheusweb.com/estimate"
      />
      <div className="min-h-screen pt-24 pb-16 bg-[#030718]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Calculator className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-sm font-medium">Free Estimate</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Get Your SEO Estimate</h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Fill out the form below to receive a detailed estimate for your SEO project. We'll analyze your needs and provide a customized quote.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8"
          >
            <EstimateForm />
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Estimate; 
