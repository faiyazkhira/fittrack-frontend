declare module "react-calendar-heatmap" {
  import * as React from "react";

  interface Value {
    date: string;
    count?: number;
  }

  interface ReactCalendarHeatmapProps {
    startDate: Date | string;
    endDate: Date | string;
    values: Value[];
    classForValue?: (value: Value) => string;
    tooltipDataAttrs?: (value: Value) => object;
    showWeekdayLabels?: boolean;
    onClick?: (value: Value) => void;
  }

  export default class ReactCalendarHeatmap extends React.Component<ReactCalendarHeatmapProps> {}
}
