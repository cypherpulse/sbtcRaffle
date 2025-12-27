import { useState, useEffect, useCallback } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ConnectWallet } from '@/components/ConnectWallet';
import { RaffleInfo } from '@/components/RaffleInfo';
import { BuyTicketsForm } from '@/components/BuyTicketsForm';
import { OwnerControls } from '@/components/OwnerControls';
import { WinnerClaim } from '@/components/WinnerClaim';
import { BitcoinSymbol } from '@/components/icons/BitcoinIcon';
import { getWalletState, getTicketPrice, formatMicroUnits, type WalletState } from '@/lib/stacks';
import { Sparkles, ExternalLink, Zap } from 'lucide-react';

function App() {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [ticketPrice, setTicketPrice] = useState(0.01);

  // Check initial wallet state
  useEffect(() => {
    const state = getWalletState();
    setWalletState(state);
  }, []);

  // Fetch ticket price
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const price = await getTicketPrice();
        setTicketPrice(parseFloat(formatMicroUnits(price, 8)));
      } catch (error) {
        console.error('Error fetching ticket price:', error);
      }
    };
    fetchPrice();
  }, []);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTrigger((prev) => prev + 1);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <div className="min-h-screen hero-gradient">
        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <BitcoinSymbol className="text-5xl text-primary animate-float" />
                  <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground">
                    sBTC Lucky Raffle
                  </h1>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Zap className="w-3 h-3 text-primary" />
                    Powered by Stacks L2
                  </p>
                </div>
              </div>
              <ConnectWallet walletState={walletState} onWalletChange={setWalletState} />
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative py-12 lg:py-20 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl animate-pulse" />
          </div>
          
          <div className="container mx-auto px-4 relative">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <span className="text-sm text-primary font-medium">
                  Stacks Builder Challenge #3
                </span>
                <BitcoinSymbol className="text-primary" />
              </div>
              
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6">
                Win the{' '}
                <span className="text-glow-orange jackpot-counter">
                  sBTC Jackpot
                </span>
                {' '}<BitcoinSymbol className="inline text-primary" />
              </h2>
              
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Buy tickets with sBTC, increase your odds, and win the entire pot!
                Fully decentralized on Bitcoin L2.
              </p>
            </div>

            {/* Main Content Grid */}
            <div className="space-y-8">
              {/* Winner Claim - Shows when user is winner */}
              <WinnerClaim
                walletState={walletState}
                onClaim={handleRefresh}
                refreshTrigger={refreshTrigger}
              />

              {/* Raffle Stats */}
              <RaffleInfo walletState={walletState} refreshTrigger={refreshTrigger} />

              {/* Action Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BuyTicketsForm
                  walletState={walletState}
                  ticketPrice={ticketPrice}
                  onPurchase={handleRefresh}
                />
                
                <div className="space-y-6">
                  <OwnerControls walletState={walletState} onAction={handleRefresh} />
                  
                  {/* How It Works */}
                  <div className="p-6 rounded-xl card-gradient border-glow">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      How It Works
                    </h3>
                    <ol className="space-y-3 text-sm text-muted-foreground">
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">1</span>
                        <span>Connect your Stacks wallet (Leather/Xverse)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">2</span>
                        <span>Buy raffle tickets with sBTC (testnet)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">3</span>
                        <span>When the raffle ends, a random winner is drawn</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">4</span>
                        <span>Winner claims the entire sBTC pot!</span>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <BitcoinSymbol className="text-primary" />
                <span>sBTC Lucky Raffle - Stacks Testnet</span>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="https://explorer.hiro.so/address/STGDS0Y17973EN5TCHNHGJJ9B31XWQ5YXBQ0KQ2Y.sbtc-lucky-raffle?chain=testnet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-primary transition-colors"
                >
                  View Contract
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://cloud.reown.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-primary transition-colors"
                >
                  WalletConnect
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
}

export default App;
