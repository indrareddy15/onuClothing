import { cn } from "@/lib/utils";  // Assuming you already have this utility

function Skeleton({
  className,  // Allow additional classes to be passed
  width = "100%",  // Default width as 100%
  height = "20px",  // Default height as 20px (overridable)
  circle = false,  // Flag to make the skeleton circular (like a profile image)
  ...props
}) {
  return (
    <div
      className={cn(
        "animate-pulse bg-primary/10 rounded-md", // Skeleton style classes
        circle ? "rounded-full" : "", // Apply rounded-full if it's a circle skeleton
        className // Allow custom classes
      )}
      style={{ width, height }} // Apply dynamic width and height
      {...props} // Spread other props like id, data, etc.
    />
  );
}

export { Skeleton };
