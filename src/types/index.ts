export type AssetStatus = 'funding' | 'raising' | 'sold' | 'deceased';

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