import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';

// import BasicChart from '../components/charts/BasicChart';
import LineChart from '../components/charts/LineChart';
import {testData, dateData, IDateData} from '../data';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const Charts = () => {
  const dateRenderer = (item: IDateData) => {
    const dte = new Date(item.Date);
    const month = dte.getMonth() + 1;
    const day = dte.getDate();
    return month + '/' + day;
  };

  const yRenderer = (item: string) => {
    const i = parseFloat(item);
    return i.toFixed(0);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Charts</Text>
      <LineChart
        height={275}
        width={SCREEN_WIDTH - 50}
        data={testData}
        x_key="month"
        y_key="value"
        x_axis_config={{
          fontColor: '#fff',
        }}
      />
      <LineChart
        height={275}
        data={dateData}
        x_key="Date"
        y_key="Value"
        x_label_renderer={dateRenderer}
        x_axis_config={{
          fontColor: '#fff',
          rotation: -45,
        }}
        y_label_renderer={yRenderer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 25,
  },
});

export default Charts;
