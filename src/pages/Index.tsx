import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CowCard } from "@/components/CowCard";
import { HowItWorks } from "@/components/HowItWorks";
import { TrendingUp, Shield, Coins } from "lucide-react";

const Index = () => {
  // Mock data for available cows
  const availableCows = [
    {
      id: "1",
      name: "Bessie",
      breed: "Holstein",
      age: "2 years",
      currentValue: 12500,
      sharesAvailable: 65,
      expectedReturn: 15,
      healthStatus: "Excellent",
      imageUrl: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=600&q=80",
    },
    {
      id: "2",
      name: "Daisy",
      breed: "Angus",
      age: "1.5 years",
      currentValue: 9800,
      sharesAvailable: 42,
      expectedReturn: 22,
      healthStatus: "Good",
      imageUrl: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600&q=80",
    },
    {
      id: "3",
      name: "Buttercup",
      breed: "Jersey",
      age: "3 years",
      currentValue: 15200,
      sharesAvailable: 28,
      expectedReturn: 12,
      healthStatus: "Excellent",
      imageUrl: "https://images.unsplash.com/photo-1464820453369-31d2c0b651af?w=600&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-3xl">🐄</div>
              <h1 className="text-2xl font-bold text-foreground">CowShare</h1>
            </div>
            <nav className="flex items-center gap-6">
              <a href="#marketplace" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Marketplace
              </a>
              <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                How It Works
              </a>
              <Button variant="outline" size="sm">
                Portfolio
              </Button>
              <Button size="sm">Connect Wallet</Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-4 bg-accent text-accent-foreground">
            Agricultural Investment Platform
          </Badge>
          <h2 className="text-5xl font-bold mb-6 text-foreground">
            Invest in Livestock,
            <br />
            <span className="text-primary">Harvest Returns</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Buy shares in individual cows, support farmers, and earn returns when livestock goes to market.
            Agriculture meets modern finance.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Browse Marketplace
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <Card className="p-6 bg-card/50 backdrop-blur">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Coins className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-foreground">$2.4M</div>
                  <div className="text-sm text-muted-foreground">Total Invested</div>
                </div>
              </div>
            </Card>
            <Card className="p-6 bg-card/50 backdrop-blur">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-foreground">18.5%</div>
                  <div className="text-sm text-muted-foreground">Avg. Return</div>
                </div>
              </div>
            </Card>
            <Card className="p-6 bg-card/50 backdrop-blur">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-accent" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-foreground">342</div>
                  <div className="text-sm text-muted-foreground">Active Cows</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Marketplace */}
      <section id="marketplace" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-3xl font-bold mb-2 text-foreground">Available Investments</h3>
              <p className="text-muted-foreground">Browse premium livestock ready for investment</p>
            </div>
            <Button variant="outline">View All</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableCows.map((cow) => (
              <CowCard key={cow.id} cow={cow} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <HowItWorks />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>© 2024 CowShare. Connecting investors with agricultural opportunities.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
