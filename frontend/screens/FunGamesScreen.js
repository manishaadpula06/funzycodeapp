

// screens/FunGamesScreen.js

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  Platform,
  Image,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import GameBottomNavigation from "../components/GameBottomNavigation";

const { width, height } = Dimensions.get("window");

const isVeryTiny = width < 330;
const isTiny = width < 350;
const isSmall = width < 380;
const isShort = height < 740;

const clamp = (value, min, max) => Math.max(min, Math.min(value, max));
const SCALE = clamp(width / 390, 0.72, 1);
const fs = (value) => Math.round(value * SCALE);
const rs = (value) => Math.round(value * SCALE);

const COLORS = {
  header: "#03182A",
  headerDark: "#0F0749",
  bg: "#F8FAFF",
  white: "#FFFFFF",
  text: "#172033",
  subText: "#6B7280",
  blue: "#155DFF",
  purple: "#7B3FF2",
  border: "rgba(15, 23, 42, 0.08)",
  warningBg: "#FFF7D6",
  warningBorder: "#F4C430",
  warningText: "#5A3B00",
};

const games = [
  // {
  //   id: "jungleRun",
  //   title: "Jungle Coin Escape",
  //   image: require("../assets/images/jungleRun/runner-logo.png"),
  //   route: "JungleCoinEscape",
  //   componentName: "JungleCoinEscapeScreen",
  //   badge: "New",
  // },
  {
    id: "memory",
    title: "Memory Match",
    image: require("../assets/images/memorymatch.png"),
    route: "MemoryMatch",
    componentName: "MemoryMatchScreen",
  },
  {
    id: "wordhunt",
    title: "Word Hunt",
    image: require("../assets/images/wordhunt.png"),
    route: "WordHuntGame",
    componentName: "WordHuntGameScreen",
  },
  {
    id: "maze",
    title: "Maze Escape",
    image: require("../assets/images/mazeescape.png"),
    route: "MazeEscapeScreen",
    componentName: "MazeEscapeScreen",
  },
  {
    id: "chess",
    title: "Chess Game",
    image: require("../assets/images/chessgame.png"),
    route: "ChessGame",
    componentName: "ChessGameScreen",
  },
  {
    id: "quiz",
    title: "Quiz Game",
    image: require("../assets/images/quizgame.png"),
    route: "QuizGame",
    componentName: "QuizGameScreen",
  },
  {
    id: "car",
    title: "Car Game",
    image: require("../assets/images/cargame.png"),
    route: "CarGame",
    componentName: "CarGameScreen",
  },
  //  {
  //   id: "Water",
  //   title: "Water-Sort Game",
  //   image: require("../assets/images/water-sort/watersortlogo.png"),
  //   route: "WaterSort",
  //   componentName: "WaterSortScreen",
  // },
];

