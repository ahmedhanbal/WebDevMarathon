"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X, Laptop, GraduationCap, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-background/70 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo with animation */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <motion.div
            initial={{ rotate: -5 }}
            animate={{ rotate: 0 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <GraduationCap className="h-6 w-6" />
          </motion.div>
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            EdTech
          </motion.span>
        </Link>

        {/* Desktop Navigation with hover animations */}
        <nav className="hidden md:flex md:gap-6">
          <motion.div whileHover={{ scale: 1.05 }}>
            <NavLink href="/courses">Courses</NavLink>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }}>
            <NavLink href="/about">About</NavLink>
          </motion.div>
        </nav>

        {/* Desktop Auth Buttons with hover effects */}
        <div className="hidden gap-4 md:flex">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button variant="outline" asChild className="border-white/20 bg-white/5 transition-all duration-300">
              <Link href="/login">Log In</Link>
            </Button>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 border-0">
              <Link href="/signup">Sign Up</Link>
            </Button>
          </motion.div>
        </div>

        {/* Mobile Menu Button with animation */}
        <motion.button
          className="rounded-md p-2 md:hidden"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          whileTap={{ scale: 0.9 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile Menu with slide animation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="container flex flex-col gap-4 md:hidden overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <NavLink href="/courses" mobile>
                <BookOpen className="mr-2 h-5 w-5" />
                Courses
              </NavLink>
            </motion.div>
            
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <NavLink href="/about" mobile>
                <Laptop className="mr-2 h-5 w-5" />
                About
              </NavLink>
            </motion.div>
            
            <motion.div 
              className="mt-4 flex gap-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <Button variant="outline" className="flex-1 border-white/20 bg-white/5" asChild>
                <Link href="/login">Log In</Link>
              </Button>
              <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </motion.div>
            
            <motion.div className="h-4" />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const NavLink = ({
  href,
  children,
  mobile = false,
}: {
  href: string;
  children: React.ReactNode;
  mobile?: boolean;
}) => {
  const baseClasses = "font-medium transition-colors hover:text-primary";
  const mobileClasses = mobile
    ? "flex items-center py-2"
    : "text-muted-foreground hover:text-foreground";

  return (
    <Link href={href} className={cn(baseClasses, mobileClasses)}>
      {children}
    </Link>
  );
};

export default Navbar;
