'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePeraWallet } from '@/hooks/usePeraWallet';
import Button from '@/components/ui/Button';
import { Wallet, ArrowRight, Shield, Zap, Globe } from 'lucide-react';

const Hero = () => {
  const { walletState, connectWallet } = usePeraWallet();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="relative min-h-[calc(100vh-5rem)] pt-20 pb-20 flex items-center justify-center overflow-hidden bg-gradient-to-br from-matrix-black via-matrix-darkBlack to-silver-900">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-pacifico text-white leading-tight drop-shadow-2xl">
                Welcome to{' '}
                <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent">
                  Ellora
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-silver-300 max-w-3xl mx-auto leading-relaxed">
                The future of freelancing on{' '}
                <span className="text-primary-400 font-semibold">Algorand</span>
                <br />
                Decentralized. Secure. Instant.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-5rem)] pt-20 pb-20 flex items-center justify-center overflow-hidden bg-gradient-to-br from-matrix-black via-matrix-darkBlack to-silver-900">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div className="absolute inset-0 cyber-grid opacity-20"></div>
        
        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-primary-400/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-pacifico text-white leading-tight drop-shadow-2xl">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent animate-pulse">
                Ellora
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-silver-300 max-w-3xl mx-auto leading-relaxed">
              The future of freelancing on{' '}
              <span className="text-primary-400 font-semibold">Algorand</span>
              <br />
              Decentralized. Secure. Instant.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-silver-900/30 backdrop-blur-sm rounded-xl p-6 border border-primary-500/20 hover:border-primary-500/50 transition-all duration-300">
              <Shield className="h-8 w-8 text-primary-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Secure Escrow</h3>
              <p className="text-silver-400 text-sm">Smart contracts protect your payments until work is completed</p>
            </div>
            
            <div className="bg-silver-900/30 backdrop-blur-sm rounded-xl p-6 border border-primary-500/20 hover:border-primary-500/50 transition-all duration-300">
              <Zap className="h-8 w-8 text-primary-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Instant Finality</h3>
              <p className="text-silver-400 text-sm">Payments settle in ~4 seconds with Algorand&apos;s speed</p>
            </div>
            
            <div className="bg-silver-900/30 backdrop-blur-sm rounded-xl p-6 border border-primary-500/20 hover:border-primary-500/50 transition-all duration-300">
              <Globe className="h-8 w-8 text-primary-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Global Access</h3>
              <p className="text-silver-400 text-sm">Connect with talent worldwide using ALGO and USDC</p>
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-6">
            {walletState.isConnected ? (
              <div className="space-y-4">
                <div className="bg-primary-500/20 border border-primary-500/30 rounded-xl p-6 max-w-md mx-auto">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Wallet className="h-5 w-5 text-primary-400" />
                    <span className="text-white font-medium">Wallet Connected</span>
                  </div>
                  <p className="text-primary-400 text-sm">
                    {walletState.address?.slice(0, 6)}...{walletState.address?.slice(-4)}
                  </p>
                  <p className="text-silver-400 text-xs mt-1">
                    Balance: {walletState.balance.toFixed(2)} ALGO
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/dashboard">
                    <Button size="lg" className="text-lg px-8 py-4 w-full sm:w-auto">
                      Explore Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/browse">
                    <Button variant="outline" size="lg" className="text-lg px-8 py-4 w-full sm:w-auto">
                      Browse Gigs
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-silver-400 text-lg max-w-md mx-auto">
                  Connect your Pera Wallet to start your decentralized freelancing journey
                </p>
                <Button
                  onClick={connectWallet}
                  isLoading={walletState.isLoading}
                  size="lg"
                  className="text-xl px-12 py-6 btn-cyber"
                >
                  <Wallet className="mr-3 h-6 w-6" />
                  {walletState.isLoading ? 'Connecting...' : 'Connect Pera Wallet'}
                </Button>
                {walletState.error && (
                  <p className="text-red-400 text-sm max-w-md mx-auto bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                    {walletState.error}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto pt-12 border-t border-primary-500/20">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary-400">~4s</div>
              <div className="text-silver-400 text-sm">Transaction Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary-400">0.001</div>
              <div className="text-silver-400 text-sm">ALGO Fees</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary-400">100%</div>
              <div className="text-silver-400 text-sm">Decentralized</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary-400">24/7</div>
              <div className="text-silver-400 text-sm">Available</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;