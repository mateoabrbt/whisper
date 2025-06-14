import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import type { RouteProp } from '@react-navigation/native';
import type {
  StackScreenProps,
  StackNavigationProp,
} from '@react-navigation/stack';

import Loading from '@screen/loading';
import Login from '@screen/auth/login';
import Signup from '@screen/auth/signup';
import { useAppSelector } from '@redux/hook';
import ForgotPassword from '@screen/auth/forgotPassword';

import BottomNavigator from './bottomNavigator';

import type {
  BottomNavigatorScreens,
  BottomNavigatorScreensParams,
} from './bottomNavigator';

export enum RootStackScreens {
  Login = 'Login',
  Signup = 'Signup',
  ForgotPassword = 'ForgotPassword',
  BottomNavigator = 'BottomNavigator',
}

export type RootStackScreensParams = {
  [RootStackScreens.Login]: undefined;
  [RootStackScreens.Signup]: undefined;
  [RootStackScreens.ForgotPassword]: undefined;
  [RootStackScreens.BottomNavigator]:
    | {
        initial: boolean;
        screen: BottomNavigatorScreens;
        params: BottomNavigatorScreensParams[BottomNavigatorScreens];
      }
    | undefined;
};

export type RootNavScreenProps<
  RouteName extends keyof RootStackScreensParams = RootStackScreens,
> = StackScreenProps<RootStackScreensParams, RouteName>;

export type RootNavNavigationProp<
  RouteName extends keyof RootStackScreensParams = RootStackScreens,
> = StackNavigationProp<RootStackScreensParams, RouteName>;

export type RootNavRouteProp<
  RouteName extends keyof RootStackScreensParams = RootStackScreens,
> = RouteProp<RootStackScreensParams, RouteName>;

function RootNavigator(): React.JSX.Element {
  const Stack = createStackNavigator();
  const { status, session } = useAppSelector(state => state.user);

  if (status === 'loading') {
    return <Loading />;
  }

  return (
    <Stack.Navigator>
      {!session || status === 'disconnected' ? (
        <Stack.Group>
          <Stack.Screen
            component={Login}
            name={RootStackScreens.Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            component={ForgotPassword}
            name={RootStackScreens.ForgotPassword}
          />
          <Stack.Screen component={Signup} name={RootStackScreens.Signup} />
        </Stack.Group>
      ) : (
        <Stack.Screen
          component={BottomNavigator}
          options={{ headerShown: false }}
          name={RootStackScreens.BottomNavigator}
        />
      )}
    </Stack.Navigator>
  );
}

export default RootNavigator;
