"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X, Laptop, GraduationCap, BookOpen } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <GraduationCap className="h-6 w-6" />
          <span>EdTech</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:gap-6">
          <NavLink href="/courses">Courses</NavLink>
          <NavLink href="/about">About</NavLink>
          <NavLink href="/pricing">Pricing</NavLink>
          <NavLink href="/contact">Contact</NavLink>
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden gap-4 md:flex">
          <Button variant="outline" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="rounded-md p-2 md:hidden"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "container flex flex-col gap-4 md:hidden",
          isMenuOpen ? "max-h-96 pb-6" : "max-h-0 overflow-hidden"
        )}
      >
        <NavLink href="/courses" mobile>
          <BookOpen className="mr-2 h-5 w-5" />
          Courses
        </NavLink>
        <NavLink href="/about" mobile>
          <Laptop className="mr-2 h-5 w-5" />
          About
        </NavLink>
        <NavLink href="/pricing" mobile>
          <GraduationCap className="mr-2 h-5 w-5" />
          Pricing
        </NavLink>
        <NavLink href="/contact" mobile>
          <GraduationCap className="mr-2 h-5 w-5" />
          Contact
        </NavLink>
        <div className="mt-4 flex gap-4">
          <Button variant="outline" className="flex-1" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button className="flex-1" asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
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
