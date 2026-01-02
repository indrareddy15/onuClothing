import React, { useState, useRef, useEffect } from "react";
import { cn } from "../../lib/utils";
import GridImageView from "./GridImageView";

const VideoGridItem = ({ url, categoriesOptions }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsPlaying(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  return (
    <div ref={videoRef} className="w-full h-full">
      <GridImageView
        imageToShow={url.url || url}
        startPlaying={isPlaying}
        categoriesOptions={categoriesOptions}
        categoryName={url.name}
      />
    </div>
  );
};

const BentoGrid = ({ items, categoriesOptions, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 auto-rows-[200px] md:auto-rows-[300px]">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className={cn(
                "backdrop-blur-lg bg-gradient-to-br from-gray-100/60 to-gray-200/60 animate-pulse rounded-2xl border border-white/20 shadow-lg",
                i === 0 ? "col-span-2 row-span-2" : "aspect-square"
              )}
            />
          ))}
      </div>
    );
  }

  if (!items || items.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] md:auto-rows-[300px] gap-6">
      {items.slice(0, 7).map((item, i) => {
        // Bento Grid Pattern
        // 0: Big Square (2x2)
        // 1: Standard (1x1)
        // 2: Tall (1x2)
        // 3: Wide (2x1)
        // 4: Standard
        // 5: Standard
        // 6: Wide (2x1)

        let spanClass = "";
        if (i === 0) spanClass = "col-span-2 row-span-2";
        else if (i === 2) spanClass = "col-span-1 row-span-2";
        else if (i === 3 || i === 6) spanClass = "col-span-2 row-span-1";
        else spanClass = "col-span-1 row-span-1";

        return (
          <div
            key={i}
            className={cn(
              "group relative overflow-hidden rounded-2xl backdrop-blur-md bg-white/30 border border-white/30 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:bg-white/40",
              spanClass
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5 group-hover:to-black/10 transition-all duration-500" />
            <VideoGridItem url={item} categoriesOptions={categoriesOptions} />
          </div>
        );
      })}
    </div>
  );
};

export default BentoGrid;
