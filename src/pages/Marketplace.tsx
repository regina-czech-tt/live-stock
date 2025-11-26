import { useState } from "react";
import { AssetCard } from "@/components/AssetCard";
import { InvestModal } from "@/components/InvestModal";
import { Layout } from "@/components/Layout";
import { useApp } from "@/context/AppContext";
import { Asset, AssetStatus } from "@/types";

/**
 * Marketplace Page
 *
 * WHAT'S HAPPENING HERE:
 * 1. useApp() hook gives us access to the global state (assets from context)
 * 2. We filter assets based on the selected filter tab
 * 3. When user clicks "Invest Now", we open the modal with that asset
 * 4. The modal will call buyShares() from context to actually purchase
 */

type FilterOption = 'all' | AssetStatus;

const filters: { value: FilterOption; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'funding', label: 'Funding' },
  { value: 'raising', label: 'Raising' },
  { value: 'sold', label: 'Sold' },
  { value: 'deceased', label: 'Deceased' },
];

const Marketplace = () => {
  /**
   * STATE VARIABLES:
   * - activeFilter: which tab is selected (all, funding, raising, etc.)
   * - selectedAsset: which asset the user clicked to invest in
   * - investModalOpen: whether the invest modal is showing
   *
   * useApp() gives us:
   * - state.assets: all assets from our global context
   */
  const { state } = useApp();
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [investModalOpen, setInvestModalOpen] = useState(false);

  // Filter assets based on selected tab
  // state.assets comes from context (instead of mockAssets directly)
  const filteredAssets = activeFilter === 'all'
    ? state.assets
    : state.assets.filter((asset) => asset.status === activeFilter);

  const handleInvest = (asset: Asset) => {
    setSelectedAsset(asset);
    setInvestModalOpen(true);
  };

  const handleCloseModal = () => {
    setInvestModalOpen(false);
    setSelectedAsset(null);
  };

  return (
    <Layout>
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="mb-8">
            <h3 className="text-3xl font-bold mb-2 text-foreground">Available Investments</h3>
            <p className="text-muted-foreground">Browse farm assets open for investment</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  activeFilter === filter.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssets.map((asset) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                onInvest={handleInvest}
              />
            ))}
          </div>

          {filteredAssets.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No investments found.</p>
            </div>
          )}
        </div>
      </section>

      <InvestModal
        asset={selectedAsset}
        open={investModalOpen}
        onClose={handleCloseModal}
      />
    </Layout>
  );
};

export default Marketplace;
