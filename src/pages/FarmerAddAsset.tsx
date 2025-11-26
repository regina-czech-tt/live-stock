import { FarmerLayout } from "@/components/FarmerLayout";
import { AddAssetForm } from "@/components/AddAssetForm";

/**
 * FarmerAddAsset Page
 *
 * WHAT THIS DOES:
 * - Provides farmers with the form to list a new asset
 * - Uses the FarmerLayout for consistent sidebar navigation
 * - Wraps the existing AddAssetForm component
 */

const FarmerAddAsset = () => {
  return (
    <FarmerLayout>
      <section className="p-6">
        <div className="max-w-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Add New Asset</h1>
            <p className="text-muted-foreground">
              List a new animal for investment
            </p>
          </div>

          <AddAssetForm />
        </div>
      </section>
    </FarmerLayout>
  );
};

export default FarmerAddAsset;
