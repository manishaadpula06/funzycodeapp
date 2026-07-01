
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   ImageBackground,
//   ScrollView,
//   TouchableOpacity,
//   Dimensions,
//   StatusBar,
//   Platform,
//   Share,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";

// import { useGame } from "../context/GameContext";

// const { width, height } = Dimensions.get("window");

// const BG_IMAGE = require("../assets/images/routebackground.png");
// const HOUSE_IMAGE = require("../assets/images/houses.png");
// const COIN_IMAGE = require("../assets/images/coin.png");

// const MAP_TOTAL_LEVELS = 50;

// const COLORS = {
//   white: "#FFFFFF",
//   gold: "#FFD84D",
//   darkGold: "#C97A13",
//   dark: "#061B12",
//   black: "#000000",
//   borderGold: "#F9C84A",
//   locked: "#7C8797",
//   green: "#59C52E",
//   greenDark: "#2E8A1C",
//   blue: "#1684E5",
//   blueDark: "#075BAA",
//   brown: "#7C481F",
//   brownDark: "#5B3216",
//   orange: "#F59E0B",
//   orangeDark: "#B45309",
//   red: "#D83A2A",
// };

// const LEVEL_BOX_WIDTH = 118;

// const HOUSE_SIZE = width < 380 ? 70 : 80;
// const ACTIVE_HOUSE_SIZE = width < 380 ? 84 : 94;

// const LEVEL_SPACING = width < 380 ? 128 : 140;

// const TOP_EXTRA_SPACE = height * 0.48;
// const BOTTOM_EXTRA_SPACE = height * 0.65;

// const MAP_HEIGHT =
//   MAP_TOTAL_LEVELS * LEVEL_SPACING + TOP_EXTRA_SPACE + BOTTOM_EXTRA_SPACE;

// const TILE_HEIGHT = width * 1.78;
// const TILE_COUNT = Math.ceil(MAP_HEIGHT / TILE_HEIGHT) + 3;

// const ROAD_X_PATTERN = [
//   0.48,
//   0.61,
//   0.52,
//   0.39,
//   0.47,
//   0.58,
//   0.63,
//   0.5,
//   0.38,
//   0.44,
//   0.56,
//   0.64,
//   0.54,
//   0.41,
//   0.46,
//   0.59,
// ];

// const clamp = (value, min, max) => {
//   return Math.max(min, Math.min(max, value));
// };

// const getRoadLeft = (level) => {
//   const patternIndex = (level - 1) % ROAD_X_PATTERN.length;
//   const x = ROAD_X_PATTERN[patternIndex] * width;

//   return clamp(x, 62, width - 62);
// };

// const levelPositions = Array.from({ length: MAP_TOTAL_LEVELS }, (_, index) => {
//   const level = index + 1;

//   return {
//     level,
//     left: getRoadLeft(level),
//     top: MAP_HEIGHT - BOTTOM_EXTRA_SPACE - index * LEVEL_SPACING,
//   };
// });

// const safeNumber = (value, fallback = 1) => {
//   const parsed = Number(value);
//   return Number.isFinite(parsed) ? parsed : fallback;
// };

// export default function RouteMapScreen({ navigation, route }) {
//   const scrollRef = useRef(null);

//   const {
//     TOTAL_LEVELS,
//     coins,
//     currentLevel,
//     completedStars,
//     completedCount,
//     progressText,
//     soundEnabled,
//     getLevel,
//     getLevelStatus,
//     isLevelCompleted,
//     isLevelLocked,
//     startLevel,
//     toggleSound,
//   } = useGame();

//   const [mapMessage, setMapMessage] = useState("");

//   const scrollTargetLevel = useMemo(() => {
//     const routeLevel =
//       route?.params?.currentLevel ??
//       route?.params?.nextLevel ??
//       route?.params?.level ??
//       currentLevel;

//     const parsedLevel = Math.floor(safeNumber(routeLevel, currentLevel || 1));

//     return Math.max(1, Math.min(parsedLevel, TOTAL_LEVELS));
//   }, [
//     route?.params?.currentLevel,
//     route?.params?.nextLevel,
//     route?.params?.level,
//     currentLevel,
//     TOTAL_LEVELS,
//   ]);

//   const totalPuzzles = TOTAL_LEVELS;

//   useEffect(() => {
//     const currentItem = levelPositions.find(
//       (item) => item.level === scrollTargetLevel
//     );

//     if (currentItem) {
//       const scrollY = Math.max(currentItem.top - height * 0.58, 0);

//       setTimeout(() => {
//         scrollRef.current?.scrollTo({
//           y: scrollY,
//           animated: false,
//         });
//       }, 250);
//     }
//   }, [scrollTargetLevel]);

//   const getStars = (level) => {
//     if (!isLevelCompleted(level)) {
//       return 0;
//     }

//     return completedStars?.[level] || 3;
//   };

