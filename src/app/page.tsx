"use client";

import { Button } from "@/components/ui/button";
import LandingHero from "@/components/landing/LandingHero";
import ClassroomScene from "@/components/landing/ClassroomScene";
import TestScene from "@/components/landing/TestScene";
import { motion } from "framer-motion";
import { FeatureCard } from "@/components/landing/FeatureCard";
import { Book, Users, MessageSquare, Brain, Coins, Award, Lightbulb, Globe } from "lucide-react";

export default function Home() {
  // Animation variants for staggered section transitions
  const fadeInUpVariant = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section with 3D Classroom */}
      <section className="relative h-screen w-full pt-16 overflow-hidden">
        {/* Three.js Scene Container - Lower z-index to ensure it stays in background */}
        <div className="absolute inset-0 z-0 h-full w-full pt-16">
          <ClassroomScene />
        </div>

        {/* Semi-transparent overlay to improve text readability */}
        <div className="absolute inset-0 z-10 bg-black/30 pointer-events-none"></div>

        {/* Content Overlay - Higher z-index to appear above the 3D scene */}
        <div className="relative z-20 flex h-full w-full items-center justify-center pointer-events-auto">
          <LandingHero />
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: 1.2,
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        >
          <div className="flex flex-col items-center text-white/80">
            <span className="mb-2 text-sm">Scroll to explore</span>
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="animate-bounce"
            >
              <path 
                d="M12 5L12 19M12 19L18 13M12 19L6 13" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <motion.section 
        className="relative overflow-hidden bg-background py-24"
        variants={fadeInUpVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Background decoration */}
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/5" />
        <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-primary/5" />
        
        <div className="container relative">
          <div className="mb-16 text-center">
            <motion.div
              className="mb-2 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Platform Overview
            </motion.div>
            <motion.h2 
              className="mb-4 text-4xl font-bold md:text-5xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              How It Works
            </motion.h2>
            <motion.p
              className="mx-auto max-w-2xl text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              viewport={{ once: true }}
            >
              Our platform connects tutors and students in a seamless learning environment with cutting-edge technology.
            </motion.p>
          </div>
          
          {/* Content about how the platform works */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <FeatureCard
              title="For Tutors"
              description="Create and share your expertise through engaging courses with our intuitive content creation tools."
              icon={Book}
              iconColor="text-blue-500"
              bgGradient="from-blue-50/50 to-cyan-50/50 dark:from-blue-950/30 dark:to-cyan-950/30"
              index={0}
            />
            <FeatureCard
              title="For Students"
              description="Learn from expert tutors with AI-enhanced video lectures, quizzes, and personalized feedback."
              icon={Users}
              iconColor="text-purple-500"
              bgGradient="from-purple-50/50 to-pink-50/50 dark:from-purple-950/30 dark:to-pink-950/30"
              index={1}
            />
            <FeatureCard
              title="Real-time Interaction"
              description="Engage with tutors and fellow students through live discussions, video calls, and collaborative tools."
              icon={MessageSquare}
              iconColor="text-green-500"
              bgGradient="from-green-50/50 to-emerald-50/50 dark:from-green-950/30 dark:to-emerald-950/30"
              index={2}
            />
          </div>
        </div>
      </motion.section>

      {/* Why Choose Us Section */}
      <motion.section 
        className="relative bg-muted py-24"
        variants={fadeInUpVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="container relative">
          <div className="mb-16 text-center">
            <motion.div
              className="mb-2 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Our Benefits
            </motion.div>
            <motion.h2 
              className="mb-4 text-4xl font-bold md:text-5xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              Why Choose Our Platform
            </motion.h2>
            <motion.p
              className="mx-auto max-w-2xl text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              viewport={{ once: true }}
            >
              We offer a comprehensive suite of features designed to enhance the learning experience.
            </motion.p>
          </div>
          
          {/* Content about platform benefits */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              title="AI-Powered Learning"
              description="Advanced AI tools for lecture transcription, content summarization, and personalized learning paths."
              icon={Brain}
              iconColor="text-amber-500"
              index={0}
            />
            <FeatureCard
              title="Interactive Experience"
              description="Engage with 3D models, interactive quizzes, and hands-on coding environments."
              icon={Lightbulb}
              iconColor="text-blue-500"
              index={1}
            />
            <FeatureCard
              title="Affordable Pricing"
              description="Flexible subscription options and pay-per-course models to fit your budget."
              icon={Coins}
              iconColor="text-green-500"
              index={2}
            />
            <FeatureCard
              title="Expert Instructors"
              description="Learn from industry professionals with real-world experience and proven teaching methods."
              icon={Award}
              iconColor="text-purple-500"
              index={3}
            />
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 py-24 text-white"
        variants={fadeInUpVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Decorative elements */}
        <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        
        <div className="container relative text-center">
          <motion.div
            className="mb-2 inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Join Us Today
          </motion.div>
          
          <motion.h2 
            className="mb-6 text-4xl font-bold md:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            viewport={{ once: true }}
          >
            Ready to Transform Your Learning?
          </motion.h2>
          
          <motion.p 
            className="mx-auto mb-8 max-w-2xl text-lg text-white/80"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            viewport={{ once: true }}
          >
            Join thousands of tutors and students who are already part of our global learning community.
          </motion.p>
          
          <motion.div 
            className="flex flex-col gap-4 sm:flex-row sm:justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Button 
              size="lg" 
              className="bg-white text-lg text-blue-600 hover:bg-white/90" 
              asChild
            >
              <a href="/signup">Sign Up as Student</a>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white/80 text-lg text-white hover:bg-white/10" 
              asChild
            >
              <a href="/signup?role=tutor">Become a Tutor</a>
            </Button>
          </motion.div>
          
          {/* Global stats */}
          <motion.div 
            className="mt-12 grid grid-cols-1 gap-6 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:grid-cols-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="text-center">
              <Globe className="mx-auto mb-2 h-6 w-6" />
              <div className="text-3xl font-bold">10,000+</div>
              <div className="text-sm text-white/70">Active Students</div>
            </div>
            <div className="text-center">
              <Book className="mx-auto mb-2 h-6 w-6" />
              <div className="text-3xl font-bold">500+</div>
              <div className="text-sm text-white/70">Courses Available</div>
            </div>
            <div className="text-center">
              <Users className="mx-auto mb-2 h-6 w-6" />
              <div className="text-3xl font-bold">250+</div>
              <div className="text-sm text-white/70">Expert Tutors</div>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </main>
  );
}
