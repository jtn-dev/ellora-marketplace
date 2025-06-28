'use client';

import React, { useState } from 'react';
import { X, Calendar, DollarSign } from 'lucide-react';
import Button from '@/components/ui/Button';
import { usePeraWallet } from '@/hooks/usePeraWallet';
import { CreateJobParams } from '@/types/contracts';

interface JobCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobCreated: (jobId: string) => void;
}

export default function JobCreationModal({ isOpen, onClose, onJobCreated }: JobCreationModalProps) {
  const { walletState } = usePeraWallet();
  const { address, isConnected } = walletState;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateJobParams & { title: string; category: string }>({
    title: '',
    description: '',
    category: '',
    amount: 0,
    deadline: 0,
    requirements: [],
  });

  const categories = [
    'Web Development',
    'Mobile Development', 
    'UI/UX Design',
    'Smart Contract Development',
    'Digital Marketing',
    'Content Writing',
    'Video Editing',
    'Data Analysis',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!isConnected || !address) {
      setError('Please connect your Pera Wallet first');
      return;
    }

    if (formData.amount <= 0) {
      setError('Please enter a valid budget amount');
      return;
    }

    if (formData.deadline <= 0) {
      setError('Please enter a valid deadline');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // For now, simulate job creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockJobId = `job_${Date.now()}`;
      onJobCreated(mockJobId);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        amount: 0,
        deadline: 0,
        requirements: [],
      });
      
      onClose();
      
    } catch (error) {
      console.error('Error creating job:', error);
      setError('Failed to create job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }));
  };

  const updateRequirement = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.map((req, i) => i === index ? value : req)
    }));
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-black border border-primary-500/30 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-primary-500/20">
          <h2 className="text-xl font-bold text-primary-400">Create New Job</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-primary-400 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Job Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none"
              placeholder="e.g., Build a DeFi Dashboard"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category *
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-primary-500 focus:outline-none"
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none resize-none"
              placeholder="Describe your project requirements, goals, and expectations..."
            />
          </div>

          {/* Amount and Deadline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Budget (ALGO) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  required
                  min="1"
                  step="0.1"
                  value={formData.amount || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-3 py-2 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none"
                  placeholder="100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Deadline (Days) *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  required
                  min="1"
                  max="365"
                  value={formData.deadline || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, deadline: parseInt(e.target.value) || 0 }))}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-3 py-2 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none"
                  placeholder="7"
                />
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Requirements
            </label>
            <div className="space-y-2">
              {formData.requirements.map((requirement, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={requirement}
                    onChange={(e) => updateRequirement(index, e.target.value)}
                    className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none"
                    placeholder={`Requirement ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeRequirement(index)}
                    className="px-3 py-2 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addRequirement}
                className="text-primary-400 hover:text-primary-300 text-sm transition-colors"
              >
                + Add Requirement
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Job...' : 'Create Job'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 