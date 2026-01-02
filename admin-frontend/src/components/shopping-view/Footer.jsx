import React from "react";
import { House, Package, Users, FileText, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12" style={{ backgroundColor: '#000000' }}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <House className="h-8 w-8 text-white" />
              <h3 className="text-2xl font-bold">ECommerce</h3>
            </div>
            <p className="text-sm mb-4 text-gray-300 leading-relaxed">
              Your trusted destination for quality products and exceptional shopping experiences.
              We bring you the best items for modern living.
            </p>
            <div className="flex space-x-4">
              {[
                { name: "Facebook", path: "M22.5 0h-21a1.5 1.5 ..." },
                { name: "Instagram", path: "M12 0a12 12 0 10 ..." },
                { name: "Twitter", path: "M23.953 4.57a10.004 ..." },
              ].map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-300"
                >
                  <div className="w-5 h-5 bg-white rounded-full"></div>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { icon: House, label: "Home", href: "/shop/home" },
                { icon: Users, label: "About Us", href: "/shop/about" },
                { icon: FileText, label: "Terms & Conditions", href: "/shop/terms" },
                { icon: Users, label: "Privacy Policy", href: "/shop/privacy" },
              ].map((link, index) => {
                const IconComponent = link.icon;
                return (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300"
                    >
                      <IconComponent className="h-4 w-4" />
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-bold mb-4">Categories</h4>
            <ul className="space-y-3">
              {[
                "Electronics",
                "Clothing",
                "Home & Garden",
                "Sports & Outdoors",
                "Books & Media"
              ].map((category, index) => (
                <li key={index}>
                  <a
                    href={`/shop/listing?category=${category.toLowerCase()}`}
                    className="text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="h-4 w-4 text-white" />
                <span className="text-sm">support@ecommerce.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Phone className="h-4 w-4 text-white" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin className="h-4 w-4 text-white" />
                <span className="text-sm">123 Main St, City, State 12345</span>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="mt-6">
              <h5 className="text-sm font-bold mb-2">Newsletter Signup</h5>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm text-white placeholder-gray-400 focus:outline-none focus:border-white"
                />
                <button className="px-4 py-2 bg-white text-black font-medium rounded hover:bg-gray-200 transition-colors duration-300">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} ECommerce. All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>Payment Methods:</span>
              <div className="flex gap-2">
                <div className="w-8 h-5 bg-white rounded"></div>
                <div className="w-8 h-5 bg-white rounded"></div>
                <div className="w-8 h-5 bg-white rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
