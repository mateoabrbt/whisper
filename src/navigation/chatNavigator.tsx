import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import type { RouteProp } from "@react-navigation/native";
import type {
  StackScreenProps,
  StackNavigationProp,
} from "@react-navigation/stack";

import Chat from "@screen/chat/chat";
import Rooms from "@screen/chat/rooms";

export enum ChatStackScreens {
  Chat = "Chat",
  Rooms = "Rooms",
}

export type ChatStackScreensParams = {
  [ChatStackScreens.Rooms]: undefined;
  [ChatStackScreens.Chat]: { id: string };
};

export type ChatNavScreenProps<
  RouteName extends keyof ChatStackScreensParams = ChatStackScreens
> = StackScreenProps<ChatStackScreensParams, RouteName>;

export type ChatNavNavigationProp<
  RouteName extends keyof ChatStackScreensParams = ChatStackScreens
> = StackNavigationProp<ChatStackScreensParams, RouteName>;

export type ChatNavRouteProp<
  RouteName extends keyof ChatStackScreensParams = ChatStackScreens
> = RouteProp<ChatStackScreensParams, RouteName>;

function ChatNavigator(): React.JSX.Element {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen component={Rooms} name={ChatStackScreens.Rooms} />
      <Stack.Screen component={Chat} name={ChatStackScreens.Chat} />
    </Stack.Navigator>
  );
}

export default ChatNavigator;
