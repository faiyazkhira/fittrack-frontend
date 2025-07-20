import type { CalendarHeatmapEntry } from "@/api/dashboardApi";
import CalendarHeatmapComponent from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

interface Props {
  entries: CalendarHeatmapEntry[];
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function CalendarHeatmap({ entries }: Props) {
  return (
    <div className="p-4 border rounded">
      <h2 className="text-lg mb-2">Consistency Calendar</h2>
      <CalendarHeatmapComponent
        startDate={new Date(new Date().setMonth(new Date().getMonth() - 5))}
        endDate={new Date()}
        values={entries}
        classForValue={(value) => {
          if (!value || typeof value.count !== "number" || value.count < 1) {
            return "color-empty";
          }
          if (value.count >= 4) return "color-scale-4";
          if (value.count === 3) return "color-scale-3";
          if (value.count === 2) return "color-scale-2";
          return "color-scale-1";
        }}
        titleForValue={(value: CalendarHeatmapEntry | null) => {
          if (!value || !value.date) return "";
          return `${formatDate(value.date)}: ${value.count} workout(s)`;
        }}
      />
    </div>
  );
}
