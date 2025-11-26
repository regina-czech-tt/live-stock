import { Button } from "@/components/ui/button";
import { CowCard } from "@/components/CowCard";
import { Layout } from "@/components/Layout";

const Marketplace = () => {
  // Mock data for available cows
  const availableCows = [
    {
      id: "1",
      name: "Bessie",
      breed: "Holstein",
      age: "2 years",
      currentValue: 12500,
      sharesAvailable: 65,
      expectedReturn: 15,
      healthStatus: "Excellent",
      imageUrl: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=600&q=80",
    },
    {
      id: "2",
      name: "Daisy",
      breed: "Angus",
      age: "1.5 years",
      currentValue: 9800,
      sharesAvailable: 42,
      expectedReturn: 22,
      healthStatus: "Good",
      imageUrl: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600&q=80",
    },
    {
      id: "3",
      name: "Buttercup",
      breed: "Jersey",
      age: "3 years",
      currentValue: 15200,
      sharesAvailable: 28,
      expectedReturn: 12,
      healthStatus: "Excellent",
      imageUrl: "https://images.unsplash.com/photo-1464820453369-31d2c0b651af?w=600&q=80",
    },
  ];

  return (
    <Layout>
      <section className="py-20 px-4 farm-texture">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">🐄</span>
                <h3 className="text-4xl font-bold text-foreground">Available Cattle</h3>
              </div>
              <p className="text-lg text-foreground/70">Browse local livestock ready for fractional investment</p>
            </div>
            <Button variant="outline" className="border-2 font-semibold">Filter & Sort</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableCows.map((cow) => (
              <CowCard key={cow.id} cow={cow} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Marketplace;
