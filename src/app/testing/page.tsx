import ContractTester from "@/components/testing/ContractTester";

export default function TestingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-matrix-black via-matrix-darkBlack to-silver-900 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Smart Contract Testing
          </h1>
          <p className="text-silver-400">
            Verify end-to-end functionality of Ellora's smart contracts on Algorand Testnet
          </p>
        </div>
        
        <ContractTester />
      </div>
    </div>
  );
}