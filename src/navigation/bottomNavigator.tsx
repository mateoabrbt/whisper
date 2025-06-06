import React from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import type { RouteProp } from "@react-navigation/native";
import type {
  BottomTabScreenProps,
  BottomTabNavigationProp,
} from "@react-navigation/bottom-tabs";

import ChatNavigator, {
  ChatStackScreens,
  ChatStackScreensParams,
} from "./chatNavigator";
import ProfileNavigator, {
  ProfileStackScreens,
  ProfileStackScreensParams,
} from "./profileNavigator";

export enum BottomNavigatorScreens {
  ChatNavigator = "ChatNavigator",
  ProfileNavigator = "ProfileNavigator",
}

export type BottomNavigatorScreensParams = {
  [BottomNavigatorScreens.ChatNavigator]:
    | {
        initial: boolean;
        screen: ChatStackScreens;
        params: ChatStackScreensParams[ChatStackScreens];
      }
    | undefined;
  [BottomNavigatorScreens.ProfileNavigator]:
    | {
        initial: boolean;
        screen: ProfileStackScreens;
        params: ProfileStackScreensParams[ProfileStackScreens];
      }
    | undefined;
};

export type BottomNavScreenProps<
  RouteName extends keyof BottomNavigatorScreensParams = BottomNavigatorScreens
> = BottomTabScreenProps<BottomNavigatorScreensParams, RouteName>;

export type BottomNavNavigationProp<
  RouteName extends keyof BottomNavigatorScreensParams = BottomNavigatorScreens
> = BottomTabNavigationProp<BottomNavigatorScreensParams, RouteName>;

export type BottomNavRouteProp<
  RouteName extends keyof BottomNavigatorScreensParams = BottomNavigatorScreens
> = RouteProp<BottomNavigatorScreensParams, RouteName>;

const Tab = createBottomTabNavigator();

function BottomNavigator(): React.JSX.Element {
  return (
    <Tab.Navigator
      backBehavior="none"
      screenOptions={{ headerShown: false }}
      initialRouteName={BottomNavigatorScreens.ChatNavigator}
    >
      <Tab.Screen
        component={ChatNavigator}
        name={BottomNavigatorScreens.ChatNavigator}
      />
      <Tab.Screen
        component={ProfileNavigator}
        name={BottomNavigatorScreens.ProfileNavigator}
      />
    </Tab.Navigator>
  );
}

export default BottomNavigator;
