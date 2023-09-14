import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';

// import BasicChart from '../components/charts/BasicChart';
import LineChart from '../components/charts/LineChart';
import {testData} from '../data';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const Charts = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Charts</Text>
      <LineChart
        height={300}
        width={SCREEN_WIDTH - 50}
        data={testData}
        x_key="month"
        y_key="value"
        x_axis_config={{
          fontColor: '#fff',
        }}
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
