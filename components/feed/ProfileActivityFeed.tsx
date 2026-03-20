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
    <div className="space-y-6 mt-6">
      {/* Giving streak + cause identity */}
      {(user.givingStreak || user.causeIdentity) && (
        <div className="flex gap-3 flex-wrap">
          {user.givingStreak && user.givingStreak > 0 && (
            <div className="bg-gfm-green-light rounded-card-sm px-3 py-2 flex items-center gap-2">
              <span className="text-lg">🔥</span>
              <div>
                <p className="text-sm font-bold text-feed-text-heading">{user.givingStreak}-month streak</p>
                <p className="text-[11px] text-feed-text-secondary">Consecutive giving</p>
              </div>
            </div>
          )}
          {user.causeIdentity && (
            <div className="bg-gfm-green-light rounded-card-sm px-3 py-2 flex items-center gap-2">
              <span className="text-lg">💚</span>
              <div>
                <p className="text-sm font-bold text-feed-text-heading">{user.causeIdentity}</p>
                <p className="text-[11px] text-feed-text-secondary">Primary cause</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Impact summary */}
      {user.impactSummary && (
        <div className="bg-feed-bg-card border border-black/[0.06] rounded-card shadow-card p-4">
          <h3 className="text-xs font-semibold text-feed-text-secondary uppercase tracking-wider mb-2">Impact Summary</h3>
          <p className="text-sm text-feed-text-body leading-relaxed">{user.impactSummary}</p>
        </div>
      )}

      {/* Activity feed */}
      {userEvents.length > 0 && (
        <div>
          <h3 className="text-heading-sm text-heading mb-3">Activity</h3>
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
        <div className="bg-feed-bg-card border border-black/[0.06] rounded-card shadow-card p-4">
          <h3 className="text-xs font-semibold text-feed-text-secondary uppercase tracking-wider mb-3">
            People like you also supported
          </h3>
          <div className="space-y-3">
            {recommendations.map((rec) => (
              <div key={rec.fundraiser.id}>
                <FundraiserMiniCard fundraiserId={rec.fundraiser.id} />
                <p className="text-[11px] text-feed-text-tertiary mt-1">{rec.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
