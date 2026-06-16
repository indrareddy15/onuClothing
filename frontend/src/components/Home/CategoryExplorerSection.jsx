import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { ArrowRight, Sparkles } from "lucide-react";

const CategoryExplorerSection = ({ categories }) => {
  const [activeCategory, setActiveCategory] = useState(0);

  if (!categories || categories.length === 0) return null;

  return (
    <section className="w-full py-16 md:py-24 bg-[#FAFAF9] relative overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-900 text-white text-[10px] font-bold uppercase tracking-[0.18em] mb-5">
            <Sparkles size={12} />
            <span>Explore Categories</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-gray-900 uppercase leading-[0.95]">
            Find Your Vibe
          </h2>
          <p className="text-sm md:text-base text-gray-600 mt-4 max-w-2xl mx-auto font-medium">
            Every style tells a story. What's yours?
          </p>
        </div>

        {/* Interactive Category Grid */}
        <div className="rounded-3xl border border-gray-100 bg-white shadow-sm p-6 md:p-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-8">
            {categories.slice(0, 12).map((category, index) => (
              <Link
                key={index}
                to={`/products?category=${category.name?.toLowerCase()}`}
                className="group relative flex flex-col items-center"
                onMouseEnter={() => setActiveCategory(index)}
              >
                {/* Category Image Container */}
                <div
                  className={`
                                    relative w-full aspect-square overflow-hidden 
                                    backdrop-blur-md bg-white/40 border-2 border-white/30 
                                    transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-2xl
                                    ${
                                      activeCategory === index
                                        ? "scale-[1.02] shadow-2xl border-black/20"
                                        : ""
                                    }
                                `}
                >
                  <LazyLoadImage
                    src={category.url || category}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Gradient Overlay for Text Readability */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Category Name Overlay (Mobile Style) */}
                  <div className="absolute inset-0 flex flex-col justify-end p-3 md:hidden">
                    <span className="text-white text-xs font-black uppercase tracking-tighter leading-none mb-1">
                      {category.name}
                    </span>
                    <div className="w-6 h-0.5 bg-white rounded-full" />
                  </div>

                  {/* Hover Arrow */}
                  <div
                    className={`
                                        absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm
                                        flex items-center justify-center transition-all duration-300 shadow-lg
                                        ${
                                          activeCategory === index
                                            ? "scale-100 opacity-100"
                                            : "scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100"
                                        }
                                    `}
                  >
                    <ArrowRight size={14} className="text-gray-900" />
                  </div>
                </div>

                {/* Desktop Category Name (Hidden on Mobile) */}
                <div className="hidden md:block mt-4 text-center">
                  <span
                    className={`
                                        text-sm md:text-base font-bold uppercase tracking-wide 
                                        transition-all duration-300
                                        ${
                                          activeCategory === index
                                            ? "text-black scale-105"
                                            : "text-gray-600 group-hover:text-black group-hover:scale-105"
                                        }
                                    `}
                  >
                    {category.name}
                  </span>
                  {/* Animated underline */}
                  <div
                    className={`
                                      mt-1 h-0.5 bg-gradient-to-r from-gray-900 to-gray-600 
                                      transition-all duration-500 mx-auto
                                      ${
                                        activeCategory === index
                                          ? "w-full opacity-100"
                                          : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                                      }
                                  `}
                  />
                </div>
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center mt-12">
            <Link
              to="/products"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-black text-white font-bold text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
            >
              <span>View All Categories</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              <div className="absolute inset-0 bg-gray-800 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 origin-center -z-10" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryExplorerSection;
