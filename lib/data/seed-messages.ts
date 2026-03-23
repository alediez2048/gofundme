export interface SeedMessage {
  id: string;
  senderId: string;
  text: string;
  sentAt: string;
  read?: boolean;
}

export interface SeedMessageThread {
  id: string;
  participantIds: string[];
  communityId?: string;
  fundraiserId?: string;
  messages: SeedMessage[];
}

export const seedMessageThreads: SeedMessageThread[] = [
  {
    id: "thread-1",
    participantIds: ["user-6", "user-1"],
    communityId: "comm-1",
    fundraiserId: "fund-1",
    messages: [
      {
        id: "msg-1",
        senderId: "user-1",
        text: "Thanks again for donating to the wildfire alerts fundraiser. We are hosting another volunteer training this week if you want to join.",
        sentAt: "2026-03-20T17:30:00Z",
        read: true,
      },
      {
        id: "msg-2",
        senderId: "user-6",
        text: "I would love to. Send me the details and I can help share it with a few people in Watch Duty too.",
        sentAt: "2026-03-20T18:10:00Z",
        read: true,
      },
      {
        id: "msg-3",
        senderId: "user-1",
        text: "Perfect. I will send the volunteer sheet tonight.",
        sentAt: "2026-03-21T09:05:00Z",
        read: false,
      },
    ],
  },
  {
    id: "thread-2",
    participantIds: ["user-6", "user-4"],
    communityId: "comm-2",
    fundraiserId: "fund-4",
    messages: [
      {
        id: "msg-4",
        senderId: "user-4",
        text: "We just posted a new update for the Martinez family. Thank you for staying close to this campaign.",
        sentAt: "2026-03-21T13:20:00Z",
        read: false,
      },
      {
        id: "msg-5",
        senderId: "user-6",
        text: "Of course. Please let me know if there is anything specific the family still needs.",
        sentAt: "2026-03-21T14:02:00Z",
        read: true,
      },
    ],
  },
  {
    id: "thread-3",
    participantIds: ["user-6", "user-3"],
    communityId: "comm-1",
    fundraiserId: "fund-2",
    messages: [
      {
        id: "msg-6",
        senderId: "user-3",
        text: "The first radios arrived. I posted photos on the feed, but wanted to message you directly because you asked about the equipment list.",
        sentAt: "2026-03-22T08:45:00Z",
        read: false,
      },
      {
        id: "msg-7",
        senderId: "user-3",
        text: "Happy to share the supplier details too if you are helping another organizer compare costs.",
        sentAt: "2026-03-22T08:47:00Z",
        read: false,
      },
    ],
  },
];

export function getThreadsForUser(userId: string): SeedMessageThread[] {
  return seedMessageThreads
    .filter((thread) => thread.participantIds.includes(userId))
    .sort((a, b) => {
      const aLatest = a.messages[a.messages.length - 1]?.sentAt ?? "";
      const bLatest = b.messages[b.messages.length - 1]?.sentAt ?? "";
      return new Date(bLatest).getTime() - new Date(aLatest).getTime();
    });
}

export function getUnreadMessageCount(userId: string): number {
  return getThreadsForUser(userId).reduce(
    (count, thread) =>
      count +
      thread.messages.filter(
        (message) => message.senderId !== userId && message.read === false
      ).length,
    0
  );
}
