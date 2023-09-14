import React from 'react';
import {View, Text, Dimensions} from 'react-native';
import Svg, {
  G,
  Rect,
  Circle,
  Line,
  LinearGradient,
  Defs,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

import {
  AxisConfig,
  BasicChartProps,
  BasicChartState,
  ILinearGradient,
} from '../../../interfaces';
import {quickSort} from '../../../utils';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

class BasicChart<T, K> extends React.Component<
  BasicChartProps<T, K>,
  BasicChartState<T>
> {
  state: BasicChartState<T> = {
    x_margin: 50,
    y_margin: 50,
    data: this.props.data || [],
    x_key: this.props.x_key,
    y_key: this.props.y_key,
    yAxisLabels: [],
  };

  componentDidMount(): void {
    const yKeys = this.state.data.map(item => item[this.state.y_key] as number);
    const sorted = quickSort(yKeys);
    this.setState({yAxisLabels: sorted});
  }

  calculateWidth(containerWidth: number) {
    const chartWidth = containerWidth - this.state.x_margin * 2;
    const gap_between_ticks = chartWidth / (this.state.data.length + 2);
    return {chartWidth, gap_between_ticks};
  }

  calculateHeight(containerHeight: number) {
    const yMax = this.state.data.reduce((acc, cur) => {
      return (cur[this.state.y_key] as number) > acc
        ? (cur[this.state.y_key] as number)
        : acc;
    }, 0);
    const min = 0;
    const actual_chart_height = containerHeight - this.state.y_margin * 2;
    const gap_between_ticks =
      actual_chart_height / (this.state.data.length - 1);
    const y_value_gap = (yMax - min) / (this.state.data.length - 1);
    return {yMax, min, gap_between_ticks, y_value_gap};
  }

  render_defs(gradient_background_config: ILinearGradient) {
    const {x1, y1, x2, y2} = gradient_background_config;
    const {
      offset: offset1,
      stopColor: stopColor1,
      stopOpacity: stopOpacity1,
    } = gradient_background_config.stop1!;
    const {
      offset: offset2,
      stopColor: stopColor2,
      stopOpacity: stopOpacity2,
    } = gradient_background_config.stop2!;
    return (
      <Defs>
        <LinearGradient
          id="gradientback"
          gradientUnits="userSpaceOnUse"
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}>
          <Stop
            offset={offset1}
            stopColor={stopColor1}
            stopOpacity={stopOpacity1}
          />
          <Stop
            offset={offset2}
            stopColor={stopColor2}
            stopOpacity={stopOpacity2}
          />
        </LinearGradient>
      </Defs>
    );
  }

  render_background(
    containerHeight: number,
    containerWidth: number,
    backgroundBorderRadius: number,
  ) {
    return (
      <Rect
        x={0}
        y={0}
        height={containerHeight}
        width={containerWidth}
        rx={backgroundBorderRadius}
        fill={'url(#gradientback)'}
      />
    );
  }

  render_x_axis(
    containerHeight: number,
    containerWidth: number,
    axisCircleRadius: number,
    axisColor: string,
    axisCircleFillColor: string,
    axisCircleStrokeColor: string,
    axisStrokeWidth: number,
    axisCircleOpacity: number,
  ) {
    return (
      <G key="x_axis">
        <Circle
          cx={this.state.x_margin}
          cy={containerHeight - this.state.y_margin}
          r={axisCircleRadius}
          fill={axisCircleFillColor}
          stroke={axisCircleStrokeColor}
          strokeWidth={axisStrokeWidth}
          opacity={axisCircleOpacity}
        />
        <Circle
          cx={containerWidth - this.state.x_margin}
          cy={containerHeight - this.state.y_margin}
          r={axisCircleRadius}
          fill={axisCircleFillColor}
          stroke={axisCircleStrokeColor}
          strokeWidth={axisStrokeWidth}
          opacity={axisCircleOpacity}
        />
        <Line
          x1={this.state.x_margin}
          y1={containerHeight - this.state.y_margin}
          x2={containerWidth - this.state.x_margin}
          y2={containerHeight - this.state.y_margin}
          stroke={axisColor}
          strokeWidth={axisStrokeWidth}
        />
      </G>
    );
  }

  render_y_axis(
    containerHeight: number,
    axisCircleRadius: number,
    axisCircleFillColor: string,
    axisStrokeWidth: number,
    axisCircleOpacity: number,
    axisColor: string,
    axisCircleStrokeColor: string,
  ) {
    return (
      <G key="y_axis">
        <Circle
          cx={this.state.x_margin}
          cy={this.state.y_margin}
          r={axisCircleRadius}
          fill={axisCircleFillColor}
          stroke={axisCircleStrokeColor}
          strokeWidth={axisStrokeWidth}
          opacity={axisCircleOpacity}
        />
        <Line
          x1={this.state.x_margin}
          y1={containerHeight - this.state.y_margin}
          x2={this.state.x_margin}
          y2={this.state.y_margin}
          stroke={axisColor}
          strokeWidth={axisStrokeWidth}
        />
      </G>
    );
  }

  render_x_axis_ticks(
    containerHeight: number,
    containerWidth: number,
    axisColor: string,
    axisStrokeWidth: number,
  ) {
    const {gap_between_ticks} = this.calculateWidth(containerWidth);
    return this.state.data.map((_, index: number) => {
      const x = this.state.x_margin * 2 + gap_between_ticks * index;

      const y = containerHeight - this.state.y_margin;
      return (
        <G key={`x_axis_tick_${index}`}>
          <Line
            x1={x}
            y1={y}
            x2={x}
            y2={y + 10}
            stroke={axisColor}
            strokeWidth={axisStrokeWidth}
          />
        </G>
      );
    });
  }

  render_x_axis_labels(
    containerHeight: number,
    containerWidth: number,
    x_axis_config: AxisConfig,
    x_label_renderer?: (item: T) => React.ReactNode,
  ) {
    const {gap_between_ticks} = this.calculateWidth(containerWidth);
    const {
      fontSize = 12,
      rotation = 0,
      fontColor = '#000',
      textAnchor = 'middle',
      fontWeight = '400',
    } = x_axis_config;
    return this.state.data.map((item: T, index: number) => {
      const x = this.state.x_margin * 2 + gap_between_ticks * index;
      const y = containerHeight - this.state.y_margin + 10 + fontSize;
      return (
        <G key={`x_axis_label_${index}`}>
          <SvgText
            x={x}
            y={y}
            origin={`${x}, ${y}`}
            rotation={rotation}
            textAnchor={textAnchor}
            fontWeight={fontWeight}
            fontSize={fontSize}
            fill={fontColor}>
            {x_label_renderer
              ? x_label_renderer(item)
              : (item[this.state.x_key] as React.ReactNode)}
          </SvgText>
        </G>
      );
    });
  }

  render_y_axis_ticks(
    containerHeight: number,
    axisColor: string,
    axisStrokeWidth: number,
  ) {
    const {gap_between_ticks} = this.calculateHeight(containerHeight);
    return this.state.data.map((_, index: number) => {
      const y =
        containerHeight - this.state.y_margin - gap_between_ticks * index;
      return (
        <G key={`y_axis_tick_${index}`}>
          <Line
            x1={this.state.x_margin}
            y1={y}
            x2={this.state.x_margin - 10}
            y2={y}
            stroke={axisColor}
            strokeWidth={axisStrokeWidth}
          />
        </G>
      );
    });
  }

  render_y_axis_labels(
    containerHeight: number,
    y_axis_config: AxisConfig,
    y_label_renderer?: (item: string) => React.ReactNode,
  ) {
    const {gap_between_ticks, min, yMax} =
      this.calculateHeight(containerHeight);
    const {
      rotation = 0,
      fontSize = 12,
      fontWeight = '400',
      fontColor = '#000',
      textAnchor = 'end',
    } = y_axis_config;
    const x = this.state.x_margin - 10;
    return this.state.yAxisLabels.map((item, index) => {
      const y =
        containerHeight - this.state.y_margin - gap_between_ticks * index;
      const dataPoints = this.state.data.length - 1;
      const textValue = min + (yMax / dataPoints) * index;
      return (
        <G key={`y_axis_label_${index}`}>
          <SvgText
            x={x}
            y={y + fontSize / 3}
            origin={`${x}, ${y}`}
            rotation={rotation}
            textAnchor={textAnchor}
            fontWeight={fontWeight}
            fontSize={fontSize}
            fill={fontColor}>
            {y_label_renderer
              ? y_label_renderer(textValue.toString())
              : textValue}
          </SvgText>
        </G>
      );
    });
  }

  render_horizontal_lines(
    containerHeight: number,
    containerWidth: number,
    axisColor: string,
    axisStrokeWidth: number,
    horizontalLineOpacity: number,
  ) {
    const {gap_between_ticks} = this.calculateHeight(containerHeight);
    return this.state.data.map((item, index) => {
      const y =
        containerHeight - this.state.y_margin - gap_between_ticks * index;
      return (
        <G key={`horizontal_line_${index}`}>
          <Line
            x1={this.state.x_margin}
            y1={y}
            x2={containerWidth - this.state.x_margin}
            y2={y}
            stroke={axisColor}
            strokeWidth={axisStrokeWidth}
            opacity={horizontalLineOpacity}
          />
        </G>
      );
    });
  }

  render_vertical_lines(
    containerHeight: number,
    containerWidth: number,
    axisColor: string,
    axisStrokeWidth: number,
    verticalLineOpacity: number,
  ) {
    const {gap_between_ticks} = this.calculateWidth(containerWidth);
    return this.state.data.map((item, index) => {
      const x = this.state.x_margin * 2 + gap_between_ticks * index;
      return (
        <G key={`verical_line_${index}`}>
          <Line
            x1={x}
            y1={containerHeight - this.state.y_margin}
            x2={x}
            y2={this.state.y_margin}
            stroke={axisColor}
            strokeWidth={axisStrokeWidth}
            opacity={verticalLineOpacity}
          />
        </G>
      );
    });
  }

  render(): React.ReactNode {
    const {
      height: containerHeight = 300,
      width: containerWidth = SCREEN_WIDTH - 50,
      backgroundColor = 'transparent',
      svgBackgroundColor = 'transparent',
      useGradientBackground = true,
      backgroundBorderRadius = 20,
      axisColor = '#000',
      axisCircleFillColor = '#000',
      axisCircleStrokeColor = 'red',
      axisStrokeWidth = 1,
      axisCircleRadius = 5,
      axisCircleOpacity = 0.7,
      showHorizontalLines = true,
      horizontalLineOpacity = 0.1,
      showVerticalLines = true,
      verticalLineOpacity = 0.1,
      x_label_renderer,
      y_label_renderer,
      gradient_background_config = {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: containerHeight,
        stop1: {
          offset: 0,
          stopColor: '#6491d9',
          stopOpacity: 0.3,
        },
        stop2: {
          offset: 1,
          stopColor: '#3557bf',
          stopOpacity: 0.8,
        },
      },
      x_axis_config = {
        fontSize: 12,
        textAnchor: 'middle',
        fontColor: '#000',
        fontWeight: '400',
        rotation: 0,
      },
      y_axis_config = {
        fontSize: 12,
        textAnchor: 'end',
        fontColor: '#000',
        fontWeight: '400',
        rotation: 0,
      },
    } = this.props;

    const mainContainer = {
      height: containerHeight,
      width: containerWidth,
      backgroundColor,
    };

    const svgContainer = {
      backgroundColor: svgBackgroundColor,
    };
    return (
      <View style={mainContainer}>
        <Svg height="100%" width="100%" style={svgContainer}>
          {this.render_defs(gradient_background_config)}
          {useGradientBackground &&
            this.render_background(
              containerHeight,
              containerWidth,
              backgroundBorderRadius,
            )}
          {this.render_x_axis(
            containerHeight,
            containerWidth,
            axisCircleRadius,
            axisColor,
            axisCircleFillColor,
            axisCircleStrokeColor,
            axisStrokeWidth,
            axisCircleOpacity,
          )}
          {this.render_y_axis(
            containerHeight,
            axisCircleRadius,
            axisCircleFillColor,
            axisStrokeWidth,
            axisCircleOpacity,
            axisColor,
            axisCircleStrokeColor,
          )}
          {this.state.data &&
            this.state.data.length > 0 &&
            this.render_x_axis_ticks(
              containerHeight,
              containerWidth,
              axisColor,
              axisStrokeWidth,
            )}
          {this.state.data &&
            this.state.data.length > 0 &&
            this.render_x_axis_labels(
              containerHeight,
              containerWidth,
              x_axis_config,
              x_label_renderer,
            )}
          {this.state.data &&
            this.state.data.length > 0 &&
            this.render_y_axis_ticks(
              containerHeight,
              axisColor,
              axisStrokeWidth,
            )}
          {this.state.data &&
            this.state.data.length > 0 &&
            this.render_y_axis_labels(
              containerHeight,
              y_axis_config,
              y_label_renderer,
            )}
          {this.state.data &&
            this.state.data.length > 0 &&
            showHorizontalLines &&
            this.render_horizontal_lines(
              containerHeight,
              containerWidth,
              axisColor,
              axisStrokeWidth,
              horizontalLineOpacity,
            )}
          {this.state.data &&
            this.state.data.length > 0 &&
            showVerticalLines &&
            this.render_vertical_lines(
              containerHeight,
              containerWidth,
              axisColor,
              axisStrokeWidth,
              verticalLineOpacity,
            )}
        </Svg>
      </View>
    );
  }
}

export default BasicChart;
