"use client"

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useAnimation, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ShaderBackground from '@/components/ShaderBackground';
import { 
  Play, 
  Brain, 
  Trophy, 
  Users, 
  Star, 
  ArrowRight, 
  Target,
  BarChart3,
  Shield,
  Sparkles,
  Rocket,
  TrendingUp,
  Heart,
  Eye,
  User,
  Video,
  Crown,
  Info,
  Home
} from 'lucide-react';
import { Link } from 'wouter';

// Professional Header Component
const ProfessionalHeader = () => {
  return (
    <header className="relative z-20 flex items-center p-6">
      {/* Logo */}
      <div className="flex items-center">
        <div className="flex items-center space-x-4">
          <img 
            src="/logo.jpg" 
            alt="Asli Stud Logo" 
            className="w-16 h-16 object-contain"
          />
          <span className="text-blue-600 font-bold text-2xl">Asli Stud</span>
        </div>
      </div>
    </header>
  );
};

// Bottom Right Corner Navigation with Icons
const BottomRightNav = () => {
  return (
    <motion.div 
      className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      {/* Sign In Button */}
      <Link href="/auth/login">
        <motion.button
          className="group relative w-14 h-14 bg-blue-200/80 backdrop-blur-sm border border-blue-300 rounded-full flex items-center justify-center text-blue-700 hover:bg-blue-300/80 transition-all duration-300 shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <User className="w-6 h-6" />
          <motion.div
            className="absolute -left-20 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap"
            initial={{ opacity: 0, x: 10 }}
            whileHover={{ opacity: 1, x: 0 }}
          >
            Sign In
          </motion.div>
        </motion.button>
      </Link>

      {/* Features Button */}
      <motion.button
        className="group relative w-14 h-14 bg-cyan-200/80 backdrop-blur-sm border border-cyan-300 rounded-full flex items-center justify-center text-cyan-700 hover:bg-cyan-300/80 transition-all duration-300 shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <Sparkles className="w-6 h-6" />
        <motion.div
          className="absolute -left-20 top-1/2 transform -translate-y-1/2 bg-cyan-600 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap"
          initial={{ opacity: 0, x: 10 }}
          whileHover={{ opacity: 1, x: 0 }}
        >
          Features
        </motion.div>
      </motion.button>

      {/* About Button */}
      <motion.button
        className="group relative w-14 h-14 bg-teal-200/80 backdrop-blur-sm border border-teal-300 rounded-full flex items-center justify-center text-teal-700 hover:bg-teal-300/80 transition-all duration-300 shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <Info className="w-6 h-6" />
        <motion.div
          className="absolute -left-20 top-1/2 transform -translate-y-1/2 bg-teal-600 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap"
          initial={{ opacity: 0, x: 10 }}
          whileHover={{ opacity: 1, x: 0 }}
        >
          About
        </motion.div>
      </motion.button>

      {/* Home Button */}
      <motion.button
        className="group relative w-14 h-14 bg-emerald-200/80 backdrop-blur-sm border border-emerald-300 rounded-full flex items-center justify-center text-emerald-700 hover:bg-emerald-300/80 transition-all duration-300 shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <Home className="w-6 h-6" />
        <motion.div
          className="absolute -left-20 top-1/2 transform -translate-y-1/2 bg-emerald-600 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap"
          initial={{ opacity: 0, x: 10 }}
          whileHover={{ opacity: 1, x: 0 }}
        >
          Home
        </motion.div>
      </motion.button>
    </motion.div>
  );
};

