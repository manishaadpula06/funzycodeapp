
// screens/ChessGameScreen.js

import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  Modal,
  ScrollView,
  Platform,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const CHESS_BG = require("../assets/images/chessbackground.png");

const INITIAL_BOARD = [
  ["r", "n", "b", "q", "k", "b", "n", "r"],
  ["p", "p", "p", "p", "p", "p", "p", "p"],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["P", "P", "P", "P", "P", "P", "P", "P"],
  ["R", "N", "B", "Q", "K", "B", "N", "R"],
];

const PIECES = {
  p: "♟",
  P: "♙",
  r: "♜",
  R: "♖",
  n: "♞",
  N: "♘",
  b: "♝",
  B: "♗",
  q: "♛",
  Q: "♕",
  k: "♚",
  K: "♔",
};

const VALUES = {
  p: 1,
  P: 1,
  n: 3,
  N: 3,
  b: 3,
  B: 3,
  r: 5,
  R: 5,
  q: 9,
  Q: 9,
  k: 100,
  K: 100,
};

const cloneBoard = (board) => board.map((row) => [...row]);

const isWhitePiece = (piece) => piece && piece === piece.toUpperCase();
const isBlackPiece = (piece) => piece && piece === piece.toLowerCase();

const isOwnPiece = (piece, turn) => {
  if (!piece) return false;
  return turn === "white" ? isWhitePiece(piece) : isBlackPiece(piece);
};

const isEnemyPiece = (sourcePiece, targetPiece) => {
  if (!sourcePiece || !targetPiece) return false;
  return isWhitePiece(sourcePiece) ? isBlackPiece(targetPiece) : isWhitePiece(targetPiece);
};

const inBoard = (x, y) => x >= 0 && x < 8 && y >= 0 && y < 8;

const getValidMoves = (board, x, y) => {
  const piece = board[y][x];
  if (!piece) return [];

  const lower = piece.toLowerCase();
  const moves = [];

  const add = (nx, ny) => {
    if (!inBoard(nx, ny)) return false;

    const target = board[ny][nx];

    if (!target) {
      moves.push({ x: nx, y: ny });
      return true;
    }

    if (isEnemyPiece(piece, target)) {
      moves.push({ x: nx, y: ny });
    }

    return false;
  };

  if (lower === "p") {
    const direction = isWhitePiece(piece) ? -1 : 1;
    const startRow = isWhitePiece(piece) ? 6 : 1;
    const oneY = y + direction;
    const twoY = y + direction * 2;

    if (inBoard(x, oneY) && !board[oneY][x]) {
      moves.push({ x, y: oneY });

      if (y === startRow && inBoard(x, twoY) && !board[twoY][x]) {
        moves.push({ x, y: twoY });
      }
    }

    if (inBoard(x - 1, oneY) && isEnemyPiece(piece, board[oneY][x - 1])) {
      moves.push({ x: x - 1, y: oneY });
    }

    if (inBoard(x + 1, oneY) && isEnemyPiece(piece, board[oneY][x + 1])) {
      moves.push({ x: x + 1, y: oneY });
    }
  }

  if (lower === "r" || lower === "b" || lower === "q") {
    const directions = [];

    if (lower === "r" || lower === "q") {
      directions.push([1, 0], [-1, 0], [0, 1], [0, -1]);
    }

    if (lower === "b" || lower === "q") {
      directions.push([1, 1], [1, -1], [-1, 1], [-1, -1]);
    }

    directions.forEach(([dx, dy]) => {
      let nx = x + dx;
      let ny = y + dy;

      while (inBoard(nx, ny)) {
        const canContinue = add(nx, ny);
        if (!canContinue) break;

        nx += dx;
        ny += dy;
      }
    });
  }

  if (lower === "n") {
    [
      [1, 2],
      [2, 1],
      [2, -1],
      [1, -2],
      [-1, -2],
      [-2, -1],
      [-2, 1],
      [-1, 2],
    ].forEach(([dx, dy]) => {
      const nx = x + dx;
      const ny = y + dy;

      if (!inBoard(nx, ny)) return;

      const target = board[ny][nx];

      if (!target || isEnemyPiece(piece, target)) {
        moves.push({ x: nx, y: ny });
      }
    });
  }

  if (lower === "k") {
    [
      [1, 0],
      [1, 1],
      [0, 1],
      [-1, 1],
      [-1, 0],
      [-1, -1],
      [0, -1],
      [1, -1],
    ].forEach(([dx, dy]) => {
      const nx = x + dx;
      const ny = y + dy;

      if (!inBoard(nx, ny)) return;

      const target = board[ny][nx];

      if (!target || isEnemyPiece(piece, target)) {
        moves.push({ x: nx, y: ny });
      }
    });
  }

  return moves;
};

