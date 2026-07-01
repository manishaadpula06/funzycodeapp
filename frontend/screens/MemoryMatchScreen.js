

// screens/MemoryMatchScreen.js

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Modal,
  Platform,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const MAX_LEVEL = 100;

const BG_IMAGE = require("../assets/images/memorymatchbackground.png");

const MEMORY_IMAGES = [
  { id: "memory1", source: require("../assets/images/memory1.png") },
  { id: "memory2", source: require("../assets/images/memory2.png") },
  { id: "memory3", source: require("../assets/images/memory3.png") },
  { id: "memory4", source: require("../assets/images/memory4.png") },
  { id: "memory5", source: require("../assets/images/memory5.png") },
  { id: "memory6", source: require("../assets/images/memory6.png") },
  { id: "memory7", source: require("../assets/images/memory7.png") },
  { id: "memory8", source: require("../assets/images/memory8.png") },
  { id: "memory9", source: require("../assets/images/memory9.png") },
  { id: "memory10", source: require("../assets/images/memory10.png") },
  { id: "memory11", source: require("../assets/images/memory11.png") },
  { id: "memory12", source: require("../assets/images/memory12.png") },
  { id: "memory13", source: require("../assets/images/memory13.png") },
  { id: "memory14", source: require("../assets/images/memory14.png") },
  { id: "memory15", source: require("../assets/images/memory15.png") },
  { id: "memory16", source: require("../assets/images/memory16.png") },
  { id: "memory17", source: require("../assets/images/memory17.png") },
  { id: "memory18", source: require("../assets/images/memory18.png") },
  { id: "memory19", source: require("../assets/images/memory19.png") },
  { id: "memory20", source: require("../assets/images/memory20.png") },
  { id: "memory21", source: require("../assets/images/memory21.png") },
  { id: "memory22", source: require("../assets/images/memory22.png") },
  { id: "memory23", source: require("../assets/images/memory23.png") },
  { id: "memory24", source: require("../assets/images/memory24.png") },
  { id: "memory25", source: require("../assets/images/memory25.png") },
  { id: "memory26", source: require("../assets/images/memory26.png") },
  { id: "memory27", source: require("../assets/images/memory27.png") },
  { id: "memory28", source: require("../assets/images/memory28.png") },
  { id: "memory29", source: require("../assets/images/memory29.png") },
  { id: "memory30", source: require("../assets/images/memory30.png") },
];

