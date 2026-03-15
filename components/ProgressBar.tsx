import { calculateProgress } from "@/lib/utils";

export default function ProgressBar({
  raised,
  goal,
  height = "h-1.5",
  animate = true,
}: {
  raised: number;
  goal: number;
  height?: string;
  animate?: boolean;
}) {
  const pct = calculateProgress(raised, goal);
  return (
    <div
      className={`rounded-full bg-gray-200 ${height} overflow-hidden`}
      role="progressbar"
      aria-valuenow={raised}
      aria-valuemin={0}
      aria-valuemax={goal}
      aria-label={`${pct}% funded`}
    >
      <div
        className={`h-full rounded-full bg-primary ${animate ? "transition-all duration-500 ease-out" : ""}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
