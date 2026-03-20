"use client";

import Image from "next/image";
import Link from "next/link";
import { useFundRightStore } from "@/lib/store";
import { BLUR_DATA_URL, formatCurrency } from "@/lib/utils";

export default function CommunitiesIndexPage() {
  const communitiesMap = useFundRightStore((s) => s.communities);
  const communities = Object.values(communitiesMap);

  return (
    <div className="space-y-8">
      <h1 className="text-display-sm text-heading">
        Communities
      </h1>
      <p className="text-body-md text-supporting max-w-xl">
        Explore causes and support fundraisers within each community.
      </p>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {communities.map((c) => (
          <li key={c.id}>
            <Link
              href={`/communities/${c.slug}`}
              className="hrt-card block hover:shadow-medium"
            >
              <div className="hrt-card-image relative aspect-[21/9] w-full bg-surface-medium">
                <Image
                  src={c.bannerImageUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                />
              </div>
              <div className="p-4">
                <h2 className="text-heading-sm text-heading">{c.name}</h2>
                <span className="hrt-tag-brand mt-1">
                  {c.causeCategory}
                </span>
                <p className="mt-2 text-body-sm text-supporting line-clamp-2">
                  {c.description}
                </p>
                <dl className="mt-3 flex gap-4 text-body-sm">
                  <div>
                    <dt className="text-supporting">Raised</dt>
                    <dd className="font-bold text-heading">
                      {formatCurrency(c.totalRaised)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-supporting">Fundraisers</dt>
                    <dd className="font-bold text-heading">
                      {c.fundraiserCount}
                    </dd>
                  </div>
                </dl>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
