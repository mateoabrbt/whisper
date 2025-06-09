import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  Platform,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';

import {useTheme} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {login} from '@api/auth';
import {getUser} from '@api/user';
import {useAppDispatch} from '@redux/hook';
import {setStorageItemAsync} from '@hook/useStorageState';
import {updateSession, updateStatus, updateUser} from '@redux/user/userSlice';

function Login(): React.JSX.Element {
  const {colors} = useTheme();
  const dispatch = useAppDispatch();
  const inputRef = useRef<TextInput>(null);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('Test123!');
  const [email, setEmail] = useState('mateoabribat@orange.fr');

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response: Session = await login(email, password);
      if (!response) {
        throw new Error('Failed to login, no response received.');
      }
      const user: User = await getUser(response.accessToken);
      dispatch(updateUser(user));
      await setStorageItemAsync('session', response.refreshToken);
      dispatch(
        updateSession({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        }),
      );
      dispatch(updateStatus('connected'));
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={24}
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        bounces={false}
        keyboardDismissMode="interactive"
        contentContainerStyle={styles.scrollView}>
        <SafeAreaView
          edges={['bottom', 'left', 'right']}
          style={styles.container}>
          <View style={styles.formContainer}>
            <TextInput
              value={email}
              placeholder="Email"
              returnKeyType="next"
              style={styles.input}
              autoCapitalize="none"
              submitBehavior="submit"
              onChangeText={setEmail}
              keyboardType="email-address"
              textContentType="emailAddress"
              onSubmitEditing={() => inputRef.current?.focus()}
            />
            <TextInput
              ref={inputRef}
              secureTextEntry
              value={password}
              style={styles.input}
              returnKeyType="send"
              placeholder="Password"
              textContentType="password"
              onChangeText={setPassword}
              submitBehavior="blurAndSubmit"
            />
          </View>
          {loading ? (
            <View style={styles.signInButton}>
              <ActivityIndicator color="#fff" />
            </View>
          ) : (
            <TouchableOpacity
              disabled={loading}
              onPress={handleLogin}
              style={[styles.signInButton, {backgroundColor: colors.primary}]}>
              <Text style={styles.signInButtonText}>Se connecter</Text>
            </TouchableOpacity>
          )}
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },

  scrollView: {
    flexGrow: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },

  formContainer: {
    gap: 16,
    width: '100%',
    marginBottom: 32,
  },

  input: {
    height: 48,
    fontSize: 16,
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ccc',
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
  },

  signInButton: {
    width: '100%',
    borderRadius: 8,
    paddingVertical: 14,
  },

  signInButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Login;
