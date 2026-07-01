// // src/screens/WaterSortScreen.js

// import React, { useMemo, useRef, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   ImageBackground,
//   TouchableOpacity,
//   Animated,
//   Dimensions,
//   StatusBar,
//   Alert,
// } from "react-native";

// const { width, height } = Dimensions.get("window");

// const BACKGROUND_IMAGE = require("../assets/images/water-sort/watersortbackground.png");
// const COIN_IMAGE = require("../assets/images/water-sort/watercoin.png");
// const LOGO_IMAGE = require("../assets/images/water-sort/watersortlogo.png");
// const EMPTY_GLASS_IMAGE = require("../assets/images/water-sort/emptyglass.png");

// const BOTTLE_CAPACITY = 4;
// const TOTAL_BOTTLES = 12;
// const MAX_MOVES = 30;

// const LIQUID_COLORS = {
//   blue: "#149BFF",
//   yellow: "#FFD22A",
//   pink: "#FF5DA5",
//   purple: "#9148E8",
//   green: "#49D51F",
//   orange: "#FF8B22",
// };

// const INITIAL_BOTTLES = [
//   ["purple", "pink", "blue", "yellow"],
//   ["blue", "orange", "green", "purple"],
//   ["green", "green", "green", "green"],
//   ["pink", "pink", "pink", "pink"],
//   ["blue"],
//   ["yellow", "yellow", "yellow"],
//   ["purple", "purple", "purple", "purple"],
//   ["blue", "green", "pink", "orange"],
//   ["pink", "purple", "yellow", "blue"],
//   ["purple", "blue", "orange", "green"],
//   ["orange", "orange", "orange", "orange"],
//   ["blue", "blue", "blue", "blue"],
// ];

// export default function WaterSortScreen() {
//   const [bottles, setBottles] = useState(
//     INITIAL_BOTTLES.map((bottle) => [...bottle])
//   );
//   const [selectedBottle, setSelectedBottle] = useState(null);
//   const [moves, setMoves] = useState(18);
//   const [coins, setCoins] = useState(1250);
//   const [history, setHistory] = useState([]);
//   const [levelComplete, setLevelComplete] = useState(false);

//   const selectAnimation = useRef(new Animated.Value(0)).current;

//   const solvedBottleCount = useMemo(() => {
//     return bottles.filter((bottle) => {
//       if (bottle.length !== BOTTLE_CAPACITY) return false;
//       return bottle.every((color) => color === bottle[0]);
//     }).length;
//   }, [bottles]);

//   const visibleTargetCount = levelComplete
//     ? TOTAL_BOTTLES
//     : Math.max(7, solvedBottleCount);

//   const topColor = (bottle) => {
//     return bottle[bottle.length - 1];
//   };

//   const getSameTopColorCount = (bottle) => {
//     if (bottle.length === 0) return 0;

//     const color = topColor(bottle);
//     let count = 0;

//     for (let i = bottle.length - 1; i >= 0; i--) {
//       if (bottle[i] === color) {
//         count += 1;
//       } else {
//         break;
//       }
//     }

//     return count;
//   };

//   const canPour = (fromBottle, toBottle) => {
//     if (fromBottle.length === 0) return false;
//     if (toBottle.length >= BOTTLE_CAPACITY) return false;
//     if (toBottle.length === 0) return true;

//     return topColor(fromBottle) === topColor(toBottle);
//   };

//   const checkLevelComplete = (nextBottles) => {
//     return nextBottles.every((bottle) => {
//       if (bottle.length === 0) return true;

//       return (
//         bottle.length === BOTTLE_CAPACITY &&
//         bottle.every((color) => color === bottle[0])
//       );
//     });
//   };

//   const runSelectAnimation = () => {
//     selectAnimation.setValue(0);

//     Animated.sequence([
//       Animated.timing(selectAnimation, {
//         toValue: 1,
//         duration: 120,
//         useNativeDriver: true,
//       }),
//       Animated.timing(selectAnimation, {
//         toValue: 0,
//         duration: 120,
//         useNativeDriver: true,
//       }),
//     ]).start();
//   };

//   const handleBottlePress = (index) => {
//     if (levelComplete) return;

//     if (selectedBottle === null) {
//       if (bottles[index].length === 0) return;

//       setSelectedBottle(index);
//       runSelectAnimation();
//       return;
//     }

//     if (selectedBottle === index) {
//       setSelectedBottle(null);
//       return;
//     }

//     const fromBottle = bottles[selectedBottle];
//     const toBottle = bottles[index];

//     if (!canPour(fromBottle, toBottle)) {
//       setSelectedBottle(null);
//       return;
//     }

//     const nextBottles = bottles.map((bottle) => [...bottle]);

//     const from = nextBottles[selectedBottle];
//     const to = nextBottles[index];

//     const colorToPour = topColor(from);
//     const sameColorCount = getSameTopColorCount(from);
//     const emptySpace = BOTTLE_CAPACITY - to.length;
//     const pourCount = Math.min(sameColorCount, emptySpace);

//     for (let i = 0; i < pourCount; i++) {
//       from.pop();
//       to.push(colorToPour);
//     }

//     setHistory((prev) => [
//       ...prev,
//       {
//         bottles: bottles.map((bottle) => [...bottle]),
//         moves,
//       },
//     ]);

//     setBottles(nextBottles);
//     setMoves((prev) => prev + 1);
//     setSelectedBottle(null);

//     if (checkLevelComplete(nextBottles)) {
//       setLevelComplete(true);
//       setCoins((prev) => prev + 50);

//       setTimeout(() => {
//         Alert.alert("Level Complete!", "Great job! You sorted all bottles.");
//       }, 300);
//     }
//   };

//   const handleUndo = () => {
//     if (history.length === 0) return;

//     const lastStep = history[history.length - 1];

