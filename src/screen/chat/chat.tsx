import React, {useCallback, useEffect, useState} from 'react';
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

import type {ListRenderItem} from 'react-native';

import {Ionicons} from '@expo/vector-icons';
import Animated from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect, useRoute, useTheme} from '@react-navigation/native';

import {WHITE} from '@style/colors';
import {roomMessages} from 'api/room';
import {useSocket} from '@context/socket';
import {useAppSelector} from '@redux/hook';
import MessageStatus from '@component/messageStatus';

import type {
  ChatNavRouteProp,
  ChatStackScreens,
} from '@navigation/chatNavigator';

function Chat() {
  const {colors} = useTheme();
  const {socket, isConnected} = useSocket();
  const [data, setData] = useState<Message[]>([]);
  const {user} = useAppSelector(state => state.user);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const {session} = useAppSelector(state => state.user);
  const {room} = useRoute<ChatNavRouteProp<ChatStackScreens.Chat>>().params;
  const usersWithoutCurrentUser = room.users.filter(usr => usr.id !== user?.id);

  const getRoomMessages = useCallback(async () => {
    if (!session) {
      console.error('No session found');
      return;
    }
    setLoading(true);
    try {
      const response = await roomMessages(room.id, session.accessToken);
      setData(response);
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

      const handleNewMessage = (newMessage: Message) => {
        setData(prevData => {
          return [newMessage, ...prevData];
        });
      };

      const handleMessageReceived = (messageStatus: MessageStatus) => {
        setData(prevData => {
          return prevData.map(prevMessage => {
            if (prevMessage.id === messageStatus.messageId) {
              return {
                ...prevMessage,
                status: [...prevMessage.status, messageStatus],
              };
            }
            return prevMessage;
          });
        });
      };

      socket.on('newMessage', handleNewMessage);
      socket.on('messageReceived', handleMessageReceived);

      return () => {
        socket.off('newMessage', handleNewMessage);
        socket.off('messageReceived', handleMessageReceived);
      };
    }, [socket, isConnected, setData]),
  );

  const sendMessage = useCallback(
    (newMessage: string) => {
      if (!socket || !isConnected || !newMessage.trim()) return;
      socket.emit('sendMessage', {
        roomId: room.id,
        content: newMessage,
      });
      setMessage('');
    },
    [room.id, socket, isConnected],
  );

  const itemSeparatorComponent = useCallback(() => {
    return <View style={styles.separator} />;
  }, []);

  const renderItem: ListRenderItem<Message> = useCallback(
    ({item: {content, sender, senderId, createdAt, status}}) => (
      console.log(status),
      (
        <View
          style={[
            styles.item,
            {justifyContent: senderId === user?.id ? 'flex-end' : 'flex-start'},
          ]}>
          <View
            style={[
              styles.contentContainer,
              {backgroundColor: colors.primary},
            ]}>
            <Text numberOfLines={1} style={styles.usernameText}>
              {senderId === user?.id ? 'Vous' : sender?.username}
            </Text>
            <Text style={styles.contentText}>{content}</Text>
            <View style={{flexDirection: 'row', columnGap: 8}}>
              <Text style={styles.dateText}>
                {new Date(createdAt).toLocaleString([], {
                  day: '2-digit',
                  hour: '2-digit',
                  year: '2-digit',
                  month: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
              <MessageStatus status={status} users={usersWithoutCurrentUser} />
            </View>
          </View>
        </View>
      )
    ),
    [user?.id, colors.primary, usersWithoutCurrentUser],
  );

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
        {loading ? (
          <ActivityIndicator
            size="large"
            style={{flex: 1}}
            color={colors.primary}
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
              onPress={() => {
                sendMessage(message);
              }}
              style={[styles.sendButton, {backgroundColor: colors.primary}]}>
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
