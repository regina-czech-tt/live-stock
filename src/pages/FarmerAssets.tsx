import { useState } from "react";
import { FarmerLayout } from "@/components/FarmerLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SellAssetModal } from "@/components/SellAssetModal";
import { EditAssetModal } from "@/components/EditAssetModal";
import { useApp } from "@/context/AppContext";
import { Pencil, Trash2 } from "lucide-react";
import {
  Asset,
  calculateTotalShares,
  calculateSharesSold,
  calculateFundingProgress,
  calculateInvestorOwnership,
} from "@/types";

/**
 * FarmerAssets Page
 *
 * WHAT THIS DOES:
 * - Shows all assets in a list/table view for management
 * - Allows editing, selling, and marking deceased
 * - More detailed management view than the dashboard
 */

const FarmerAssets = () => {
  const { state, markDeceased } = useApp();
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "open" | "funded" | "sold" | "deceased">("all");

  const myAssets = state.assets;

  const filteredAssets = filter === "all"
    ? myAssets
    : myAssets.filter((a) => a.status === filter);

  const handleSellClick = (asset: Asset) => {
    setSelectedAsset(asset);
    setSellModalOpen(true);
  };

  const handleEditClick = (asset: Asset) => {
    setSelectedAsset(asset);
    setEditModalOpen(true);
  };

  const handleMarkDeceased = (asset: Asset) => {
    if (confirm(`Are you sure you want to mark ${asset.name} as deceased? This cannot be undone.`)) {
      markDeceased(asset.id);
    }
  };

  const handleCloseSellModal = () => {
    setSellModalOpen(false);
    setSelectedAsset(null);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedAsset(null);
  };

  const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    open: { label: "Open", variant: "default" },
    funded: { label: "Funded", variant: "secondary" },
    sold: { label: "Sold", variant: "outline" },
    deceased: { label: "Deceased", variant: "destructive" },
  };

  return (
    <FarmerLayout>
      <section className="p-6">
        <div className="max-w-5xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">My Assets</h1>
            <p className="text-muted-foreground">
              Manage all your listed animals
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6">
            {(["all", "open", "funded", "sold", "deceased"] as const).map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                {f !== "all" && (
                  <span className="ml-1 text-xs opacity-70">
                    ({myAssets.filter((a) => a.status === f).length})
                  </span>
                )}
              </Button>
            ))}
          </div>

          {/* Assets List */}
          <div className="space-y-3">
            {filteredAssets.map((asset) => {
              const totalShares = calculateTotalShares(asset);
              const sharesSold = calculateSharesSold(asset);
              const fundingProgress = calculateFundingProgress(asset);
              const investorOwnership = calculateInvestorOwnership(asset) * 100;
              const status = statusConfig[asset.status];
              const canSell = asset.status === "funded" || asset.status === "open";
              const canMarkDeceased = asset.status === "open" || asset.status === "funded";

              return (
                <Card key={asset.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Image */}
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={asset.imageUrl}
                          alt={asset.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold">{asset.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {asset.type} • {asset.breed}
                            </p>
                          </div>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </div>

                        {/* Progress for active assets */}
                        {(asset.status === "open" || asset.status === "funded") && (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                              <span>£{asset.amountRaised} / £{asset.fundingGoal}</span>
                              <span>{sharesSold}/{totalShares} shares</span>
                            </div>
                            <Progress value={fundingProgress} className="h-1.5" />
                          </div>
                        )}

                        {/* Sale info for sold assets */}
                        {asset.status === "sold" && asset.salePrice && (
                          <p className="mt-2 text-sm text-green-600 font-medium">
                            Sold for £{asset.salePrice}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {(asset.status === "open" || asset.status === "funded") && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditClick(asset)}
                          >
                            <Pencil className="w-3 h-3" />
                          </Button>
                        )}
                        {canSell && (
                          <Button size="sm" onClick={() => handleSellClick(asset)}>
                            Mark Sold
                          </Button>
                        )}
                        {canMarkDeceased && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleMarkDeceased(asset)}
                          >
                            Deceased
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {filteredAssets.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    No assets found.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      <SellAssetModal
        asset={selectedAsset}
        open={sellModalOpen}
        onClose={handleCloseSellModal}
      />

      <EditAssetModal
        asset={selectedAsset}
        open={editModalOpen}
        onClose={handleCloseEditModal}
      />
    </FarmerLayout>
  );
};

export default FarmerAssets;
