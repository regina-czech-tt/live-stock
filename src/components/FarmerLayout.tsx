import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  PlusCircle,
  List,
  LogOut,
  ChevronLeft
} from "lucide-react";

/**
 * FarmerLayout Component
 *
 * WHAT THIS DOES:
 * - Provides a sidebar layout for farmer-specific pages
 * - Contains navigation for farmer actions (dashboard, add asset, etc.)
 * - Separate from the investor-facing top nav
 *
 * NAVIGATION STRUCTURE:
 * - Dashboard: Overview of all farmer's assets
 * - Add Asset: Form to list a new cow/animal
 * - My Assets: Manage existing listings
 */

interface FarmerLayoutProps {
  children: React.ReactNode;
}

const sidebarLinks = [
  { to: "/farmer", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/farmer/add", icon: PlusCircle, label: "Add Asset" },
  { to: "/farmer/assets", icon: List, label: "My Assets" },
];

export function FarmerLayout({ children }: FarmerLayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card flex flex-col">
        {/* Logo/Header */}
        <div className="p-4 border-b">
          <Link to="/farmer" className="flex items-center gap-2">
            <div className="text-2xl">🐄</div>
            <div>
              <h1 className="font-bold text-foreground">LiveStock</h1>
              <p className="text-xs text-muted-foreground">Farmer Portal</p>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = link.end
              ? location.pathname === link.to
              : location.pathname.startsWith(link.to);

            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t space-y-2">
          <Link to="/marketplace" className="block">
            <Button variant="outline" className="w-full justify-start gap-2" size="sm">
              <ChevronLeft className="w-4 h-4" />
              Back to Marketplace
            </Button>
          </Link>
          <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground" size="sm">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-14 border-b bg-card/50 backdrop-blur-sm flex items-center px-6">
          <h2 className="font-semibold text-foreground">
            {sidebarLinks.find(l =>
              l.end ? location.pathname === l.to : location.pathname.startsWith(l.to)
            )?.label || "Farmer Portal"}
          </h2>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
