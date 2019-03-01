import React from 'react';
import { Platform, View } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import Colors from '../constants/Colors';


const defaultNavigationOptions = {
  title: 'magKNOWliophyta',
  headerStyle: {
    backgroundColor: Colors.navBackground,
    height: 48,
  },
  headerTintColor: Colors.white,
  headerTitleStyle: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  }
}

const HomeStack = createStackNavigator({
  Home: HomeScreen,
}, {defaultNavigationOptions});

HomeStack.navigationOptions = {
  tabBarLabel: 'take a photo',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name='camera-alt'
    />
  ),
};

const LinksStack = createStackNavigator({
  Links: LinksScreen,
}, { defaultNavigationOptions });

LinksStack.navigationOptions = {
  tabBarLabel: 'view photos',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name='photo-library'
    />
  ),
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
}, { defaultNavigationOptions });

SettingsStack.navigationOptions = {
  tabBarLabel: 'plant families',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name='local-florist'
    />
  ),
};

const tabBarOptions = {
  activeTintColor: Colors.tabSelected,
  inactiveTintColor: Colors.tabDefault,
  style: {
    backgroundColor: Colors.navBackground,
    height: 60,
    paddingBottom: 5,
  }
};

export default createBottomTabNavigator({HomeStack,LinksStack,SettingsStack}, {tabBarOptions});
