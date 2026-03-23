"use client";

import { useFundRightStore } from "@/lib/store";
import { getRecommendations } from "@/lib/feed/recommendations";
import FeedCard from "./FeedCard";
import FundraiserMiniCard from "./FundraiserMiniCard";

interface ProfileActivityFeedProps {
  userId: string;
}

export default function ProfileActivityFeed({ userId }: ProfileActivityFeedProps) {
  const currentUserId = useFundRightStore((s) => s.currentUser);
  const feedEvents = useFundRightStore((s) => s.feedEvents);
  const state = useFundRightStore((s) => s);
  const user = useFundRightStore((s) => s.users[userId]);

  if (!user) return null;

  // Filter events where this user is the actor
  const userEvents = Object.values(feedEvents)
    .filter((e) => e.actorId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  // Get recommendations for this user
  const recommendations = getRecommendations(userId, state, 3);

  return (
    <div className="gfm-feed-view mt-6 space-y-6">
      {/* Giving streak + cause identity */}
      {(user.givingStreak || user.causeIdentity) && (
        <div className="flex gap-3 flex-wrap">
          {user.givingStreak && user.givingStreak > 0 && (
            <div className="gfm-feed-badge px-4 py-2">
              <span className="text-lg">🔥</span>
              <div>
                <p className="text-[16px] leading-6 text-[#232323]">{user.givingStreak}-month streak</p>
                <p className="text-[14px] leading-5 text-[#232323]">Consecutive giving</p>
              </div>
            </div>
          )}
          {user.causeIdentity && (
            <div className="gfm-feed-badge px-4 py-2">
              <span className="text-lg">💚</span>
              <div>
                <p className="text-[16px] leading-6 text-[#232323]">{user.causeIdentity}</p>
                <p className="text-[14px] leading-5 text-[#232323]">Primary cause</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Impact summary */}
      {user.impactSummary && (
        <div className="gfm-feed-card p-4">
          <h3 className="gfm-feed-meta mb-2 uppercase tracking-[0.08em]">Impact Summary</h3>
          <p className="gfm-feed-body">{user.impactSummary}</p>
        </div>
      )}

      {/* Activity feed */}
      {userEvents.length > 0 && (
        <div>
          <h3 className="gfm-feed-heading-md mb-3 text-[#232323]">Activity</h3>
          <div className="space-y-4">
            {userEvents.map((event) => (
              <FeedCard
                key={event.id}
                event={event}
                currentUserId={currentUserId ?? ""}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="gfm-feed-card p-4">
          <h3 className="gfm-feed-meta mb-3 uppercase tracking-[0.08em]">
            People like you also supported
          </h3>
          <div className="space-y-3">
            {recommendations.map((rec) => (
              <div key={rec.fundraiser.id}>
                <FundraiserMiniCard fundraiserId={rec.fundraiser.id} />
                <p className="gfm-feed-meta mt-2">{rec.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
