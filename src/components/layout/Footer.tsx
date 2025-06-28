'use client';

import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';
import Logo from '@/components/ui/Logo';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-matrix-darkBlack via-matrix-black to-silver-900 border-t border-primary-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Logo />
            </div>
            <p className="text-silver-400 text-sm leading-relaxed">
              The future of freelancing on Algorand. Decentralized, secure, and instant payments for the metaverse economy.
            </p>
            <div className="flex items-center space-x-1 text-xs text-primary-400">
              <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
              <span>Powered by Algorand</span>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Platform</h3>
            <ul className="space-y-2">
              {[
                { name: 'Browse Gigs', href: '/browse' },
                { name: 'Dashboard', href: '/dashboard' },
                { name: 'About', href: '/about' },
                { name: 'Smart Contracts', href: '#contracts' },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-silver-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Resources</h3>
            <ul className="space-y-2">
              {[
                { name: 'Documentation', href: '#docs' },
                { name: 'API Reference', href: '#api' },
                { name: 'Community', href: '#community' },
                { name: 'Support', href: '#support' },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-silver-400 hover:text-primary-400 transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Connect</h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com/jtn-dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-silver-400 hover:text-primary-400 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/jdjatin/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-silver-400 hover:text-primary-400 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:jatinchauhan478@gmail.com"
                className="text-silver-400 hover:text-primary-400 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-silver-400">
                <a
                  href="https://x.com/0jatinsingh0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-400 transition-colors"
                >
                  @0jatinsingh0
                </a>
              </p>
              <p className="text-silver-400">
                Built for Bolt.new Hackathon
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-500/20 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-silver-400 text-sm">
            © 2024 Ellora. Built on Algorand blockchain.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#privacy" className="text-silver-400 hover:text-primary-400 text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="text-silver-400 hover:text-primary-400 text-sm transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 