"use client";

import Link from "next/link";
import { GraduationCap, Twitter, Facebook, Instagram, Linkedin, Github, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <footer className="bg-gradient-to-b from-muted to-muted/70 py-12">
      <div className="container">
        <motion.div 
          className="grid grid-cols-1 gap-8 md:grid-cols-4"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {/* Logo and Description */}
          <motion.div className="md:col-span-1" variants={itemVariants}>
            <Link href="/" className="mb-4 flex items-center gap-2 text-xl font-bold">
              <motion.div
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <GraduationCap className="h-6 w-6" />
              </motion.div>
              <span>EdTech</span>
            </Link>
            <p className="mb-6 text-muted-foreground">
              Transforming education through technology and AI. Join our community of tutors and learners.
            </p>
            <div className="flex gap-4">
              <SocialLink href="#" icon={<Twitter className="h-4 w-4" />} />
              <SocialLink href="#" icon={<Facebook className="h-4 w-4" />} />
              <SocialLink href="#" icon={<Instagram className="h-4 w-4" />} />
              <SocialLink href="#" icon={<Linkedin className="h-4 w-4" />} />
              <SocialLink href="#" icon={<Github className="h-4 w-4" />} />
            </div>
          </motion.div>

          {/* Navigation Links */}
          <motion.div variants={itemVariants}>
            <h3 className="mb-4 text-lg font-medium">Platform</h3>
            <ul className="space-y-2">
              <FooterLink href="/courses">All Courses</FooterLink>
              <FooterLink href="/pricing">Pricing</FooterLink>
              <FooterLink href="/testimonials">Testimonials</FooterLink>
              <FooterLink href="/faqs">FAQs</FooterLink>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="mb-4 text-lg font-medium">Company</h3>
            <ul className="space-y-2">
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/careers">Careers</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
              <FooterLink href="/blog">Blog</FooterLink>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="mb-4 text-lg font-medium">Legal</h3>
            <ul className="space-y-2">
              <FooterLink href="/terms">Terms of Service</FooterLink>
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/cookies">Cookies</FooterLink>
              <FooterLink href="/license">Licenses</FooterLink>
            </ul>
          </motion.div>
        </motion.div>

        <motion.div 
          className="mt-12 border-t border-border pt-6 text-center text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p>© {new Date().getFullYear()} EdTech Platform. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
};

// Footer link component
const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400 }}>
      <Link
        href={href}
        className="flex items-center text-muted-foreground transition-colors hover:text-primary"
      >
        <span>{children}</span>
        <motion.div 
          initial={{ opacity: 0, x: -5 }} 
          whileHover={{ opacity: 1, x: 0 }}
          className="inline-block ml-1"
        >
          <ArrowRight className="h-3 w-3" />
        </motion.div>
      </Link>
    </motion.li>
  );
};

// Social media link component
const SocialLink = ({ href, icon }: { href: string; icon: React.ReactNode }) => {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.2,
        rotate: 5
      }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      <Link
        href={href}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-background text-muted-foreground transition-all hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-600 hover:text-white"
      >
        {icon}
      </Link>
    </motion.div>
  );
};

export default Footer;
