import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Shield, Coins } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";

const Home = () => {
  return (
    <Layout>
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
            <Button size="lg" className="gap-2" asChild>
              <Link to="/marketplace">
                <TrendingUp className="w-4 h-4" />
                Browse Marketplace
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/how-it-works">
                Learn More
              </Link>
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
    </Layout>
  );
};

export default Home;
