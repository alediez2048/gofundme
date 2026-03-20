"use client";

import FeedColumn from "./feed/FeedColumn";
import LeftSidebar from "./sidebar/LeftSidebar";
import RightSidebar from "./sidebar/RightSidebar";

export default function FeedPage() {
  return (
    <div className="min-h-screen bg-feed-bg-page">
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] lg:grid-cols-[240px_1fr_300px] gap-6">
          <LeftSidebar />
          <FeedColumn />
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}
