import { StyleSheet } from 'react-native';
import React, { useCallback, useMemo } from 'react';

import { Ionicons } from '@expo/vector-icons';

import { WHITE } from '@style/colors';

interface MessageStatusCheckmarkProps {
  userIds: string[];
  status: MessageStatus[];
}

function MessageStatusCheckmark({
  status,
  userIds,
}: MessageStatusCheckmarkProps): React.JSX.Element {
  const isMessageDeliveredToAllUsers = useCallback(() => {
    if (status.length === 0 || userIds.length === 0) return false;
    return userIds.every(userId =>
      status.some(s => s.userId === userId && s.deliveredAt !== null),
    );
  }, [status, userIds]);

  const isMessageReadByAllUsers = useCallback(() => {
    if (status.length === 0 || userIds.length === 0) return false;
    return userIds.every(userId =>
      status.some(s => s.userId === userId && s.readAt !== null),
    );
  }, [status, userIds]);

  return (
    <Ionicons
      size={16}
      name={
        isMessageDeliveredToAllUsers()
          ? 'checkmark-done-circle'
          : 'checkmark-circle'
      }
      color={isMessageReadByAllUsers() ? '#48f542' : WHITE}
    />
  );
}

const styles = StyleSheet.create({});

export default MessageStatusCheckmark;
