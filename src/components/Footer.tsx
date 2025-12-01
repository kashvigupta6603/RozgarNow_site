import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-primary-foreground/10 p-2 rounded-lg">
                <Mail className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold">RozgarNow</span>
            </div>
            <p className="text-primary-foreground/80 text-sm mb-4">
              Your trusted platform for government job alerts, exam preparation, and career guidance.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 cursor-pointer hover:text-accent transition-colors" />
              <Twitter className="h-5 w-5 cursor-pointer hover:text-accent transition-colors" />
              <Instagram className="h-5 w-5 cursor-pointer hover:text-accent transition-colors" />
              <Linkedin className="h-5 w-5 cursor-pointer hover:text-accent transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-sm text-primary-foreground/80 hover:text-accent transition-colors">
                Home
              </Link>
              <Link to="/jobs" className="block text-sm text-primary-foreground/80 hover:text-accent transition-colors">
                Latest Jobs
              </Link>
              <Link to="/alerts" className="block text-sm text-primary-foreground/80 hover:text-accent transition-colors">
                Job Alerts
              </Link>
              <Link to="/syllabus" className="block text-sm text-primary-foreground/80 hover:text-accent transition-colors">
                Exam Syllabus
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">Job Categories</h3>
            <div className="space-y-2">
              <Link to="/jobs?category=banking" className="block text-sm text-primary-foreground/80 hover:text-accent transition-colors">
                Banking & Finance
              </Link>
              <Link to="/jobs?category=railway" className="block text-sm text-primary-foreground/80 hover:text-accent transition-colors">
                Railway Jobs
              </Link>
              <Link to="/jobs?category=defense" className="block text-sm text-primary-foreground/80 hover:text-accent transition-colors">
                Defense Jobs
              </Link>
              <Link to="/jobs?category=teaching" className="block text-sm text-primary-foreground/80 hover:text-accent transition-colors">
                Teaching Jobs
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-primary-foreground/80">
                <Mail className="h-4 w-4" />
                <span>info@RozgarNow.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-primary-foreground/80">
                <Phone className="h-4 w-4" />
                <span>+91 9876543210</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-primary-foreground/80">
                <MapPin className="h-4 w-4" />
                <span>New Delhi, India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-primary-foreground/80">
              © 2025 RozgarNow. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-sm text-primary-foreground/80 hover:text-accent transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-primary-foreground/80 hover:text-accent transition-colors">
                Terms of Service
              </Link>
              <Link to="/contact" className="text-sm text-primary-foreground/80 hover:text-accent transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;