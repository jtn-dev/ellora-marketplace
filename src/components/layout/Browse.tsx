'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { mockGigs, mockCategories, mockStats } from '@/utils/mockData';
import { Search, Star, Clock, Heart, Grid, List, SlidersHorizontal } from 'lucide-react';
import Image from 'next/image';

const Browse = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [error, setError] = useState<string | null>(null);

  const filteredGigs = React.useMemo(() => {
    try {
      return mockGigs.filter(gig => 
        gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gig.freelancer.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } catch {
      setError('Error filtering gigs');
      return [];
    }
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    setError(null);
    setSearchQuery(query);
  };

  const handleCategorySelect = (categoryId: string) => {
    setError(null);
    setSelectedCategory(categoryId);
  };

  const handleSortChange = (sortOption: string) => {
    setError(null);
    setSortBy(sortOption);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-matrix-black via-matrix-darkBlack to-silver-900 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card variant="cyber" className="text-center py-12">
            <CardContent>
              <h2 className="text-2xl font-bold text-red-400 mb-2">Error Loading Marketplace</h2>
              <p className="text-silver-400 mb-6">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Reload Page
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-matrix-black via-matrix-darkBlack to-silver-900 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Browse Marketplace
          </h1>
          <p className="text-silver-400">
            Discover amazing services from talented freelancers
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card variant="cyber">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">{mockStats.totalGigs.toLocaleString()}</div>
              <div className="text-silver-400 text-sm">Available Gigs</div>
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
              <div className="text-silver-400 text-sm">Orders Completed</div>
            </CardContent>
          </Card>
          
          <Card variant="cyber">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">{mockStats.averageRating}</div>
              <div className="text-silver-400 text-sm">Avg Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-silver-400" />
            <input
              type="text"
              placeholder="Search for any service..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-silver-800/50 border border-silver-700 rounded-lg text-white placeholder-silver-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="bg-silver-800/50 border border-silver-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-silver-800/50 text-silver-400 hover:text-white'
                }`}
                aria-label="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-silver-800/50 text-silver-400 hover:text-white'
                }`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {mockCategories.map(category => (
              <Card 
                key={category.id} 
                className={`cursor-pointer transition-all duration-300 ${
                  selectedCategory === category.id 
                    ? 'border-primary-500 bg-primary-500/10' 
                    : 'hover:border-primary-500/50'
                }`}
                onClick={() => handleCategorySelect(category.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <div className="text-white text-sm font-medium mb-1">{category.name}</div>
                  <div className="text-silver-400 text-xs">{category.gigCount} gigs</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Gigs Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">
              {searchQuery ? `Search Results (${filteredGigs.length})` : 'All Services'}
            </h2>
            <div className="text-silver-400 text-sm">
              Showing {filteredGigs.length} of {mockGigs.length} services
            </div>
          </div>
          
          {filteredGigs.length === 0 && searchQuery ? (
            <div className="text-center py-12">
              <p className="text-silver-400">No services found matching your search.</p>
            </div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {filteredGigs.map(gig => (
                <Card key={gig.id} className="hover:shadow-cyber-lg transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-0">
                    {viewMode === 'grid' ? (
                      // Grid View
                      <>
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
                      </>
                    ) : (
                      // List View
                      <div className="p-4 flex items-center space-x-4">
                        <Image 
                          src={gig.image} 
                          alt={gig.title}
                          width={80}
                          height={80}
                          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <Image 
                              src={gig.freelancer.avatar} 
                              alt={gig.freelancer.name}
                              width={20}
                              height={20}
                              className="w-5 h-5 rounded-full"
                            />
                            <span className="text-silver-300 text-sm">{gig.freelancer.name}</span>
                          </div>
                          <h3 className="text-white font-medium mb-2 group-hover:text-primary-400 transition-colors">
                            {gig.title}
                          </h3>
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
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-white font-semibold">
                            {gig.price} {gig.currency}
                          </div>
                          <button className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors">
                            <Heart className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Browse; 