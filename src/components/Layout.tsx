import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { NavLink } from "@/components/NavLink";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="text-3xl">🐄</div>
              <h1 className="text-2xl font-bold text-foreground">CowShare</h1>
            </Link>
            <nav className="flex items-center gap-6">
              <NavLink 
                to="/marketplace" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                activeClassName="text-foreground"
              >
                Marketplace
              </NavLink>
              <NavLink 
                to="/how-it-works" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                activeClassName="text-foreground"
              >
                How It Works
              </NavLink>
              <NavLink 
                to="/add-cow" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                activeClassName="text-foreground"
              >
                Add Investment
              </NavLink>
              <Button variant="outline" size="sm">
                Portfolio
              </Button>
              <Button size="sm">Connect Wallet</Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>© 2024 CowShare. Connecting investors with agricultural opportunities.</p>
        </div>
      </footer>
    </div>
  );
};