//   const handleLevelPress = (level) => {
//     const locked = isLevelLocked(level);

//     if (locked) {
//       setMapMessage(`Level ${level} is locked. Complete Level ${currentLevel} first.`);
//       return;
//     }

//     const result = startLevel(level);

//     if (!result.ok) {
//       setMapMessage(result.message);
//       return;
//     }

//     const levelInfo = getLevel(level);

//     navigation?.navigate?.("MissionScreen", {
//       level,
//       startLevel: level,
//       levelTitle: levelInfo.title,
//     });
//   };

//   const handleShare = async () => {
//     try {
//       await Share.share({
//         title: "FunzyCode Progress",
//         message: `I completed ${completedCount}/${totalPuzzles} levels and I have ${coins} coins in FunzyCode.`,
//       });
//     } catch (error) {
//       setMapMessage("Unable to share now.");
//     }
//   };

//   const handleBack = () => {
//     navigation?.navigate?.("GameSelection");
//   };

//   const handleCoinPlus = () => {
//     setMapMessage("Earn coins by completing levels, gifts, and WhatsApp share.");
//   };

//   const handleSound = () => {
//     toggleSound();
//   };

//   const renderBackgroundTiles = () => {
//     return Array.from({ length: TILE_COUNT }, (_, index) => (
//       <ImageBackground
//         key={`map-tile-${index}`}
//         source={BG_IMAGE}
//         resizeMode="cover"
//         style={[
//           styles.mapTile,
//           {
//             top: index * TILE_HEIGHT,
//             height: TILE_HEIGHT,
//           },
//         ]}
//       />
//     ));
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar
//         translucent
//         backgroundColor="transparent"
//         barStyle="light-content"
//       />

//       <ScrollView
//         ref={scrollRef}
//         style={styles.scrollView}
//         showsVerticalScrollIndicator={false}
//         bounces={false}
//         overScrollMode="never"
//         contentContainerStyle={styles.scrollContent}
//       >
//         <View style={[styles.mapArea, { height: MAP_HEIGHT }]}>
//           {renderBackgroundTiles()}

//           {levelPositions.map((item) => {
//             const level = item.level;
//             const stars = getStars(level);
//             const status = getLevelStatus(level);

//             const locked = status === "locked";
//             const completed = status === "completed";
//             const current = status === "current";

//             const levelInfo = getLevel(level);
//             const houseSize = current ? ACTIVE_HOUSE_SIZE : HOUSE_SIZE;

//             return (
//               <TouchableOpacity
//                 key={level}
//                 activeOpacity={locked ? 1 : 0.88}
//                 onPress={() => handleLevelPress(level)}
//                 style={[
//                   styles.levelWrapper,
//                   {
//                     left: item.left - LEVEL_BOX_WIDTH / 2,
//                     top: item.top - houseSize / 2,
//                   },
//                   current && styles.currentLevelWrapper,
//                   locked && styles.lockedLevelWrapper,
//                 ]}
//               >
//                 <View
//                   pointerEvents="none"
//                   style={[
//                     styles.shadowGlow,
//                     completed && styles.completedShadowGlow,
//                     current && styles.currentShadowGlow,
//                     locked && styles.lockedShadowGlow,
//                   ]}
//                 />

//                 <View
//                   style={[
//                     styles.houseCircle,
//                     {
//                       width: current ? 108 : 96,
//                       height: current ? 104 : 92,
//                     },
//                     locked && styles.lockedHouseCircle,
//                   ]}
//                 >
//                   <Image
//                     source={HOUSE_IMAGE}
//                     resizeMode="contain"
//                     style={[
//                       styles.houseImage,
//                       {
//                         width: houseSize,
//                         height: houseSize,
//                       },
//                       locked && styles.lockedHouseImage,
//                       completed && styles.completedHouseImage,
//                     ]}
//                   />

//                   <View
//                     style={[
//                       styles.levelBadge,
//                       current && styles.currentBadge,
//                       completed && styles.completedBadge,
//                       locked && styles.lockedBadge,
//                     ]}
//                   >
//                     {locked ? (
//                       <Ionicons
//                         name="lock-closed"
//                         size={13}
//                         color={COLORS.white}
//                       />
//                     ) : completed ? (
//                       <Ionicons
//                         name="checkmark"
//                         size={17}
//                         color={COLORS.white}
//                       />
//                     ) : (
//                       <Text
//                         style={[
//                           styles.levelNumber,
//                           current && styles.currentLevelNumber,
//                         ]}
//                       >
//                         {level}
//                       </Text>
//                     )}
//                   </View>
//                 </View>

//                 {!locked && (
//                   <View style={styles.starsRow}>
//                     {[1, 2, 3].map((star) => (
//                       <Ionicons
//                         key={star}
//                         name="star"
//                         size={current ? 16 : 14}
//                         color={
//                           star <= stars
//                             ? COLORS.gold
//                             : current
//                             ? "rgba(255,255,255,0.30)"
//                             : "rgba(255,255,255,0.38)"
//                         }
//                         style={styles.starIcon}
//                       />
//                     ))}
//                   </View>
//                 )}

