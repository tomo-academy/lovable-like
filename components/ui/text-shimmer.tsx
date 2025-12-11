import { CSSProperties, FC, ReactNode } from "react";

interface TextShimmerProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  spread?: number;
}

export const TextShimmer: FC<TextShimmerProps> = ({
  children,
  className = "",
  duration = 2,
  spread = 2,
}) => {
  return (
    <span
      className={`inline-block bg-clip-text text-transparent bg-gradient-to-r from-gray-500 via-gray-900 to-gray-500 dark:from-gray-400 dark:via-white dark:to-gray-400 animate-shimmer bg-[length:200%_100%] ${className}`}
      style={
        {
          "--shimmer-duration": `${duration}s`,
          "--shimmer-spread": `${spread}`,
        } as CSSProperties
      }
    >
      {children}
    </span>
  );
};
