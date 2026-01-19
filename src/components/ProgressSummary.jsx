import { getSessionsV2 } from "../utils/workoutStorage";

export default function ProgressSummary({ currentMonth }) {
  const sessions = getSessionsV2();
  const totalSessions = sessions.length;

  const sorted = [...sessions].sort((a, b) => new Date(a.date) - new Date(b.date));
  const first = sorted[0]?.date;
  const last = sorted.at(-1)?.date;

  const weeksElapsed = first
    ? Math.max(
        1,
        Math.ceil((Date.now() - new Date(first)) / (1000 * 60 * 60 * 24 * 7))
      )
    : 0;

  const avgSessionsPerWeek =
    weeksElapsed > 0 ? (totalSessions / weeksElapsed).toFixed(1) : "—";

  const consistencyScore =
    weeksElapsed > 0
      ? Math.min(100, Math.round((Number(avgSessionsPerWeek) / 3) * 100))
      : 0;

  return (
    <div className="border rounded p-4 mb-6 bg-slate-50">
      <h3 className="font-medium mb-3">Progress Summary</h3>

      <ul className="text-sm space-y-2">
        <li><strong>Total sessions:</strong> {totalSessions}</li>
        <li><strong>Avg / week:</strong> {avgSessionsPerWeek} / 3</li>
        <li><strong>Weeks trained:</strong> {weeksElapsed || "—"}</li>
        <li>
          <strong>Last session:</strong>{" "}
          {last ? new Date(last).toLocaleDateString() : "—"}
        </li>
        <li><strong>Current phase:</strong> {currentMonth.phase.name}</li>
        <li><strong>Consistency score:</strong> {weeksElapsed ? `${consistencyScore}%` : "—"}</li>
      </ul>

      <p className="text-xs text-gray-500 mt-3">
        Consistency matters more than intensity. Bone adapts slowly.
      </p>
    </div>
  );
}
