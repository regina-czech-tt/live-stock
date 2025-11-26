import { Card } from "@/components/ui/card";
import { Search, DollarSign, TrendingUp, Repeat } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: "Browse Livestock",
      description: "Explore verified cows with detailed health records, breed information, and expected market dates.",
    },
    {
      icon: DollarSign,
      title: "Buy Shares",
      description: "Purchase ownership shares in individual cows. Invest as little or as much as you want.",
    },
    {
      icon: TrendingUp,
      title: "Track Performance",
      description: "Monitor your investment with real-time updates on cow health, market conditions, and value.",
    },
    {
      icon: Repeat,
      title: "Receive Returns",
      description: "When the cow sells at market, receive your proportional share of the profits automatically.",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h3 className="text-3xl font-bold mb-3 text-foreground">How CowShare Works</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A simple, transparent way to invest in agriculture. Support farmers while building your portfolio.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <Card key={index} className="p-6 relative overflow-hidden hover:shadow-md transition-shadow">
              <div className="absolute top-4 right-4 text-5xl font-bold text-primary/5">
                {index + 1}
              </div>
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-lg font-semibold mb-2 text-foreground">{step.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-12 p-8 bg-primary/5 rounded-lg border border-primary/10">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-3 text-foreground">For Investors</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Direct exposure to agricultural commodities</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Transparent ownership of tangible assets</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Potential returns tied to market prices</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Support local farmers and agriculture</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3 text-foreground">For Farmers</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Immediate cash flow for operations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Transfer risk to willing investors</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Keep management fees regardless of outcome</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Reduce exposure to market volatility</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