const getAllMovesForTurn = (board, turn) => {
  const allMoves = [];

  for (let y = 0; y < 8; y += 1) {
    for (let x = 0; x < 8; x += 1) {
      const piece = board[y][x];

      if (!isOwnPiece(piece, turn)) continue;

      const moves = getValidMoves(board, x, y);

      moves.forEach((move) => {
        allMoves.push({
          from: { x, y },
          to: move,
        });
      });
    }
  }

  return allMoves;
};

export default function ChessGameScreen({ navigation }) {
  const { width, height } = useWindowDimensions();

  const [started, setStarted] = useState(false);
  const [board, setBoard] = useState(() => cloneBoard(INITIAL_BOARD));
  const [turn, setTurn] = useState("white");
  const [scores, setScores] = useState({ white: 0, black: 0 });
  const [coins, setCoins] = useState(1250);

  const [selected, setSelected] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [hintMove, setHintMove] = useState(null);
  const [history, setHistory] = useState([]);

  const [flipped, setFlipped] = useState(false);
  const [winner, setWinner] = useState("");
  const [toast, setToast] = useState("");

  const isSmallHeight = height < 720;
  const isTinyWidth = width < 360;

  const pageWidth = Math.min(width - 18, 430);
  const boardSize = Math.min(pageWidth - 22, isSmallHeight ? height * 0.46 : 390);
  const safeBoardSize = Math.max(280, boardSize);
  const squareSize = safeBoardSize / 8;

  const displayRows = useMemo(() => {
    const coords = [];

    for (let y = 0; y < 8; y += 1) {
      const row = [];

      for (let x = 0; x < 8; x += 1) {
        row.push({ x, y });
      }

      coords.push(row);
    }

    if (flipped) {
      return coords.reverse().map((row) => row.reverse());
    }

    return coords;
  }, [flipped]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 1400);
  };

  const handleBack = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
      return;
    }

    navigation?.navigate?.("FunGames");
  };

  const resetGame = () => {
    setBoard(cloneBoard(INITIAL_BOARD));
    setTurn("white");
    setScores({ white: 0, black: 0 });
    setSelected(null);
    setValidMoves([]);
    setHintMove(null);
    setHistory([]);
    setWinner("");
  };

  const restartGame = () => {
    resetGame();
    setStarted(true);
  };

  const saveHistory = () => {
    setHistory((prev) => [
      ...prev,
      {
        board: cloneBoard(board),
        turn,
        scores: { ...scores },
      },
    ]);
  };

  const isValidDestination = (x, y) => {
    return validMoves.some((move) => move.x === x && move.y === y);
  };

  const movePiece = (from, to) => {
    const nextBoard = cloneBoard(board);
    const sourcePiece = nextBoard[from.y][from.x];
    const targetPiece = nextBoard[to.y][to.x];

    if (!sourcePiece) return;

    saveHistory();

    if (targetPiece) {
      const scorer = isWhitePiece(targetPiece) ? "black" : "white";

      setScores((prev) => ({
        ...prev,
        [scorer]: prev[scorer] + (VALUES[targetPiece] || 0),
      }));

      if (targetPiece.toLowerCase() === "k") {
        setWinner(scorer === "white" ? "White" : "Black");
        setCoins((prev) => prev + 100);
      }
    }

    nextBoard[to.y][to.x] = sourcePiece;
    nextBoard[from.y][from.x] = "";

    setBoard(nextBoard);
    setTurn((prev) => (prev === "white" ? "black" : "white"));
    setSelected(null);
    setValidMoves([]);
    setHintMove(null);
  };

  const handleSquarePress = (x, y) => {
    if (!started || winner) return;

    const piece = board[y][x];

    if (selected && isValidDestination(x, y)) {
      movePiece(selected, { x, y });
      return;
    }

    if (piece && isOwnPiece(piece, turn)) {
      setSelected({ x, y });
      setValidMoves(getValidMoves(board, x, y));
      setHintMove(null);
      return;
    }

    setSelected(null);
    setValidMoves([]);
    setHintMove(null);
  };

  const useHint = () => {
    if (coins < 20) {
      showToast("Need 20 coins");
      return;
    }

    const moves = getAllMovesForTurn(board, turn);

    if (!moves.length) {
      showToast("No moves available");
      return;
    }

    setCoins((prev) => prev - 20);

    const captureMove = moves.find((move) => !!board[move.to.y][move.to.x]);
    const selectedMove = captureMove || moves[0];

    setSelected(selectedMove.from);
    setValidMoves(getValidMoves(board, selectedMove.from.x, selectedMove.from.y));
    setHintMove(selectedMove);
  };

  const useUndo = () => {
    if (coins < 30) {
      showToast("Need 30 coins");
      return;
    }

    if (!history.length) {
      showToast("No move to undo");
      return;
    }

    const previous = history[history.length - 1];

    setCoins((prev) => prev - 30);
    setBoard(cloneBoard(previous.board));
    setTurn(previous.turn);
    setScores(previous.scores);
    setHistory((prev) => prev.slice(0, -1));
    setSelected(null);
    setValidMoves([]);
    setHintMove(null);
    setWinner("");
  };

  const useRestart = () => {
    if (coins < 50) {
      showToast("Need 50 coins");
      return;
    }

    setCoins((prev) => prev - 50);
    restartGame();
  };

  const useHintMove = () => {
    if (coins < 40) {
      showToast("Need 40 coins");
      return;
    }

    const moves = getAllMovesForTurn(board, turn);

    if (!moves.length) {
      showToast("No moves available");
      return;
    }

    setCoins((prev) => prev - 40);

    const bestCapture = moves
      .filter((move) => board[move.to.y][move.to.x])
      .sort((a, b) => {
        const pieceA = board[a.to.y][a.to.x];
        const pieceB = board[b.to.y][b.to.x];
        return (VALUES[pieceB] || 0) - (VALUES[pieceA] || 0);
      })[0];

    const selectedMove = bestCapture || moves[Math.floor(Math.random() * moves.length)];

    setSelected(selectedMove.from);
    setValidMoves(getValidMoves(board, selectedMove.from.x, selectedMove.from.y));
    setHintMove(selectedMove);
  };

  const useFlipBoard = () => {
    if (coins < 30) {
      showToast("Need 30 coins");
      return;
    }

    setCoins((prev) => prev - 30);
    setFlipped((prev) => !prev);
  };

  const renderSquare = ({ x, y }) => {
    const piece = board[y][x];
    const isDark = (x + y) % 2 === 1;
    const selectedSquare = selected?.x === x && selected?.y === y;
    const validSquare = isValidDestination(x, y);
    const hintFrom = hintMove?.from?.x === x && hintMove?.from?.y === y;
    const hintTo = hintMove?.to?.x === x && hintMove?.to?.y === y;

    return (
      <TouchableOpacity
        key={`${x}-${y}`}
        activeOpacity={0.85}
        onPress={() => handleSquarePress(x, y)}
        style={[
          styles.square,
          {
            width: squareSize,
            height: squareSize,
            backgroundColor: isDark ? "#3E6B35" : "#F3E3BE",
          },
          selectedSquare && styles.selectedSquare,
          validSquare && styles.validSquare,
          hintFrom && styles.hintFromSquare,
          hintTo && styles.hintToSquare,
        ]}
      >
        {!!piece && (
          <Text
            style={[
              styles.piece,
              {
                fontSize: squareSize * 0.64,
                color: isWhitePiece(piece) ? "#FFF8E7" : "#111111",
              },
              isWhitePiece(piece) ? styles.whitePiece : styles.blackPiece,
            ]}
          >
            {PIECES[piece]}
          </Text>
        )}

        {validSquare && !piece && <View style={styles.moveDot} />}
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        styles.root,
        Platform.OS === "web" && {
          width: "100vw",
          height: "100vh",
          minHeight: height,
          overflow: "hidden",
        },
      ]}
    >
      <ImageBackground
        source={CHESS_BG}
        style={styles.bg}
        imageStyle={styles.bgImage}
        resizeMode="cover"
      >
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

        <LinearGradient
          colors={[
            "rgba(0,0,0,0.08)",
            "rgba(0,0,0,0.22)",
            "rgba(0,0,0,0.56)",
            "rgba(0,0,0,0.86)",
          ]}
          locations={[0, 0.28, 0.68, 1]}
          style={styles.overlay}
        >
          <SafeAreaView style={styles.safe}>
            <ScrollView
              style={styles.scroll}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[
                styles.scrollContent,
                {
                  minHeight: height - (Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0),
                },
              ]}
            >
              <View style={[styles.topRow, { width: pageWidth }]}>
                <TouchableOpacity activeOpacity={0.85} style={styles.backButton} onPress={handleBack}>
                  <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                  <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>

                <View style={styles.profileCard}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>♟</Text>
                  </View>

                  <View style={styles.profileTextBox}>
                    <Text style={styles.playerName} numberOfLines={1}>
                      Alex Gamer
                    </Text>

                    <View style={styles.coinRow}>
                      <Ionicons name="cash" size={15} color="#FFD54A" />
                      <Text style={styles.coinText}>{coins}</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.titleArea}>
                <Text style={styles.kingIcon}>♔</Text>
                <Text style={[styles.title, isTinyWidth && styles.titleSmall]}>
                  <Text style={styles.titleGold}>CHESS</Text>
                  <Text style={styles.titleWhite}> GAME</Text>
                </Text>
              </View>

              <View style={[styles.infoRow, { width: pageWidth }]}>
                <View style={styles.infoPill}>
                  <View style={styles.greenCircle}>
                    <Ionicons name="trophy" size={21} color="#FFFFFF" />
                  </View>
                  <Text style={styles.infoPillText}>
                    {turn === "white" ? "White's Turn" : "Black's Turn"}
                  </Text>
                </View>

                <View style={styles.infoPill}>
                  <Ionicons name="podium" size={21} color="#FFD54A" />
                  <Text style={styles.infoPillText}>
                    White: {scores.white} | Black: {scores.black}
                  </Text>
                </View>
              </View>

              <View style={styles.boardOuter}>
                <View style={[styles.boardFrame, { width: safeBoardSize, height: safeBoardSize }]}>
                  {displayRows.map((row, rowIndex) => (
                    <View key={`row-${rowIndex}`} style={styles.boardRow}>
                      {row.map(renderSquare)}
                    </View>
                  ))}
                </View>
              </View>

              <View style={[styles.powerPanel, { width: pageWidth }]}>
                <PowerButton icon="bulb" label="Hint" cost={20} color="#FFB703" onPress={useHint} />
                <PowerButton icon="arrow-undo" label="Undo" cost={30} color="#1C8DFF" onPress={useUndo} />
                <PowerButton icon="refresh" label="Restart" cost={50} color="#28A828" onPress={useRestart} />
                <PowerButton icon="locate" label="Hint Move" cost={40} color="#8E35FF" onPress={useHintMove} />
                <PowerButton icon="swap-horizontal" label="Flip Board" cost={30} color="#15BFD8" onPress={useFlipBoard} />
              </View>

              {!started && (
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={[styles.startButton, { width: Math.min(pageWidth * 0.7, 300) }]}
                  onPress={() => setStarted(true)}
                >
                  <Ionicons name="play" size={31} color="#FFFFFF" />
                  <Text style={styles.startText}>Start Game</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>

      <Modal transparent visible={!started} animationType="fade">
        <View style={styles.startModalBackdrop}>
          <View style={styles.startModalCard}>
            <Text style={styles.startModalIcon}>♔</Text>
            <Text style={styles.startModalTitle}>Chess Game</Text>
            <Text style={styles.startModalText}>
              Tap your chess piece, choose a highlighted square, capture pieces, and win the game.
            </Text>

            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.modalStartButton}
              onPress={() => setStarted(true)}
            >
              <Ionicons name="play" size={24} color="#FFFFFF" />
              <Text style={styles.modalStartText}>Start Game</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={!!winner} animationType="fade">
        <View style={styles.startModalBackdrop}>
          <View style={styles.winCard}>
            <Text style={styles.winIcon}>🏆</Text>
            <Text style={styles.winTitle}>{winner} Wins!</Text>
            <Text style={styles.winText}>You captured the king and earned 100 coins.</Text>

            <TouchableOpacity activeOpacity={0.9} style={styles.modalStartButton} onPress={restartGame}>
              <Ionicons name="refresh" size={22} color="#FFFFFF" />
              <Text style={styles.modalStartText}>Play Again</Text>
            </TouchableOpacity>
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

function PowerButton({ icon, label, cost, color, onPress }) {
  return (
    <TouchableOpacity activeOpacity={0.86} style={styles.powerButton} onPress={onPress}>
      <View style={[styles.powerIconCircle, { backgroundColor: color }]}>
        <Ionicons name={icon} size={22} color="#FFFFFF" />
      </View>

      <Text style={styles.powerLabel} numberOfLines={1}>
        {label}
      </Text>

      <View style={styles.powerCostPill}>
        <Ionicons name="cash" size={12} color="#FFD54A" />
        <Text style={styles.powerCost}>{cost}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: "100%",
    backgroundColor: "#1B0F08",
  },

  bg: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#1B0F08",
  },

  bgImage: {
    width: "100%",
    height: "100%",
  },

  overlay: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  safe: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 24 : 0,
  },

  scroll: {
    flex: 1,
    width: "100%",
  },

  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 12,
    paddingBottom: 28,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    minWidth: 106,
    height: 47,
    borderRadius: 15,
    backgroundColor: "#2F9F35",
    borderWidth: 2,
    borderColor: "#64D967",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },

  backText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    marginLeft: 6,
  },

  profileCard: {
    height: 50,
    maxWidth: 210,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.74)",
    borderWidth: 2,
    borderColor: "#D79B2E",
    paddingHorizontal: 8,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#37B64A",
    borderWidth: 2,
    borderColor: "#A5EF75",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "900",
  },

  profileTextBox: {
    marginLeft: 8,
    maxWidth: 130,
  },

  playerName: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },

  coinRow: {
    marginTop: 2,
    flexDirection: "row",
    alignItems: "center",
  },

  coinText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
    marginLeft: 4,
  },

  titleArea: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: 8,
  },

  kingIcon: {
    color: "#FFD166",
    fontSize: 35,
    textShadowColor: "#000",
    textShadowRadius: 8,
  },

  title: {
    marginTop: -8,
    fontSize: 36,
    fontWeight: "900",
    textShadowColor: "#000000",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 5,
  },

  titleSmall: {
    fontSize: 31,
  },

  titleGold: {
    color: "#FFC244",
  },

  titleWhite: {
    color: "#F4F4F4",
  },

  infoRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },

  infoPill: {
    flex: 1,
    minHeight: 48,
    borderRadius: 15,
    backgroundColor: "rgba(0,0,0,0.74)",
    borderWidth: 1.5,
    borderColor: "#B88535",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 7,
  },

  greenCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#41A73C",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
  },

  infoPillText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center",
  },

  boardOuter: {
    borderRadius: 18,
    backgroundColor: "#8B5528",
    padding: 7,
    borderWidth: 3,
    borderColor: "#3A1C0A",
    shadowColor: "#000000",
    shadowOpacity: 0.55,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },

  boardFrame: {
    borderWidth: 2,
    borderColor: "#261306",
    backgroundColor: "#261306",
  },

  boardRow: {
    flexDirection: "row",
  },

  square: {
    alignItems: "center",
    justifyContent: "center",
  },

  selectedSquare: {
    borderWidth: 3,
    borderColor: "#00E5FF",
  },

  validSquare: {
    borderWidth: 3,
    borderColor: "#FFD60A",
  },

  hintFromSquare: {
    borderWidth: 3,
    borderColor: "#8E35FF",
  },

  hintToSquare: {
    borderWidth: 3,
    borderColor: "#00F5A0",
  },

  piece: {
    fontWeight: "900",
  },

  whitePiece: {
    textShadowColor: "#000000",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  blackPiece: {
    textShadowColor: "#FFFFFF",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  moveDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(255,214,10,0.88)",
  },

  powerPanel: {
    marginTop: 13,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.78)",
    borderWidth: 2,
    borderColor: "#8A5A24",
    flexDirection: "row",
    padding: 6,
  },

  powerButton: {
    flex: 1,
    minHeight: 78,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: "rgba(255,255,255,0.08)",
  },

  powerIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.35)",
  },

  powerLabel: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "900",
    marginTop: 5,
    textAlign: "center",
  },

  powerCostPill: {
    marginTop: 4,
    height: 21,
    borderRadius: 11,
    paddingHorizontal: 6,
    backgroundColor: "rgba(0,0,0,0.62)",
    flexDirection: "row",
    alignItems: "center",
  },

  powerCost: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
    marginLeft: 3,
  },

  startButton: {
    height: 56,
    borderRadius: 21,
    backgroundColor: "#35A83B",
    borderWidth: 2,
    borderColor: "#A5EF75",
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  startText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    marginLeft: 10,
  },

  startModalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.76)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  startModalCard: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 28,
    backgroundColor: "#1B120B",
    borderWidth: 2,
    borderColor: "#D79B2E",
    padding: 24,
    alignItems: "center",
  },

  startModalIcon: {
    fontSize: 58,
    color: "#FFD166",
  },

  startModalTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    marginTop: 8,
  },

  startModalText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 21,
    marginTop: 10,
    marginBottom: 20,
  },

  modalStartButton: {
    height: 52,
    paddingHorizontal: 28,
    borderRadius: 20,
    backgroundColor: "#35A83B",
    borderWidth: 2,
    borderColor: "#A5EF75",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  modalStartText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
    marginLeft: 8,
  },

  winCard: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 28,
    backgroundColor: "#1B120B",
    borderWidth: 2,
    borderColor: "#FFD166",
    padding: 24,
    alignItems: "center",
  },

  winIcon: {
    fontSize: 58,
  },

  winTitle: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "900",
    marginTop: 6,
  },

  winText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 20,
  },

  toast: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: 110,
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