// Professional Hero Content
const ProfessionalHeroContent = () => {
  return (
    <main className="absolute inset-0 flex items-center justify-center z-20">
      <div className="text-center max-w-4xl mx-auto px-8">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-200 to-cyan-200 backdrop-blur-sm mb-6 shadow-lg">
          <span className="text-blue-800 text-sm font-medium">✨ Asli Stud Learning Experience</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-responsive-3xl tracking-tight font-light text-slate-gray-800 mb-responsive">
          <span className="font-bold italic text-indigo-blue-700">Intelligent</span> Learning
          <br />
          <span className="font-light tracking-tight text-teal-green-700">Platform</span>
        </h1>

        {/* Description */}
        <p className="text-responsive-base font-light text-slate-gray-700 mb-responsive leading-relaxed max-w-2xl mx-auto px-responsive">
          Transform your education with our advanced AI technology. Personalized learning paths, 
          interactive content, and intelligent assessments that adapt to your unique learning style.
        </p>

        {/* Buttons */}
        <div className="flex-responsive-col items-center justify-center gap-responsive">
          <Link href="/auth/register">
            <button className="w-full sm:w-auto px-responsive py-responsive rounded-responsive bg-gradient-to-r from-indigo-blue-500 via-teal-green-500 via-amber-gold-500 to-slate-gray-500 text-white font-medium text-responsive-base transition-all duration-200 hover:from-indigo-blue-600 hover:via-teal-green-600 hover:via-amber-gold-600 hover:to-slate-gray-600 cursor-pointer shadow-responsive hover:shadow-xl">
              Get Started
            </button>
          </Link>
          <Link href="/auth/login">
            <button className="w-full sm:w-auto px-responsive py-responsive rounded-responsive bg-white text-blue-600 font-medium text-responsive-base transition-all duration-200 hover:bg-blue-50 cursor-pointer border-responsive border-blue-300 hover:border-blue-400 shadow-responsive">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
};

// Professional Pulsing Circle
const ProfessionalPulsingCircle = () => {
  return (
    <div className="absolute bottom-8 right-8 z-30">
      <div className="relative w-20 h-20 flex items-center justify-center">
        {/* Pulsing Border Circle */}
        <motion.div
          className="w-16 h-16 rounded-full border-2 border-blue-300"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Rotating Text Around the Pulsing Border */}
        <motion.svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          animate={{ rotate: 360 }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          style={{ transform: "scale(1.6)" }}
        >
          <defs>
            <path id="circle" d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
          </defs>
          <text className="text-sm fill-blue-600">
            <textPath href="#circle" startOffset="0%">
              Asli Stud is amazing • Asli Stud is amazing • Asli Stud is amazing •
            </textPath>
          </text>
        </motion.svg>
      </div>
    </div>
  );
};


const Homepage = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const controls = useAnimation();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Personalized learning paths that adapt to your unique learning style and pace."
    },
    {
      icon: Video,
      title: "Interactive Content",
      description: "Engaging video lectures with real-time AI assistance and interactive elements."
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description: "Comprehensive analytics and progress tracking to monitor your learning journey."
    },
    {
      icon: Target,
      title: "Smart Assessments",
      description: "Intelligent assessments that identify knowledge gaps and provide targeted practice."
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Students", icon: Users, color: "from-blue-500 to-cyan-500" },
    { number: "95%", label: "Success Rate", icon: Trophy, color: "from-green-500 to-emerald-500" },
    { number: "1000+", label: "Video Lectures", icon: Play, color: "from-blue-500 to-cyan-500" },
    { number: "24/7", label: "AI Support", icon: Brain, color: "from-teal-500 to-emerald-500" }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      role: "Medical Student, Harvard",
      content: "Asli Stud's AI tutor helped me master complex anatomy concepts in half the time. The personalized approach is revolutionary.",
      rating: 5
    },
    {
      name: "Alex Rodriguez",
      role: "Engineering Student, MIT",
      content: "The interactive problem-solving sessions and real-time feedback transformed my understanding of calculus and physics.",
      rating: 5
    },
    {
      name: "Priya Sharma",
      role: "JEE Aspirant",
      content: "The adaptive learning system identified my weak areas and created a customized study plan. Scored 98% in my final exam!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-gray-100 via-indigo-blue-100 via-teal-green-100 to-amber-gold-100">
      <ProfessionalHeader />
      <BottomRightNav />
      
      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-blue-500 via-teal-green-500 via-amber-gold-500 to-slate-gray-500 z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-blue-200 via-teal-green-200 via-amber-gold-200 to-slate-gray-200">
        <ProfessionalHeroContent />
        <ProfessionalPulsingCircle />
      </section>

      {/* Features Section */}
      <section id="features" className="py-responsive bg-gradient-to-br from-teal-green-100 via-amber-gold-100 via-indigo-blue-100 to-slate-gray-100">
        <div className="container-responsive">
          <motion.div 
            className="text-center mb-responsive"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-responsive-2xl font-bold text-slate-gray-800 mb-responsive">
              Why Choose Asli Stud?
            </h2>
            <p className="text-responsive-lg text-slate-gray-700 max-w-3xl mx-auto px-responsive">
              Experience the future of education with our AI-powered platform designed 
              to maximize your learning potential and exam success.
            </p>
          </motion.div>

          <motion.div 
            className="grid-responsive-4 gap-responsive"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ 
                  y: -10,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                className="group"
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm group-hover:bg-white/90 shadow-lg">
                  <CardHeader className="text-center relative overflow-hidden">
                    <motion.div 
                      className="w-16 h-16 bg-gradient-to-r from-teal-green-500 via-amber-gold-500 via-indigo-blue-500 to-slate-gray-500 rounded-full flex items-center justify-center mx-auto mb-4 relative shadow-lg"
                      whileHover={{ 
                        rotate: 360,
                        scale: 1.1
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      <feature.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    
                    <CardTitle className="text-xl font-bold text-slate-gray-800 group-hover:text-slate-gray-600 transition-colors duration-300">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <motion.p 
                      className="text-slate-gray-700 text-center group-hover:text-slate-gray-600 transition-colors duration-300"
                      whileHover={{ scale: 1.02 }}
                    >
                      {feature.description}
                    </motion.p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-amber-gold-100 via-slate-gray-100 via-indigo-blue-100 to-teal-green-100 backdrop-blur-sm relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center group cursor-pointer"
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                onHoverStart={() => setIsHovering(true)}
                onHoverEnd={() => setIsHovering(false)}
              >
                <motion.div 
                  className="relative mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                </motion.div>
                
                <motion.div 
                  className="text-4xl md:text-5xl font-bold text-slate-gray-800 mb-2"
                  whileHover={{ scale: 1.1 }}
                >
                  {stat.number}
                </motion.div>
                
                <motion.div 
                  className="text-slate-gray-700 font-medium"
                  whileHover={{ color: "#334155" }}
                >
                  {stat.label}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-black/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              What Our Students Say
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Join thousands of successful students who have transformed their learning journey with Asli Stud.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full bg-white/10 backdrop-blur-sm border-0 hover:bg-white/20 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-blue-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-white/80 mb-4 italic">
                      "{testimonial.content}"
                    </p>
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-white/60 text-sm">{testimonial.role}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-gray-800 mb-6">
              About Asli Stud
            </h2>
            <p className="text-xl text-slate-gray-700 max-w-3xl mx-auto">
              We're revolutionizing education with cutting-edge AI technology, making learning personalized, 
              engaging, and effective for students worldwide.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              variants={fadeInUp}
              className="text-center group"
            >
              <Card className="h-full bg-white/10 backdrop-blur-sm border-0 hover:bg-white/20 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-gray-800 mb-3">AI-Powered</h3>
                  <p className="text-slate-gray-700">
                    Advanced artificial intelligence that adapts to your learning style and pace.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="text-center group"
            >
              <Card className="h-full bg-white/10 backdrop-blur-sm border-0 hover:bg-white/20 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-gray-800 mb-3">Community</h3>
                  <p className="text-slate-gray-700">
                    Join thousands of students in a supportive learning community.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="text-center group"
            >
              <Card className="h-full bg-white/10 backdrop-blur-sm border-0 hover:bg-white/20 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-gray-800 mb-3">Results</h3>
                  <p className="text-slate-gray-700">
                    Proven track record with 95% success rate and improved learning outcomes.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-blue-800/80 via-teal-green-800/80 via-amber-gold-800/80 to-slate-gray-800/80 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Rocket className="w-4 h-4" />
              <span>Join the Learning Revolution</span>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join thousands of students who are already experiencing the future of education.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/auth/register">
                  <Button size="lg" className="bg-white text-black hover:bg-white/90 px-8 py-4 text-lg shadow-2xl">
                    <motion.div
                      className="flex items-center"
                      whileHover={{ x: 5 }}
                    >
                      Get Started Free
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </motion.div>
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/auth/login">
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg backdrop-blur-sm">
                    <motion.div
                      className="flex items-center"
                      whileHover={{ x: 5 }}
                    >
                      Sign In
                      <Eye className="ml-2 w-5 h-5" />
                    </motion.div>
                  </Button>
                </Link>
              </motion.div>
            </div>
            
            {/* Super Admin Access */}
            <div className="mt-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
              >
                <Link href="/super-admin/login">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-blue-300 text-blue-200 hover:bg-blue-500/20 hover:text-blue-100 backdrop-blur-sm"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Super Admin Access
                  </Button>
                </Link>
              </motion.div>
            </div>
            
            {/* Trust indicators */}
            <motion.div
              className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white/70"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span className="text-sm">Secure & Private</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5" />
                <span className="text-sm">Loved by 50K+ Students</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm">95% Success Rate</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;