//                 <View
//                   style={[
//                     styles.levelNameBox,
//                     completed && styles.completedLevelNameBox,
//                     current && styles.currentLevelNameBox,
//                     locked && styles.lockedLevelNameBox,
//                   ]}
//                 >
//                   <Text
//                     style={[
//                       styles.levelNameText,
//                       completed && styles.completedLevelNameText,
//                       current && styles.currentLevelNameText,
//                       locked && styles.lockedLevelNameText,
//                     ]}
//                   >
//                     {completed
//                       ? "COMPLETED"
//                       : current
//                       ? "CURRENT"
//                       : locked
//                       ? "LOCKED"
//                       : "LEVEL"}
//                   </Text>

//                   <Text
//                     numberOfLines={2}
//                     style={[
//                       styles.levelSmallNameText,
//                       locked && styles.lockedSmallNameText,
//                     ]}
//                   >
//                     {levelInfo.title}
//                   </Text>
//                 </View>
//               </TouchableOpacity>
//             );
//           })}
//         </View>
//       </ScrollView>

//       <View pointerEvents="box-none" style={styles.header}>
//         <View style={styles.headerTopRow}>
//           <TouchableOpacity
//             activeOpacity={0.85}
//             style={styles.realBackButton}
//             onPress={handleBack}
//           >
//             <Ionicons name="arrow-back" size={32} color={COLORS.white} />
//           </TouchableOpacity>

//           <View style={styles.coinBox}>
//             <View style={styles.coinIconCircle}>
//               <Image source={COIN_IMAGE} style={styles.coinImage} />
//             </View>

//             <Text style={styles.coinText}>{coins}</Text>

//             <TouchableOpacity
//               activeOpacity={0.85}
//               style={styles.coinPlusButton}
//               onPress={handleCoinPlus}
//             >
//               <Ionicons name="add" size={28} color={COLORS.white} />
//             </TouchableOpacity>
//           </View>

//           <TouchableOpacity
//             activeOpacity={0.85}
//             style={styles.realShareButton}
//             onPress={handleShare}
//           >
//             <Ionicons name="share-social" size={26} color={COLORS.white} />
//           </TouchableOpacity>
//         </View>

//         <View style={styles.progressRow}>
//           <View style={styles.progressPill}>
//             <Ionicons name="flag" size={14} color={COLORS.gold} />
//             <Text style={styles.progressText}>Progress {progressText}</Text>
//           </View>

//           <TouchableOpacity
//             activeOpacity={0.85}
//             style={[
//               styles.soundButton,
//               !soundEnabled && styles.soundButtonOff,
//             ]}
//             onPress={handleSound}
//           >
//             <Ionicons
//               name={soundEnabled ? "volume-high" : "volume-mute"}
//               size={17}
//               color={COLORS.white}
//             />
//           </TouchableOpacity>
//         </View>

//         {!!mapMessage && (
//           <TouchableOpacity
//             activeOpacity={0.9}
//             style={styles.mapMessageBox}
//             onPress={() => setMapMessage("")}
//           >
//             <Text style={styles.mapMessageText}>{mapMessage}</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.dark,
//   },

//   scrollView: {
//     flex: 1,
//     backgroundColor: COLORS.dark,
//   },

//   scrollContent: {
//     minHeight: MAP_HEIGHT,
//     backgroundColor: COLORS.dark,
//   },

//   mapArea: {
//     width: "100%",
//     position: "relative",
//     overflow: "hidden",
//     backgroundColor: COLORS.dark,
//   },

//   mapTile: {
//     position: "absolute",
//     left: 0,
//     width: "100%",
//   },

//   header: {
//     position: "absolute",
//     top: Platform.OS === "ios" ? 52 : 36,
//     left: 14,
//     right: 14,
//     zIndex: 500,
//   },

//   headerTopRow: {
//     width: "100%",
//     height: 62,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },

//   realBackButton: {
//     width: 58,
//     height: 58,
//     borderRadius: 29,
//     backgroundColor: COLORS.orange,
//     borderWidth: 4,
//     borderColor: "#FFD36B",
//     alignItems: "center",
//     justifyContent: "center",
//     shadowColor: COLORS.black,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.35,
//     shadowRadius: 6,
//     elevation: 10,
//   },

//   realShareButton: {
//     width: 58,
//     height: 58,
//     borderRadius: 29,
//     backgroundColor: COLORS.blue,
//     borderWidth: 4,
//     borderColor: "#75C8FF",
//     alignItems: "center",
//     justifyContent: "center",
//     shadowColor: COLORS.black,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.35,
//     shadowRadius: 6,
//     elevation: 10,
//   },

