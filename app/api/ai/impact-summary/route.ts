import { NextResponse } from "next/server";
import { generateImpactSummary } from "@/lib/ai/impact-summary";
import { seed } from "@/lib/data";

function toRecord<T extends { id: string }>(arr: T[]): Record<string, T> {
  return Object.fromEntries(arr.map((e) => [e.id, e]));
}

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    if (!userId || typeof userId !== "string") {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const user = seed.users.find((u) => u.id === userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const result = await generateImpactSummary(
      user,
      seed.donations,
      toRecord(seed.fundraisers),
      toRecord(seed.communities)
    );

    return NextResponse.json({
      text: result.text,
      isAiGenerated: result.isAiGenerated,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate impact summary" },
      { status: 500 }
    );
  }
}
