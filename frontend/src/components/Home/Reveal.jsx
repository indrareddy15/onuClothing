import React from "react";
import useReveal from "./hooks/useReveal";

/**
 * Wraps children in a scroll-reveal animation (B-lite). Presentation only.
 *
 * Usage:
 *   <Reveal as="section" delay={120} className="...">...</Reveal>
 *
 * @param {object} props
 * @param {React.ElementType} [props.as='div'] - Element/component to render.
 * @param {number} [props.delay=0] - Stagger delay in ms.
 * @param {string} [props.className]
 * @param {number} [props.threshold]
 */
const Reveal = ({ as: Tag = "div", delay = 0, threshold, className = "", children, ...rest }) => {
    const { ref, isVisible } = useReveal(threshold !== undefined ? { threshold } : undefined);

    return (
        <Tag
            ref={ref}
            className={`reveal-init ${isVisible ? "reveal-in" : ""} ${className}`}
            style={{ transitionDelay: isVisible ? `${delay}ms` : "0ms" }}
            {...rest}
        >
            {children}
        </Tag>
    );
};

export default Reveal;
