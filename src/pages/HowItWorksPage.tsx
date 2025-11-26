import { HowItWorks } from "@/components/HowItWorks";
import { Layout } from "@/components/Layout";

const HowItWorksPage = () => {
  return (
    <Layout>
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <HowItWorks />
        </div>
      </section>
    </Layout>
  );
};

export default HowItWorksPage;
