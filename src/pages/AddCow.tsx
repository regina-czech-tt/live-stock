import { Layout } from "@/components/Layout";
import { AddCowForm } from "@/components/AddCowForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AddCow = () => {
  return (
    <Layout>
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Add New Investment</CardTitle>
              <CardDescription>
                List your livestock for fractional investment. Fill out the details below to create a new investment opportunity.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AddCowForm />
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default AddCow;
