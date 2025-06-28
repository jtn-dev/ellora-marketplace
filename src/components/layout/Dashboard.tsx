'use client';

import React, { useState } from 'react';
import { usePeraWallet } from '@/hooks/usePeraWallet';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import JobCreationModal from './JobCreationModal';
import { mockGigs, mockCategories, mockStats } from '@/utils/mockData';
import { Search, Star, Clock, Heart, Plus } from 'lucide-react';
import Image from 'next/image';

const Dashboard = () => {
  const { walletState } = usePeraWallet();
  const [searchQuery, setSearchQuery] = useState('');
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);

  const handleJobCreated = (jobId: string) => {
    console.log('Job created with ID:', jobId);
    // Here you would typically refresh the job list or show a success message
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-matrix-black via-matrix-darkBlack to-silver-900 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome to Ellora Dashboard
            </h1>
            <p className="text-silver-400">
              {walletState.isConnected 
                ? `Connected: ${walletState.address?.slice(0, 8)}...${walletState.address?.slice(-6)}`
                : 'Connect your wallet to get started'
              }
            </p>
          </div>
          
          {walletState.isConnected && (
            <div className="mt-4 sm:mt-0">
              <Button
                onClick={() => setIsJobModalOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Job
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card variant="cyber">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">{mockStats.totalGigs.toLocaleString()}</div>
              <div className="text-silver-400 text-sm">Total Gigs</div>
            </CardContent>
          </Card>
          
          <Card variant="cyber">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">{mockStats.activeFreelancers.toLocaleString()}</div>
              <div className="text-silver-400 text-sm">Active Freelancers</div>
            </CardContent>
          </Card>
          
          <Card variant="cyber">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">{mockStats.completedOrders.toLocaleString()}</div>
              <div className="text-silver-400 text-sm">Completed Orders</div>
            </CardContent>
          </Card>
          
          <Card variant="cyber">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">{mockStats.averageRating}</div>
              <div className="text-silver-400 text-sm">Average Rating</div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-silver-400" />
            <input
              type="text"
              placeholder="Search for any service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-silver-800/50 border border-silver-700 rounded-lg text-white placeholder-silver-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {mockCategories.map(category => (
              <Card key={category.id} className="cursor-pointer hover:border-primary-500/50">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <div className="text-white text-sm font-medium mb-1">{category.name}</div>
                  <div className="text-silver-400 text-xs">{category.gigCount} gigs</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Featured Gigs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockGigs.slice(0, 8).map(gig => (
              <Card key={gig.id} className="hover:shadow-cyber-lg transition-all duration-300 cursor-pointer group">
                <CardContent className="p-0">
                  <div className="relative">
                    <Image 
                      src={gig.image} 
                      alt={gig.title}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover rounded-t-xl group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <button className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors">
                        <Heart className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <div className="flex items-center space-x-2">
                      <Image 
                        src={gig.freelancer.avatar} 
                        alt={gig.freelancer.name}
                        width={24}
                        height={24}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-silver-300 text-sm">{gig.freelancer.name}</span>
                    </div>
                    
                    <h3 className="text-white font-medium line-clamp-2 group-hover:text-primary-400 transition-colors">
                      {gig.title}
                    </h3>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-silver-700">
                      <div className="flex items-center space-x-4 text-silver-400 text-xs">
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span>{gig.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{gig.deliveryTime}</span>
                        </div>
                      </div>
                      <div className="text-white font-semibold">
                        {gig.price} {gig.currency}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      {/* Job Creation Modal */}
      <JobCreationModal
        isOpen={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
        onJobCreated={handleJobCreated}
      />
    </div>
  );
};

export default Dashboard;