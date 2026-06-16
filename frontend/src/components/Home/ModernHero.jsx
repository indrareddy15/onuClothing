import React, { useEffect, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
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
    const navigate = useNavigate();

    useEffect(() => {
        // Respect reduced-motion: show final state instantly.
        const prefersReduced =
            window.matchMedia &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReduced) {
            setIsVisible(true);
            return;
        }
        const id = requestAnimationFrame(() => setIsVisible(true));
        return () => cancelAnimationFrame(id);
    }, []);

    const step = (delay) =>
        `transition-all duration-1000 ${delay} transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`;

    return (
        <section
            className="relative w-full h-[88vh] min-h-[620px] md:min-h-[760px] flex items-center justify-center overflow-hidden bg-neutral-950 text-white"
            aria-label="Featured collection"
        >
            {/* Refined monochrome backdrop: layered neutral radial washes (no off-brand neon) */}
            <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
                <div className="absolute -top-[25%] left-1/2 -translate-x-1/2 w-[90vw] h-[90vw] bg-white/[0.06] rounded-full blur-[130px]" />
                <div className="absolute bottom-[-30%] -left-[10%] w-[60vw] h-[60vw] bg-white/[0.04] rounded-full blur-[120px]" />
                {/* Fine vignette for depth */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)]" />
                {/* Self-hosted grain */}
                <div
                    className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
                    style={{ backgroundImage: `url("${GRAIN}")`, backgroundSize: "160px 160px" }}
                />
            </div>

            {/* Content */}
            <div className="container relative z-10 mx-auto px-6 md:px-12 flex flex-col items-center text-center">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 ${step("delay-0")}`}>
                    <Sparkles size={14} className="text-white" aria-hidden="true" />
                    <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-neutral-200">
                        New Collection
                    </span>
                </div>

                <h1 className="mb-8">
                    <span className={`block text-5xl sm:text-6xl md:text-8xl lg:text-[9rem] font-black tracking-tighter leading-[0.9] ${step("delay-100")}`}>
                        REDEFINE
                    </span>
                    <span
                        className={`block text-5xl sm:text-6xl md:text-8xl lg:text-[9rem] font-black tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 ${step("delay-300")}`}
                    >
                        YOUR STYLE
                    </span>
                </h1>

                <p className={`max-w-xl text-base md:text-lg text-neutral-300 font-light leading-relaxed mb-12 ${step("delay-500")}`}>
                    The fusion of modern aesthetics and premium comfort —
                    designed for those who dare to stand out.
                </p>

                <div className={`flex flex-col sm:flex-row gap-4 ${step("delay-700")}`}>
                    <button
                        onClick={() => navigate("/products")}
                        className="group relative px-8 py-4 bg-white text-black rounded-full font-bold tracking-wide overflow-hidden transition-transform duration-300 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            Shop Collection <ArrowRight size={18} aria-hidden="true" />
                        </span>
                        <span className="absolute inset-0 bg-neutral-200 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                    </button>

                    <button
                        onClick={() => navigate("/about")}
                        className="px-8 py-4 bg-white/5 border border-white/15 backdrop-blur-sm text-white rounded-full font-bold tracking-wide hover:bg-white/10 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                    >
                        About Us
                    </button>
                </div>
            </div>

            {/* Scroll cue */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2" aria-hidden="true">
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-neutral-400">Scroll</span>
                <span className="block w-[1px] h-10 bg-gradient-to-b from-neutral-400 to-transparent" />
            </div>
        </section>
    );
};

export default ModernHero;
