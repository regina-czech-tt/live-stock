# LiveStock - Livestock Investment Platform

## Business Model

### How It Works

LiveStock lets farmers sell fractional ownership of their livestock to investors. Farmers get immediate cash and reduced risk. Investors get exposure to agricultural returns.

### The Flow

```
1. FARMER LISTS ANIMAL
   ├── Farmer already owns the animal (paid £500)
   ├── Farmer decides how much to raise (e.g., £250 = 50% of animal)
   └── Shares created at fixed price (e.g., £10/share = 25 shares)

2. INVESTORS BUY SHARES
   ├── Investors purchase shares
   ├── Platform takes fee (e.g., 5% of purchase)
   └── Farmer receives remaining funds immediately

3. FARMER RAISES ANIMAL
   └── Farmer keeps and raises the animal as normal

4. ANIMAL SELLS
   ├── Sale proceeds split by ownership percentage
   ├── Investors get their % of sale price
   └── Farmer gets their retained % of sale price
```

### Example Scenario

**Setup:**
- Farmer buys cow for **£500**
- Lists **£250** worth of shares (50% of the cow)
- Platform fee: **5%**

**When shares sell:**
- Investors buy £250 of shares
- Platform takes 5% → £12.50
- Farmer receives → £237.50 upfront
- Farmer retains 50% ownership

**Outcome A - Cow sells for £1000:**
| Party | Calculation | Amount |
|-------|-------------|--------|
| Investors (50%) | £1000 × 50% | £500 |
| Farmer (50%) | £1000 × 50% | £500 |
| **Farmer total** | £237.50 + £500 | **£737.50** |
| **Investor profit** | £500 - £250 | **£250 (100% return)** |

**Outcome B - Cow sells for £300 (bad sale):**
| Party | Calculation | Amount |
|-------|-------------|--------|
| Investors (50%) | £300 × 50% | £150 |
| Farmer (50%) | £300 × 50% | £150 |
| **Farmer total** | £237.50 + £150 | **£387.50** (lost £112.50) |
| **Investor loss** | £150 - £250 | **-£100 (40% loss)** |

**Outcome C - Cow dies:**
| Party | Calculation | Amount |
|-------|-------------|--------|
| Investors | £0 × 50% | £0 (lost £250) |
| Farmer | £0 × 50% + £237.50 upfront | £237.50 (lost £262.50) |

### Why It Works

**For Farmers:**
- Get immediate cash (capital not locked in livestock)
- Reduced risk (share downside with investors)
- Keep upside on retained portion

**For Investors:**
- Access to agricultural investments
- Don't need to buy/raise whole animal
- Fractional ownership = diversification possible

**For Platform:**
- Fee on transactions (predictable revenue)
- Not exposed to animal outcome risk

### Data Model

```typescript
interface Animal {
  id: string;
  name: string;
  type: string;             // "Cow", "Pig", "Goat", etc.
  breed: string;
  imageUrl: string;

  purchasePrice: number;    // What farmer paid
  fundingGoal: number;      // How much farmer wants to raise
  amountRaised: number;     // Current progress
  sharePrice: number;       // Price per share (e.g., £10)

  status: 'funding' | 'raising' | 'sold' | 'deceased';
  salePrice?: number;       // Final sale price (when sold)

  farmerId: string;
}

interface Investment {
  id: string;
  oderId: string;
  animalId: string;
  shares: number;
  amountPaid: number;       // What investor paid
  payout?: number;          // What they received (after sale)
}
```

**Derived calculations:**
```typescript
// Ownership percentages
investorOwnership = fundingGoal / purchasePrice
farmerOwnership = 1 - investorOwnership

// Share math
totalShares = fundingGoal / sharePrice
sharesSold = amountRaised / sharePrice
sharesRemaining = totalShares - sharesSold

// Investor payout (when sold)
investorPayout = (myShares / totalShares) * salePrice * investorOwnership
```

---

## Project Info

**URL**: https://lovable.dev/projects/b86b85ff-1cc3-4651-99ab-0fb74612d696

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/b86b85ff-1cc3-4651-99ab-0fb74612d696) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/b86b85ff-1cc3-4651-99ab-0fb74612d696) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