export default function FunGamesScreen({ navigation }) {
  const [navMessage, setNavMessage] = useState("");

  const getCurrentRouteNames = () => {
    const currentRoutes = navigation?.getState?.()?.routeNames || [];
    const parentNavigation = navigation?.getParent?.();
    const parentRoutes = parentNavigation?.getState?.()?.routeNames || [];

    return {
      currentRoutes,
      parentRoutes,
      parentNavigation,
    };
  };

  const goBack = () => {
    setNavMessage("");

    if (navigation?.canGoBack?.()) {
      navigation.goBack();
      return;
    }

    const { currentRoutes, parentRoutes, parentNavigation } =
      getCurrentRouteNames();

    if (currentRoutes.includes("GameSelection")) {
      navigation.navigate("GameSelection");
      return;
    }

    if (parentRoutes.includes("GameSelection")) {
      parentNavigation.navigate("GameSelection");
      return;
    }

    if (currentRoutes.includes("Home")) {
      navigation.navigate("Home");
      return;
    }

    if (parentRoutes.includes("Home")) {
      parentNavigation.navigate("Home");
      return;
    }

    if (currentRoutes.includes("Login")) {
      navigation.navigate("Login");
      return;
    }

    if (parentRoutes.includes("Login")) {
      parentNavigation.navigate("Login");
    }
  };

  const openGame = (game) => {
    setNavMessage("");

    const { currentRoutes, parentRoutes, parentNavigation } =
      getCurrentRouteNames();

    if (currentRoutes.includes(game.route)) {
      navigation.navigate(game.route);
      return;
    }

    if (parentRoutes.includes(game.route)) {
      parentNavigation.navigate(game.route);
      return;
    }

    setNavMessage(
      `${game.title} screen is not added in App.js. Add: <Stack.Screen name="${game.route}" component={${game.componentName}} />`
    );
  };

  const renderGameCard = (item) => {
    const isJungleRun = item.id === "jungleRun";

    return (
      <TouchableOpacity
        key={item.id}
        activeOpacity={0.9}
        onPress={() => openGame(item)}
        style={[styles.card, isJungleRun && styles.featureCard]}
      >
        {!!item.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        )}

        <View style={[styles.imageBox, isJungleRun && styles.logoImageBox]}>
          <Image
            source={item.image}
            style={[styles.gameImage, isJungleRun && styles.logoImage]}
            resizeMode="contain"
          />
        </View>

        <Text numberOfLines={2} adjustsFontSizeToFit style={styles.gameTitle}>
          {item.title}
        </Text>

        <LinearGradient
          colors={
            isJungleRun
              ? ["#0B8F2A", "#66D51F"]
              : ["#04102C", "#7B3FF2"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.playButton}
        >
          <Ionicons name="play" size={fs(13)} color={COLORS.white} />
          <Text style={styles.playText}>Play</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.header} />

      <LinearGradient
        colors={[COLORS.header, COLORS.headerDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={goBack}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={rs(24)} color={COLORS.white} />
        </TouchableOpacity>

        <View style={styles.headerTextBox}>
          <Text numberOfLines={1} style={styles.headerTitle}>
            Fun Games
          </Text>
          <Text numberOfLines={1} style={styles.headerSubTitle}>
            Choose and play
          </Text>
        </View>

        <View style={styles.headerRightSpace} />
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={styles.scrollContent}
      >
        {!!navMessage && (
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.messageBox}
            onPress={() => setNavMessage("")}
          >
            <Ionicons name="warning" size={rs(17)} color={COLORS.warningText} />
            <Text style={styles.messageText}>{navMessage}</Text>
          </TouchableOpacity>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>All Games</Text>
          <Text style={styles.sectionCount}>{games.length} Games</Text>
        </View>

        <View style={styles.grid}>{games.map(renderGameCard)}</View>
      </ScrollView>

      <GameBottomNavigation navigation={navigation} activeTab="Games" />
    </SafeAreaView>
  );
}

const PAGE_PADDING = isVeryTiny ? rs(10) : rs(12);
const CARD_GAP = isVeryTiny ? rs(8) : rs(10);
const CARD_WIDTH = (width - PAGE_PADDING * 2 - CARD_GAP) / 2;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  scroll: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  header: {
    height: Platform.OS === "ios" ? rs(108) : rs(92),
    paddingTop: Platform.OS === "ios" ? rs(34) : rs(18),
    paddingHorizontal: rs(14),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#003D73",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
  },

  backButton: {
    width: isTiny ? rs(38) : rs(42),
    height: isTiny ? rs(38) : rs(42),
    borderRadius: rs(21),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
  },

  headerTextBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: rs(8),
  },

  headerTitle: {
    color: COLORS.white,
    fontSize: isTiny ? fs(24) : fs(27),
    fontWeight: "900",
    textAlign: "center",
  },

  headerSubTitle: {
    color: "rgba(255,255,255,0.78)",
    fontSize: fs(11),
    fontWeight: "800",
    marginTop: rs(1),
  },

  headerRightSpace: {
    width: isTiny ? rs(38) : rs(42),
    height: isTiny ? rs(38) : rs(42),
  },

  scrollContent: {
    paddingTop: isShort ? rs(14) : rs(18),
    paddingHorizontal: PAGE_PADDING,
    paddingBottom: Platform.OS === "ios" ? rs(126) : rs(116),
  },

  messageBox: {
    backgroundColor: COLORS.warningBg,
    borderWidth: 1.5,
    borderColor: COLORS.warningBorder,
    borderRadius: rs(12),
    paddingHorizontal: rs(10),
    paddingVertical: rs(9),
    marginBottom: rs(12),
    flexDirection: "row",
    alignItems: "center",
  },

  messageText: {
    flex: 1,
    color: COLORS.warningText,
    fontSize: fs(10),
    fontWeight: "900",
    lineHeight: fs(15),
    marginLeft: rs(7),
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: rs(10),
    paddingHorizontal: rs(2),
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: fs(18),
    fontWeight: "900",
  },

  sectionCount: {
    color: COLORS.subText,
    fontSize: fs(11),
    fontWeight: "800",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: CARD_WIDTH,
    minHeight: isVeryTiny ? rs(158) : isTiny ? rs(168) : isSmall ? rs(178) : rs(188),
    backgroundColor: COLORS.white,
    borderRadius: rs(16),
    marginBottom: rs(12),
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: rs(8),
    paddingVertical: isTiny ? rs(10) : rs(12),
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 5,
    overflow: "hidden",
  },

  featureCard: {
    borderWidth: 1.5,
    borderColor: "rgba(34, 184, 72, 0.28)",
    backgroundColor: "#FFFFFF",
  },

  badge: {
    position: "absolute",
    top: rs(8),
    right: rs(8),
    minWidth: rs(35),
    height: rs(18),
    borderRadius: rs(9),
    backgroundColor: "#20B746",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: rs(6),
    zIndex: 2,
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: fs(8),
    fontWeight: "900",
  },

  imageBox: {
    width: isVeryTiny ? rs(70) : isTiny ? rs(76) : isSmall ? rs(82) : rs(88),
    height: isVeryTiny ? rs(70) : isTiny ? rs(76) : isSmall ? rs(82) : rs(88),
    borderRadius: rs(18),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: rs(9),
    backgroundColor: "#F3F6FF",
    overflow: "hidden",
  },

  logoImageBox: {
    width: isVeryTiny ? rs(100) : isTiny ? rs(108) : isSmall ? rs(116) : rs(124),
    height: isVeryTiny ? rs(66) : isTiny ? rs(72) : isSmall ? rs(76) : rs(82),
    borderRadius: rs(14),
    backgroundColor: "#ECFFF1",
    paddingHorizontal: rs(4),
  },

  gameImage: {
    width: isVeryTiny ? rs(60) : isTiny ? rs(66) : isSmall ? rs(72) : rs(78),
    height: isVeryTiny ? rs(60) : isTiny ? rs(66) : isSmall ? rs(72) : rs(78),
  },

  logoImage: {
    width: "100%",
    height: "100%",
  },

  gameTitle: {
    color: COLORS.text,
    fontSize: isVeryTiny ? fs(12) : isTiny ? fs(13) : fs(14),
    lineHeight: isTiny ? fs(16) : fs(18),
    fontWeight: "900",
    textAlign: "center",
    marginBottom: rs(9),
    minHeight: rs(32),
  },

  playButton: {
    width: isVeryTiny ? rs(82) : isTiny ? rs(90) : rs(98),
    height: isVeryTiny ? rs(30) : isTiny ? rs(32) : rs(34),
    borderRadius: rs(18),
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    shadowColor: COLORS.purple,
    shadowOpacity: 0.22,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  playText: {
    color: COLORS.white,
    fontSize: isTiny ? fs(12) : fs(13),
    fontWeight: "900",
    marginLeft: rs(4),
  },
});









































