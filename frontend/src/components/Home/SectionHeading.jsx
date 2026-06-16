import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

/**
 * Consistent section heading used across the homepage (Concept A).
 * Presentation only — no data/logic.
 *
 * @param {object} props
 * @param {string} [props.eyebrow]        - Small label above the title.
 * @param {React.ReactNode} [props.eyebrowIcon] - Optional icon for the eyebrow chip.
 * @param {boolean} [props.live]          - Show a pulsing "live" dot in the eyebrow.
 * @param {string} props.title            - Main heading text.
 * @param {string} [props.description]    - Supporting paragraph.
 * @param {'left'|'center'} [props.align='left']
 * @param {'light'|'dark'} [props.tone='light'] - For dark sections.
 * @param {{to:string,label:string}} [props.action] - Optional CTA link.
 */
const SectionHeading = ({
    eyebrow,
    eyebrowIcon,
    live = false,
    title,
    description,
    align = "left",
    tone = "light",
    action,
}) => {
    const isCenter = align === "center";
    const isDark = tone === "dark";

    const titleColor = isDark ? "text-white" : "text-gray-900";
    const descColor = isDark ? "text-white/70" : "text-gray-600";
    const eyebrowChip = isDark
        ? "bg-white/10 border border-white/20 text-white"
        : "bg-gray-900 text-white";

    return (
        <div
            className={`mb-10 md:mb-14 flex flex-col gap-6 ${
                isCenter
                    ? "items-center text-center"
                    : "md:flex-row md:items-end md:justify-between"
            }`}
        >
            <div className={isCenter ? "flex flex-col items-center" : ""}>
                {eyebrow && (
                    <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.18em] mb-4 ${eyebrowChip}`}
                    >
                        {live && <span className="onu-live-dot w-1.5 h-1.5 rounded-full" aria-hidden="true" />}
                        {eyebrowIcon}
                        <span>{eyebrow}</span>
                    </span>
                )}
                <h2
                    className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter uppercase leading-[0.95] ${titleColor}`}
                >
                    {title}
                </h2>
                {description && (
                    <p className={`mt-4 max-w-xl text-sm md:text-base font-medium ${descColor} ${isCenter ? "mx-auto" : ""}`}>
                        {description}
                    </p>
                )}
            </div>

            {action && (
                <Link
                    to={action.to}
                    className={`group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider pb-1 border-b transition-colors ${
                        isDark
                            ? "text-white border-white hover:text-white/70 hover:border-white/70"
                            : "text-gray-900 border-gray-900 hover:text-gray-600 hover:border-gray-600"
                    }`}
                >
                    {action.label}
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
            )}
        </div>
    );
};

export default SectionHeading;
