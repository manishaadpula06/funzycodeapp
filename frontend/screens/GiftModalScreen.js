

// screens/GiftModalScreen.js

import React, { useMemo, useState } from "react";
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

const GIFT_RED = require("../assets/images/gift-red.png");
const COINS_IMAGE = require("../assets/images/coins.png");
const TROPHY_IMAGE = require("../assets/images/trophy.png");
const EMPTY_GIFT_IMAGE = require("../assets/images/emptygiftbox.png");
const CONFETTI_IMAGE = require("../assets/images/confetti.png");

const isVeryTiny = width < 330;
const isTiny = width < 350;
const isSmall = width < 380;
const isShort = height < 700;

const clamp = (value, min, max) => Math.max(min, Math.min(value, max));
const SCALE = clamp(width / 390, 0.68, 0.95);
const fs = (value) => Math.round(value * SCALE);
const rs = (value) => Math.round(value * SCALE);

const PAGE_PADDING = isVeryTiny ? 7 : isTiny ? 8 : 10;

const GIFT_SIZE = isVeryTiny ? rs(60) : isTiny ? rs(66) : isSmall ? rs(72) : rs(80);
const OPENED_GIFT_SIZE = GIFT_SIZE + rs(6);

const CARD_MIN_HEIGHT = isShort
  ? Math.max(rs(280), height * 0.42)
  : Math.max(rs(315), height * 0.43);

const safeNumber = (value, fallback = 1) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeGiftOptions = (options) => {
  const fallback = [
    { id: "box_1", slot: 1, reward: 0, label: "Empty" },
    { id: "box_2", slot: 2, reward: 50, label: "50 Coins" },
    { id: "box_3", slot: 3, reward: 100, label: "100 Coins" },
  ];

  if (!Array.isArray(options) || options.length === 0) {
    return fallback;
  }

  const normalized = options.slice(0, 3).map((gift, index) => ({
    id: gift?.id ?? `box_${index + 1}`,
    slot: gift?.slot ?? index + 1,
    reward: Number.isFinite(Number(gift?.reward)) ? Number(gift.reward) : 0,
    label: gift?.label ?? `Box ${index + 1}`,
  }));

  while (normalized.length < 3) {
    normalized.push(fallback[normalized.length]);
  }

  return normalized;
};

