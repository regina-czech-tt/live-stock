import { useState, useRef, useCallback } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload, X } from "lucide-react";

/**
 * ImageUploader Component
 *
 * WHAT THIS DOES:
 * - Lets user pick an image file from their computer
 * - Opens a cropper modal to adjust the image
 * - Returns the cropped image as a base64 data URL
 *
 * HOW IT WORKS:
 * 1. User clicks to select a file (or drags and drops)
 * 2. FileReader converts the file to a data URL for preview
 * 3. react-image-crop lets user select a region
 * 4. Canvas API crops the image and exports as base64
 * 5. Parent component receives the final image URL
 *
 * WHY BASE64?
 * - No server needed to store images
 * - Images are saved directly in localStorage with the asset
 * - Works completely offline
 * - Downside: larger storage size, but fine for a demo app
 */

interface ImageUploaderProps {
  currentImage?: string;
  onImageChange: (imageUrl: string) => void;
}

export function ImageUploader({ currentImage, onImageChange }: ImageUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 100,
    height: 100,
    x: 0,
    y: 0,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handle file selection
   * FileReader.readAsDataURL converts the file to a base64 string
   * that can be used as an image src
   */
  /**
   * Process a file (used by both click and drag-drop)
   */
  const processFile = (file: File) => {
    // Check file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedFile(reader.result as string);
      setCropModalOpen(true);
      // Reset crop to default
      setCrop({
        unit: "%",
        width: 100,
        height: 100,
        x: 0,
        y: 0,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  /**
   * Drag and drop handlers
   */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  /**
   * Generate cropped image using Canvas API
   * This takes the selected region and creates a new image from it
   */
  const getCroppedImage = useCallback((): string | null => {
    if (!imageRef.current || !completedCrop) return null;

    const image = imageRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Calculate the scale between natural size and displayed size
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Set canvas size to the cropped area
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;

    // Draw the cropped portion of the image
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    // Convert to base64 (JPEG at 80% quality for smaller size)
    return canvas.toDataURL("image/jpeg", 0.8);
  }, [completedCrop]);

  /**
   * Apply the crop and close modal
   */
  const handleApplyCrop = () => {
    const croppedImageUrl = getCroppedImage();
    if (croppedImageUrl) {
      onImageChange(croppedImageUrl);
    } else if (selectedFile) {
      // If no crop was made, use the original image
      onImageChange(selectedFile);
    }
    setCropModalOpen(false);
    setSelectedFile(null);
    // Reset file input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /**
   * Cancel cropping
   */
  const handleCancelCrop = () => {
    setCropModalOpen(false);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /**
   * Remove current image
   */
  const handleRemoveImage = () => {
    onImageChange("");
  };

  return (
    <div className="space-y-2">
      {/* Current Image Preview */}
      {currentImage && (
        <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
          <img
            src={currentImage}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:bg-destructive/90"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Upload Button / Drop Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50"
        }`}
      >
        <Upload className={`w-8 h-8 mx-auto mb-2 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
        <p className={`text-sm ${isDragging ? "text-primary" : "text-muted-foreground"}`}>
          {isDragging ? "Drop image here" : "Click to upload or drag and drop"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          PNG, JPG up to 5MB
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Crop Modal */}
      <Dialog open={cropModalOpen} onOpenChange={setCropModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            {selectedFile && (
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={4 / 3}
              >
                <img
                  ref={imageRef}
                  src={selectedFile}
                  alt="Crop preview"
                  className="max-h-96 w-auto mx-auto"
                />
              </ReactCrop>
            )}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={handleCancelCrop}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleApplyCrop}>
              Apply Crop
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
