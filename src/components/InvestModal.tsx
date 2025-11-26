import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Asset,
  calculateTotalShares,
  calculateSharesRemaining,
  calculateInvestorOwnership,
} from "@/types";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

/**
 * InvestModal Component
 *
 * WHAT THIS DOES:
 * - Shows a dialog where users can buy shares of an asset
 * - Calculates cost, ownership %, and potential outcomes
 * - When user clicks "Invest", it calls buyShares() from context
 *
 * PROPS:
 * - asset: The animal/asset being invested in
 * - open: Whether modal is visible
 * - onClose: Function to call when modal should close
 */

interface InvestModalProps {
  asset: Asset | null;
  open: boolean;
  onClose: () => void;
}

export function InvestModal({ asset, open, onClose }: InvestModalProps) {
  const [shares, setShares] = useState(1);

  /**
   * Get buyShares function from our global context.
   * When called, it will:
   * 1. Create an Investment record
   * 2. Update the asset's amountRaised
   * 3. Save everything to localStorage
   */
  const { buyShares } = useApp();

  if (!asset) return null;

  const totalShares = calculateTotalShares(asset);
  const sharesRemaining = calculateSharesRemaining(asset);
  const investorOwnership = calculateInvestorOwnership(asset);

  const cost = shares * asset.sharePrice;
  const ownershipPercent = ((shares / totalShares) * investorOwnership * 100).toFixed(2);

  // Scenario calculations
  const goodSalePrice = asset.purchasePrice * 2;
  const badSalePrice = asset.purchasePrice * 0.6;

  const calculatePayout = (salePrice: number) => {
    return ((shares / totalShares) * salePrice * investorOwnership).toFixed(2);
  };

  const goodPayout = calculatePayout(goodSalePrice);
  const badPayout = calculatePayout(badSalePrice);
  const goodProfit = (Number(goodPayout) - cost).toFixed(2);
  const badProfit = (Number(badPayout) - cost).toFixed(2);

  const handleInvest = () => {
    if (shares < 1) {
      toast.error("Must buy at least 1 share");
      return;
    }
    if (shares > sharesRemaining) {
      toast.error(`Only ${sharesRemaining} shares available`);
      return;
    }

    /**
     * Call buyShares from context - this does the real work:
     * - Creates Investment record
     * - Updates asset.amountRaised
     * - Saves to localStorage
     * - Triggers re-render of all components using this data
     */
    buyShares(asset.id, shares, cost);

    toast.success(`Purchased ${shares} shares of ${asset.name} for £${cost}`);
    setShares(1);
    onClose();
  };

  const handleClose = () => {
    setShares(1);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invest in {asset.name}</DialogTitle>
          <DialogDescription>
            {asset.type} • {asset.breed} • by {asset.farmerName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Share Selection */}
          <div className="space-y-2">
            <Label htmlFor="shares">Number of Shares</Label>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setShares(Math.max(1, shares - 1))}
              >
                -
              </Button>
              <Input
                id="shares"
                type="number"
                min={1}
                max={sharesRemaining}
                value={shares}
                onChange={(e) => setShares(Math.max(1, Number(e.target.value)))}
                className="w-20 text-center"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setShares(Math.min(sharesRemaining, shares + 1))}
              >
                +
              </Button>
              <span className="text-sm text-muted-foreground">
                of {sharesRemaining} available
              </span>
            </div>
          </div>

          {/* Cost Summary */}
          <div className="bg-muted rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Price per share</span>
              <span>£{asset.sharePrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shares</span>
              <span>×{shares}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Total Cost</span>
              <span>£{cost}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Your ownership</span>
              <span>{ownershipPercent}%</span>
            </div>
          </div>

          {/* Scenarios */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Potential Outcomes</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-green-800 font-medium">Good Sale</div>
                <div className="text-xs text-green-600">Sells for £{goodSalePrice}</div>
                <div className="mt-1 font-semibold text-green-700">
                  +£{goodProfit}
                </div>
              </div>
              <div className="bg-amber-50 rounded-lg p-3">
                <div className="text-amber-800 font-medium">Low Sale</div>
                <div className="text-xs text-amber-600">Sells for £{badSalePrice}</div>
                <div className="mt-1 font-semibold text-amber-700">
                  {Number(badProfit) >= 0 ? `+£${badProfit}` : `-£${Math.abs(Number(badProfit)).toFixed(2)}`}
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              If the animal dies, you lose your investment (£{cost}).
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={handleClose}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleInvest}>
              Invest £{cost}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
