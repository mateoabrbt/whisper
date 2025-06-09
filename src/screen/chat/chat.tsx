import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Platform,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { LegendList, LegendListRenderItemProps } from "@legendapp/list";

import { WHITE } from "@style/colors";
import { roomMessages } from "api/room";
import { useSocket } from "@hook/useSocket";
import { useAppSelector } from "@redux/hook";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useTheme } from "@react-navigation/native";
import { ChatNavRouteProp, ChatStackScreens } from "@navigation/chatNavigator";

function Chat() {
  const { colors } = useTheme();
  const { socket } = useSocket();
  const [data, setData] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAppSelector((state) => state.user);
  const { session } = useAppSelector((state) => state.user);
  const { id } = useRoute<ChatNavRouteProp<ChatStackScreens.Chat>>().params;

  const getRoomMessages = useCallback(async () => {
    if (!session) {
      console.error("No session found");
      return;
    }
    setLoading(true);
    try {
      const response = await roomMessages(id, session.accessToken);
      setData(response);
    } catch (error: any) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getRoomMessages();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.emit("connectToRoom");
    socket.on("newMessage", (message: Message) => {
      setData((prevData) => {
        return [...prevData, message];
      });
    });

    return () => {
      socket.off("newMessage");
    };
  }, [socket]);

  const sendMessage = useCallback(
    (newMessage: string) => {
      if (!socket || !newMessage.trim()) return;
      socket.emit("sendMessage", {
        id,
        content: newMessage,
      });
      setMessage("");
    },
    [id, socket]
  );

  const renderItem = useCallback(
    ({
      item: { content, sender, senderId, createdAt },
    }: LegendListRenderItemProps<Message>) => (
      <View
        style={[
          styles.item,
          { justifyContent: senderId === user?.id ? "flex-end" : "flex-start" },
        ]}
      >
        <View
          style={[styles.contentContainer, { backgroundColor: colors.primary }]}
        >
          <Text numberOfLines={1} style={styles.usernameText}>
            {senderId === user?.id ? "Vous" : sender?.username}
          </Text>
          <Text style={styles.contentText}>{content}</Text>
          <Text style={styles.dateText}>
            {new Date(createdAt).toLocaleString([], {
              day: "2-digit",
              hour: "2-digit",
              year: "2-digit",
              month: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </View>
    ),
    []
  );

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <SafeAreaView style={styles.container} edges={["left", "right"]}>
        {loading ? (
          <ActivityIndicator
            size="large"
            style={{ flex: 1 }}
            color={colors.primary}
          />
        ) : (
          <LegendList
            data={data}
            alignItemsAtEnd
            extraData={loading}
            maintainScrollAtEnd
            estimatedItemSize={50}
            renderItem={renderItem}
            maintainVisibleContentPosition
            keyExtractor={(item) => item.id}
            keyboardDismissMode="interactive"
            initialScrollIndex={data.length - 1}
            contentContainerStyle={styles.listContentContainer}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}
        <View style={styles.inputContainer}>
          <TextInput
            value={message}
            style={styles.input}
            onChangeText={setMessage}
            placeholder="Ecrivez votre message..."
          />
          {message.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                sendMessage(message);
              }}
              style={[styles.sendButton, { backgroundColor: colors.primary }]}
            >
              <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },

  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },

  listContentContainer: {
    padding: 8,
    paddingHorizontal: 16,
  },

  inputContainer: {
    marginBottom: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
  },

  input: {
    height: 58,
    fontSize: 16,
    borderWidth: 1,
    paddingLeft: 16,
    borderRadius: 8,
    paddingRight: 64,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
  },

  sendButton: {
    right: 32,
    padding: 12,
    borderRadius: 1000,
    position: "absolute",
  },

  item: {
    flexDirection: "row",
  },

  contentContainer: {
    rowGap: 8,
    padding: 8,
    maxWidth: "80%",
    borderRadius: 8,
  },

  usernameText: {
    color: WHITE,
    fontSize: 12,
  },

  contentText: {
    color: WHITE,
    fontSize: 16,
    flexWrap: "wrap",
    fontWeight: "bold",
  },

  dateText: {
    color: WHITE,
    fontSize: 12,
    textAlign: "right",
  },

  separator: {
    height: 8,
  },
});

export default Chat;
