import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, X } from "lucide-react";

interface JerseyFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  editingJersey?: any;
}

const JerseyForm = ({ onSuccess, onCancel, editingJersey }: JerseyFormProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(editingJersey?.image_url || "");
  const [formData, setFormData] = useState({
    name: editingJersey?.name || "",
    team: editingJersey?.team || "",
    league: editingJersey?.league || "",
    season: editingJersey?.season || "",
    price: editingJersey?.price || "",
    description: editingJersey?.description || "",
    sizes: editingJersey?.sizes?.join(", ") || "S, M, L, XL, XXL",
    availableSizes: editingJersey?.available_sizes?.join(", ") || "S, M, L, XL, XXL",
    stockQuantity: editingJersey?.stock_quantity || "0",
    isAvailable: editingJersey?.is_available ?? true,
    isFeatured: editingJersey?.is_featured ?? false
  });
  const { toast } = useToast();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Image must be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return imagePreview || null;

    setUploading(true);
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('jersey-images')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('jersey-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const imageUrl = await uploadImage();

      const sizesArray = formData.sizes.split(',').map(s => s.trim()).filter(Boolean);
      const availableSizesArray = formData.availableSizes.split(',').map(s => s.trim()).filter(Boolean);

      const jerseyData = {
        name: formData.name,
        team: formData.team,
        league: formData.league,
        season: formData.season,
        price: parseFloat(formData.price),
        description: formData.description || null,
        image_url: imageUrl,
        sizes: sizesArray,
        available_sizes: availableSizesArray,
        stock_quantity: parseInt(formData.stockQuantity),
        is_available: formData.isAvailable,
        is_featured: formData.isFeatured
      };

      let error;
      if (editingJersey) {
        ({ error } = await supabase
          .from('jerseys')
          .update(jerseyData)
          .eq('id', editingJersey.id));
      } else {
        ({ error } = await supabase
          .from('jerseys')
          .insert(jerseyData));
      }

      if (error) throw error;

      toast({
        title: "Success",
        description: `Jersey ${editingJersey ? 'updated' : 'added'} successfully`,
      });

      onSuccess();
    } catch (error) {
      console.error('Error saving jersey:', error);
      toast({
        title: "Error",
        description: "Failed to save jersey. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="image">Jersey Image</Label>
          <div className="flex items-center gap-4">
            {imagePreview && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview("");
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
            <Label
              htmlFor="image-upload"
              className="cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent"
            >
              <Upload className="h-4 w-4" />
              Select Image
            </Label>
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Jersey Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="team">Team *</Label>
            <Input
              id="team"
              name="team"
              value={formData.team}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="league">League *</Label>
            <Input
              id="league"
              name="league"
              value={formData.league}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="season">Season *</Label>
            <Input
              id="season"
              name="season"
              value={formData.season}
              onChange={handleInputChange}
              placeholder="e.g., 2023/24"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price *</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sizes">All Sizes (comma separated)</Label>
            <Input
              id="sizes"
              name="sizes"
              value={formData.sizes}
              onChange={handleInputChange}
              placeholder="S, M, L, XL, XXL"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="availableSizes">Available Sizes (comma separated)</Label>
            <Input
              id="availableSizes"
              name="availableSizes"
              value={formData.availableSizes}
              onChange={handleInputChange}
              placeholder="S, M, L, XL, XXL"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="stockQuantity">Stock Quantity</Label>
          <Input
            id="stockQuantity"
            name="stockQuantity"
            type="number"
            value={formData.stockQuantity}
            onChange={handleInputChange}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              id="isAvailable"
              checked={formData.isAvailable}
              onCheckedChange={(checked) => handleSwitchChange('isAvailable', checked)}
            />
            <Label htmlFor="isAvailable">Available for Sale</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isFeatured"
              checked={formData.isFeatured}
              onCheckedChange={(checked) => handleSwitchChange('isFeatured', checked)}
            />
            <Label htmlFor="isFeatured">Featured</Label>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={submitting || uploading} className="flex-1">
          {(submitting || uploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {editingJersey ? 'Update Jersey' : 'Add Jersey'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default JerseyForm;
