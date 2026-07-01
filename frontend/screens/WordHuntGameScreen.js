
// screens/WordHuntGameScreen.js

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  ImageBackground,
  Modal,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const BG_IMAGE = require("../assets/images/wordhuntbackground.png");

const COLORS = {
  white: "#FFFFFF",
  dark: "#03182A",
  dark2: "#061D3A",
  cyan: "#19D9FF",
  green: "#22E06F",
  yellow: "#FFD247",
  orange: "#FF941A",
  red: "#FF4D6D",
  purple: "#8B5CFF",
  board: "#DDF7FF",
  cell: "#FFFFFF",
  text: "#142033",
};

const WORD_LEVELS = [
  ["CAT", "DOG"],
  ["SUN", "MOON", "STAR"],
  ["FISH", "BIRD", "COW"],
  ["APPLE", "BALL", "BAT"],
  ["LION", "TIGER", "BEAR"],
  ["MONKEY", "PANDA", "HORSE"],
  ["ORANGE", "BANANA", "GRAPE"],
  ["TABLE", "CHAIR", "SOFA"],
  ["TRAIN", "PLANE", "TRUCK"],
  ["HOUSE", "SCHOOL", "TEMPLE"],

  ["ELEPHANT", "GIRAFFE", "ZEBRA"],
  ["FLOWER", "PLANT", "GARDEN"],
  ["MOBILE", "LAPTOP", "SCREEN"],
  ["TEACHER", "STUDENT", "CLASS"],
  ["COUNTRY", "CAPITAL", "LANGUAGE"],
  ["KANGAROO", "ELEPHANT", "MONKEY"],
  ["BREAKFAST", "LUNCH", "DINNER"],
  ["FAMILY", "FRIENDS", "RELATIVE"],
  ["COMPUTER", "INTERNET", "WEBSITE"],
  ["PROGRAM", "DEVELOPER", "SOFTWARE"],

  ["RIVER", "OCEAN", "LAKE", "POND"],
  ["DOCTOR", "NURSE", "HOSPITAL", "MEDICINE"],
  ["MANGO", "PAPAYA", "PINEAPPLE", "COCONUT"],
  ["CIRCLE", "SQUARE", "TRIANGLE", "RECTANGLE"],
  ["PENCIL", "ERASER", "NOTEBOOK", "RULER"],
  ["WINTER", "SUMMER", "SPRING", "AUTUMN"],
  ["MORNING", "EVENING", "NIGHT"],
  ["KITCHEN", "BEDROOM", "BATHROOM", "GARDEN"],
  ["POLICE", "FIRE", "AMBULANCE", "RESCUE"],
  ["MUSIC", "DANCE", "PAINTING", "DRAMA"],

  ["ENGINE", "WHEEL", "BRAKE", "GEAR"],
  ["PLANET", "GALAXY", "COMET", "ASTEROID"],
  ["PYTHON", "JAVASCRIPT", "HTML", "CSS"],
  ["BOTTLE", "GLASS", "PLATE", "SPOON"],
  ["MARKET", "SHOPPING", "BILL", "CASH"],
  ["STADIUM", "CRICKET", "FOOTBALL", "HOCKEY"],
  ["AIRPORT", "PASSPORT", "TICKET", "LUGGAGE"],
  ["SCIENCE", "HISTORY", "GEOGRAPHY", "MATH"],
  ["ENERGY", "POWER", "SOLAR", "WIND"],
  ["NATURE", "FOREST", "MOUNTAIN", "DESERT"],

  ["HAPPY", "SAD", "ANGRY", "EXCITED"],
  ["HONEST", "KIND", "BRAVE", "HELPFUL"],
  ["KALAM", "TAGORE", "GANDHI", "NEHRU"],
  ["TEMPLE", "CHURCH", "MOSQUE", "GURUDWARA"],
  ["TOMATO", "POTATO", "ONION", "CARROT"],
  ["CAMERA", "SPEAKER", "HEADPHONE", "MOBILE"],
  ["SATURDAY", "SUNDAY", "MONDAY", "TUESDAY"],
  ["JANUARY", "FEBRUARY", "MARCH", "APRIL"],
  ["RAINBOW", "THUNDER", "LIGHTNING", "CLOUD"],
  ["SUCCESS", "EFFORT", "PRACTICE", "CONFIDENCE"],

  ["ROBOT", "SENSOR", "BUTTON", "BATTERY"],
  ["CODING", "LOGIC", "DEBUG", "OUTPUT"],
  ["LEVEL", "MISSION", "TROPHY", "REWARD"],
  ["CASTLE", "DRAGON", "KNIGHT", "SWORD"],
  ["COOKIE", "CANDY", "CHOCOLATE", "SWEET"],
  ["PUZZLE", "RIDDLE", "SECRET", "ANSWER"],
  ["ISLAND", "BEACH", "SHELL", "WAVE"],
  ["FOREST", "ANIMAL", "HUNTER", "CAVE"],
  ["ROCKET", "PLANET", "ALIEN", "SPACE"],
  ["CROWN", "KING", "QUEEN", "PALACE"],

  ["BUTTON", "SCREEN", "SWIPE", "TAP"],
  ["VECTOR", "CANVAS", "PIXEL", "COLOR"],
  ["NUMBER", "LETTER", "SYMBOL", "WORD"],
  ["GUITAR", "PIANO", "VIOLIN", "DRUM"],
  ["JUNGLE", "TIGER", "SNAKE", "PARROT"],
  ["PIRATE", "TREASURE", "ISLAND", "SHIP"],
  ["MAGIC", "WIZARD", "SPELL", "POTION"],
  ["RACING", "TURBO", "TRACK", "WINNER"],
  ["BASKET", "TENNIS", "SOCCER", "KARATE"],
  ["DIAMOND", "SILVER", "GOLD", "RUBY"],

  ["ANDROID", "MOBILE", "TABLET", "DEVICE"],
  ["LOGIN", "SCREEN", "BUTTON", "HEADER"],
  ["UPLOAD", "IMAGE", "CAMERA", "GALLERY"],
  ["SERVER", "CLIENT", "DATABASE", "NETWORK"],
  ["SPRING", "REACT", "EXPO", "FIREBASE"],
  ["TOKEN", "QUEUE", "DOCTOR", "PATIENT"],
  ["ADMIN", "REPORT", "STATUS", "SOLVED"],
  ["DONATE", "RETURN", "EXCHANGE", "RENTAL"],
  ["SEARCH", "FILTER", "SORT", "DETAILS"],
  ["PROFILE", "SETTINGS", "NOTIFY", "SUPPORT"],

  ["GALAXY", "NEBULA", "ORBIT", "COSMOS"],
  ["BREEZE", "CYCLONE", "STORM", "RAIN"],
  ["FARMER", "HARVEST", "FIELD", "TRACTOR"],
  ["BRIDGE", "TUNNEL", "ROAD", "SIGNAL"],
  ["LIBRARY", "BOOK", "AUTHOR", "STORY"],
  ["MUSEUM", "ARTIST", "PAINT", "FRAME"],
  ["BALLOON", "CIRCUS", "CLOWN", "TICKET"],
  ["FESTIVAL", "LIGHTS", "DANCE", "MUSIC"],
  ["DINOSAUR", "FOSSIL", "STONE", "BONE"],
  ["VOLCANO", "LAVA", "SMOKE", "ASH"],

  ["CAPTAIN", "SAILOR", "ANCHOR", "OCEAN"],
  ["BISCUIT", "COOKIE", "CREAM", "SUGAR"],
  ["LANTERN", "CANDLE", "FLAME", "SHADOW"],
  ["SCHOOL", "EXAM", "MARKS", "RESULT"],
  ["BRUSH", "PALETTE", "SKETCH", "CANVAS"],
  ["HELMET", "JACKET", "GLOVES", "SHOES"],
  ["PLAN", "BUILD", "TEST", "LAUNCH"],
  ["BINARY", "SCRIPT", "LOOP", "ARRAY"],
  ["DREAM", "GOAL", "FOCUS", "VICTORY"],
  ["CHAMPION", "LEGEND", "MASTER", "HERO"],
];

