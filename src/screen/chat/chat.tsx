import { StyleSheet, Text } from "react-native";
import React, { useCallback, useEffect } from "react";

import { SafeAreaView } from "react-native-safe-area-context";
import { LegendList, LegendListRenderItemProps } from "@legendapp/list";

import { roomMessages } from "api/room";
import { useAppSelector } from "@redux/hook";
import { useRoute } from "@react-navigation/native";
import { ChatNavRouteProp, ChatStackScreens } from "@navigation/chatNavigator";

function Chat() {
  const [data, setData] = React.useState<Message[]>([]);
  const { session } = useAppSelector((state) => state.user);
  const { id } = useRoute<ChatNavRouteProp<ChatStackScreens.Chat>>().params;

  const getRoomMessages = useCallback(async () => {
    if (!session) {
      console.error("No session found");
      return;
    }
    try {
      const response = await roomMessages(id, session.accessToken);
      setData(response);
    } catch (error: any) {
      console.error("Error fetching rooms:", error);
    }
  }, []);

  useEffect(() => {
    getRoomMessages();
  }, []);

  const renderItem = useCallback(
    ({ item: { content } }: LegendListRenderItemProps<Message>) => (
      <Text style={{ padding: 10, fontSize: 16 }}>{content}</Text>
    ),
    []
  );

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <LegendList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
});

export default Chat;
