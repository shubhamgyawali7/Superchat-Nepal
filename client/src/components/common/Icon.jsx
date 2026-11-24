"use client";

import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";

export default function Icon({ icon, size = 18, className = "", strokeWidth = 1.5, color = "currentColor", ...props }) {
  if (!icon) return null;
  return (
    <span className={`inline-flex items-center justify-center shrink-0 ${className}`}>
      <HugeiconsIcon icon={icon} size={size} strokeWidth={strokeWidth} color={color} {...props} />
    </span>
  );
}

