import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/context/AppContext";
import {
  calculateTotalShares,
  calculateInvestorOwnership,
  calculateInvestorPayout,
} from "@/types";

/**
 * Portfolio Page
 *
 * WHAT THIS DOES:
 * - Shows all investments for the current user
 * - Groups them by status (active, completed, lost)
 * - Shows profit/loss for completed investments
 *
 * HOW IT WORKS:
 * 1. Get investments and assets from context
 * 2. Filter investments to only show current user's
 * 3. For each investment, find the matching asset to show details
 * 4. Calculate totals for the summary cards at the top
 */

const Portfolio = () => {
  const { state } = useApp();

  /**
   * Get current user's investments.
   * We filter by userId matching the hardcoded 'user-1'.
   * Later this would come from real authentication.
   */
  const myInvestments = state.investments.filter(
    (inv) => inv.userId === state.currentUserId
  );

  /**
   * For each investment, we need to look up the asset details.
   * We create enriched objects that have both investment AND asset data.
   */
  const enrichedInvestments = myInvestments.map((inv) => {
    const asset = state.assets.find((a) => a.id === inv.assetId);
    return { investment: inv, asset };
  }).filter((item) => item.asset !== undefined);

  /**
   * Group investments by asset status.
   * - Active: open or funded (investment still in progress)
   * - Completed: sold (got payout)
   * - Lost: deceased (lost investment)
   */
  const activeInvestments = enrichedInvestments.filter(
    ({ asset }) => asset!.status === 'open' || asset!.status === 'funded'
  );
  const completedInvestments = enrichedInvestments.filter(
    ({ asset }) => asset!.status === 'sold'
  );
  const lostInvestments = enrichedInvestments.filter(
    ({ asset }) => asset!.status === 'deceased'
  );

  /**
   * Calculate summary statistics.
   * These show at the top of the page.
   */
  const totalInvested = myInvestments.reduce((sum, inv) => sum + inv.amountPaid, 0);

  const totalReturns = completedInvestments.reduce((sum, { investment }) => {
    return sum + (investment.payout || 0);
  }, 0);

  const totalLost = lostInvestments.reduce((sum, { investment }) => {
    return sum + investment.amountPaid;
  }, 0);

  const activeValue = activeInvestments.reduce((sum, { investment }) => {
    return sum + investment.amountPaid;
  }, 0);

  return (
    <Layout>
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Your Portfolio</h1>
            <p className="text-muted-foreground">
              Track your investments and returns
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Invested
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">£{totalInvested}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">£{activeValue}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Returns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  £{totalReturns.toFixed(2)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Lost
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  £{totalLost}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* No Investments Message */}
          {myInvestments.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">
                  You haven't made any investments yet.
                </p>
                <a
                  href="/marketplace"
                  className="text-primary hover:underline"
                >
                  Browse the marketplace →
                </a>
              </CardContent>
            </Card>
          )}

          {/* Active Investments */}
          {activeInvestments.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Active Investments</h2>
              <div className="space-y-4">
                {activeInvestments.map(({ investment, asset }) => (
                  <InvestmentCard
                    key={investment.id}
                    investment={investment}
                    asset={asset!}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Completed Investments */}
          {completedInvestments.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Completed</h2>
              <div className="space-y-4">
                {completedInvestments.map(({ investment, asset }) => (
                  <InvestmentCard
                    key={investment.id}
                    investment={investment}
                    asset={asset!}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Lost Investments */}
          {lostInvestments.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Lost</h2>
              <div className="space-y-4">
                {lostInvestments.map(({ investment, asset }) => (
                  <InvestmentCard
                    key={investment.id}
                    investment={investment}
                    asset={asset!}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

/**
 * InvestmentCard Component
 *
 * Shows a single investment with:
 * - Asset image and name
 * - Number of shares owned
 * - Amount paid
 * - Current status
 * - Profit/loss (if completed)
 */
interface InvestmentCardProps {
  investment: {
    id: string;
    shares: number;
    amountPaid: number;
    payout?: number;
    purchaseDate: string;
  };
  asset: {
    id: string;
    name: string;
    type: string;
    breed: string;
    imageUrl: string;
    status: string;
    salePrice?: number;
    purchasePrice: number;
    fundingGoal: number;
    sharePrice: number;
  };
}

function InvestmentCard({ investment, asset }: InvestmentCardProps) {
  const totalShares = calculateTotalShares(asset);
  const ownershipPercent = ((investment.shares / totalShares) * calculateInvestorOwnership(asset) * 100).toFixed(2);

  // Calculate profit/loss for completed investments
  const profit = investment.payout !== undefined
    ? investment.payout - investment.amountPaid
    : null;

  const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    open: { label: 'Open', variant: 'default' },
    funded: { label: 'Funded', variant: 'secondary' },
    sold: { label: 'Sold', variant: 'outline' },
    deceased: { label: 'Deceased', variant: 'destructive' },
  };

  const status = statusConfig[asset.status] || { label: asset.status, variant: 'default' as const };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Asset Image */}
          <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={asset.imageUrl}
              alt={asset.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
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

            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Shares: </span>
                <span className="font-medium">{investment.shares}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Ownership: </span>
                <span className="font-medium">{ownershipPercent}%</span>
              </div>
              <div>
                <span className="text-muted-foreground">Invested: </span>
                <span className="font-medium">£{investment.amountPaid}</span>
              </div>

              {/* Show payout/profit for completed */}
              {investment.payout !== undefined && (
                <div>
                  <span className="text-muted-foreground">Return: </span>
                  <span className={`font-medium ${profit! >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    £{investment.payout.toFixed(2)}
                    {profit !== null && (
                      <span className="ml-1">
                        ({profit >= 0 ? '+' : ''}£{profit.toFixed(2)})
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default Portfolio;
