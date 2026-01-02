import { cn } from "../../lib/utils";

function Skeleton({
    className,
    width = "100%",
    height = "20px",
    circle = false,
    ...props
}) {
    return (
        <div
            className={cn(
                "animate-pulse bg-primary/10 rounded-md",
                circle ? "rounded-full" : "",
                className
            )}
            style={{ width, height }}
            {...props}
        />
    );
}

export { Skeleton };