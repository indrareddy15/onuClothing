import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./home.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Allproduct } from "../../action/productaction";
import { useDispatch, useSelector } from "react-redux";
import {
  Truck,
  ShieldCheck,
  RefreshCcw,
  Headphones,
  Sparkles,
  TrendingUp,
  Star,
  ArrowRight,
} from "lucide-react";

// Components
import ModernHero from "./ModernHero";
import ModernProductCard from "./ModernProductCard";
import CarousalView from "./CarousalView";
import DraggableImageSlider from "./DraggableImageSlider";
import Footer from "../Footer/Footer";
import BackToTopButton from "./BackToTopButton";
import WhatsAppButton from "./WhatsAppButton";
import FloatingActions from "./FloatingActions";
import CategoryExplorerSection from "./CategoryExplorerSection";
import TrendingProductsLoader from "./TrendingProductsLoader";
import TrackVisite from "../TrackVisite";
import BentoGrid from "./BentoGrid";
import Marquee from "../ui/marquee";
import { fetchWebsiteDisclaimer } from "../../action/common.action";
import { useServerBanners } from "../../Contaxt/ServerBannerContext";

const Home = ({ user }) => {
  const {
    banners,
    categoryBanners,
    bannerLoading,
    CategoryBannerLoading,
    categoriesOptions,
    noFilterProducts,
    productAllProductsLoading,
  } = useServerBanners();
  const dispatch = useDispatch();
  const scrollableDivRef = useRef(null);

  useEffect(() => {
    dispatch(Allproduct());
    window.scrollTo(0, 0);
  }, [dispatch]);

  // Banner Logic
  const getBannerSection = (type) => {
    if (!banners) return { urls: [], header: "" };
    return {
      urls: banners.find((b) => b?.CategoryType === type)?.Url || [],
      header: banners.find((b) => b?.CategoryType === type)?.Header || "",
    };
  };

  const WideScreen_Video = categoryBanners?.find(
    (b) => b?.CategoryType === "WideScreen_Video"
  ) || { Url: [], Header: "" };

  const MobileScreen_CategorySlider = categoryBanners?.find(
    (b) => b?.CategoryType === "MobileScreen_CategorySlider"
  ) || { Url: [], Header: "" };

  const sections = [
    getBannerSection("Wide Screen Section- 2"),
    getBannerSection("Wide Screen Section- 4"),
    getBannerSection("Wide Screen Section- 5"),
    getBannerSection("Wide Screen Section- 6"),
    getBannerSection("Wide Screen Section- 7"),
  ];

  const gridSection = getBannerSection("Wide Screen Section- 8");

  return (
    <div
      ref={scrollableDivRef}
      className="w-full font-sans min-h-screen overflow-y-auto overflow-x-hidden bg-white scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent relative"
    >
      {/* 1. Modern Hero Section */}
      <ModernHero />

      {/* 2. Marquee Strip (Brands/Values) */}
      <div className="border-b border-gray-100 bg-white py-4">
        <Marquee className="[--duration:40s]" pauseOnHover>
          {[
            "PREMIUM QUALITY", "•", "SUSTAINABLE FASHION", "•", "GLOBAL SHIPPING", "•",
            "NEW ARRIVALS", "•", "LIMITED EDITIONS", "•", "EXLCUSIVE DROPS", "•"
          ].map((text, i) => (
            <span key={i} className="mx-8 text-xs font-bold tracking-[0.2em] text-gray-400 uppercase">
              {text}
            </span>
          ))}
        </Marquee>
      </div>

      {/* 3. Mobile Category Explorer */}
      {MobileScreen_CategorySlider?.Url?.length > 0 && (
        <div className="md:hidden py-8 bg-gray-50">
          <CategoryExplorerSection categories={MobileScreen_CategorySlider.Url} />
        </div>
      )}

      {/* 4. Bento Grid (Curated Collections) */}
      {WideScreen_Video?.Url?.length > 0 && (
        <section className="py-20 px-4 md:px-8 max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-8 h-[1px] bg-black"></span>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Collections</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 uppercase">
                {WideScreen_Video.Header || "Curated For You"}
              </h2>
            </div>
            <Link to="/products" className="group flex items-center gap-2 text-sm font-bold uppercase tracking-wider border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-all">
              View All Collections <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <BentoGrid
            items={WideScreen_Video.Url}
            categoriesOptions={categoriesOptions}
            loading={CategoryBannerLoading}
          />
        </section>
      )}

      {/* 5. Trending / New Arrivals (Horizontal Scroll) */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black text-white text-[10px] font-bold uppercase tracking-widest mb-4">
              <TrendingUp size={12} />
              <span>Fresh Drops</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-gray-900 uppercase mb-4">
              Trending Now
            </h2>
            <p className="text-gray-500 max-w-lg">
              Discover the pieces that are defining the current season.
            </p>
          </div>

          {productAllProductsLoading ? (
            <TrendingProductsLoader />
          ) : (
            <div className="relative">
              {/* Horizontal Scroll Container */}
              <div className="flex overflow-x-auto gap-6 pb-8 scrollbar-hide snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0">
                {noFilterProducts && noFilterProducts.slice(0, 8).map((product, index) => (
                  <div key={index} className="min-w-[280px] md:min-w-[320px] snap-center">
                    <ModernProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 6. Main Banner (Carousal) */}
      {getBannerSection("Wide Screen Section- 1").urls.length > 0 && (
        <section className="py-12 px-4 md:px-8 max-w-[1600px] mx-auto">
          <div className="rounded-3xl overflow-hidden shadow-2xl">
            <CarousalView
              b_banners={getBannerSection("Wide Screen Section- 1").urls}
              bannerLoading={bannerLoading}
            />
          </div>
        </section>
      )}

      {/* 7. Featured Collections (Draggable Sliders) */}
      <div className="space-y-24 py-20">
        {sections.map((section, index) =>
          section.urls.length > 0 && (
            <section key={index} className="px-4 md:px-8 max-w-[1600px] mx-auto">
              <div className="flex items-center gap-4 mb-8">
                <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tight">{section.header}</h3>
                <div className="h-[1px] flex-1 bg-gray-200"></div>
              </div>
              <DraggableImageSlider
                images={section.urls}
                headers={section.header}
                bannerLoading={bannerLoading}
              />
            </section>
          )
        )}
      </div>

      {/* 8. Grid Banner Section */}
      {!bannerLoading && gridSection.urls.length > 0 && (
        <section className="py-20 bg-black text-white">
          <div className="max-w-[1600px] mx-auto px-4 md:px-8">
            {gridSection.header && (
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest mb-4">
                  <Star size={12} />
                  <span>Spotlight</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">
                  {gridSection.header}
                </h2>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {gridSection.urls.map((url, index) => (
                <Link
                  key={`grid_banner_${index}`}
                  to="/products"
                  className="group relative block overflow-hidden rounded-3xl aspect-[4/3] or-aspect-video"
                >
                  <LazyLoadImage
                    effect="blur"
                    src={url}
                    alt={`${gridSection.header}_${index}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    wrapperClassName="w-full h-full block"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                    <span className="px-8 py-4 bg-white text-black font-bold rounded-full transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2">
                      Explore <ArrowRight size={16} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. Trust Badges (Redesigned) */}
      <OurMotoData />


      <BackToTopButton />
      <WhatsAppButton />

      {/* Footer & Floating */}
      <Footer />
      <FloatingActions scrollableDivRef={scrollableDivRef} />
      <TrackVisite />
    </div>
  );
};

// Internal Trust Badge Component
const OurMotoData = () => {
  const { WebsiteDisclaimer } = useSelector((state) => state.websiteDisclaimer);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchWebsiteDisclaimer());
  }, [dispatch]);

  const defaultDisclaimers = [
    { icon: Truck, title: "Free Shipping", desc: "On all orders over ₹750" },
    { icon: Headphones, title: "24/7 Support", desc: "Dedicated support team" },
    { icon: RefreshCcw, title: "Easy Returns", desc: "30-day return policy" },
    { icon: ShieldCheck, title: "Secure Payment", desc: "100% secure checkout" },
  ];

  return (
    <section className="py-20 border-t border-gray-100">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {(WebsiteDisclaimer && WebsiteDisclaimer.length > 0 ? WebsiteDisclaimer : defaultDisclaimers).map((item, index) => {
            const Icon = item.icon || Truck; // Fallback
            return (
              <div key={index} className="flex flex-col items-center text-center group">
                <div className="mb-6 p-4 rounded-full bg-gray-50 group-hover:bg-black group-hover:text-white transition-all duration-300">
                  {item.iconImage ? (
                    <LazyLoadImage
                      src={item.iconImage}
                      alt={item.header}
                      className="w-8 h-8 object-contain filter group-hover:invert transition-all"
                    />
                  ) : (
                    <Icon size={24} strokeWidth={1.5} />
                  )}
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-2">
                  {item.header || item.title}
                </h3>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  {item.body || item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Home;