//   coinBox: {
//     height: 58,
//     minWidth: width < 380 ? 150 : 170,
//     maxWidth: 190,
//     paddingHorizontal: 6,
//     borderRadius: 30,
//     backgroundColor: COLORS.brown,
//     borderWidth: 4,
//     borderColor: "#A7652C",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     shadowColor: COLORS.black,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.35,
//     shadowRadius: 6,
//     elevation: 10,
//   },

//   coinIconCircle: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: COLORS.gold,
//     borderWidth: 3,
//     borderColor: "#FFF0A8",
//     alignItems: "center",
//     justifyContent: "center",
//     overflow: "hidden",
//   },

//   coinImage: {
//     width: 36,
//     height: 36,
//     resizeMode: "contain",
//   },

//   coinText: {
//     flex: 1,
//     textAlign: "center",
//     fontSize: width < 380 ? 20 : 23,
//     fontWeight: "900",
//     color: COLORS.white,
//     textShadowColor: "rgba(0,0,0,0.55)",
//     textShadowOffset: { width: 1, height: 2 },
//     textShadowRadius: 2,
//   },

//   coinPlusButton: {
//     width: 42,
//     height: 42,
//     borderRadius: 21,
//     backgroundColor: COLORS.green,
//     borderWidth: 3,
//     borderColor: "#8CF26B",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   progressRow: {
//     marginTop: 8,
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     gap: 8,
//   },

