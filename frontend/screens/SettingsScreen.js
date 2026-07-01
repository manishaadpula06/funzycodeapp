// screens/SettingsScreen.js

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GameBottomNavigation from "../components/GameBottomNavigation";
import { useAuth } from "../context/AuthContext";
import { useGame } from "../context/GameContext";

const { width } = Dimensions.get("window");
const isTiny = width < 350;

const COLORS = {
  bg: "#02091F",
  white: "#FFFFFF",
  muted: "rgba(255,255,255,0.70)",
  cyan: "#00D9FF",
  red: "#FF5A6A",
  card: "rgba(1, 10, 30, 0.86)",
  border: "rgba(0,217,255,0.38)",
};

const STATUSBAR_HEIGHT = Platform.OS === "android" ? StatusBar.currentHeight || 24 : 0;

export default function SettingsScreen({ navigation }) {
  const { user, logout } = useAuth();
  const { soundEnabled, toggleSound, resetGame, syncing } = useGame();

  const handleLogout = async () => {
    await logout(false);
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  const handleResetGame = () => {
    resetGame();
  };

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ImageBackground source={require("../assets/images/game-bg.png")} style={styles.background} resizeMode="cover">
        <SafeAreaView style={styles.safe}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <Text style={styles.title}>Settings</Text>
            <Text style={styles.subtitle}>{syncing ? "Saving changes..." : "Manage your FunzyCode account"}</Text>

            <View style={styles.profileCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{String(user?.fullName || "C").charAt(0).toUpperCase()}</Text>
              </View>
              <View style={styles.profileTextBox}>
                <Text style={styles.nameText}>{user?.fullName || "Coder"}</Text>
                <Text style={styles.emailText}>{user?.email || ""}</Text>
              </View>
            </View>

            <TouchableOpacity activeOpacity={0.85} onPress={toggleSound} style={styles.optionRow}>
              <Ionicons name={soundEnabled ? "volume-high" : "volume-mute"} size={22} color={COLORS.cyan} />
              <Text style={styles.optionText}>Sound</Text>
              <Text style={styles.optionValue}>{soundEnabled ? "On" : "Off"}</Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.85} onPress={handleResetGame} style={styles.optionRow}>
              <Ionicons name="refresh" size={22} color={COLORS.cyan} />
              <Text style={styles.optionText}>Reset Game</Text>
              <Text style={styles.optionValue}>Restart</Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.85} onPress={handleLogout} style={[styles.optionRow, styles.logoutRow]}>
              <Ionicons name="log-out-outline" size={22} color={COLORS.red} />
              <Text style={[styles.optionText, styles.logoutText]}>Logout</Text>
            </TouchableOpacity>
          </ScrollView>
          <GameBottomNavigation navigation={navigation} activeTab="Settings" />
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  background: { flex: 1, width: "100%", height: "100%" },
  safe: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: Platform.OS === "android" ? STATUSBAR_HEIGHT + 12 : 12, paddingBottom: 105 },
  title: { color: COLORS.white, fontSize: isTiny ? 26 : 30, fontWeight: "900" },
  subtitle: { color: COLORS.muted, fontSize: isTiny ? 13 : 15, fontWeight: "700", marginTop: 6, marginBottom: 18 },
  profileCard: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: 24, padding: 16, flexDirection: "row", alignItems: "center", marginBottom: 18 },
  avatar: { width: 48, height: 48, borderRadius: 24, borderWidth: 1.5, borderColor: COLORS.cyan, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,217,255,0.13)", marginRight: 12 },
  avatarText: { color: COLORS.white, fontSize: 18, fontWeight: "900" },
  profileTextBox: { flex: 1 },
  nameText: { color: COLORS.white, fontSize: isTiny ? 15 : 17, fontWeight: "900" },
  emailText: { color: COLORS.muted, fontSize: isTiny ? 12 : 14, fontWeight: "700", marginTop: 3 },
  optionRow: { minHeight: 58, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: 20, paddingHorizontal: 15, flexDirection: "row", alignItems: "center", marginBottom: 12 },
  optionText: { flex: 1, color: COLORS.white, fontSize: isTiny ? 14 : 16, fontWeight: "900", marginLeft: 12 },
  optionValue: { color: COLORS.muted, fontSize: isTiny ? 12 : 14, fontWeight: "800" },
  logoutRow: { borderColor: "rgba(255,90,106,0.45)", marginTop: 10 },
  logoutText: { color: COLORS.red },
});
