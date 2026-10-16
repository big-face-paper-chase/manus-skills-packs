import { type PropsWithChildren, useRef } from "react";

type MagneticProps = PropsWithChildren<{
  className?: string;
  strength?: number;
}>;

export function Magnetic({ children, className = "", strength = 5 }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);

  function canMove() {
    return (
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  function onPointerMove(event: React.PointerEvent<HTMLSpanElement>) {
    if (!canMove() || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
    const y = (event.clientY - (rect.top + rect.height / 2)) / rect.height;
    ref.current.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
  }

  function reset() {
    if (ref.current) ref.current.style.transform = "translate3d(0, 0, 0)";
  }

  return (
    <span
      ref={ref}
      className={`magnetic ${className}`}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
    >
      {children}
    </span>
  );
}