//   progressPill: {
//     minHeight: 31,
//     borderRadius: 16,
//     backgroundColor: "rgba(0,0,0,0.68)",
//     borderWidth: 2,
//     borderColor: COLORS.gold,
//     paddingHorizontal: 12,
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   progressText: {
//     color: COLORS.white,
//     fontSize: width < 380 ? 10 : 11,
//     fontWeight: "900",
//     marginLeft: 5,
//   },

//   soundButton: {
//     width: 33,
//     height: 33,
//     borderRadius: 17,
//     backgroundColor: COLORS.green,
//     borderWidth: 2,
//     borderColor: "#8CF26B",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   soundButtonOff: {
//     backgroundColor: "#777777",
//     borderColor: "#CCCCCC",
//   },

//   mapMessageBox: {
//     marginTop: 8,
//     minHeight: 34,
//     borderRadius: 12,
//     backgroundColor: "rgba(255,255,255,0.96)",
//     borderWidth: 2,
//     borderColor: COLORS.gold,
//     alignItems: "center",
//     justifyContent: "center",
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//   },

//   mapMessageText: {
//     color: "#0A4A28",
//     fontSize: width < 380 ? 9 : 10,
//     fontWeight: "900",
//     textAlign: "center",
//   },

//   levelWrapper: {
//     position: "absolute",
//     width: LEVEL_BOX_WIDTH,
//     minHeight: 128,
//     alignItems: "center",
//     justifyContent: "flex-start",
//     zIndex: 30,
//   },

//   currentLevelWrapper: {
//     transform: [{ scale: 1.06 }],
//     zIndex: 90,
//   },

//   lockedLevelWrapper: {
//     opacity: 0.9,
//   },

//   shadowGlow: {
//     position: "absolute",
//     top: 24,
//     width: 78,
//     height: 34,
//     borderRadius: 40,
//     backgroundColor: "rgba(0,0,0,0.30)",
//     transform: [{ scaleX: 1.2 }],
//   },

//   completedShadowGlow: {
//     backgroundColor: "rgba(89,197,46,0.26)",
//   },

//   currentShadowGlow: {
//     top: 18,
//     width: 106,
//     height: 52,
//     borderRadius: 60,
//     backgroundColor: "rgba(255,216,77,0.32)",
//   },

//   lockedShadowGlow: {
//     backgroundColor: "rgba(0,0,0,0.38)",
//   },

//   houseCircle: {
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   lockedHouseCircle: {
//     opacity: 0.82,
//   },

//   houseImage: {
//     shadowColor: COLORS.black,
//     shadowOffset: { width: 0, height: 5 },
//     shadowOpacity: 0.48,
//     shadowRadius: 7,
//   },

//   completedHouseImage: {
//     opacity: 1,
//   },

//   lockedHouseImage: {
//     opacity: 0.55,
//   },

//   levelBadge: {
//     position: "absolute",
//     right: 7,
//     top: 7,
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: COLORS.black,
//     borderWidth: 2,
//     borderColor: COLORS.borderGold,
//     alignItems: "center",
//     justifyContent: "center",
//     shadowColor: COLORS.black,
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.5,
//     shadowRadius: 5,
//     elevation: 8,
//   },

//   currentBadge: {
//     right: 3,
//     top: 3,
//     width: 38,
//     height: 38,
//     borderRadius: 19,
//     borderWidth: 3,
//     backgroundColor: "#111827",
//   },

//   completedBadge: {
//     backgroundColor: COLORS.green,
//     borderColor: "#D7FFD0",
//   },

//   lockedBadge: {
//     backgroundColor: COLORS.locked,
//     borderColor: "rgba(255,255,255,0.78)",
//   },

//   levelNumber: {
//     fontSize: width < 380 ? 12 : 13,
//     fontWeight: "900",
//     color: COLORS.white,
//   },

//   currentLevelNumber: {
//     fontSize: width < 380 ? 13 : 14,
//   },

//   starsRow: {
//     marginTop: -6,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "rgba(0,0,0,0.34)",
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "rgba(255,255,255,0.10)",
//   },

//   starIcon: {
//     marginHorizontal: -1,
//     textShadowColor: "rgba(0,0,0,0.85)",
//     textShadowOffset: { width: 0, height: 1 },
//     textShadowRadius: 3,
//   },

//   levelNameBox: {
//     marginTop: 5,
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//     backgroundColor: "rgba(0,0,0,0.72)",
//     borderWidth: 1,
//     borderColor: COLORS.gold,
//     alignItems: "center",
//     maxWidth: 116,
//   },

//   completedLevelNameBox: {
//     borderColor: COLORS.green,
//   },

//   currentLevelNameBox: {
//     borderColor: COLORS.gold,
//   },

//   lockedLevelNameBox: {
//     borderColor: "rgba(255,255,255,0.45)",
//   },

//   levelNameText: {
//     fontSize: 8.5,
//     fontWeight: "900",
//     color: COLORS.gold,
//     letterSpacing: 0.7,
//   },

//   completedLevelNameText: {
//     color: COLORS.green,
//   },

//   currentLevelNameText: {
//     color: COLORS.gold,
//   },

//   lockedLevelNameText: {
//     color: "rgba(255,255,255,0.7)",
//   },

//   levelSmallNameText: {
//     marginTop: 1,
//     fontSize: 8,
//     fontWeight: "900",
//     color: COLORS.white,
//     textAlign: "center",
//   },

//   lockedSmallNameText: {
//     color: "rgba(255,255,255,0.65)",
//   },
// });




























import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
  Share,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useGame } from "../context/GameContext";

const { width, height } = Dimensions.get("window");

const BG_IMAGE = require("../assets/images/routebackground.png");
const HOUSE_IMAGE = require("../assets/images/houses.png");
const COIN_IMAGE = require("../assets/images/coin.png");

const MAP_TOTAL_LEVELS = 50;

const COLORS = {
  white: "#FFFFFF",
  gold: "#FFD84D",
  darkGold: "#C97A13",
  dark: "#061B12",
  black: "#000000",
  borderGold: "#F9C84A",
  locked: "#7C8797",
  green: "#59C52E",
  greenDark: "#2E8A1C",
  blue: "#1684E5",
  blueDark: "#075BAA",
  brown: "#7C481F",
  brownDark: "#5B3216",
  orange: "#F59E0B",
  orangeDark: "#B45309",
  red: "#D83A2A",
};

const LEVEL_BOX_WIDTH = 118;

const HOUSE_SIZE = width < 380 ? 70 : 80;
const ACTIVE_HOUSE_SIZE = width < 380 ? 84 : 94;

const LEVEL_SPACING = width < 380 ? 128 : 140;

const TOP_EXTRA_SPACE = height * 0.48;
const BOTTOM_EXTRA_SPACE = height * 0.65;

const MAP_HEIGHT =
  MAP_TOTAL_LEVELS * LEVEL_SPACING + TOP_EXTRA_SPACE + BOTTOM_EXTRA_SPACE;

/**
 * IMPORTANT FIX:
 * The white/thin line was coming because repeated background tiles were touching
 * exactly edge-to-edge. On mobile, sub-pixel rounding can show a line.
 *
 * So we:
 * 1. use Math.ceil for tile height
 * 2. overlap each tile by TILE_OVERLAP pixels
 * 3. make the image slightly wider than the screen
 */

const TILE_HEIGHT = Math.ceil(width * 1.78) + 40;
const TILE_OVERLAP = 36;
const TILE_STEP = TILE_HEIGHT - TILE_OVERLAP;
const TILE_SIDE_OVERFLOW = 40;
const TILE_COUNT = Math.ceil(MAP_HEIGHT / TILE_STEP) + 6;

const ROAD_X_PATTERN = [
  0.48,
  0.61,
  0.52,
  0.39,
  0.47,
  0.58,
  0.63,
  0.5,
  0.38,
  0.44,
  0.56,
  0.64,
  0.54,
  0.41,
  0.46,
  0.59,
];

const clamp = (value, min, max) => {
  return Math.max(min, Math.min(max, value));
};

const getRoadLeft = (level) => {
  const patternIndex = (level - 1) % ROAD_X_PATTERN.length;
  const x = ROAD_X_PATTERN[patternIndex] * width;

  return clamp(x, 62, width - 62);
};

const levelPositions = Array.from({ length: MAP_TOTAL_LEVELS }, (_, index) => {
  const level = index + 1;

  return {
    level,
    left: getRoadLeft(level),
    top: MAP_HEIGHT - BOTTOM_EXTRA_SPACE - index * LEVEL_SPACING,
  };
});

const safeNumber = (value, fallback = 1) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export default function RouteMapScreen({ navigation, route }) {
  const scrollRef = useRef(null);

  const {
    TOTAL_LEVELS,
    coins,
    currentLevel,
    completedStars,
    completedCount,
    progressText,
    soundEnabled,
    getLevel,
    getLevelStatus,
    isLevelCompleted,
    isLevelLocked,
    startLevel,
    toggleSound,
  } = useGame();

  const [mapMessage, setMapMessage] = useState("");

  const scrollTargetLevel = useMemo(() => {
    const routeLevel =
      route?.params?.currentLevel ??
      route?.params?.nextLevel ??
      route?.params?.level ??
      currentLevel;

    const parsedLevel = Math.floor(safeNumber(routeLevel, currentLevel || 1));

    return Math.max(1, Math.min(parsedLevel, TOTAL_LEVELS));
  }, [
    route?.params?.currentLevel,
    route?.params?.nextLevel,
    route?.params?.level,
    currentLevel,
    TOTAL_LEVELS,
  ]);

  const totalPuzzles = TOTAL_LEVELS;

  useEffect(() => {
    const currentItem = levelPositions.find(
      (item) => item.level === scrollTargetLevel
    );

    if (currentItem) {
      const scrollY = Math.max(currentItem.top - height * 0.58, 0);

      setTimeout(() => {
        scrollRef.current?.scrollTo({
          y: scrollY,
          animated: false,
        });
      }, 250);
    }
  }, [scrollTargetLevel]);

  const getStars = (level) => {
    if (!isLevelCompleted(level)) {
      return 0;
    }

    return completedStars?.[level] || 3;
  };

  const handleLevelPress = (level) => {
    const locked = isLevelLocked(level);

    if (locked) {
      setMapMessage(
        `Level ${level} is locked. Complete Level ${currentLevel} first.`
      );
      return;
    }

    const result = startLevel(level);

    if (!result.ok) {
      setMapMessage(result.message);
      return;
    }

    const levelInfo = getLevel(level);

    navigation?.navigate?.("MissionScreen", {
      level,
      startLevel: level,
      levelTitle: levelInfo.title,
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        title: "FunzyCode Progress",
        message: `I completed ${completedCount}/${totalPuzzles} levels and I have ${coins} coins in FunzyCode.`,
      });
    } catch (error) {
      setMapMessage("Unable to share now.");
    }
  };

  const handleBack = () => {
    navigation?.navigate?.("GameSelection");
  };

  const handleCoinPlus = () => {
    setMapMessage("Earn coins by completing levels, gifts, and WhatsApp share.");
  };

  const handleSound = () => {
    toggleSound();
  };


  const renderBackgroundTiles = () => {
  return Array.from({ length: TILE_COUNT }, (_, index) => (
    <Image
      key={`map-tile-${index}`}
      source={BG_IMAGE}
      resizeMode="cover"
      fadeDuration={0}
      style={[
        styles.mapTile,
        {
          top: index * TILE_STEP - 2,
          height: TILE_HEIGHT + TILE_OVERLAP,
        },
      ]}
    />
  ));
};

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.mapArea, { height: MAP_HEIGHT }]}>
          {renderBackgroundTiles()}

          {levelPositions.map((item) => {
            const level = item.level;
            const stars = getStars(level);
            const status = getLevelStatus(level);

            const locked = status === "locked";
            const completed = status === "completed";
            const current = status === "current";

            const levelInfo = getLevel(level);
            const houseSize = current ? ACTIVE_HOUSE_SIZE : HOUSE_SIZE;

            return (
              <TouchableOpacity
                key={level}
                activeOpacity={locked ? 1 : 0.88}
                onPress={() => handleLevelPress(level)}
                style={[
                  styles.levelWrapper,
                  {
                    left: item.left - LEVEL_BOX_WIDTH / 2,
                    top: item.top - houseSize / 2,
                  },
                  current && styles.currentLevelWrapper,
                  locked && styles.lockedLevelWrapper,
                ]}
              >
                <View
                  pointerEvents="none"
                  style={[
                    styles.shadowGlow,
                    completed && styles.completedShadowGlow,
                    current && styles.currentShadowGlow,
                    locked && styles.lockedShadowGlow,
                  ]}
                />

                <View
                  style={[
                    styles.houseCircle,
                    {
                      width: current ? 108 : 96,
                      height: current ? 104 : 92,
                    },
                    locked && styles.lockedHouseCircle,
                  ]}
                >
                  <Image
                    source={HOUSE_IMAGE}
                    resizeMode="contain"
                    style={[
                      styles.houseImage,
                      {
                        width: houseSize,
                        height: houseSize,
                      },
                      locked && styles.lockedHouseImage,
                      completed && styles.completedHouseImage,
                    ]}
                  />

                  <View
                    style={[
                      styles.levelBadge,
                      current && styles.currentBadge,
                      completed && styles.completedBadge,
                      locked && styles.lockedBadge,
                    ]}
                  >
                    {locked ? (
                      <Ionicons
                        name="lock-closed"
                        size={13}
                        color={COLORS.white}
                      />
                    ) : completed ? (
                      <Ionicons
                        name="checkmark"
                        size={17}
                        color={COLORS.white}
                      />
                    ) : (
                      <Text
                        style={[
                          styles.levelNumber,
                          current && styles.currentLevelNumber,
                        ]}
                      >
                        {level}
                      </Text>
                    )}
                  </View>
                </View>

                {!locked && (
                  <View style={styles.starsRow}>
                    {[1, 2, 3].map((star) => (
                      <Ionicons
                        key={star}
                        name="star"
                        size={current ? 16 : 14}
                        color={
                          star <= stars
                            ? COLORS.gold
                            : current
                            ? "rgba(255,255,255,0.30)"
                            : "rgba(255,255,255,0.38)"
                        }
                        style={styles.starIcon}
                      />
                    ))}
                  </View>
                )}

                <View
                  style={[
                    styles.levelNameBox,
                    completed && styles.completedLevelNameBox,
                    current && styles.currentLevelNameBox,
                    locked && styles.lockedLevelNameBox,
                  ]}
                >
                  <Text
                    style={[
                      styles.levelNameText,
                      completed && styles.completedLevelNameText,
                      current && styles.currentLevelNameText,
                      locked && styles.lockedLevelNameText,
                    ]}
                  >
                    {completed
                      ? "COMPLETED"
                      : current
                      ? "CURRENT"
                      : locked
                      ? "LOCKED"
                      : "LEVEL"}
                  </Text>

                  <Text
                    numberOfLines={2}
                    style={[
                      styles.levelSmallNameText,
                      locked && styles.lockedSmallNameText,
                    ]}
                  >
                    {levelInfo.title}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View pointerEvents="box-none" style={styles.header}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.realBackButton}
            onPress={handleBack}
          >
            <Ionicons name="arrow-back" size={32} color={COLORS.white} />
          </TouchableOpacity>

          <View style={styles.coinBox}>
            <View style={styles.coinIconCircle}>
              <Image source={COIN_IMAGE} style={styles.coinImage} />
            </View>

            <Text style={styles.coinText}>{coins}</Text>

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.coinPlusButton}
              onPress={handleCoinPlus}
            >
              <Ionicons name="add" size={28} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.realShareButton}
            onPress={handleShare}
          >
            <Ionicons name="share-social" size={26} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.progressRow}>
          <View style={styles.progressPill}>
            <Ionicons name="flag" size={14} color={COLORS.gold} />
            <Text style={styles.progressText}>Progress {progressText}</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.soundButton, !soundEnabled && styles.soundButtonOff]}
            onPress={handleSound}
          >
            <Ionicons
              name={soundEnabled ? "volume-high" : "volume-mute"}
              size={17}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>

        {!!mapMessage && (
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.mapMessageBox}
            onPress={() => setMapMessage("")}
          >
            <Text style={styles.mapMessageText}>{mapMessage}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },

  scrollView: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },

  scrollContent: {
    minHeight: MAP_HEIGHT,
    backgroundColor: COLORS.dark,
  },

  mapArea: {
  width: "100%",
  position: "relative",
  overflow: "hidden",
  backgroundColor: COLORS.dark,
},

 
  mapTile: {
  position: "absolute",
  left: -TILE_SIDE_OVERFLOW / 2,
  width: width + TILE_SIDE_OVERFLOW,
  backgroundColor: COLORS.dark,
},

  header: {
    position: "absolute",
    top: Platform.OS === "ios" ? 52 : 36,
    left: 14,
    right: 14,
    zIndex: 500,
  },

  headerTopRow: {
    width: "100%",
    height: 62,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  realBackButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.orange,
    borderWidth: 4,
    borderColor: "#FFD36B",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 10,
  },

  realShareButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.blue,
    borderWidth: 4,
    borderColor: "#75C8FF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 10,
  },

  coinBox: {
    height: 58,
    minWidth: width < 380 ? 150 : 170,
    maxWidth: 190,
    paddingHorizontal: 6,
    borderRadius: 30,
    backgroundColor: COLORS.brown,
    borderWidth: 4,
    borderColor: "#A7652C",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 10,
  },

  coinIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.gold,
    borderWidth: 3,
    borderColor: "#FFF0A8",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  coinImage: {
    width: 36,
    height: 36,
    resizeMode: "contain",
  },

  coinText: {
    flex: 1,
    textAlign: "center",
    fontSize: width < 380 ? 20 : 23,
    fontWeight: "900",
    color: COLORS.white,
    textShadowColor: "rgba(0,0,0,0.55)",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 2,
  },

  coinPlusButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.green,
    borderWidth: 3,
    borderColor: "#8CF26B",
    alignItems: "center",
    justifyContent: "center",
  },

  progressRow: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  progressPill: {
    minHeight: 31,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.68)",
    borderWidth: 2,
    borderColor: COLORS.gold,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  progressText: {
    color: COLORS.white,
    fontSize: width < 380 ? 10 : 11,
    fontWeight: "900",
    marginLeft: 5,
  },

  soundButton: {
    width: 33,
    height: 33,
    borderRadius: 17,
    backgroundColor: COLORS.green,
    borderWidth: 2,
    borderColor: "#8CF26B",
    alignItems: "center",
    justifyContent: "center",
  },

  soundButtonOff: {
    backgroundColor: "#777777",
    borderColor: "#CCCCCC",
  },

  mapMessageBox: {
    marginTop: 8,
    minHeight: 34,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.96)",
    borderWidth: 2,
    borderColor: COLORS.gold,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  mapMessageText: {
    color: "#0A4A28",
    fontSize: width < 380 ? 9 : 10,
    fontWeight: "900",
    textAlign: "center",
  },

  levelWrapper: {
    position: "absolute",
    width: LEVEL_BOX_WIDTH,
    minHeight: 128,
    alignItems: "center",
    justifyContent: "flex-start",
    zIndex: 30,
  },

  currentLevelWrapper: {
    transform: [{ scale: 1.06 }],
    zIndex: 90,
  },

  lockedLevelWrapper: {
    opacity: 0.9,
  },

  shadowGlow: {
    position: "absolute",
    top: 24,
    width: 78,
    height: 34,
    borderRadius: 40,
    backgroundColor: "rgba(0,0,0,0.30)",
    transform: [{ scaleX: 1.2 }],
  },

  completedShadowGlow: {
    backgroundColor: "rgba(89,197,46,0.26)",
  },

  currentShadowGlow: {
    top: 18,
    width: 106,
    height: 52,
    borderRadius: 60,
    backgroundColor: "rgba(255,216,77,0.32)",
  },

  lockedShadowGlow: {
    backgroundColor: "rgba(0,0,0,0.38)",
  },

  houseCircle: {
    alignItems: "center",
    justifyContent: "center",
  },

  lockedHouseCircle: {
    opacity: 0.82,
  },

  houseImage: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.48,
    shadowRadius: 7,
  },

  completedHouseImage: {
    opacity: 1,
  },

  lockedHouseImage: {
    opacity: 0.55,
  },

  levelBadge: {
    position: "absolute",
    right: 7,
    top: 7,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.black,
    borderWidth: 2,
    borderColor: COLORS.borderGold,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 8,
  },

  currentBadge: {
    right: 3,
    top: 3,
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 3,
    backgroundColor: "#111827",
  },

  completedBadge: {
    backgroundColor: COLORS.green,
    borderColor: "#D7FFD0",
  },

  lockedBadge: {
    backgroundColor: COLORS.locked,
    borderColor: "rgba(255,255,255,0.78)",
  },

  levelNumber: {
    fontSize: width < 380 ? 12 : 13,
    fontWeight: "900",
    color: COLORS.white,
  },

  currentLevelNumber: {
    fontSize: width < 380 ? 13 : 14,
  },

  starsRow: {
    marginTop: -6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.34)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  starIcon: {
    marginHorizontal: -1,
    textShadowColor: "rgba(0,0,0,0.85)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  levelNameBox: {
    marginTop: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.72)",
    borderWidth: 1,
    borderColor: COLORS.gold,
    alignItems: "center",
    maxWidth: 116,
  },

  completedLevelNameBox: {
    borderColor: COLORS.green,
  },

  currentLevelNameBox: {
    borderColor: COLORS.gold,
  },

  lockedLevelNameBox: {
    borderColor: "rgba(255,255,255,0.45)",
  },

  levelNameText: {
    fontSize: 8.5,
    fontWeight: "900",
    color: COLORS.gold,
    letterSpacing: 0.7,
  },

  completedLevelNameText: {
    color: COLORS.green,
  },

  currentLevelNameText: {
    color: COLORS.gold,
  },

  lockedLevelNameText: {
    color: "rgba(255,255,255,0.7)",
  },

  levelSmallNameText: {
    marginTop: 1,
    fontSize: 8,
    fontWeight: "900",
    color: COLORS.white,
    textAlign: "center",
  },

  lockedSmallNameText: {
    color: "rgba(255,255,255,0.65)",
  },
});