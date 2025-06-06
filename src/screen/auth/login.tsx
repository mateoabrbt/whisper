import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
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
} from "react-native";

import { login } from "@api/auth";
import { useAppDispatch } from "@redux/hook";
import { updateSession, updateStatus } from "@redux/user/userSlice";
import { setStorageItemAsync } from "@hook/useStorageState";

function Login(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const inputRef = useRef<TextInput>(null);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("Test123!");
  const [email, setEmail] = useState("mateoabribat@orange.fr");

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response: Session = await login(email, password);
      if (response) {
        await setStorageItemAsync("session", response.refreshToken);
        dispatch(
          updateSession({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
          })
        );
        dispatch(updateStatus("connected"));
      } else {
        throw new Error("Login failed, no response received.");
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      keyboardVerticalOffset={24}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        bounces={false}
        keyboardDismissMode="interactive"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <SafeAreaView
          edges={["bottom", "left", "right"]}
          style={styles.container}
        >
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
              style={styles.signInButton}
            >
              <Text style={styles.signInButtonText}>Se connecter</Text>
            </TouchableOpacity>
          )}
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  formContainer: {
    gap: 16,
    width: "100%",
    marginBottom: 32,
  },
  input: {
    height: 48,
    fontSize: 16,
    width: "100%",
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
    paddingHorizontal: 16,
    backgroundColor: "#f9f9f9",
  },
  signInButton: {
    width: "100%",
    borderRadius: 8,
    paddingVertical: 14,
    backgroundColor: "#007AFF",
  },
  signInButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Login;
