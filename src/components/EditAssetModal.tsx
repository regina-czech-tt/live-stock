import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ImageUploader } from "@/components/ImageUploader";
import { Asset } from "@/types";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

/**
 * EditAssetModal Component
 *
 * WHAT THIS DOES:
 * - Allows farmers to edit their asset details
 * - Can edit: name, breed, image, description
 * - Cannot edit: pricing/shares once investors have bought in
 *
 * WHY SOME FIELDS ARE LOCKED:
 * - If investors already bought shares, changing the fundingGoal
 *   or purchasePrice would mess up their ownership calculations
 * - We only allow cosmetic/info changes after funding starts
 */

interface EditAssetModalProps {
  asset: Asset | null;
  open: boolean;
  onClose: () => void;
}

export function EditAssetModal({ asset, open, onClose }: EditAssetModalProps) {
  const { updateAsset } = useApp();

  // Form state
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");

  // Reset form when asset changes
  useEffect(() => {
    if (asset) {
      setName(asset.name);
      setBreed(asset.breed);
      setImageUrl(asset.imageUrl);
      setDescription(asset.description || "");
    }
  }, [asset]);

  if (!asset) return null;

  const hasInvestors = asset.amountRaised > 0;

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    updateAsset(asset.id, {
      name: name.trim(),
      breed,
      imageUrl: imageUrl.trim() || asset.imageUrl,
      description: description.trim(),
    });

    toast.success("Asset updated successfully");
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit {asset.name}</DialogTitle>
          <DialogDescription>
            Update your asset details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Bessie"
            />
          </div>

          {/* Breed */}
          <div className="space-y-2">
            <Label htmlFor="breed">Breed</Label>
            <Select value={breed} onValueChange={setBreed}>
              <SelectTrigger>
                <SelectValue placeholder="Select a breed" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Holstein">Holstein</SelectItem>
                <SelectItem value="Angus">Angus</SelectItem>
                <SelectItem value="Jersey">Jersey</SelectItem>
                <SelectItem value="Hereford">Hereford</SelectItem>
                <SelectItem value="Simmental">Simmental</SelectItem>
                <SelectItem value="Charolais">Charolais</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Image</Label>
            <ImageUploader
              currentImage={imageUrl}
              onImageChange={setImageUrl}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Additional information about the animal..."
              className="resize-none"
            />
          </div>

          {/* Locked fields notice */}
          {hasInvestors && (
            <div className="bg-muted rounded-lg p-3 text-sm text-muted-foreground">
              <strong>Note:</strong> Pricing cannot be changed because investors
              have already purchased shares.
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={handleClose}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