//     setBottles(lastStep.bottles.map((bottle) => [...bottle]));
//     setMoves(lastStep.moves);
//     setHistory((prev) => prev.slice(0, -1));
//     setSelectedBottle(null);
//     setLevelComplete(false);
//   };

//   const handleRestart = () => {
//     setBottles(INITIAL_BOTTLES.map((bottle) => [...bottle]));
//     setMoves(18);
//     setHistory([]);
//     setSelectedBottle(null);
//     setLevelComplete(false);
//   };

//   const handleHint = () => {
//     Alert.alert(
//       "Hint",
//       "Tap one bottle first, then tap another empty bottle or a bottle with the same top color."
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar hidden />

//       <ImageBackground
//         source={BACKGROUND_IMAGE}
//         style={styles.background}
//         resizeMode="cover"
//       >
//         <View style={styles.screen}>
//           <View style={styles.topBar}>
//             <TouchableOpacity activeOpacity={0.85} style={styles.topIconButton}>
//               <Text style={styles.settingsIcon}>⚙</Text>
//             </TouchableOpacity>

//             <View style={styles.levelBadge}>
//               <Text style={styles.levelText}>Level 25</Text>
//             </View>

//             <View style={styles.coinBox}>
//               <Image source={COIN_IMAGE} style={styles.coinImage} />
//               <Text style={styles.coinText}>{coins.toLocaleString()}</Text>

//               <View style={styles.plusButton}>
//                 <Text style={styles.plusText}>+</Text>
//               </View>
//             </View>

//             <TouchableOpacity activeOpacity={0.85} style={styles.topIconButton}>
//               <Text style={styles.pauseIcon}>Ⅱ</Text>
//             </TouchableOpacity>
//           </View>

//           <View style={styles.starArea}>
//             <View style={styles.starProgressBack}>
//               <View style={styles.starProgressFill} />
//             </View>

//             <Text style={styles.starText}>⭐</Text>
//             <Text style={styles.starText}>⭐</Text>
//             <Text style={styles.emptyStarText}>★</Text>
//           </View>

//           <View style={styles.logoArea}>
//             <View style={styles.infoCard}>
//               <Text style={styles.infoCardTitle}>MOVES</Text>
//               <Text style={styles.movesNumber}>{moves}</Text>
//               <Text style={styles.movesLimit}>/ {MAX_MOVES}</Text>
//             </View>

//             <Image source={LOGO_IMAGE} style={styles.logoImage} />

//             <View style={styles.infoCard}>
//               <Text style={styles.infoCardTitle}>TARGET</Text>

//               <View style={styles.targetBottleIcon}>
//                 <View style={styles.targetBottleWater} />
//               </View>

//               <Text style={styles.targetCount}>
//                 {visibleTargetCount}/{TOTAL_BOTTLES}
//               </Text>
//             </View>
//           </View>

//           <View style={styles.gameArea}>
//             <View style={styles.bottleRow}>
//               {bottles.slice(0, 6).map((bottle, index) => (
//                 <Bottle
//                   key={`top-bottle-${index}`}
//                   bottle={bottle}
//                   selected={selectedBottle === index}
//                   selectAnimation={selectAnimation}
//                   onPress={() => handleBottlePress(index)}
//                 />
//               ))}
//             </View>

//             <View style={styles.bottleRow}>
//               {bottles.slice(6, 12).map((bottle, index) => {
//                 const realIndex = index + 6;

//                 return (
//                   <Bottle
//                     key={`bottom-bottle-${realIndex}`}
//                     bottle={bottle}
//                     selected={selectedBottle === realIndex}
//                     selectAnimation={selectAnimation}
//                     onPress={() => handleBottlePress(realIndex)}
//                   />
//                 );
//               })}
//             </View>
//           </View>

//           <View style={styles.bottomButtons}>
//             <GameButton
//               color="#9B55E8"
//               icon="↶"
//               label="UNDO"
//               badge="2"
//               onPress={handleUndo}
//             />

//             <GameButton
//               color="#168FE8"
//               icon="⟳"
//               label="RESTART"
//               onPress={handleRestart}
//             />

//             <GameButton
//               color="#FFAD22"
//               icon="💡"
//               label="HINT"
//               badge="2"
//               onPress={handleHint}
//             />
//           </View>
//         </View>
//       </ImageBackground>
//     </View>
//   );
// }

// function Bottle({ bottle, selected, selectAnimation, onPress }) {
//   const selectedMove = selected
//     ? selectAnimation.interpolate({
//         inputRange: [0, 1],
//         outputRange: [-10, -20],
//       })
//     : 0;

//   return (
//     <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
//       <Animated.View
//         style={[
//           styles.bottleWrapper,
//           selected && styles.selectedBottle,
//           selected && {
//             transform: [{ translateY: selectedMove }],
//           },
//         ]}
//       >
//         <View style={styles.liquidClip}>
//           <View style={styles.liquidStack}>
//             {bottle.map((color, index) => (
//               <View
//                 key={`${color}-${index}`}
//                 style={[
//                   styles.liquidLayer,
//                   {
//                     backgroundColor: LIQUID_COLORS[color],
//                     height: `${100 / BOTTLE_CAPACITY}%`,
//                   },
//                 ]}
//               >
//                 <View style={styles.liquidGloss} />
//               </View>
//             ))}
//           </View>
//         </View>

//         <Image
//           source={EMPTY_GLASS_IMAGE}
//           style={styles.emptyGlassImage}
//           resizeMode="contain"
//         />
//       </Animated.View>
//     </TouchableOpacity>
//   );
// }

// function GameButton({ color, icon, label, badge, onPress }) {
//   return (
//     <TouchableOpacity
//       activeOpacity={0.85}
//       style={styles.gameButtonWrapper}
//       onPress={onPress}
//     >
//       {badge && (
//         <View style={styles.buttonBadge}>
//           <Text style={styles.buttonBadgeText}>{badge}</Text>
//         </View>
//       )}

