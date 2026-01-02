import React, { useEffect, useState } from "react";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ModernHero = () => {
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <section className="relative w-full h-screen min-h-[800px] flex items-center justify-center overflow-hidden bg-neutral-950 text-white">
            {/* Abstract Background Shapes */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-purple-900/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] bg-blue-900/20 rounded-full blur-[100px] animate-pulse delay-1000" />
                <div className="absolute -bottom-[20%] left-[20%] w-[50vw] h-[50vw] bg-pink-900/20 rounded-full blur-[100px] animate-pulse delay-2000" />

                {/* Grain Overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
            </div>

            {/* Content Container */}
            <div className="container relative z-10 mx-auto px-6 md:px-12 flex flex-col items-center text-center">

                {/* Badge */}
                <div
                    className={`
            inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8
            transition-all duration-1000 transform
            ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}
          `}
                >
                    <Sparkles size={14} className="text-yellow-400" />
                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-neutral-300">New Collection</span>
                </div>

                {/* Main Headline */}
                <h1 className="relative mb-8">
                    <span className={`
            block text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tighter leading-[0.9]
            bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/50
            transition-all duration-1000 delay-100 transform
            ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}
          `}>
                        REDEFINE
                    </span>
                    <span className={`
            block text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tighter leading-[0.9]
            text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400
            transition-all duration-1000 delay-300 transform
            ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}
          `}>
                        YOUR STYLE
                    </span>
                </h1>

                {/* Subtext */}
                <p className={`
          max-w-2xl text-lg md:text-xl text-neutral-400 font-light leading-relaxed mb-12
          transition-all duration-1000 delay-500 transform
          ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}
        `}>
                    Experience the fusion of modern aesthetics and premium comfort.
                    Designed for those who dare to stand out.
                </p>

                {/* CTA Buttons */}
                <div className={`
          flex flex-col sm:flex-row gap-6
          transition-all duration-1000 delay-700 transform
          ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}
        `}>
                    <button
                        onClick={() => navigate('/products')}
                        className="group relative px-8 py-4 bg-white text-black rounded-full font-bold tracking-wide overflow-hidden hover:scale-105 transition-transform duration-300"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Shop Collection <ArrowRight size={18} />
                        </span>
                        <div className="absolute inset-0 bg-neutral-200 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                    </button>

                    <button
                        onClick={() => navigate('/about')}
                        className="group px-8 py-4 bg-white/5 border border-white/10 backdrop-blur-sm text-white rounded-full font-bold tracking-wide hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
                    >
                        <Play size={16} fill="currentColor" />
                        About Us
                    </button>
                </div>
            </div>

            {/* Floating Elements / Decor */}
            <div className="absolute bottom-10 left-10 hidden md:block">
                <div className="text-xs font-mono text-neutral-500 rotate-90 origin-bottom-left">
                    SCROLL TO EXPLORE
                </div>
            </div>

            <div className="absolute bottom-10 right-10 hidden md:flex gap-4">
                {['IG', 'TW', 'FB'].map((social, i) => (
                    <span key={i} className="text-xs font-bold text-neutral-500 hover:text-white cursor-pointer transition-colors">
                        {social}
                    </span>
                ))}
            </div>
        </section>
    );
};

export default ModernHero;
