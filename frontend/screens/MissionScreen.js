

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
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useGame } from "../context/GameContext";

const { width } = Dimensions.get("window");

const COIN = require("../assets/images/coin.png");
const GIFT = require("../assets/images/gift-red.png");
const TIMER = require("../assets/images/timer.png");
const LEVEL_BG = require("../assets/images/level1.png");

const CARD_WIDTH = Math.min(width * 0.86, 360);

const cardShadow =
  Platform.OS === "web"
    ? {
        boxShadow: "0px 6px 10px rgba(0,0,0,0.35)",
      }
    : {
        shadowColor: "#000",
        shadowOpacity: 0.35,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        elevation: 10,
      };

const buttonShadow =
  Platform.OS === "web"
    ? {
        boxShadow: "0px 3px 4px rgba(0,0,0,0.25)",
      }
    : {
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,
      };

const titleShadow =
  Platform.OS === "web"
    ? {
        textShadow: "2px 3px 1px #6A3800",
      }
    : {
        textShadowColor: "#6A3800",
        textShadowOffset: { width: 2, height: 3 },
        textShadowRadius: 1,
      };

const smallTitleShadow =
  Platform.OS === "web"
    ? {
        textShadow: "1px 2px 1px #004C2D",
      }
    : {
        textShadowColor: "#004C2D",
        textShadowOffset: { width: 1, height: 2 },
        textShadowRadius: 1,
      };

const whiteTextShadow =
  Platform.OS === "web"
    ? {
        textShadow: "1px 1px 1px #0F5914",
      }
    : {
        textShadowColor: "#0F5914",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
      };

const blueTextShadow =
  Platform.OS === "web"
    ? {
        textShadow: "1px 1px 1px #004C83",
      }
    : {
        textShadowColor: "#004C83",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
      };

const levelNumberShadow =
  Platform.OS === "web"
    ? {
        textShadow: "1px 1px 1px #874000",
      }
    : {
        textShadowColor: "#874000",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
      };

const safeNumber = (value, fallback = 1) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export default function MissionScreen({ navigation, route }) {
  const {
    TOTAL_LEVELS,
    GAME_LIMITS,
    gameState,
    coins,
    stars,
    currentLevel,
    completedLevels,
    completedCount,
    progressText,
    soundEnabled,
    getLevel,
    getLevelStatus,
    isLevelCompleted,
    isLevelLocked,
    getGiftOptions,
    startLevel,
    toggleSound,
  } = useGame();

  const [localMessage, setLocalMessage] = useState("");

  const levelNumber = useMemo(() => {
    const routeLevel =
      route?.params?.level ??
      route?.params?.startLevel ??
      route?.params?.currentLevel ??
      currentLevel;

    const parsedLevel = Math.floor(safeNumber(routeLevel, currentLevel || 1));

    return Math.max(1, Math.min(parsedLevel, TOTAL_LEVELS));
  }, [
    route?.params?.level,
    route?.params?.startLevel,
    route?.params?.currentLevel,
    currentLevel,
    TOTAL_LEVELS,
  ]);

  const levelInfo = useMemo(() => {
    return getLevel(levelNumber);
  }, [getLevel, levelNumber]);

  const levelStatus = getLevelStatus(levelNumber);
  const locked = isLevelLocked(levelNumber);
  const completed = isLevelCompleted(levelNumber);

  const houseNumber = Math.floor((levelNumber - 1) / 5) + 1;
  const stepNumber = ((levelNumber - 1) % 5) + 1;
  const houseStartLevel = (houseNumber - 1) * 5 + 1;

  const openedGiftCount = Object.keys(gameState?.openedGifts || {}).length;
  const giftOptions = getGiftOptions(levelNumber);
  const giftRewardText = giftOptions
    .filter((gift) => gift.reward > 0)
    .map((gift) => gift.reward)
    .sort((a, b) => a - b)
    .join(" / ");

  const missions = [
    {
      id: 1,
      title: "Level",
      icon: "trophy",
      value: `${levelNumber}`,
      progress: progressText,
      bg: "#FFF5CF",
      border: "#E4A51B",
    },
    {
      id: 2,
      title: "Gift",
      image: GIFT,
      value: "",
      progress: `${openedGiftCount} / ${TOTAL_LEVELS}`,
      bg: "#FFE1CA",
      border: "#F08A35",
    },
    {
      id: 3,
      title: "Time",
      image: TIMER,
      value: "",
      progress: `${Math.floor(GAME_LIMITS.LEVEL_SECONDS / 60)} Minutes`,
      bg: "#FFE4B5",
      border: "#E29A25",
    },
  ];

  const handleBack = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
      return;
    }

    navigation?.navigate?.("RouteMapScreen");
  };

  const handleStartCoding = () => {
    if (locked) {
      setLocalMessage(`Level ${levelNumber} is locked. Complete Level ${currentLevel} first.`);
      return;
    }

    const result = startLevel(levelNumber);

    if (!result.ok) {
      setLocalMessage(result.message);
      return;
    }

    navigation?.navigate?.("CodingScreen", {
      level: levelNumber,
    });
  };

  const handleOpenRouteMap = () => {
    navigation?.navigate?.("RouteMapScreen", {
      currentLevel: levelNumber,
    });
  };

  const handleSound = () => {
    toggleSound();
  };

  const getButtonText = () => {
    if (locked) return "Locked";
    if (completed) return "Replay Level";
    if (levelStatus === "current") return "Start Coding";
    return "Continue";
  };

  const renderHouseProgress = () => {
    return [1, 2, 3, 4, 5].map((step, index) => {
      const stepLevel = houseStartLevel + index;
      const isOutsideTotal = stepLevel > TOTAL_LEVELS;
      const isStepCompleted = completedLevels.includes(stepLevel);
      const isActive = step === stepNumber && !isStepCompleted && !isOutsideTotal;
      const isStepLocked =
        isOutsideTotal || (!isStepCompleted && stepLevel > currentLevel);

      return (
        <React.Fragment key={`house-step-${step}`}>
          <View
            style={[
              styles.circleStep,
              isStepCompleted && styles.completedStep,
              isActive && styles.activeStep,
              isStepLocked && styles.lockCircle,
            ]}
          >
            {isStepCompleted ? (
              <Ionicons name="checkmark" size={15} color="#FFFFFF" />
            ) : isStepLocked ? (
              <Ionicons name="lock-closed" size={12} color="#FFFFFF" />
            ) : (
              <Text
                style={[
                  styles.activeStepText,
                  !isActive && styles.openStepText,
                ]}
              >
                {step}
              </Text>
            )}
          </View>

          {step !== 5 && (
            <View
              style={[
                styles.progressLine,
                isStepCompleted && styles.completedProgressLine,
              ]}
            />
          )}
        </React.Fragment>
      );
    });
  };

  return (
    <ImageBackground source={LEVEL_BG} style={styles.bg} resizeMode="cover">
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <View style={styles.topBar}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.backBtn}
              onPress={handleBack}
            >
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>

            <View style={styles.coinBox}>
              <Image source={COIN} style={styles.coinIcon} />
              <Text style={styles.coinText}>{coins}</Text>
            </View>

            <View style={styles.topSmallBox}>
              <Ionicons name="star" size={16} color="#FFD84D" />
              <Text style={styles.topSmallText}>{stars}</Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.soundBtn, !soundEnabled && styles.soundBtnOff]}
              onPress={handleSound}
            >
              <Ionicons
                name={soundEnabled ? "volume-high" : "volume-mute"}
                size={17}
                color="#fff"
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.card}>
              <Text style={styles.houseTitle}>House {houseNumber}</Text>

              <Text style={styles.subTitle}>Fix the {levelInfo.title}</Text>

              <View style={styles.progressRow}>{renderHouseProgress()}</View>

              <View style={styles.statusRow}>
                <View
                  style={[
                    styles.statusPill,
                    completed && styles.completedStatusPill,
                    locked && styles.lockedStatusPill,
                  ]}
                >
                  <Text style={styles.statusText}>
                    {completed
                      ? "COMPLETED"
                      : locked
                      ? "LOCKED"
                      : levelStatus === "current"
                      ? "CURRENT"
                      : "OPEN"}
                  </Text>
                </View>

                <View style={styles.progressPill}>
                  <Text style={styles.progressPillText}>
                    {completedCount}/{TOTAL_LEVELS} Done
                  </Text>
                </View>
              </View>

              <View style={styles.missionBox}>
                <View style={styles.missionBadge}>
                  <Text style={styles.missionBadgeText}>Mission</Text>
                </View>

                <Text style={styles.missionText}>
                  Type the HTML code before{"\n"}
                  the {Math.floor(GAME_LIMITS.LEVEL_SECONDS / 60)} minute timer ends.
                </Text>

                <Text style={styles.noteText}>
                  After correct Run, the real live{"\n"}
                  result screen will open.
                </Text>

                <View style={styles.taskBox}>
                  <Text style={styles.taskTitle}>Task</Text>
                  <Text style={styles.taskText}>{levelInfo.taskText}</Text>
                </View>

                <View style={styles.missionCardsRow}>
                  {missions.map((item) => (
                    <View
                      key={item.id}
                      style={[
                        styles.smallMissionCard,
                        {
                          backgroundColor: item.bg,
                          borderColor: item.border,
                        },
                      ]}
                    >
                      <Text style={styles.smallCardTitle}>{item.title}</Text>

                      <View style={styles.smallIconWrap}>
                        {item.image ? (
                          <Image
                            source={item.image}
                            style={styles.smallImageIcon}
                          />
                        ) : (
                          <Ionicons
                            name={item.icon}
                            size={26}
                            color="#D98900"
                          />
                        )}
                      </View>

                      {item.value ? (
                        <Text style={styles.smallValue}>{item.value}</Text>
                      ) : null}

                      <Text style={styles.smallProgress}>{item.progress}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.rewardSection}>
                  <Text style={styles.rewardTitle}>Gift Rewards</Text>

                  <View style={styles.rewardRow}>
                    <View style={styles.rewardItem}>
                      <Image source={GIFT} style={styles.rewardGift} />
                      <Text style={styles.rewardText}>One Box Only</Text>
                    </View>

                    <View style={styles.rewardCoinBox}>
                      <Image source={COIN} style={styles.rewardCoin} />
                      <Text style={styles.rewardCoinText}>
                        {giftRewardText || "0"}
                      </Text>
                    </View>
                  </View>
                </View>

                {!!localMessage && (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.messageBox}
                    onPress={() => setLocalMessage("")}
                  >
                    <Text style={styles.messageText}>{localMessage}</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[
                    styles.startButton,
                    locked && styles.lockedStartButton,
                  ]}
                  onPress={handleStartCoding}
                >
                  <Text style={styles.startButtonText}>{getButtonText()}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.mapButton}
                  onPress={handleOpenRouteMap}
                >
                  <Text style={styles.mapButtonText}>Open Route Map</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  safe: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: Platform.OS === "android" ? 34 : 8,
  },

  topBar: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  backBtn: {
    width: 33,
    height: 33,
    borderRadius: 10,
    backgroundColor: "#D67613",
    borderWidth: 2,
    borderColor: "#FFE29B",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: 2,
  },

  coinBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1B8ED1",
    borderRadius: 18,
    paddingHorizontal: 10,
    height: 30,
    borderWidth: 2,
    borderColor: "#F7E27B",
  },

  coinIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    marginRight: 4,
  },

  coinText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "900",
  },

  topSmallBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1B8ED1",
    borderRadius: 18,
    paddingHorizontal: 9,
    height: 30,
    borderWidth: 2,
    borderColor: "#F7E27B",
  },

  topSmallText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "900",
    marginLeft: 3,
  },

  soundBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#15954E",
    borderWidth: 2,
    borderColor: "#BDF7A5",
    alignItems: "center",
    justifyContent: "center",
  },

  soundBtnOff: {
    backgroundColor: "#777777",
    borderColor: "#CCCCCC",
  },

  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 26,
  },

  card: {
    width: CARD_WIDTH,
    borderRadius: 24,
    backgroundColor: "rgba(255, 199, 71, 0.96)",
    borderWidth: 5,
    borderColor: "#075E33",
    paddingTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 14,
    ...cardShadow,
  },

  houseTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#fff",
    textAlign: "center",
    marginTop: -2,
    ...titleShadow,
  },

  subTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#fff",
    textAlign: "center",
    marginTop: -4,
    ...smallTitleShadow,
  },

  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 9,
    marginBottom: 8,
  },

  circleStep: {
    width: 31,
    height: 31,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    backgroundColor: "#138CDB",
    borderColor: "#B9EDFF",
  },

  activeStep: {
    backgroundColor: "#22A829",
    borderColor: "#E7FF91",
  },

  completedStep: {
    backgroundColor: "#22A829",
    borderColor: "#E7FF91",
  },

  activeStepText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "900",
  },

  openStepText: {
    fontSize: 14,
  },

  lockCircle: {
    backgroundColor: "#5D5D5D",
    borderColor: "#CFCFCF",
  },

  progressLine: {
    width: 22,
    height: 6,
    backgroundColor: "#095B2D",
    borderRadius: 5,
    marginHorizontal: 1,
  },

  completedProgressLine: {
    backgroundColor: "#22A829",
  },

  statusRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginBottom: 8,
  },

  statusPill: {
    minHeight: 24,
    borderRadius: 13,
    backgroundColor: "#138CDB",
    borderWidth: 2,
    borderColor: "#B9EDFF",
    paddingHorizontal: 11,
    alignItems: "center",
    justifyContent: "center",
  },

  completedStatusPill: {
    backgroundColor: "#22A829",
    borderColor: "#E7FF91",
  },

  lockedStatusPill: {
    backgroundColor: "#5D5D5D",
    borderColor: "#CFCFCF",
  },

  statusText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "900",
  },

  progressPill: {
    minHeight: 24,
    borderRadius: 13,
    backgroundColor: "#7A3E05",
    borderWidth: 2,
    borderColor: "#FFD675",
    paddingHorizontal: 11,
    alignItems: "center",
    justifyContent: "center",
  },

  progressPillText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "900",
  },

  missionBox: {
    backgroundColor: "#FFF3C1",
    borderRadius: 18,
    borderWidth: 4,
    borderColor: "#8C5108",
    paddingHorizontal: 10,
    paddingTop: 14,
    paddingBottom: 12,
  },

  missionBadge: {
    alignSelf: "center",
    backgroundColor: "#7A3E05",
    borderRadius: 11,
    paddingHorizontal: 18,
    paddingVertical: 3,
    marginTop: -28,
    borderWidth: 2,
    borderColor: "#FFD675",
  },

  missionBadgeText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "900",
  },

  missionText: {
    color: "#3E2200",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 4,
  },

  noteText: {
    color: "#6B3A00",
    fontSize: 10,
    lineHeight: 13,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 3,
  },

  taskBox: {
    marginTop: 9,
    backgroundColor: "#FFE9A1",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#B66B00",
    paddingHorizontal: 8,
    paddingVertical: 7,
  },

  taskTitle: {
    color: "#663600",
    fontSize: 10,
    fontWeight: "900",
    marginBottom: 2,
  },

  taskText: {
    color: "#4A2A00",
    fontSize: width < 360 ? 9 : 10,
    lineHeight: width < 360 ? 12 : 13,
    fontWeight: "800",
  },

  missionCardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  smallMissionCard: {
    width: "31.5%",
    borderRadius: 13,
    borderWidth: 3,
    paddingVertical: 6,
    alignItems: "center",
    minHeight: 86,
  },

  smallCardTitle: {
    fontSize: 10,
    fontWeight: "900",
    color: "#673400",
    marginBottom: 3,
  },

  smallIconWrap: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },

  smallImageIcon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },

  smallValue: {
    position: "absolute",
    top: 34,
    fontSize: 10,
    fontWeight: "900",
    color: "#fff",
    ...levelNumberShadow,
  },

  smallProgress: {
    fontSize: 9,
    color: "#5A2E00",
    fontWeight: "900",
    marginTop: 4,
    textAlign: "center",
  },

  rewardSection: {
    marginTop: 10,
    backgroundColor: "#FFE9A1",
    borderRadius: 14,
    borderWidth: 3,
    borderColor: "#B66B00",
    paddingVertical: 7,
    paddingHorizontal: 8,
  },

  rewardTitle: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "900",
    color: "#663600",
    marginBottom: 4,
  },

  rewardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  rewardItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  rewardGift: {
    width: 34,
    height: 34,
    resizeMode: "contain",
  },

  rewardText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#663600",
    marginLeft: 4,
  },

  rewardCoinBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8D7",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#D59910",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  rewardCoin: {
    width: 22,
    height: 22,
    resizeMode: "contain",
    marginRight: 4,
  },

  rewardCoinText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#6B3A00",
  },

  messageBox: {
    marginTop: 9,
    minHeight: 30,
    borderRadius: 9,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#FFD24F",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 5,
  },

  messageText: {
    color: "#0A4A28",
    fontSize: width < 360 ? 9 : 10,
    fontWeight: "900",
    textAlign: "center",
  },

  startButton: {
    marginTop: 12,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#28B738",
    borderWidth: 3,
    borderColor: "#D8FF9D",
    alignItems: "center",
    justifyContent: "center",
    ...buttonShadow,
  },

  lockedStartButton: {
    backgroundColor: "#777777",
    borderColor: "#CCCCCC",
  },

  startButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "900",
    ...whiteTextShadow,
  },

  mapButton: {
    marginTop: 8,
    height: 38,
    borderRadius: 13,
    backgroundColor: "#138CDB",
    borderWidth: 3,
    borderColor: "#B9EDFF",
    alignItems: "center",
    justifyContent: "center",
  },

  mapButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "900",
    ...blueTextShadow,
  },
});