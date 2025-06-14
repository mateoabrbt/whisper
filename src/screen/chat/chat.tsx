import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  Platform,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';

import type { ListRenderItem } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRoute, useTheme } from '@react-navigation/native';

import { WHITE } from '@style/colors';
import { useSocket } from '@context/socket';
import { useAppSelector } from '@redux/hook';
import { readMessage, sendMessage } from '@api/message';
import { markRoomMessagesAsRead, roomMessages } from 'api/room';
import MessageStatusCheckmark from '@component/messageStatusCheckmark';

import type {
  ChatNavRouteProp,
  ChatStackScreens,
} from '@navigation/chatNavigator';

function Chat() {
  const { colors } = useTheme();
  const { socket, isConnected } = useSocket();
  const [data, setData] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>('');
  const { user } = useAppSelector(state => state.user);
  const [loading, setLoading] = useState<boolean>(true);
  const { session } = useAppSelector(state => state.user);
  const { room } = useRoute<ChatNavRouteProp<ChatStackScreens.Chat>>().params;
  const userIds = useMemo(() => room.users.map(usr => usr.id), [room.users]);

  const getRoomMessages = useCallback(async () => {
    setLoading(true);
    try {
      const response: Message[] = await roomMessages(
        room.id,
        session?.accessToken!,
      );
      setData(response);
      if (response?.length) {
        await markRoomMessagesAsRead(room.id, session?.accessToken!);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  }, [room.id, session]);

  useEffect(() => {
    getRoomMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!socket || !isConnected) return;

      const handleNewMessage = async (newMessage: Message) => {
        await readMessage({
          messageId: newMessage.id,
          roomId: newMessage.roomId,
          token: session?.accessToken!,
        });
        setData(prevData => {
          return [newMessage, ...prevData];
        });
      };

      const handleMessageStatus = async (messageStatus: MessageStatus) => {
        setData(prevData => {
          const messageIndex = prevData.findIndex(
            prevMessage => prevMessage.id === messageStatus.messageId,
          );

          if (messageIndex !== -1) {
            const currentMessage = prevData[messageIndex];
            const statusArray = currentMessage.status || [];

            const existingStatusIndex = statusArray.findIndex(
              s =>
                s &&
                s.user &&
                messageStatus.user &&
                s.user.id === messageStatus.user.id,
            );

            let updatedStatuses;

            if (existingStatusIndex !== -1) {
              updatedStatuses = [...statusArray];
              updatedStatuses[existingStatusIndex] = messageStatus;
            } else {
              updatedStatuses = [...statusArray, messageStatus];
            }

            const updatedMessage = {
              ...currentMessage,
              status: updatedStatuses,
            };

            const newData = [...prevData];
            newData[messageIndex] = updatedMessage;
            return newData;
          }

          return prevData;
        });
      };

      const handleMultipleMessagesStatus = async (
        messagesStatus: MessageStatus[],
      ) => {
        setData(prevData => {
          const newData = [...prevData];
          messagesStatus.forEach(messageStatus => {
            const messageIndex = newData.findIndex(
              msg => msg.id === messageStatus.messageId,
            );

            if (messageIndex !== -1) {
              const currentMessage = newData[messageIndex];
              const statusArray = currentMessage.status || [];

              const existingStatusIndex = statusArray.findIndex(
                s =>
                  s &&
                  s.user &&
                  messageStatus.user &&
                  s.user.id === messageStatus.user.id,
              );

              let updatedStatuses;

              if (existingStatusIndex !== -1) {
                updatedStatuses = [...statusArray];
                updatedStatuses[existingStatusIndex] = messageStatus;
              } else {
                updatedStatuses = [...statusArray, messageStatus];
              }

              newData[messageIndex] = {
                ...currentMessage,
                status: updatedStatuses,
              };
            }
          });

          return newData;
        });
      };

      socket.on('newMessage', handleNewMessage);
      socket.on('messageRead', handleMessageStatus);
      socket.on('messageDelivered', handleMessageStatus);
      socket.on('messagesRead', handleMultipleMessagesStatus);
      socket.on('messagesDelivered', handleMultipleMessagesStatus);

      return () => {
        socket.off('newMessage', handleNewMessage);
        socket.off('messageRead', handleMessageStatus);
        socket.off('messageDelivered', handleMessageStatus);
        socket.off('messagesRead', handleMultipleMessagesStatus);
        socket.off('messagesDelivered', handleMultipleMessagesStatus);
      };
    }, [socket, isConnected, session?.accessToken]),
  );

  const handleSendMessage = useCallback(
    async (newMessage: string) => {
      const response = await sendMessage({
        roomId: room.id,
        content: newMessage,
        token: session?.accessToken!,
      });
      if (response.error) return;
      setMessage('');
    },
    [room.id, session?.accessToken],
  );

  const itemSeparatorComponent = useCallback(() => {
    return <View style={styles.separator} />;
  }, []);

  const renderItem: ListRenderItem<Message> = useCallback(
    ({ item: { content, sender, senderId, createdAt, status } }) => (
      <View
        style={[
          styles.item,
          { justifyContent: senderId === user?.id ? 'flex-end' : 'flex-start' },
        ]}
      >
        <View
          style={[
            styles.contentContainer,
            {
              backgroundColor:
                senderId === user?.id ? colors.primary : colors.card,
            },
          ]}
        >
          <Text
            numberOfLines={1}
            style={[
              styles.usernameText,
              { color: senderId === user?.id ? WHITE : colors.text },
            ]}
          >
            {senderId === user?.id ? 'Vous' : sender?.username}
          </Text>
          <Text
            style={[
              styles.contentText,
              { color: senderId === user?.id ? WHITE : colors.text },
            ]}
          >
            {content}
          </Text>
          <View style={{ flexDirection: 'row', columnGap: 8 }}>
            <Text
              style={[
                styles.dateText,
                { color: senderId === user?.id ? WHITE : colors.text },
              ]}
            >
              {new Date(createdAt).toLocaleString([], {
                day: '2-digit',
                hour: '2-digit',
                year: '2-digit',
                month: '2-digit',
                minute: '2-digit',
              })}
            </Text>
            {senderId === user?.id && (
              <MessageStatusCheckmark
                status={status}
                userIds={userIds.filter(id => id !== senderId)}
              />
            )}
          </View>
        </View>
      </View>
    ),
    [colors, userIds, user?.id],
  );

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={styles.activityIndicator}
          />
        ) : (
          <Animated.FlatList
            inverted
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            keyboardDismissMode="interactive"
            ItemSeparatorComponent={itemSeparatorComponent}
            contentContainerStyle={styles.listContentContainer}
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
              style={[styles.sendButton, { backgroundColor: colors.primary }]}
              onPress={() => {
                handleSendMessage(message);
              }}
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
    backgroundColor: '#fff',
    justifyContent: 'center',
  },

  activityIndicator: {
    flex: 1,
  },

  listContentContainer: {
    padding: 8,
    paddingHorizontal: 16,
  },

  inputContainer: {
    marginBottom: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },

  input: {
    height: 58,
    fontSize: 16,
    borderWidth: 1,
    paddingLeft: 16,
    borderRadius: 8,
    paddingRight: 64,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },

  sendButton: {
    right: 32,
    padding: 12,
    borderRadius: 1000,
    position: 'absolute',
  },

  item: {
    flexDirection: 'row',
  },

  contentContainer: {
    rowGap: 8,
    padding: 8,
    maxWidth: '80%',
    borderRadius: 8,
  },

  usernameText: {
    color: WHITE,
    fontSize: 12,
  },

  contentText: {
    color: WHITE,
    fontSize: 16,
    flexWrap: 'wrap',
    fontWeight: 'bold',
  },

  dateText: {
    color: WHITE,
    fontSize: 12,
    textAlign: 'right',
  },

  separator: {
    height: 8,
  },
});

export default Chat;
