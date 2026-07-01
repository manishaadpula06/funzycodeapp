


import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Modal,
  ImageBackground,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const MAZE_BG = require("../assets/images/mazebackground.png");

const MAX_LEVEL = 100;
const START_LEVEL = 1;
const START_COINS = 80;

const POWER_COSTS = {
  TIME: 10,
  HINT: 15,
  JUMP: 30,
  FREEZE: 25,
};

const getMazeSize = () => {
  if (height < 700) return Math.min(width * 0.82, 330);
  if (width < 360) return width * 0.88;
  if (width < 430) return width * 0.9;
  return Math.min(width * 0.86, 410);
};

const MAZE_SIZE = getMazeSize();

const clampNumber = (value, min, max) => {
  return Math.max(min, Math.min(max, value));
};

const createEmptyMaze = (size) => {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ({
      walls: {
        top: true,
        right: true,
        bottom: true,
        left: true,
      },
      visited: false,
    }))
  );
};

const getLevelSettings = (level) => {
  const progress = level / MAX_LEVEL;

  const size = clampNumber(7 + Math.floor(progress * 23), 7, 30);
  const time = clampNumber(80 - Math.floor(progress * 52), 24, 80);
  const reward = 15 + level * 4;
  const unlockCost = level * 10;

  return {
    size,
    time,
    reward,
    unlockCost,
  };
};

const generateMaze = (size) => {
  const maze = createEmptyMaze(size);

  const stack = [];
  let current = { x: 0, y: 0 };

  maze[0][0].visited = true;

  while (true) {
    const neighbors = [];

    if (current.x > 0 && !maze[current.y][current.x - 1].visited) {
      neighbors.push("left");
    }

    if (current.x < size - 1 && !maze[current.y][current.x + 1].visited) {
      neighbors.push("right");
    }

    if (current.y > 0 && !maze[current.y - 1][current.x].visited) {
      neighbors.push("top");
    }

    if (current.y < size - 1 && !maze[current.y + 1][current.x].visited) {
      neighbors.push("bottom");
    }

    if (neighbors.length > 0) {
      const direction =
        neighbors[Math.floor(Math.random() * neighbors.length)];

      const next = { ...current };

      if (direction === "left") {
        maze[current.y][current.x].walls.left = false;
        maze[current.y][current.x - 1].walls.right = false;
        next.x -= 1;
      }

      if (direction === "right") {
        maze[current.y][current.x].walls.right = false;
        maze[current.y][current.x + 1].walls.left = false;
        next.x += 1;
      }

      if (direction === "top") {
        maze[current.y][current.x].walls.top = false;
        maze[current.y - 1][current.x].walls.bottom = false;
        next.y -= 1;
      }

      if (direction === "bottom") {
        maze[current.y][current.x].walls.bottom = false;
        maze[current.y + 1][current.x].walls.top = false;
        next.y += 1;
      }

      maze[next.y][next.x].visited = true;
      stack.push(current);
      current = next;
    } else if (stack.length > 0) {
      current = stack.pop();
    } else {
      break;
    }
  }

  return maze;
};

const cellKey = (x, y) => `${x}-${y}`;

const getMazeNeighbors = (maze, node, size) => {
  const cell = maze?.[node.y]?.[node.x];

  if (!cell) return [];

  const result = [];

  if (!cell.walls.top && node.y > 0) {
    result.push({ x: node.x, y: node.y - 1 });
  }

  if (!cell.walls.bottom && node.y < size - 1) {
    result.push({ x: node.x, y: node.y + 1 });
  }

  if (!cell.walls.left && node.x > 0) {
    result.push({ x: node.x - 1, y: node.y });
  }

  if (!cell.walls.right && node.x < size - 1) {
    result.push({ x: node.x + 1, y: node.y });
  }

  return result;
};

