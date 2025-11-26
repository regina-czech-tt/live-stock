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
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="text-4xl">🌾</span>
          <h3 className="text-4xl font-bold text-foreground">How It Works</h3>
          <span className="text-4xl">🌾</span>
        </div>
        <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
          A simple, honest way to invest in real agriculture. Support your local farmers while earning returns.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <Card key={index} className="p-8 relative overflow-hidden hover:shadow-xl transition-all border-2 border-border bg-card">
              <div className="absolute -top-4 -right-4 text-8xl font-bold text-primary/5">
                {index + 1}
              </div>
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-primary/15 border-2 border-primary/30 flex items-center justify-center mb-5">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-xl font-bold mb-3 text-foreground">{step.title}</h4>
                <p className="text-sm text-foreground/70 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-10 bg-accent/10 border-2 border-accent/30">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">💰</span>
            <h4 className="text-2xl font-bold text-foreground">For Investors</h4>
          </div>
          <ul className="space-y-4 text-base text-foreground/80">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl font-bold mt-1">✓</span>
              <span>Direct ownership in real agricultural assets</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl font-bold mt-1">✓</span>
              <span>Clear, transparent returns when cattle sell</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl font-bold mt-1">✓</span>
              <span>Support your local farming community</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl font-bold mt-1">✓</span>
              <span>Invest as little or as much as you want</span>
            </li>
          </ul>
        </Card>
        <Card className="p-10 bg-primary/10 border-2 border-primary/30">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">🚜</span>
            <h4 className="text-2xl font-bold text-foreground">For Farmers</h4>
          </div>
          <ul className="space-y-4 text-base text-foreground/80">
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl font-bold mt-1">✓</span>
              <span>Get cash upfront to cover feed and expenses</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl font-bold mt-1">✓</span>
              <span>Transfer market risk to willing investors</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl font-bold mt-1">✓</span>
              <span>Keep management fees regardless of outcome</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary text-xl font-bold mt-1">✓</span>
              <span>Focus on raising healthy cattle, not finances</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
};
