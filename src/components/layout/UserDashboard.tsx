'use client';

import React, { useState } from 'react';
import { usePeraWallet } from '@/hooks/usePeraWallet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import JobCreationModal from './JobCreationModal';
import { mockGigs } from '@/utils/mockData';
import { 
  Plus, 
  Wallet, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Star,
  Eye,
  MessageSquare,
  Settings,
  User,
  Briefcase
} from 'lucide-react';
import Image from 'next/image';

const UserDashboard = () => {
  const { walletState, connectWallet } = usePeraWallet();
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock user data - in real app this would come from your backend/blockchain
  const userStats = {
    totalEarnings: 2847.50,
    activeJobs: 5,
    completedJobs: 23,
    pendingJobs: 2,
    averageRating: 4.8,
    totalReviews: 18,
    profileViews: 342,
    responseTime: '2 hours'
  };

  const recentJobs = mockGigs.slice(0, 5).map((gig, index) => ({
    ...gig,
    status: ['completed', 'in-progress', 'pending', 'completed', 'in-progress'][index],
    earnings: [450, 320, 180, 275, 390][index],
    dueDate: ['2024-01-15', '2024-01-20', '2024-01-25', '2024-01-18', '2024-01-22'][index]
  }));

  const handleJobCreated = (jobId: string) => {
    console.log('Job created with ID:', jobId);
    // Here you would typically refresh the job list or show a success message
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'in-progress': return 'text-blue-400';
      case 'pending': return 'text-yellow-400';
      default: return 'text-silver-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-matrix-black via-matrix-darkBlack to-silver-900 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              My Dashboard
            </h1>
            <p className="text-silver-400">
              {walletState.isConnected 
                ? `Welcome back! Wallet: ${walletState.address?.slice(0, 8)}...${walletState.address?.slice(-6)}`
                : 'Connect your wallet to access your dashboard'
              }
            </p>
          </div>
          
          {walletState.isConnected && (
            <div className="mt-4 sm:mt-0 flex gap-3">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </Button>
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

        {walletState.isConnected ? (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card variant="cyber">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-white">
                        ${userStats.totalEarnings.toLocaleString()}
                      </div>
                      <div className="text-silver-400 text-sm">Total Earnings</div>
                    </div>
                    <Wallet className="w-8 h-8 text-primary-400" />
                  </div>
                </CardContent>
              </Card>
              
              <Card variant="cyber">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-white">{userStats.activeJobs}</div>
                      <div className="text-silver-400 text-sm">Active Jobs</div>
                    </div>
                    <Briefcase className="w-8 h-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>
              
              <Card variant="cyber">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-white">{userStats.completedJobs}</div>
                      <div className="text-silver-400 text-sm">Completed</div>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>
              
              <Card variant="cyber">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-white">{userStats.averageRating}</div>
                      <div className="text-silver-400 text-sm">Avg Rating</div>
                    </div>
                    <Star className="w-8 h-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tab Navigation */}
            <div className="mb-8">
              <div className="flex space-x-1 bg-silver-800/30 p-1 rounded-lg w-fit">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'jobs', label: 'My Jobs' },
                  { id: 'earnings', label: 'Earnings' },
                  { id: 'profile', label: 'Profile' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-500 text-white'
                        : 'text-silver-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <Card variant="cyber">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Jobs</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentJobs.slice(0, 3).map(job => (
                      <div key={job.id} className="flex items-center justify-between p-3 bg-silver-800/30 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Image 
                            src={job.image} 
                            alt={job.title}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div>
                            <div className="text-white text-sm font-medium line-clamp-1">
                              {job.title}
                            </div>
                            <div className={`flex items-center space-x-1 text-xs ${getStatusColor(job.status)}`}>
                              {getStatusIcon(job.status)}
                              <span className="capitalize">{job.status}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-white font-semibold">
                          ${job.earnings}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Performance Metrics */}
                <Card variant="cyber">
                  <CardHeader>
                    <CardTitle className="text-white">Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-silver-300">Average Rating</span>
                      </div>
                      <span className="text-white font-semibold">{userStats.averageRating}/5.0</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="w-4 h-4 text-blue-400" />
                        <span className="text-silver-300">Total Reviews</span>
                      </div>
                      <span className="text-white font-semibold">{userStats.totalReviews}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Eye className="w-4 h-4 text-purple-400" />
                        <span className="text-silver-300">Profile Views</span>
                      </div>
                      <span className="text-white font-semibold">{userStats.profileViews}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-green-400" />
                        <span className="text-silver-300">Response Time</span>
                      </div>
                      <span className="text-white font-semibold">{userStats.responseTime}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'jobs' && (
              <Card variant="cyber">
                <CardHeader>
                  <CardTitle className="text-white">All Jobs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentJobs.map(job => (
                      <div key={job.id} className="flex items-center justify-between p-4 bg-silver-800/30 rounded-lg hover:bg-silver-800/50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <Image 
                            src={job.image} 
                            alt={job.title}
                            width={64}
                            height={64}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div>
                            <h3 className="text-white font-medium mb-1">{job.title}</h3>
                            <div className="flex items-center space-x-4 text-sm text-silver-400">
                              <div className={`flex items-center space-x-1 ${getStatusColor(job.status)}`}>
                                {getStatusIcon(job.status)}
                                <span className="capitalize">{job.status}</span>
                              </div>
                              <span>Due: {job.dueDate}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-semibold mb-1">${job.earnings}</div>
                          <div className="text-silver-400 text-sm">{job.currency}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'earnings' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card variant="cyber">
                  <CardHeader>
                    <CardTitle className="text-white">Earnings Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-3xl font-bold text-white">
                      ${userStats.totalEarnings.toLocaleString()}
                    </div>
                    <div className="text-silver-400">Total earned this month</div>
                    <div className="flex items-center space-x-2 text-green-400">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm">+12.5% from last month</span>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="cyber">
                  <CardHeader>
                    <CardTitle className="text-white">Payment History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentJobs.filter(job => job.status === 'completed').map(job => (
                        <div key={job.id} className="flex items-center justify-between">
                          <div>
                            <div className="text-white text-sm">{job.title}</div>
                            <div className="text-silver-400 text-xs">{job.dueDate}</div>
                          </div>
                          <div className="text-green-400 font-semibold">+${job.earnings}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'profile' && (
              <Card variant="cyber">
                <CardHeader>
                  <CardTitle className="text-white">Profile Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">Profile Photo</h3>
                        <p className="text-silver-400 text-sm">Upload a professional photo</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          Change Photo
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-silver-300 text-sm font-medium mb-2">
                          Display Name
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 bg-silver-800/50 border border-silver-700 rounded-lg text-white placeholder-silver-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Your display name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-silver-300 text-sm font-medium mb-2">
                          Professional Title
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 bg-silver-800/50 border border-silver-700 rounded-lg text-white placeholder-silver-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="e.g. Full Stack Developer"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-silver-300 text-sm font-medium mb-2">
                        Bio
                      </label>
                      <textarea
                        rows={4}
                        className="w-full px-3 py-2 bg-silver-800/50 border border-silver-700 rounded-lg text-white placeholder-silver-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Tell clients about yourself and your expertise..."
                      />
                    </div>
                    
                    <Button className="w-full md:w-auto">
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          // Not Connected State
          <Card variant="cyber" className="text-center py-12">
            <CardContent>
              <Wallet className="w-16 h-16 text-silver-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                Connect Your Wallet
              </h2>
              <p className="text-silver-400 mb-6">
                Connect your Pera Wallet to access your dashboard and manage your freelance business
              </p>
              <Button 
                size="lg"
                onClick={connectWallet}
                isLoading={walletState.isLoading}
              >
                <Wallet className="mr-2 h-5 w-5" />
                {walletState.isLoading ? 'Connecting...' : 'Connect Wallet'}
              </Button>
              {walletState.error && (
                <p className="text-red-400 text-sm mt-4 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  {walletState.error}
                </p>
              )}
            </CardContent>
          </Card>
        )}
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

export default UserDashboard;