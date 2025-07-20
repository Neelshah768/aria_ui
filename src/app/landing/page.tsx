'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Bot, 
  Zap, 
  MessageSquare, 
  Users, 
  BarChart3, 
  CheckCircle,
  Star,
  Mail,
  Clock,
  Shield,
  Sparkles,
  TrendingUp,
  Brain,
  Headphones
} from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const [activePricingPlan, setActivePricingPlan] = useState('pro');

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const scaleIn = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen bg-[var(--dark-bg-primary)] text-white overflow-x-hidden">
      {/* Navigation */}
      <motion.nav 
        className="fixed top-0 w-full z-50 bg-[var(--dark-bg-secondary)]/80 backdrop-blur-lg border-b border-[var(--dark-border)]"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">ARIA</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
              <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Reviews</a>
              <Link 
                href="/"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-2 rounded-lg font-medium transition-all duration-200"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            variants={staggerChildren}
            initial="initial"
            animate="animate"
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full">
                <Sparkles className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-400">AI-Powered Customer Support</span>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              variants={fadeInUp}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight"
            >
              <span className="gradient-text">Smooth Conversations</span>
              <br />
              <span className="text-white">Powered by AI</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              variants={fadeInUp}
              className="text-xl sm:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
            >
              ARIA transforms your customer support with intelligent AI that understands, 
              responds, and resolves inquiries automatically - creating seamless conversations 
              that delight your customers.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12"
            >
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all duration-300"
                >
                  Try ARIA Free
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
              </Link>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 border border-gray-600 hover:border-gray-500 rounded-xl font-semibold text-lg transition-all duration-300"
              >
                Watch Demo
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              variants={fadeInUp}
              className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto"
            >
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold gradient-text">95%</div>
                <div className="text-gray-400 mt-2">Resolution Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold gradient-text">&lt;2min</div>
                <div className="text-gray-400 mt-2">Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold gradient-text">24/7</div>
                <div className="text-gray-400 mt-2">AI Support</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--dark-bg-secondary)]">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold gradient-text mb-6">
              Why Choose ARIA?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our AI-powered platform revolutionizes customer support with intelligent automation, 
              real-time analytics, and seamless integrations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Bot,
                title: 'Intelligent AI Responses',
                description: 'Advanced AI understands context and provides accurate, helpful responses to customer inquiries automatically.',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                icon: MessageSquare,
                title: 'Multi-Channel Support',
                description: 'Seamlessly handle emails, chat, and tickets from a unified dashboard with consistent AI assistance.',
                color: 'from-purple-500 to-pink-500'
              },
              {
                icon: BarChart3,
                title: 'Real-Time Analytics',
                description: 'Monitor performance, track resolution rates, and gain insights with comprehensive analytics dashboard.',
                color: 'from-green-500 to-teal-500'
              },
              {
                icon: Brain,
                title: 'Smart Learning',
                description: 'AI continuously learns from interactions to improve response accuracy and customer satisfaction.',
                color: 'from-orange-500 to-red-500'
              },
              {
                icon: Shield,
                title: 'Enterprise Security',
                description: 'Bank-level security with data encryption, compliance standards, and privacy protection.',
                color: 'from-indigo-500 to-purple-500'
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Instant responses and real-time processing ensure your customers never wait for support.',
                color: 'from-yellow-500 to-orange-500'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="bg-[var(--dark-bg-card)] border border-[var(--dark-border)] rounded-2xl p-8 hover:border-[var(--dark-border-light)] transition-all duration-300"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold gradient-text mb-6">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Choose the perfect plan for your business. All plans include our core AI features 
              with scalable options for growing teams.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'Starter',
                price: '$29',
                period: '/month',
                description: 'Perfect for small businesses getting started with AI support',
                features: [
                  'Up to 1,000 tickets/month',
                  'Email & chat support',
                  'Basic AI responses',
                  'Standard analytics',
                  '5 team members'
                ],
                popular: false
              },
              {
                name: 'Professional',
                price: '$99',
                period: '/month',
                description: 'Ideal for growing businesses with advanced AI needs',
                features: [
                  'Up to 10,000 tickets/month',
                  'Multi-channel support',
                  'Advanced AI with learning',
                  'Real-time analytics',
                  'Unlimited team members',
                  'Custom integrations',
                  'Priority support'
                ],
                popular: true
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                period: '',
                description: 'Tailored solutions for large organizations with custom requirements',
                features: [
                  'Unlimited tickets',
                  'White-label solution',
                  'Advanced AI training',
                  'Custom analytics',
                  'Dedicated support',
                  'SLA guarantees',
                  'On-premise option'
                ],
                popular: false
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className={`relative bg-[var(--dark-bg-card)] border rounded-2xl p-8 transition-all duration-300 ${
                  plan.popular 
                    ? 'border-blue-500 bg-gradient-to-b from-blue-500/10 to-purple-500/10' 
                    : 'border-[var(--dark-border)] hover:border-[var(--dark-border-light)]'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold gradient-text">{plan.price}</span>
                    <span className="text-gray-400">{plan.period}</span>
                  </div>
                  <p className="text-gray-400">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                      : 'bg-[var(--dark-bg-secondary)] hover:bg-[var(--dark-bg-hover)] text-white border border-[var(--dark-border)]'
                  }`}
                >
                  {plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--dark-bg-secondary)]">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold gradient-text mb-6">
              Loved by Businesses Worldwide
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Join thousands of companies that trust ARIA to deliver exceptional customer experiences.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'CEO, TechStart Inc',
                content: 'ARIA transformed our customer support completely. Our response times dropped from hours to minutes, and customer satisfaction increased by 40%.',
                avatar: '👩‍💼',
                rating: 5
              },
              {
                name: 'Michael Chen',
                role: 'Support Manager, E-commerce Co',
                content: 'The AI is incredibly smart and learns quickly. It handles 80% of our tickets automatically while maintaining the personal touch our customers love.',
                avatar: '👨‍💻',
                rating: 5
              },
              {
                name: 'Emily Rodriguez',
                role: 'CTO, SaaS Solutions',
                content: 'Implementation was seamless and the analytics provide incredible insights. ARIA pays for itself within the first month through efficiency gains.',
                avatar: '👩‍💻',
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-[var(--dark-bg-card)] border border-[var(--dark-border)] rounded-2xl p-8 hover:border-[var(--dark-border-light)] transition-all duration-300"
              >
                <div className="flex gap-2 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-300 leading-relaxed mb-6">"{testimonial.content}"</p>
                
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{testimonial.avatar}</div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-gray-400 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl sm:text-5xl font-bold">
              <span className="gradient-text">Ready to Transform</span>
              <br />
              <span className="text-white">Your Customer Support?</span>
            </h2>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Join thousands of businesses using ARIA to deliver exceptional customer experiences 
              with the power of AI.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all duration-300"
                >
                  Start Your Free Trial
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
              </Link>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 border border-gray-600 hover:border-gray-500 rounded-xl font-semibold text-lg transition-all duration-300"
              >
                Schedule Demo
              </motion.button>
            </div>

            <div className="text-sm text-gray-500">
              No credit card required • 14-day free trial • Setup in under 5 minutes
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--dark-border)] bg-[var(--dark-bg-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold gradient-text">ARIA</span>
              </div>
              <p className="text-gray-400">
                AI-powered customer support that creates smooth conversations and delighted customers.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="/" className="hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Docs</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[var(--dark-border)] pt-8 mt-12 text-center text-gray-400">
            <p>&copy; 2024 ARIA. All rights reserved. Made with ❤️ for exceptional customer experiences.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 