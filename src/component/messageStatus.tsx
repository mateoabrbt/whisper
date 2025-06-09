import React from 'react';
import {View, StyleSheet} from 'react-native';

import {Ionicons} from '@expo/vector-icons';

interface MessageStatusProps {
  status: MessageStatus[];
  users: Pick<User, 'id'>[];
}

function MessageStatus({status, users}: MessageStatusProps): React.JSX.Element {
  const userIds = users.map(user => user.id);
  const statusMap = status.reduce((acc, curr) => {
    if (userIds.includes(curr.userId)) {
      acc[curr.userId] = curr;
    }
    return acc;
  }, {});

  return <Ionicons name="checkmark-done" size={16} color="#4CAF50" />;
}

const styles = StyleSheet.create({});

export default MessageStatus;
