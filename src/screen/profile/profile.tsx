import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

function Profile() {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
  },

  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },

  title: {
    fontSize: 64,
    fontWeight: "bold",
  },

  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },

  logoutButton: {
    elevation: 5,
    marginTop: 40,
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 40,
    backgroundColor: "#FF5252",
    boxShadow: "0 4px 5px rgba(0, 0, 0, 0.3)",
  },

  logoutButtonText: {
    fontSize: 24,
    color: "#fff",
    letterSpacing: 2,
    fontWeight: "bold",
  },
});

export default Profile;
