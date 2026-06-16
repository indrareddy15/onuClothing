import React from "react";
import { Clock } from "lucide-react";
import { useSessionStorage } from "../../Contaxt/SessionStorageContext";
import ModernProductCard from "./ModernProductCard";
import SectionHeading from "./SectionHeading";

/**
 * "Recently Viewed" rail (Concept C — conversion).
 *
 * Reuses products already tracked in SessionStorageContext
 * (`sessionRecentlyViewProducts`) and the existing ModernProductCard.
 * Renders nothing when there is no history, so it never adds empty space.
 * No new data fetching or app logic.
 */
const RecentlyViewedRail = () => {
    const { sessionRecentlyViewProducts } = useSessionStorage();

    const items = Array.isArray(sessionRecentlyViewProducts)
        ? sessionRecentlyViewProducts.filter((p) => p && p._id)
        : [];

    if (items.length === 0) return null;

    return (
        <section className="py-16 md:py-24 px-4 md:px-8 max-w-[1600px] mx-auto">
            <SectionHeading
                eyebrow="Pick up where you left off"
                eyebrowIcon={<Clock size={12} />}
                title="Recently Viewed"
                align="left"
            />

            <div
                className="flex overflow-x-auto gap-6 pb-6 scrollbar-hide snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0"
                role="list"
                aria-label="Recently viewed products"
            >
                {items.slice(0, 10).map((product, index) => (
                    <div
                        key={product._id || index}
                        role="listitem"
                        className="min-w-[220px] sm:min-w-[260px] md:min-w-[300px] snap-start"
                    >
                        <ModernProductCard product={product} />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default RecentlyViewedRail;