const MAX_LEVEL = WORD_LEVELS.length;

const DIRECTIONS = [
  { dr: 0, dc: 1 },
  { dr: 1, dc: 0 },
  { dr: 1, dc: 1 },
  { dr: 1, dc: -1 },
  { dr: 0, dc: -1 },
  { dr: -1, dc: 0 },
  { dr: -1, dc: -1 },
  { dr: -1, dc: 1 },
];

const rcToIndex = (row, col, size) => row * size + col;

const indexToRC = (index, size) => ({
  row: Math.floor(index / size),
  col: index % size,
});

const randomLetter = () =>
  String.fromCharCode(65 + Math.floor(Math.random() * 26));

const reverseWord = (word) => word.split("").reverse().join("");

const getLevelSettings = (level, words) => {
  let size = 6;

  if (level <= 10) size = 6;
  else if (level <= 25) size = 7;
  else if (level <= 45) size = 8;
  else if (level <= 65) size = 9;
  else if (level <= 85) size = 10;
  else size = 11;

  const longestWord = Math.max(...words.map((word) => word.length));
  size = Math.min(12, Math.max(size, longestWord));

  const time = Math.max(55, 100 - Math.floor(level / 2) + words.length * 7);

  return { size, time };
};

const isStraightSelection = (indices, size) => {
  if (indices.length <= 1) return true;

  const first = indexToRC(indices[0], size);
  const second = indexToRC(indices[1], size);

  const rowDiff = second.row - first.row;
  const colDiff = second.col - first.col;

  if (Math.abs(rowDiff) > 1 || Math.abs(colDiff) > 1) return false;
  if (rowDiff === 0 && colDiff === 0) return false;

  const dr = Math.sign(rowDiff);
  const dc = Math.sign(colDiff);

  for (let i = 1; i < indices.length; i++) {
    const row = first.row + dr * i;
    const col = first.col + dc * i;

    if (row < 0 || row >= size || col < 0 || col >= size) return false;
    if (indices[i] !== rcToIndex(row, col, size)) return false;
  }

  return true;
};

