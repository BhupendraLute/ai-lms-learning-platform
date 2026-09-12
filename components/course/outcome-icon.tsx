import React from "react";

interface OutcomeIconProps {
  icon?: string;
  className?: string;
  size?: number;
}

export function OutcomeIcon({ icon, className = "", size = 44 }: OutcomeIconProps) {
  const iconKey = (icon || "layers").toLowerCase();

  // Stack of 3 diamond layers (App Router Foundations)
  if (iconKey === "layers" || iconKey === "stack") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 text-[#D95D39] ${className}`}
      >
        <path
          d="M22 6L36 14L22 22L8 14L22 6Z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 20L22 28L36 20"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 26L22 34L36 26"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // Database / Caching Drum Cylinder (Data Fetching & Caching)
  if (iconKey === "database" || iconKey === "data" || iconKey === "caching") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 text-[#D95D39] ${className}`}
      >
        <ellipse
          cx="22"
          cy="12"
          rx="14"
          ry="6"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <path
          d="M8 12V22C8 25.3137 14.268 28 22 28C29.732 28 36 25.3137 36 22V12"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <path
          d="M8 22V32C8 35.3137 14.268 38 22 38C29.732 38 36 35.3137 36 32V22"
          stroke="currentColor"
          strokeWidth="1.75"
        />
      </svg>
    );
  }

  // Speedometer / Gauge (Performance Optimization)
  if (iconKey === "gauge" || iconKey === "performance" || iconKey === "speed" || iconKey === "clock") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 text-[#D95D39] ${className}`}
      >
        <path
          d="M9 31C6.5 27 5.5 22 7 17C9 10.5 15 6 22 6C29 6 35 10.5 37 17C38.5 22 37.5 27 35 31"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <path
          d="M13 27L15 25"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <path
          d="M11 18L13.5 18.5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <path
          d="M22 10V13"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <path
          d="M30.5 18.5L33 18"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <path
          d="M29 25L31 27"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <path
          d="M22 28L18 20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="22" cy="28" r="2" fill="currentColor" />
      </svg>
    );
  }

  // Cloud (Deployment & Scaling)
  if (iconKey === "cloud" || iconKey === "deployment" || iconKey === "scaling") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 text-[#D95D39] ${className}`}
      >
        <path
          d="M13 32H31C35.4183 32 39 28.4183 39 24C39 19.8244 35.7997 16.398 31.7 16.035C30.5699 10.8878 26.0125 7 20.5 7C14.1487 7 9 12.1487 9 18.5C9 19.2312 9.0682 19.9464 9.19912 20.639C6.26257 21.8488 4.2 24.6853 4.2 28C4.2 32.4183 7.78172 36 12.2 36"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // Rocket
  if (iconKey === "rocket") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 text-[#D95D39] ${className}`}
      >
        <path
          d="M28 8C28 8 20 10 16 17C13 22.25 14 27 14 27L17 30C17 30 21.75 31 27 28C34 24 36 16 36 16C36 16 30 16 28 8Z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 27L8 31L13 36L17 30"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="26" cy="18" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M7 37L10 40"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // Workflow / Routing / Nodes
  if (iconKey === "workflow" || iconKey === "route" || iconKey === "routes") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 text-[#D95D39] ${className}`}
      >
        <rect
          x="6"
          y="7"
          width="12"
          height="10"
          rx="3"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <rect
          x="26"
          y="17"
          width="12"
          height="10"
          rx="3"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <rect
          x="6"
          y="27"
          width="12"
          height="10"
          rx="3"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <path
          d="M18 12H22C24.2091 12 26 13.7909 26 16V22"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <path
          d="M18 32H22C24.2091 32 26 30.2091 26 28V22"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // Shield
  if (iconKey === "shield" || iconKey === "security") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 text-[#D95D39] ${className}`}
      >
        <path
          d="M22 6L34 11V21C34 29 28.5 35.5 22 38C15.5 35.5 10 29 10 21V11L22 6Z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17 21L21 25L28 17"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // Puzzle
  if (iconKey === "puzzle") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 text-[#D95D39] ${className}`}
      >
        <path
          d="M10 16C10 16 14 16 14 14C14 12 12 10 14 8C16 6 18 8 20 8C22 8 22 16 22 16H30C32.2091 16 34 17.7909 34 20V28C34 28 34 32 32 32C30 32 28 30 26 32C24 34 26 36 26 38H14C11.7909 38 10 36.2091 10 34V26C10 26 12 26 12 24C12 22 10 22 10 20V16Z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // Code
  if (iconKey === "code") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 text-[#D95D39] ${className}`}
      >
        <path
          d="M15 15L7 22L15 29"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M29 15L37 22L29 29"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M25 12L19 32"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // Default / Fallback Layers
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 text-[#D95D39] ${className}`}
    >
      <path
        d="M22 6L36 14L22 22L8 14L22 6Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 20L22 28L36 20"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 26L22 34L36 26"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
