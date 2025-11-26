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
      <section className="py-24 px-4 relative overflow-hidden farm-texture">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/10 via-background to-background" />
        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <Badge className="mb-6 bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 shadow-md">
            🌾 Supporting Local Agriculture
          </Badge>
          <h2 className="text-6xl font-bold mb-6 text-foreground leading-tight">
            Invest in Local Livestock,
            <br />
            <span className="text-primary">Support Your Farmers</span>
          </h2>
          <p className="text-xl text-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            Buy fractional shares in local cows, provide capital to hardworking farmers, 
            and earn returns when cattle go to market. Real farming, real returns.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="gap-2 shadow-lg text-base font-semibold px-8" asChild>
              <Link to="/marketplace">
                <TrendingUp className="w-5 h-5" />
                See Available Cattle
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-2 font-semibold px-8" asChild>
              <Link to="/how-it-works">
                How It Works
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <Card className="p-8 bg-card border-2 border-border shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/15 flex items-center justify-center mb-4">
                  <Coins className="w-8 h-8 text-primary" />
                </div>
                <div className="text-4xl font-bold text-foreground mb-2">$2.4M</div>
                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Supporting Farmers</div>
              </div>
            </Card>
            <Card className="p-8 bg-card border-2 border-border shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-success/15 flex items-center justify-center mb-4">
                  <TrendingUp className="w-8 h-8 text-success" />
                </div>
                <div className="text-4xl font-bold text-foreground mb-2">18.5%</div>
                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Avg. Return</div>
              </div>
            </Card>
            <Card className="p-8 bg-card border-2 border-border shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-accent/15 flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-accent" />
                </div>
                <div className="text-4xl font-bold text-foreground mb-2">342</div>
                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Active Cattle</div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
