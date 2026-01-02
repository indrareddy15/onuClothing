import React, { useEffect, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Marquee from "../ui/marquee";

const HeroBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleShopNow = () => {
    navigate("/products");
  };

  return (
    <section className="relative w-full min-h-[95vh] flex flex-col justify-between overflow-hidden bg-gradient-to-br from-neutral-50 via-white to-neutral-100 pt-20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-purple-200/30 via-pink-200/20 to-blue-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-20 w-80 h-80 bg-gradient-to-br from-blue-200/25 via-cyan-200/20 to-purple-200/25 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-40 left-1/4 w-72 h-72 bg-gradient-to-br from-yellow-200/20 via-orange-200/15 to-pink-200/20 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.02] bg-[linear-gradient(90deg,transparent_79px,#000_80px),linear-gradient(transparent_79px,#000_80px)] bg-[size:80px_80px]" />

      <div className="container relative z-10 mx-auto px-4 md:px-8 flex-1 flex flex-col justify-center">
        <div className="max-w-7xl mx-auto text-center">
          <div
            className={`
                            inline-flex items-center gap-3 px-6 py-3 rounded-full bg-black/90 backdrop-blur-md text-white text-sm font-bold uppercase tracking-widest mb-8 border border-white/10
                            transition-all duration-700 transform
                            ${
                              isVisible
                                ? "translate-y-0 opacity-100"
                                : "translate-y-10 opacity-0"
                            }
                        `}
          >
            <Sparkles size={16} className="animate-pulse" />
            <span>Fresh Collection 2024</span>
          </div>

          <h1
            className={`
                            text-6xl md:text-8xl lg:text-[10rem] xl:text-[12rem] font-black mb-8
                            text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900
                            tracking-tighter leading-[0.8] uppercase
                            transition-all duration-700 delay-100 transform
                            ${
                              isVisible
                                ? "translate-y-0 opacity-100"
                                : "translate-y-10 opacity-0"
                            }
                        `}
          >
            WEAR THE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-800 via-purple-600 to-neutral-900 relative">
              MOMENT
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </span>
          </h1>

          <p
            className={`
                            text-xl md:text-2xl lg:text-3xl mb-12 max-w-4xl mx-auto
                            text-neutral-600 font-medium leading-relaxed
                            transition-all duration-700 delay-200 transform
                            ${
                              isVisible
                                ? "translate-y-0 opacity-100"
                                : "translate-y-10 opacity-0"
                            }
                        `}
          >
            Curated essentials for the next generation.{" "}
            <br className="hidden md:block" />
            <span className="font-semibold text-neutral-800">
              Bold styles. Unapologetic vibes
            </span>{" "}
            only on <span className="font-black">ON U</span>.
          </p>

          <div
            className={`
                            flex flex-col sm:flex-row gap-6 justify-center items-center
                            transition-all duration-700 delay-300 transform
                            ${
                              isVisible
                                ? "translate-y-0 opacity-100"
                                : "translate-y-10 opacity-0"
                            }
                        `}
          >
            <button
              onClick={handleShopNow}
              className="group relative px-12 py-6 bg-black/90 backdrop-blur-md text-white text-lg font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 border border-white/10 shadow-2xl hover:shadow-black/25"
            >
              <span className="relative z-10 flex items-center gap-3">
                SHOP NOW{" "}
                <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-800 to-neutral-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            </button>

            <button className="group px-12 py-6 backdrop-blur-md bg-white/30 border border-white/40 text-gray-900 text-lg font-bold rounded-full transition-all hover:bg-white/40 hover:scale-105">
              <span className="flex items-center gap-2">
                <span>Explore</span>
                <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Marquee Strip at Bottom */}
      <div className="relative z-10 border-y border-white/30 bg-white/40 backdrop-blur-xl py-6 mt-16">
        <Marquee className="[--duration:30s]" pauseOnHover>
          {[
            "FREE SHIPPING WORLDWIDE",
            "•",
            "NEW ARRIVALS DAILY",
            "•",
            "LIMITED EDITION DROPS",
            "•",
            "PREMIUM QUALITY",
            "•",
            "24/7 SUPPORT",
            "•",
          ].map((text, i) => (
            <span
              key={i}
              className="mx-12 text-xl md:text-2xl font-black tracking-widest uppercase text-neutral-900 hover:text-purple-600 transition-colors duration-300"
            >
              {text}
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default HeroBanner;