//       <View style={[styles.gameButton, { backgroundColor: color }]}>
//         <View style={styles.buttonHighlight} />
//         <Text style={styles.buttonIcon}>{icon}</Text>
//         <Text style={styles.buttonLabel}>{label}</Text>
//       </View>
//     </TouchableOpacity>
//   );
// }

// const bottleWidth = width / 7.35;
// const bottleHeight = height * 0.21;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#061A3A",
//   },

//   background: {
//     flex: 1,
//     width: "100%",
//     height: "100%",
//   },

//   screen: {
//     flex: 1,
//     paddingHorizontal: 10,
//   },

//   topBar: {
//     height: 78,
//     paddingTop: 8,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },

//   topIconButton: {
//     width: 58,
//     height: 58,
//     borderRadius: 18,
//     backgroundColor: "#9654EA",
//     borderWidth: 4,
//     borderColor: "#C9A2FF",
//     alignItems: "center",
//     justifyContent: "center",
//     shadowColor: "#000",
//     shadowOpacity: 0.35,
//     shadowRadius: 8,
//     elevation: 8,
//   },

//   settingsIcon: {
//     color: "#FFFFFF",
//     fontSize: 30,
//     fontWeight: "900",
//   },

//   pauseIcon: {
//     color: "#FFFFFF",
//     fontSize: 36,
//     fontWeight: "900",
//     marginTop: -4,
//   },

//   levelBadge: {
//     width: 190,
//     height: 58,
//     borderRadius: 29,
//     backgroundColor: "#168FE8",
//     borderWidth: 4,
//     borderColor: "#FFE0C4",
//     alignItems: "center",
//     justifyContent: "center",
//     shadowColor: "#000",
//     shadowOpacity: 0.35,
//     shadowRadius: 8,
//     elevation: 8,
//   },

//   levelText: {
//     color: "#FFFFFF",
//     fontSize: 27,
//     fontWeight: "900",
//     textShadowColor: "#0B4B9E",
//     textShadowOffset: { width: 2, height: 2 },
//     textShadowRadius: 2,
//   },

//   coinBox: {
//     minWidth: 142,
//     height: 52,
//     borderRadius: 23,
//     backgroundColor: "#472063",
//     borderWidth: 3,
//     borderColor: "#9350DC",
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 8,
//   },

//   coinImage: {
//     width: 38,
//     height: 38,
//     resizeMode: "contain",
//   },

//   coinText: {
//     color: "#FFFFFF",
//     fontSize: 22,
//     fontWeight: "900",
//     marginHorizontal: 7,
//   },

//   plusButton: {
//     width: 34,
//     height: 34,
//     borderRadius: 17,
//     backgroundColor: "#45D51F",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   plusText: {
//     color: "#FFFFFF",
//     fontSize: 27,
//     fontWeight: "900",
//     marginTop: -2,
//   },

//   starArea: {
//     height: 44,
//     alignItems: "center",
//     justifyContent: "center",
//     flexDirection: "row",
//   },

//   starProgressBack: {
//     position: "absolute",
//     width: 190,
//     height: 13,
//     borderRadius: 10,
//     backgroundColor: "#5A3D86",
//     borderWidth: 2,
//     borderColor: "#25154D",
//     overflow: "hidden",
//   },

//   starProgressFill: {
//     width: "67%",
//     height: "100%",
//     backgroundColor: "#FFC226",
//     borderRadius: 10,
//   },

//   starText: {
//     fontSize: 39,
//     marginHorizontal: 7,
//     textShadowColor: "#A66300",
//     textShadowOffset: { width: 2, height: 2 },
//     textShadowRadius: 2,
//   },

//   emptyStarText: {
//     fontSize: 39,
//     marginHorizontal: 7,
//     color: "#2E2748",
//     textShadowColor: "#FFFFFF",
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 1,
//   },

//   logoArea: {
//     height: 215,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },

//   logoImage: {
//     width: width - 195,
//     height: 170,
//     resizeMode: "contain",
//   },

//   infoCard: {
//     width: 82,
//     height: 138,
//     borderRadius: 20,
//     backgroundColor: "#FFF1D9",
//     borderWidth: 3,
//     borderColor: "#C98E68",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   infoCardTitle: {
//     color: "#7948B8",
//     fontSize: 15,
//     fontWeight: "900",
//     marginBottom: 6,
//   },

//   movesNumber: {
//     color: "#7D49BA",
//     fontSize: 43,
//     fontWeight: "900",
//   },

//   movesLimit: {
//     color: "#7D49BA",
//     fontSize: 22,
//     fontWeight: "900",
//   },

//   targetBottleIcon: {
//     width: 25,
//     height: 52,
//     borderRadius: 9,
//     borderWidth: 2,
//     borderColor: "#A9BBC8",
//     backgroundColor: "rgba(255,255,255,0.45)",
//     overflow: "hidden",
//     justifyContent: "flex-end",
//   },

//   targetBottleWater: {
//     height: "80%",
//     backgroundColor: LIQUID_COLORS.purple,
//   },

//   targetCount: {
//     color: "#7D49BA",
//     fontSize: 20,
//     fontWeight: "900",
//     marginTop: 5,
//   },

//   gameArea: {
//     flex: 1,
//     justifyContent: "center",
//     paddingBottom: 8,
//   },

//   bottleRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-end",
//     marginVertical: 14,
//   },

//   bottleWrapper: {
//     width: bottleWidth,
//     height: bottleHeight,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   selectedBottle: {
//     shadowColor: "#FFFFFF",
//     shadowOpacity: 0.9,
//     shadowRadius: 15,
//     elevation: 12,
//   },

