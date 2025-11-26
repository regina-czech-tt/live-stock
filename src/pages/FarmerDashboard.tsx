import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SellAssetModal } from "@/components/SellAssetModal";
import { EditAssetModal } from "@/components/EditAssetModal";
import { AddAssetForm } from "@/components/AddAssetForm";
import { useApp } from "@/context/AppContext";
import { Pencil, LayoutDashboard, PlusCircle, User, MapPin, Calendar, Star, TrendingUp, Award } from "lucide-react";
import {
  Asset,
  Farmer,
  calculateTotalShares,
  calculateSharesSold,
  calculateFundingProgress,
  calculateInvestorOwnership,
} from "@/types";

type FarmerTab = "overview" | "add" | "profile";

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
  const { state, markDeceased, updateFarmer } = useApp();
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<FarmerTab>("overview");

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: "",
    farmName: "",
    location: "",
    established: "",
    bio: "",
    specialties: "",
  });
  const [profileSaved, setProfileSaved] = useState(false);

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

  // For demo purposes, we'll use farmer-1 (Regina) as the current farmer
  const currentFarmerId = "farmer-1";
  const currentFarmer = state.farmers?.find(f => f.id === currentFarmerId);

  // Load farmer data into form when it changes
  useEffect(() => {
    if (currentFarmer) {
      setProfileForm({
        name: currentFarmer.name || "",
        farmName: currentFarmer.farmName || "",
        location: currentFarmer.location || "",
        established: currentFarmer.established?.toString() || "",
        bio: currentFarmer.bio || "",
        specialties: currentFarmer.specialties?.join(", ") || "",
      });
    }
  }, [currentFarmer?.id]);

  // Handle profile form save
  const handleSaveProfile = () => {
    if (!currentFarmerId) return;

    const updates: Partial<Farmer> = {
      name: profileForm.name,
      farmName: profileForm.farmName,
      location: profileForm.location,
      established: profileForm.established ? parseInt(profileForm.established) : undefined,
      bio: profileForm.bio,
      specialties: profileForm.specialties
        .split(",")
        .map(s => s.trim())
        .filter(s => s.length > 0),
    };

    updateFarmer(currentFarmerId, updates);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  // Calculate farmer stats
  const farmerSoldAssets = myAssets.filter(a => a.status === "sold");
  const farmerDeceasedAssets = myAssets.filter(a => a.status === "deceased");
  const farmerSuccessRate = (farmerSoldAssets.length + farmerDeceasedAssets.length) > 0
    ? ((farmerSoldAssets.length / (farmerSoldAssets.length + farmerDeceasedAssets.length)) * 100)
    : 100;

  const sidebarItems = [
    { id: "overview" as FarmerTab, label: "Overview", icon: LayoutDashboard },
    { id: "add" as FarmerTab, label: "Add Asset", icon: PlusCircle },
    { id: "profile" as FarmerTab, label: "My Profile", icon: User },
  ];

  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <aside className="w-56 border-r bg-card/50 p-4 flex-shrink-0">
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {activeTab === "overview" && (
            <div className="max-w-4xl mx-auto">
              {/* Page Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Overview</h1>
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
                    <Button onClick={() => setActiveTab("add")}>
                      List your first asset
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === "add" && (
            <div className="max-w-2xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Add New Asset</h1>
                <p className="text-muted-foreground">
                  List a new animal for investment
                </p>
              </div>
              <AddAssetForm
                farmerId={currentFarmerId}
                farmerName={currentFarmer?.name || "Unknown Farmer"}
              />
            </div>
          )}

          {activeTab === "profile" && (
            <div className="max-w-3xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">My Profile</h1>
                <p className="text-muted-foreground">
                  Manage your farmer profile visible to investors
                </p>
              </div>

              {/* Profile Preview Card */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Profile Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-12 h-12 text-primary" />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold">{currentFarmer?.name || "Your Name"}</h3>
                        {currentFarmer?.farmName && (
                          <p className="text-muted-foreground">{currentFarmer.farmName}</p>
                        )}
                      </div>

                      {/* Location & Established */}
                      <div className="flex flex-wrap gap-4 text-sm">
                        {currentFarmer?.location && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            {currentFarmer.location}
                          </div>
                        )}
                        {currentFarmer?.established && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            Est. {currentFarmer.established}
                          </div>
                        )}
                      </div>

                      {/* Rating */}
                      {currentFarmer?.rating && (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(currentFarmer.rating!)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-medium">{currentFarmer.rating}</span>
                          <span className="text-muted-foreground">
                            ({currentFarmer.reviewCount} reviews)
                          </span>
                        </div>
                      )}

                      {/* Bio */}
                      {currentFarmer?.bio && (
                        <p className="text-muted-foreground">{currentFarmer.bio}</p>
                      )}

                      {/* Specialties */}
                      {currentFarmer?.specialties && currentFarmer.specialties.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {currentFarmer.specialties.map((specialty) => (
                            <Badge key={specialty} variant="secondary">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-lg font-bold">
                            <TrendingUp className="w-4 h-4 text-primary" />
                            {myAssets.length}
                          </div>
                          <div className="text-xs text-muted-foreground">Total Listings</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-lg font-bold">
                            <Award className="w-4 h-4 text-green-500" />
                            {farmerSuccessRate.toFixed(0)}%
                          </div>
                          <div className="text-xs text-muted-foreground">Success Rate</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold">£{totalRaised}</div>
                          <div className="text-xs text-muted-foreground">Total Raised</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* My Listings Section */}
              {myAssets.length > 0 && (
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>My Listings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {myAssets.map((asset) => (
                        <Link
                          key={asset.id}
                          to={`/asset/${asset.id}`}
                          className="group block"
                        >
                          <div className="aspect-square rounded-lg overflow-hidden mb-2 bg-muted">
                            <img
                              src={asset.imageUrl}
                              alt={asset.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                            {asset.name}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {asset.type} - {asset.breed}
                          </p>
                          <Badge
                            variant={
                              asset.status === "open"
                                ? "default"
                                : asset.status === "funded"
                                ? "secondary"
                                : asset.status === "sold"
                                ? "outline"
                                : "destructive"
                            }
                            className="mt-1 text-xs"
                          >
                            {asset.status}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Edit Profile Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="farmName">Farm Name</Label>
                      <Input
                        id="farmName"
                        value={profileForm.farmName}
                        onChange={(e) => setProfileForm({ ...profileForm, farmName: e.target.value })}
                        placeholder="Your farm's name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={profileForm.location}
                        onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                        placeholder="e.g., Scottish Highlands"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="established">Year Established</Label>
                      <Input
                        id="established"
                        type="number"
                        value={profileForm.established}
                        onChange={(e) => setProfileForm({ ...profileForm, established: e.target.value })}
                        placeholder="e.g., 1990"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      placeholder="Tell investors about yourself and your farm..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialties">Specialties</Label>
                    <Input
                      id="specialties"
                      value={profileForm.specialties}
                      onChange={(e) => setProfileForm({ ...profileForm, specialties: e.target.value })}
                      placeholder="e.g., Dairy, Organic, Heritage Breeds"
                    />
                    <p className="text-xs text-muted-foreground">
                      Separate multiple specialties with commas
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <Button onClick={handleSaveProfile}>
                      Save Changes
                    </Button>
                    {profileSaved && (
                      <span className="text-sm text-green-600 font-medium">
                        Profile saved successfully!
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>

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
                  variant="outline"
                  className="border-gray-400 text-muted-foreground hover:bg-transparent hover:text-destructive hover:border-destructive"
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