const createPuzzle = (words, requestedSize) => {
  let size = requestedSize;

  for (let expand = 0; expand < 3; expand++) {
    for (let restart = 0; restart < 80; restart++) {
      const grid = Array.from({ length: size }, () => Array(size).fill(""));
      const positions = {};
      let success = true;

      const sortedWords = [...words].sort((a, b) => b.length - a.length);

      for (const word of sortedWords) {
        let placed = false;

        for (let attempt = 0; attempt < 700; attempt++) {
          const direction =
            DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];

          const startRow = Math.floor(Math.random() * size);
          const startCol = Math.floor(Math.random() * size);

          const cells = [];
          let canPlace = true;

          for (let i = 0; i < word.length; i++) {
            const row = startRow + direction.dr * i;
            const col = startCol + direction.dc * i;

            if (row < 0 || row >= size || col < 0 || col >= size) {
              canPlace = false;
              break;
            }

            if (grid[row][col] && grid[row][col] !== word[i]) {
              canPlace = false;
              break;
            }

            cells.push({ row, col, index: rcToIndex(row, col, size) });
          }

          if (canPlace) {
            cells.forEach((cell, i) => {
              grid[cell.row][cell.col] = word[i];
            });

            positions[word] = cells.map((cell) => cell.index);
            placed = true;
            break;
          }
        }

        if (!placed) {
          success = false;
          break;
        }
      }

      if (success) {
        const letters = [];

        for (let row = 0; row < size; row++) {
          for (let col = 0; col < size; col++) {
            letters.push(grid[row][col] || randomLetter());
          }
        }

        return { letters, positions, size };
      }
    }

    size = Math.min(12, size + 1);
  }

  return {
    letters: Array.from({ length: size * size }, () => randomLetter()),
    positions: {},
    size,
  };
};

