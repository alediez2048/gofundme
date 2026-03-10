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
      <h1 className="text-3xl font-bold text-stone-900 tracking-tight">
        Communities
      </h1>
      <p className="text-stone-600 max-w-xl">
        Explore causes and support fundraisers within each community.
      </p>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {communities.map((c) => (
          <li key={c.id}>
            <Link
              href={`/communities/${c.slug}`}
              className="block overflow-hidden rounded-xl border border-stone-200 bg-white transition-colors hover:border-primary/30"
            >
              <div className="relative aspect-[21/9] w-full bg-stone-200">
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
                <h2 className="font-semibold text-stone-900">{c.name}</h2>
                <span className="mt-1 inline-block rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-700">
                  {c.causeCategory}
                </span>
                <p className="mt-2 text-sm text-stone-600 line-clamp-2">
                  {c.description}
                </p>
                <dl className="mt-3 flex gap-4 text-sm">
                  <div>
                    <dt className="text-stone-500">Raised</dt>
                    <dd className="font-semibold text-stone-900">
                      {formatCurrency(c.totalRaised)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-stone-500">Fundraisers</dt>
                    <dd className="font-semibold text-stone-900">
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
