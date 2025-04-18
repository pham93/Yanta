import React, { useEffect, useState } from "react";
import { Skeleton } from "./skeleton";
import { cn } from "~/lib/utils";

interface ImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

const Img = React.forwardRef<HTMLImageElement, ImgProps>(
  ({ className, src, ...props }, ref) => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
      if (!src) return;
      const img = new Image();
      img.src = src;
      // image from cache.
      if (img.complete) {
        setLoaded(true);
        return;
      }
      img.onload = () => setLoaded(true);
      img.onerror = () => setLoaded(true);

      return () => {
        img.onload = null;
        img.onerror = null;
      };
    }, [src]);

    return (
      <>
        {loaded ? (
          <img
            className={cn(className, { hidden: !loaded })}
            alt=""
            src={src}
            ref={ref}
            {...props}
          />
        ) : (
          <Skeleton className={cn(className, "w-auto")} />
        )}
      </>
    );
  }
);
Img.displayName = "Img";

export { Img };
