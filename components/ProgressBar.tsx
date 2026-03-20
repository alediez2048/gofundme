import { calculateProgress } from "@/lib/utils";

export default function ProgressBar({
  raised,
  goal,
  height = "h-2",
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
      className={`hrt-progress-track ${height}`}
      role="progressbar"
      aria-valuenow={raised}
      aria-valuemin={0}
      aria-valuemax={goal}
      aria-label={`${pct}% funded`}
    >
      <div
        className={`hrt-progress-fill ${animate ? "transition-all duration-500 ease-out" : ""}`}
        style={{ width: `${pct}%`, maxWidth: "calc(100% - 0.5rem)" }}
      />
    </div>
  );
}
