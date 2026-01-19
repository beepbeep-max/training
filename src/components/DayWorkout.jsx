import { getLastExerciseLog } from "../utils/workoutStorage";
import { useState } from "react";
import { saveWorkoutLog } from "../utils/workoutStorage";

export default function DayWorkout({ monthData, dayId, onClose }) {
  const day = monthData.days.find(d => d.id === dayId);

  const [log, setLog] = useState({});

  function updateSet(exerciseId, setIndex, field, value) {
    setLog(prev => ({
      ...prev,
      [exerciseId]: {
        ...(prev[exerciseId] || {}),
        [setIndex]: {
          ...(prev[exerciseId]?.[setIndex] || {}),
          [field]: value
        }
      }
    }));
  }

  function completeWorkout() {
    const timestamp = new Date().toISOString();

    Object.entries(log).forEach(([exerciseId, sets]) => {
      Object.entries(sets).forEach(([setIndex, data]) => {
        saveWorkoutLog({
          date: timestamp,
          month: monthData.month,
          phase: monthData.phase.name,
          day: day.id,
          exerciseId,
          set: Number(setIndex) + 1,
          weight: data.weight || null,
          rpe: data.rpe || null
        });
      });
    });

    onClose?.();
  }

  return (
    <div className="day-workout-modal">
      {/* HEADER */}
      <header className="mb-6">
        <h2 className="text-xl font-semibold">
          {day.title}
        </h2>
        <p className="text-sm text-gray-600">
          Month {monthData.month} • {monthData.phase.name} • Target RPE {monthData.phase.targetRPE}
        </p>
        <p className="text-sm text-gray-500">
          {day.intent}
        </p>
      </header>

      {/* EXERCISES */}
      {day.exercises.map(ex => (
        <div key={ex.id} className="exercise-card mb-6 p-4 border rounded">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">{ex.name}</h3>
            <span className="text-sm bg-gray-100 px-2 py-1 rounded">
              {ex.sets} sets × {ex.reps}
            </span>
          </div>

          <p className="text-sm text-green-700 mb-3">
            <strong>Why:</strong> {ex.why}
          </p>

          {/* LOG TABLE */}
          <div className="grid grid-cols-4 gap-2 text-sm">
            <div className="font-semibold">Set</div>
            <div className="font-semibold">Weight</div>
            <div className="font-semibold">RPE</div>
            <div className="font-semibold">Done</div>

            {Array.from({ length: ex.sets }).map((_, i) => (
              <div key={i} className="contents">
                <div>{i + 1}</div>

                <input
                  type="number"
                  placeholder="-"
                  className="border px-2 py-1 rounded"
                  onChange={e =>
                    updateSet(ex.id, i, "weight", e.target.value)
                  }
                />

                <input
                  type="number"
                  min="1"
                  max="10"
                  placeholder="-"
                  className="border px-2 py-1 rounded"
                  onChange={e =>
                    updateSet(ex.id, i, "rpe", e.target.value)
                  }
                />

                <input type="checkbox" />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* FOOTER */}
      <footer className="flex justify-end">
        <button
          onClick={completeWorkout}
          className="bg-emerald-600 text-white px-6 py-2 rounded"
        >
          Complete Workout
        </button>
      </footer>
    </div>
  );
}
