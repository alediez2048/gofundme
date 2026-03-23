"use client";

import { useState } from "react";
import Image from "next/image";
import { BLUR_DATA_URL } from "@/lib/utils";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export default function UserAvatar({
  src,
  name,
  size = 40,
  className = "",
}: {
  src?: string;
  name?: string;
  size?: number;
  className?: string;
}) {
  const [imgError, setImgError] = useState(false);
  const showImage = src && !imgError;

  if (showImage) {
    return (
      <span
        className={`relative inline-flex shrink-0 overflow-hidden rounded-full bg-gray-200 ${className}`}
        style={{ width: size, height: size }}
      >
        <Image
          src={src}
          alt=""
          fill
          className="object-cover"
          sizes={`${size}px`}
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          onError={() => setImgError(true)}
        />
      </span>
    );
  }

  const initials = name ? getInitials(name) : "?";

  return (
    <span
      className={`flex items-center justify-center shrink-0 overflow-hidden rounded-full bg-emerald-200 text-emerald-800 font-semibold ${className}`}
      style={{ width: size, height: size, fontSize: Math.max(10, size * 0.4) }}
    >
      {initials}
    </span>
  );
}
