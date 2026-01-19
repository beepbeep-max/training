import plan from "./data/trainingPlan.json";
import TrackerDashboard from "./components/TrackerDashboard";

export default function App() {
  return <TrackerDashboard plan={plan} />;
}
