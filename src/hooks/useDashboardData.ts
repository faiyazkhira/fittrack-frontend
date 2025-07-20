import { useQuery } from "@tanstack/react-query";
import { getDashboardSummary } from "@/api/dashboardApi";

export const useDashboardData = () => {
  return useQuery({
    queryKey: ["dashboardSummary"],
    queryFn: getDashboardSummary,
    refetchInterval: 60000, // Refetch every minute
    staleTime: 300000, // Data is fresh for 5 minutes
  });
};
