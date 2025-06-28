'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePeraWallet } from '@/hooks/usePeraWallet';
import Button from '@/components/ui/Button';
import Logo from '@/components/ui/Logo';
import { Menu, X, Wallet, LogOut } from 'lucide-react';

const Navbar = () => {
  const { walletState, connectWallet, disconnectWallet } = usePeraWallet();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      await connectWallet();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectWallet = () => {
    try {
      disconnectWallet();
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  const navLinks = [
    { href: '/browse', label: 'Browse' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/about', label: 'About' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-r from-matrix-black/95 via-matrix-darkBlack/95 to-matrix-black/95 backdrop-blur-xl border-b border-primary-500/20 h-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-silver-300 hover:text-white transition-all duration-300 group py-2"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-400 to-primary-600 group-hover:w-full transition-all duration-500 ease-out"></span>
              </Link>
            ))}
          </div>

          {/* Wallet Section */}
          <div className="hidden md:flex items-center space-x-4">
            {walletState.isConnected ? (
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-primary-500/20 to-primary-600/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-primary-500/30">
                  <div className="flex items-center space-x-2">
                    <Wallet className="h-4 w-4 text-primary-400" />
                    <div className="text-right">
                      <div className="text-white text-sm font-medium">
                        {walletState.address?.slice(0, 6)}...{walletState.address?.slice(-4)}
                      </div>
                      <div className="text-primary-400 text-xs">
                        {walletState.balance.toFixed(2)} ALGO
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDisconnectWallet}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleConnectWallet}
                isLoading={isConnecting || walletState.isLoading}
                className="flex items-center gap-2"
              >
                <Wallet className="h-4 w-4" />
                Connect Wallet
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-silver-300 hover:text-white transition-colors p-2"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-matrix-black/98 backdrop-blur-xl border-b border-primary-500/20">
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-silver-300 hover:text-white transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="pt-4 border-t border-primary-500/20">
                {walletState.isConnected ? (
                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-primary-500/20 to-primary-600/20 backdrop-blur-sm rounded-xl p-4 border border-primary-500/30">
                      <div className="flex items-center space-x-2 mb-2">
                        <Wallet className="h-4 w-4 text-primary-400" />
                        <span className="text-white text-sm font-medium">Wallet Connected</span>
                      </div>
                      <div className="text-primary-400 text-sm">
                        {walletState.address?.slice(0, 8)}...{walletState.address?.slice(-6)}
                      </div>
                      <div className="text-silver-400 text-xs mt-1">
                        Balance: {walletState.balance.toFixed(2)} ALGO
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleDisconnectWallet}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Disconnect Wallet
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={handleConnectWallet}
                    isLoading={isConnecting || walletState.isLoading}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Wallet className="h-4 w-4" />
                    Connect Wallet
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;