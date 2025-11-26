import { Layout } from "@/components/Layout";
import { AddAssetForm } from "@/components/AddAssetForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AddCow = () => {
  return (
    <Layout>
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">List Your Asset</CardTitle>
              <CardDescription>
                List your livestock for fractional investment. Set your funding goal and let investors buy shares.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AddAssetForm />
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default AddCow;
