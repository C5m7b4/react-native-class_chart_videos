import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';

import Charts from './src/pages/Charts';

const Drawer = createDrawerNavigator();

const Page1 = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>page1</Text>
    </View>
  );
};

const Page2 = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>page2</Text>
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={Page1} />
        <Drawer.Screen name="Page2" component={Page2} />
        <Drawer.Screen name="Charts" component={Charts} />
      </Drawer.Navigator>
    </NavigationContainer>
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

export default App;
