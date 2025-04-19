import Link from "next/link";
import { GraduationCap, Twitter, Facebook, Instagram, Linkedin, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted py-12">
      <div className="container">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <Link href="/" className="mb-4 flex items-center gap-2 text-xl font-bold">
              <GraduationCap className="h-6 w-6" />
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
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="mb-4 text-lg font-medium">Platform</h3>
            <ul className="space-y-2">
              <FooterLink href="/courses">All Courses</FooterLink>
              <FooterLink href="/pricing">Pricing</FooterLink>
              <FooterLink href="/testimonials">Testimonials</FooterLink>
              <FooterLink href="/faqs">FAQs</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-medium">Company</h3>
            <ul className="space-y-2">
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/careers">Careers</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
              <FooterLink href="/blog">Blog</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-medium">Legal</h3>
            <ul className="space-y-2">
              <FooterLink href="/terms">Terms of Service</FooterLink>
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/cookies">Cookies</FooterLink>
              <FooterLink href="/license">Licenses</FooterLink>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} EdTech Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// Footer link component
const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <li>
      <Link
        href={href}
        className="text-muted-foreground transition-colors hover:text-foreground"
      >
        {children}
      </Link>
    </li>
  );
};

// Social media link component
const SocialLink = ({ href, icon }: { href: string; icon: React.ReactNode }) => {
  return (
    <Link
      href={href}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-background text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
    >
      {icon}
    </Link>
  );
};

export default Footer;
