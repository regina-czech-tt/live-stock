import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { NavLink } from "@/components/NavLink";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b-4 border-primary/20 bg-card shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="text-4xl">🐄</div>
              <div>
                <h1 className="text-3xl font-bold text-primary tracking-tight">CowShare</h1>
                <p className="text-xs text-muted-foreground italic">Supporting Local Farms</p>
              </div>
            </Link>
            <nav className="flex items-center gap-6">
              <NavLink 
                to="/marketplace" 
                className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
                activeClassName="text-primary"
              >
                Marketplace
              </NavLink>
              <NavLink 
                to="/how-it-works" 
                className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
                activeClassName="text-primary"
              >
                How It Works
              </NavLink>
              <Button variant="outline" size="sm" className="border-2 font-semibold">
                My Portfolio
              </Button>
              <Button size="sm" className="font-semibold shadow-md">Join Now</Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-primary/20 py-12 px-4 bg-card">
        <div className="container mx-auto text-center">
          <div className="text-3xl mb-3">🌾</div>
          <p className="text-foreground font-semibold mb-2">© 2024 CowShare</p>
          <p className="text-sm text-muted-foreground italic">Strengthening local farms, one share at a time</p>
        </div>
      </footer>
    </div>
  );
};
