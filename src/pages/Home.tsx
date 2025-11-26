import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Sprout, Users, Milk, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";

const Home = () => {
  // Temporary reset function for testing
  const handleReset = () => {
    if (confirm("This will reset all data to defaults. Are you sure?")) {
      localStorage.removeItem("livestock_data");
      window.location.reload();
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-4 bg-accent text-accent-foreground">
            Supporting Local Dairy Farmers
          </Badge>
          <h1 className="text-5xl font-bold mb-6 text-foreground">
            Don't Have a Cow,
            <br />
            <span className="text-primary">Own Part of One Instead</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Help local farmers thrive by investing in their livestock.
            It's time to mooo-ve your money where it matters—supporting the backbone of our dairy industry,
            one cow at a time.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" className="gap-2" asChild>
              <Link to="/marketplace">
                <Milk className="w-4 h-4" />
                Browse Cows
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/how-it-works">
                How It Works
              </Link>
            </Button>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <Card className="p-6 bg-card/50 backdrop-blur border-primary/20">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-foreground mb-1">Support Local</div>
                  <div className="text-sm text-muted-foreground">
                    Every investment helps a dairy farmer in your community keep their farm running
                  </div>
                </div>
              </div>
            </Card>
            <Card className="p-6 bg-card/50 backdrop-blur border-primary/20">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sprout className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-foreground mb-1">Grow Together</div>
                  <div className="text-sm text-muted-foreground">
                    Share in the success when cows go to market—because agriculture is a team sport
                  </div>
                </div>
              </div>
            </Card>
            <Card className="p-6 bg-card/50 backdrop-blur border-primary/20">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-foreground mb-1">Share the Risk</div>
                  <div className="text-sm text-muted-foreground">
                    Help farmers by shouldering some of the financial burden—no small feat in dairy
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Temporary Reset Button */}
          <div className="mt-8 pt-8 border-t border-dashed border-muted-foreground/20">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-muted-foreground hover:text-destructive"
            >
              <RotateCcw className="w-3 h-3 mr-2" />
              Reset Demo Data
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