const findPathToExit = (maze, start, exit, size) => {
  if (!maze?.length) return [];

  const startKey = cellKey(start.x, start.y);
  const exitKey = cellKey(exit.x, exit.y);

  const queue = [start];
  const visited = new Set([startKey]);
  const parent = {};

  while (queue.length > 0) {
    const current = queue.shift();
    const currentKey = cellKey(current.x, current.y);

    if (currentKey === exitKey) break;

    const neighbors = getMazeNeighbors(maze, current, size);

    neighbors.forEach((next) => {
      const nextKey = cellKey(next.x, next.y);

      if (!visited.has(nextKey)) {
        visited.add(nextKey);
        parent[nextKey] = currentKey;
        queue.push(next);
      }
    });
  }

  if (!visited.has(exitKey)) return [];

  const path = [];
  let activeKey = exitKey;

  while (activeKey) {
    const [x, y] = activeKey.split("-").map(Number);

    path.unshift({ x, y });

    if (activeKey === startKey) break;

    activeKey = parent[activeKey];
  }

  return path;
};

const getDirectionText = (from, to) => {
  if (!from || !to) return "";

  if (to.x > from.x) return "Go Right ➡️";
  if (to.x < from.x) return "Go Left ⬅️";
  if (to.y > from.y) return "Go Down ⬇️";
  if (to.y < from.y) return "Go Up ⬆️";

  return "";
};

