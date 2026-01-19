import { useRef, useState } from "react";
import { getWorkoutLogs, overwriteWorkoutLogs } from "../utils/workoutStorage";

export default function BackupControls() {
  const fileInputRef = useRef(null);
  const [status, setStatus] = useState(null);

  function exportLogs() {
    const data = JSON.stringify(getWorkoutLogs(), null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "osteostrength12-logs.json";
    a.click();

    setStatus("Export complete.");
  }

  function importLogs(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (!Array.isArray(parsed)) throw new Error("Invalid format");
        overwriteWorkoutLogs(parsed);
        setStatus("Import complete.");
      } catch {
        setStatus("Import failed (invalid JSON file).");
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="border rounded p-4 bg-white">
      <h3 className="font-medium mb-2">Backup & Restore</h3>

      <div className="flex gap-3 mb-2">
        <button
          onClick={exportLogs}
          className="px-4 py-2 bg-slate-800 text-white rounded"
        >
          Export Logs
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-slate-200 rounded"
        >
          Import Logs
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={importLogs}
        />
      </div>

      {status && <p className="text-sm text-gray-600">{status}</p>}
    </div>
  );
}
