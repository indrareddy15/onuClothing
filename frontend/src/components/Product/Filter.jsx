import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Label } from '../../components/ui/label';
import { Checkbox } from '../../components/ui/checkbox';
import { Slider } from '../../components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"

const Filter = ({ products }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Initial state for filters
  const [filters, setFilters] = useState({
    gender: 'all',
    category: 'all',
    subcategory: 'all',
    sizes: [],
    colors: [],
    specialCategory: [],
    priceRange: [0, 1000],
  });

  // Helper function to parse the query string into an object
  const parseQueryParams = (queryString) => {
    const urlParams = new URLSearchParams(queryString);
    const params = {
      gender: urlParams.get('gender') || 'all',
      category: urlParams.get('category') || 'all',
      subcategory: urlParams.get('subcategory') || 'all',
      sizes: urlParams.getAll('sizes'),
      colors: urlParams.getAll('colors'),
      priceRange: [
        parseInt(urlParams.get('minPrice') || '0', 10),
        parseInt(urlParams.get('maxPrice') || '1000', 10),
      ],
    };
    return params;
  };

  // Update state based on query params in URL
  useEffect(() => {
    const params = parseQueryParams(location.search);
    setFilters(params);
  }, [location.search]);

  // Handle the changes of filters and update the URL
  const handleSelectChange = (name, value) => {
    setFilters({ ...filters, [name]: value });
  };

  const handleCheckboxChange = (name, value, checked) => {
    const updatedValues = checked
      ? [...filters[name], value]
      : filters[name].filter((item) => item !== value);

    setFilters({ ...filters, [name]: updatedValues });
  };

  // Update the query string in the URL when a filter changes
  const updateUrlQuery = () => {
    const queryParams = new URLSearchParams();

    // Add query params to URL
    queryParams.set('gender', filters.gender);
    queryParams.set('specialCategory', filters.specialCategory);
    queryParams.set('category', filters.category);
    queryParams.set('subcategory', filters.subcategory);
    filters.sizes.forEach((size) => queryParams.append('sizes', size));
    filters.colors.forEach((color) => queryParams.append('colors', color));
    queryParams.set('minPrice', filters.priceRange[0]);
    queryParams.set('maxPrice', filters.priceRange[1]);

    // Update the browser URL
    navigate(`?${queryParams.toString()}`, { replace: true });
  };

  // Handle price range change
  const handlePriceRangeChange = (value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      priceRange: value,
    }));
  };

  // Handle the filter submission
  useEffect(() => {
    updateUrlQuery();
  }, [filters]);

  return (
    <div className="w-80 p-5 bg-card rounded-lg shadow-lg border border-border">
      <h3 className="text-xl font-semibold mb-5">Filter Products</h3>

      {/* Gender Filter */}
      <div className="mb-4">
        <Label htmlFor="gender" className="mb-2 block">Gender</Label>
        <Select
          value={filters.gender}
          onValueChange={(value) => handleSelectChange('gender', value)}
        >
          <SelectTrigger id="gender">
            <SelectValue placeholder="Select Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="men">Men</SelectItem>
            <SelectItem value="women">Women</SelectItem>
            <SelectItem value="unisex">Unisex</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Category Filter */}
      <div className="mb-4">
        <Label htmlFor="category" className="mb-2 block">Category</Label>
        <Select
          value={filters.category}
          onValueChange={(value) => handleSelectChange('category', value)}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="clothing">Clothing</SelectItem>
            <SelectItem value="footwear">Footwear</SelectItem>
            <SelectItem value="accessories">Accessories</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Subcategory Filter */}
      <div className="mb-4">
        <Label htmlFor="subcategory" className="mb-2 block">Subcategory</Label>
        <Select
          value={filters.subcategory}
          onValueChange={(value) => handleSelectChange('subcategory', value)}
        >
          <SelectTrigger id="subcategory">
            <SelectValue placeholder="Select Subcategory" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="shirts">Shirts</SelectItem>
            <SelectItem value="pants">Pants</SelectItem>
            <SelectItem value="shoes">Shoes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sizes Filter */}
      <div className="mb-4">
        <Label className="mb-2 block">Sizes</Label>
        <div className="flex flex-wrap gap-3">
          {['S', 'M', 'L', 'XL'].map((size) => (
            <div key={size} className="flex items-center space-x-2">
              <Checkbox
                id={`size-${size}`}
                checked={filters.sizes.includes(size)}
                onCheckedChange={(checked) => handleCheckboxChange('sizes', size, checked)}
              />
              <Label htmlFor={`size-${size}`}>{size}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Colors Filter */}
      <div className="mb-4">
        <Label className="mb-2 block">Colors</Label>
        <div className="flex flex-wrap gap-3">
          {['Red', 'Blue', 'Black', 'White'].map((color) => (
            <div key={color} className="flex items-center space-x-2">
              <Checkbox
                id={`color-${color}`}
                checked={filters.colors.includes(color)}
                onCheckedChange={(checked) => handleCheckboxChange('colors', color, checked)}
              />
              <Label htmlFor={`color-${color}`}>{color}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="mb-4">
        <Label className="mb-2 block">Price Range</Label>
        <Slider
          defaultValue={[0, 1000]}
          value={filters.priceRange}
          min={0}
          max={1000}
          step={10}
          onValueChange={handlePriceRangeChange}
          className="my-4"
        />
        <div className="text-center text-sm text-muted-foreground">{`$${filters.priceRange[0]} - $${filters.priceRange[1]}`}</div>
      </div>
    </div>
  );
};

export default Filter;