//   emptyGlassImage: {
//     position: "absolute",
//     width: "100%",
//     height: "100%",
//     zIndex: 5,
//   },

//   liquidClip: {
//     position: "absolute",
//     bottom: bottleHeight * 0.105,
//     width: bottleWidth * 0.58,
//     height: bottleHeight * 0.7,
//     borderBottomLeftRadius: bottleWidth * 0.24,
//     borderBottomRightRadius: bottleWidth * 0.24,
//     borderTopLeftRadius: bottleWidth * 0.12,
//     borderTopRightRadius: bottleWidth * 0.12,
//     overflow: "hidden",
//     justifyContent: "flex-end",
//     zIndex: 2,
//   },

//   liquidStack: {
//     flex: 1,
//     justifyContent: "flex-end",
//   },

//   liquidLayer: {
//     width: "100%",
//     overflow: "hidden",
//     justifyContent: "flex-start",
//   },

//   liquidGloss: {
//     width: "100%",
//     height: 5,
//     backgroundColor: "rgba(255,255,255,0.3)",
//   },

//   bottomButtons: {
//     height: 125,
//     paddingBottom: 8,
//     paddingHorizontal: 20,
//     flexDirection: "row",
//     justifyContent: "space-around",
//     alignItems: "center",
//   },

//   gameButtonWrapper: {
//     width: 95,
//     height: 105,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   gameButton: {
//     width: 92,
//     height: 92,
//     borderRadius: 25,
//     borderWidth: 4,
//     borderColor: "#FFE8C4",
//     alignItems: "center",
//     justifyContent: "center",
//     overflow: "hidden",
//     shadowColor: "#000",
//     shadowOpacity: 0.35,
//     shadowRadius: 8,
//     elevation: 9,
//   },

//   buttonHighlight: {
//     position: "absolute",
//     top: 8,
//     left: 12,
//     right: 12,
//     height: 24,
//     borderRadius: 18,
//     backgroundColor: "rgba(255,255,255,0.28)",
//   },

//   buttonIcon: {
//     color: "#FFFFFF",
//     fontSize: 42,
//     fontWeight: "900",
//     marginTop: 4,
//   },

//   buttonLabel: {
//     color: "#FFFFFF",
//     fontSize: 15,
//     fontWeight: "900",
//     marginTop: -3,
//     textShadowColor: "rgba(0,0,0,0.25)",
//     textShadowOffset: { width: 1, height: 2 },
//     textShadowRadius: 2,
//   },

//   buttonBadge: {
//     position: "absolute",
//     top: -2,
//     right: 0,
//     width: 31,
//     height: 31,
//     borderRadius: 16,
//     backgroundColor: "#FFF0D7",
//     borderWidth: 2,
//     borderColor: "#C88A5B",
//     zIndex: 20,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   buttonBadgeText: {
//     color: "#8E5A2A",
//     fontSize: 18,
//     fontWeight: "900",
//   },
// });












// screens/WaterSortScreen.js

import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  SafeAreaView,
  Platform,
  Modal,
} from "react-native";

const { width, height } = Dimensions.get("window");

const BACKGROUND_IMAGE = require("../assets/images/water-sort/watersortbackground.png");
const COIN_IMAGE = require("../assets/images/water-sort/watercoin.png");
const LOGO_IMAGE = require("../assets/images/water-sort/watersortlogo.png");

const START_LEVEL = 1;
const TOTAL_LEVELS = 50;
const TOTAL_BOTTLES = 12;
const BOTTLE_CAPACITY = 4;

const LIQUID_COLORS = {
  blue: "#149BFF",
  yellow: "#FFD22A",
  pink: "#FF5DA5",
  purple: "#9148E8",
  green: "#49D51F",
  orange: "#FF8B22",
  red: "#FF3B42",
  teal: "#12D6C8",
  lime: "#9BFF22",
  violet: "#B84DFF",
};

const COLOR_ORDER = [
  "blue",
  "yellow",
  "pink",
  "purple",
  "green",
  "orange",
  "red",
  "teal",
  "lime",
  "violet",
];

