"use client";

import React, { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";

interface SafeImageProps extends Omit<ImageProps, "onError" | "src"> {
  src?: string | null;
  fallback?: React.ReactNode;
}

export function SafeImage({ src, fallback, alt, ...props }: SafeImageProps) {
  const [error, setError] = useState(false);

  // Reset error state if src changes
  useEffect(() => {
    setError(false);
  }, [src]);

  if (error || !src) {
    return <>{fallback || null}</>;
  }

  return (
    <Image
      src={src}
      alt={alt || ""}
      onError={() => setError(true)}
      {...props}
    />
  );
}
