import { useEffect, useRef, useState } from "react";

/**
 * Reveal-on-scroll hook (B-lite). Uses IntersectionObserver — no dependencies.
 *
 * - Animates an element in once, the first time it enters the viewport.
 * - Fully respects `prefers-reduced-motion`: in that case the element is
 *   marked visible immediately and no observer is attached.
 * - Gracefully degrades if IntersectionObserver is unavailable (shows content).
 *
 * @param {object} [options]
 * @param {number} [options.threshold=0.15] - Visibility ratio to trigger.
 * @param {string} [options.rootMargin='0px 0px -10% 0px'] - Trigger a bit early.
 * @returns {{ref: React.RefObject, isVisible: boolean}}
 */
export default function useReveal({ threshold = 0.15, rootMargin = "0px 0px -10% 0px" } = {}) {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const prefersReduced =
            typeof window !== "undefined" &&
            window.matchMedia &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (prefersReduced || typeof IntersectionObserver === "undefined") {
            setIsVisible(true);
            return;
        }

        const node = ref.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.unobserve(entry.target); // animate once
                    }
                });
            },
            { threshold, rootMargin }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, [threshold, rootMargin]);

    return { ref, isVisible };
}
