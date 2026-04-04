import React from "react";

export type GreetingTextVariant =
  | "display-large"
  | "display-medium"
  | "display-small"
  | "headline-large"
  | "headline-medium"
  | "headline-small"
  | "title-large"
  | "title-medium"
  | "title-small"
  | "label-large"
  | "label-medium"
  | "label-small"
  | "body-large"
  | "body-medium"
  | "body-small";

export interface GreetingTextProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  variant?: GreetingTextVariant;
}

export const GreetingText: React.FC<GreetingTextProps> = ({
  children,
  className = "",
  as: Component = "span",
  variant,
}) => {
  const variantClass = variant ? variant : "";
  return (
    <Component
      className={`font-brand font-medium tracking-tight text-transparent bg-clip-text box-decoration-clone ${variantClass} ${className}`}
      style={{
        backgroundImage:
          "var(--Greeting-gradient, linear-gradient(77deg, var(--gem-sys-color--brand-blue, #4285F4) 6.99%, var(--gem-sys-color--brand-transition-blue-1, #1967D2) 45.46%, var(--gem-sys-color--brand-transition-blue-2, #1558B5) 88.2%))",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      {children}
    </Component>
  );
};
