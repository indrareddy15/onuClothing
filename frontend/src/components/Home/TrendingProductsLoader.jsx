import React from "react";
import { Loader2 } from "lucide-react";

const TrendingProductsLoader = () => {
  return (
    <div className="max-w-screen-2xl mx-auto px-4">
      <div className="backdrop-blur-lg bg-white/30 rounded-3xl border border-white/20 shadow-xl p-8">
        {/* Header skeleton */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            <div className="h-3 w-32 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Product grid skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="group relative">
                {/* Product image skeleton */}
                <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 rounded-2xl mb-4 relative overflow-hidden">
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -skew-x-12 translate-x-[-100%] animate-shimmer" />
                </div>

                {/* Product details skeleton */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded-lg w-3/4 animate-pulse" />
                  <div className="flex gap-2 mt-3">
                    <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse" />
                    <div className="h-6 bg-gray-200 rounded-full w-12 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Bottom loading indicator */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">
              Loading trending products...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingProductsLoader;