function seededRandom(seed) {
  let value = seed;

  return function random() {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function shuffleArray(array, random) {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }

  return result;
}

function getLevelColorCount(levelNumber) {
  if (levelNumber <= 15) return 6;
  if (levelNumber <= 35) return 8;
  return 10;
}

function createLevel(levelNumber) {
  const random = seededRandom(levelNumber * 987 + 321);
  const colorCount = getLevelColorCount(levelNumber);

  const rotatedColors = [
    ...COLOR_ORDER.slice(levelNumber % COLOR_ORDER.length),
    ...COLOR_ORDER.slice(0, levelNumber % COLOR_ORDER.length),
  ];

  const levelColors = rotatedColors.slice(0, colorCount);
  let bottles = [];

  for (let i = 0; i < levelColors.length; i += 2) {
    const first = levelColors[i];
    const second = levelColors[i + 1];

    bottles.push([first, first, second, second]);
    bottles.push([second, second, first, first]);
  }

  while (bottles.length < TOTAL_BOTTLES) {
    bottles.push([]);
  }

  bottles = shuffleArray(bottles, random);

  return {
    level: levelNumber,
    bottles,
    maxMoves: 30 + Math.floor(levelNumber / 8) * 5,
  };
}

const LEVELS = Array.from({ length: TOTAL_LEVELS }, (_, index) =>
  createLevel(index + 1)
);

function getTopColor(bottle) {
  return bottle[bottle.length - 1];
}

function getSameTopColorCount(bottle) {
  if (bottle.length === 0) return 0;

  const color = getTopColor(bottle);
  let count = 0;

  for (let i = bottle.length - 1; i >= 0; i--) {
    if (bottle[i] === color) {
      count += 1;
    } else {
      break;
    }
  }

  return count;
}

function canPour(fromBottle, toBottle) {
  if (fromBottle.length === 0) return false;
  if (toBottle.length >= BOTTLE_CAPACITY) return false;
  if (toBottle.length === 0) return true;

  return getTopColor(fromBottle) === getTopColor(toBottle);
}

function isBottleSolved(bottle) {
  if (bottle.length === 0) return true;

  return (
    bottle.length === BOTTLE_CAPACITY &&
    bottle.every((color) => color === bottle[0])
  );
}

function checkLevelComplete(bottles) {
  return bottles.every(isBottleSolved);
}

function findHintMove(bottles) {
  for (let from = 0; from < bottles.length; from++) {
    const fromBottle = bottles[from];

    if (fromBottle.length === 0) continue;

    for (let to = 0; to < bottles.length; to++) {
      if (from === to) continue;

      const toBottle = bottles[to];

      if (
        toBottle.length > 0 &&
        canPour(fromBottle, toBottle) &&
        getTopColor(fromBottle) === getTopColor(toBottle)
      ) {
        return { from, to };
      }
    }
  }

  for (let from = 0; from < bottles.length; from++) {
    const fromBottle = bottles[from];

    if (fromBottle.length === 0) continue;

    for (let to = 0; to < bottles.length; to++) {
      if (from === to) continue;

      const toBottle = bottles[to];

      if (toBottle.length === 0 && canPour(fromBottle, toBottle)) {
        return { from, to };
      }
    }
  }

  return null;
}

export default function WaterSortScreen({ navigation }) {
  const [currentLevel, setCurrentLevel] = useState(START_LEVEL);
  const [bottles, setBottles] = useState(
    LEVELS[START_LEVEL - 1].bottles.map((bottle) => [...bottle])
  );
  const [selectedBottle, setSelectedBottle] = useState(null);
  const [moves, setMoves] = useState(0);
  const [coins, setCoins] = useState(1250);
  const [history, setHistory] = useState([]);
  const [levelComplete, setLevelComplete] = useState(false);

  const [undoPower, setUndoPower] = useState(3);
  const [hintPower, setHintPower] = useState(3);
  const [hintMove, setHintMove] = useState(null);

  const [toast, setToast] = useState("");
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const selectAnimation = useRef(new Animated.Value(0)).current;
  const toastTimer = useRef(null);

  const levelData = LEVELS[currentLevel - 1];

  const solvedBottleCount = useMemo(() => {
    return bottles.filter(isBottleSolved).length;
  }, [bottles]);

  const starCount = useMemo(() => {
    if (moves <= levelData.maxMoves * 0.45) return 3;
    if (moves <= levelData.maxMoves * 0.75) return 2;
    return 1;
  }, [moves, levelData.maxMoves]);

  const showToast = (message) => {
    setToast(message);

    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }

    toastTimer.current = setTimeout(() => {
      setToast("");
    }, 1400);
  };

  const runSelectAnimation = () => {
    selectAnimation.setValue(0);

    Animated.sequence([
      Animated.timing(selectAnimation, {
        toValue: 1,
        duration: 130,
        useNativeDriver: true,
      }),
      Animated.timing(selectAnimation, {
        toValue: 0,
        duration: 130,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const loadLevel = (levelNumber) => {
    const nextLevel = LEVELS[levelNumber - 1];

    setCurrentLevel(levelNumber);
    setBottles(nextLevel.bottles.map((bottle) => [...bottle]));
    setSelectedBottle(null);
    setMoves(0);
    setHistory([]);
    setLevelComplete(false);
    setShowCompleteModal(false);
    setHintMove(null);
    setUndoPower(3);
    setHintPower(3);
  };

  const handleBottlePress = (index) => {
    if (levelComplete) return;

    setHintMove(null);

    if (selectedBottle === null) {
      if (bottles[index].length === 0) {
        showToast("Select a bottle with water");
        return;
      }

      setSelectedBottle(index);
      runSelectAnimation();
      return;
    }

    if (selectedBottle === index) {
      setSelectedBottle(null);
      return;
    }

    const fromBottle = bottles[selectedBottle];
    const toBottle = bottles[index];

    if (!canPour(fromBottle, toBottle)) {
      setSelectedBottle(null);
      showToast("Pour only on same color or empty bottle");
      return;
    }

    const nextBottles = bottles.map((bottle) => [...bottle]);
    const from = nextBottles[selectedBottle];
    const to = nextBottles[index];

    const colorToPour = getTopColor(from);
    const sameColorCount = getSameTopColorCount(from);
    const emptySpace = BOTTLE_CAPACITY - to.length;
    const pourCount = Math.min(sameColorCount, emptySpace);

    for (let i = 0; i < pourCount; i++) {
      from.pop();
      to.push(colorToPour);
    }

    setHistory((prev) => [
      ...prev,
      {
        bottles: bottles.map((bottle) => [...bottle]),
        moves,
      },
    ]);

    setBottles(nextBottles);
    setMoves((prev) => prev + 1);
    setSelectedBottle(null);

    if (checkLevelComplete(nextBottles)) {
      setLevelComplete(true);
      setCoins((prev) => prev + 50);
      setShowCompleteModal(true);
    }
  };

  const handleUndo = () => {
    if (undoPower <= 0) {
      showToast("No undo powers left");
      return;
    }

    if (history.length === 0) {
      showToast("No move to undo");
      return;
    }

    const lastStep = history[history.length - 1];

    setBottles(lastStep.bottles.map((bottle) => [...bottle]));
    setMoves(lastStep.moves);
    setHistory((prev) => prev.slice(0, -1));
    setSelectedBottle(null);
    setHintMove(null);
    setLevelComplete(false);
    setShowCompleteModal(false);
    setUndoPower((prev) => prev - 1);
  };

  const handleRestart = () => {
    loadLevel(currentLevel);
    showToast("Level restarted");
  };

  const handleHint = () => {
    if (hintPower <= 0) {
      showToast("No hint powers left");
      return;
    }

    const move = findHintMove(bottles);

    if (!move) {
      showToast("No hint available");
      return;
    }

    setSelectedBottle(null);
    setHintMove(move);
    setHintPower((prev) => prev - 1);
    showToast("Hint highlighted");

    setTimeout(() => {
      setHintMove(null);
    }, 2600);
  };

  const handleNextLevel = () => {
    if (currentLevel >= TOTAL_LEVELS) {
      setShowCompleteModal(false);
      showToast("All 50 levels completed");
      return;
    }

    loadLevel(currentLevel + 1);
  };

  const handleReplayLevel = () => {
    loadLevel(currentLevel);
  };

  const goBack = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
      return;
    }

    navigation?.navigate?.("FunGames");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar hidden />

      <ImageBackground
        source={BACKGROUND_IMAGE}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.screen}>
          <View style={styles.topBar}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.topIconButton}
              onPress={goBack}
            >
              <Text style={styles.settingsIcon}>⚙</Text>
            </TouchableOpacity>

            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>Level {currentLevel}</Text>
            </View>

            <View style={styles.coinBox}>
              <Image source={COIN_IMAGE} style={styles.coinImage} />
              <Text style={styles.coinText}>{coins.toLocaleString()}</Text>

              <View style={styles.plusButton}>
                <Text style={styles.plusText}>+</Text>
              </View>
            </View>
          </View>

          <View style={styles.starArea}>
            <View style={styles.starProgressBack}>
              <View
                style={[
                  styles.starProgressFill,
                  {
                    width:
                      starCount === 3 ? "88%" : starCount === 2 ? "62%" : "34%",
                  },
                ]}
              />
            </View>

            <Text style={styles.starText}>⭐</Text>
            <Text style={starCount >= 2 ? styles.starText : styles.emptyStarText}>
              {starCount >= 2 ? "⭐" : "★"}
            </Text>
            <Text style={starCount >= 3 ? styles.starText : styles.emptyStarText}>
              {starCount >= 3 ? "⭐" : "★"}
            </Text>
          </View>

          <View style={styles.logoArea}>
            <View style={styles.infoCard}>
              <Text style={styles.infoCardTitle}>MOVES</Text>
              <Text style={styles.movesNumber}>{moves}</Text>
              <Text style={styles.movesLimit}>/ {levelData.maxMoves}</Text>
            </View>

            <Image source={LOGO_IMAGE} style={styles.logoImage} />

            <View style={styles.infoCard}>
              <Text style={styles.infoCardTitle}>TARGET</Text>

              <View style={styles.targetBottleIcon}>
                <View style={styles.targetBottleWater} />
              </View>

              <Text style={styles.targetCount}>
                {solvedBottleCount}/{TOTAL_BOTTLES}
              </Text>
            </View>
          </View>

          <View style={styles.gameArea}>
            <View style={styles.bottleRow}>
              {bottles.slice(0, 6).map((bottle, index) => (
                <Bottle
                  key={`top-${currentLevel}-${index}`}
                  bottle={bottle}
                  selected={selectedBottle === index}
                  hinted={hintMove?.from === index || hintMove?.to === index}
                  hintType={
                    hintMove?.from === index
                      ? "from"
                      : hintMove?.to === index
                      ? "to"
                      : ""
                  }
                  selectAnimation={selectAnimation}
                  onPress={() => handleBottlePress(index)}
                />
              ))}
            </View>

            <View style={styles.bottleRow}>
              {bottles.slice(6, 12).map((bottle, index) => {
                const realIndex = index + 6;

                return (
                  <Bottle
                    key={`bottom-${currentLevel}-${realIndex}`}
                    bottle={bottle}
                    selected={selectedBottle === realIndex}
                    hinted={
                      hintMove?.from === realIndex || hintMove?.to === realIndex
                    }
                    hintType={
                      hintMove?.from === realIndex
                        ? "from"
                        : hintMove?.to === realIndex
                        ? "to"
                        : ""
                    }
                    selectAnimation={selectAnimation}
                    onPress={() => handleBottlePress(realIndex)}
                  />
                );
              })}
            </View>
          </View>

          <View style={styles.bottomButtons}>
            <GameButton
              color="#9B55E8"
              icon="↶"
              label="UNDO"
              badge={undoPower}
              onPress={handleUndo}
            />

            <GameButton
              color="#168FE8"
              icon="⟳"
              label="RESTART"
              onPress={handleRestart}
            />

            <GameButton
              color="#FFAD22"
              icon="💡"
              label="HINT"
              badge={hintPower}
              onPress={handleHint}
            />
          </View>

          {!!toast && (
            <View style={styles.toastBox}>
              <Text style={styles.toastText}>{toast}</Text>
            </View>
          )}
        </View>

        <LevelCompleteModal
          visible={showCompleteModal}
          level={currentLevel}
          totalLevels={TOTAL_LEVELS}
          moves={moves}
          coins={coins}
          onReplay={handleReplayLevel}
          onNext={handleNextLevel}
          onClose={() => setShowCompleteModal(false)}
        />
      </ImageBackground>
    </SafeAreaView>
  );
}

function Bottle({
  bottle,
  selected,
  hinted,
  hintType,
  selectAnimation,
  onPress,
}) {
  const selectedMove = selected
    ? selectAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [-8, -18],
      })
    : 0;

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <Animated.View
        style={[
          styles.bottleWrapper,
          selected && styles.selectedBottle,
          hinted && styles.hintedBottle,
          hintType === "from" && styles.hintFrom,
          hintType === "to" && styles.hintTo,
          selected && {
            transform: [{ translateY: selectedMove }],
          },
        ]}
      >
        <View style={styles.bottleNeck}>
          <View style={styles.bottleMouth} />
        </View>

        <View style={styles.bottleBody}>
          <View style={styles.liquidArea}>
            <View style={styles.liquidStack}>
              {bottle.map((color, index) => (
                <View
                  key={`${color}-${index}`}
                  style={[
                    styles.liquidLayer,
                    {
                      backgroundColor: LIQUID_COLORS[color],
                      height: `${100 / BOTTLE_CAPACITY}%`,
                    },
                  ]}
                >
                  <View style={styles.liquidTopGloss} />
                </View>
              ))}
            </View>
          </View>

          <View style={styles.leftGlassLine} />
          <View style={styles.rightGlassLine} />
          <View style={styles.centerGlassGlow} />
          <View style={styles.bottomGlassGlow} />
        </View>

        <View style={styles.bottleBase} />
      </Animated.View>
    </TouchableOpacity>
  );
}

