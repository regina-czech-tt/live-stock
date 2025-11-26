import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { InvestModal } from "@/components/InvestModal";
import { useApp } from "@/context/AppContext";
import {
  calculateTotalShares,
  calculateSharesSold,
  calculateSharesRemaining,
  calculateFundingProgress,
  calculateInvestorOwnership,
  FarmerReview,
} from "@/types";
import {
  Heart,
  MapPin,
  Calendar,
  Star,
  ArrowLeft,
  User,
  TrendingUp,
  Award,
} from "lucide-react";

const AssetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getAsset, getFarmer, toggleFavorite, isFavorite, state } = useApp();
  const [investModalOpen, setInvestModalOpen] = useState(false);

  const asset = getAsset(id || "");
  const farmer = asset ? getFarmer(asset.farmerId) : undefined;

  if (!asset) {
    return (
      <Layout>
        <div className="py-20 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Asset Not Found</h1>
          <Link to="/marketplace" className="text-primary hover:underline">
            ← Back to Marketplace
          </Link>
        </div>
      </Layout>
    );
  }

  const totalShares = calculateTotalShares(asset);
  const sharesSold = calculateSharesSold(asset);
  const sharesRemaining = calculateSharesRemaining(asset);
  const fundingProgress = calculateFundingProgress(asset);
  const investorOwnership = calculateInvestorOwnership(asset) * 100;
  const favorited = isFavorite(asset.id);

  // Calculate farmer stats from all their assets
  const farmerAssets = state.assets.filter(a => a.farmerId === asset.farmerId);
  const farmerSoldAssets = farmerAssets.filter(a => a.status === "sold");
  const farmerDeceasedAssets = farmerAssets.filter(a => a.status === "deceased");
  const farmerSuccessRate = farmerAssets.length > 0
    ? ((farmerSoldAssets.length / (farmerSoldAssets.length + farmerDeceasedAssets.length)) * 100) || 100
    : 100;
  const farmerTotalRaised = farmerAssets.reduce((sum, a) => sum + a.amountRaised, 0);

  // Get reviews for this farmer from state
  const farmerReviews = (state.reviews || []).filter(r => r.farmerId === asset.farmerId);
  const actualReviewCount = farmerReviews.length;
  const actualRating = actualReviewCount > 0
    ? farmerReviews.reduce((sum, r) => sum + r.rating, 0) / actualReviewCount
    : 0;

  const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    open: { label: "Open for Investment", variant: "default" },
    funded: { label: "Fully Funded", variant: "secondary" },
    sold: { label: "Sold", variant: "outline" },
    deceased: { label: "Deceased", variant: "destructive" },
  };

  const status = statusConfig[asset.status];

  return (
    <Layout>
      <div className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Back Button */}
          <Link
            to="/marketplace"
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Marketplace
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Image and Basic Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Main Image */}
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <img
                  src={asset.imageUrl}
                  alt={asset.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => toggleFavorite(asset.id)}
                  className="absolute top-4 right-4 p-2 bg-background/80 backdrop-blur rounded-full hover:bg-background transition-colors"
                >
                  <Heart
                    className={`w-6 h-6 ${favorited ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
                  />
                </button>
                <Badge className="absolute top-4 left-4" variant={status.variant}>
                  {status.label}
                </Badge>
              </div>

              {/* Asset Details */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-3xl">{asset.name}</CardTitle>
                      <p className="text-muted-foreground mt-1">
                        {asset.type} • {asset.breed}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">£{asset.sharePrice}</div>
                      <div className="text-sm text-muted-foreground">per share</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Description */}
                  {asset.description && (
                    <div>
                      <h3 className="font-semibold mb-2">About this {asset.type}</h3>
                      <p className="text-muted-foreground">{asset.description}</p>
                    </div>
                  )}

                  {/* Key Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold">£{asset.purchasePrice}</div>
                      <div className="text-sm text-muted-foreground">Purchase Price</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold">£{asset.fundingGoal}</div>
                      <div className="text-sm text-muted-foreground">Funding Goal</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold">{Math.round(totalShares)}</div>
                      <div className="text-sm text-muted-foreground">Total Shares</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold">{investorOwnership.toFixed(0)}%</div>
                      <div className="text-sm text-muted-foreground">Investor Ownership</div>
                    </div>
                  </div>

                  {/* Sale Info (if sold) */}
                  {asset.status === "sold" && asset.salePrice && (
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <h3 className="font-semibold text-green-600 mb-2">Sale Complete</h3>
                      <p className="text-muted-foreground">
                        This {asset.type.toLowerCase()} was sold for{" "}
                        <span className="font-bold text-foreground">£{asset.salePrice}</span>
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Farmer Profile Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    About the Farmer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Farmer Avatar/Image */}
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-12 h-12 text-primary" />
                      </div>
                    </div>

                    {/* Farmer Info */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold">{farmer?.name || asset.farmerName}</h3>
                        {farmer?.farmName && (
                          <p className="text-muted-foreground">{farmer.farmName}</p>
                        )}
                      </div>

                      {/* Location & Established */}
                      <div className="flex flex-wrap gap-4 text-sm">
                        {farmer?.location && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            {farmer.location}
                          </div>
                        )}
                        {farmer?.established && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            Est. {farmer.established}
                          </div>
                        )}
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(actualRating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                        {actualReviewCount > 0 ? (
                          <>
                            <span className="font-medium">{actualRating.toFixed(1)}</span>
                            <span className="text-muted-foreground">
                              ({actualReviewCount} {actualReviewCount === 1 ? 'review' : 'reviews'})
                            </span>
                          </>
                        ) : (
                          <span className="text-muted-foreground">No reviews yet</span>
                        )}
                      </div>

                      {/* Bio */}
                      {farmer?.bio && (
                        <p className="text-muted-foreground">{farmer.bio}</p>
                      )}

                      {/* Specialties */}
                      {farmer?.specialties && farmer.specialties.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {farmer.specialties.map((specialty) => (
                            <Badge key={specialty} variant="secondary">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Farmer Stats */}
                      <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-lg font-bold">
                            <TrendingUp className="w-4 h-4 text-primary" />
                            {farmerAssets.length}
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
                          <div className="text-lg font-bold">£{farmerTotalRaised}</div>
                          <div className="text-xs text-muted-foreground">Total Raised</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reviews List */}
                  {farmerReviews.length > 0 && (
                    <div className="mt-6 pt-6 border-t">
                      <h4 className="font-semibold mb-4">Investor Reviews</h4>
                      <div className="space-y-4">
                        {farmerReviews.map((review) => (
                          <div key={review.id} className="p-4 bg-muted/50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  <User className="w-4 h-4 text-primary" />
                                </div>
                                <span className="font-medium text-sm">{review.investorName}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < review.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-muted-foreground"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            {review.comment && (
                              <p className="text-sm text-muted-foreground">{review.comment}</p>
                            )}
                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Investment Card */}
            <div className="space-y-6">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Investment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Funding Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Funding Progress</span>
                      <span className="font-medium">
                        £{asset.amountRaised} / £{asset.fundingGoal}
                      </span>
                    </div>
                    <Progress value={fundingProgress} className="h-3" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>{Math.round(sharesSold)} shares sold</span>
                      <span>{Math.round(sharesRemaining)} remaining</span>
                    </div>
                  </div>

                  {/* Investment Summary */}
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Share Price</span>
                      <span className="font-medium">£{asset.sharePrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shares Available</span>
                      <span className="font-medium">{Math.round(sharesRemaining)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Your Ownership per Share</span>
                      <span className="font-medium">
                        {(investorOwnership / totalShares).toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  {/* Invest Button */}
                  {asset.status === "open" && (
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={() => setInvestModalOpen(true)}
                    >
                      Invest Now
                    </Button>
                  )}

                  {asset.status === "funded" && (
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-muted-foreground">
                        This investment is fully funded
                      </p>
                    </div>
                  )}

                  {asset.status === "sold" && (
                    <div className="text-center p-4 bg-green-500/10 rounded-lg">
                      <p className="text-green-600 font-medium">
                        Investment Complete - Returns Distributed
                      </p>
                    </div>
                  )}

                  {asset.status === "deceased" && (
                    <div className="text-center p-4 bg-destructive/10 rounded-lg">
                      <p className="text-destructive font-medium">
                        Investment Lost
                      </p>
                    </div>
                  )}

                  {/* Risk Notice */}
                  <p className="text-xs text-muted-foreground">
                    Investment involves risk. The value of your investment can go down
                    as well as up. In the event of animal death, you may lose your
                    entire investment.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <InvestModal
        asset={asset}
        open={investModalOpen}
        onClose={() => setInvestModalOpen(false)}
      />
    </Layout>
  );
};

export default AssetDetail;
