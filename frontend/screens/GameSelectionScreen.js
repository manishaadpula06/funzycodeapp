

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Platform,
  ScrollView,
  SafeAreaView,
} from "react-native";
import GameBottomNavigation from "../components/GameBottomNavigation";
import { useAuth } from "../context/AuthContext";
import { useGame } from "../context/GameContext";

const { width, height } = Dimensions.get("window");

const isTiny = width < 350;
const isSmall = width < 380;
const isShort = height < 740;

const COLORS = {
  bg: "#02091F",
  white: "#FFFFFF",
  muted: "rgba(255,255,255,0.70)",
  cyan: "#00D9FF",
  pink: "#FF34F6",
  yellow: "#FFC928",
  orange: "#FFA915",
  blue: "#12BFFF",
};

const STATUSBAR_HEIGHT =
  Platform.OS === "android" ? StatusBar.currentHeight || 24 : 0;

export default function GameSelectionScreen({ navigation }) {
  const { user } = useAuth();
  const { coins, stars } = useGame();

  const displayName = user?.fullName || user?.name || "Coder";
  const firstLetter = String(displayName).trim().charAt(0).toUpperCase() || "C";

  const navigateSafe = (routeNames) => {
    const availableRoutes = navigation?.getState?.()?.routeNames || [];

    const foundRoute = routeNames.find((route) =>
      availableRoutes.includes(route)
    );

    if (foundRoute) {
      navigation.navigate(foundRoute);
    }
  };

  const goToFunGames = () => {
    navigateSafe(["FunGamesScreen", "FunGames"]);
  };

  const goToCodingGames = () => {
    navigateSafe(["RouteMapScreen"]);
  };

  return (
    <View style={styles.root}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <ImageBackground
        source={require("../assets/images/game-bg.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safe}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.profileRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{firstLetter}</Text>
                </View>

                <View>
                  <Text style={styles.userName}>Hi, {displayName}!</Text>

                  <View style={styles.energyRow}>
                    <Text style={styles.energyIcon}>⚡</Text>
                    <Text style={styles.energyText}>{coins}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.starBox}>
                <Text style={styles.starIcon}>★</Text>
                <Text style={styles.starText}>{stars}</Text>
              </View>
            </View>

            {/* Logo */}
            <View style={styles.logoWrap}>
              <Image
                source={require("../assets/images/logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* Title */}
            <View style={styles.titleBox}>
              <Text numberOfLines={2} style={styles.title}>
                Choose Your Game
              </Text>

              <Text numberOfLines={2} style={styles.subtitle}>
                Pick a category and start your adventure
              </Text>
            </View>

            {/* Fun Games Card */}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={goToFunGames}
              style={[styles.card, styles.funCard]}
            >
              <View style={styles.funGlow} />

              <View style={styles.cardLeft}>
                <Text numberOfLines={1} style={styles.cardTitle}>
                  Fun Games
                </Text>

                <Text numberOfLines={2} style={styles.cardDesc}>
                  Play fun challenges, earn stars and unlock rewards!
                </Text>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={goToFunGames}
                  style={styles.orangeButton}
                >
                  <Text style={styles.buttonText}>Play Now</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>

            {/* Coding Games Card */}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={goToCodingGames}
              style={[styles.card, styles.codeCard]}
            >
              <View style={styles.codeGlow} />

              <View style={styles.cardLeft}>
                <Text numberOfLines={1} style={styles.cardTitle}>
                  Coding Games
                </Text>

                <Text numberOfLines={2} style={styles.cardDesc}>
                  Solve coding puzzles, learn logic and build your skills!
                </Text>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={goToCodingGames}
                  style={styles.blueButton}
                >
                  <Text style={styles.buttonText}>Explore</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </ScrollView>

          <GameBottomNavigation navigation={navigation} activeTab="Home" />
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  safe: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? STATUSBAR_HEIGHT + 8 : 8,
    paddingBottom: 105,
  },

  header: {
    height: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: isTiny ? 34 : 38,
    height: isTiny ? 34 : 38,
    borderRadius: isTiny ? 17 : 19,
    borderWidth: 1.5,
    borderColor: COLORS.cyan,
    backgroundColor: "rgba(0,217,255,0.13)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  avatarText: {
    color: COLORS.white,
    fontSize: isTiny ? 13 : 15,
    fontWeight: "900",
  },

  userName: {
    color: COLORS.white,
    fontSize: isTiny ? 12 : 14,
    fontWeight: "900",
  },

  energyRow: {
    marginTop: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  energyIcon: {
    color: COLORS.yellow,
    fontSize: isTiny ? 10 : 12,
    fontWeight: "900",
    marginRight: 3,
  },

  energyText: {
    color: COLORS.white,
    fontSize: isTiny ? 10 : 12,
    fontWeight: "900",
  },

  starBox: {
    height: isTiny ? 34 : 38,
    minWidth: isTiny ? 78 : 88,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "rgba(0,217,255,0.55)",
    backgroundColor: "rgba(2,16,48,0.82)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },

  starIcon: {
    color: COLORS.yellow,
    fontSize: isTiny ? 15 : 17,
    fontWeight: "900",
    marginRight: 7,
  },

  starText: {
    color: COLORS.white,
    fontSize: isTiny ? 14 : 16,
    fontWeight: "900",
  },

  logoWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: isShort ? 2 : 6,
  },

  logo: {
    width: isTiny ? 108 : isSmall ? 122 : 138,
    height: isTiny ? 66 : isSmall ? 74 : 84,
  },

  titleBox: {
    alignItems: "center",
    marginTop: isShort ? 8 : 12,
    marginBottom: isShort ? 16 : 20,
    paddingHorizontal: 12,
  },

  title: {
    color: COLORS.white,
    fontSize: isTiny ? 27 : isSmall ? 30 : 33,
    lineHeight: isTiny ? 34 : isSmall ? 37 : 40,
    fontWeight: "900",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 6,
    color: COLORS.muted,
    fontSize: isTiny ? 10.5 : isSmall ? 11.5 : 12.5,
    lineHeight: isTiny ? 15 : 17,
    fontWeight: "800",
    textAlign: "center",
  },

  card: {
    width: "100%",
    minHeight: isShort ? 132 : 148,
    borderRadius: 22,
    marginBottom: 16,
    overflow: "hidden",
    backgroundColor: "rgba(2,10,38,0.84)",
    justifyContent: "center",
    paddingHorizontal: isTiny ? 16 : 20,
    paddingVertical: isTiny ? 12 : 14,
  },

  funCard: {
    borderWidth: 2,
    borderColor: COLORS.pink,
    shadowColor: COLORS.pink,
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },

  codeCard: {
    borderWidth: 2,
    borderColor: COLORS.cyan,
    shadowColor: COLORS.cyan,
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },

  funGlow: {
    position: "absolute",
    right: -50,
    top: -50,
    width: 165,
    height: 165,
    borderRadius: 83,
    backgroundColor: "rgba(255,39,236,0.16)",
  },

  codeGlow: {
    position: "absolute",
    right: -50,
    top: -50,
    width: 165,
    height: 165,
    borderRadius: 83,
    backgroundColor: "rgba(0,217,255,0.14)",
  },

  cardLeft: {
    width: "100%",
    zIndex: 2,
  },

  cardTitle: {
    color: COLORS.white,
    fontSize: isTiny ? 23 : isSmall ? 25 : 27,
    fontWeight: "900",
  },

  cardDesc: {
    marginTop: 7,
    color: "rgba(255,255,255,0.82)",
    fontSize: isTiny ? 10.8 : isSmall ? 11.8 : 12.8,
    lineHeight: isTiny ? 15 : isSmall ? 16 : 17,
    fontWeight: "700",
    maxWidth: "78%",
  },

  orangeButton: {
    marginTop: 12,
    height: isTiny ? 36 : 40,
    width: isTiny ? 116 : 132,
    borderRadius: 22,
    backgroundColor: COLORS.orange,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.orange,
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 8,
  },

  blueButton: {
    marginTop: 12,
    height: isTiny ? 36 : 40,
    width: isTiny ? 108 : 124,
    borderRadius: 22,
    backgroundColor: COLORS.blue,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.blue,
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 8,
  },

  buttonText: {
    color: COLORS.white,
    fontSize: isTiny ? 12.5 : 14,
    fontWeight: "900",
  },
});