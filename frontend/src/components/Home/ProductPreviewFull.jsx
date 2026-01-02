import React, { useEffect, useState } from "react";
import HomeProductsPreview from "./HomeProductsPreview";
import { formattedSalePrice } from "../../config";
import { useNavigate } from "react-router-dom";

const previewHeader = [
  { id: "topPicks", title: "Top Picks" },
  { id: "bestSeller", title: "Best Sellers" },
  { id: "luxuryItems", title: "Luxury Items" },
];

const ProductPreviewFull = ({ product, user }) => {
  const navigation = useNavigate();

  const [previewProducts, setSelectedPreviewProducts] = useState([]);
  const [activePreview, setActivePreviews] = useState("topPicks");
  const [selectedColors, setSelectedColors] = useState({});
  const getRandomArrayOfProducts = (previewProductsTitle) => {
    if (product) {
      const maxProductsAmount = window.screen.width > 1024 ? 5 : 4;
      const itemsOfCategory = product
        .filter((p) => p.specialCategory === previewProductsTitle)
        .slice(0, maxProductsAmount); // filter by bestSeller and take first 6 items
      setSelectedPreviewProducts(itemsOfCategory);
      setActivePreviews(previewProductsTitle);
    }
  };

  const handleColorChange = (productId, colorImages) => {
    setSelectedColors((prevState) => ({
      ...prevState,
      [productId]: colorImages,
    }));
  };
  const handleMoveToQuery = () => {
    const queryParams = new URLSearchParams();
    if (activePreview) queryParams.set("specialCategory", activePreview);
    if (!activePreview) {
      navigation("/products");
      return;
    }
    const url = `/products?${queryParams.toString()}`;
    navigation(url);
  };
  useEffect(() => {
    getRandomArrayOfProducts("topPicks");
  }, [product]);

  return (
    <div className="w-full flex flex-col justify-self-center justify-center items-center py-20 relative">
      {/* Background decoration */}
		  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-transparent" />

      <div className="relative z-10 flex flex-wrap justify-center items-center gap-6 mb-20 w-full max-w-5xl px-4">
        <div className="backdrop-blur-lg bg-white/30 rounded-2xl border border-white/20 shadow-xl p-2">
          <div className="flex flex-wrap justify-center gap-2">
            {previewHeader &&
              previewHeader.length > 0 &&
              previewHeader.map((h, index) => (
                <button
                  onClick={(e) => {
                    if (h?.id !== activePreview) {
                      getRandomArrayOfProducts(h?.id);
                    } else {
                      e.preventDefault();
                    }
                  }}
                  key={index}
                  className={`
										px-8 py-3 rounded-xl text-sm font-bold tracking-wide uppercase transition-all duration-500
										${
                      activePreview === h.id
                        ? "bg-black text-white shadow-lg scale-105 backdrop-blur-md"
                        : "backdrop-blur-md bg-white/40 text-gray-700 hover:bg-white/60 hover:text-black hover:scale-105"
                    }
									`}
                >
                  {h?.title}
                </button>
              ))}
          </div>
        </div>
      </div>
      {/* Product Grid */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-16 w-full px-4 md:px-8 lg:px-12">
        {previewProducts &&
          previewProducts.length > 0 &&
          previewProducts.map((p, index) => {
            const selectedColor =
              selectedColors[p._id] || p.AllColors[0]?.images;
            return (
              <div
                key={`product_${p._id}_${index}`}
                className="flex flex-col group"
              >
                <div className="relative backdrop-blur-md bg-white/30 rounded-2xl border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden">
                  <HomeProductsPreview
                    product={p}
                    selectedColorImages={selectedColor}
                    user={user}
                  />
                </div>

                <div className="mt-6 space-y-3 px-4 pb-4">
                  <div className="flex justify-between items-start gap-2">
                    <h3
                      className="text-sm font-bold text-gray-900 leading-tight group-hover:text-gray-600 transition-colors cursor-pointer line-clamp-2"
                      onClick={() => navigation(`/products/${p._id}`)}
                    >
                      {p?.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    {p.salePrice > 0 ? (
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-black text-black">
                          ₹{formattedSalePrice(p.salePrice)}
                        </span>
                        <span className="text-sm text-gray-400 line-through font-medium">
                          ₹{formattedSalePrice(p.price)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-base font-black text-black">
                        ₹{formattedSalePrice(p.price)}
                      </span>
                    )}
                  </div>

                  {/* Color Dots */}
                  {p.AllColors && p.AllColors.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {p.AllColors.slice(0, 5)
                        .filter(
                          (value, index, self) =>
                            index ===
                            self.findIndex((t) => t.label === value.label)
                        )
                        .map((color, colorIndex) => (
                          <button
                            onClick={() =>
                              handleColorChange(p._id, color.images)
                            }
                            key={colorIndex}
                            className={`w-4 h-4 rounded-full border-2 border-white shadow-md transition-all hover:scale-125 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-black/20`}
                            style={{ backgroundColor: color.label }}
                            aria-label={`Select color ${color.label}`}
                          />
                        ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>
      {/* View More Button */}
      <div className="mt-24 relative z-10">
        <button
          onClick={handleMoveToQuery}
          className="group relative px-12 py-5 bg-black/90 backdrop-blur-md text-white overflow-hidden rounded-full transition-all hover:shadow-2xl hover:scale-105 active:scale-95 border border-white/10"
        >
          <span className="relative z-10 text-sm font-bold tracking-widest uppercase flex items-center gap-2">
            View All Products
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
        </button>
      </div>
    </div>
  );
};

export default ProductPreviewFull;
