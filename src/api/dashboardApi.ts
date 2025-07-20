import api from "@/api/axios";
export interface ExerciseSummary {
  name: string;
}

export interface LastWorkout {
  date: string;
  muscleGroup: string;
  exercises: ExerciseSummary[];
}

export interface CalendarHeatmapEntry {
  date: string;
  count: number;
}

export interface DashboardSummary {
  workoutsThisMonth: number;
  totalWorkouts: number;
  currentWeight: number;
  lastWorkout: LastWorkout | null;
  calendarHeatmap: CalendarHeatmapEntry[];
}

export const getDashboardSummary = async () => {
  const res = await api.get<DashboardSummary>("/v1/dashboard");
  console.log(res.data);
  return res.data;
};
