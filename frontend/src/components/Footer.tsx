"use client";

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Hotel } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#191e3b] text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Hotel className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Hotel<span className="text-indigo-400">Booking</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Discover the perfect stay for your next adventure. From luxury resorts to cozy boutiques, we've got you covered.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-indigo-400 transition-colors">Home</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-indigo-400 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-indigo-400 transition-colors">Contact Us</Link></li>
              <li><Link href="/careers" className="text-gray-400 hover:text-indigo-400 transition-colors">Careers</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-indigo-400 transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/help" className="text-gray-400 hover:text-indigo-400 transition-colors">Help Center</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-indigo-400 transition-colors">FAQs</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-indigo-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookies" className="text-gray-400 hover:text-indigo-400 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <span className="text-gray-400">+91 123 456 7890</span>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <span className="text-gray-400">support@hotelbooking.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <span className="text-gray-400">123 Travel Street, Mumbai, India 400001</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} HotelBooking. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-indigo-400 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-indigo-400 text-sm transition-colors">
                Terms of Use
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-indigo-400 text-sm transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;