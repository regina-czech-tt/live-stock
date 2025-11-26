/**
 * Asset Status - The lifecycle stages of an investment
 *
 * - open: Accepting investments, shares available to buy
 * - funded: Fully funded, animal being raised, waiting for sale
 * - sold: Sale complete, returns distributed
 * - deceased: Animal died, investment lost
 */
export type AssetStatus = 'open' | 'funded' | 'sold' | 'deceased';

export interface Asset {
  id: string;
  name: string;
  type: string;             // "Cow", "Pig", "Goat", etc.
  breed: string;
  imageUrl: string;
  description?: string;

  purchasePrice: number;    // What farmer paid
  fundingGoal: number;      // How much farmer wants to raise
  amountRaised: number;     // Current progress
  sharePrice: number;       // Price per share (e.g., £10)

  status: AssetStatus;
  salePrice?: number;       // Final sale price (when sold)

  farmerId: string;
  farmerName: string;
}

export interface Investment {
  id: string;
  userId: string;
  assetId: string;
  shares: number;
  amountPaid: number;       // What investor paid
  purchaseDate: string;
  payout?: number;          // What they received (after sale)
  payoutDate?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'investor' | 'farmer';
}

export interface Farmer {
  id: string;
  name: string;
  farmName: string;
  location: string;
  bio: string;
  imageUrl?: string;
  established?: number;        // Year farm was established
  specialties?: string[];      // e.g., ["Dairy", "Beef", "Organic"]
  // Stats (calculated from assets)
  totalAssets?: number;
  totalSold?: number;
  successRate?: number;        // % of animals sold (not deceased)
  totalRaised?: number;
  // Trust score
  rating?: number;             // Average rating (1-5)
  reviewCount?: number;
}

export interface FarmerReview {
  id: string;
  farmerId: string;
  investorId: string;
  investorName: string;
  assetId: string;
  rating: number;              // 1-5 stars
  comment?: string;
  createdAt: string;
}

// Utility functions for calculations
export const calculateTotalShares = (asset: Asset): number => {
  return asset.fundingGoal / asset.sharePrice;
};

export const calculateSharesSold = (asset: Asset): number => {
  return asset.amountRaised / asset.sharePrice;
};

export const calculateSharesRemaining = (asset: Asset): number => {
  return calculateTotalShares(asset) - calculateSharesSold(asset);
};

export const calculateInvestorOwnership = (asset: Asset): number => {
  return asset.fundingGoal / asset.purchasePrice;
};

export const calculateFarmerOwnership = (asset: Asset): number => {
  return 1 - calculateInvestorOwnership(asset);
};

export const calculateFundingProgress = (asset: Asset): number => {
  return (asset.amountRaised / asset.fundingGoal) * 100;
};

export const calculateInvestorPayout = (
  shares: number,
  asset: Asset
): number => {
  if (!asset.salePrice) return 0;
  const totalShares = calculateTotalShares(asset);
  const investorOwnership = calculateInvestorOwnership(asset);
  return (shares / totalShares) * asset.salePrice * investorOwnership;
};