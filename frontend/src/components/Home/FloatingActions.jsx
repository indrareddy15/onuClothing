import React, { useState, useEffect } from "react";
import {
  ChevronUp,
  MessageCircle,
  Heart,
  Share2,
  Sparkles,
} from "lucide-react";
import WhatsAppButton from "./WhatsAppButton";
import BackToTopButton from "./BackToTopButton";

const FloatingActions = ({ scrollableDivRef }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollableDivRef.current) {
        const scrollTop = scrollableDivRef.current.scrollTop;
        setIsVisible(scrollTop > 300);
      }
    };

    const scrollContainer = scrollableDivRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, [scrollableDivRef]);

  const scrollToTop = () => {
    if (scrollableDivRef.current) {
      scrollableDivRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* Floating Action Menu */}
      <div
        className={`transform transition-all duration-500 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
          }`}
      >
        {/* Back to Top */}
        <button
          onClick={scrollToTop}
          className="group relative mb-3 w-14 h-14 rounded-full backdrop-blur-md bg-black/80 hover:bg-black border border-white/20 text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <ChevronUp className="w-5 h-5 mx-auto transition-transform group-hover:-translate-y-0.5" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>

        {/* WhatsApp */}
        <div className="mb-3">
          <WhatsAppButton scrollableDivRef={scrollableDivRef} />
        </div>

        {/* Share */}
        <button className="group relative w-14 h-14 rounded-full backdrop-blur-md bg-white/20 hover:bg-white/30 border border-white/30 text-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95">
          <Share2 className="w-5 h-5 mx-auto transition-transform group-hover:scale-110" />
        </button>
      </div>

      {/* Animated Sparkles */}
      <div className="absolute -top-2 -right-2 pointer-events-none">
        <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
      </div>
    </div>
  );
};

export default FloatingActions;
