"use client";

import FeedColumn from "./feed/FeedColumn";
import LeftSidebar from "./sidebar/LeftSidebar";
import RightSidebar from "./sidebar/RightSidebar";

export default function FeedPage() {
  return (
    <div className="gfm-feed-view min-h-screen bg-white">
      <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] lg:grid-cols-[240px_1fr_300px] gap-6">
          <LeftSidebar />
          <FeedColumn />
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}
