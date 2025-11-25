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
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={cow.imageUrl}
          alt={cow.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-card/90 backdrop-blur">
            {cow.healthStatus}
          </Badge>
        </div>
        <button className="absolute top-3 left-3 w-8 h-8 rounded-full bg-card/90 backdrop-blur flex items-center justify-center hover:bg-card transition-colors">
          <Heart className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="p-5">
        <div className="mb-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="text-xl font-bold text-foreground">{cow.name}</h4>
              <p className="text-sm text-muted-foreground">
                {cow.breed} • {cow.age}
              </p>
            </div>
            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
              <TrendingUp className="w-3 h-3 mr-1" />
              +{cow.expectedReturn}%
            </Badge>
          </div>

          <div className="text-2xl font-bold text-foreground mb-1">
            ${cow.currentValue.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">Current Valuation</p>
        </div>

        <div className="space-y-3 mb-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Shares Available</span>
              <span className="font-semibold text-foreground">{cow.sharesAvailable}%</span>
            </div>
            <Progress value={sharesSold} className="h-2" />
          </div>
        </div>

        <Button className="w-full">
          Invest Now
        </Button>
      </div>
    </Card>
  );
};
