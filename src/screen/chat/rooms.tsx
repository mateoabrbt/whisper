import {useState, useEffect, useCallback} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {LegendList} from '@legendapp/list';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

import type {LegendListRenderItemProps} from '@legendapp/list';

import {allRooms} from '@api/room';
import {useSocket} from '@hook/useSocket';
import {useAppSelector} from '@redux/hook';
import {ChatStackScreens} from '@navigation/chatNavigator';

import type {ChatNavNavigationProp} from '@navigation/chatNavigator';

function Rooms(): React.JSX.Element {
  const {socket} = useSocket();
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
  }, []);

  useEffect(() => {
    getRooms();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.emit('connectToRoom');
    socket.on('newMessage', (message: Message) => {
      setData(prevData => {
        const roomIndex = prevData.findIndex(
          room => room.id === message.roomId,
        );

        if (roomIndex !== -1) {
          const updatedRoom = {
            ...prevData[roomIndex],
            messages: [message],
          };

          const newData = [...prevData];
          newData[roomIndex] = updatedRoom;
          return newData;
        }

        return prevData;
      });
    });

    return () => {
      socket.off('newMessage');
    };
  }, [socket]);

  const renderItem = useCallback(
    ({
      item: {id, name, description, messages},
    }: LegendListRenderItemProps<Room>) => (
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigate(ChatStackScreens.Chat, {id})}>
        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
          <Text numberOfLines={2} style={styles.message}>
            {messages?.[0].sender.username} : {messages?.[0].content}
          </Text>
        </View>
        <Ionicons
          size={24}
          color="black"
          name="chevron-forward-outline"
          style={{alignSelf: 'center'}}
        />
      </TouchableOpacity>
    ),
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
