import React, { useEffect, useState } from "react";
import { ArrowRight, Wind, Sparkles, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Inline SVG grain (data URI) — replaces the previous runtime request to an
// external host so the hero renders without a third-party network dependency.
const GRAIN =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#n)' opacity='0.5'/></svg>`
    );

const ModernHero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const navigate = useNavigate();

  const featuredImages = [
    { src: "/Hero_01.png", alt: "Featured style look one" },
    { src: "/Hero_02.png", alt: "Featured style look two" },
    { src: "/Hero_03.png", alt: "Featured style look three" },
  ];

  const features = [
    { icon: Award, label: "Premium Fabrics", value: "PREMIUM\nFABRICS" },
    { icon: Wind, label: "Timeless Styles", value: "TIMELESS\nSTYLES" },
    { icon: Sparkles, label: "Made For You", value: "MADE FOR\nYOU" },
  ];

  useEffect(() => {
    setIsVisible(true);

    const interval = window.setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % featuredImages.length);
    }, 6000);

    return () => window.clearInterval(interval);
  }, [featuredImages.length]);

  return (
    <div className="relative w-full">
      {/* Hero Section */}
      <section className="relative w-full min-h-screen bg-gradient-to-b from-[#f5ede0] via-[#faf7f2] to-[#f8f5f0] overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/40 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3 opacity-50" />
        <div className="absolute bottom-20 right-0 w-72 h-72 bg-amber-100/20 rounded-full blur-3xl translate-x-1/4 opacity-40" />

        <div className="container mx-auto px-6 md:px-12 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[600px]">
            {/* Left Content */}
            <div className="relative z-10">
              {/* Collection Label */}
              <div
                className={`
                  inline-block mb-8 text-xs font-bold uppercase tracking-[0.3em] text-neutral-600
                  transition-all duration-700 transform
                  ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"}
                `}
              >
                Casual Wear Collection
              </div>

              {/* Main Headline */}
              <h1
                className={`
                  text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] mb-6
                  text-neutral-900 transition-all duration-700 delay-100 transform
                  ${isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}
                `}
              >
                Effortless Style.
                <br />
                Everyday You.
              </h1>

              {/* Divider */}
              <div
                className={`
                  w-16 h-1 bg-neutral-900 mb-8
                  transition-all duration-700 delay-200 transform
                  ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"}
                `}
              />

              {/* Description */}
              <p
                className={`
                  text-lg text-neutral-700 font-light leading-relaxed mb-10 max-w-md
                  transition-all duration-700 delay-300 transform
                  ${isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
                `}
              >
                Timeless designs. Premium comfort.
                <br />
                Made for every moment.
              </p>

              {/* CTA Button */}
              <div
                className={`
                  transition-all duration-700 delay-500 transform
                  ${isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
                `}
              >
                <button
                  onClick={() => navigate("/products")}
                  className="group inline-block px-8 py-4 bg-neutral-900 text-white font-bold uppercase tracking-widest text-sm hover:bg-neutral-800 transition-all duration-300"
                >
                  Shop Now
                </button>
              </div>
            </div>

            {/* Right Image - Rotating Featured Images */}
            <div className="relative h-[500px] md:h-[700px] hidden lg:block">
              {featuredImages.map((image, index) => (
                <div
                  key={image.src}
                  className={`
                    absolute inset-0 transition-opacity duration-1000
                    ${index === activeImageIndex ? "opacity-100" : "opacity-0"}
                  `}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Section at Bottom */}
        <div className="relative z-10 border-t border-neutral-300/30 bg-white/50 backdrop-blur-sm">
          <div className="container mx-auto px-6 md:px-12 py-16">
            <div className="grid grid-cols-3 gap-8 md:gap-12">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className={`
                      flex flex-col items-center text-center
                      transition-all duration-700 transform
                      ${
                        isVisible
                          ? "translate-y-0 opacity-100"
                          : "translate-y-8 opacity-0"
                      }
                    `}
                    style={{ transitionDelay: `${700 + index * 100}ms` }}
                  >
                    <Icon className="w-6 h-6 md:w-8 md:h-8 text-neutral-700 mb-3" />
                    <span className="text-[11px] md:text-xs font-bold uppercase tracking-wider text-neutral-600 whitespace-pre-line leading-tight">
                      {feature.value}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ModernHero;
