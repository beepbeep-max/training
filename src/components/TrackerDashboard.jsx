import { useMemo, useState } from "react";
// import { getSessionsForDate } from "../utils/workoutStorage";
import DayWorkout from "./DayWorkout";
import ProgressSummary from "./ProgressSummary";
import BackupControls from "./BackupControls";
import { getCompletedDayIdsForDateV2 } from "../utils/workoutStorage";


export default function TrackerDashboard({ plan }) {
  const months = plan.months;

  const [selectedMonth, setSelectedMonth] = useState(months[0]?.month ?? 1);
  const [openDayId, setOpenDayId] = useState(null);

  const todayISO = new Date().toISOString().slice(0, 10);
  const completedDayIdsToday = getCompletedDayIdsForDateV2(todayISO);



  const currentMonthBase = useMemo(
  () => months.find(m => m.month === Number(selectedMonth)) ?? months[0],
  [months, selectedMonth]
);

const currentMonthData = useMemo(() => {
  return {
    ...currentMonthBase,
    days: currentMonthBase.days ?? plan.daysTemplate
  };
}, [currentMonthBase, plan.daysTemplate]);


  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Top: Month + Phase banner */}
      <div className="border rounded p-4 bg-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium">Current Progress</label>
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="border rounded px-3 py-2"
            >
              {months.map(m => (
                <option key={m.month} value={m.month}>
                  Month {m.month}: {m.phase.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <div className="border rounded p-3 text-center min-w-[120px]">
              <div className="text-xs text-gray-500">TARGET RPE</div>
              <div className="text-lg font-semibold">{currentMonthData.phase.targetRPE}</div>
            </div>
            <div className="border rounded p-3 text-center min-w-[120px]">
              <div className="text-xs text-gray-500">REPS</div>
              <div className="text-lg font-semibold">{currentMonthData.phase.repGuidance}</div>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-emerald-50 border border-emerald-100 rounded p-4">
          <div className="text-xs text-emerald-700 font-semibold">CURRENT PHASE</div>
          <div className="text-xl font-semibold">{currentMonthData.phase.name}</div>
          <div className="text-sm text-emerald-800">{currentMonthData.phase.focus}</div>
        </div>
      </div>

      {/* Read-only summary */}
      <ProgressSummary currentMonth={currentMonthData} />

      {/* Day cards */}
      {currentMonthData.days.map(day => {
        const isDoneToday = completedDayIdsToday.has(day.id);

        return (
         <button
          key={day.id}
          onClick={() => setOpenDayId(day.id)}
          className={`text-left border rounded p-4 bg-white hover:shadow-sm transition ${
            isDoneToday ? "border-emerald-300 bg-emerald-50" : ""
      }`}
      >
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold">
              {day.id.toUpperCase().replace("DAY", "Day ")}
            </div>

            {isDoneToday ? (
              <span className="text-xs font-semibold px-2 py-1 rounded bg-emerald-600 text-white">
                Completed today ✓
              </span>
        ) : (
          <div className="text-gray-400 text-xl">›</div>
        )}
      </div>

      <div className="font-medium mt-1">{day.title}</div>
      <div className="text-sm text-gray-600 mt-1">{day.intent}</div>

      <div className="text-xs text-gray-500 mt-3">
        {day.estimatedTime} • {day.exercises.length} exercises
      </div>
    </button>
  );
})}

      <div>
        <h3 className="font-medium mb-3">This Week’s Training</h3>

        <div className="grid md:grid-cols-3 gap-4">
          {currentMonthData.days.map(day => (
            <button
              key={day.id}
              onClick={() => setOpenDayId(day.id)}
              className="text-left border rounded p-4 bg-white hover:shadow-sm transition"
            >
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold">
                  {day.id.toUpperCase().replace("DAY", "Day ")}
                </div>
                <div className="text-gray-400 text-xl">›</div>
              </div>

              <div className="font-medium mt-1">{day.title}</div>
              <div className="text-sm text-gray-600 mt-1">{day.intent}</div>

              <div className="text-xs text-gray-500 mt-3">
                {day.estimatedTime} • {day.exercises.length} exercises
              </div>
            </button>
          ))}
        </div>

        <div className="mt-4 text-sm bg-slate-50 border rounded p-3">
          <strong>Remember the consistency rule:</strong> Rest at least{" "}
          {plan.meta.restRuleHours} hours between sessions.
        </div>
      </div>

      {/* Backup */}
      <BackupControls />

      {/* Modal-ish DayWorkout */}
      {openDayId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded shadow-lg max-w-4xl w-full p-6 max-h-[90vh] overflow-auto">
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setOpenDayId(null)}
                className="text-gray-500 hover:text-gray-800"
                aria-label="Close"
                >
                  ✕
                </button>
              </div>
            <DayWorkout
              monthData={currentMonthData}
              dayId={openDayId}
              onClose={() => setOpenDayId(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
