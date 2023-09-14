export type TextAnchor = 'start' | 'middle' | 'end';

export interface AxisConfig {
  fontSize?: number;
  textAnchor?: TextAnchor;
  fill?: string;
  fontWeight?: string;
  rotation?: number;
  fontColor?: string;
}

export interface IStop {
  offset: number;
  stopColor: string;
  stopOpacity: number;
}

export interface ILinearGradient {
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  stop1?: IStop;
  stop2?: IStop;
  stop3?: IStop;
  stop4?: IStop;
}

export type BasicChartProps<T, K> = K & {
  data: T[];
  x_key: keyof T;
  y_key: keyof T;
  onPressItem?: (item: T) => void;
  height?: number;
  width?: number;
  backgroundColor?: string;
  svgBackgroundColor?: string;
  useGradientBackground?: boolean;
  gradient_background_config?: ILinearGradient;
  backgroundBorderRadius?: number;
  axisCircleStrokeColor?: string;
  axisCircleOpacity?: number;
  axisCircleRadius?: number;
  axisCircleFillColor?: string;
  axisStrokeWidth?: number;
  axisColor?: string;
  x_axis_config?: AxisConfig;
  y_axis_config?: AxisConfig;
  showHorizontalLines?: boolean;
  horizontalLineOpacity?: number;
  showVerticalLines?: boolean;
  verticalLineOpacity?: number;
};

export type BasicChartState<T> = {
  data: T[];
  x_key: keyof T;
  y_key: keyof T;
  x_margin: number;
  y_margin: number;
  yAxisLabels: number[];
};

export interface LineChartProps {
  lineCircleRadius?: number;
  lineCircleStroke?: string;
  lineCircleFill?: string;
  lineCircleStrokeWidth?: number;
  showTooltips?: boolean;
  tooltip_config?: ILineTooltipConfig;
  lineStrokeWidth?: number;
  lineStroke?: string;
  curve?: boolean;
  useLineShadow?: boolean;
}

export interface ILineTooltipConfig {
  tooltipHeight: number;
  tooltipWidth: number;
  tooltipFill: string;
  tooltipBorderRadius: number;
  fontSize: number;
  fontWeight: string;
  textAnchor: TextAnchor;
}
