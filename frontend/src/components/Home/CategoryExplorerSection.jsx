import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { ArrowRight, Sparkles } from "lucide-react";

const CategoryExplorerSection = ({ categories }) => {
  const [activeCategory, setActiveCategory] = useState(0);

  if (!categories || categories.length === 0) return null;

  return (
    <section className="w-full py-24 bg-gradient-to-br from-neutral-50 via-white to-neutral-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-purple-100/40 to-pink-100/40 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-100/40 to-cyan-100/40 rounded-full blur-3xl" />

      <div className="max-w-screen-2xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white text-xs font-bold uppercase tracking-widest mb-6">
            <Sparkles size={14} />
            <span>Explore Categories</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 uppercase leading-[0.9]">
            Find Your Vibe
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mt-4 max-w-3xl mx-auto">
            Every style tells a story. What's yours?
          </p>
        </div>

        {/* Interactive Category Grid */}
        <div className="backdrop-blur-lg bg-white/20 rounded-3xl border border-white/20 shadow-2xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-8">
            {categories.slice(0, 12).map((category, index) => (
              <Link
                key={index}
                to={`/products?category=${category.name?.toLowerCase()}`}
                className="group relative flex flex-col items-center"
                onMouseEnter={() => setActiveCategory(index)}
              >
                {/* Category Image */}
                <div
                  className={`
                                    relative w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-2xl md:rounded-3xl overflow-hidden 
                                    backdrop-blur-md bg-white/40 border-2 border-white/30 
                                    transition-all duration-500 group-hover:scale-110 group-hover:shadow-2xl
                                    ${
                                      activeCategory === index
                                        ? "scale-110 shadow-2xl border-black/20"
                                        : ""
                                    }
                                `}
                >
                  <LazyLoadImage
                    src={category.url || category}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Overlay */}
                  <div
                    className={`
                                        absolute inset-0 bg-gradient-to-t from-black/30 to-transparent 
                                        transition-opacity duration-300
                                        ${
                                          activeCategory === index
                                            ? "opacity-100"
                                            : "opacity-0 group-hover:opacity-100"
                                        }
                                    `}
                  />

                  {/* Hover Arrow */}
                  <div
                    className={`
                                        absolute bottom-2 right-2 w-6 h-6 rounded-full bg-white/80 backdrop-blur-sm
                                        flex items-center justify-center transition-all duration-300
                                        ${
                                          activeCategory === index
                                            ? "scale-100 opacity-100"
                                            : "scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100"
                                        }
                                    `}
                  >
                    <ArrowRight size={12} className="text-gray-900" />
                  </div>
                </div>

                {/* Category Name */}
                <div className="mt-4 text-center">
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
                </div>

                {/* Animated underline */}
                <div
                  className={`
                                    mt-1 h-0.5 bg-gradient-to-r from-gray-900 to-gray-600 
                                    transition-all duration-500 origin-center
                                    ${
                                      activeCategory === index
                                        ? "w-full opacity-100"
                                        : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                                    }
                                `}
                />
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
