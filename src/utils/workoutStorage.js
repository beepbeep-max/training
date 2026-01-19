const STORAGE_KEY = "osteostrength12_logs";

export function saveWorkoutLog(entry) {
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  existing.push(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

export function getWorkoutLogs() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

export function overwriteWorkoutLogs(newLogs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newLogs));
}

export function getLastExerciseLog(exerciseId) {
  const logs = getWorkoutLogs()
    .filter(l => l.exerciseId === exerciseId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return logs.length ? logs[0] : null;
}

/**
 * Sessions are unique by (date + day). We store per-set logs, so this groups them.
 */
export function getSessions() {
  const logs = getWorkoutLogs();
  const sessions = {};

  logs.forEach(log => {
    const key = `${log.date}-${log.day}`;
    if (!sessions[key]) {
      sessions[key] = {
        date: log.date,
        month: log.month,
        phase: log.phase,
        day: log.day
      };
    }
  });

  return Object.values(sessions);
}
