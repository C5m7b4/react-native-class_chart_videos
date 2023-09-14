import React from 'react';
import {View, Dimensions} from 'react-native';
import BasicChart from '../BasicChart';
import Svg, {
  G,
  Circle,
  Line,
  Path,
  Rect,
  Defs,
  LinearGradient,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import {LineChartProps, ILineTooltipConfig} from '../../../interfaces';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

class LineChart<T> extends BasicChart<T, LineChartProps> {
  handlePress(item: T, onPressItem: (item: T) => void) {
    if (onPressItem) {
      onPressItem(item);
    }
  }

  render_shadowDef(containerHeight: number) {
    return (
      <Defs>
        <LinearGradient
          id="lineshadow"
          x1={0}
          y1={0}
          x2={0}
          y2={containerHeight}>
          <Stop offset="0" stopColor="blue" stopOpacity="0.3" />
          <Stop offset="1" stopColor="green" stopOpacity="0.8" />
        </LinearGradient>
      </Defs>
    );
  }

  render_line_circles(
    containerHeight: number,
    containerWidth: number,
    lineCircleRadius: number,
    lineCircleStroke: string,
    lineCircleStrokeWidth: number,
    lineCircleFill: string,
    onPressItem: (item: T) => void,
    showTooltips: boolean,
    tooltip_config: ILineTooltipConfig,
  ) {
    const {gap_between_ticks} = this.calculateWidth(containerWidth);
    const {
      gap_between_ticks: y_gap,
      yMax,
      y_value_gap,
    } = this.calculateHeight(containerHeight);
    const {
      tooltipHeight = 20,
      tooltipWidth = 40,
      tooltipFill = '#fff',
      tooltipBorderRadius = 7,
      fontSize = 12,
      fontWeight = '400',
      textAnchor = 'middle',
    } = tooltip_config;

    return this.state.data.map((item, index) => {
      const x = this.state.x_margin * 2 + gap_between_ticks * index;
      const itemValue = item[this.state.y_key] as number;
      const y =
        (yMax - itemValue) * (y_gap / y_value_gap) + this.state.y_margin;
      return (
        <G key={`chart-circle_${index}`}>
          <Circle
            cx={x}
            cy={y}
            r={lineCircleRadius}
            stroke={lineCircleStroke}
            strokeWidth={lineCircleStrokeWidth}
            fill={lineCircleFill}
            onPress={() => this.handlePress(item, onPressItem)}
          />
          {showTooltips ? (
            <G key={`tooltip-${index}`}>
              <Line
                x1={x}
                y1={y - lineCircleRadius / 2}
                x2={x}
                y2={y - lineCircleRadius / 2 - 10}
                stroke={'#000'}
                strokeWidth={2}
                opacity={0.8}
              />
              <Rect
                x={x - tooltipWidth / 2}
                y={y - lineCircleRadius / 2 - tooltipHeight - 10}
                width={tooltipWidth}
                height={tooltipHeight}
                fill={tooltipFill}
                rx={tooltipBorderRadius}
                opacity={1}
                onPress={() => this.handlePress(item, onPressItem)}
              />
              <SvgText
                x={x}
                y={y - lineCircleRadius / 2 - tooltipHeight / 2 - 5}
                fontSize={fontSize}
                fontWeight={fontWeight}
                textAnchor={textAnchor}>
                {item[this.state.y_key] as React.ReactNode}
              </SvgText>
            </G>
          ) : null}
        </G>
      );
    });
  }

  getDPath(containerHeight: number, containerWidth: number, curve: boolean) {
    const {gap_between_ticks: x_gap} = this.calculateWidth(containerWidth);
    const {
      gap_between_ticks: y_gap,
      yMax,
      y_value_gap,
    } = this.calculateHeight(containerHeight);
    let dPath = '';
    let prevX = 0;
    let prevY = 0;
    let firstX = 0;
    let firstY = 0;
    let lastX = 0;
    let lastY = 0;

    this.state.data.map((item, index) => {
      let x = this.state.x_margin * 2 + x_gap * index;
      let y =
        (yMax - (item[this.state.y_key] as number)) * (y_gap / y_value_gap) +
        this.state.y_margin;
      if (index == this.state.data.length - 1) {
        lastX = x;
        lastY = y;
      }

      if (curve) {
        if (index === 0) {
          dPath += `M ${x}, ${y}`;
          prevX = x;
          prevY = y;
          firstX = x;
          firstY = y;
        } else {
          const x_split = (x - prevX) / 4;
          const y_split = (y - prevY) / 2;
          dPath +=
            ` Q ${prevX + x_split},  ${prevY}, ${prevX + x_split * 2}, ${
              prevY + y_split
            }` +
            `Q ${prevX + x_split * 3},  ${prevY + y_split * 2}, ${x}, ${y}`;
          prevX = x;
          prevY = y;
        }
      } else {
        if (index === 0) {
          firstX = x;
          firstY = y;
          dPath += `M ${x}, ${y}`;
        } else {
          dPath += ` L ${x}, ${y}`;
        }
      }
    });
    return {dPath, firstX, firstY, lastX, lastY};
  }

  render_line(
    containerHeight: number,
    containerWidth: number,
    lineStrokeWidth: number,
    lineStroke: string,
    curve: boolean,
  ) {
    const {dPath} = this.getDPath(containerHeight, containerWidth, curve);
    return (
      <Path
        d={dPath}
        strokeWidth={lineStrokeWidth}
        stroke={lineStroke}
        fill={'transparent'}
      />
    );
  }

  render_shadow(
    containerHeight: number,
    containerWidth: number,
    curve: boolean,
  ) {
    let {dPath, firstX, firstY, lastX, lastY} = this.getDPath(
      containerHeight,
      containerWidth,
      curve,
    );
    const yOrigin = containerHeight - this.state.y_margin;
    const x_split = (firstX - this.state.x_margin) / 4;
    const y_split = (firstY - yOrigin) / 2;

    const end_x_split = (containerWidth - this.state.x_margin - lastX) / 4;
    const end_y_split = (containerHeight - this.state.y_margin - lastY) / 2;

    dPath +=
      ` Q ${lastX + end_x_split}, ${lastY}, ${lastX + end_x_split * 2}, ${
        lastY + end_y_split
      }` +
      ` Q ${lastX + end_x_split * 3}, ${lastY + end_y_split * 2}, ${
        containerWidth - this.state.x_margin
      }, ${yOrigin}` +
      `L ${this.state.x_margin}, ${yOrigin}` +
      `Q ${this.state.x_margin + x_split}, ${yOrigin}, ${
        this.state.x_margin + x_split * 2
      }, ${yOrigin + y_split}` +
      `Q ${this.state.x_margin + x_split * 3}, ${
        yOrigin + y_split * 2
      }, ${firstX}, ${firstY}Z`;
    return <Path d={dPath} fill={'url(#lineshadow)'} strokeWidth={0} />;
  }

  render() {
    const {
      onPressItem,
      height: containerHeight = 300,
      width: containerWidth = SCREEN_WIDTH - 50,
      backgroundColor = 'transparent',
      svgBackgroundColor = 'transparent',
      useGradientBackground = true,
      backgroundBorderRadius = 20,
      axisCircleRadius = 5,
      axisColor = '#000',
      axisCircleFillColor = '#000',
      axisCircleStrokeColor = 'purple',
      axisStrokeWidth = 1,
      axisCircleOpacity = 0.8,
      lineCircleRadius = 5,
      lineCircleStroke = '#000',
      lineCircleStrokeWidth = 1,
      lineCircleFill = 'blue',
      showTooltips = false,
      lineStrokeWidth = 2,
      lineStroke = 'purple',
      curve = true,
      useLineShadow = true,
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
      tooltip_config = {
        tooltipHeight: 20,
        tooltipWidth: 40,
        tooltipFill: '#fff',
        tooltipBorderRadius: 7,
        fontSize: 12,
        fontWeight: '400',
        textAnchor: 'middle',
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
        <Svg style={svgContainer}>
          {this.render_defs(gradient_background_config)}
          {useGradientBackground &&
            this.render_background(
              containerHeight,
              containerWidth,
              backgroundBorderRadius,
            )}
          {this.state.data &&
            this.state.data.length > 0 &&
            useLineShadow &&
            this.render_shadowDef(containerHeight)}
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
            this.render_y_axis_labels(containerHeight, y_axis_config)}
          {this.state.data &&
            this.state.data.length > 0 &&
            this.render_line_circles(
              containerHeight,
              containerWidth,
              lineCircleRadius,
              lineCircleStroke,
              lineCircleStrokeWidth,
              lineCircleFill,
              onPressItem!,
              showTooltips,
              tooltip_config,
            )}
          {this.state.data &&
            this.state.data.length > 0 &&
            this.render_line(
              containerHeight,
              containerWidth,
              lineStrokeWidth,
              lineStroke,
              curve,
            )}
          {this.state.data &&
            this.state.data.length > 0 &&
            this.render_shadow(containerHeight, containerWidth, curve)}
        </Svg>
      </View>
    );
  }
}

export default LineChart;