export default function MazeEscapeScreen({ navigation }) {
  const timerRef = useRef(null);
  const hintTimeoutRef = useRef(null);
  const freezeTimeoutRef = useRef(null);

  const [startVisible, setStartVisible] = useState(true);
  const [winVisible, setWinVisible] = useState(false);
  const [levelsVisible, setLevelsVisible] = useState(false);

  const [level, setLevel] = useState(START_LEVEL);
  const [coins, setCoins] = useState(START_COINS);
  const [unlockedLevels, setUnlockedLevels] = useState([1]);

  const [maze, setMaze] = useState([]);
  const [player, setPlayer] = useState({ x: 0, y: 0 });
  const [exitPos, setExitPos] = useState({ x: 0, y: 0 });
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(false);
  const [lastReward, setLastReward] = useState(0);
  const [message, setMessage] = useState("");

  const [hintCell, setHintCell] = useState(null);
  const [hintDirection, setHintDirection] = useState("");
  const [isFrozen, setIsFrozen] = useState(false);

  const levelSettings = useMemo(() => {
    return getLevelSettings(level);
  }, [level]);

  const cellSize = useMemo(() => {
    return MAZE_SIZE / levelSettings.size;
  }, [levelSettings.size]);

  const playerSize = cellSize * 0.58;

  const timerText = useMemo(() => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;

    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }, [timeLeft]);

  const highestUnlocked = useMemo(() => {
    return Math.max(...unlockedLevels);
  }, [unlockedLevels]);

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const clearPowerEffects = () => {
    if (hintTimeoutRef.current) {
      clearTimeout(hintTimeoutRef.current);
      hintTimeoutRef.current = null;
    }

    if (freezeTimeoutRef.current) {
      clearTimeout(freezeTimeoutRef.current);
      freezeTimeoutRef.current = null;
    }

    setHintCell(null);
    setHintDirection("");
    setIsFrozen(false);
  };

  const initGame = (targetLevel = level) => {
    stopTimer();
    clearPowerEffects();

    const settings = getLevelSettings(targetLevel);
    const newMaze = generateMaze(settings.size);

    setMaze(newMaze);
    setPlayer({ x: 0, y: 0 });
    setExitPos({ x: settings.size - 1, y: settings.size - 1 });
    setTimeLeft(settings.time);
    setGameActive(true);
    setWinVisible(false);
    setMessage("");
  };

  const startGame = () => {
    setStartVisible(false);
    initGame(level);
  };

  useEffect(() => {
    if (!gameActive) return;

    stopTimer();

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (isFrozen) return prev;

        if (prev <= 1) {
          stopTimer();
          setGameActive(false);
          setMessage("Time up! Try the level again.");

          setTimeout(() => {
            initGame(level);
          }, 800);

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => stopTimer();
  }, [gameActive, level, isFrozen]);

  useEffect(() => {
    return () => {
      stopTimer();

      if (hintTimeoutRef.current) {
        clearTimeout(hintTimeoutRef.current);
      }

      if (freezeTimeoutRef.current) {
        clearTimeout(freezeTimeoutRef.current);
      }
    };
  }, []);

  const handleWin = useCallback(() => {
    if (!gameActive) return;

    stopTimer();
    clearPowerEffects();
    setGameActive(false);

    const reward = getLevelSettings(level).reward;
    const nextLevel = level + 1;

    setLastReward(reward);
    setCoins((prev) => prev + reward);

    if (nextLevel <= MAX_LEVEL) {
      setUnlockedLevels((prev) => {
        if (prev.includes(nextLevel)) return prev;
        return [...prev, nextLevel].sort((a, b) => a - b);
      });
    }

    setWinVisible(true);
  }, [gameActive, level]);

  const movePlayer = useCallback(
    (direction) => {
      if (!gameActive || !maze.length) return;

      setPlayer((prev) => {
        const currentCell = maze[prev.y]?.[prev.x];

        if (!currentCell) return prev;

        const walls = currentCell.walls;

        let next = { ...prev };

        if (direction === "up" && !walls.top) {
          next.y -= 1;
        }

        if (direction === "down" && !walls.bottom) {
          next.y += 1;
        }

        if (direction === "left" && !walls.left) {
          next.x -= 1;
        }

        if (direction === "right" && !walls.right) {
          next.x += 1;
        }

        next.x = clampNumber(next.x, 0, levelSettings.size - 1);
        next.y = clampNumber(next.y, 0, levelSettings.size - 1);

        if (next.x === exitPos.x && next.y === exitPos.y) {
          setTimeout(handleWin, 120);
        }

        return next;
      });
    },
    [gameActive, maze, levelSettings.size, exitPos, handleWin]
  );

  useEffect(() => {
    if (Platform.OS !== "web") return;
    if (typeof document === "undefined") return;

    const handleKeyPress = (event) => {
      const map = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
      };

      if (map[event.key]) {
        movePlayer(map[event.key]);
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [movePlayer]);

  const spendCoins = (cost, powerName) => {
    if (coins < cost) {
      setMessage(`Need ${cost} coins for ${powerName}.`);
      return false;
    }

    setCoins((prev) => Math.max(0, prev - cost));
    return true;
  };

  const handleNextLevel = () => {
    setWinVisible(false);

    if (level >= MAX_LEVEL) {
      setMessage("All 100 levels completed!");
      setStartVisible(true);
      setLevel(1);
      setCoins(START_COINS);
      setUnlockedLevels([1]);
      setGameActive(false);
      clearPowerEffects();
      return;
    }

    const nextLevel = level + 1;

    setLevel(nextLevel);

    setTimeout(() => {
      initGame(nextLevel);
    }, 100);
  };

  const handleReplay = () => {
    setWinVisible(false);
    initGame(level);
  };

  const handleAddTimePower = () => {
    if (!gameActive) {
      setMessage("Start the game first.");
      return;
    }

    if (!spendCoins(POWER_COSTS.TIME, "+15 seconds")) return;

    setTimeLeft((prev) => prev + 15);
    setMessage("+15 seconds added.");
  };

  const handleHintPower = () => {
    if (!gameActive || !maze.length) {
      setMessage("Start the game first.");
      return;
    }

    if (!spendCoins(POWER_COSTS.HINT, "Hint Path")) return;

    const path = findPathToExit(maze, player, exitPos, levelSettings.size);
    const nextCell = path[1];

    if (!nextCell) {
      setMessage("You are already near the exit.");
      return;
    }

    setHintCell(nextCell);
    setHintDirection(getDirectionText(player, nextCell));
    setMessage(`Hint: ${getDirectionText(player, nextCell)}`);

    if (hintTimeoutRef.current) {
      clearTimeout(hintTimeoutRef.current);
    }

    hintTimeoutRef.current = setTimeout(() => {
      setHintCell(null);
      setHintDirection("");
    }, 3500);
  };

  const handleJumpPower = () => {
    if (!gameActive || !maze.length) {
      setMessage("Start the game first.");
      return;
    }

    if (!spendCoins(POWER_COSTS.JUMP, "Jump Boost")) return;

    const path = findPathToExit(maze, player, exitPos, levelSettings.size);

    if (path.length <= 1) {
      setMessage("You are already at the finish.");
      return;
    }

    const jumpIndex = Math.min(path.length - 1, 4);
    const target = path[jumpIndex];

    setPlayer(target);
    setMessage("Jump Boost used!");

    if (target.x === exitPos.x && target.y === exitPos.y) {
      setTimeout(handleWin, 120);
    }
  };

  const handleFreezePower = () => {
    if (!gameActive) {
      setMessage("Start the game first.");
      return;
    }

    if (!spendCoins(POWER_COSTS.FREEZE, "Freeze Timer")) return;

    setIsFrozen(true);
    setMessage("Timer frozen for 8 seconds!");

    if (freezeTimeoutRef.current) {
      clearTimeout(freezeTimeoutRef.current);
    }

    freezeTimeoutRef.current = setTimeout(() => {
      setIsFrozen(false);
      setMessage("Timer started again.");
    }, 8000);
  };

  const handleOpenLevels = () => {
    setLevelsVisible(true);
  };

  const handleCloseLevels = () => {
    setLevelsVisible(false);
  };

  const handleSelectLevel = (selectedLevel) => {
    const unlocked = unlockedLevels.includes(selectedLevel);

    if (unlocked) {
      setLevel(selectedLevel);
      setLevelsVisible(false);
      setStartVisible(false);

      setTimeout(() => {
        initGame(selectedLevel);
      }, 100);

      return;
    }

    const cost = getLevelSettings(selectedLevel).unlockCost;

    if (coins < cost) {
      setMessage(`Need ${cost} coins to unlock Level ${selectedLevel}.`);
      return;
    }

    setCoins((prev) => prev - cost);

    setUnlockedLevels((prev) => {
      if (prev.includes(selectedLevel)) return prev;
      return [...prev, selectedLevel].sort((a, b) => a - b);
    });

    setLevel(selectedLevel);
    setLevelsVisible(false);
    setStartVisible(false);

    setTimeout(() => {
      initGame(selectedLevel);
    }, 100);
  };

  const handleBack = () => {
    stopTimer();
    clearPowerEffects();

    if (navigation?.canGoBack?.()) {
      navigation.goBack();
      return;
    }

    navigation?.navigate?.("FunGames");
  };

  const renderPowerButton = ({
    icon,
    label,
    cost,
    color,
    onPress,
    free,
    disabled,
  }) => {
    return (
      <TouchableOpacity
        style={[
          styles.powerItem,
          { backgroundColor: color },
          disabled && styles.powerDisabled,
        ]}
        activeOpacity={0.85}
        onPress={onPress}
      >
        <View style={styles.powerIconCircle}>
          <Text style={styles.powerEmoji}>{icon}</Text>
        </View>

        <Text style={styles.powerLabel} numberOfLines={1}>
          {label}
        </Text>

        <Text style={styles.powerCost}>
          {free ? "Free" : `${cost}🪙`}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderMaze = () => {
    if (!maze.length) {
      return (
        <View style={styles.emptyMaze}>
          <Text style={styles.emptyMazeText}>Press Start Game</Text>
        </View>
      );
    }

    return (
      <View
        style={[
          styles.maze,
          {
            width: MAZE_SIZE,
            height: MAZE_SIZE,
          },
        ]}
      >
        {maze.map((row, y) => (
          <View key={`row-${y}`} style={styles.mazeRow}>
            {row.map((cell, x) => {
              const isExit = x === exitPos.x && y === exitPos.y;
              const isStart = x === 0 && y === 0;
              const isHintCell = hintCell?.x === x && hintCell?.y === y;

              return (
                <View
                  key={`cell-${x}-${y}`}
                  style={[
                    styles.cell,
                    {
                      width: cellSize,
                      height: cellSize,
                      borderTopWidth: cell.walls.top ? 2 : 0,
                      borderRightWidth: cell.walls.right ? 2 : 0,
                      borderBottomWidth: cell.walls.bottom ? 2 : 0,
                      borderLeftWidth: cell.walls.left ? 2 : 0,
                    },
                    isExit && styles.exitCell,
                    isStart && styles.startCell,
                    isHintCell && styles.hintCell,
                  ]}
                >
                  {isExit && (
                    <Text
                      style={[
                        styles.cellEmoji,
                        {
                          fontSize: Math.max(8, cellSize * 0.45),
                        },
                      ]}
                    >
                      🏁
                    </Text>
                  )}

                  {isStart && (
                    <Text
                      style={[
                        styles.cellEmoji,
                        {
                          fontSize: Math.max(8, cellSize * 0.38),
                        },
                      ]}
                    >
                      🚩
                    </Text>
                  )}

                  {isHintCell && (
                    <Text
                      style={[
                        styles.cellEmoji,
                        {
                          fontSize: Math.max(8, cellSize * 0.4),
                        },
                      ]}
                    >
                      ✨
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        ))}

        <View
          pointerEvents="none"
          style={[
            styles.player,
            {
              width: playerSize,
              height: playerSize,
              borderRadius: playerSize / 2,
              left: player.x * cellSize + (cellSize - playerSize) / 2,
              top: player.y * cellSize + (cellSize - playerSize) / 2,
            },
          ]}
        >
          <Text
            style={[
              styles.playerFace,
              {
                fontSize: Math.max(8, playerSize * 0.55),
              },
            ]}
          >
            🐸
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#07172B" />

      <ImageBackground source={MAZE_BG} style={styles.bg} resizeMode="cover">
        <View style={styles.overlay} />

        <View style={styles.screen}>
          <View style={styles.gameHeader}>
            <TouchableOpacity
              style={styles.backBtn}
              activeOpacity={0.85}
              onPress={handleBack}
            >
              <Ionicons name="arrow-back" size={19} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.headerTitleBox}>
              <Text style={styles.headerTitle}>Maze Escape</Text>
              <Text style={styles.headerSub}>Level {level} / {MAX_LEVEL}</Text>
            </View>

            <TouchableOpacity
              style={styles.levelsSmallBtn}
              activeOpacity={0.85}
              onPress={handleOpenLevels}
            >
              <Ionicons name="grid" size={17} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.hudRow}>
            <View style={styles.hudPill}>
              <Text style={styles.hudIcon}>🪙</Text>
              <Text style={styles.hudText}>{coins}</Text>
            </View>

            <View style={[styles.hudPill, isFrozen && styles.frozenPill]}>
              <Text style={styles.hudIcon}>{isFrozen ? "❄️" : "⏱️"}</Text>
              <Text style={styles.hudText}>{timerText}</Text>
            </View>

            <View style={styles.hudPill}>
              <Text style={styles.hudIcon}>🔓</Text>
              <Text style={styles.hudText}>{highestUnlocked}</Text>
            </View>
          </View>

          {!!message && (
            <TouchableOpacity
              style={styles.messageBox}
              activeOpacity={0.85}
              onPress={() => setMessage("")}
            >
              <Text style={styles.messageText}>{message}</Text>
            </TouchableOpacity>
          )}

          <View style={styles.mazeOuter}>
            <View style={styles.mazeContainer}>{renderMaze()}</View>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.controlBtn}
              activeOpacity={0.75}
              onPress={() => movePlayer("up")}
            >
              <Text style={styles.controlText}>⬆️</Text>
            </TouchableOpacity>

            <View style={styles.controlMiddleRow}>
              <TouchableOpacity
                style={styles.controlBtn}
                activeOpacity={0.75}
                onPress={() => movePlayer("left")}
              >
                <Text style={styles.controlText}>⬅️</Text>
              </TouchableOpacity>

              <View style={styles.controlCenter}>
                <Text style={styles.controlCenterText}>MOVE</Text>
              </View>

              <TouchableOpacity
                style={styles.controlBtn}
                activeOpacity={0.75}
                onPress={() => movePlayer("right")}
              >
                <Text style={styles.controlText}>➡️</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.controlBtn}
              activeOpacity={0.75}
              onPress={() => movePlayer("down")}
            >
              <Text style={styles.controlText}>⬇️</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.powerDock}>
            {renderPowerButton({
              icon: "🗺️",
              label: "Levels",
              free: true,
              color: "#0EA5E9",
              onPress: handleOpenLevels,
            })}

            {renderPowerButton({
              icon: "⏱️",
              label: "+15s",
              cost: POWER_COSTS.TIME,
              color: "#22C55E",
              onPress: handleAddTimePower,
              disabled: coins < POWER_COSTS.TIME,
            })}

            {renderPowerButton({
              icon: "💡",
              label: "Hint",
              cost: POWER_COSTS.HINT,
              color: "#F59E0B",
              onPress: handleHintPower,
              disabled: coins < POWER_COSTS.HINT,
            })}

            {renderPowerButton({
              icon: "🚀",
              label: "Jump",
              cost: POWER_COSTS.JUMP,
              color: "#8B5CF6",
              onPress: handleJumpPower,
              disabled: coins < POWER_COSTS.JUMP,
            })}

            {renderPowerButton({
              icon: "❄️",
              label: "Freeze",
              cost: POWER_COSTS.FREEZE,
              color: "#06B6D4",
              onPress: handleFreezePower,
              disabled: coins < POWER_COSTS.FREEZE,
            })}
          </View>
        </View>

        <Modal visible={startVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.startBox}>
              <Text style={styles.startTitle}>🧩 Maze Escape</Text>
              <Text style={styles.startSub}>
                100 Levels • Superpowers • Coins
              </Text>

              <View style={styles.startRewardBox}>
                <Text style={styles.startRewardText}>
                  Start Bonus: {START_COINS} 🪙
                </Text>
              </View>

              <TouchableOpacity
                style={styles.startBtn}
                activeOpacity={0.88}
                onPress={startGame}
              >
                <Text style={styles.startBtnText}>▶ Start Game</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={winVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.winBox}>
              <Text style={styles.winTitle}>🎉 Level Complete!</Text>
              <Text style={styles.winText}>Level {level} cleared</Text>
              <Text style={styles.winCoins}>+{lastReward} Coins</Text>

              <TouchableOpacity
                style={styles.nextBtn}
                activeOpacity={0.88}
                onPress={handleNextLevel}
              >
                <Text style={styles.nextBtnText}>
                  {level >= MAX_LEVEL ? "Finish Game 🏆" : "Next Level ➡️"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.replayBtn}
                activeOpacity={0.88}
                onPress={handleReplay}
              >
                <Text style={styles.replayBtnText}>Replay Level</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={levelsVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.levelsCard}>
              <View style={styles.levelsHead}>
                <Text style={styles.levelsTitle}>Choose Level</Text>

                <TouchableOpacity
                  style={styles.closeBtn}
                  activeOpacity={0.85}
                  onPress={handleCloseLevels}
                >
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.levelGrid}
              >
                {Array.from({ length: MAX_LEVEL }, (_, index) => {
                  const levelItem = index + 1;
                  const unlocked = unlockedLevels.includes(levelItem);
                  const isCurrent = levelItem === level;

                  return (
                    <TouchableOpacity
                      key={levelItem}
                      style={[
                        styles.levelBtn,
                        !unlocked && styles.lockedLevelBtn,
                        isCurrent && styles.currentLevelBtn,
                      ]}
                      activeOpacity={0.85}
                      onPress={() => handleSelectLevel(levelItem)}
                    >
                      <Text style={styles.levelBtnText}>
                        {unlocked ? levelItem : `${levelItem} 🔒`}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <Text style={styles.levelsHint}>
                🔓 Unlocked levels can be played anytime.{"\n"}
                🔒 Locked level cost = level × 10 coins.
              </Text>

              <TouchableOpacity
                style={styles.levelsCloseBottom}
                activeOpacity={0.85}
                onPress={handleCloseLevels}
              >
                <Text style={styles.levelsCloseBottomText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#07172B",
  },

  bg: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(7, 23, 43, 0.35)",
  },

  screen: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: Platform.OS === "android" ? 8 : 4,
    paddingBottom: 8,
    alignItems: "center",
  },

  gameHeader: {
    marginTop:40,
    width: "100%",
    height: 54,
    borderRadius: 20,
    backgroundColor: "rgba(3, 24, 42, 0.92)",
    borderWidth: 2,
    borderColor: "#7DD3FC",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    marginBottom: 7,
  },

  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: "#F97316",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitleBox: {
    flex: 1,
    alignItems: "center",
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: width < 360 ? 18 : 21,
    fontWeight: "900",
  },

  headerSub: {
    color: "#BAE6FD",
    fontSize: 10,
    fontWeight: "900",
    marginTop: 1,
  },

  levelsSmallBtn: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: "#22C55E",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  hudRow: {
    width: "100%",
    flexDirection: "row",
    gap: 7,
    marginBottom: 6,
  },

  hudPill: {
    flex: 1,
    minHeight: 34,
    borderRadius: 15,
    backgroundColor: "rgba(15, 23, 42, 0.88)",
    borderWidth: 2,
    borderColor: "#FACC15",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  frozenPill: {
    borderColor: "#67E8F9",
    backgroundColor: "rgba(8, 145, 178, 0.92)",
  },

  hudIcon: {
    fontSize: 14,
    marginRight: 4,
  },

  hudText: {
    color: "#FFFFFF",
    fontSize: width < 360 ? 11 : 13,
    fontWeight: "900",
  },

  messageBox: {
    width: "100%",
    minHeight: 32,
    borderRadius: 12,
    backgroundColor: "#FFF7D6",
    borderWidth: 2,
    borderColor: "#FACC15",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    marginBottom: 6,
  },

  messageText: {
    color: "#5A3B00",
    fontSize: 11,
    fontWeight: "900",
    textAlign: "center",
  },

  mazeOuter: {
    padding: 5,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.28)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.55)",
  },

  mazeContainer: {
    width: MAZE_SIZE,
    height: MAZE_SIZE,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    borderWidth: 4,
    borderColor: "#22C55E",
    shadowColor: "#22C55E",
    shadowOpacity: 0.5,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },

  emptyMaze: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  emptyMazeText: {
    color: "#064E3B",
    fontSize: 16,
    fontWeight: "900",
  },

  maze: {
    position: "relative",
    backgroundColor: "#FFFFFF",
  },

  mazeRow: {
    flexDirection: "row",
  },

  cell: {
    backgroundColor: "#E5F8FF",
    borderColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
  },

  exitCell: {
    backgroundColor: "#FECACA",
  },

  startCell: {
    backgroundColor: "#BBF7D0",
  },

  hintCell: {
    backgroundColor: "#FEF08A",
  },

  cellEmoji: {
    textAlign: "center",
  },

  player: {
    position: "absolute",
    backgroundColor: "#22C55E",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#22C55E",
    shadowOpacity: 0.75,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },

  playerFace: {
    textAlign: "center",
  },

  controls: {
    marginTop: 8,
    alignItems: "center",
  },

  controlMiddleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  controlBtn: {
    width: width < 360 ? 42 : 48,
    height: width < 360 ? 42 : 48,
    borderRadius: width < 360 ? 21 : 24,
    backgroundColor: "#1E293B",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 9,
    marginVertical: 2,
    shadowColor: "#000000",
    shadowOpacity: 0.35,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },

  controlText: {
    fontSize: width < 360 ? 17 : 20,
  },

  controlCenter: {
    width: width < 360 ? 42 : 48,
    height: width < 360 ? 42 : 48,
    borderRadius: width < 360 ? 21 : 24,
    backgroundColor: "#0EA5E9",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 9,
  },

  controlCenterText: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "900",
  },

  powerDock: {
    width: "100%",
    minHeight: 78,
    borderRadius: 22,
    backgroundColor: "rgba(15, 23, 42, 0.94)",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 6,
    paddingVertical: 7,
    marginTop: 8,
  },

  powerItem: {
    width: "19%",
    minHeight: 64,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },

  powerDisabled: {
    opacity: 0.48,
  },

  powerIconCircle: {
    width: 31,
    height: 31,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.28)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },

  powerEmoji: {
    fontSize: 17,
  },

  powerLabel: {
    color: "#FFFFFF",
    fontSize: width < 360 ? 8 : 9,
    fontWeight: "900",
  },

  powerCost: {
    color: "#FEF3C7",
    fontSize: width < 360 ? 7 : 8,
    fontWeight: "900",
    marginTop: 1,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.78)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },

  startBox: {
    width: "100%",
    maxWidth: 350,
    borderRadius: 24,
    backgroundColor: "#07172B",
    paddingHorizontal: 22,
    paddingVertical: 28,
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#7DD3FC",
  },

  startTitle: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
  },

  startSub: {
    color: "#BAE6FD",
    fontSize: 14,
    fontWeight: "900",
    marginTop: 6,
    marginBottom: 12,
  },

  startRewardBox: {
    backgroundColor: "#FACC15",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 18,
  },

  startRewardText: {
    color: "#422006",
    fontSize: 13,
    fontWeight: "900",
  },

  startBtn: {
    borderRadius: 30,
    backgroundColor: "#22C55E",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    paddingHorizontal: 32,
    paddingVertical: 14,
  },

  startBtnText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },

  winBox: {
    width: "100%",
    maxWidth: 335,
    borderRadius: 22,
    backgroundColor: "#064E3B",
    borderWidth: 3,
    borderColor: "#FACC15",
    paddingHorizontal: 22,
    paddingVertical: 26,
    alignItems: "center",
  },

  winTitle: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "900",
    textAlign: "center",
  },

  winText: {
    color: "#D1FAE5",
    fontSize: 14,
    fontWeight: "900",
    marginTop: 8,
  },

  winCoins: {
    color: "#FACC15",
    fontSize: 22,
    fontWeight: "900",
    marginTop: 8,
    marginBottom: 14,
  },

  nextBtn: {
    width: "100%",
    minHeight: 44,
    borderRadius: 24,
    backgroundColor: "#22C55E",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  nextBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },

  replayBtn: {
    width: "100%",
    minHeight: 40,
    borderRadius: 22,
    backgroundColor: "#FACC15",
    alignItems: "center",
    justifyContent: "center",
  },

  replayBtnText: {
    color: "#422006",
    fontSize: 14,
    fontWeight: "900",
  },

  levelsCard: {
    width: "100%",
    maxWidth: 560,
    maxHeight: height * 0.9,
    borderRadius: 20,
    backgroundColor: "#064E3B",
    borderWidth: 3,
    borderColor: "#7DD3FC",
    paddingHorizontal: 14,
    paddingVertical: 14,
  },

  levelsHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  levelsTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "900",
  },

  closeBtn: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#FACC15",
    alignItems: "center",
    justifyContent: "center",
  },

  closeText: {
    color: "#000000",
    fontSize: 20,
    fontWeight: "900",
  },

  levelGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingBottom: 10,
  },

  levelBtn: {
    width: width < 370 ? "22.5%" : "18.5%",
    height: 42,
    borderRadius: 12,
    backgroundColor: "#22C55E",
    alignItems: "center",
    justifyContent: "center",
  },

  lockedLevelBtn: {
    backgroundColor: "#475569",
  },

  currentLevelBtn: {
    backgroundColor: "#FACC15",
  },

  levelBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },

  levelsHint: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "900",
    marginTop: 6,
  },

  levelsCloseBottom: {
    alignSelf: "center",
    marginTop: 12,
    minWidth: 180,
    minHeight: 42,
    borderRadius: 14,
    backgroundColor: "#FACC15",
    alignItems: "center",
    justifyContent: "center",
  },

  levelsCloseBottomText: {
    color: "#422006",
    fontSize: 14,
    fontWeight: "900",
  },
});