const POWERUPS = [
  { key: "reveal", icon: "eye", label: "Reveal", cost: 15, color: "#08BDFD" },
  { key: "hint", icon: "bulb", label: "Hint", cost: 20, color: "#67D53B" },
  { key: "shuffle", icon: "shuffle", label: "Shuffle", cost: 25, color: "#9A4DFF" },
  { key: "time", icon: "time", label: "+20s", cost: 30, color: "#FF9D0A" },
  { key: "match", icon: "flash", label: "Match", cost: 60, color: "#0DAFFF" },
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const shuffleArray = (array) => {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
};

const getLevelConfig = (level) => {
  let pairs = 3;

  if (level <= 5) pairs = 3;
  else if (level <= 10) pairs = 4;
  else if (level <= 15) pairs = 5;
  else if (level <= 20) pairs = 6;
  else if (level <= 25) pairs = 7;
  else if (level <= 30) pairs = 8;
  else if (level <= 38) pairs = 9;
  else if (level <= 46) pairs = 10;
  else if (level <= 54) pairs = 11;
  else if (level <= 62) pairs = 12;
  else if (level <= 75) pairs = 13;
  else if (level <= 88) pairs = 14;
  else pairs = 15;

  const totalCards = pairs * 2;

  let columns = 3;
  if (totalCards >= 8 && totalCards <= 16) columns = 4;
  if (totalCards >= 18 && totalCards <= 24) columns = 5;
  if (totalCards >= 26) columns = 6;

  const timeLimit = clamp(70 + pairs * 8 - Math.floor(level / 2), 55, 180);

  return {
    pairs,
    totalCards,
    columns,
    timeLimit,
  };
};

const createDeck = (level) => {
  const { pairs } = getLevelConfig(level);
  const startIndex = ((level - 1) * 3) % MEMORY_IMAGES.length;

  const selectedImages = Array.from({ length: pairs }, (_, index) => {
    return MEMORY_IMAGES[(startIndex + index) % MEMORY_IMAGES.length];
  });

  const cards = selectedImages.flatMap((item, index) => [
    {
      uid: `${level}-${item.id}-A-${index}-${Math.random()}`,
      imageId: item.id,
      image: item.source,
    },
    {
      uid: `${level}-${item.id}-B-${index}-${Math.random()}`,
      imageId: item.id,
      image: item.source,
    },
  ]);

  return shuffleArray(cards);
};

const chunkCards = (cards, columns) => {
  const rows = [];

  for (let i = 0; i < cards.length; i += columns) {
    rows.push(cards.slice(i, i + columns));
  }

  return rows;
};

export default function MemoryMatchScreen({ navigation }) {
  const { width, height } = useWindowDimensions();

  const [level, setLevel] = useState(1);
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [coins, setCoins] = useState(80);

  const [deck, setDeck] = useState(() => createDeck(1));
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(getLevelConfig(1).timeLimit);

  const [openedIds, setOpenedIds] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);
  const [hintIds, setHintIds] = useState([]);
  const [revealAll, setRevealAll] = useState(false);

  const [busy, setBusy] = useState(false);
  const [winVisible, setWinVisible] = useState(false);
  const [failVisible, setFailVisible] = useState(false);
  const [levelsVisible, setLevelsVisible] = useState(false);

  const [lastReward, setLastReward] = useState(0);
  const [lastStars, setLastStars] = useState(0);
  const [bestStars, setBestStars] = useState({});
  const [toast, setToast] = useState("");

  const revealTimer = useRef(null);
  const hintTimer = useRef(null);
  const toastTimer = useRef(null);

  const config = useMemo(() => getLevelConfig(level), [level]);

  const isShortScreen = height < 720;
  const screenWidth = Math.min(width, 440);
  const pageWidth = Math.max(310, screenWidth - 18);
  const boardInnerWidth = pageWidth - 30;

  const cardMargin = isShortScreen ? 4 : 5;

  const cardSize = useMemo(() => {
    const totalMargin = config.columns * cardMargin * 2;
    const rawSize = Math.floor((boardInnerWidth - totalMargin) / config.columns);

    if (config.columns >= 6) return clamp(rawSize, 38, 52);
    if (config.columns === 5) return clamp(rawSize, 42, 60);
    if (config.columns === 4) return clamp(rawSize, 50, isShortScreen ? 64 : 78);

    return clamp(rawSize, 58, isShortScreen ? 72 : 88);
  }, [boardInnerWidth, cardMargin, config.columns, isShortScreen]);

  const rows = useMemo(() => chunkCards(deck, config.columns), [deck, config.columns]);

  const matchedPairs = Math.floor(matchedIds.length / 2);
  const timerPercent = clamp(timeLeft / config.timeLimit, 0, 1);

  const showToast = useCallback((message) => {
    setToast(message);

    if (toastTimer.current) clearTimeout(toastTimer.current);

    toastTimer.current = setTimeout(() => {
      setToast("");
    }, 1500);
  }, []);

  const initLevel = useCallback((targetLevel) => {
    const safeLevel = clamp(targetLevel, 1, MAX_LEVEL);
    const nextConfig = getLevelConfig(safeLevel);

    if (revealTimer.current) clearTimeout(revealTimer.current);
    if (hintTimer.current) clearTimeout(hintTimer.current);

    setLevel(safeLevel);
    setDeck(createDeck(safeLevel));
    setMoves(0);
    setTimeLeft(nextConfig.timeLimit);

    setOpenedIds([]);
    setMatchedIds([]);
    setHintIds([]);
    setRevealAll(false);

    setBusy(false);
    setWinVisible(false);
    setFailVisible(false);
  }, []);

  useEffect(() => {
    if (winVisible || failVisible || levelsVisible) return undefined;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setFailVisible(true);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [winVisible, failVisible, levelsVisible]);

  useEffect(() => {
    return () => {
      if (revealTimer.current) clearTimeout(revealTimer.current);
      if (hintTimer.current) clearTimeout(hintTimer.current);
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const handleBack = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
      return;
    }

    navigation?.navigate?.("FunGames");
  };

  const completeLevel = useCallback(
    (finalMoves) => {
      const perfectMoves = config.pairs;

      let stars = 1;

      if (finalMoves <= perfectMoves + 2 && timeLeft > config.timeLimit * 0.4) {
        stars = 3;
      } else if (finalMoves <= perfectMoves + 6) {
        stars = 2;
      }

      const reward = level * 2 + stars * 25 + Math.floor(timeLeft / 2);

      setLastStars(stars);
      setLastReward(reward);
      setCoins((prev) => prev + reward);

      setBestStars((prev) => ({
        ...prev,
        [level]: Math.max(prev[level] || 0, stars),
      }));

      if (level === unlockedLevel && level < MAX_LEVEL) {
        setUnlockedLevel(level + 1);
      }

      setWinVisible(true);
    },
    [config.pairs, config.timeLimit, level, timeLeft, unlockedLevel]
  );

  const handleCardPress = (card) => {
    if (busy || revealAll) return;
    if (openedIds.includes(card.uid)) return;
    if (matchedIds.includes(card.uid)) return;
    if (openedIds.length >= 2) return;

    const nextOpened = [...openedIds, card.uid];
    setOpenedIds(nextOpened);

    if (nextOpened.length !== 2) return;

    const firstCard = deck.find((item) => item.uid === nextOpened[0]);
    const secondCard = card;

    if (!firstCard) return;

    const nextMoves = moves + 1;
    setMoves(nextMoves);
    setBusy(true);

    setTimeout(() => {
      if (firstCard.imageId === secondCard.imageId) {
        setMatchedIds((prev) => {
          const updated = Array.from(new Set([...prev, firstCard.uid, secondCard.uid]));

          if (updated.length === deck.length) {
            setTimeout(() => completeLevel(nextMoves), 250);
          }

          return updated;
        });
      }

      setOpenedIds([]);
      setBusy(false);
    }, 650);
  };

  const payCoins = (cost) => {
    if (coins < cost) {
      showToast(`Need ${cost} coins`);
      return false;
    }

    setCoins((prev) => prev - cost);
    return true;
  };

  const useReveal = () => {
    if (!payCoins(15)) return;

    setRevealAll(true);

    if (revealTimer.current) clearTimeout(revealTimer.current);

    revealTimer.current = setTimeout(() => {
      setRevealAll(false);
    }, 1250);
  };

  const useHint = () => {
    const hiddenCards = deck.filter(
      (card) =>
        !matchedIds.includes(card.uid) &&
        !openedIds.includes(card.uid) &&
        !hintIds.includes(card.uid)
    );

    const grouped = hiddenCards.reduce((acc, card) => {
      if (!acc[card.imageId]) acc[card.imageId] = [];
      acc[card.imageId].push(card);
      return acc;
    }, {});

    const pair = Object.values(grouped).find((items) => items.length >= 2);

    if (!pair) {
      showToast("No hint available");
      return;
    }

    if (!payCoins(20)) return;

    setHintIds([pair[0].uid, pair[1].uid]);

    if (hintTimer.current) clearTimeout(hintTimer.current);

    hintTimer.current = setTimeout(() => {
      setHintIds([]);
    }, 1300);
  };

  const useShuffle = () => {
    if (!payCoins(25)) return;

    setOpenedIds([]);
    setHintIds([]);
    setDeck((prev) => shuffleArray(prev));
  };

  const useTime = () => {
    if (!payCoins(30)) return;

    setTimeLeft((prev) => prev + 20);
    showToast("+20 seconds");
  };

  const useAutoMatch = () => {
    const hiddenCards = deck.filter(
      (card) => !matchedIds.includes(card.uid) && !openedIds.includes(card.uid)
    );

    const grouped = hiddenCards.reduce((acc, card) => {
      if (!acc[card.imageId]) acc[card.imageId] = [];
      acc[card.imageId].push(card);
      return acc;
    }, {});

    const pair = Object.values(grouped).find((items) => items.length >= 2);

    if (!pair) {
      showToast("No pair available");
      return;
    }

    if (!payCoins(60)) return;

    const nextMoves = moves + 1;

    setMoves(nextMoves);
    setBusy(true);
    setOpenedIds([pair[0].uid, pair[1].uid]);

    setTimeout(() => {
      setMatchedIds((prev) => {
        const updated = Array.from(new Set([...prev, pair[0].uid, pair[1].uid]));

        if (updated.length === deck.length) {
          setTimeout(() => completeLevel(nextMoves), 250);
        }

        return updated;
      });

      setOpenedIds([]);
      setBusy(false);
    }, 700);
  };

  const handlePowerup = (key) => {
    if (key === "reveal") useReveal();
    if (key === "hint") useHint();
    if (key === "shuffle") useShuffle();
    if (key === "time") useTime();
    if (key === "match") useAutoMatch();
  };

  const retryLevel = () => {
    initLevel(level);
  };

  const nextLevel = () => {
    setWinVisible(false);

    if (level >= MAX_LEVEL) {
      showToast("All 100 levels completed");
      initLevel(1);
      return;
    }

    initLevel(level + 1);
  };

  const openLevel = (targetLevel) => {
    if (targetLevel > unlockedLevel) {
      showToast("Complete previous level first");
      return;
    }

    setLevelsVisible(false);
    initLevel(targetLevel);
  };

  const renderCard = (card) => {
    const isOpened = openedIds.includes(card.uid);
    const isMatched = matchedIds.includes(card.uid);
    const isHint = hintIds.includes(card.uid);
    const isVisible = isOpened || isMatched || isHint || revealAll;

    return (
      <TouchableOpacity
        key={card.uid}
        activeOpacity={0.88}
        onPress={() => handleCardPress(card)}
        style={[
          styles.cardOuter,
          {
            width: cardSize,
            height: cardSize,
            margin: cardMargin,
            borderRadius: Math.max(12, cardSize * 0.2),
          },
          isMatched && styles.cardMatched,
        ]}
      >
        {isVisible ? (
          <LinearGradient
            colors={["#FFFFFF", "#FFF7D7"]}
            style={[
              styles.cardFront,
              {
                borderRadius: Math.max(12, cardSize * 0.2),
              },
            ]}
          >
            <Image source={card.image} style={styles.cardImage} resizeMode="contain" />
          </LinearGradient>
        ) : (
          <LinearGradient
            colors={["#12C9FF", "#246BFF", "#A138FF"]}
            start={{ x: 0.15, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.cardBack,
              {
                borderRadius: Math.max(12, cardSize * 0.2),
              },
            ]}
          >
            <Text style={[styles.questionText, { fontSize: cardSize * 0.45 }]}>
              ?
            </Text>
          </LinearGradient>
        )}
      </TouchableOpacity>
    );
  };

  const renderLevelButton = (itemLevel) => {
    const locked = itemLevel > unlockedLevel;
    const stars = bestStars[itemLevel] || 0;
    const current = itemLevel === level;

    return (
      <TouchableOpacity
        key={`level-${itemLevel}`}
        activeOpacity={0.85}
        onPress={() => openLevel(itemLevel)}
        style={[
          styles.levelBtn,
          locked && styles.levelBtnLocked,
          current && styles.levelBtnCurrent,
        ]}
      >
        <Text style={[styles.levelBtnText, locked && styles.levelBtnTextLocked]}>
          {locked ? "🔒" : itemLevel}
        </Text>

        {!locked && (
          <Text style={styles.levelStarText}>
            {stars > 0 ? "★".repeat(stars) : "•"}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        styles.root,
        Platform.OS === "web" ? { minHeight: height, height } : null,
      ]}
    >
      <ImageBackground
        source={BG_IMAGE}
        style={styles.bg}
        imageStyle={styles.bgImage}
        resizeMode="cover"
      >
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

        <LinearGradient
          colors={[
            "rgba(0,0,0,0.08)",
            "rgba(0,0,0,0.32)",
            "rgba(0,0,0,0.72)",
            "rgba(0,0,0,0.88)",
          ]}
          locations={[0, 0.35, 0.72, 1]}
          style={styles.overlay}
        >
          <SafeAreaView style={styles.safe}>
            <View style={[styles.headerShell, { width: pageWidth }]}>
              <View style={styles.topHeader}>
                <TouchableOpacity
                  style={styles.backButton}
                  activeOpacity={0.85}
                  onPress={handleBack}
                >
                  <Ionicons name="arrow-back" size={25} color="#FFFFFF" />
                </TouchableOpacity>

                <View style={styles.headerTitleBox}>
                  <Text style={styles.headerTitle}>Memory Match</Text>
                  <Text style={styles.headerSubTitle}>
                    Level {level} / {MAX_LEVEL}
                  </Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.gridButton}
                  onPress={() => setLevelsVisible(true)}
                >
                  <Ionicons name="grid" size={23} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              <View style={styles.statsRow}>
                <StatPill icon="cash" iconColor="#FFD86B" value={`${coins}`} />
                <StatPill icon="footsteps" iconColor="#FFD86B" value={`${moves} Moves`} />
                <StatPill icon="time" iconColor="#FF547A" value={`${timeLeft}s`} />
              </View>

              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${timerPercent * 100}%` }]} />
                <View style={[styles.progressGlow, { left: `${timerPercent * 94}%` }]} />
              </View>
            </View>

            <ScrollView
              style={styles.middleScroll}
              contentContainerStyle={[
                styles.middleContent,
                isShortScreen && styles.middleContentSmall,
              ]}
              showsVerticalScrollIndicator={false}
            >
              <View style={[styles.boardPanel, { width: pageWidth }]}>
                <LinearGradient
                  colors={["rgba(2,15,40,0.97)", "rgba(1,8,26,0.96)"]}
                  style={styles.boardGradient}
                >
                  {rows.map((row, rowIndex) => (
                    <View key={`row-${rowIndex}`} style={styles.cardRow}>
                      {row.map(renderCard)}
                    </View>
                  ))}
                </LinearGradient>
              </View>

              <View style={[styles.infoBox, { width: pageWidth }]}>
                <View style={styles.infoTextBox}>
                  <Text style={styles.infoLabel}>Selected Pair</Text>
                  <Text style={styles.infoText}>
                    Tap two cards and find the same image
                  </Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.retryButton}
                  onPress={retryLevel}
                >
                  <Ionicons name="refresh" size={18} color="#FFFFFF" />
                  <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.findBox, { width: pageWidth }]}>
                <Text style={styles.findTitle}>Find Pairs</Text>

                <View style={styles.findChipsRow}>
                  <View style={styles.findChip}>
                    <Ionicons name="images" size={15} color="#FFD86B" />
                    <Text style={styles.findChipText}>{config.pairs} Pairs</Text>
                  </View>

                  <View style={styles.findChip}>
                    <Ionicons name="footsteps" size={15} color="#FFD86B" />
                    <Text style={styles.findChipText}>{moves} Moves</Text>
                  </View>

                  <View style={styles.findChip}>
                    <Ionicons name="checkmark-done" size={15} color="#FFD86B" />
                    <Text style={styles.findChipText}>
                      {matchedPairs}/{config.pairs}
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>

            <View style={[styles.powerPanel, { width: pageWidth }]}>
              {POWERUPS.map((item) => (
                <PowerButton
                  key={item.key}
                  icon={item.icon}
                  label={item.label}
                  cost={item.cost}
                  color={item.color}
                  onPress={() => handlePowerup(item.key)}
                />
              ))}
            </View>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>

      <Modal transparent visible={winVisible} animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.resultCard}>
            <Text style={styles.resultEmoji}>🎉</Text>
            <Text style={styles.resultTitle}>Level Complete!</Text>
            <Text style={styles.resultSub}>Level {level} finished successfully</Text>

            <Text style={styles.starsText}>{"★".repeat(lastStars)}</Text>

            <View style={styles.rewardPill}>
              <Ionicons name="cash" size={21} color="#FFD86B" />
              <Text style={styles.rewardText}>+{lastReward} Coins</Text>
            </View>

            <TouchableOpacity style={styles.nextBtn} activeOpacity={0.9} onPress={nextLevel}>
              <Text style={styles.nextBtnText}>
                {level >= MAX_LEVEL ? "Finish Game" : "Next Level"}
              </Text>
              <Ionicons name="arrow-forward" size={20} color="#07101F" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={failVisible} animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.resultCard}>
            <Text style={styles.resultEmoji}>⏰</Text>
            <Text style={styles.resultTitle}>Time Up!</Text>
            <Text style={styles.resultSub}>Try again and complete the level faster.</Text>

            <TouchableOpacity style={styles.nextBtn} activeOpacity={0.9} onPress={retryLevel}>
              <Ionicons name="refresh" size={20} color="#07101F" />
              <Text style={styles.nextBtnText}>Retry Level</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={levelsVisible} animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.levelsCard}>
            <View style={styles.levelsHeader}>
              <View>
                <Text style={styles.levelsTitle}>Choose Level</Text>
                <Text style={styles.levelsSub}>
                  Unlocked {unlockedLevel} / {MAX_LEVEL}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.closeBtn}
                activeOpacity={0.85}
                onPress={() => setLevelsVisible(false)}
              >
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.levelGrid}>
                {Array.from({ length: MAX_LEVEL }, (_, index) =>
                  renderLevelButton(index + 1)
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {!!toast && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      )}
    </View>
  );
}

function StatPill({ icon, iconColor, value }) {
  return (
    <View style={styles.statPill}>
      <Ionicons name={icon} size={17} color={iconColor} />
      <Text style={styles.statText}>{value}</Text>
    </View>
  );
}

function PowerButton({ icon, label, cost, color, onPress }) {
  return (
    <TouchableOpacity activeOpacity={0.86} style={styles.powerButton} onPress={onPress}>
      <View style={[styles.powerIconCircle, { backgroundColor: color }]}>
        <Ionicons name={icon} size={22} color="#FFFFFF" />
      </View>

      <Text style={styles.powerLabel}>{label}</Text>

      <View style={styles.powerCostRow}>
        <Ionicons name="cash" size={12} color="#FFD86B" />
        <Text style={styles.powerCost}>{cost}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#030816",
  },

  bg: {
    flex: 1,
    width: "100%",
    backgroundColor: "#030816",
  },

  bgImage: {
    width: "100%",
    height: "100%",
  },

  overlay: {
    flex: 1,
    width: "100%",
  },

  safe: {
    flex: 1,
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 24 : 0,
  },


  topHeader: {
    marginTop:40,
    height: 58,
    borderRadius: 24,
    backgroundColor: "#06285B",
    borderWidth: 1.5,
    borderColor: "rgba(96, 255, 244, 0.8)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FF9A22",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFD474",
  },

  headerTitleBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },

  headerSubTitle: {
    color: "#8FFFF6",
    fontSize: 12,
    fontWeight: "900",
    marginTop: 1,
  },

  gridButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: "#56CF34",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#BBFF8B",
  },

  statsRow: {
    marginTop: 8,
    flexDirection: "row",
  },

  statPill: {
    flex: 1,
    height: 38,
    marginHorizontal: 4,
    borderRadius: 22,
    backgroundColor: "rgba(3, 15, 40, 0.94)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.2)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  statText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
    marginLeft: 6,
  },

  progressTrack: {
    height: 10,
    marginHorizontal: 10,
    marginTop: 9,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 20,
    backgroundColor: "#FFCA21",
  },

  progressGlow: {
    position: "absolute",
    top: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#FFFFFF",
    opacity: 0.55,
  },

  middleScroll: {
    flex: 1,
    width: "100%",
  },

  middleContent: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 14,
  },

  middleContentSmall: {
    paddingTop: 8,
    paddingBottom: 10,
  },

  boardPanel: {
    borderRadius: 32,
    backgroundColor: "rgba(2, 12, 34, 0.9)",
    borderWidth: 3,
    borderColor: "#13F7EC",
    padding: 7,
  },

  boardGradient: {
    borderRadius: 26,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 220,
  },

  cardRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  cardOuter: {
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },

  cardFront: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#E5FCFF",
  },

  cardBack: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.75)",
  },

  questionText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },

  cardImage: {
    width: "78%",
    height: "78%",
  },

  cardMatched: {
    opacity: 0.6,
    transform: [{ scale: 0.95 }],
  },

  infoBox: {
    minHeight: 68,
    marginTop: 10,
    borderRadius: 22,
    backgroundColor: "rgba(2, 13, 35, 0.88)",
    borderWidth: 1.5,
    borderColor: "rgba(71, 185, 255, 0.45)",
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  infoTextBox: {
    flex: 1,
    paddingRight: 8,
  },

  infoLabel: {
    color: "#1DD9FF",
    fontSize: 13,
    fontWeight: "900",
  },

  infoText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
    marginTop: 4,
  },

  retryButton: {
    height: 42,
    paddingHorizontal: 16,
    borderRadius: 22,
    backgroundColor: "#FF9A22",
    borderWidth: 2,
    borderColor: "#FFD474",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  retryText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
    marginLeft: 6,
  },

  findBox: {
    marginTop: 9,
    borderRadius: 22,
    backgroundColor: "rgba(2, 13, 35, 0.82)",
    borderWidth: 1.5,
    borderColor: "rgba(71, 185, 255, 0.35)",
    padding: 14,
  },

  findTitle: {
    color: "#1DD9FF",
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 10,
  },

  findChipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  findChip: {
    height: 31,
    paddingHorizontal: 11,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.13)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
    marginBottom: 6,
  },

  findChipText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
    marginLeft: 5,
  },

  powerPanel: {
    marginBottom: Platform.OS === "ios" ? 10 : 8,
    borderRadius: 28,
    borderWidth: 2.5,
    borderColor: "#00B8F5",
    backgroundColor: "rgba(2, 13, 35, 0.96)",
    paddingVertical: 8,
    paddingHorizontal: 6,
    flexDirection: "row",
  },

  powerButton: {
    flex: 1,
    minHeight: 72,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    borderRightWidth: 1,
    borderRightColor: "rgba(255,255,255,0.08)",
  },

  powerIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.35)",
  },

  powerLabel: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
    marginTop: 4,
  },

  powerCostRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },

  powerCost: {
    color: "#FFD86B",
    fontSize: 11,
    fontWeight: "900",
    marginLeft: 2,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.78)",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
  },

  resultCard: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 30,
    backgroundColor: "#07101F",
    padding: 24,
    alignItems: "center",
    borderWidth: 2.5,
    borderColor: "#36F0B1",
  },

  resultEmoji: {
    fontSize: 50,
  },

  resultTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    marginTop: 8,
  },

  resultSub: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 6,
  },

  starsText: {
    color: "#FFD86B",
    fontSize: 29,
    fontWeight: "900",
    marginTop: 12,
  },

  rewardPill: {
    marginTop: 15,
    marginBottom: 18,
    borderRadius: 18,
    backgroundColor: "rgba(255,216,107,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,216,107,0.35)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  rewardText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    marginLeft: 8,
  },

  nextBtn: {
    height: 50,
    borderRadius: 20,
    paddingHorizontal: 24,
    backgroundColor: "#FFD86B",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  nextBtnText: {
    color: "#07101F",
    fontSize: 15,
    fontWeight: "900",
    marginRight: 8,
  },

  levelsCard: {
    width: "100%",
    maxWidth: 410,
    maxHeight: "86%",
    borderRadius: 28,
    backgroundColor: "#07101F",
    borderWidth: 2.5,
    borderColor: "#36F0B1",
    padding: 14,
  },

  levelsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  levelsTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
  },

  levelsSub: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 2,
  },

  closeBtn: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },

  levelGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingBottom: 8,
  },

  levelBtn: {
    width: 56,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#15B86A",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.22)",
    margin: 4,
  },

  levelBtnLocked: {
    backgroundColor: "rgba(255,255,255,0.12)",
  },

  levelBtnCurrent: {
    backgroundColor: "#0E7CFF",
    borderColor: "#FFD86B",
  },

  levelBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },

  levelBtnTextLocked: {
    fontSize: 17,
  },

  levelStarText: {
    color: "#FFD86B",
    fontSize: 9,
    fontWeight: "900",
    marginTop: 1,
  },

  toast: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: 105,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.9)",
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },

  toastText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },
});