import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SellAssetModal } from "@/components/SellAssetModal";
import { EditAssetModal } from "@/components/EditAssetModal";
import { useApp } from "@/context/AppContext";
import { Pencil } from "lucide-react";
import {
  Asset,
  calculateTotalShares,
  calculateSharesSold,
  calculateFundingProgress,
  calculateInvestorOwnership,
} from "@/types";

/**
 * Farmer Dashboard Page
 *
 * WHAT THIS DOES:
 * - Shows all assets listed by the current farmer
 * - Allows farmer to:
 *   1. See funding progress for each asset
 *   2. Mark an asset as sold (triggers investor payouts)
 *   3. Mark an asset as deceased (investors lose money)
 *
 * WHO SEES THIS:
 * - Only farmers (later we'll add role-based access)
 * - For now, shows assets where farmerId matches current user
 *
 * KEY ACTIONS:
 * - "Mark as Sold" → Opens SellAssetModal → Distributes payouts
 * - "Mark Deceased" → Sets status to deceased → Investors get £0
 */

const FarmerDashboard = () => {
  const { state, markDeceased } = useApp();
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  /**
   * Filter to show only assets created by this farmer.
   * In a real app, farmerId would come from authentication.
   * For now we show ALL assets for demo purposes.
   */
  const myAssets = state.assets;

  // Group assets by status
  const openAssets = myAssets.filter((a) => a.status === "open");
  const fundedAssets = myAssets.filter((a) => a.status === "funded");
  const completedAssets = myAssets.filter(
    (a) => a.status === "sold" || a.status === "deceased"
  );

  // Calculate summary stats
  const totalRaised = myAssets.reduce((sum, a) => sum + a.amountRaised, 0);
  const totalSold = myAssets
    .filter((a) => a.status === "sold")
    .reduce((sum, a) => sum + (a.salePrice || 0), 0);

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

  return (
    <Layout>
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Farmer Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your listed assets and complete sales
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Assets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{myAssets.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Funds Raised
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">£{totalRaised}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {openAssets.length + fundedAssets.length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Sales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  £{totalSold}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Open Assets */}
          {openAssets.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Open for Investment</h2>
              <div className="space-y-4">
                {openAssets.map((asset) => (
                  <FarmerAssetCard
                    key={asset.id}
                    asset={asset}
                    onSell={handleSellClick}
                    onEdit={handleEditClick}
                    onMarkDeceased={handleMarkDeceased}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Funded Assets (Ready to Sell) */}
          {fundedAssets.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                Funded (Ready to Sell)
              </h2>
              <div className="space-y-4">
                {fundedAssets.map((asset) => (
                  <FarmerAssetCard
                    key={asset.id}
                    asset={asset}
                    onSell={handleSellClick}
                    onEdit={handleEditClick}
                    onMarkDeceased={handleMarkDeceased}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Completed Assets */}
          {completedAssets.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Completed</h2>
              <div className="space-y-4">
                {completedAssets.map((asset) => (
                  <FarmerAssetCard
                    key={asset.id}
                    asset={asset}
                    onSell={handleSellClick}
                    onEdit={handleEditClick}
                    onMarkDeceased={handleMarkDeceased}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {myAssets.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">
                  You haven't listed any assets yet.
                </p>
                <a href="/add-cow" className="text-primary hover:underline">
                  List your first asset →
                </a>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Sell Modal */}
      <SellAssetModal
        asset={selectedAsset}
        open={sellModalOpen}
        onClose={handleCloseSellModal}
      />

      {/* Edit Modal */}
      <EditAssetModal
        asset={selectedAsset}
        open={editModalOpen}
        onClose={handleCloseEditModal}
      />
    </Layout>
  );
};

/**
 * FarmerAssetCard Component
 *
 * Shows a single asset with farmer-specific actions:
 * - Funding progress
 * - "Mark as Sold" button (for raising assets)
 * - "Mark Deceased" button
 */
interface FarmerAssetCardProps {
  asset: Asset;
  onSell: (asset: Asset) => void;
  onEdit: (asset: Asset) => void;
  onMarkDeceased: (asset: Asset) => void;
}

function FarmerAssetCard({ asset, onSell, onEdit, onMarkDeceased }: FarmerAssetCardProps) {
  const totalShares = calculateTotalShares(asset);
  const sharesSold = calculateSharesSold(asset);
  const fundingProgress = calculateFundingProgress(asset);
  const investorOwnership = calculateInvestorOwnership(asset) * 100;

  const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    open: { label: "Open", variant: "default" },
    funded: { label: "Funded", variant: "secondary" },
    sold: { label: "Sold", variant: "outline" },
    deceased: { label: "Deceased", variant: "destructive" },
  };

  const status = statusConfig[asset.status];
  const canSell = asset.status === "funded" || asset.status === "open";
  const canMarkDeceased = asset.status === "open" || asset.status === "funded";

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Asset Image */}
          <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={asset.imageUrl}
              alt={asset.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h3 className="font-semibold">{asset.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {asset.type} • {asset.breed}
                </p>
              </div>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>

            {/* Funding Progress (for active assets) */}
            {(asset.status === "open" || asset.status === "funded") && (
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Funding</span>
                  <span>
                    £{asset.amountRaised} / £{asset.fundingGoal}
                  </span>
                </div>
                <Progress value={fundingProgress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>
                    {sharesSold} / {totalShares} shares sold
                  </span>
                  <span>{investorOwnership.toFixed(0)}% investor owned</span>
                </div>
              </div>
            )}

            {/* Sale Info (for sold assets) */}
            {asset.status === "sold" && asset.salePrice && (
              <div className="text-sm">
                <span className="text-muted-foreground">Sold for: </span>
                <span className="font-medium text-green-600">
                  £{asset.salePrice}
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 mt-3">
              {/* Edit button - always available for active assets */}
              {(asset.status === "open" || asset.status === "funded") && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(asset)}
                >
                  <Pencil className="w-3 h-3 mr-1" />
                  Edit
                </Button>
              )}
              {canSell && (
                <Button size="sm" onClick={() => onSell(asset)}>
                  Mark as Sold
                </Button>
              )}
              {canMarkDeceased && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onMarkDeceased(asset)}
                >
                  Mark Deceased
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default FarmerDashboard;
