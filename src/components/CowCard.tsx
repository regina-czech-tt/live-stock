import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Heart } from "lucide-react";

interface CowCardProps {
  cow: {
    id: string;
    name: string;
    breed: string;
    age: string;
    currentValue: number;
    sharesAvailable: number;
    expectedReturn: number;
    healthStatus: string;
    imageUrl: string;
  };
}

export const CowCard = ({ cow }: CowCardProps) => {
  const sharesSold = 100 - cow.sharesAvailable;

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-2 border-border bg-card">
      <div className="relative h-56 overflow-hidden">
        <img
          src={cow.imageUrl}
          alt={cow.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
        <div className="absolute top-4 right-4">
          <Badge className="bg-card border-2 border-success text-success font-semibold shadow-md">
            {cow.healthStatus}
          </Badge>
        </div>
        <button className="absolute top-4 left-4 w-10 h-10 rounded-full bg-card border-2 border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors shadow-md">
          <Heart className="w-5 h-5" />
        </button>
        <div className="absolute bottom-4 left-4 right-4">
          <h4 className="text-2xl font-bold text-white mb-1 drop-shadow-lg">{cow.name}</h4>
          <p className="text-sm text-white/90 font-semibold drop-shadow">
            {cow.breed} • {cow.age}
          </p>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-3xl font-bold text-foreground">
                ${cow.currentValue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Current Value</p>
            </div>
            <Badge className="bg-success/15 text-success border-2 border-success/30 px-3 py-1">
              <TrendingUp className="w-4 h-4 mr-1" />
              +{cow.expectedReturn}%
            </Badge>
          </div>
        </div>

        <div className="space-y-4 mb-5">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground font-semibold">Shares Available</span>
              <span className="font-bold text-foreground">{cow.sharesAvailable}%</span>
            </div>
            <Progress value={sharesSold} className="h-3 bg-muted border border-border" />
          </div>
        </div>

        <Button className="w-full font-semibold text-base shadow-md">
          Invest in {cow.name}
        </Button>
      </div>
    </Card>
  );
};
