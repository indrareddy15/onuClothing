import React, { useEffect, useState } from "react";
import { ArrowRight, Wind, Sparkles, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
      {/* Full Screen Hero with Image Background */}
      <section className="relative w-full h-screen min-h-screen flex items-center justify-center overflow-hidden pt-16 lg:pt-0">
        {/* Background Images - Full Screen */}
        <div className="absolute inset-0">
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
              {/* Dark Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/50" />
            </div>
          ))}
        </div>

        {/* Content Overlay */}
        <div className="container mx-auto px-6 md:px-12 relative z-10 flex items-center justify-center min-h-screen">
          <div className="max-w-2xl mx-auto text-center lg:text-left">
            {/* Collection Label */}
            <div
              className={`
                inline-block mb-8 text-xs font-bold uppercase tracking-[0.3em] text-white/80
                transition-all duration-700 transform
                ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"}
              `}
            >
              Casual Wear Collection
            </div>

            {/* Main Headline */}
            <h1
              className={`
                text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6
                text-white transition-all duration-700 delay-100 transform
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
                w-16 h-1 bg-white mb-8 mx-auto lg:mx-0
                transition-all duration-700 delay-200 transform
                ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"}
              `}
            />

            {/* Description */}
            <p
              className={`
                text-base sm:text-lg md:text-xl text-white/90 font-light leading-relaxed mb-10
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
                flex flex-col sm:flex-row gap-4
                transition-all duration-700 delay-500 transform
                ${isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
              `}
            >
              <button
                onClick={() => navigate("/products")}
                className="group inline-block px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-white/90 transition-all duration-300 hover:scale-105"
              >
                Shop Now
              </button>
              <button
                onClick={() => navigate("/about")}
                className="group inline-block px-8 py-4 border-2 border-white text-white font-bold uppercase tracking-widest text-sm hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="animate-bounce text-white/50 text-sm uppercase tracking-widest font-bold">
            Scroll to explore
          </div>
        </div>
      </section>

      {/* Features Section at Bottom */}
      <div className="relative z-10 bg-white/50 backdrop-blur-sm border-t border-neutral-300/30">
        <div className="container mx-auto px-6 md:px-12 py-16">
          <div className="grid grid-cols-3 gap-6 md:gap-12">
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
                  <Icon className="w-6 h-6 md:w-8 md:h-8 text-neutral-900 mb-3" />
                  <span className="text-[11px] md:text-xs font-bold uppercase tracking-wider text-neutral-700 whitespace-pre-line leading-tight">
                    {feature.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernHero;
