import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-matrix-black via-matrix-darkBlack to-silver-900 pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            About{' '}
            <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent">
              Ellora
            </span>
          </h1>
          <p className="text-xl text-silver-300 max-w-2xl mx-auto">
            Building the future of decentralized freelancing on Algorand
          </p>
        </div>

        <div className="space-y-8">
          <Card variant="cyber">
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-silver-300 leading-relaxed">
                Ellora is revolutionizing the freelance economy by leveraging Algorand&apos;s fast, secure, and low-cost blockchain infrastructure. 
                We&apos;re building a truly decentralized marketplace where freelancers and clients can connect, transact, and build trust without 
                intermediaries taking large cuts or controlling the process.
              </p>
            </CardContent>
          </Card>

          <Card variant="cyber">
            <CardHeader>
              <CardTitle>Why Algorand?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-silver-300">
                <div><strong className="text-primary-400">Instant Finality:</strong> Transactions settle in ~4 seconds with no risk of forks</div>
                <div><strong className="text-primary-400">Low Fees:</strong> Only 0.001 ALGO per transaction (fraction of a cent)</div>
                <div><strong className="text-primary-400">Eco-Friendly:</strong> Carbon-negative blockchain with minimal energy consumption</div>
                <div><strong className="text-primary-400">Secure:</strong> Military-grade cryptography and battle-tested consensus</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}