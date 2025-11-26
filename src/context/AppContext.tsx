import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Asset, Investment } from '@/types';
import { mockAssets } from '@/data/assets';

/**
 * ==========================================
 * APP CONTEXT - Global State Management
 * ==========================================
 *
 * This file creates a "global store" for our app using React Context.
 *
 * WHY WE NEED THIS:
 * - Without context, we'd have to pass data through every component (prop drilling)
 * - With context, any component can access/update the data directly
 *
 * HOW IT WORKS:
 * 1. We define the SHAPE of our data (AppState interface)
 * 2. We define ACTIONS that can change the data (Action type)
 * 3. We create a REDUCER that handles each action
 * 4. We wrap the app in a PROVIDER that holds the state
 * 5. Components use the useApp() hook to access/update data
 */

// ==========================================
// 1. DEFINE THE SHAPE OF OUR DATA
// ==========================================

interface AppState {
  assets: Asset[];           // All listed animals
  investments: Investment[]; // All share purchases
  currentUserId: string;     // Temporary - will be real auth later
  favorites: string[];       // Array of asset IDs that user has favorited
}

// ==========================================
// 2. DEFINE ACTIONS (things that can happen)
// ==========================================

/**
 * Actions are like "events" that describe what happened.
 * Each action has a TYPE (what happened) and PAYLOAD (the data).
 *
 * Think of it like sending a message:
 * "Hey reducer, someone BOUGHT_SHARES, here's the details..."
 */
type Action =
  | { type: 'ADD_ASSET'; payload: Asset }
  | { type: 'UPDATE_ASSET'; payload: { assetId: string; updates: Partial<Asset> } }
  | { type: 'BUY_SHARES'; payload: { assetId: string; shares: number; amount: number } }
  | { type: 'SELL_ASSET'; payload: { assetId: string; salePrice: number } }
  | { type: 'MARK_DECEASED'; payload: { assetId: string } }
  | { type: 'TOGGLE_FAVORITE'; payload: { assetId: string } }
  | { type: 'LOAD_STATE'; payload: AppState };

// ==========================================
// 3. CREATE THE REDUCER
// ==========================================

/**
 * The reducer is a function that takes the current state + an action,
 * and returns the NEW state. It's like a "state machine".
 *
 * IMPORTANT: We never modify state directly! We always return a NEW object.
 * This is called "immutability" and helps React know when to re-render.
 */
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {

    // When a farmer lists a new asset
    case 'ADD_ASSET':
      return {
        ...state,  // Keep everything else the same
        assets: [...state.assets, action.payload],  // Add new asset to array
      };

    // When a farmer updates their asset
    case 'UPDATE_ASSET': {
      const { assetId, updates } = action.payload;
      const updatedAssets = state.assets.map(asset =>
        asset.id === assetId
          ? { ...asset, ...updates }
          : asset
      );
      return {
        ...state,
        assets: updatedAssets,
      };
    }

    // When an investor buys shares
    case 'BUY_SHARES': {
      const { assetId, shares, amount } = action.payload;

      // Create the investment record
      const newInvestment: Investment = {
        id: crypto.randomUUID(),
        assetId,
        userId: state.currentUserId,
        shares,
        amountPaid: amount,
        purchaseDate: new Date().toISOString(),
      };

      // Update the asset's amountRaised
      const updatedAssets = state.assets.map(asset => {
        if (asset.id === assetId) {
          const newAmountRaised = asset.amountRaised + amount;
          const isFunded = newAmountRaised >= asset.fundingGoal;
          return {
            ...asset,
            amountRaised: newAmountRaised,
            status: isFunded ? 'funded' as const : asset.status,
          };
        }
        return asset;
      });

      return {
        ...state,
        assets: updatedAssets,
        investments: [...state.investments, newInvestment],
      };
    }

    // When a farmer sells the animal
    case 'SELL_ASSET': {
      const { assetId, salePrice } = action.payload;

      // Update asset status and sale price
      const updatedAssets = state.assets.map(asset =>
        asset.id === assetId
          ? { ...asset, status: 'sold' as const, salePrice }
          : asset
      );

      // Calculate payouts for all investors in this asset
      const asset = state.assets.find(a => a.id === assetId);
      if (!asset) return state;

      const totalShares = asset.fundingGoal / asset.sharePrice;
      const investorOwnership = asset.fundingGoal / asset.purchasePrice;

      const updatedInvestments = state.investments.map(inv => {
        if (inv.assetId === assetId) {
          const payout = (inv.shares / totalShares) * salePrice * investorOwnership;
          return {
            ...inv,
            payout,
            payoutDate: new Date().toISOString(),
          };
        }
        return inv;
      });

      return {
        ...state,
        assets: updatedAssets,
        investments: updatedInvestments,
      };
    }

    // When an animal dies
    case 'MARK_DECEASED': {
      const { assetId } = action.payload;

      const updatedAssets = state.assets.map(asset =>
        asset.id === assetId
          ? { ...asset, status: 'deceased' as const }
          : asset
      );

      // Set payout to 0 for all investments
      const updatedInvestments = state.investments.map(inv =>
        inv.assetId === assetId
          ? { ...inv, payout: 0, payoutDate: new Date().toISOString() }
          : inv
      );

      return {
        ...state,
        assets: updatedAssets,
        investments: updatedInvestments,
      };
    }

    // Toggle favorite status for an asset
    case 'TOGGLE_FAVORITE': {
      const { assetId } = action.payload;
      const isFavorited = state.favorites.includes(assetId);

      return {
        ...state,
        favorites: isFavorited
          ? state.favorites.filter(id => id !== assetId)  // Remove from favorites
          : [...state.favorites, assetId],                // Add to favorites
      };
    }

    // Load saved state from localStorage
    case 'LOAD_STATE':
      return action.payload;

    default:
      return state;
  }
}

