/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Loader2, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SizeSelector from "./SizeSelector";
import BulletPointsForm from "./BulletPointsForm";
import { addNewProduct, editProducts } from "@/store/admin/product-slice";
import { fetchAllOptions } from "@/store/common-slice";

const initialFormData = {
  productId: "",
  title: "",
  shortTitle: "",
  description: "",
  material: "",
  careInstructions: "",
  specification: "",
  price: "",
  salePrice: "",
  gst: "",
  hsn: "",
  gender: "",
  category: "",
  subCategory: "",
  specialCategory: "",
  size: [],
  bulletPoints: [],
  width: "",
  height: "",
  length: "",
  weight: "",
  breadth: "",
};

export default function AdminProductForm({
  initialData,
  isEditing = false,
  onClose,
  onSuccess,
}) {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [formData, setFormData] = useState(initialFormData);
  const [saving, setSaving] = useState(false);
  const [isViewMode, setIsViewMode] = useState(!!initialData);
  const { AllOptions } = useSelector((state) => state.common);

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [genders, setGenders] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialFormData, ...initialData });
      setIsViewMode(true);
    } else {
      setIsViewMode(false);
    }
  }, [initialData]);

  useEffect(() => {
    if (!AllOptions || AllOptions.length === 0) {
      dispatch(fetchAllOptions());
    }
  }, [dispatch, AllOptions]);

  useEffect(() => {
    if (AllOptions && AllOptions.length > 0) {
      const cats = AllOptions.filter((item) => item.type === "category");
      setCategories(cats);

      const subcats = AllOptions.filter((item) => item.type === "subcategory");
      setSubcategories(subcats);

      const gens = AllOptions.filter((item) => item.type === "gender");
      setGenders(gens);
    }
  }, [AllOptions]);

  // Sync formData with options to handle case mismatches
  useEffect(() => {
    if (categories.length > 0 && formData.category) {
      const match = categories.find(c => c.value.toLowerCase() === formData.category.toLowerCase());
      if (match && match.value !== formData.category) {
        setFormData(prev => ({ ...prev, category: match.value }));
      }
    }
  }, [categories, formData.category]);

  useEffect(() => {
    if (subcategories.length > 0 && formData.subCategory) {
      const match = subcategories.find(c => c.value.toLowerCase() === formData.subCategory.toLowerCase());
      if (match && match.value !== formData.subCategory) {
        setFormData(prev => ({ ...prev, subCategory: match.value }));
      }
    }
  }, [subcategories, formData.subCategory]);

  useEffect(() => {
    if (genders.length > 0 && formData.gender) {
      const match = genders.find(c => c.value.toLowerCase() === formData.gender.toLowerCase());
      if (match && match.value !== formData.gender) {
        setFormData(prev => ({ ...prev, gender: match.value }));
      }
    }
  }, [genders, formData.gender]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Enhanced Validation - check all required fields
    const validationErrors = [];
    if (!formData.productId) validationErrors.push("Product ID");
    if (!formData.title) validationErrors.push("Title");
    if (!formData.shortTitle) validationErrors.push("Short Title");
    if (!formData.description) validationErrors.push("Description");
    if (!formData.price) validationErrors.push("Price");
    if (!formData.material) validationErrors.push("Material");
    if (!formData.gender) validationErrors.push("Gender");
    if (!formData.category) validationErrors.push("Category");
    if (!formData.subCategory) validationErrors.push("Sub-Category");

    // Size & Color Validation
    if (!formData.size || formData.size.length === 0) {
      validationErrors.push("Sizes (at least one size is required)");
    } else {
      formData.size.forEach((size, index) => {
        if (!size.colors || size.colors.length === 0) {
          validationErrors.push(`Size ${size.label || index + 1} must have at least one color variant`);
        } else {
          size.colors.forEach((color, cIndex) => {
            if (!color.images || color.images.length === 0) {
              validationErrors.push(`Size ${size.label} - Color ${color.name || color.label} is missing images`);
            }
            if (!color.sku) {
              validationErrors.push(`Size ${size.label} - Color ${color.name || color.label} is missing SKU`);
            }
          });
        }
      });
    }

    if (!formData.bulletPoints || formData.bulletPoints.length === 0) validationErrors.push("Bullet Points");
    if (!formData.width) validationErrors.push("Width");
    if (!formData.height) validationErrors.push("Height");
    if (!formData.length) validationErrors.push("Length");
    if (!formData.weight) validationErrors.push("Weight");
    if (!formData.breadth) validationErrors.push("Breadth");

    if (validationErrors.length > 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: (
          <ul className="list-disc pl-4 mt-2 max-h-[200px] overflow-y-auto">
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        )
      });
      return;
    }

    setSaving(true);
    try {
      let result;
      if (isEditing) {
        result = await dispatch(editProducts({ id: formData._id, formData }));
      } else {
        result = await dispatch(addNewProduct(formData));
      }

      if (result?.payload?.Success) {
        toast({
          title: "Success",
          description: isEditing ? "Product updated successfully" : "Product created successfully",
          className: "bg-green-50 border-green-200 text-green-900"
        });
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result?.payload?.message || "Failed to save product"
        });
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {initialData ? (isViewMode ? "View Product" : "Edit Product") : "Add New Product"}
            </h1>
            <p className="text-sm text-gray-500">
              {initialData
                ? (isViewMode ? "View product details" : "Update product details")
                : "Create a new product listing"}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          {isViewMode && initialData && (
            <Button onClick={() => setIsViewMode(false)}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit Product
            </Button>
          )}
          {!isViewMode && (
            <>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {isEditing ? "Update Product" : "Create Product"}
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="productId">Product ID *</Label>
                    <Input
                      id="productId"
                      name="productId"
                      value={formData.productId}
                      onChange={handleChange}
                      placeholder="Enter Product ID"
                      required
                      disabled={isViewMode}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shortTitle">Short Title *</Label>
                    <Input
                      id="shortTitle"
                      name="shortTitle"
                      value={formData.shortTitle}
                      onChange={handleChange}
                      placeholder="Enter Short Title"
                      required
                      disabled={isViewMode}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Product Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter full product title"
                    required
                    disabled={isViewMode}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Detailed product description"
                    rows={4}
                    required
                    disabled={isViewMode}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="material">Material *</Label>
                    <Textarea
                      id="material"
                      name="material"
                      value={formData.material}
                      onChange={handleChange}
                      placeholder="Material details"
                      required
                      disabled={isViewMode}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="careInstructions">Care Instructions</Label>
                    <Textarea
                      id="careInstructions"
                      name="careInstructions"
                      value={formData.careInstructions}
                      onChange={handleChange}
                      placeholder="Care instructions"
                      disabled={isViewMode}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specification">Specification</Label>
                  <Textarea
                    id="specification"
                    name="specification"
                    value={formData.specification}
                    onChange={handleChange}
                    placeholder="Product specifications"
                    disabled={isViewMode}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Variants (Sizes & Colors) */}
            <Card>
              <CardHeader>
                <CardTitle>Variants (Sizes & Colors)</CardTitle>
              </CardHeader>
              <CardContent className={isViewMode ? "pointer-events-none opacity-60" : ""}>
                <SizeSelector
                  sizeType="clothingSize" // Assuming clothingSize is the default type
                  initialSizes={formData.size}
                  OnChange={(sizes) =>
                    setFormData((prev) => ({ ...prev, size: sizes }))
                  }
                />
              </CardContent>
            </Card>

            {/* Bullet Points */}
            <Card>
              <CardHeader>
                <CardTitle>Bullet Points</CardTitle>
              </CardHeader>
              <CardContent className={isViewMode ? "pointer-events-none opacity-60" : ""}>
                <BulletPointsForm
                  defaultPoinst={formData.bulletPoints}
                  onChange={(points) =>
                    setFormData((prev) => ({ ...prev, bulletPoints: points }))
                  }
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Settings & Pricing */}
          <div className="space-y-6">
            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Regular Price (₹) *</Label>
                  <Input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                    disabled={isViewMode}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salePrice">Sale Price (₹)</Label>
                  <Input
                    type="number"
                    id="salePrice"
                    name="salePrice"
                    value={formData.salePrice}
                    onChange={handleChange}
                    placeholder="0.00"
                    disabled={isViewMode}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gst">GST (%)</Label>
                  <Input
                    type="number"
                    id="gst"
                    name="gst"
                    value={formData.gst}
                    onChange={handleChange}
                    placeholder="18"
                    disabled={isViewMode}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hsn">HSN Code</Label>
                  <Input
                    id="hsn"
                    name="hsn"
                    value={formData.hsn}
                    onChange={handleChange}
                    placeholder="HSN Code"
                    disabled={isViewMode}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Categorization */}
            <Card>
              <CardHeader>
                <CardTitle>Categorization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(val) => handleSelectChange("category", val)}
                    disabled={isViewMode}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat._id} value={cat.value}>
                          {cat.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Sub-Category *</Label>
                  <Select
                    value={formData.subCategory}
                    onValueChange={(val) =>
                      handleSelectChange("subCategory", val)
                    }
                    disabled={isViewMode}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Sub-Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {subcategories.map((cat) => (
                        <SelectItem key={cat._id} value={cat.value}>
                          {cat.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Gender *</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(val) => handleSelectChange("gender", val)}
                    disabled={isViewMode}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {genders.map((cat) => (
                        <SelectItem key={cat._id} value={cat.value}>
                          {cat.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Special Category</Label>
                  <Select
                    value={formData.specialCategory}
                    onValueChange={(val) =>
                      handleSelectChange("specialCategory", val)
                    }
                    disabled={isViewMode}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="None" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="topPicks">Top Picks</SelectItem>
                      <SelectItem value="bestSeller">Best Seller</SelectItem>
                      <SelectItem value="luxuryItems">Luxury Items</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Dimensions */}
            <Card>
              <CardHeader>
                <CardTitle>Dimensions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="width">Width *</Label>
                    <Input
                      type="number"
                      id="width"
                      name="width"
                      value={formData.width}
                      onChange={handleChange}
                      placeholder="Width"
                      required
                      disabled={isViewMode}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height *</Label>
                    <Input
                      type="number"
                      id="height"
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                      placeholder="Height"
                      required
                      disabled={isViewMode}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="length">Length *</Label>
                    <Input
                      type="number"
                      id="length"
                      name="length"
                      value={formData.length}
                      onChange={handleChange}
                      placeholder="Length"
                      required
                      disabled={isViewMode}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight *</Label>
                    <Input
                      type="number"
                      id="weight"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      placeholder="Weight"
                      required
                      disabled={isViewMode}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="breadth">Breadth *</Label>
                    <Input
                      type="number"
                      id="breadth"
                      name="breadth"
                      value={formData.breadth}
                      onChange={handleChange}
                      placeholder="Breadth"
                      required
                      disabled={isViewMode}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
