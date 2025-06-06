import React, { useEffect } from "react";
import { StatusBar, useColorScheme } from "react-native";

import { NavigationContainer } from "@react-navigation/native";

import { refresh } from "@api/auth";
import { useAppDispatch } from "@redux/hook";
import { Dark, Light } from "@style/navigation";
import RootNavigator from "@navigation/rootNavigator";
import { useStorageState } from "@hook/useStorageState";
import { updateSession, updateStatus } from "@redux/user/userSlice";

function Container(): React.JSX.Element {
  const scheme = useColorScheme();
  const dispatch = useAppDispatch();
  const [[loading, refreshToken], setRefreshToken] = useStorageState("session");

  const getToken = async (refreshToken: string) => {
    try {
      const response: Session = await refresh(refreshToken);

      if (response) {
        setRefreshToken(response.refreshToken);
        dispatch(updateSession(response));
        dispatch(updateStatus("connected"));
      } else {
        throw new Error("Failed to refresh token, no response received.");
      }
    } catch (error) {
      setRefreshToken(null);
      dispatch(updateStatus("disconnected"));
    }
  };

  useEffect(() => {
    if (!loading) {
      if (refreshToken) {
        getToken(refreshToken);
      } else {
        dispatch(updateStatus("disconnected"));
      }
    }
  }, [loading, refreshToken]);

  return (
    <NavigationContainer theme={scheme === "dark" ? Dark() : Light()}>
      <StatusBar
        animated
        translucent
        showHideTransition={"slide"}
        backgroundColor={"transparent"}
        barStyle={scheme === "dark" ? "light-content" : "dark-content"}
      />
      <RootNavigator />
    </NavigationContainer>
  );
}

export default Container;
