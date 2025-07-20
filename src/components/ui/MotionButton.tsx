import * as React from "react";
import { cn } from "@/lib/utils";
import { useMotionTemplate, useMotionValue, motion } from "motion/react";

interface MotionButtonProps {
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

export function MotionButton({
  selected,
  onClick,
  className,
  children,
}: MotionButtonProps) {
  const radius = 100;
  const [visible, setVisible] = React.useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    const { currentTarget, clientX, clientY } = e;
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.button
      type="button"
      style={{
        background: useMotionTemplate`
          radial-gradient(
            ${
              visible ? radius + "px" : "0px"
            } circle at ${mouseX}px ${mouseY}px,
            #b7410e33,
            transparent 80%
          )
        `,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onClick={onClick}
      className={cn(
        "relative overflow-hidden w-32 h-24 flex flex-col items-center justify-center rounded-lg border shadow-sm group transition-all duration-200 text-base select-none",
        selected
          ? "border-[#b7410e] ring-2 ring-[#ff6f3c] scale-105 bg-[#fff7f3] dark:bg-[#181012]"
          : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#222] hover:border-[#b7410e]/50",
        className
      )}
    >
      {/* Button content always above bg */}
      <span className="relative z-10 pointer-events-none">{children}</span>
    </motion.button>
  );
}
