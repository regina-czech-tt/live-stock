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
  calculateInvestorOwnership,
  calculateFarmerOwnership,
} from "@/types";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

/**
 * SellAssetModal Component
 *
 * WHAT THIS DOES:
 * - Allows a farmer to mark their asset as sold
 * - Farmer enters the sale price
 * - Shows breakdown of how money is split (farmer vs investors)
 * - Calls sellAsset() from context to:
 *   1. Update asset status to 'sold'
 *   2. Calculate and record payouts for all investors
 *
 * WHY THIS MATTERS:
 * - This is the "exit event" that completes the investment cycle
 * - Investors get their returns (or losses) based on final sale price
 */

interface SellAssetModalProps {
  asset: Asset | null;
  open: boolean;
  onClose: () => void;
}

export function SellAssetModal({ asset, open, onClose }: SellAssetModalProps) {
  const [salePrice, setSalePrice] = useState("");
  const { sellAsset, markDeceased } = useApp();

  if (!asset) return null;

  const salePriceNum = Number(salePrice) || 0;
  const investorOwnership = calculateInvestorOwnership(asset);
  const farmerOwnership = calculateFarmerOwnership(asset);

  // Calculate how sale proceeds are split
  const investorPortion = salePriceNum * investorOwnership;
  const farmerPortion = salePriceNum * farmerOwnership;

  // Farmer also received money upfront when shares were sold
  const farmerUpfront = asset.amountRaised; // What they got from selling shares
  const farmerTotal = farmerPortion + farmerUpfront;

  // Calculate profit/loss vs purchase price
  const farmerProfit = farmerTotal - asset.purchasePrice;

  const handleSell = () => {
    if (salePriceNum <= 0) {
      toast.error("Please enter a valid sale price");
      return;
    }

    /**
     * Call sellAsset from context.
     * This triggers the payout calculation for ALL investors
     * who bought shares in this asset.
     */
    sellAsset(asset.id, salePriceNum);

    toast.success(`${asset.name} sold for £${salePriceNum}! Payouts distributed.`);
    setSalePrice("");
    onClose();
  };

  const handleMarkDeceased = () => {
    markDeceased(asset.id);
    toast.error(`${asset.name} marked as deceased. Investors have been notified.`);
    onClose();
  };

  const handleClose = () => {
    setSalePrice("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sell {asset.name}</DialogTitle>
          <DialogDescription>
            Enter the final sale price to complete the investment and distribute
            payouts to investors.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Sale Price Input */}
          <div className="space-y-2">
            <Label htmlFor="salePrice">Sale Price (£)</Label>
            <Input
              id="salePrice"
              type="number"
              placeholder="e.g., 1000"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
            />
          </div>

          {/* Breakdown Preview */}
          {salePriceNum > 0 && (
            <div className="bg-muted rounded-lg p-4 space-y-3">
              <h4 className="font-semibold">Payout Breakdown</h4>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sale Price</span>
                  <span>£{salePriceNum}</span>
                </div>

                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Investors ({(investorOwnership * 100).toFixed(0)}%)
                    </span>
                    <span>£{investorPortion.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      You ({(farmerOwnership * 100).toFixed(0)}%)
                    </span>
                    <span>£{farmerPortion.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t pt-2">
                  <div className="flex justify-between text-muted-foreground">
                    <span>+ You received upfront</span>
                    <span>£{farmerUpfront}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Your Total</span>
                    <span>£{farmerTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Your Profit</span>
                    <span className={farmerProfit >= 0 ? "text-green-600" : "text-red-600"}>
                      {farmerProfit >= 0 ? "+" : ""}£{farmerProfit.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleSell}
              disabled={salePriceNum <= 0}
            >
              Confirm Sale
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
