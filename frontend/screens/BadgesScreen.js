// screens/BadgesScreen.js

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
const isTiny = width < 350;

const COLORS = {
  bg: "#02091F",
  white: "#FFFFFF",
  muted: "rgba(255,255,255,0.70)",
  cyan: "#00D9FF",
  yellow: "#FFC928",
  card: "rgba(1, 10, 30, 0.86)",
  border: "rgba(0,217,255,0.38)",
};

const STATUSBAR_HEIGHT = Platform.OS === "android" ? StatusBar.currentHeight || 24 : 0;

export default function BadgesScreen({ navigation }) {
  const { completedCount, coins, stars } = useGame();

  const badges = [
    { id: "starter", title: "Starter", note: "Complete level 1", unlocked: completedCount >= 1, icon: "rocket" },
    { id: "coder", title: "Coder", note: "Complete 5 levels", unlocked: completedCount >= 5, icon: "code-slash" },
    { id: "champ", title: "Champion", note: "Complete 10 levels", unlocked: completedCount >= 10, icon: "trophy" },
    { id: "coins", title: "Coin Collector", note: "Collect 500 coins", unlocked: coins >= 500, icon: "flash" },
    { id: "stars", title: "Star Player", note: "Keep 10 stars", unlocked: stars >= 10, icon: "star" },
    { id: "legend", title: "Legend", note: "Complete all 50 levels", unlocked: completedCount >= 50, icon: "ribbon" },
  ];

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ImageBackground source={require("../assets/images/game-bg.png")} style={styles.background} resizeMode="cover">
        <SafeAreaView style={styles.safe}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <Text style={styles.title}>Badges</Text>
            <Text style={styles.subtitle}>Unlock badges by playing levels</Text>

            <View style={styles.grid}>
              {badges.map((badge) => (
                <View key={badge.id} style={[styles.badgeCard, !badge.unlocked && styles.lockedCard]}>
                  <View style={styles.iconCircle}>
                    <Ionicons name={badge.unlocked ? badge.icon : "lock-closed"} size={isTiny ? 20 : 24} color={badge.unlocked ? COLORS.yellow : COLORS.muted} />
                  </View>
                  <Text style={styles.badgeTitle}>{badge.title}</Text>
                  <Text style={styles.badgeNote}>{badge.note}</Text>
                  <Text style={[styles.statusText, badge.unlocked && styles.unlockedText]}>
                    {badge.unlocked ? "Unlocked" : "Locked"}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
          <GameBottomNavigation navigation={navigation} activeTab="Badges" />
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
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  badgeCard: { width: "48%", minHeight: 148, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: 22, padding: 14, alignItems: "center", justifyContent: "center" },
  lockedCard: { opacity: 0.68 },
  iconCircle: { width: 48, height: 48, borderRadius: 24, borderWidth: 1, borderColor: COLORS.border, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,217,255,0.10)" },
  badgeTitle: { color: COLORS.white, fontSize: isTiny ? 14 : 16, fontWeight: "900", marginTop: 10, textAlign: "center" },
  badgeNote: { color: COLORS.muted, fontSize: isTiny ? 10 : 12, fontWeight: "700", marginTop: 5, textAlign: "center" },
  statusText: { color: COLORS.muted, fontSize: isTiny ? 10 : 12, fontWeight: "900", marginTop: 9 },
  unlockedText: { color: COLORS.cyan },
});
