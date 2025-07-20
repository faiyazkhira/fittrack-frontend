import { useDashboardData } from "@/hooks/useDashboardData";
import { Button } from "@/components/ui/button";
import CalendarHeatmap from "@/features/CalendarHeatmap";
import QuickStats from "@/features/QuickStats";
import LastWorkoutSummary from "@/features/LastWorkoutSummary";

function DashboardPage() {
  const { data, isLoading } = useDashboardData();

  if (isLoading || !data) {
    return <div className="p-4">Loading dashboard...</div>;
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Welcome back</h1>
      <p>
        Your last training session: {data.lastWorkout?.muscleGroup || "N/A"}
      </p>

      <QuickStats
        workoutsThisMonth={data.workoutsThisMonth}
        totalWorkouts={data.totalWorkouts}
        currentWeight={data.currentWeight}
      />

      <CalendarHeatmap entries={data.calendarHeatmap ?? []} />

      <LastWorkoutSummary lastWorkout={data.lastWorkout} />

      <div className="flex gap-4">
        <Button>+ Log Workout</Button>
        <Button>+ Log Weight</Button>
      </div>
    </div>
  );
}

export default DashboardPage;
