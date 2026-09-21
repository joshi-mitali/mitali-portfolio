import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface CursorTrailProps extends React.HTMLAttributes<HTMLDivElement> {
  images: string[];
  distance?: number;
  duration?: number;
  imageSize?: number;
}

export function CursorTrail({
  className,
  images,
  distance = 120,
  duration = 850,
  imageSize = 48,
  ...props
}: CursorTrailProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !images.length) return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return;

    const tiles = Array.from(container.querySelectorAll<HTMLElement>(".flair-image"));
    let currentIndex = 0;
    let lastX = 0;
    let lastY = 0;
    let isInitial = true;

    const spawnImage = (x: number, y: number) => {
      const image = tiles[currentIndex];
      if (!image) return;
      currentIndex = (currentIndex + 1) % tiles.length;
      image.getAnimations().forEach((animation) => animation.cancel());

      const targetX = x - imageSize / 2;
      const targetY = y - imageSize / 2;
      const rotation = Math.random() * 12 - 6;
      image.animate(
        [
          { opacity: 0, transform: `translate(${targetX}px, ${targetY}px) scale(.72) rotate(0deg)` },
          { opacity: .72, transform: `translate(${targetX}px, ${targetY}px) scale(1) rotate(${rotation / 2}deg)`, offset: .18 },
          { opacity: 0, transform: `translate(${targetX}px, ${targetY + 46}px) scale(.88) rotate(${rotation}deg)` },
        ],
        { duration, easing: "cubic-bezier(.16,1,.3,1)", fill: "forwards" },
      );
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const currentX = event.clientX - rect.left;
      const currentY = event.clientY - rect.top;
      const inBounds = currentX >= 0 && currentX <= rect.width && currentY >= 0 && currentY <= rect.height;
      if (!inBounds) {
        isInitial = true;
        return;
      }
      if (isInitial) {
        lastX = currentX;
        lastY = currentY;
        isInitial = false;
        return;
      }

      const travelled = Math.hypot(currentX - lastX, currentY - lastY);
      if (travelled < distance) return;
      const count = Math.floor(travelled / distance);
      for (let index = 1; index <= count; index += 1) {
        const progress = (index * distance) / travelled;
        spawnImage(lastX + (currentX - lastX) * progress, lastY + (currentY - lastY) * progress);
      }
      const finalProgress = (count * distance) / travelled;
      lastX += (currentX - lastX) * finalProgress;
      lastY += (currentY - lastY) * finalProgress;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [distance, duration, imageSize, images]);

  return (
    <div className={cn("pointer-events-none absolute inset-0 z-30 overflow-hidden", className)} {...props}>
      <div ref={containerRef} className="absolute inset-0">
        {images.map((src, index) => (
          <img
            key={`${src}-${index}`}
            src={src}
            alt=""
            aria-hidden="true"
            className="flair-image pointer-events-none absolute left-0 top-0 origin-center object-cover"
            style={{ width: imageSize, height: imageSize, opacity: 0, transform: "translate(-100%, -100%)" }}
          />
        ))}
      </div>
    </div>
  );
}

export default CursorTrail;