function GameButton({ color, icon, label, badge, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.gameButtonWrapper}
      onPress={onPress}
    >
      <View style={styles.buttonBadge}>
        <Text style={styles.buttonBadgeText}>{badge}</Text>
      </View>

      <View style={[styles.gameButton, { backgroundColor: color }]}>
        <View style={styles.buttonHighlight} />
        <Text style={styles.buttonIcon}>{icon}</Text>
        <Text style={styles.buttonLabel}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

function LevelCompleteModal({
  visible,
  level,
  totalLevels,
  moves,
  coins,
  onReplay,
  onNext,
  onClose,
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.completeCard}>
          <TouchableOpacity style={styles.modalClose} onPress={onClose}>
            <Text style={styles.modalCloseText}>×</Text>
          </TouchableOpacity>

          <Text style={styles.completeEmoji}>🎉</Text>
          <Text style={styles.completeTitle}>Level Complete!</Text>

          <Text style={styles.completeSub}>
            Level {level}/{totalLevels} completed in {moves} moves
          </Text>

          <View style={styles.rewardRow}>
            <Text style={styles.rewardText}>Reward</Text>
            <Text style={styles.rewardCoins}>+50 Coins</Text>
          </View>

          <Text style={styles.totalCoins}>Coins: {coins.toLocaleString()}</Text>

          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.replayButton} onPress={onReplay}>
              <Text style={styles.replayText}>Replay</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.nextButton} onPress={onNext}>
              <Text style={styles.nextText}>
                {level >= totalLevels ? "Done" : "Next"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const bottleWidth = Math.min(width / 7.65, 48);
const bottleHeight = Math.min(height * 0.19, 142);

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#061A3A",
  },

  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  screen: {
    flex: 1,
    paddingHorizontal: 10,
  },

  topBar: {
    height: Platform.OS === "ios" ? 76 : 68,
    paddingTop: Platform.OS === "ios" ? 4 : 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  topIconButton: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: "#9654EA",
    borderWidth: 3,
    borderColor: "#C9A2FF",
    alignItems: "center",
    justifyContent: "center",
  },

  settingsIcon: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
  },

  levelBadge: {
    width: 150,
    height: 48,
    borderRadius: 25,
    backgroundColor: "#168FE8",
    borderWidth: 3,
    borderColor: "#FFE0C4",
    alignItems: "center",
    justifyContent: "center",
  },

  levelText: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "900",
    textShadowColor: "#0B4B9E",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },

  coinBox: {
    minWidth: 118,
    height: 45,
    borderRadius: 22,
    backgroundColor: "#472063",
    borderWidth: 3,
    borderColor: "#9350DC",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
  },

  coinImage: {
    width: 32,
    height: 32,
    resizeMode: "contain",
  },

  coinText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    marginHorizontal: 5,
  },

  plusButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#45D51F",
    alignItems: "center",
    justifyContent: "center",
  },

  plusText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    marginTop: -2,
  },

  starArea: {
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  starProgressBack: {
    position: "absolute",
    width: 150,
    height: 11,
    borderRadius: 10,
    backgroundColor: "#5A3D86",
    borderWidth: 2,
    borderColor: "#25154D",
    overflow: "hidden",
  },

  starProgressFill: {
    height: "100%",
    backgroundColor: "#FFC226",
    borderRadius: 10,
  },

  starText: {
    fontSize: 31,
    marginHorizontal: 5,
  },

  emptyStarText: {
    fontSize: 31,
    marginHorizontal: 5,
    color: "#2E2748",
  },

  logoArea: {
    height: 142,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  logoImage: {
    width: width - 170,
    height: 120,
    resizeMode: "contain",
  },

  infoCard: {
    width: 72,
    height: 116,
    borderRadius: 18,
    backgroundColor: "#FFF1D9",
    borderWidth: 3,
    borderColor: "#C98E68",
    alignItems: "center",
    justifyContent: "center",
  },

  infoCardTitle: {
    color: "#7948B8",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 5,
  },

  movesNumber: {
    color: "#7D49BA",
    fontSize: 34,
    fontWeight: "900",
  },

  movesLimit: {
    color: "#7D49BA",
    fontSize: 18,
    fontWeight: "900",
  },

  targetBottleIcon: {
    width: 22,
    height: 45,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#A9BBC8",
    backgroundColor: "rgba(255,255,255,0.45)",
    overflow: "hidden",
    justifyContent: "flex-end",
  },

  targetBottleWater: {
    height: "80%",
    backgroundColor: LIQUID_COLORS.purple,
  },

  targetCount: {
    color: "#7D49BA",
    fontSize: 17,
    fontWeight: "900",
    marginTop: 5,
  },

  gameArea: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 6,
  },

  bottleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginVertical: 10,
  },

  bottleWrapper: {
    width: bottleWidth,
    height: bottleHeight,
    alignItems: "center",
    justifyContent: "flex-end",
    borderRadius: 18,
  },

  selectedBottle: {
    shadowColor: "#FFFFFF",
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },

  hintedBottle: {
    shadowOpacity: 1,
    shadowRadius: 14,
    elevation: 14,
  },

  hintFrom: {
    shadowColor: "#FFD22A",
  },

  hintTo: {
    shadowColor: "#49D51F",
  },

  bottleNeck: {
    width: bottleWidth * 0.72,
    height: bottleHeight * 0.16,
    borderTopLeftRadius: bottleWidth * 0.28,
    borderTopRightRadius: bottleWidth * 0.28,
    borderWidth: 2.4,
    borderColor: "rgba(225, 250, 255, 0.95)",
    backgroundColor: "rgba(255,255,255,0.28)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
    marginBottom: -4,
  },

  bottleMouth: {
    width: bottleWidth * 0.52,
    height: bottleHeight * 0.055,
    borderRadius: 20,
    borderWidth: 1.7,
    borderColor: "rgba(93, 153, 177, 0.75)",
    backgroundColor: "rgba(255,255,255,0.35)",
  },

  bottleBody: {
    width: bottleWidth * 0.8,
    height: bottleHeight * 0.78,
    borderWidth: 2.7,
    borderColor: "rgba(225, 250, 255, 0.98)",
    borderTopLeftRadius: bottleWidth * 0.18,
    borderTopRightRadius: bottleWidth * 0.18,
    borderBottomLeftRadius: bottleWidth * 0.34,
    borderBottomRightRadius: bottleWidth * 0.34,
    backgroundColor: "rgba(255,255,255,0.22)",
    overflow: "hidden",
    justifyContent: "flex-end",
  },

  liquidArea: {
    flex: 1,
    justifyContent: "flex-end",
    overflow: "hidden",
  },

  liquidStack: {
    flex: 1,
    justifyContent: "flex-start",
    flexDirection: "column-reverse",
  },

  liquidLayer: {
    width: "100%",
    overflow: "hidden",
    justifyContent: "flex-start",
  },

  liquidTopGloss: {
    width: "100%",
    height: 4,
    backgroundColor: "rgba(255,255,255,0.35)",
  },

  leftGlassLine: {
    position: "absolute",
    left: 4,
    top: 8,
    bottom: 14,
    width: 4,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.42)",
  },

  rightGlassLine: {
    position: "absolute",
    right: 4,
    top: 12,
    bottom: 18,
    width: 3,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.25)",
  },

  centerGlassGlow: {
    position: "absolute",
    left: "35%",
    top: 10,
    bottom: 16,
    width: 4,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.16)",
  },

  bottomGlassGlow: {
    position: "absolute",
    left: "18%",
    right: "18%",
    bottom: 5,
    height: 5,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.4)",
  },

  bottleBase: {
    width: bottleWidth * 0.7,
    height: 7,
    marginTop: -5,
    borderRadius: 8,
    backgroundColor: "rgba(95, 170, 195, 0.7)",
    borderWidth: 1,
    borderColor: "rgba(230,250,255,0.95)",
  },

  bottomButtons: {
    height: 104,
    paddingBottom: 6,
    paddingHorizontal: 22,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  gameButtonWrapper: {
    width: 86,
    height: 92,
    alignItems: "center",
    justifyContent: "center",
  },

  gameButton: {
    width: 78,
    height: 78,
    borderRadius: 23,
    borderWidth: 4,
    borderColor: "#FFE8C4",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 9,
  },

  buttonHighlight: {
    position: "absolute",
    top: 7,
    left: 10,
    right: 10,
    height: 20,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.28)",
  },

  buttonIcon: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
    marginTop: 2,
  },

  buttonLabel: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
    marginTop: -1,
  },

  buttonBadge: {
    position: "absolute",
    top: -1,
    right: 0,
    width: 29,
    height: 29,
    borderRadius: 15,
    backgroundColor: "#FFF0D7",
    borderWidth: 2,
    borderColor: "#C88A5B",
    zIndex: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonBadgeText: {
    color: "#8E5A2A",
    fontSize: 16,
    fontWeight: "900",
  },

  toastBox: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 112,
    minHeight: 38,
    borderRadius: 20,
    backgroundColor: "rgba(10, 15, 35, 0.88)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },

  toastText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  completeCard: {
    width: "100%",
    maxWidth: 340,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    padding: 22,
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#FFE0B8",
  },

  modalClose: {
    position: "absolute",
    top: 10,
    right: 14,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F1E7FF",
    alignItems: "center",
    justifyContent: "center",
  },

  modalCloseText: {
    color: "#7B3FF2",
    fontSize: 24,
    fontWeight: "900",
    marginTop: -2,
  },

  completeEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },

  completeTitle: {
    color: "#1F1740",
    fontSize: 26,
    fontWeight: "900",
  },

  completeSub: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 6,
    textAlign: "center",
  },

  rewardRow: {
    width: "100%",
    height: 56,
    borderRadius: 18,
    backgroundColor: "#FFF6D8",
    marginTop: 18,
    marginBottom: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  rewardText: {
    color: "#9B6400",
    fontSize: 15,
    fontWeight: "900",
  },

  rewardCoins: {
    color: "#1F1740",
    fontSize: 18,
    fontWeight: "900",
  },

  totalCoins: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 18,
  },

  modalButtons: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  replayButton: {
    width: "47%",
    height: 48,
    borderRadius: 18,
    backgroundColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
  },

  replayText: {
    color: "#7B3FF2",
    fontSize: 15,
    fontWeight: "900",
  },

  nextButton: {
    width: "47%",
    height: 48,
    borderRadius: 18,
    backgroundColor: "#16A34A",
    alignItems: "center",
    justifyContent: "center",
  },

  nextText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },
});