export default function GiftModalScreen({ navigation, route }) {
  const {
    TOTAL_LEVELS,
    coins,
    stars,
    soundEnabled,
    currentLevel,
    getLevel,
    getGiftOptions,
    getOpenedGift,
    openGift,
    toggleSound,
  } = useGame();

  const completedLevel = useMemo(() => {
    const routeLevel =
      route?.params?.completedLevel ??
      route?.params?.level ??
      route?.params?.currentLevel ??
      Math.max(1, currentLevel - 1);

    const parsedLevel = Math.floor(safeNumber(routeLevel, 1));
    return Math.max(1, Math.min(parsedLevel, TOTAL_LEVELS));
  }, [
    route?.params?.completedLevel,
    route?.params?.level,
    route?.params?.currentLevel,
    currentLevel,
    TOTAL_LEVELS,
  ]);

  const levelInfo = useMemo(() => {
    return getLevel(completedLevel) || {};
  }, [getLevel, completedLevel]);

  const giftOptions = useMemo(() => {
    return normalizeGiftOptions(getGiftOptions(completedLevel));
  }, [getGiftOptions, completedLevel]);

  const openedGift = getOpenedGift(completedLevel);
  const alreadyOpened = !!openedGift;

  const [localMessage, setLocalMessage] = useState("");

  const nextLevel = useMemo(() => {
    return Math.min(completedLevel + 1, TOTAL_LEVELS);
  }, [completedLevel, TOTAL_LEVELS]);

  const isLastLevel = completedLevel >= TOTAL_LEVELS;

  const screenMode = useMemo(() => {
    if (!openedGift) return "before";
    if (Number(openedGift.reward) === 100) return "coins100";
    if (Number(openedGift.reward) === 50) return "coins50";
    return "empty";
  }, [openedGift]);

  const isRewardSuccess = screenMode === "coins50" || screenMode === "coins100";
  const isEmptyReward = screenMode === "empty";

  const handleOpenGift = (gift) => {
    if (alreadyOpened) {
      setLocalMessage("Gift already opened for this level.");
      return;
    }

    const result = openGift(completedLevel, gift.id);
    setLocalMessage(result?.message || "Gift opened!");
  };

  const handleNextLevel = () => {
    if (!alreadyOpened) {
      setLocalMessage("Open one gift box first.");
      return;
    }

    if (isLastLevel) {
      navigation?.navigate?.("RouteMapScreen", {
        currentLevel: TOTAL_LEVELS,
      });
      return;
    }

    navigation?.navigate?.("RouteMapScreen", {
      level: nextLevel,
    });
  };

  const handleOpenRouteMap = () => {
    navigation?.navigate?.("RouteMapScreen", {
      currentLevel: nextLevel,
    });
  };

  const handleBack = () => {
    navigation?.navigate?.("LiveResultScreen", {
      level: completedLevel,
    });
  };

  const handleSound = () => {
    toggleSound();
  };

  const getGiftImage = (gift) => {
    const isOpened = openedGift?.id === gift.id;

    if (!isOpened) return GIFT_RED;
    if (Number(gift.reward) === 0) return EMPTY_GIFT_IMAGE;
    return COINS_IMAGE;
  };

  const getInstructionText = () => {
    if (screenMode === "before") {
      return "Pick one gift box.\nOne is empty, one has 50 coins,\none has 100 coins.";
    }

    if (screenMode === "coins100") {
      return "Congratulations!\nYou found 100 coins!";
    }

    if (screenMode === "coins50") {
      return "Great!\nYou found 50 coins!";
    }

    return "Oh no! It's empty.\nBetter luck next time!";
  };

  const getTapText = () => {
    if (screenMode === "before") {
      return "Tap a gift to open!";
    }

    if (screenMode === "empty") {
      return "Empty box! Try again next level.";
    }

    return `Reward collected! +${openedGift?.reward || 0} coins`;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#051326" />

      <ImageBackground
        source={CONFETTI_IMAGE}
        style={styles.bg}
        imageStyle={styles.bgImage}
      >
        <View style={styles.darkOverlay} />

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
              <Ionicons name="arrow-back" size={rs(22)} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.headerPill}>
              <Image source={COINS_IMAGE} style={styles.headerCoinIcon} />
              <Text numberOfLines={1} style={styles.headerText}>
                {coins}
              </Text>
            </View>

            <View style={styles.headerPill}>
              <Text style={styles.headerStarIcon}>★</Text>
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

          <View style={styles.trophySection}>
            <View style={styles.glowCircle} />

            <Ionicons
              name="leaf"
              size={rs(25)}
              color="#63C846"
              style={styles.leftLeaf}
            />

            <Image source={TROPHY_IMAGE} style={styles.trophy} />

            <Ionicons
              name="leaf"
              size={rs(25)}
              color="#63C846"
              style={styles.rightLeaf}
            />
          </View>

          <View style={styles.cardWrap}>
            <View style={styles.whiteCard}>
              <View style={styles.ribbon}>
                <Text numberOfLines={1} style={styles.ribbonText}>
                  Level {completedLevel} Complete!
                </Text>
              </View>

              <View style={styles.cardTop}>
                <Text numberOfLines={1} style={styles.levelTitle}>
                  {levelInfo?.title || "Gift Level"}
                </Text>

                <Text style={styles.pickText}>{getInstructionText()}</Text>
              </View>

              <View style={styles.giftRow}>
                {giftOptions.map((gift, index) => {
                  const isOpened = openedGift?.id === gift.id;
                  const isLocked = alreadyOpened && !isOpened;

                  return (
                    <TouchableOpacity
                      key={gift.id || `gift-${index}`}
                      style={[
                        styles.giftBtn,
                        isLocked && styles.lockedGift,
                        isOpened && styles.openedGift,
                      ]}
                      activeOpacity={alreadyOpened ? 1 : 0.85}
                      onPress={() => handleOpenGift(gift)}
                    >
                      <View style={styles.giftImageWrap}>
                        <Image
                          source={getGiftImage(gift)}
                          style={[
                            styles.giftImage,
                            isOpened && styles.openedGiftImage,
                            isOpened && Number(gift.reward) === 0 && styles.emptyGiftImage,
                            isOpened && Number(gift.reward) > 0 && styles.coinGiftImage,
                          ]}
                        />

                        {isOpened && Number(gift.reward) > 0 && (
                          <View style={styles.rewardBadge}>
                            <Text style={styles.rewardText}>+{gift.reward}</Text>
                          </View>
                        )}

                        {isLocked && (
                          <View style={styles.lockOverlay}>
                            <Ionicons
                              name="lock-closed"
                              size={rs(15)}
                              color="#FFFFFF"
                            />
                          </View>
                        )}
                      </View>

                      <Text numberOfLines={1} style={styles.giftLabel}>
                        {isOpened ? gift.label : `Box ${gift.slot || index + 1}`}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View
                style={[
                  styles.tapBox,
                  isRewardSuccess && styles.successTapBox,
                  isEmptyReward && styles.emptyTapBox,
                ]}
              >
                <View
                  style={[
                    styles.tapIconCircle,
                    isRewardSuccess && styles.successIconCircle,
                    isEmptyReward && styles.emptyIconCircle,
                  ]}
                >
                  <Ionicons
                    name={
                      screenMode === "before"
                        ? "hand-left-outline"
                        : isEmptyReward
                        ? "sad-outline"
                        : "checkmark"
                    }
                    size={rs(22)}
                    color={screenMode === "before" ? "#6B3D0D" : "#FFFFFF"}
                  />
                </View>

                <Text
                  numberOfLines={2}
                  style={[
                    styles.tapText,
                    isRewardSuccess && styles.successTapText,
                    isEmptyReward && styles.emptyTapText,
                  ]}
                >
                  {getTapText()}
                </Text>
              </View>

              {!!localMessage && (
                <View style={styles.messageBox}>
                  <Text numberOfLines={1} style={styles.messageText}>
                    {localMessage}
                  </Text>
                </View>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.nextBtn, !alreadyOpened && styles.waitingBtn]}
            activeOpacity={0.9}
            onPress={handleNextLevel}
          >
            <View style={styles.bottomIconBox}>
              <Image source={TROPHY_IMAGE} style={styles.bottomTrophy} />
            </View>

            <View style={styles.bottomTextBox}>
              <Text numberOfLines={1} style={styles.bottomBtnTitle}>
                {isLastLevel ? "Finish Game" : "Next Level"}
              </Text>
              <Text numberOfLines={1} style={styles.bottomBtnSub}>
                {isLastLevel ? "Complete your journey" : `Continue to Level ${nextLevel}`}
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={rs(27)} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.routeBtn}
            activeOpacity={0.9}
            onPress={handleOpenRouteMap}
          >
            <View style={styles.bottomIconBox}>
              <Ionicons name="map" size={rs(28)} color="#FFFFFF" />
            </View>

            <View style={styles.bottomTextBox}>
              <Text numberOfLines={1} style={styles.bottomBtnTitle}>
                View Route Map
              </Text>
              <Text numberOfLines={1} style={styles.bottomBtnSub}>
                See your learning path
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={rs(27)} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.bottomSpace} />
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#051326",
  },

  bg: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  bgImage: {
    resizeMode: "cover",
  },

  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(2, 10, 29, 0.78)",
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: PAGE_PADDING,
    paddingTop: Platform.OS === "android" ? rs(8) : rs(5),
    paddingBottom: rs(14),
  },

  header: {
    marginTop: Platform.OS === "android" ? rs(8) : rs(3),
    minHeight: isTiny ? rs(40) : rs(44),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: rs(7),
  },

  backBtn: {
    width: isTiny ? rs(39) : rs(43),
    height: isTiny ? rs(39) : rs(43),
    borderRadius: rs(11),
    backgroundColor: "#FFC53B",
    borderWidth: 2,
    borderColor: "#A96200",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },

  soundBtn: {
    width: isTiny ? rs(39) : rs(43),
    height: isTiny ? rs(39) : rs(43),
    borderRadius: rs(11),
    backgroundColor: "#62C92B",
    borderWidth: 2,
    borderColor: "#147C17",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },

  soundBtnOff: {
    backgroundColor: "#777777",
    borderColor: "#555555",
  },

  headerPill: {
    height: isTiny ? rs(37) : rs(40),
    width: isVeryTiny ? rs(76) : isTiny ? rs(82) : rs(92),
    borderRadius: rs(20),
    backgroundColor: "#071B42",
    borderWidth: 2,
    borderColor: "#087BE8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: rs(5),
    elevation: 5,
  },

  headerCoinIcon: {
    width: isTiny ? rs(23) : rs(26),
    height: isTiny ? rs(23) : rs(26),
    resizeMode: "contain",
    marginRight: rs(5),
  },

  headerStarIcon: {
    color: "#FFD84D",
    fontSize: isTiny ? fs(23) : fs(26),
    fontWeight: "900",
    marginRight: rs(5),
    textShadowColor: "#A96300",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },

  headerText: {
    color: "#FFFFFF",
    fontSize: isTiny ? fs(15) : fs(17),
    fontWeight: "900",
  },

  trophySection: {
    alignSelf: "center",
    width: rs(135),
    height: isShort ? rs(58) : rs(70),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: rs(2),
  },

  glowCircle: {
    position: "absolute",
    width: rs(100),
    height: rs(52),
    borderRadius: rs(50),
    backgroundColor: "rgba(255, 222, 80, 0.18)",
  },

  trophy: {
    width: isShort ? rs(58) : rs(70),
    height: isShort ? rs(58) : rs(70),
    resizeMode: "contain",
    zIndex: 3,
  },

  leftLeaf: {
    position: "absolute",
    left: rs(18),
    bottom: rs(2),
    transform: [{ rotate: "-34deg" }],
  },

  rightLeaf: {
    position: "absolute",
    right: rs(18),
    bottom: rs(2),
    transform: [{ rotate: "34deg" }, { scaleX: -1 }],
  },

  cardWrap: {
    width: "100%",
    marginBottom: rs(9),
  },

  whiteCard: {
    width: "100%",
    minHeight: CARD_MIN_HEIGHT,
    backgroundColor: "#FFF1B6",
    borderRadius: rs(16),
    borderWidth: 3,
    borderColor: "#D27B20",
    paddingHorizontal: rs(10),
    paddingTop: isTiny ? rs(38) : rs(43),
    paddingBottom: rs(10),
    justifyContent: "space-between",
    overflow: "visible",
    elevation: 7,
  },

  ribbon: {
    position: "absolute",
    top: isTiny ? rs(-18) : rs(-21),
    alignSelf: "center",
    width: "86%",
    minHeight: isTiny ? rs(39) : rs(45),
    borderRadius: rs(11),
    backgroundColor: "#D73828",
    borderWidth: 2,
    borderColor: "#8E1E17",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    elevation: 8,
    transform: [{ rotate: "-1deg" }],
  },

  ribbonText: {
    color: "#FFFFFF",
    fontSize: isTiny ? fs(17) : fs(21),
    fontWeight: "900",
    textShadowColor: "#76130F",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },

  cardTop: {
    alignItems: "center",
  },

  levelTitle: {
    color: "#7C3F05",
    fontSize: isTiny ? fs(10) : fs(12),
    fontWeight: "900",
    textAlign: "center",
    marginBottom: rs(3),
  },

  pickText: {
    color: "#5A2708",
    fontSize: isTiny ? fs(12) : fs(14),
    lineHeight: isTiny ? fs(17) : fs(20),
    fontWeight: "900",
    textAlign: "center",
  },

  giftRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: isTiny ? rs(10) : rs(13),
    marginBottom: isTiny ? rs(9) : rs(12),
  },

  giftBtn: {
    width: "31.5%",
    alignItems: "center",
    justifyContent: "center",
  },

  lockedGift: {
    opacity: 0.5,
  },

  openedGift: {
    transform: [{ scale: 1.04 }],
  },

  giftImageWrap: {
    width: OPENED_GIFT_SIZE,
    height: OPENED_GIFT_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },

  giftImage: {
    width: GIFT_SIZE,
    height: GIFT_SIZE,
    resizeMode: "contain",
  },

  openedGiftImage: {
    width: OPENED_GIFT_SIZE,
    height: OPENED_GIFT_SIZE,
  },

  coinGiftImage: {
    width: OPENED_GIFT_SIZE,
    height: OPENED_GIFT_SIZE,
  },

  emptyGiftImage: {
    width: OPENED_GIFT_SIZE,
    height: OPENED_GIFT_SIZE,
  },

  rewardBadge: {
    position: "absolute",
    right: rs(-2),
    bottom: rs(4),
    backgroundColor: "#087BE8",
    borderRadius: rs(10),
    paddingHorizontal: rs(6),
    paddingVertical: rs(1),
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  rewardText: {
    color: "#FFFFFF",
    fontSize: isTiny ? fs(10) : fs(12),
    fontWeight: "900",
  },

  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: rs(16),
    backgroundColor: "rgba(0,0,0,0.27)",
    alignItems: "center",
    justifyContent: "center",
  },

  giftLabel: {
    color: "#5A2E05",
    fontSize: isTiny ? fs(8) : fs(9),
    fontWeight: "900",
    marginTop: rs(1),
    textAlign: "center",
  },

  tapBox: {
    minHeight: isTiny ? rs(50) : rs(58),
    borderRadius: rs(14),
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#E79B18",
    backgroundColor: "rgba(255, 244, 203, 0.9)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: rs(10),
  },

  successTapBox: {
    borderStyle: "solid",
    borderColor: "#FFFFFF",
    backgroundColor: "#19A944",
  },

  emptyTapBox: {
    borderStyle: "solid",
    borderColor: "#FFFFFF",
    backgroundColor: "#E24438",
  },

  tapIconCircle: {
    width: isTiny ? rs(34) : rs(38),
    height: isTiny ? rs(34) : rs(38),
    borderRadius: rs(19),
    backgroundColor: "#FFF7DF",
    borderWidth: 1.5,
    borderColor: "#F1B332",
    alignItems: "center",
    justifyContent: "center",
    marginRight: rs(8),
  },

  successIconCircle: {
    backgroundColor: "#0A7D2E",
    borderColor: "#FFFFFF",
  },

  emptyIconCircle: {
    backgroundColor: "#C9271D",
    borderColor: "#FFFFFF",
  },

  tapText: {
    flex: 1,
    color: "#5A2708",
    fontSize: isTiny ? fs(12) : fs(14),
    lineHeight: isTiny ? fs(16) : fs(19),
    fontWeight: "900",
    textAlign: "left",
  },

  successTapText: {
    color: "#FFFFFF",
  },

  emptyTapText: {
    color: "#FFFFFF",
  },

  messageBox: {
    marginTop: rs(6),
    minHeight: rs(24),
    borderRadius: rs(8),
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#FFD24F",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: rs(8),
  },

  messageText: {
    color: "#0A4A28",
    fontSize: isTiny ? fs(8) : fs(9),
    fontWeight: "900",
    textAlign: "center",
  },

  nextBtn: {
    minHeight: isTiny ? rs(52) : rs(58),
    borderRadius: rs(13),
    backgroundColor: "#22B848",
    borderWidth: 2,
    borderColor: "#0A6D23",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: rs(11),
    marginBottom: rs(8),
    elevation: 5,
  },

  waitingBtn: {
    opacity: 0.92,
  },

  routeBtn: {
    minHeight: isTiny ? rs(52) : rs(58),
    borderRadius: rs(13),
    backgroundColor: "#087BE8",
    borderWidth: 2,
    borderColor: "#075FB2",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: rs(11),
    elevation: 5,
  },

  bottomIconBox: {
    width: isTiny ? rs(40) : rs(45),
    height: isTiny ? rs(40) : rs(45),
    borderRadius: rs(11),
    alignItems: "center",
    justifyContent: "center",
    marginRight: rs(9),
  },

  bottomTrophy: {
    width: isTiny ? rs(34) : rs(38),
    height: isTiny ? rs(34) : rs(38),
    resizeMode: "contain",
  },

  bottomTextBox: {
    flex: 1,
  },

  bottomBtnTitle: {
    color: "#FFFFFF",
    fontSize: isTiny ? fs(16) : fs(18),
    fontWeight: "900",
    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },

  bottomBtnSub: {
    color: "#EFFFF0",
    fontSize: isTiny ? fs(9) : fs(11),
    fontWeight: "800",
    marginTop: rs(1),
  },

  bottomSpace: {
    height: rs(13),
  },
});