// ==========================================
// 4. CREATE THE CONTEXT
// ==========================================

/**
 * Context is like a "broadcast channel" for data.
 * We create it with createContext(), then provide it at the top of our app.
 */

interface AppContextType {
  state: AppState;
  // These are the functions components will call to update state
  addAsset: (asset: Asset) => void;
  updateAsset: (assetId: string, updates: Partial<Asset>) => void;
  buyShares: (assetId: string, shares: number, amount: number) => void;
  sellAsset: (assetId: string, salePrice: number) => void;
  markDeceased: (assetId: string) => void;
  toggleFavorite: (assetId: string) => void;
  isFavorite: (assetId: string) => boolean;
}

const AppContext = createContext<AppContextType | null>(null);

// ==========================================
// 5. CREATE THE PROVIDER COMPONENT
// ==========================================

/**
 * The Provider wraps our entire app and holds the state.
 * It passes the state and update functions down to all children.
 */

const STORAGE_KEY = 'cowshares_data';

// Initial state - loads mock data if nothing in localStorage
const initialState: AppState = {
  assets: mockAssets,
  investments: [],
  currentUserId: 'user-1', // Hardcoded for now
  favorites: [],           // No favorites initially
};

export function AppProvider({ children }: { children: ReactNode }) {
  /**
   * useReducer is like useState but for complex state.
   * Instead of setState(newValue), we dispatch({ type: 'ACTION' })
   */
  const [state, dispatch] = useReducer(appReducer, initialState);

  /**
   * useEffect runs AFTER the component renders.
   * This one runs once on mount (empty dependency array [])
   * and loads any saved data from localStorage.
   */
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'LOAD_STATE', payload: parsed });
      } catch (e) {
        console.error('Failed to load saved state:', e);
      }
    }
  }, []);

  /**
   * This effect runs whenever state changes.
   * It saves the current state to localStorage.
   */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Helper functions that dispatch actions
  // These make it easier for components to update state
  const addAsset = (asset: Asset) => {
    dispatch({ type: 'ADD_ASSET', payload: asset });
  };

  const updateAsset = (assetId: string, updates: Partial<Asset>) => {
    dispatch({ type: 'UPDATE_ASSET', payload: { assetId, updates } });
  };

  const buyShares = (assetId: string, shares: number, amount: number) => {
    dispatch({ type: 'BUY_SHARES', payload: { assetId, shares, amount } });
  };

  const sellAsset = (assetId: string, salePrice: number) => {
    dispatch({ type: 'SELL_ASSET', payload: { assetId, salePrice } });
  };

  const markDeceased = (assetId: string) => {
    dispatch({ type: 'MARK_DECEASED', payload: { assetId } });
  };

  const toggleFavorite = (assetId: string) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: { assetId } });
  };

  // Helper to check if an asset is favorited
  const isFavorite = (assetId: string) => {
    return state.favorites.includes(assetId);
  };

  return (
    <AppContext.Provider value={{ state, addAsset, updateAsset, buyShares, sellAsset, markDeceased, toggleFavorite, isFavorite }}>
      {children}
    </AppContext.Provider>
  );
}

// ==========================================
// 6. CREATE THE HOOK
// ==========================================

/**
 * Custom hook to use the context.
 * Components call useApp() to get access to state and actions.
 *
 * Example usage in a component:
 *   const { state, buyShares } = useApp();
 *   console.log(state.assets);
 *   buyShares('asset-1', 5, 50);
 */
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
