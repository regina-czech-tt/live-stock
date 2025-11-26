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
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  breed: z.string().min(2, "Please select a breed"),
  age: z.string().min(1, "Age is required"),
  weight: z.string().min(1, "Weight is required"),
  currentValue: z.string().min(1, "Current value is required"),
  sharesAvailable: z.string().min(1, "Number of shares is required"),
  pricePerShare: z.string().min(1, "Price per share is required"),
  expectedReturn: z.string().min(1, "Expected return is required"),
  healthStatus: z.string().min(1, "Please select health status"),
  imageUrl: z.string().url("Please enter a valid image URL").optional().or(z.literal("")),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function AddCowForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      breed: "",
      age: "",
      weight: "",
      currentValue: "",
      sharesAvailable: "",
      pricePerShare: "",
      expectedReturn: "",
      healthStatus: "",
      imageUrl: "",
      description: "",
    },
  });

  function onSubmit(values: FormValues) {
    console.log("Form submitted:", values);
    toast.success("Cow investment added successfully!");
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
                <FormLabel>Cow Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Bessie" {...field} />
                </FormControl>
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
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 2 years" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight (lbs)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 1200" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currentValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Value ($)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 12500" {...field} />
                </FormControl>
                <FormDescription>Total estimated market value</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sharesAvailable"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Shares Available</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 100" {...field} />
                </FormControl>
                <FormDescription>Number of shares to offer</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pricePerShare"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price Per Share ($)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 125" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expectedReturn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expected Return (%)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 15" {...field} />
                </FormControl>
                <FormDescription>Projected ROI percentage</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="healthStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Health Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select health status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Excellent">Excellent</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Fair">Fair</SelectItem>
                  </SelectContent>
                </Select>
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

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional information about the cow..."
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
          <Button type="submit">Add Investment</Button>
        </div>
      </form>
    </Form>
  );
}
