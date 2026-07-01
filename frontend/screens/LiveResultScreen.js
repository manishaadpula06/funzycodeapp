

// screens/LiveResultScreen.js

import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useGame } from "../context/GameContext";

const { width, height } = Dimensions.get("window");

const COIN_IMAGE = require("../assets/images/coin.png");
const LEVEL_BG = require("../assets/images/level1.png");

const isVeryTiny = width < 330;
const isTiny = width < 350;
const isSmall = width < 380;
const isShort = height < 700;

const clamp = (value, min, max) => Math.max(min, Math.min(value, max));
const SCALE = clamp(width / 390, 0.72, 1);
const fs = (value) => Math.round(value * SCALE);
const rs = (value) => Math.round(value * SCALE);

const PAGE_PADDING = isVeryTiny ? 7 : isTiny ? 8 : 10;

const PREVIEW_HEIGHT = isShort
  ? Math.max(150, Math.min(185, height * 0.25))
  : Math.max(175, Math.min(235, height * 0.28));

let WebViewComponent = null;

if (Platform.OS !== "web") {
  WebViewComponent = require("react-native-webview").WebView;
}

const safeNumber = (value, fallback = 1) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const WEB_IFRAME_STYLE = {
  width: "100%",
  height: "100%",
  border: "0px",
  backgroundColor: "#FFFFFF",
  borderRadius: "12px",
  display: "block",
};

