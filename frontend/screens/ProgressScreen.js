// screens/ProgressScreen.js

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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GameBottomNavigation from "../components/GameBottomNavigation";
import { useGame } from "../context/GameContext";

const { width } = Dimensions.get("window");

const COLORS = {
  bg: "#02091F",
  white: "#FFFFFF",
  muted: "rgba(255,255,255,0.70)",
  cyan: "#00D9FF",
  yellow: "#FFC928",
  blue: "#12BFFF",
  card: "rgba(1, 10, 30, 0.86)",
  border: "rgba(0,217,255,0.38)",
};

const STATUSBAR_HEIGHT = Platform.OS === "android" ? StatusBar.currentHeight || 24 : 0;
const isTiny = width < 350;

export default function ProgressScreen({ navigation }) {
  const { coins, stars, completedCount, totalLevels, progressText, currentLevel, syncing } = useGame();

  const stats = [
    { id: "coins", label: "Coins", value: coins, icon: "flash", color: COLORS.yellow },
    { id: "stars", label: "Stars", value: stars, icon: "star", color: COLORS.yellow },
    { id: "done", label: "Completed", value: progressText, icon: "trophy", color: COLORS.cyan },
    { id: "level", label: "Current Level", value: currentLevel, icon: "map", color: COLORS.blue },
  ];

  const percent = Math.round((completedCount / totalLevels) * 100);

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ImageBackground source={require("../assets/images/game-bg.png")} style={styles.background} resizeMode="cover">
        <SafeAreaView style={styles.safe}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <Text style={styles.title}>Progress</Text>
            <Text style={styles.subtitle}>{syncing ? "Syncing with server..." : "Your coding journey summary"}</Text>

            <View style={styles.progressCard}>
              <Text style={styles.progressPercent}>{percent}%</Text>
              <Text style={styles.progressLabel}>Game Completed</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${percent}%` }]} />
              </View>
            </View>

            <View style={styles.grid}>
              {stats.map((item) => (
                <View key={item.id} style={styles.statCard}>
                  <Ionicons name={item.icon} size={isTiny ? 20 : 24} color={item.color} />
                  <Text style={styles.statValue}>{item.value}</Text>
                  <Text style={styles.statLabel}>{item.label}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
          <GameBottomNavigation navigation={navigation} activeTab="Progress" />
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
  progressCard: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: 24, padding: 18, marginBottom: 18 },
  progressPercent: { color: COLORS.cyan, fontSize: isTiny ? 34 : 42, fontWeight: "900" },
  progressLabel: { color: COLORS.white, fontSize: isTiny ? 14 : 16, fontWeight: "800", marginTop: 4 },
  progressBar: { height: 10, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.12)", marginTop: 14, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 10, backgroundColor: COLORS.cyan },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  statCard: { width: "48%", minHeight: 110, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: 22, padding: 14, justifyContent: "center" },
  statValue: { color: COLORS.white, fontSize: isTiny ? 22 : 26, fontWeight: "900", marginTop: 10 },
  statLabel: { color: COLORS.muted, fontSize: isTiny ? 12 : 14, fontWeight: "800", marginTop: 4 },
});
