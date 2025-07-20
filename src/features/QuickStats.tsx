interface Props {
  workoutsThisMonth: number;
  totalWorkouts: number;
  currentWeight: number;
}

export default function QuickStats({
  workoutsThisMonth,
  totalWorkouts,
  currentWeight,
}: Props) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="p-4 border rounded">
        Workouts This Month: {workoutsThisMonth}
      </div>
      <div className="p-4 border rounded">Total Workouts: {totalWorkouts}</div>
      <div className="p-4 border rounded">
        Current Weight: {currentWeight} kg
      </div>
    </div>
  );
}