const wrapHtmlForMobile = (html) => {
  const cleanHtml = String(html || "").trim();

  if (!cleanHtml) return "";

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
        <style>
          * {
            box-sizing: border-box;
          }

          html,
          body {
            margin: 0;
            padding: 10px;
            width: 100%;
            min-height: 100%;
            background: #ffffff;
            font-family: Arial, sans-serif;
            overflow-x: hidden;
          }

          h1 {
            font-size: 28px;
            margin: 8px 0 12px;
            color: #111827;
            font-weight: 800;
          }

          h2 {
            font-size: 23px;
            margin: 8px 0 10px;
          }

          h3 {
            font-size: 19px;
            margin: 8px 0 8px;
          }

          p {
            font-size: 14px;
            line-height: 1.45;
            margin: 8px 0;
          }

          button {
            font-size: 13px;
            padding: 5px 8px;
            border-radius: 4px;
            border: 1px solid #999;
          }

          img {
            max-width: 100%;
            height: auto;
          }
        </style>
      </head>
      <body>
        ${cleanHtml}
      </body>
    </html>
  `;
};

function LiveOutputPreview({ html }) {
  const finalHtml = useMemo(() => wrapHtmlForMobile(html), [html]);

  if (!finalHtml) {
    return (
      <View style={styles.previewFallback}>
        <Text style={styles.previewFallbackTitle}>Preview</Text>
        <Text style={styles.previewFallbackText}>
          Your live output will appear here.
        </Text>
      </View>
    );
  }

  if (Platform.OS === "web") {
    return React.createElement("iframe", {
      key: finalHtml,
      title: "FunzyCode Live Result",
      srcDoc: finalHtml,
      style: WEB_IFRAME_STYLE,
      sandbox: "allow-scripts allow-same-origin allow-forms allow-modals",
    });
  }

  if (!WebViewComponent) {
    return (
      <View style={styles.previewFallback}>
        <Text style={styles.previewFallbackTitle}>Preview</Text>
        <Text style={styles.previewFallbackText}>Live output not available.</Text>
      </View>
    );
  }

  return (
    <WebViewComponent
      key={finalHtml}
      originWhitelist={["*"]}
      source={{ html: finalHtml }}
      javaScriptEnabled
      domStorageEnabled
      mixedContentMode="always"
      automaticallyAdjustContentInsets={false}
      allowsInlineMediaPlayback
      style={styles.webView}
      containerStyle={styles.webViewContainer}
    />
  );
}

export default function LiveResultScreen({ navigation, route }) {
  const {
    TOTAL_LEVELS,
    coins,
    stars,
    soundEnabled,
    currentLevel,
    getLevel,
    getLevelCode,
    buildLiveResultHtml,
    toggleSound,
  } = useGame();

  const levelNumber = useMemo(() => {
    const routeLevel =
      route?.params?.level ??
      route?.params?.completedLevel ??
      route?.params?.currentLevel ??
      currentLevel;

    const parsedLevel = Math.floor(safeNumber(routeLevel, currentLevel || 1));
    return Math.max(1, Math.min(parsedLevel, TOTAL_LEVELS));
  }, [
    route?.params?.level,
    route?.params?.completedLevel,
    route?.params?.currentLevel,
    currentLevel,
    TOTAL_LEVELS,
  ]);

  const levelInfo = useMemo(() => {
    return getLevel(levelNumber) || {};
  }, [getLevel, levelNumber]);

  const code = useMemo(() => {
    return route?.params?.code || getLevelCode(levelNumber) || "";
  }, [route?.params?.code, getLevelCode, levelNumber]);

  const liveHtml = useMemo(() => {
    if (route?.params?.liveHtml) {
      return route.params.liveHtml;
    }

    return buildLiveResultHtml(levelNumber, code);
  }, [route?.params?.liveHtml, buildLiveResultHtml, levelNumber, code]);

  const earnedStars = Math.max(
    1,
    Math.min(3, Number(route?.params?.earnedStars ?? 3))
  );

  const isLastLevel = levelNumber >= TOTAL_LEVELS;
  const nextLevel = isLastLevel ? TOTAL_LEVELS : levelNumber + 1;

  const handleBack = () => {
    navigation?.navigate?.("CodingScreen", {
      level: levelNumber,
    });
  };

  const handleOpenGift = () => {
    navigation?.navigate?.("GiftModalScreen", {
      completedLevel: levelNumber,
      nextLevel,
    });
  };

  const handleOpenRouteMap = () => {
    navigation?.navigate?.("RouteMapScreen", {
      currentLevel: nextLevel,
    });
  };

  const handleSound = () => {
    toggleSound();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0587E8" />

      <ImageBackground
        source={LEVEL_BG}
        style={styles.bg}
        imageStyle={styles.bgImage}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backBtn}
              activeOpacity={0.85}
              onPress={handleBack}
            >
              <Ionicons name="arrow-back" size={rs(23)} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.headerPill}>
              <Image source={COIN_IMAGE} style={styles.coinIcon} />
              <Text numberOfLines={1} style={styles.headerText}>
                {coins}
              </Text>
            </View>

            <View style={styles.headerPill}>
              <Text style={styles.starTopIcon}>★</Text>
              <Text numberOfLines={1} style={styles.headerText}>
                {stars}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.soundBtn, !soundEnabled && styles.soundBtnOff]}
              activeOpacity={0.85}
              onPress={handleSound}
            >
              <Ionicons
                name={soundEnabled ? "volume-high" : "volume-mute"}
                size={rs(20)}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.titleBoardWrap}>
            <View style={styles.titleBoard}>
              <Ionicons
                name="leaf"
                size={rs(21)}
                color="#63C846"
                style={styles.leftLeaf}
              />

              <Text numberOfLines={1} style={styles.titleBoardText}>
                Live Result
              </Text>

              <Ionicons
                name="leaf"
                size={rs(21)}
                color="#63C846"
                style={styles.rightLeaf}
              />
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoLeft}>
              <Ionicons name="server-outline" size={rs(28)} color="#4A5DF0" />

              <View style={styles.infoTextBox}>
                <Text numberOfLines={1} style={styles.infoLabel}>
                  Server
                </Text>
                <Text numberOfLines={1} style={styles.infoValue}>
                  Level {levelNumber}
                </Text>
              </View>
            </View>

            <View style={styles.infoDivider} />

            <View style={styles.infoRight}>
              <Ionicons name="trophy" size={rs(27)} color="#D99212" />

              <View style={styles.starsBox}>
                <Text numberOfLines={1} style={styles.earnedTitle}>
                  Earned Stars
                </Text>

                <View style={styles.earnedStarsRow}>
                  {[1, 2, 3].map((star) => (
                    <Text
                      key={star}
                      style={[
                        styles.earnedStar,
                        star > earnedStars && styles.earnedStarOff,
                      ]}
                    >
                      ★
                    </Text>
                  ))}
                </View>
              </View>
            </View>
          </View>

          <View style={styles.outputCard}>
            <View style={styles.outputHeader}>
              <View style={styles.outputHeaderLeft}>
                <Ionicons name="code-slash" size={rs(25)} color="#6DFF38" />
                <Text numberOfLines={1} style={styles.outputHeaderText}>
                  Your Live Output
                </Text>
              </View>

              <Ionicons name="expand-outline" size={rs(23)} color="#FFFFFF" />
            </View>

            <View style={styles.previewOuter}>
              <LiveOutputPreview html={liveHtml} />
            </View>

            <TouchableOpacity
              style={styles.giftBtn}
              activeOpacity={0.9}
              onPress={handleOpenGift}
            >
              <View style={styles.actionIconBox}>
                <Ionicons name="gift" size={rs(31)} color="#FFE24D" />
              </View>

              <View style={styles.actionTextBox}>
                <Text numberOfLines={1} style={styles.actionTitle}>
                  {isLastLevel ? "Open Final Gift" : "Open Gift"}
                </Text>
                <Text numberOfLines={1} style={styles.actionSub}>
                  Claim your rewards!
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={rs(30)} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.mapBtn}
              activeOpacity={0.9}
              onPress={handleOpenRouteMap}
            >
              <View style={styles.actionIconBox}>
                <Ionicons name="map" size={rs(31)} color="#FFFFFF" />
              </View>

              <View style={styles.actionTextBox}>
                <Text numberOfLines={1} style={styles.actionTitle}>
                  Go to Route Map
                </Text>
                <Text numberOfLines={1} style={styles.actionSub}>
                  Continue your journey!
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={rs(30)} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.tipBox}>
              <View style={styles.tipIconBox}>
                <Ionicons name="bulb" size={rs(22)} color="#F6B318" />
              </View>

              <Text numberOfLines={2} style={styles.tipText}>
                Great job! Keep learning and complete more levels.
              </Text>
            </View>
          </View>

          <View style={styles.bottomSpace} />
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0587E8",
  },

  bg: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  bgImage: {
    resizeMode: "cover",
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: PAGE_PADDING,
    paddingTop: Platform.OS === "android" ? rs(9) : rs(5),
    paddingBottom: rs(16),
  },

  header: {
    marginTop: Platform.OS === "android" ? rs(10) : rs(4),
    minHeight: rs(43),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: rs(8),
  },

  backBtn: {
    width: isTiny ? rs(40) : rs(44),
    height: isTiny ? rs(40) : rs(44),
    borderRadius: rs(11),
    backgroundColor: "#FFC53B",
    borderWidth: 2,
    borderColor: "#A96200",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 3,
    elevation: 4,
  },

  soundBtn: {
    width: isTiny ? rs(40) : rs(44),
    height: isTiny ? rs(40) : rs(44),
    borderRadius: rs(11),
    backgroundColor: "#62C92B",
    borderWidth: 2,
    borderColor: "#147C17",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 3,
    elevation: 4,
  },

  soundBtnOff: {
    backgroundColor: "#777777",
    borderColor: "#555555",
  },

  headerPill: {
    height: isTiny ? rs(38) : rs(42),
    width: isVeryTiny ? rs(75) : isTiny ? rs(82) : rs(92),
    borderRadius: rs(18),
    backgroundColor: "#062A48",
    borderWidth: 2,
    borderColor: "#5C9DDB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: rs(5),
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 3,
    elevation: 4,
  },

  coinIcon: {
    width: isTiny ? rs(24) : rs(27),
    height: isTiny ? rs(24) : rs(27),
    resizeMode: "contain",
    marginRight: rs(5),
  },

  starTopIcon: {
    color: "#FFD736",
    fontSize: isTiny ? fs(24) : fs(27),
    fontWeight: "900",
    marginRight: rs(5),
    textShadowColor: "#A96300",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },

  headerText: {
    color: "#FFFFFF",
    fontSize: isTiny ? fs(14) : fs(16),
    fontWeight: "900",
    textShadowColor: "rgba(0,0,0,0.28)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },

  titleBoardWrap: {
    alignItems: "center",
    marginBottom: rs(8),
  },

  titleBoard: {
    width: isTiny ? "66%" : "64%",
    minHeight: isTiny ? rs(43) : rs(50),
    borderRadius: rs(10),
    backgroundColor: "#0D7A2A",
    borderWidth: 2,
    borderColor: "#064B17",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },

  titleBoardText: {
    color: "#FFFFFF",
    fontSize: isTiny ? fs(18) : fs(22),
    fontWeight: "900",
    textShadowColor: "rgba(0,0,0,0.45)",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 1,
  },

  leftLeaf: {
    position: "absolute",
    left: rs(-15),
    bottom: rs(-5),
    transform: [{ rotate: "-35deg" }],
  },

  rightLeaf: {
    position: "absolute",
    right: rs(-15),
    bottom: rs(-5),
    transform: [{ rotate: "35deg" }, { scaleX: -1 }],
  },

  infoCard: {
    minHeight: isTiny ? rs(55) : rs(62),
    borderRadius: rs(11),
    backgroundColor: "#FFF8E9",
    borderWidth: 1.5,
    borderColor: "#E59F2D",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: rs(9),
    paddingVertical: rs(7),
    marginBottom: rs(9),
    shadowColor: "#000",
    shadowOpacity: 0.16,
    shadowRadius: 3,
    elevation: 3,
  },

  infoLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  infoTextBox: {
    marginLeft: rs(7),
    flex: 1,
  },

  infoLabel: {
    color: "#2455C7",
    fontSize: isTiny ? fs(10) : fs(12),
    fontWeight: "900",
  },

  infoValue: {
    color: "#2B160D",
    fontSize: isTiny ? fs(13) : fs(15),
    fontWeight: "900",
    marginTop: rs(1),
  },

  infoDivider: {
    width: 1.5,
    height: "78%",
    backgroundColor: "#C9A472",
    marginHorizontal: rs(9),
  },

  infoRight: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  starsBox: {
    marginLeft: rs(6),
    flex: 1,
  },

  earnedTitle: {
    color: "#2F9E20",
    fontSize: isTiny ? fs(10) : fs(12),
    fontWeight: "900",
  },

  earnedStarsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: rs(2),
  },

  earnedStar: {
    color: "#FFCA2F",
    fontSize: isTiny ? fs(17) : fs(20),
    fontWeight: "900",
    marginRight: rs(2),
    textShadowColor: "#B56700",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },

  earnedStarOff: {
    color: "rgba(0,0,0,0.18)",
    textShadowColor: "transparent",
  },

  outputCard: {
    width: "100%",
    borderRadius: rs(15),
    backgroundColor: "#075D26",
    borderWidth: 2,
    borderColor: "#26943A",
    padding: rs(8),
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 4,
    elevation: 5,
  },

  outputHeader: {
    minHeight: isTiny ? rs(38) : rs(43),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: rs(3),
    marginBottom: rs(6),
  },

  outputHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  outputHeaderText: {
    color: "#FFFFFF",
    fontSize: isTiny ? fs(17) : fs(20),
    fontWeight: "900",
    marginLeft: rs(7),
    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },

  previewOuter: {
    height: PREVIEW_HEIGHT,
    borderRadius: rs(11),
    borderWidth: 2,
    borderColor: "#E8E8E8",
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    marginBottom: rs(8),
  },

  webViewContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  webView: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  previewFallback: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: rs(18),
  },

  previewFallbackTitle: {
    color: "#111827",
    fontSize: fs(15),
    fontWeight: "900",
    marginBottom: rs(4),
  },

  previewFallbackText: {
    color: "#111827",
    fontSize: fs(11),
    fontWeight: "800",
    textAlign: "center",
  },

  giftBtn: {
    minHeight: isTiny ? rs(54) : rs(60),
    borderRadius: rs(12),
    backgroundColor: "#59CD24",
    borderWidth: 2,
    borderColor: "#23880D",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: rs(10),
    marginBottom: rs(8),
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  },

  mapBtn: {
    minHeight: isTiny ? rs(54) : rs(60),
    borderRadius: rs(12),
    backgroundColor: "#087BE8",
    borderWidth: 2,
    borderColor: "#075FB2",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: rs(10),
    marginBottom: rs(8),
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  },

  actionIconBox: {
    width: isTiny ? rs(42) : rs(47),
    height: isTiny ? rs(42) : rs(47),
    borderRadius: rs(11),
    alignItems: "center",
    justifyContent: "center",
    marginRight: rs(9),
  },

  actionTextBox: {
    flex: 1,
  },

  actionTitle: {
    color: "#FFFFFF",
    fontSize: isTiny ? fs(16) : fs(19),
    fontWeight: "900",
    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },

  actionSub: {
    color: "#EFFFF0",
    fontSize: isTiny ? fs(10) : fs(12),
    fontWeight: "800",
    marginTop: rs(1),
    textShadowColor: "rgba(0,0,0,0.25)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },

  tipBox: {
    minHeight: isTiny ? rs(43) : rs(48),
    borderRadius: rs(10),
    backgroundColor: "#FFF8E6",
    borderWidth: 1.5,
    borderColor: "#F0A72A",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: rs(9),
  },

  tipIconBox: {
    width: isTiny ? rs(32) : rs(36),
    height: isTiny ? rs(32) : rs(36),
    borderRadius: rs(18),
    backgroundColor: "#FFF1C6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: rs(8),
  },

  tipText: {
    flex: 1,
    color: "#6B3D0D",
    fontSize: isTiny ? fs(9) : fs(10),
    fontWeight: "900",
    lineHeight: isTiny ? fs(13) : fs(15),
  },

  bottomSpace: {
    height: rs(14),
  },
});