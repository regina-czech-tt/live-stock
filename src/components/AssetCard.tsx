import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Heart } from "lucide-react";
import { useApp } from "@/context/AppContext";
import {
  Asset,
  calculateTotalShares,
  calculateSharesRemaining,
  calculateFundingProgress,
  calculateInvestorOwnership,
} from "@/types";

interface AssetCardProps {
  asset: Asset;
  onInvest?: (asset: Asset) => void;
}

const statusConfig = {
  open: { label: 'Open', variant: 'default' as const },
  funded: { label: 'Funded', variant: 'secondary' as const },
  sold: { label: 'Sold', variant: 'outline' as const },
  deceased: { label: 'Deceased', variant: 'destructive' as const },
};

export const AssetCard = ({ asset, onInvest }: AssetCardProps) => {
  const { toggleFavorite, isFavorite } = useApp();
  const totalShares = calculateTotalShares(asset);
  const sharesRemaining = calculateSharesRemaining(asset);
  const fundingProgress = calculateFundingProgress(asset);
  const investorOwnership = calculateInvestorOwnership(asset) * 100;
  const status = statusConfig[asset.status];
  const favorited = isFavorite(asset.id);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative h-72 overflow-hidden">
        <img
          src={asset.imageUrl}
          alt={asset.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <Badge
            variant={status.variant}
            className={asset.status === 'sold' ? 'bg-white text-gray-900 border-white' : ''}
          >
            {status.label}
          </Badge>
        </div>
        <button
          onClick={() => toggleFavorite(asset.id)}
          className="absolute top-3 left-3 w-8 h-8 rounded-full bg-card/90 backdrop-blur flex items-center justify-center hover:bg-card transition-colors"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              favorited ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
            }`}
          />
        </button>
      </div>

      <div className="p-5">
        <div className="mb-4">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h4 className="text-xl font-bold text-foreground">{asset.name}</h4>
              <p className="text-sm text-muted-foreground">
                {asset.type} • {asset.breed}
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            by {asset.farmerName}
          </p>
        </div>

        {/* Funding Progress */}
        <div className="space-y-3 mb-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Raised</span>
              <span className="font-semibold text-foreground">
                £{asset.amountRaised} / £{asset.fundingGoal}
              </span>
            </div>
            <Progress value={fundingProgress} className="h-2" />
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shares remaining</span>
            <span className="font-medium">{sharesRemaining} / {totalShares}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Share price</span>
            <span className="font-medium">£{asset.sharePrice}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Investor ownership</span>
            <span className="font-medium">{investorOwnership.toFixed(0)}%</span>
          </div>
        </div>

        {asset.status === 'open' && (
          <Button
            className="w-full"
            onClick={() => onInvest?.(asset)}
          >
            Invest Now
          </Button>
        )}

        {asset.status === 'funded' && (
          <Button className="w-full" variant="secondary" disabled>
            Fully Funded
          </Button>
        )}

        {asset.status === 'sold' && (
          <div className="text-center p-2 bg-green-50 rounded-md">
            <span className="text-sm text-green-700 font-medium">
              Sold for £{asset.salePrice}
            </span>
          </div>
        )}

        {asset.status === 'deceased' && (
          <div className="text-center p-2 bg-red-50 rounded-md">
            <span className="text-sm text-red-700 font-medium">
              Investment Lost
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};
