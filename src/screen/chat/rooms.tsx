import {useState, useEffect, useCallback} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {LegendList} from '@legendapp/list';
import {Ionicons} from '@expo/vector-icons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

import type {LegendListRenderItemProps} from '@legendapp/list';

import {allRooms} from '@api/room';
import {useSocket} from '@context/socket';
import {useAppSelector} from '@redux/hook';
import {ChatStackScreens} from '@navigation/chatNavigator';

import type {ChatNavNavigationProp} from '@navigation/chatNavigator';

function Rooms(): React.JSX.Element {
  const {socket, isConnected} = useSocket();
  const [data, setData] = useState<Room[]>([]);
  const {session} = useAppSelector(state => state.user);
  const navigate =
    useNavigation<ChatNavNavigationProp<ChatStackScreens.Rooms>>().navigate;

  const getRooms = useCallback(async () => {
    if (!session) {
      console.error('No session found');
      return;
    }
    try {
      const response: Room[] = await allRooms(session.accessToken);
      setData(response);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  }, [session]);

  useEffect(() => {
    getRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!socket || !isConnected) return;

      const handleNewMessage = (newMessage: Message) => {
        socket.emit('receiveMessage', {
          roomId: newMessage.roomId,
          messageId: newMessage.id,
        });

        setData(prevData => {
          const roomIndex = prevData.findIndex(
            room => room.id === newMessage.roomId,
          );

          if (roomIndex !== -1) {
            const existingRoom = prevData[roomIndex];
            const updatedRoom = {
              ...existingRoom,
              messages: [newMessage, ...(existingRoom.messages || [])],
            };

            const newData = [...prevData];
            newData.splice(roomIndex, 1);
            newData.unshift(updatedRoom);
            return newData;
          }

          return prevData;
        });
      };

      socket.on('newMessage', handleNewMessage);

      return () => {
        socket.off('newMessage', handleNewMessage);
      };
    }, [socket, isConnected, setData]),
  );

  const renderItem = useCallback(
    ({item}: LegendListRenderItemProps<Room>) => {
      const {name, description, messages} = item;

      return (
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigate(ChatStackScreens.Chat, {room: item})}>
          <View style={styles.contentContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{name}</Text>
              <Text style={styles.description}>{description}</Text>
            </View>
            {messages.length > 0 && (
              <Text numberOfLines={2} style={styles.message}>
                {messages[0].sender.username} : {messages[0].content}
              </Text>
            )}
          </View>
          <Ionicons
            size={24}
            color="black"
            name="chevron-forward-outline"
            style={{alignSelf: 'center'}}
          />
        </TouchableOpacity>
      );
    },
    [navigate],
  );

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.container}>
      <LegendList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },

  item: {
    padding: 16,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    justifyContent: 'space-between',
  },

  contentContainer: {
    rowGap: 8,
  },

  titleContainer: {
    columnGap: 8,
    alignItems: 'center',
    flexDirection: 'row',
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  description: {
    fontSize: 12,
    color: '#666',
  },

  message: {
    fontSize: 16,
    color: '#333',
  },
});

export default Rooms;