export default function WordHuntGameScreen({ navigation }) {
  const { width, height } = useWindowDimensions();

  const isTinyScreen = width < 350;
  const isSmallScreen = width < 380;
  const screenPadding = 14;

  const initialWords = WORD_LEVELS[0];
  const initialSettings = getLevelSettings(1, initialWords);

  const [level, setLevel] = useState(1);
  const [coins, setCoins] = useState(80);
  const [unlockedLevels, setUnlockedLevels] = useState([1]);

  const [currentWords, setCurrentWords] = useState(initialWords);
  const [puzzle, setPuzzle] = useState(() =>
    createPuzzle(initialWords, initialSettings.size)
  );

  const [selectedCells, setSelectedCells] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [foundCells, setFoundCells] = useState([]);
  const [hintCells, setHintCells] = useState([]);

  const [timeLeft, setTimeLeft] = useState(initialSettings.time);
  const [freezeLeft, setFreezeLeft] = useState(0);

  const [toast, setToast] = useState("");
  const [earnedCoins, setEarnedCoins] = useState(0);

  const [showWin, setShowWin] = useState(false);
  const [showLose, setShowLose] = useState(false);
  const [levelsVisible, setLevelsVisible] = useState(false);

  const finishedRef = useRef(false);
  const freezeRef = useRef(0);
  const toastTimerRef = useRef(null);
  const hintTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      clearTimeout(toastTimerRef.current);
      clearTimeout(hintTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (showWin || showLose || levelsVisible) return;

    const timer = setInterval(() => {
      if (finishedRef.current) return;

      if (freezeRef.current > 0) {
        freezeRef.current -= 1;
        setFreezeLeft(freezeRef.current);
        return;
      }

      setTimeLeft((prev) => {
        if (prev <= 1) {
          finishedRef.current = true;
          setShowLose(true);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showWin, showLose, levelsVisible]);

  const showMessage = (message) => {
    clearTimeout(toastTimerRef.current);
    setToast(message);

    toastTimerRef.current = setTimeout(() => {
      setToast("");
    }, 1500);
  };

  const startLevel = (targetLevel) => {
    const safeLevel = Math.min(Math.max(targetLevel, 1), MAX_LEVEL);
    const words = WORD_LEVELS[safeLevel - 1].map((word) =>
      word.toUpperCase().replace(/\s/g, "")
    );

    const settings = getLevelSettings(safeLevel, words);
    const nextPuzzle = createPuzzle(words, settings.size);

    finishedRef.current = false;
    freezeRef.current = 0;

    clearTimeout(hintTimerRef.current);

    setLevel(safeLevel);
    setCurrentWords(words);
    setPuzzle(nextPuzzle);

    setSelectedCells([]);
    setFoundWords([]);
    setFoundCells([]);
    setHintCells([]);

    setTimeLeft(settings.time);
    setFreezeLeft(0);
    setEarnedCoins(0);

    setShowWin(false);
    setShowLose(false);
    setLevelsVisible(false);
  };

  const goBack = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
      return;
    }

    navigation?.navigate?.("FunGames");
  };

  const handleCellPress = (index) => {
    if (showWin || showLose) return;
    if (foundCells.includes(index)) return;

    if (selectedCells.includes(index)) {
      setSelectedCells((prev) => prev.filter((item) => item !== index));
      return;
    }

    const nextSelected = [...selectedCells, index];

    if (!isStraightSelection(nextSelected, puzzle.size)) {
      showMessage("Select in one straight line");
      return;
    }

    setSelectedCells(nextSelected);
    checkSelectedWord(nextSelected);
  };

  const checkSelectedWord = (indices) => {
    const selectedWord = indices.map((index) => puzzle.letters[index]).join("");
    const reversed = reverseWord(selectedWord);

    const matchedWord = currentWords.find(
      (word) =>
        !foundWords.includes(word) &&
        (word === selectedWord || word === reversed)
    );

    if (matchedWord) {
      markWordFound(matchedWord, indices);
      return;
    }

    const maxLength = Math.max(...currentWords.map((word) => word.length));

    if (indices.length >= maxLength) {
      showMessage("Try again");
      setTimeout(() => setSelectedCells([]), 250);
    }
  };

  const markWordFound = (word, cells) => {
    const wordCells = cells?.length ? cells : puzzle.positions[word] || [];
    const updatedFoundWords = [...foundWords, word];

    setFoundWords(updatedFoundWords);
    setFoundCells((prev) => Array.from(new Set([...prev, ...wordCells])));
    setSelectedCells([]);

    showMessage(`${word} found`);

    if (updatedFoundWords.length === currentWords.length) {
      setTimeout(finishLevel, 450);
    }
  };

  const finishLevel = () => {
    if (finishedRef.current) return;

    finishedRef.current = true;

    const earned =
      50 + level * 5 + currentWords.length * 10 + Math.floor(timeLeft / 2);

    setEarnedCoins(earned);
    setCoins((prev) => prev + earned);

    if (level < MAX_LEVEL) {
      setUnlockedLevels((prev) =>
        prev.includes(level + 1) ? prev : [...prev, level + 1]
      );
    }

    setShowWin(true);
  };

  const spendCoins = (amount) => {
    if (coins < amount) {
      showMessage(`Need ${amount} coins`);
      return false;
    }

    setCoins((prev) => prev - amount);
    return true;
  };

  const useTimePower = () => {
    if (!spendCoins(10)) return;

    setTimeLeft((prev) => prev + 15);
    showMessage("+15 seconds added");
  };

  const useHintPower = () => {
    const remainingWords = currentWords.filter((word) => !foundWords.includes(word));

    if (!remainingWords.length) {
      showMessage("All words found");
      return;
    }

    if (!spendCoins(50)) return;

    const word = remainingWords[0];
    const cells = puzzle.positions[word] || [];

    if (!cells.length) {
      showMessage("Hint not available");
      return;
    }

    clearTimeout(hintTimerRef.current);

    setHintCells(cells.slice(0, 2));
    showMessage(`Hint: ${word[0]} starts here`);

    hintTimerRef.current = setTimeout(() => {
      setHintCells([]);
    }, 2200);
  };

  const useJumpPower = () => {
    const remainingWords = currentWords.filter((word) => !foundWords.includes(word));

    if (!remainingWords.length) {
      showMessage("All words found");
      return;
    }

    if (!spendCoins(30)) return;

    const word = remainingWords[0];
    const cells = puzzle.positions[word] || [];

    if (!cells.length) {
      showMessage("Jump failed");
      return;
    }

    markWordFound(word, cells);
  };

  const useFreezePower = () => {
    if (!spendCoins(25)) return;

    freezeRef.current += 15;
    setFreezeLeft(freezeRef.current);
    showMessage("Timer frozen");
  };

  const nextLevel = () => {
    if (level >= MAX_LEVEL) {
      showMessage("All 100 levels completed");
      startLevel(1);
      return;
    }

    startLevel(level + 1);
  };

  const openLevel = (levelNumber) => {
    if (unlockedLevels.includes(levelNumber)) {
      startLevel(levelNumber);
      return;
    }

    const cost = levelNumber * 10;

    if (!spendCoins(cost)) return;

    setUnlockedLevels((prev) =>
      prev.includes(levelNumber) ? prev : [...prev, levelNumber]
    );

    startLevel(levelNumber);
  };

  const selectedWord = selectedCells
    .map((index) => puzzle.letters[index])
    .join("");

  const gridLayout = useMemo(() => {
    const maxBoardWidth = Math.min(width - screenPadding * 2, 430);
    const gap = puzzle.size >= 11 ? 2 : 3;
    const padding = isTinyScreen ? 7 : 9;

    const cellSize = Math.floor(
      (maxBoardWidth - padding * 2 - gap * (puzzle.size - 1)) / puzzle.size
    );

    const gridWidth =
      cellSize * puzzle.size + gap * (puzzle.size - 1) + padding * 2;

    return {
      gap,
      padding,
      cellSize,
      gridWidth,
    };
  }, [width, puzzle.size, isTinyScreen]);

  return (
    <View style={[styles.root, { width, height }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.dark} />

      <ImageBackground
        source={BG_IMAGE}
        style={[styles.background, { width, height }]}
        imageStyle={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={[
            "rgba(0,0,0,0.08)",
            "rgba(0,0,0,0.45)",
            "rgba(0,0,0,0.86)",
          ]}
          style={[styles.overlay, { width, height }]}
        >
          <View style={styles.safeTop} />

          <View style={styles.headerWrapper}>
            <LinearGradient
              colors={["rgba(0,31,61,0.97)", "rgba(7,24,71,0.97)"]}
              style={styles.header}
            >
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={goBack}
                style={styles.backButton}
              >
                <Ionicons name="arrow-back" size={24} color={COLORS.white} />
              </TouchableOpacity>

              <View style={styles.headerCenter}>
                <Text style={styles.headerTitle}>Word Hunt</Text>
                <Text style={styles.headerSubTitle}>Level {level} / 100</Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setLevelsVisible(true)}
                style={styles.menuButton}
              >
                <Ionicons name="grid" size={22} color={COLORS.white} />
              </TouchableOpacity>
            </LinearGradient>
          </View>

          <View style={styles.statsRow}>
            <InfoBox icon="cash" value={coins} color={COLORS.yellow} />
            <InfoBox
              icon={freezeLeft > 0 ? "snow" : "timer"}
              value={freezeLeft > 0 ? `${freezeLeft}s` : `${timeLeft}s`}
              color={freezeLeft > 0 ? COLORS.cyan : COLORS.red}
            />
            <InfoBox
              icon="checkmark-done"
              value={`${foundWords.length}/${currentWords.length}`}
              color={COLORS.orange}
            />
          </View>

          {!!toast && (
            <View style={styles.toast}>
              <Text style={styles.toastText}>{toast}</Text>
            </View>
          )}

          <View style={styles.mainArea}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              bounces={false}
              contentContainerStyle={styles.scrollContent}
            >
              <View style={styles.boardOuter}>
                <View
                  style={[
                    styles.gridBoard,
                    {
                      width: gridLayout.gridWidth,
                      padding: gridLayout.padding,
                    },
                  ]}
                >
                  {Array.from({ length: puzzle.size }).map((_, row) => (
                    <View
                      key={`row-${row}`}
                      style={[
                        styles.gridRow,
                        {
                          marginBottom:
                            row === puzzle.size - 1 ? 0 : gridLayout.gap,
                        },
                      ]}
                    >
                      {Array.from({ length: puzzle.size }).map((__, col) => {
                        const index = row * puzzle.size + col;
                        const letter = puzzle.letters[index];

                        const selected = selectedCells.includes(index);
                        const found = foundCells.includes(index);
                        const hinted = hintCells.includes(index);

                        return (
                          <TouchableOpacity
                            key={`${level}-${index}`}
                            activeOpacity={0.88}
                            onPress={() => handleCellPress(index)}
                            style={[
                              styles.cell,
                              {
                                width: gridLayout.cellSize,
                                height: gridLayout.cellSize,
                                marginRight:
                                  col === puzzle.size - 1 ? 0 : gridLayout.gap,
                              },
                              selected && styles.cellSelected,
                              found && styles.cellFound,
                              hinted && styles.cellHint,
                            ]}
                          >
                            <Text
                              style={[
                                styles.cellText,
                                (selected || found || hinted) &&
                                  styles.cellTextLight,
                                {
                                  fontSize: isTinyScreen
                                    ? 12
                                    : isSmallScreen
                                    ? 13
                                    : 14,
                                },
                              ]}
                            >
                              {letter}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.selectedCard}>
                <View style={styles.selectedLeft}>
                  <Text style={styles.selectedLabel}>Selected Word</Text>
                  <Text style={styles.selectedText}>
                    {selectedWord || "Tap letters in one straight line"}
                  </Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => setSelectedCells([])}
                  style={styles.clearButton}
                >
                  <Ionicons name="close-circle" size={17} color={COLORS.white} />
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.wordsCard}>
                <Text style={styles.wordsTitle}>Find Words</Text>

                <View style={styles.wordsWrap}>
                  {currentWords.map((word) => {
                    const found = foundWords.includes(word);

                    return (
                      <View
                        key={word}
                        style={[styles.wordChip, found && styles.wordChipDone]}
                      >
                        <Ionicons
                          name={found ? "checkmark-circle" : "ellipse-outline"}
                          size={14}
                          color={found ? COLORS.white : COLORS.yellow}
                        />
                        <Text
                          style={[styles.wordText, found && styles.wordDoneText]}
                        >
                          {word}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </ScrollView>
          </View>

          <View style={styles.powerDockWrapper}>
            <View style={styles.powerDock}>
              <PowerButton
                icon="grid"
                title="Levels"
                price="Free"
                color={COLORS.cyan}
                onPress={() => setLevelsVisible(true)}
              />

              <PowerButton
                icon="timer"
                title="+15s"
                price="10"
                color={COLORS.green}
                onPress={useTimePower}
              />

              <PowerButton
                icon="bulb"
                title="Hint"
                price="50"
                color={COLORS.orange}
                onPress={useHintPower}
              />

              <PowerButton
                icon="rocket"
                title="Jump"
                price="30"
                color={COLORS.purple}
                onPress={useJumpPower}
              />

              <PowerButton
                icon="snow"
                title="Freeze"
                price="25"
                color={COLORS.cyan}
                onPress={useFreezePower}
              />
            </View>
          </View>

          <ResultModal
            visible={showWin}
            emoji="🎉"
            title="Level Complete!"
            subtitle="Coins Earned"
            coins={earnedCoins}
            buttonText={level >= MAX_LEVEL ? "Play Again" : "Next Level"}
            onPress={nextLevel}
          />

          <ResultModal
            visible={showLose}
            emoji="⏰"
            title="Time Up!"
            subtitle="Try this level again"
            buttonText="Retry"
            onPress={() => startLevel(level)}
          />

          <LevelsModal
            visible={levelsVisible}
            level={level}
            unlockedLevels={unlockedLevels}
            onClose={() => setLevelsVisible(false)}
            onOpenLevel={openLevel}
          />
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

function InfoBox({ icon, value, color }) {
  return (
    <View style={styles.infoBox}>
      <Ionicons name={icon} size={16} color={color} />
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function PowerButton({ icon, title, price, color, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={styles.powerButton}
    >
      <View style={[styles.powerIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={18} color={COLORS.white} />
      </View>

      <Text numberOfLines={1} style={styles.powerTitle}>
        {title}
      </Text>

      <View style={styles.powerPriceRow}>
        {price !== "Free" && (
          <Ionicons name="cash" size={10} color={COLORS.yellow} />
        )}
        <Text style={styles.powerPrice}>{price}</Text>
      </View>
    </TouchableOpacity>
  );
}

function ResultModal({
  visible,
  emoji,
  title,
  subtitle,
  coins,
  buttonText,
  onPress,
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.resultCard}>
          <Text style={styles.resultEmoji}>{emoji}</Text>
          <Text style={styles.resultTitle}>{title}</Text>
          <Text style={styles.resultSubtitle}>{subtitle}</Text>

          {typeof coins === "number" && (
            <Text style={styles.earnedCoins}>+{coins}</Text>
          )}

          <TouchableOpacity
            activeOpacity={0.88}
            onPress={onPress}
            style={styles.resultButton}
          >
            <Text style={styles.resultButtonText}>{buttonText}</Text>
            <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function LevelsModal({
  visible,
  level,
  unlockedLevels,
  onClose,
  onOpenLevel,
}) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.levelsCard}>
          <View style={styles.levelsHeader}>
            <View>
              <Text style={styles.levelsTitle}>100 Levels</Text>
              <Text style={styles.levelsSubtitle}>
                Locked levels open with coins
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onClose}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={22} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.levelGrid}>
              {Array.from({ length: MAX_LEVEL }).map((_, index) => {
                const levelNumber = index + 1;
                const unlocked = unlockedLevels.includes(levelNumber);
                const current = levelNumber === level;

                return (
                  <TouchableOpacity
                    key={levelNumber}
                    activeOpacity={0.85}
                    onPress={() => onOpenLevel(levelNumber)}
                    style={[
                      styles.levelItem,
                      unlocked && styles.levelUnlocked,
                      current && styles.levelCurrent,
                    ]}
                  >
                    <Text
                      style={[
                        styles.levelItemText,
                        current && styles.levelCurrentText,
                      ]}
                    >
                      {unlocked ? levelNumber : "🔒"}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.dark,
    overflow: "hidden",
  },

  background: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },

  backgroundImage: {
    width: "100%",
    height: "100%",
  },

  overlay: {
    flex: 1,
  },

  safeTop: {
    height: Platform.OS === "ios" ? 46 : 28,
  },

  headerWrapper: {
    width: "100%",
    paddingHorizontal: 14,
  },

  header: {
    width: "100%",
    minHeight: 64,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: COLORS.cyan,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    elevation: 8,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: COLORS.orange,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.white,
  },

  headerCenter: {
    flex: 1,
    alignItems: "center",
  },

  headerTitle: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: "900",
  },

  headerSubTitle: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "900",
    marginTop: 2,
  },

  menuButton: {
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: COLORS.green,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.white,
  },

  statsRow: {
    width: "100%",
    marginTop: 8,
    paddingHorizontal: 14,
    flexDirection: "row",
    gap: 6,
  },

  infoBox: {
    flex: 1,
    height: 30,
    borderRadius: 14,
    backgroundColor: "rgba(0,17,38,0.90)",
    borderWidth: 1.5,
    borderColor: COLORS.yellow,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },

  infoValue: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "900",
  },

  toast: {
    alignSelf: "center",
    marginTop: 7,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.62)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },

  toastText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "900",
  },

  mainArea: {
    flex: 1,
    width: "100%",
  },

  scrollContent: {
    width: "100%",
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 18,
    alignItems: "center",
  },

  boardOuter: {
    padding: 6,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: COLORS.green,
    backgroundColor: "rgba(0,68,52,0.62)",
    elevation: 10,
  },

  gridBoard: {
    borderRadius: 18,
    backgroundColor: COLORS.board,
    borderWidth: 2,
    borderColor: COLORS.white,
  },

  gridRow: {
    flexDirection: "row",
  },

  cell: {
    borderRadius: 7,
    backgroundColor: COLORS.cell,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(48,66,84,0.35)",
  },

  cellSelected: {
    backgroundColor: COLORS.yellow,
  },

  cellFound: {
    backgroundColor: COLORS.green,
  },

  cellHint: {
    backgroundColor: COLORS.orange,
  },

  cellText: {
    color: COLORS.text,
    fontWeight: "900",
  },

  cellTextLight: {
    color: COLORS.white,
  },

  selectedCard: {
    width: "100%",
    marginTop: 10,
    borderRadius: 18,
    backgroundColor: "rgba(3,16,35,0.88)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.24)",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  selectedLeft: {
    flex: 1,
  },

  selectedLabel: {
    color: COLORS.cyan,
    fontSize: 10,
    fontWeight: "900",
    marginBottom: 3,
  },

  selectedText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "900",
  },

  clearButton: {
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: COLORS.orange,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },

  clearText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "900",
  },

  wordsCard: {
    width: "100%",
    marginTop: 10,
    borderRadius: 18,
    backgroundColor: "rgba(3,16,35,0.88)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.24)",
    padding: 12,
  },

  wordsTitle: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 8,
  },

  wordsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
  },

  wordChip: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.20)",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  wordChipDone: {
    backgroundColor: COLORS.green,
  },

  wordText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "900",
  },

  wordDoneText: {
    textDecorationLine: "line-through",
  },

  powerDockWrapper: {
    width: "100%",
    paddingHorizontal: 14,
    paddingBottom: Platform.OS === "ios" ? 22 : 12,
  },

  powerDock: {
    width: "100%",
    minHeight: 74,
    borderRadius: 22,
    backgroundColor: "rgba(0,17,38,0.94)",
    borderWidth: 2,
    borderColor: COLORS.cyan,
    paddingHorizontal: 6,
    paddingVertical: 7,
    flexDirection: "row",
    gap: 5,
    elevation: 10,
  },

  powerButton: {
    flex: 1,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.10)",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },

  powerIcon: {
    width: 32,
    height: 32,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },

  powerTitle: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: "900",
  },

  powerPriceRow: {
    marginTop: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },

  powerPrice: {
    color: COLORS.white,
    fontSize: 8,
    fontWeight: "900",
  },

  modalOverlay: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.72)",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },

  resultCard: {
    width: "92%",
    maxWidth: 390,
    borderRadius: 26,
    backgroundColor: "rgba(3,16,35,0.98)",
    borderWidth: 2,
    borderColor: COLORS.cyan,
    padding: 24,
    alignItems: "center",
  },

  resultEmoji: {
    fontSize: 52,
  },

  resultTitle: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: "900",
    marginTop: 8,
  },

  resultSubtitle: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 14,
    fontWeight: "800",
    marginTop: 8,
    textAlign: "center",
  },

  earnedCoins: {
    color: COLORS.yellow,
    fontSize: 36,
    fontWeight: "900",
    marginTop: 6,
  },

  resultButton: {
    marginTop: 20,
    minHeight: 50,
    paddingHorizontal: 24,
    borderRadius: 18,
    backgroundColor: COLORS.green,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  resultButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "900",
  },

  levelsCard: {
    width: "96%",
    maxWidth: 460,
    maxHeight: "86%",
    borderRadius: 24,
    backgroundColor: "rgba(3,16,35,0.98)",
    borderWidth: 2,
    borderColor: COLORS.cyan,
    padding: 16,
  },

  levelsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  levelsTitle: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: "900",
  },

  levelsSubtitle: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 3,
  },

  closeButton: {
    marginLeft: "auto",
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: COLORS.orange,
    alignItems: "center",
    justifyContent: "center",
  },

  levelGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingBottom: 10,
  },

  levelItem: {
    width: "17.9%",
    aspectRatio: 1,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },

  levelUnlocked: {
    backgroundColor: COLORS.green,
  },

  levelCurrent: {
    backgroundColor: COLORS.yellow,
    borderWidth: 2,
    borderColor: COLORS.white,
  },

  levelItemText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "900",
  },

  levelCurrentText: {
    color: COLORS.dark,
  },
});