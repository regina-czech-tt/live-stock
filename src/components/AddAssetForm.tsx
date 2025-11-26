import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

/**
 * AddAssetForm Component
 *
 * WHAT THIS DOES:
 * - Form for farmers to list a new asset for investment
 * - Validates input using Zod schema
 * - Shows live preview of shares/ownership as farmer types
 * - On submit, calls addAsset() from context to save
 *
 * KEY REACT CONCEPTS:
 * - useForm: React Hook Form manages form state and validation
 * - watch(): Lets us observe field values in real-time (for the summary)
 * - zodResolver: Connects Zod validation to React Hook Form
 */

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  type: z.string().min(1, "Please select a type"),
  breed: z.string().min(1, "Please select a breed"),
  purchasePrice: z.string().min(1, "Purchase price is required"),
  fundingGoal: z.string().min(1, "Funding goal is required"),
  sharePrice: z.string().min(1, "Share price is required"),
  imageUrl: z.string().url("Please enter a valid image URL").optional().or(z.literal("")),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function AddAssetForm() {
  // Get addAsset function from context
  const { addAsset } = useApp();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "Cow",
      breed: "",
      purchasePrice: "",
      fundingGoal: "",
      sharePrice: "10",
      imageUrl: "",
      description: "",
    },
  });

  const purchasePrice = Number(form.watch("purchasePrice")) || 0;
  const fundingGoal = Number(form.watch("fundingGoal")) || 0;
  const sharePrice = Number(form.watch("sharePrice")) || 10;

  const totalShares = sharePrice > 0 ? Math.floor(fundingGoal / sharePrice) : 0;
  const investorOwnership = purchasePrice > 0 ? ((fundingGoal / purchasePrice) * 100).toFixed(0) : 0;
  const farmerOwnership = purchasePrice > 0 ? (100 - (fundingGoal / purchasePrice) * 100).toFixed(0) : 100;

  function onSubmit(values: FormValues) {
    /**
     * Create the asset object from form values.
     * Note: We convert string values to numbers where needed.
     */
    const asset = {
      id: crypto.randomUUID(),
      name: values.name,
      type: values.type,
      breed: values.breed,
      purchasePrice: Number(values.purchasePrice),
      fundingGoal: Number(values.fundingGoal),
      amountRaised: 0,  // Starts at 0 - no shares sold yet
      sharePrice: Number(values.sharePrice),
      status: 'funding' as const,  // New assets start in "funding" status
      imageUrl: values.imageUrl || 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=600&q=80',
      description: values.description,
      farmerId: 'current-user', // TODO: Get from auth
      farmerName: 'Current User', // TODO: Get from auth
    };

    /**
     * Call addAsset from context - this:
     * 1. Adds asset to state.assets array
     * 2. Saves to localStorage
     * 3. Triggers re-render so new asset shows in Marketplace
     */
    addAsset(asset);

    toast.success("Asset listed successfully!");
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Bessie" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Cow">Cow</SelectItem>
                    <SelectItem value="Pig">Pig</SelectItem>
                    <SelectItem value="Goat">Goat</SelectItem>
                    <SelectItem value="Sheep">Sheep</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="breed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Breed</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a breed" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Holstein">Holstein</SelectItem>
                    <SelectItem value="Angus">Angus</SelectItem>
                    <SelectItem value="Jersey">Jersey</SelectItem>
                    <SelectItem value="Hereford">Hereford</SelectItem>
                    <SelectItem value="Simmental">Simmental</SelectItem>
                    <SelectItem value="Charolais">Charolais</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="purchasePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purchase Price (£)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 500" {...field} />
                </FormControl>
                <FormDescription>What you paid for this animal</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fundingGoal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Funding Goal (£)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 250" {...field} />
                </FormControl>
                <FormDescription>How much you want to raise from investors</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sharePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Share Price (£)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 10" {...field} />
                </FormControl>
                <FormDescription>Price per share</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/cow.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Summary Box */}
        {purchasePrice > 0 && fundingGoal > 0 && (
          <div className="bg-muted rounded-lg p-4 space-y-2">
            <h4 className="font-semibold">Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total Shares:</span>
                <span className="ml-2 font-medium">{totalShares}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Investor Ownership:</span>
                <span className="ml-2 font-medium">{investorOwnership}%</span>
              </div>
              <div>
                <span className="text-muted-foreground">Your Ownership:</span>
                <span className="ml-2 font-medium">{farmerOwnership}%</span>
              </div>
              <div>
                <span className="text-muted-foreground">You Receive:</span>
                <span className="ml-2 font-medium">£{fundingGoal} (upfront)</span>
              </div>
            </div>
          </div>
        )}

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional information about the animal..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>Max 500 characters</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Cancel
          </Button>
          <Button type="submit">List Asset</Button>
        </div>
      </form>
    </Form>
  );
}
