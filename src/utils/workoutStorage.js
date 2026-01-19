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

export function getCompletedDayIdsForDate(dateISO) {
  const logs = getWorkoutLogs().filter(l => (l.date || "").startsWith(dateISO));
  const completed = new Set();

  logs.forEach(l => {
    if (l.done === true) completed.add(l.day);
  });

  return completed;
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

export function getSessionsForDate(dateISO) {
  // dateISO should be "YYYY-MM-DD"
  const sessions = getSessions();
  return sessions.filter(s => (s.date || "").startsWith(dateISO));
}

export function getLastExerciseSessionSummary(exerciseId) {
  const logs = getWorkoutLogs()
    .filter(l => l.exerciseId === exerciseId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (!logs.length) return null;

  // Most recent session timestamp (ISO string)
  const latestDate = logs[0].date;

  // Get all sets for that same session
  const sameSession = logs.filter(l => l.date === latestDate);

  // Choose the highest set number that has data (best proxy for "final set")
  const best = sameSession
    .filter(l => l.weight != null || l.rpe != null)
    .sort((a, b) => (b.set ?? 0) - (a.set ?? 0))[0];

  if (!best) return null;

  return {
    date: latestDate,
    weight: best.weight ?? null,
    rpe: best.rpe ?? null
  };
}
const SESSIONS_KEY = "osteostrength12_sessions";

export function saveSession(session) {
  const existing = JSON.parse(localStorage.getItem(SESSIONS_KEY)) || [];
  existing.push(session);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(existing));
}

export function getSessionsV2() {
  return JSON.parse(localStorage.getItem(SESSIONS_KEY)) || [];
}

export function getSessionsForDateV2(dateISO) {
  return getSessionsV2().filter(s => (s.date || "").startsWith(dateISO));
}

export function getCompletedDayIdsForDateV2(dateISO) {
  return new Set(getSessionsForDateV2(dateISO).map(s => s.day));
}
