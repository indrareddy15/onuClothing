import React from "react";
import { Star, Zap, Heart, TrendingUp } from "lucide-react";

const BrandPromiseSection = () => {
  const promises = [
    {
      icon: Star,
      title: "Premium Quality",
      desc: "Curated pieces that last",
      color: "from-yellow-400 to-orange-500",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      desc: "Express delivery nationwide",
      color: "from-blue-400 to-purple-500",
    },
    {
      icon: Heart,
      title: "Made with Love",
      desc: "Crafted for your lifestyle",
      color: "from-pink-400 to-red-500",
    },
    {
      icon: TrendingUp,
      title: "Always Fresh",
      desc: "Latest trends, daily drops",
      color: "from-green-400 to-emerald-500",
    },
  ];

  return (
    <section className="w-full py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50" />

      {/* Animated background elements */}
      <div className="absolute top-10 left-1/4 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-2xl animate-pulse" />
      <div
        className="absolute bottom-10 right-1/4 w-40 h-40 bg-gradient-to-br from-blue-200/30 to-cyan-200/30 rounded-full blur-2xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="max-w-screen-2xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-gray-900 to-gray-700 text-white text-xs font-bold uppercase tracking-widest mb-6">
            <Star size={14} />
            <span>Why Choose Us</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 uppercase">
            Our Promise
          </h2>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
            More than just fashion – it's a lifestyle revolution
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {promises.map((promise, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-3xl backdrop-blur-lg bg-white/40 border border-white/30 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2"
            >
              {/* Gradient background on hover */}
              <div
                className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${promise.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
              />

              {/* Icon */}
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${promise.color} text-white shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <promise.icon size={24} strokeWidth={2} />
              </div>

              {/* Content */}
              <h3 className="text-xl font-black text-gray-900 mb-3 group-hover:text-gray-800 transition-colors duration-300">
                {promise.title}
              </h3>
              <p className="text-gray-600 font-medium group-hover:text-gray-700 transition-colors duration-300">
                {promise.desc}
              </p>

              {/* Shine effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandPromiseSection;
