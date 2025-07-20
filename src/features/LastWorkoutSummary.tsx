import type { LastWorkout } from "@/api/dashboardApi";

interface Props {
  lastWorkout: LastWorkout | null;
}

export default function LastWorkoutSummary({ lastWorkout }: Props) {
  if (!lastWorkout) return null;

  return (
    <div className="p-4 border rounded">
      <h2 className="text-lg mb-2">Last Workout ({lastWorkout.date})</h2>
      <p>Muscle Group: {lastWorkout.muscleGroup}</p>
      <ul className="mt-2 space-y-1">
        {lastWorkout.exercises.map((ex, index) => (
          <li key={index}>{ex.name}</li>
        ))}
      </ul>
    </div>
  );
}
