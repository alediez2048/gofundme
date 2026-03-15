import Image from "next/image";
import { BLUR_DATA_URL } from "@/lib/utils";

export default function UserAvatar({
  src,
  size = 40,
  className = "",
}: {
  src: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`relative shrink-0 overflow-hidden rounded-full bg-gray-200 ${className}`}
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
      />
    </span>
  );
}
