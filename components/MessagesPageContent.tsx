"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useFundRightStore } from "@/lib/store";
import { getThreadsForUser } from "@/lib/data/seed-messages";
import Breadcrumbs from "./Breadcrumbs";
import PageTransition from "./PageTransition";
import UserAvatar from "./UserAvatar";

function formatMessageTime(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function MessagesPageContent() {
  const currentUserId = useFundRightStore((s) => s.currentUser);
  const users = useFundRightStore((s) => s.users);
  const communities = useFundRightStore((s) => s.communities);
  const fundraisers = useFundRightStore((s) => s.fundraisers);

  const threads = useMemo(
    () => (currentUserId ? getThreadsForUser(currentUserId) : []),
    [currentUserId]
  );

  const [activeThreadId, setActiveThreadId] = useState<string | null>(
    threads[0]?.id ?? null
  );

  useEffect(() => {
    if (!threads.length) {
      setActiveThreadId(null);
      return;
    }
    if (!activeThreadId || !threads.some((thread) => thread.id === activeThreadId)) {
      setActiveThreadId(threads[0].id);
    }
  }, [activeThreadId, threads]);

  const activeThread =
    threads.find((thread) => thread.id === activeThreadId) ?? threads[0] ?? null;

  if (!currentUserId) {
    return (
      <PageTransition>
        <div className="space-y-8">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Messages" }]} />
          <section className="rounded-xxl border border-neutral-border bg-surface-subtle px-6 py-16 text-center">
            <h1 className="text-heading-lg text-heading">Sign in to view messages</h1>
            <p className="mt-2 text-body-md text-supporting">
              Messaging is available in the signed-in feed experience.
            </p>
          </section>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-8">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Messages" }]} />

        <div>
          <h1 className="text-display-sm text-heading">Messages</h1>
          <p className="mt-2 text-body-md text-supporting">
            Stay close to organizers, communities, and the campaigns you support.
          </p>
        </div>

        <section className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="overflow-hidden rounded-xxl border border-neutral-border bg-white shadow-soft">
            <div className="border-b border-neutral-border px-5 py-4">
              <h2 className="text-heading-sm text-heading">Inbox</h2>
            </div>
            <div className="divide-y divide-neutral-border">
              {threads.map((thread) => {
                const partnerId = thread.participantIds.find(
                  (id) => id !== currentUserId
                );
                const partner = partnerId ? users[partnerId] : null;
                const latestMessage = thread.messages[thread.messages.length - 1];
                const unreadCount = thread.messages.filter(
                  (message) =>
                    message.senderId !== currentUserId && message.read === false
                ).length;

                return (
                  <button
                    key={thread.id}
                    type="button"
                    onClick={() => setActiveThreadId(thread.id)}
                    className={`flex w-full items-start gap-3 px-5 py-4 text-left transition-colors ${
                      activeThread?.id === thread.id
                        ? "bg-brand-subtle/70"
                        : "hover:bg-surface-subtle"
                    }`}
                  >
                    <UserAvatar
                      src={partner?.avatar}
                      name={partner?.name}
                      size={44}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="truncate text-body-md font-bold text-heading">
                          {partner?.name ?? "Conversation"}
                        </p>
                        {latestMessage && (
                          <span className="shrink-0 text-body-xs text-supporting">
                            {formatMessageTime(latestMessage.sentAt)}
                          </span>
                        )}
                      </div>
                      {thread.communityId && communities[thread.communityId] && (
                        <p className="mt-0.5 text-body-xs text-supporting">
                          {communities[thread.communityId].name}
                        </p>
                      )}
                      {latestMessage && (
                        <p className="mt-1 line-clamp-2 text-body-sm text-supporting">
                          {latestMessage.text}
                        </p>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-brand px-2 text-body-xs font-bold text-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="overflow-hidden rounded-xxl border border-neutral-border bg-white shadow-soft">
            {activeThread ? (
              <>
                {(() => {
                  const partnerId = activeThread.participantIds.find(
                    (id) => id !== currentUserId
                  );
                  const partner = partnerId ? users[partnerId] : null;
                  const community = activeThread.communityId
                    ? communities[activeThread.communityId]
                    : null;
                  const fundraiser = activeThread.fundraiserId
                    ? fundraisers[activeThread.fundraiserId]
                    : null;

                  return (
                    <>
                      <div className="border-b border-neutral-border px-5 py-4">
                        <div className="flex items-center gap-3">
                          <UserAvatar
                            src={partner?.avatar}
                            name={partner?.name}
                            size={48}
                          />
                          <div className="min-w-0">
                            <p className="text-heading-sm text-heading">
                              {partner?.name ?? "Conversation"}
                            </p>
                            <p className="text-body-sm text-supporting">
                              {community?.name ?? "Direct message"}
                            </p>
                          </div>
                        </div>
                        {fundraiser && (
                          <div className="mt-4 rounded-xl bg-surface-subtle px-4 py-3">
                            <p className="text-body-xs font-bold uppercase tracking-wide text-supporting">
                              Related fundraiser
                            </p>
                            <Link
                              href={`/f/${fundraiser.slug}`}
                              className="mt-1 block text-body-md font-bold text-heading hover:text-brand"
                            >
                              {fundraiser.title}
                            </Link>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4 px-5 py-5">
                        {activeThread.messages.map((message) => {
                          const isOwn = message.senderId === currentUserId;

                          return (
                            <div
                              key={message.id}
                              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                                  isOwn
                                    ? "bg-brand-strong text-white"
                                    : "bg-surface-subtle text-heading"
                                }`}
                              >
                                <p className="text-body-md leading-relaxed">
                                  {message.text}
                                </p>
                                <p
                                  className={`mt-2 text-body-xs ${
                                    isOwn ? "text-white/80" : "text-supporting"
                                  }`}
                                >
                                  {formatMessageTime(message.sentAt)}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="border-t border-neutral-border px-5 py-4">
                        <div className="rounded-pill border border-neutral-border bg-surface-subtle px-4 py-3 text-body-sm text-supporting">
                          Reply composer coming next. This inbox is seeded for the demo.
                        </div>
                      </div>
                    </>
                  );
                })()}
              </>
            ) : (
              <div className="px-6 py-16 text-center">
                <p className="text-heading-sm text-heading">No messages yet</p>
                <p className="mt-2 text-body-md text-supporting">
                  New conversations with organizers and communities will appear here.
                </p>
              </div>
            )}
          </section>
        </section>
      </div>
    </PageTransition>
  );
}
