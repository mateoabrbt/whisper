import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import type {RouteProp} from '@react-navigation/native';
import type {
  StackScreenProps,
  StackNavigationProp,
} from '@react-navigation/stack';

import Profile from '@screen/profile/profile';

export enum ProfileStackScreens {
  Profile = 'Profile',
}

export type ProfileStackScreensParams = {
  [ProfileStackScreens.Profile]: undefined;
};

export type ProfileNavScreenProps<
  RouteName extends keyof ProfileStackScreensParams = ProfileStackScreens,
> = StackScreenProps<ProfileStackScreensParams, RouteName>;

export type ProfileNavNavigationProp<
  RouteName extends keyof ProfileStackScreensParams = ProfileStackScreens,
> = StackNavigationProp<ProfileStackScreensParams, RouteName>;

export type ProfileNavRouteProp<
  RouteName extends keyof ProfileStackScreensParams = ProfileStackScreens,
> = RouteProp<ProfileStackScreensParams, RouteName>;

function ProfileNavigator(): React.JSX.Element {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen component={Profile} name={ProfileStackScreens.Profile} />
    </Stack.Navigator>
  );
}

export default ProfileNavigator;
