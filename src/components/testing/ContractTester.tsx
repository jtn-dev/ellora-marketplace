'use client';

import React, { useState, useEffect } from 'react';
import { usePeraWallet } from '@/hooks/usePeraWallet';
import { getContractService } from '@/utils/contractService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Play,
  RefreshCw,
  Shield,
  Coins,
  Users,
  FileText
} from 'lucide-react';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message?: string;
  txId?: string;
  duration?: number;
}

const ContractTester = () => {
  const { walletState, peraWallet } = usePeraWallet();
  const [isRunning, setIsRunning] = useState(false);
  const [contractHealth, setContractHealth] = useState<any>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([
    { name: 'Contract Health Check', status: 'pending' },
    { name: 'Create Job', status: 'pending' },
    { name: 'Accept Job', status: 'pending' },
    { name: 'Complete Job', status: 'pending' },
    { name: 'Approve Completion', status: 'pending' },
    { name: 'Mint SBT Token', status: 'pending' },
    { name: 'Get Reputation Data', status: 'pending' },
    { name: 'Raise Dispute', status: 'pending' },
    { name: 'Vote on Dispute', status: 'pending' },
  ]);

  const updateTestResult = (index: number, update: Partial<TestResult>) => {
    setTestResults(prev => prev.map((result, i) => 
      i === index ? { ...result, ...update } : result
    ));
  };

  const checkContractHealth = async () => {
    if (!walletState.isConnected) return;

    try {
      const contractService = getContractService(peraWallet);
      const health = await contractService.verifyContractHealth();
      setContractHealth(health);
      
      updateTestResult(0, {
        status: health.escrowHealthy && health.sbtHealthy ? 'success' : 'error',
        message: health.errors.length > 0 ? health.errors.join(', ') : 'All contracts healthy'
      });
    } catch (error) {
      updateTestResult(0, {
        status: 'error',
        message: error instanceof Error ? error.message : 'Health check failed'
      });
    }
  };

  const runFullTest = async () => {
    if (!walletState.isConnected || !walletState.address) {
      alert('Please connect your wallet first');
      return;
    }

    setIsRunning(true);
    const contractService = getContractService(peraWallet);
    let jobAppId: number | null = null;

    try {
      // Test 1: Contract Health Check
      updateTestResult(0, { status: 'running' });
      const startTime = Date.now();
      await checkContractHealth();
      updateTestResult(0, { 
        status: contractHealth?.escrowHealthy && contractHealth?.sbtHealthy ? 'success' : 'error',
        duration: Date.now() - startTime
      });

      // Test 2: Create Job
      updateTestResult(1, { status: 'running' });
      const createStart = Date.now();
      const createResult = await contractService.createJob(walletState.address, {
        amount: 1, // 1 ALGO
        deadline: 7, // 7 days
        description: 'Test job for contract verification',
        requirements: ['Test requirement']
      });

      if (createResult.success) {
        jobAppId = createResult.appId!;
        updateTestResult(1, {
          status: 'success',
          message: `Job created successfully`,
          txId: createResult.txId,
          duration: Date.now() - createStart
        });
      } else {
        updateTestResult(1, {
          status: 'error',
          message: createResult.error,
          duration: Date.now() - createStart
        });
        setIsRunning(false);
        return;
      }

      // Test 3: Accept Job (simulate with same address for demo)
      updateTestResult(2, { status: 'running' });
      const acceptStart = Date.now();
      const acceptResult = await contractService.acceptJob(walletState.address, jobAppId);
      
      updateTestResult(2, {
        status: acceptResult.success ? 'success' : 'error',
        message: acceptResult.success ? 'Job accepted' : acceptResult.error,
        txId: acceptResult.txId,
        duration: Date.now() - acceptStart
      });

      // Test 4: Complete Job
      updateTestResult(3, { status: 'running' });
      const completeStart = Date.now();
      const completeResult = await contractService.completeJob(walletState.address, jobAppId);
      
      updateTestResult(3, {
        status: completeResult.success ? 'success' : 'error',
        message: completeResult.success ? 'Job completed' : completeResult.error,
        txId: completeResult.txId,
        duration: Date.now() - completeStart
      });

      // Test 5: Approve Completion
      updateTestResult(4, { status: 'running' });
      const approveStart = Date.now();
      const approveResult = await contractService.approveCompletion(walletState.address, jobAppId);
      
      updateTestResult(4, {
        status: approveResult.success ? 'success' : 'error',
        message: approveResult.success ? 'Completion approved, funds released' : approveResult.error,
        txId: approveResult.txId,
        duration: Date.now() - approveStart
      });

      // Test 6: Mint SBT Token
      updateTestResult(5, { status: 'running' });
      const mintStart = Date.now();
      const mintResult = await contractService.mintSBT(walletState.address, 5); // 5-star rating
      
      updateTestResult(5, {
        status: mintResult.success ? 'success' : 'error',
        message: mintResult.success ? 'SBT token minted' : mintResult.error,
        txId: mintResult.txId,
        duration: Date.now() - mintStart
      });

      // Test 7: Get Reputation Data
      updateTestResult(6, { status: 'running' });
      const reputationStart = Date.now();
      const reputation = await contractService.getUserReputation(walletState.address);
      
      updateTestResult(6, {
        status: reputation ? 'success' : 'error',
        message: reputation ? `Reputation score: ${reputation.reputationScore}` : 'Failed to get reputation',
        duration: Date.now() - reputationStart
      });

      // Test 8: Raise Dispute (on a new job)
      updateTestResult(7, { status: 'running' });
      const disputeStart = Date.now();
      // Create another job for dispute testing
      const disputeJobResult = await contractService.createJob(walletState.address, {
        amount: 0.5,
        deadline: 3,
        description: 'Test job for dispute',
        requirements: []
      });

      if (disputeJobResult.success) {
        const disputeResult = await contractService.raiseDispute(walletState.address, disputeJobResult.appId!);
        updateTestResult(7, {
          status: disputeResult.success ? 'success' : 'error',
          message: disputeResult.success ? 'Dispute raised' : disputeResult.error,
          txId: disputeResult.txId,
          duration: Date.now() - disputeStart
        });

        // Test 9: Vote on Dispute
        if (disputeResult.success) {
          updateTestResult(8, { status: 'running' });
          const voteStart = Date.now();
          const voteResult = await contractService.voteOnDispute(walletState.address, disputeJobResult.appId!, true);
          
          updateTestResult(8, {
            status: voteResult.success ? 'success' : 'error',
            message: voteResult.success ? 'Vote cast on dispute' : voteResult.error,
            txId: voteResult.txId,
            duration: Date.now() - voteStart
          });
        }
      } else {
        updateTestResult(7, {
          status: 'error',
          message: 'Failed to create dispute test job',
          duration: Date.now() - disputeStart
        });
        updateTestResult(8, { status: 'error', message: 'Skipped due to previous failure' });
      }

    } catch (error) {
      console.error('Test suite error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    if (walletState.isConnected) {
      checkContractHealth();
    }
  }, [walletState.isConnected]);

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-400" />;
      case 'running': return <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />;
      default: return <Clock className="w-5 h-5 text-silver-400" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'running': return 'text-blue-400';
      default: return 'text-silver-400';
    }
  };

  if (!walletState.isConnected) {
    return (
      <Card variant="cyber" className="max-w-4xl mx-auto">
        <CardContent className="text-center py-12">
          <Shield className="w-16 h-16 text-silver-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Contract Testing Suite</h2>
          <p className="text-silver-400 mb-6">
            Connect your wallet to run end-to-end smart contract tests
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card variant="cyber">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-primary-400" />
            Smart Contract Testing Suite
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-silver-300 mb-2">
                Comprehensive end-to-end testing of Ellora smart contracts
              </p>
              <p className="text-silver-400 text-sm">
                Connected: {walletState.address?.slice(0, 8)}...{walletState.address?.slice(-6)}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={checkContractHealth}
                disabled={isRunning}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Health Check
              </Button>
              <Button
                onClick={runFullTest}
                disabled={isRunning}
                isLoading={isRunning}
                className="flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Run Full Test
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contract Health Status */}
      {contractHealth && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card variant="cyber">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary-400" />
                  <span className="text-white font-medium">Escrow Contract</span>
                </div>
                <div className="flex items-center gap-2">
                  {contractHealth.escrowHealthy ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                  <span className={contractHealth.escrowHealthy ? 'text-green-400' : 'text-red-400'}>
                    {contractHealth.escrowHealthy ? 'Healthy' : 'Error'}
                  </span>
                </div>
              </div>
              <div className="mt-2 text-silver-400 text-sm">
                Balance: {contractHealth.escrowBalance.toFixed(3)} ALGO
              </div>
            </CardContent>
          </Card>

          <Card variant="cyber">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-primary-400" />
                  <span className="text-white font-medium">SBT Contract</span>
                </div>
                <div className="flex items-center gap-2">
                  {contractHealth.sbtHealthy ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                  <span className={contractHealth.sbtHealthy ? 'text-green-400' : 'text-red-400'}>
                    {contractHealth.sbtHealthy ? 'Healthy' : 'Error'}
                  </span>
                </div>
              </div>
              <div className="mt-2 text-silver-400 text-sm">
                Balance: {contractHealth.sbtBalance.toFixed(3)} ALGO
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Test Results */}
      <Card variant="cyber">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-primary-400" />
            Test Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {testResults.map((result, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-silver-800/30 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(result.status)}
                  <div>
                    <div className="text-white font-medium">{result.name}</div>
                    {result.message && (
                      <div className={`text-sm ${getStatusColor(result.status)}`}>
                        {result.message}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right text-sm text-silver-400">
                  {result.duration && (
                    <div>{(result.duration / 1000).toFixed(1)}s</div>
                  )}
                  {result.txId && (
                    <div className="text-xs">
                      <a
                        href={`https://testnet.explorer.perawallet.app/tx/${result.txId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-400 hover:text-primary-300"
                      >
                        View TX
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Test Summary */}
      <Card variant="cyber">
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-400">
                {testResults.filter(r => r.status === 'success').length}
              </div>
              <div className="text-silver-400 text-sm">Passed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">
                {testResults.filter(r => r.status === 'error').length}
              </div>
              <div className="text-silver-400 text-sm">Failed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-silver-400">
                {testResults.filter(r => r.status === 'pending').length}
              </div>
              <div className="text-silver-400 text-sm">Pending</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractTester;