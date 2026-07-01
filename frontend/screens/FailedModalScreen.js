// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   ImageBackground,
//   TouchableOpacity,
//   SafeAreaView,
//   StatusBar,
//   Dimensions,
//   Platform,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";

// const { width, height } = Dimensions.get("window");

// const TIMER_IMAGE = require("../assets/images/timer.png");
// const LEVEL_BG = require("../assets/images/level1.png");

// export default function FailedModalScreen({ navigation, route }) {
//   const [coins, setCoins] = useState(route?.params?.coins ?? 250);
//   const [stars, setStars] = useState(route?.params?.stars ?? 10);

//   const handleAddTime = () => {
//     if (coins < 50) return;

//     setCoins((prev) => prev - 50);

//     navigation?.navigate?.("CodingScreen", {
//       level: route?.params?.level ?? 1,
//       coins: coins - 50,
//       stars,
//       extraTime: 30,
//       keepCode: true,
//     });
//   };

//   const handleAutoFix = () => {
//     if (stars < 1) return;

//     setStars((prev) => prev - 1);

//     navigation?.navigate?.("CodingScreen", {
//       level: route?.params?.level ?? 1,
//       coins,
//       stars: stars - 1,
//       autoFix: true,
//     });
//   };

//   const handleRetryLevel = () => {
//     navigation?.navigate?.("CodingScreen", {
//       level: route?.params?.level ?? 1,
//       coins,
//       stars,
//       resetLevel: true,
//     });
//   };

//   const handleClose = () => {
//     navigation?.navigate?.("RouteMapScreen", {
//       coins,
//       stars,
//     });
//   };

//   return (
//     <SafeAreaView style={styles.safe}>
//       <StatusBar barStyle="light-content" backgroundColor="#061A13" />

//       <ImageBackground
//         source={LEVEL_BG}
//         style={styles.bg}
//         imageStyle={styles.bgImage}
//       >
//         <View style={styles.darkOverlay} />

//         <View style={styles.centerWrap}>
//           <View style={styles.modalCard}>
//             <View style={styles.ribbon}>
//               <Text style={styles.ribbonText}>Time Over!</Text>
//             </View>

//             <Text style={styles.message}>
//               Use a power to continue{"\n"}or retry the level.
//             </Text>

//             <View style={styles.powerRow}>
//               <TouchableOpacity
//                 activeOpacity={0.85}
//                 style={[styles.powerBtn, styles.timeBtn, coins < 50 && styles.disabledBtn]}
//                 onPress={handleAddTime}
//               >
//                 <View style={styles.powerIconCircle}>
//                   <Image source={TIMER_IMAGE} style={styles.timerIcon} />
//                 </View>
//                 <Text style={styles.powerTitle}>+30s</Text>
//                 <Text style={styles.powerSub}>50 coins</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 activeOpacity={0.85}
//                 style={[styles.powerBtn, styles.autoBtn, stars < 1 && styles.disabledBtn]}
//                 onPress={handleAutoFix}
//               >
//                 <Ionicons name="flash" size={34} color="#FFFFFF" />
//                 <Text style={styles.powerTitle}>Auto Fix</Text>
//                 <Text style={styles.powerSub}>1 star</Text>
//               </TouchableOpacity>
//             </View>

//             <TouchableOpacity
//               activeOpacity={0.9}
//               style={styles.retryBtn}
//               onPress={handleRetryLevel}
//             >
//               <Text style={styles.retryText}>Retry Level</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               activeOpacity={0.9}
//               style={styles.closeBtn}
//               onPress={handleClose}
//             >
//               <Text style={styles.closeText}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ImageBackground>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safe: {
//     flex: 1,
//     backgroundColor: "#061A13",
//   },

//   bg: {
//     flex: 1,
//     width: "100%",
//     height: "100%",
//   },

//   bgImage: {
//     resizeMode: "cover",
//   },

//   darkOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: "rgba(2, 11, 25, 0.55)",
//   },

//   centerWrap: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 14,
//   },

//   modalCard: {
//     width: Math.min(width - 26, 370),
//     minHeight: height < 720 ? 370 : 410,
//     backgroundColor: "#FFF1B6",
//     borderRadius: 18,
//     borderWidth: 4,
//     borderColor: "#D98B22",
//     paddingHorizontal: 16,
//     paddingTop: 46,
//     paddingBottom: 16,
//     alignItems: "center",
//   },

//   ribbon: {
//     position: "absolute",
//     top: 13,
//     alignSelf: "center",
//     minWidth: width < 360 ? 230 : 260,
//     height: 44,
//     borderRadius: 9,
//     backgroundColor: "#D83A2A",
//     borderWidth: 3,
//     borderColor: "#8D1F16",
//     alignItems: "center",
//     justifyContent: "center",
//     transform: [{ rotate: "-1deg" }],
//     zIndex: 5,
//   },

//   ribbonText: {
//     color: "#FFFFFF",
//     fontSize: width < 360 ? 24 : 28,
//     fontWeight: "900",
//     textShadowColor: "#7A160F",
//     textShadowOffset: { width: 1, height: 2 },
//     textShadowRadius: 1,
//   },

//   message: {
//     color: "#201408",
//     fontSize: width < 360 ? 13 : 15,
//     lineHeight: width < 360 ? 18 : 20,
//     fontWeight: "900",
//     textAlign: "center",
//     marginTop: 14,
//     marginBottom: 18,
//   },

//   powerRow: {
//     width: "100%",
//     flexDirection: "row",
//     justifyContent: "space-between",
//     gap: 14,
//     marginBottom: 17,
//   },

//   powerBtn: {
//     flex: 1,
//     height: width < 360 ? 116 : 130,
//     borderRadius: 13,
//     borderWidth: 3,
//     borderColor: "#FFFFFF",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   timeBtn: {
//     backgroundColor: "#178CE8",
//   },

//   autoBtn: {
//     backgroundColor: "#873AD9",
//   },

//   disabledBtn: {
//     opacity: 0.6,
//   },

//   powerIconCircle: {
//     width: 47,
//     height: 47,
//     borderRadius: 25,
//     backgroundColor: "#FFFFFF",
//     borderWidth: 2,
//     borderColor: "#C8E5FF",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 5,
//   },

//   timerIcon: {
//     width: 35,
//     height: 35,
//     resizeMode: "contain",
//   },

//   powerTitle: {
//     color: "#FFFFFF",
//     fontSize: width < 360 ? 14 : 16,
//     fontWeight: "900",
//     marginTop: 3,
//   },

//   powerSub: {
//     color: "#FFFFFF",
//     fontSize: width < 360 ? 10 : 11,
//     fontWeight: "800",
//     marginTop: 2,
//   },

//   retryBtn: {
//     width: "100%",
//     height: 37,
//     borderRadius: 10,
//     backgroundColor: "#22B945",
//     borderWidth: 3,
//     borderColor: "#11872B",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 10,
//   },

//   retryText: {
//     color: "#FFFFFF",
//     fontSize: 13,
//     fontWeight: "900",
//   },

//   closeBtn: {
//     width: "100%",
//     height: 37,
//     borderRadius: 10,
//     backgroundColor: "#A26314",
//     borderWidth: 3,
//     borderColor: "#7B4308",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   closeText: {
//     color: "#FFFFFF",
//     fontSize: 13,
//     fontWeight: "900",
//   },
// });




















































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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useGame } from "../context/GameContext";

const { width, height } = Dimensions.get("window");

const TIMER_IMAGE = require("../assets/images/timer.png");
const LEVEL_BG = require("../assets/images/level1.png");

const safeNumber = (value, fallback = 1) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export default function FailedModalScreen({ navigation, route }) {
  const {
    TOTAL_LEVELS,
    GAME_LIMITS,
    coins,
    stars,
    currentLevel,
    getLevel,
    addExtraTime,
    autoFixLevel,
    resetLevel,
  } = useGame();

  const [localMessage, setLocalMessage] = useState("");

  const levelNumber = useMemo(() => {
    const routeLevel =
      route?.params?.level ??
      route?.params?.currentLevel ??
      route?.params?.startLevel ??
      currentLevel;

    const parsedLevel = Math.floor(safeNumber(routeLevel, currentLevel || 1));

    return Math.max(1, Math.min(parsedLevel, TOTAL_LEVELS));
  }, [
    route?.params?.level,
    route?.params?.currentLevel,
    route?.params?.startLevel,
    currentLevel,
    TOTAL_LEVELS,
  ]);

  const levelInfo = useMemo(() => {
    return getLevel(levelNumber);
  }, [getLevel, levelNumber]);

  const extraTimeUsed = route?.params?.extraTimeUsed ?? 0;

  const extraTimeDisabled = coins < GAME_LIMITS.EXTRA_TIME_COST_COINS;
  const autoFixDisabled = stars < GAME_LIMITS.AUTOFIX_COST_STARS;

  const handleAddTime = () => {
    const result = addExtraTime(levelNumber);

    if (!result.ok) {
      setLocalMessage(result.message);
      return;
    }

    navigation?.navigate?.("CodingScreen", {
      level: levelNumber,
    });
  };

  const handleAutoFix = () => {
    const result = autoFixLevel(levelNumber);

    if (!result.ok) {
      setLocalMessage(result.message);
      return;
    }

    navigation?.navigate?.("CodingScreen", {
      level: levelNumber,
    });
  };

  const handleRetryLevel = () => {
    resetLevel(levelNumber);

    navigation?.navigate?.("CodingScreen", {
      level: levelNumber,
      resetLevel: true,
    });
  };

  const handleClose = () => {
    navigation?.navigate?.("RouteMapScreen", {
      currentLevel: levelNumber,
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#061A13" />

      <ImageBackground
        source={LEVEL_BG}
        style={styles.bg}
        imageStyle={styles.bgImage}
      >
        <View style={styles.darkOverlay} />

        <View style={styles.centerWrap}>
          <View style={styles.modalCard}>
            <View style={styles.ribbon}>
              <Text style={styles.ribbonText}>Time Over!</Text>
            </View>

            <Text style={styles.levelTitle}>
              Level {levelNumber}: {levelInfo.title}
            </Text>

            <Text style={styles.message}>
              Use a power to continue{"\n"}or retry the level.
            </Text>

            <View style={styles.statsRow}>
              <View style={styles.statPill}>
                <Text style={styles.coinDot}>●</Text>
                <Text style={styles.statText}>{coins} Coins</Text>
              </View>

              <View style={styles.statPill}>
                <Text style={styles.starIcon}>★</Text>
                <Text style={styles.statText}>{stars} Stars</Text>
              </View>
            </View>

            <View style={styles.powerRow}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={[
                  styles.powerBtn,
                  styles.timeBtn,
                  extraTimeDisabled && styles.disabledBtn,
                ]}
                onPress={handleAddTime}
              >
                <View style={styles.powerIconCircle}>
                  <Image source={TIMER_IMAGE} style={styles.timerIcon} />
                </View>

                <Text style={styles.powerTitle}>+30s</Text>

                <Text style={styles.powerSub}>
                  {GAME_LIMITS.EXTRA_TIME_COST_COINS} coins
                </Text>

                <Text style={styles.limitText}>
                  Limit {extraTimeUsed}/{GAME_LIMITS.MAX_EXTRA_TIME_PER_LEVEL}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                style={[
                  styles.powerBtn,
                  styles.autoBtn,
                  autoFixDisabled && styles.disabledBtn,
                ]}
                onPress={handleAutoFix}
              >
                <Ionicons name="flash" size={34} color="#FFFFFF" />

                <Text style={styles.powerTitle}>Auto Fix</Text>

                <Text style={styles.powerSub}>
                  {GAME_LIMITS.AUTOFIX_COST_STARS} star
                </Text>

                <Text style={styles.limitText}>Fill correct code</Text>
              </TouchableOpacity>
            </View>

            {!!localMessage && (
              <View style={styles.messageBox}>
                <Text style={styles.messageBoxText}>{localMessage}</Text>
              </View>
            )}

            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.retryBtn}
              onPress={handleRetryLevel}
            >
              <Text style={styles.retryText}>Retry Level</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.closeBtn}
              onPress={handleClose}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#061A13",
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
    backgroundColor: "rgba(2, 11, 25, 0.55)",
  },

  centerWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  modalCard: {
    width: Math.min(width - 26, 370),
    minHeight: height < 720 ? 400 : 440,
    backgroundColor: "#FFF1B6",
    borderRadius: 18,
    borderWidth: 4,
    borderColor: "#D98B22",
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 16,
    alignItems: "center",
  },

  ribbon: {
    position: "absolute",
    top: 13,
    alignSelf: "center",
    minWidth: width < 360 ? 230 : 260,
    height: 44,
    borderRadius: 9,
    backgroundColor: "#D83A2A",
    borderWidth: 3,
    borderColor: "#8D1F16",
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "-1deg" }],
    zIndex: 5,
  },

  ribbonText: {
    color: "#FFFFFF",
    fontSize: width < 360 ? 24 : 28,
    fontWeight: "900",
    textShadowColor: "#7A160F",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 1,
  },

  levelTitle: {
    color: "#7A3E05",
    fontSize: width < 360 ? 13 : 15,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 4,
  },

  message: {
    color: "#201408",
    fontSize: width < 360 ? 13 : 15,
    lineHeight: width < 360 ? 18 : 20,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 9,
    marginBottom: 12,
  },

  statsRow: {
    width: "100%",
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },

  statPill: {
    flex: 1,
    height: 30,
    borderRadius: 16,
    backgroundColor: "#F5C636",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  coinDot: {
    color: "#D98B22",
    fontSize: 15,
    fontWeight: "900",
    marginRight: 5,
  },

  starIcon: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
    marginRight: 5,
    textShadowColor: "#8B5A00",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },

  statText: {
    color: "#5A3B00",
    fontSize: 11,
    fontWeight: "900",
  },

  powerRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 14,
    marginBottom: 12,
  },

  powerBtn: {
    flex: 1,
    height: width < 360 ? 124 : 138,
    borderRadius: 13,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
  },

  timeBtn: {
    backgroundColor: "#178CE8",
  },

  autoBtn: {
    backgroundColor: "#873AD9",
  },

  disabledBtn: {
    opacity: 0.6,
  },

  powerIconCircle: {
    width: 47,
    height: 47,
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#C8E5FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },

  timerIcon: {
    width: 35,
    height: 35,
    resizeMode: "contain",
  },

  powerTitle: {
    color: "#FFFFFF",
    fontSize: width < 360 ? 14 : 16,
    fontWeight: "900",
    marginTop: 3,
  },

  powerSub: {
    color: "#FFFFFF",
    fontSize: width < 360 ? 10 : 11,
    fontWeight: "800",
    marginTop: 2,
  },

  limitText: {
    color: "#EFFFF0",
    fontSize: width < 360 ? 8 : 9,
    fontWeight: "900",
    marginTop: 3,
  },

  messageBox: {
    width: "100%",
    minHeight: 34,
    borderRadius: 9,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#FFD24F",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginBottom: 10,
  },

  messageBoxText: {
    color: "#0A4A28",
    fontSize: width < 360 ? 9 : 10,
    fontWeight: "900",
    textAlign: "center",
  },

  retryBtn: {
    width: "100%",
    height: 37,
    borderRadius: 10,
    backgroundColor: "#22B945",
    borderWidth: 3,
    borderColor: "#11872B",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  retryText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },

  closeBtn: {
    width: "100%",
    height: 37,
    borderRadius: 10,
    backgroundColor: "#A26314",
    borderWidth: 3,
    borderColor: "#7B4308",
    alignItems: "center",
    justifyContent: "center",
  },

  closeText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },
});