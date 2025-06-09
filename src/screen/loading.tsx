import React from 'react';
import {ActivityIndicator, StyleSheet, View, Text} from 'react-native';

import {useTheme} from '@react-navigation/native';

function Loading(): React.JSX.Element {
  const {colors} = useTheme();

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <ActivityIndicator size={'large'} color={colors.primary} />
      <Text style={[styles.text, {color: colors.primary}]}>
        Chargement en cours...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    rowGap: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    fontSize: 25,
    fontWeight: 'bold',
  },
});

export default Loading;
