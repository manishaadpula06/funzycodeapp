
// screens/JungleCoinEscapeScreen.js

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
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
  PanResponder,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const isTiny = width < 350;
const isSmall = width < 380;
const isShort = height < 720;

const clamp = (value, min, max) => Math.max(min, Math.min(value, max));
const SCALE = clamp(width / 390, 0.72, 1);
const fs = (value) => Math.round(value * SCALE);
const rs = (value) => Math.round(value * SCALE);

const BG_GAME = require("../assets/images/jungleRun/jungle-bg.png");
const BG_HOME = require("../assets/images/jungleRun/jungle-home-bg.png");

const GAME_OVER_BOARD = require("../assets/images/jungleRun/game-over-board.png");
const REWARD_BOARD = require("../assets/images/jungleRun/reward-board.png");

const LOGO = require("../assets/images/jungleRun/runner-logo.png");

const RUNNER_BOY = require("../assets/images/jungleRun/runner-boy.png");
const RUNNER_GIRL = require("../assets/images/jungleRun/runner-girl.png");
const RUNNER_NINJA = require("../assets/images/jungleRun/runner-ninja.png");
const RUNNER_STRONG = require("../assets/images/jungleRun/runner-strong.png");

const COIN = require("../assets/images/jungleRun/runner-coin.png");
const GEM = require("../assets/images/jungleRun/runner-gem.png");
const ROCK = require("../assets/images/jungleRun/runner-rock.png");
const SPIKES = require("../assets/images/jungleRun/runner-spikes.png");
const ROLLING_STONE = require("../assets/images/jungleRun/rolling-stone.png");

const SHIELD = require("../assets/images/jungleRun/runner-shield.png");
const MAGNET = require("../assets/images/jungleRun/runner-magnet.png");
const BOOST = require("../assets/images/jungleRun/runner-boost.png");
const TREASURE = require("../assets/images/jungleRun/runner-treasure.png");

const LANES = [-1, 0, 1];

const RUNNERS = [
  {
    id: "boy",
    name: "Jake",
    image: RUNNER_BOY,
    color: "#21A448",
    skill: "Balanced Runner",
  },
  {
    id: "girl",
    name: "Lila",
    image: RUNNER_GIRL,
    color: "#E4A91B",
    skill: "Coin Magnet",
  },
  {
    id: "ninja",
    name: "Ryan",
    image: RUNNER_NINJA,
    color: "#0B7DE8",
    skill: "Fast Dash",
  },
  {
    id: "strong",
    name: "Thor",
    image: RUNNER_STRONG,
    color: "#8E34D6",
    skill: "Shield Power",
  },
];

const OBJECT_IMAGES = {
  coin: COIN,
  gem: GEM,
  rock: ROCK,
  spikes: SPIKES,
  rollingStone: ROLLING_STONE,
  shield: SHIELD,
  magnet: MAGNET,
  boost: BOOST,
  treasure: TREASURE,
};

const OBJECT_POOL = [
  "coin",
  "coin",
  "coin",
  "coin",
  "gem",
  "rock",
  "spikes",
  "rollingStone",
  "shield",
  "magnet",
  "boost",
  "treasure",
];

const getLaneX = (lane) => {
  if (lane === -1) return width * 0.25;
  if (lane === 0) return width * 0.5;
  return width * 0.75;
};

const makeId = () => `${Date.now()}_${Math.random().toString(16).slice(2)}`;

export default function JungleCoinEscapeScreen({ navigation }) {
  const [screen, setScreen] = useState("home");

  const [level, setLevel] = useState(1);
  const [selectedRunnerId, setSelectedRunnerId] = useState("boy");

  const [totalCoins, setTotalCoins] = useState(2458);
  const [totalGems, setTotalGems] = useState(124);
  const [totalStars, setTotalStars] = useState(38);
  const [bestDistance, setBestDistance] = useState(0);

  const [playerLane, setPlayerLane] = useState(0);
  const [objects, setObjects] = useState([]);

  const [runCoins, setRunCoins] = useState(0);
  const [runGems, setRunGems] = useState(0);
  const [distance, setDistance] = useState(0);
  const [score, setScore] = useState(0);

  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [isJumping, setIsJumping] = useState(false);
  const [isSliding, setIsSliding] = useState(false);

  const [shieldActive, setShieldActive] = useState(false);
  const [magnetActive, setMagnetActive] = useState(false);
  const [boostActive, setBoostActive] = useState(false);

  const [message, setMessage] = useState("");
  const messageTimerRef = useRef(null);

  // ── refs that mirror state for use inside setInterval callbacks ──────────
  const playerLaneRef = useRef(0);
  const runningRef = useRef(false);
  const pausedRef = useRef(false);
  const gameEndedRef = useRef(false);

  const shieldRef = useRef(false);
  const magnetRef = useRef(false);
  const boostRef = useRef(false);
  const jumpingRef = useRef(false);
  const slidingRef = useRef(false);

  const runCoinsRef = useRef(0);
  const runGemsRef = useRef(0);
  const distanceRef = useRef(0);
  const scoreRef = useRef(0);

  const levelRef = useRef(1);

  // ── derived values ────────────────────────────────────────────────────────
  const missionCoins = useMemo(() => 20 + level * 5, [level]);
  const missionDistance = useMemo(() => 450 + level * 120, [level]);

  const selectedRunner = useMemo(
    () => RUNNERS.find((item) => item.id === selectedRunnerId) || RUNNERS[0],
    [selectedRunnerId]
  );

  const baseSpeed = useMemo(() => clamp(4 + level * 0.45, 4, 8.5), [level]);

  // Keep refs in sync with state
  useEffect(() => { playerLaneRef.current = playerLane; }, [playerLane]);
  useEffect(() => { runningRef.current = isRunning; }, [isRunning]);
  useEffect(() => { pausedRef.current = isPaused; }, [isPaused]);
  useEffect(() => { shieldRef.current = shieldActive; }, [shieldActive]);
  useEffect(() => { magnetRef.current = magnetActive; }, [magnetActive]);
  useEffect(() => { boostRef.current = boostActive; }, [boostActive]);
  useEffect(() => { jumpingRef.current = isJumping; }, [isJumping]);
  useEffect(() => { slidingRef.current = isSliding; }, [isSliding]);
  useEffect(() => { runCoinsRef.current = runCoins; }, [runCoins]);
  useEffect(() => { runGemsRef.current = runGems; }, [runGems]);
  useEffect(() => { distanceRef.current = distance; }, [distance]);
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { levelRef.current = level; }, [level]);

  // ── show a timed message (clears previous one) ───────────────────────────
  const showMessage = useCallback((msg) => {
    if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    setMessage(msg);
    messageTimerRef.current = setTimeout(() => setMessage(""), 2200);
  }, []);

  // ── movement & actions ────────────────────────────────────────────────────
  const moveLeft = useCallback(() => {
    setPlayerLane((lane) => {
      const next = Math.max(-1, lane - 1);
      playerLaneRef.current = next;
      return next;
    });
  }, []);

  const moveRight = useCallback(() => {
    setPlayerLane((lane) => {
      const next = Math.min(1, lane + 1);
      playerLaneRef.current = next;
      return next;
    });
  }, []);

  const jump = useCallback(() => {
    if (jumpingRef.current) return;
    setIsJumping(true);
    jumpingRef.current = true;
    setTimeout(() => {
      setIsJumping(false);
      jumpingRef.current = false;
    }, 650);
  }, []);

  const slide = useCallback(() => {
    if (slidingRef.current) return;
    setIsSliding(true);
    slidingRef.current = true;
    setTimeout(() => {
      setIsSliding(false);
      slidingRef.current = false;
    }, 650);
  }, []);

  // ── pan responder (stable ref) ────────────────────────────────────────────
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dx) > 18 || Math.abs(gesture.dy) > 18,
      onPanResponderRelease: (_, gesture) => {
        if (!runningRef.current || pausedRef.current) return;
        const { dx, dy } = gesture;
        if (Math.abs(dx) > Math.abs(dy)) {
          if (dx > 35) moveRight();
          else if (dx < -35) moveLeft();
          return;
        }
        if (dy < -35) jump();
        else if (dy > 35) slide();
      },
    })
  ).current;

  // ── power-up activator ────────────────────────────────────────────────────
  const activatePower = useCallback((type) => {
    if (type === "shield") {
      setShieldActive(true);
      shieldRef.current = true;
      showMessage("Shield activated!");
      setTimeout(() => {
        setShieldActive(false);
        shieldRef.current = false;
      }, 6500);
    } else if (type === "magnet") {
      setMagnetActive(true);
      magnetRef.current = true;
      showMessage("Magnet activated!");
      setTimeout(() => {
        setMagnetActive(false);
        magnetRef.current = false;
      }, 6500);
    } else if (type === "boost") {
      setBoostActive(true);
      boostRef.current = true;
      showMessage("Speed boost activated!");
      setTimeout(() => {
        setBoostActive(false);
        boostRef.current = false;
      }, 5500);
    }
  }, [showMessage]);

  // ── reward helpers (safe outside updater) ────────────────────────────────
  const addCoinReward = useCallback((amount) => {
    setRunCoins((v) => { const n = v + amount; runCoinsRef.current = n; return n; });
    setTotalCoins((v) => v + amount);
  }, []);

  const addGemReward = useCallback((amount) => {
    setRunGems((v) => { const n = v + amount; runGemsRef.current = n; return n; });
    setTotalGems((v) => v + amount);
  }, []);

  const addScoreReward = useCallback((amount) => {
    setScore((v) => { const n = v + amount; scoreRef.current = n; return n; });
  }, []);

  // ── game-end functions ────────────────────────────────────────────────────
  const endGame = useCallback(() => {
    if (gameEndedRef.current) return;
    gameEndedRef.current = true;
    runningRef.current = false;
    setIsRunning(false);
    setIsPaused(false);
    setBestDistance((old) => Math.max(old, distanceRef.current));
    setScreen("gameOver");
  }, []);

  const completeLevel = useCallback(() => {
    if (gameEndedRef.current) return;
    gameEndedRef.current = true;
    runningRef.current = false;
    setIsRunning(false);
    setIsPaused(false);

    const rewardCoins = 100 + levelRef.current * 20;
    setTotalCoins((v) => v + rewardCoins);
    setTotalStars((v) => v + 3);
    setBestDistance((old) => Math.max(old, distanceRef.current));
    setScreen("reward");
  }, []);

  // ── start / reset ─────────────────────────────────────────────────────────
  const startRun = useCallback(() => {
    // clear any lingering message timer
    if (messageTimerRef.current) clearTimeout(messageTimerRef.current);

    gameEndedRef.current = false;
    runningRef.current = true;
    pausedRef.current = false;

    setObjects([]);
    setPlayerLane(0);
    playerLaneRef.current = 0;

    setRunCoins(0);
    setRunGems(0);
    setDistance(0);
    setScore(0);

    runCoinsRef.current = 0;
    runGemsRef.current = 0;
    distanceRef.current = 0;
    scoreRef.current = 0;

    setShieldActive(false);
    setMagnetActive(false);
    setBoostActive(false);
    setIsJumping(false);
    setIsSliding(false);

    shieldRef.current = false;
    magnetRef.current = false;
    boostRef.current = false;
    jumpingRef.current = false;
    slidingRef.current = false;

    setMessage("");
    setIsPaused(false);
    setIsRunning(true);
    setScreen("game");
  }, []);

  // ── spawn timer ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (screen !== "game" || !isRunning) return;

    const spawnTimer = setInterval(() => {
      if (!runningRef.current || pausedRef.current || gameEndedRef.current) return;

      const randomType = OBJECT_POOL[Math.floor(Math.random() * OBJECT_POOL.length)];
      const randomLane = LANES[Math.floor(Math.random() * LANES.length)];

      setObjects((old) => {
        if (old.length > 16) return old;
        return [...old, { id: makeId(), type: randomType, lane: randomLane, y: -rs(80) }];
      });
    }, Math.max(520, 900 - level * 35));

    return () => clearInterval(spawnTimer);
  }, [screen, isRunning, level]);

  // ── main game loop ────────────────────────────────────────────────────────
  useEffect(() => {
    if (screen !== "game" || !isRunning) return;

    const loopTimer = setInterval(() => {
      if (!runningRef.current || pausedRef.current || gameEndedRef.current) return;

      const speed = boostRef.current ? baseSpeed + 3 : baseSpeed;

      // ── distance & level-complete check ──
      const nextDistance = distanceRef.current + Math.round(speed * 0.85);
      distanceRef.current = nextDistance;
      setDistance(nextDistance);

      // score tick
      const nextScore = scoreRef.current + 1;
      scoreRef.current = nextScore;
      setScore(nextScore);

      if (
        nextDistance >= missionDistance &&
        runCoinsRef.current >= missionCoins &&
        !gameEndedRef.current
      ) {
        setTimeout(completeLevel, 0);
        return;
      }

      // ── object movement & collision ──
      // Collect side-effects here, apply AFTER updating objects
      let coinDelta = 0;
      let gemDelta = 0;
      let totalCoinDelta = 0;
      let totalGemDelta = 0;
      let scoreDelta = 0;
      let hitObstacle = false;
      let shieldUsed = false;
      const pendingPowers = [];
      let pendingMessage = "";

      setObjects((old) => {
        // Reset accumulators for this tick
        coinDelta = 0;
        gemDelta = 0;
        totalCoinDelta = 0;
        totalGemDelta = 0;
        scoreDelta = 0;
        hitObstacle = false;
        shieldUsed = false;
        pendingPowers.length = 0;
        pendingMessage = "";

        const next = [];

        for (const item of old) {
          const moved = { ...item, y: item.y + speed };

          // off-screen: discard
          if (moved.y > height + rs(120)) continue;

          const sameLane = moved.lane === playerLaneRef.current;
          const nearPlayer =
            moved.y > height - rs(310) && moved.y < height - rs(155);

          const canMagnetCollect =
            magnetRef.current &&
            ["coin", "gem", "treasure"].includes(moved.type) &&
            moved.y > height - rs(430);

          const shouldCollect = (sameLane && nearPlayer) || canMagnetCollect;

          if (!shouldCollect) {
            next.push(moved);
            continue;
          }

          // ── collectibles ──
          if (moved.type === "coin") {
            coinDelta += 1;
            totalCoinDelta += 1;
            scoreDelta += 10;
            continue;
          }

          if (moved.type === "gem") {
            gemDelta += 1;
            totalGemDelta += 1;
            scoreDelta += 25;
            continue;
          }

          if (moved.type === "treasure") {
            coinDelta += 25;
            totalCoinDelta += 25;
            scoreDelta += 50;
            pendingMessage = "Treasure bonus! +25 coins";
            continue;
          }

          // ── power-ups ──
          if (moved.type === "shield") {
            pendingPowers.push("shield");
            scoreDelta += 15;
            continue;
          }

          if (moved.type === "magnet") {
            pendingPowers.push("magnet");
            scoreDelta += 15;
            continue;
          }

          if (moved.type === "boost") {
            pendingPowers.push("boost");
            scoreDelta += 15;
            continue;
          }

          // ── obstacles ──
          if (moved.type === "spikes" && jumpingRef.current) {
            scoreDelta += 20;
            pendingMessage = "Nice jump!";
            continue;
          }

          if (moved.type === "rock" && slidingRef.current) {
            scoreDelta += 20;
            pendingMessage = "Nice slide!";
            continue;
          }

          if (["rock", "spikes", "rollingStone"].includes(moved.type)) {
            if (shieldRef.current) {
              shieldUsed = true;
              scoreDelta += 20;
              pendingMessage = "Shield saved you!";
              continue;
            }
            hitObstacle = true;
            continue; // remove the obstacle too
          }

          // unhandled type — keep moving
          next.push(moved);
        }

        return next;
      });

      // ── apply side-effects after setObjects ──
      // Use setTimeout(0) to batch outside the updater safely
      setTimeout(() => {
        if (gameEndedRef.current) return;

        if (coinDelta > 0) {
          setRunCoins((v) => { const n = v + coinDelta; runCoinsRef.current = n; return n; });
          setTotalCoins((v) => v + totalCoinDelta);
        }

        if (gemDelta > 0) {
          setRunGems((v) => { const n = v + gemDelta; runGemsRef.current = n; return n; });
          setTotalGems((v) => v + totalGemDelta);
        }

        if (scoreDelta > 0) {
          setScore((v) => { const n = v + scoreDelta; scoreRef.current = n; return n; });
        }

        for (const power of pendingPowers) {
          activatePower(power);
        }

        if (shieldUsed) {
          setShieldActive(false);
          shieldRef.current = false;
        }

        if (pendingMessage) {
          showMessage(pendingMessage);
        }

        if (hitObstacle && !gameEndedRef.current) {
          endGame();
        }
      }, 0);
    }, 30);

    return () => clearInterval(loopTimer);
  }, [
    screen,
    isRunning,
    baseSpeed,
    missionCoins,
    missionDistance,
    completeLevel,
    endGame,
    activatePower,
    showMessage,
  ]);

  // ── sub-components ────────────────────────────────────────────────────────

  const HeaderBar = ({ showBack = true, onBack }) => (
    <View style={styles.header}>
      {showBack ? (
        <TouchableOpacity
          style={styles.headerSquare}
          activeOpacity={0.85}
          onPress={onBack || (() => navigation?.goBack?.())}
        >
          <Ionicons name="arrow-back" size={rs(24)} color="#FFFFFF" />
        </TouchableOpacity>
      ) : (
        <View style={styles.headerSquarePlaceholder} />
      )}

      <View style={styles.headerPill}>
        <Image source={COIN} style={styles.headerIcon} />
        <Text style={styles.headerText}>{totalCoins}</Text>
        <View style={styles.plusCircle}>
          <Ionicons name="add" size={rs(13)} color="#FFFFFF" />
        </View>
      </View>

      <View style={styles.headerPill}>
        <Image source={GEM} style={styles.headerIcon} />
        <Text style={styles.headerText}>{totalGems}</Text>
        <View style={styles.plusCircle}>
          <Ionicons name="add" size={rs(13)} color="#FFFFFF" />
        </View>
      </View>

      <TouchableOpacity style={styles.soundSquare} activeOpacity={0.85}>
        <Ionicons name="volume-high" size={rs(23)} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  const SmallMenuButton = ({ image, icon, title }) => (
    <TouchableOpacity style={styles.smallMenuBtn} activeOpacity={0.85}>
      {image ? (
        <Image source={image} style={styles.smallMenuImage} />
      ) : (
        <Ionicons name={icon} size={rs(28)} color="#FFFFFF" />
      )}
      <Text style={styles.smallMenuText}>{title}</Text>
    </TouchableOpacity>
  );

  const PowerStatus = ({ image, text, color }) => (
    <View style={[styles.powerStatus, { backgroundColor: color }]}>
      <Image source={image} style={styles.powerStatusIcon} />
      <Text style={styles.powerStatusText}>{text}</Text>
    </View>
  );

  // ── screens ───────────────────────────────────────────────────────────────

  const HomeScreen = () => (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#08345E" />
      <ImageBackground source={BG_HOME} style={styles.bg} imageStyle={styles.bgImage}>
        <View style={styles.darkTopOverlay} />
        <HeaderBar showBack onBack={() => navigation?.goBack?.()} />

        <View style={styles.homeContent}>
          <Image source={LOGO} style={styles.homeLogo} />

          <View style={styles.levelHomeBadge}>
            <Text style={styles.levelHomeText}>Level {level}</Text>
          </View>

          <View style={styles.runnerPreviewCard}>
            <Image source={selectedRunner.image} style={styles.previewRunner} />
            <View style={styles.previewTextBox}>
              <Text style={styles.previewTitle}>{selectedRunner.name}</Text>
              <Text style={styles.previewSub}>{selectedRunner.skill}</Text>
            </View>
            <TouchableOpacity
              style={styles.changeRunnerBtn}
              activeOpacity={0.85}
              onPress={() => setScreen("runner")}
            >
              <Text style={styles.changeRunnerText}>Change</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.homeMissionCard}>
            <Text style={styles.missionHeaderText}>MISSION</Text>
            <View style={styles.missionLine}>
              <Image source={COIN} style={styles.missionIcon} />
              <Text style={styles.missionText}>Collect {missionCoins} coins</Text>
            </View>
            <View style={styles.missionLine}>
              <Ionicons name="flag" size={rs(22)} color="#18A343" />
              <Text style={styles.missionText}>Run {missionDistance} meters</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.bigGreenButton}
            activeOpacity={0.9}
            onPress={startRun}
          >
            <Text style={styles.bigGreenButtonText}>START RUN</Text>
          </TouchableOpacity>

          <View style={styles.homeBottomRow}>
            <SmallMenuButton image={TREASURE} title="Shop" />
            <SmallMenuButton icon="clipboard" title="Missions" />
            <SmallMenuButton icon="trophy" title="Rank" />
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );

  const RunnerSelectScreen = () => (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#08345E" />
      <ImageBackground source={BG_HOME} style={styles.bg} imageStyle={styles.bgImage}>
        <View style={styles.darkTopOverlay} />
        <HeaderBar onBack={() => setScreen("home")} />

        <View style={styles.runnerContent}>
          <Image source={LOGO} style={styles.runnerLogo} />

          <View style={styles.chooseBoard}>
            <Text style={styles.chooseText}>CHOOSE YOUR RUNNER</Text>
          </View>

          <View style={styles.runnerGrid}>
            {RUNNERS.map((runner) => {
              const active = selectedRunnerId === runner.id;
              return (
                <TouchableOpacity
                  key={runner.id}
                  style={[
                    styles.runnerCard,
                    { borderColor: runner.color },
                    active && styles.runnerCardActive,
                  ]}
                  activeOpacity={0.88}
                  onPress={() => setSelectedRunnerId(runner.id)}
                >
                  <View style={[styles.runnerCardTop, { backgroundColor: runner.color }]}>
                    <Image source={runner.image} style={styles.runnerCardImage} />
                  </View>
                  <Text style={styles.runnerName}>{runner.name}</Text>
                  <Text style={styles.runnerSkill}>{runner.skill}</Text>
                  {active && (
                    <View style={styles.selectedBadge}>
                      <Ionicons name="checkmark" size={rs(15)} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            style={styles.bigGreenButton}
            activeOpacity={0.9}
            onPress={() => setScreen("home")}
          >
            <Text style={styles.bigGreenButtonText}>SELECT RUNNER</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );

  const GameScreen = () => {
    const playerSize = isTiny ? rs(105) : rs(122);
    const playerX = getLaneX(playerLane) - playerSize / 2;
    const playerBottom = isShort ? rs(160) : rs(178);

    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" backgroundColor="#08345E" />
        <ImageBackground
          source={BG_GAME}
          style={styles.bg}
          imageStyle={styles.bgImage}
          {...panResponder.panHandlers}
        >
          <View style={styles.gameTopGradient} />

          {/* HUD */}
          <View style={styles.gameHeader}>
            <View style={styles.gameMiniPill}>
              <Image source={COIN} style={styles.gameMiniIcon} />
              <Text style={styles.gameMiniText}>{runCoins}</Text>
            </View>
            <View style={styles.gameMiniPill}>
              <Image source={GEM} style={styles.gameMiniIcon} />
              <Text style={styles.gameMiniText}>{runGems}</Text>
            </View>
            <View style={styles.scorePill}>
              <Text style={styles.scoreText}>{distance}m</Text>
            </View>
            <TouchableOpacity
              style={styles.pauseBtn}
              activeOpacity={0.85}
              onPress={() => {
                const next = !isPaused;
                setIsPaused(next);
                pausedRef.current = next;
              }}
            >
              <Ionicons
                name={isPaused ? "play" : "pause"}
                size={rs(23)}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>

          {/* Mission progress */}
          <View style={styles.missionFloatingBox}>
            <Text style={styles.missionFloatingTitle}>MISSIONS</Text>
            <View style={styles.progressLine}>
              <Text style={styles.progressLabel}>Coins</Text>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${clamp((runCoins / missionCoins) * 100, 0, 100)}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressValue}>
                {runCoins}/{missionCoins}
              </Text>
            </View>
            <View style={styles.progressLine}>
              <Text style={styles.progressLabel}>Run</Text>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFillBlue,
                    { width: `${clamp((distance / missionDistance) * 100, 0, 100)}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressValue}>
                {Math.min(distance, missionDistance)}/{missionDistance}
              </Text>
            </View>
          </View>

          {/* Falling objects */}
          {objects.map((item) => {
            const objectSize = clamp(rs(34) + item.y * 0.055, rs(32), rs(74));
            const objectX = getLaneX(item.lane) - objectSize / 2;
            return (
              <Image
                key={item.id}
                source={OBJECT_IMAGES[item.type]}
                style={[
                  styles.fallingObject,
                  { width: objectSize, height: objectSize, left: objectX, top: item.y },
                ]}
              />
            );
          })}

          {/* Player glow */}
          <View
            style={[
              styles.playerGlow,
              {
                left: getLaneX(playerLane) - rs(42),
                bottom: playerBottom - rs(5),
              },
            ]}
          />

          {/* Player */}
          <Image
            source={selectedRunner.image}
            style={[
              styles.playerImage,
              {
                width: playerSize,
                height: playerSize,
                left: playerX,
                bottom: playerBottom,
                transform: [
                  { scale: isSliding ? 0.82 : 1 },
                  { translateY: isJumping ? -rs(55) : 0 },
                ],
              },
            ]}
          />

          {/* Active power-up indicators */}
          <View style={styles.powerStatusRow}>
            {shieldActive && <PowerStatus image={SHIELD} text="Shield" color="#087BE8" />}
            {magnetActive && <PowerStatus image={MAGNET} text="Magnet" color="#D93C28" />}
            {boostActive && <PowerStatus image={BOOST} text="Boost" color="#F59E0B" />}
          </View>

          {/* Message toast */}
          {!!message && (
            <View style={styles.gameMessageBox}>
              <Text style={styles.gameMessageText}>{message}</Text>
            </View>
          )}

          {/* Pause overlay */}
          {isPaused && (
            <View style={styles.pauseOverlay}>
              <Text style={styles.pauseTitle}>PAUSED</Text>
              <TouchableOpacity
                style={styles.pauseResumeBtn}
                activeOpacity={0.9}
                onPress={() => {
                  setIsPaused(false);
                  pausedRef.current = false;
                }}
              >
                <Text style={styles.pauseResumeText}>RESUME</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.pauseHomeBtn}
                activeOpacity={0.9}
                onPress={() => {
                  runningRef.current = false;
                  setIsRunning(false);
                  setIsPaused(false);
                  pausedRef.current = false;
                  setScreen("home");
                }}
              >
                <Text style={styles.pauseHomeText}>HOME</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Controls */}
          <View style={styles.controlsArea}>
            <View style={styles.controlPad}>
              <TouchableOpacity style={styles.controlUp} onPress={jump}>
                <Ionicons name="arrow-up" size={rs(30)} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={styles.controlMiddleRow}>
                <TouchableOpacity style={styles.controlSide} onPress={moveLeft}>
                  <Ionicons name="arrow-back" size={rs(30)} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.controlCenter} onPress={slide}>
                  <Ionicons name="arrow-down" size={rs(28)} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.controlSide} onPress={moveRight}>
                  <Ionicons name="arrow-forward" size={rs(30)} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.swipeHintBox}>
              <Text style={styles.swipeHintText}>SWIPE OR TAP BUTTONS</Text>
              <Text style={styles.swipeHintSub}>Jump • Slide • Change lanes</Text>
            </View>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  };

  const GameOverScreen = () => (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#051326" />
      <ImageBackground source={BG_HOME} style={styles.bg} imageStyle={styles.bgImage}>
        <View style={styles.darkOverlay} />
        <HeaderBar onBack={() => setScreen("home")} />

        <View style={styles.resultContent}>
          <Image source={GAME_OVER_BOARD} style={styles.boardImage} />

          <View style={styles.boardTextLayer}>
            <Text style={styles.gameOverTitle}>GAME OVER</Text>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Distance</Text>
              <Text style={styles.statValue}>{distance}m</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Coins</Text>
              <Text style={styles.statValue}>{runCoins}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Score</Text>
              <Text style={styles.statValue}>{score}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Best</Text>
              <Text style={styles.statValue}>{bestDistance}m</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.bigGreenButton} activeOpacity={0.9} onPress={startRun}>
            <Text style={styles.bigGreenButtonText}>TRY AGAIN</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.blueButton}
            activeOpacity={0.9}
            onPress={() => setScreen("home")}
          >
            <Text style={styles.blueButtonText}>HOME</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );

  const RewardScreen = () => {
    const rewardCoins = 100 + level * 20;
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" backgroundColor="#051326" />
        <ImageBackground source={BG_HOME} style={styles.bg} imageStyle={styles.bgImage}>
          <View style={styles.darkOverlay} />
          <HeaderBar onBack={() => setScreen("home")} />

          <View style={styles.resultContent}>
            <Image source={REWARD_BOARD} style={styles.rewardBoardImage} />

            <View style={styles.rewardTextLayer}>
              <Text style={styles.levelCompleteTitle}>LEVEL COMPLETE!</Text>
              <Text style={styles.rewardSubTitle}>You earned</Text>
              <View style={styles.rewardRow}>
                <View style={styles.rewardItem}>
                  <Image source={COIN} style={styles.rewardIcon} />
                  <Text style={styles.rewardValue}>+{rewardCoins}</Text>
                </View>
                <View style={styles.rewardItem}>
                  <Text style={styles.rewardStar}>★</Text>
                  <Text style={styles.rewardValue}>+3</Text>
                </View>
              </View>
              <Text style={styles.rewardSmallText}>
                Great job! Continue your jungle adventure.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.bigGreenButton}
              activeOpacity={0.9}
              onPress={() => {
                setLevel((old) => old + 1);
                setScreen("home");
              }}
            >
              <Text style={styles.bigGreenButtonText}>NEXT LEVEL</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.blueButton} activeOpacity={0.9} onPress={startRun}>
              <Text style={styles.blueButtonText}>PLAY AGAIN</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  };

  // ── router ────────────────────────────────────────────────────────────────
  if (screen === "runner") return <RunnerSelectScreen />;
  if (screen === "game") return <GameScreen />;
  if (screen === "gameOver") return <GameOverScreen />;
  if (screen === "reward") return <RewardScreen />;
  return <HomeScreen />;
}

// ── styles ────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#04182E",
  },
  bg: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  bgImage: {
    resizeMode: "cover",
  },
  darkTopOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 20, 40, 0.18)",
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(2, 12, 28, 0.72)",
  },
  gameTopGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.06)",
  },
  header: {
    marginTop: Platform.OS === "android" ? rs(12) : rs(5),
    paddingHorizontal: rs(9),
    minHeight: rs(48),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 20,
  },
  headerSquare: {
    width: isTiny ? rs(40) : rs(46),
    height: isTiny ? rs(40) : rs(46),
    borderRadius: rs(12),
    backgroundColor: "#087BE8",
    borderWidth: 2,
    borderColor: "#03569F",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  headerSquarePlaceholder: {
    width: isTiny ? rs(40) : rs(46),
    height: isTiny ? rs(40) : rs(46),
  },
  soundSquare: {
    width: isTiny ? rs(40) : rs(46),
    height: isTiny ? rs(40) : rs(46),
    borderRadius: rs(12),
    backgroundColor: "#087BE8",
    borderWidth: 2,
    borderColor: "#03569F",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  headerPill: {
    height: isTiny ? rs(38) : rs(42),
    width: isTiny ? rs(96) : rs(108),
    borderRadius: rs(20),
    backgroundColor: "#071B42",
    borderWidth: 2,
    borderColor: "#087BE8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  headerIcon: {
    width: rs(25),
    height: rs(25),
    resizeMode: "contain",
    marginRight: rs(5),
  },
  headerText: {
    color: "#FFFFFF",
    fontSize: fs(16),
    fontWeight: "900",
  },
  plusCircle: {
    width: rs(20),
    height: rs(20),
    borderRadius: rs(10),
    backgroundColor: "#5FCB22",
    borderWidth: 1.5,
    borderColor: "#1F830D",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: rs(5),
  },
  homeContent: {
    flex: 1,
    paddingHorizontal: rs(16),
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: rs(18),
  },
  homeLogo: {
    position: "absolute",
    top: isShort ? rs(75) : rs(95),
    width: width * 0.88,
    height: isShort ? rs(145) : rs(170),
    resizeMode: "contain",
  },
  levelHomeBadge: {
    position: "absolute",
    top: isShort ? rs(210) : rs(255),
    minWidth: rs(110),
    height: rs(34),
    borderRadius: rs(17),
    backgroundColor: "#7D3DCC",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  levelHomeText: {
    color: "#FFFFFF",
    fontSize: fs(16),
    fontWeight: "900",
  },
  runnerPreviewCard: {
    width: "100%",
    minHeight: rs(105),
    borderRadius: rs(18),
    backgroundColor: "rgba(255, 248, 221, 0.94)",
    borderWidth: 2,
    borderColor: "#F0B032",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: rs(12),
    marginBottom: rs(10),
  },
  previewRunner: {
    width: rs(82),
    height: rs(82),
    resizeMode: "contain",
  },
  previewTextBox: {
    flex: 1,
    marginLeft: rs(10),
  },
  previewTitle: {
    color: "#5A2708",
    fontSize: fs(21),
    fontWeight: "900",
  },
  previewSub: {
    color: "#7A4A1F",
    fontSize: fs(12),
    fontWeight: "800",
    marginTop: rs(2),
  },
  changeRunnerBtn: {
    height: rs(36),
    borderRadius: rs(12),
    backgroundColor: "#087BE8",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: rs(10),
  },
  changeRunnerText: {
    color: "#FFFFFF",
    fontSize: fs(11),
    fontWeight: "900",
  },
  homeMissionCard: {
    width: "100%",
    minHeight: rs(105),
    borderRadius: rs(18),
    backgroundColor: "rgba(255, 248, 221, 0.94)",
    borderWidth: 2,
    borderColor: "#F0B032",
    padding: rs(11),
    marginBottom: rs(12),
  },
  missionHeaderText: {
    alignSelf: "center",
    color: "#FFFFFF",
    fontSize: fs(15),
    fontWeight: "900",
    backgroundColor: "#0A70D8",
    paddingHorizontal: rs(22),
    paddingVertical: rs(4),
    borderRadius: rs(12),
    marginBottom: rs(8),
    overflow: "hidden",
  },
  missionLine: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: rs(3),
  },
  missionIcon: {
    width: rs(24),
    height: rs(24),
    resizeMode: "contain",
    marginRight: rs(10),
  },
  missionText: {
    color: "#34210E",
    fontSize: fs(14),
    fontWeight: "900",
  },
  bigGreenButton: {
    width: "100%",
    minHeight: isTiny ? rs(58) : rs(66),
    borderRadius: rs(21),
    backgroundColor: "#5ECE1B",
    borderWidth: 3,
    borderColor: "#D9FF75",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: rs(12),
    elevation: 7,
  },
  bigGreenButtonText: {
    color: "#FFFFFF",
    fontSize: isTiny ? fs(25) : fs(30),
    fontWeight: "900",
    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 2,
  },
  blueButton: {
    width: "100%",
    minHeight: rs(55),
    borderRadius: rs(17),
    backgroundColor: "#087BE8",
    borderWidth: 2,
    borderColor: "#075FB2",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  blueButtonText: {
    color: "#FFFFFF",
    fontSize: fs(22),
    fontWeight: "900",
  },
  homeBottomRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  smallMenuBtn: {
    width: "31%",
    minHeight: rs(70),
    borderRadius: rs(16),
    backgroundColor: "#143B8D",
    borderWidth: 2,
    borderColor: "#45A3FF",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: rs(5),
  },
  smallMenuImage: {
    width: rs(32),
    height: rs(32),
    resizeMode: "contain",
  },
  smallMenuText: {
    color: "#FFFFFF",
    fontSize: fs(11),
    fontWeight: "900",
    marginTop: rs(3),
  },
  runnerContent: {
    flex: 1,
    paddingHorizontal: rs(12),
    alignItems: "center",
    paddingBottom: rs(18),
  },
  runnerLogo: {
    width: width * 0.86,
    height: isShort ? rs(120) : rs(150),
    resizeMode: "contain",
    marginTop: rs(12),
  },
  chooseBoard: {
    width: "94%",
    minHeight: rs(44),
    borderRadius: rs(12),
    backgroundColor: "#6B3F1F",
    borderWidth: 2,
    borderColor: "#B98442",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: rs(12),
  },
  chooseText: {
    color: "#FFFFFF",
    fontSize: fs(19),
    fontWeight: "900",
  },
  runnerGrid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: rs(10),
  },
  runnerCard: {
    width: "48.5%",
    minHeight: isShort ? rs(185) : rs(215),
    borderRadius: rs(16),
    backgroundColor: "#FFFFFF",
    borderWidth: 3,
    marginBottom: rs(10),
    overflow: "hidden",
  },
  runnerCardActive: {
    transform: [{ scale: 1.02 }],
  },
  runnerCardTop: {
    height: isShort ? rs(125) : rs(150),
    alignItems: "center",
    justifyContent: "center",
  },
  runnerCardImage: {
    width: isShort ? rs(115) : rs(138),
    height: isShort ? rs(115) : rs(138),
    resizeMode: "contain",
  },
  runnerName: {
    color: "#14213D",
    fontSize: fs(17),
    fontWeight: "900",
    textAlign: "center",
    marginTop: rs(4),
  },
  runnerSkill: {
    color: "#5B6472",
    fontSize: fs(10),
    fontWeight: "800",
    textAlign: "center",
    marginTop: rs(2),
  },
  selectedBadge: {
    position: "absolute",
    right: rs(7),
    top: rs(7),
    width: rs(25),
    height: rs(25),
    borderRadius: rs(13),
    backgroundColor: "#20B746",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  gameHeader: {
    marginTop: Platform.OS === "android" ? rs(12) : rs(5),
    paddingHorizontal: rs(9),
    minHeight: rs(44),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 20,
  },
  gameMiniPill: {
    height: rs(38),
    minWidth: rs(80),
    borderRadius: rs(19),
    backgroundColor: "#071B42",
    borderWidth: 2,
    borderColor: "#087BE8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: rs(8),
  },
  gameMiniIcon: {
    width: rs(24),
    height: rs(24),
    resizeMode: "contain",
    marginRight: rs(5),
  },
  gameMiniText: {
    color: "#FFFFFF",
    fontSize: fs(15),
    fontWeight: "900",
  },
  scorePill: {
    height: rs(38),
    minWidth: rs(96),
    borderRadius: rs(19),
    backgroundColor: "rgba(0,0,0,0.58)",
    borderWidth: 2,
    borderColor: "#FFD24F",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: rs(8),
  },
  scoreText: {
    color: "#FFFFFF",
    fontSize: fs(16),
    fontWeight: "900",
  },
  pauseBtn: {
    width: rs(38),
    height: rs(38),
    borderRadius: rs(12),
    backgroundColor: "#EAA320",
    borderWidth: 2,
    borderColor: "#8F5C08",
    alignItems: "center",
    justifyContent: "center",
  },
  missionFloatingBox: {
    position: "absolute",
    top: Platform.OS === "android" ? rs(62) : rs(55),
    left: rs(10),
    width: isTiny ? rs(170) : rs(188),
    borderRadius: rs(13),
    backgroundColor: "rgba(0,0,0,0.58)",
    borderWidth: 2,
    borderColor: "#D89925",
    padding: rs(8),
    zIndex: 18,
  },
  missionFloatingTitle: {
    alignSelf: "center",
    color: "#FFFFFF",
    fontSize: fs(12),
    fontWeight: "900",
    backgroundColor: "#087BE8",
    borderRadius: rs(8),
    paddingHorizontal: rs(12),
    paddingVertical: rs(2),
    overflow: "hidden",
    marginBottom: rs(5),
  },
  progressLine: {
    marginBottom: rs(5),
  },
  progressLabel: {
    color: "#FFFFFF",
    fontSize: fs(10),
    fontWeight: "900",
    marginBottom: rs(2),
  },
  progressTrack: {
    height: rs(9),
    borderRadius: rs(6),
    backgroundColor: "#1D1D1D",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#58D623",
  },
  progressFillBlue: {
    height: "100%",
    backgroundColor: "#1B9BFF",
  },
  progressValue: {
    color: "#FFFFFF",
    fontSize: fs(9),
    fontWeight: "900",
    marginTop: rs(1),
    textAlign: "right",
  },
  fallingObject: {
    position: "absolute",
    resizeMode: "contain",
    zIndex: 9,
  },
  playerGlow: {
    position: "absolute",
    width: rs(84),
    height: rs(24),
    borderRadius: rs(42),
    backgroundColor: "rgba(255, 211, 58, 0.35)",
    zIndex: 9,
  },
  playerImage: {
    position: "absolute",
    resizeMode: "contain",
    zIndex: 10,
  },
  powerStatusRow: {
    position: "absolute",
    right: rs(9),
    top: Platform.OS === "android" ? rs(65) : rs(58),
    zIndex: 20,
  },
  powerStatus: {
    height: rs(34),
    borderRadius: rs(17),
    borderWidth: 2,
    borderColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: rs(8),
    marginBottom: rs(6),
  },
  powerStatusIcon: {
    width: rs(22),
    height: rs(22),
    resizeMode: "contain",
    marginRight: rs(5),
  },
  powerStatusText: {
    color: "#FFFFFF",
    fontSize: fs(10),
    fontWeight: "900",
  },
  gameMessageBox: {
    position: "absolute",
    alignSelf: "center",
    bottom: isShort ? rs(150) : rs(165),
    minHeight: rs(32),
    borderRadius: rs(16),
    backgroundColor: "rgba(0,0,0,0.65)",
    borderWidth: 2,
    borderColor: "#FFD24F",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: rs(14),
    zIndex: 25,
  },
  gameMessageText: {
    color: "#FFFFFF",
    fontSize: fs(12),
    fontWeight: "900",
  },
  controlsArea: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: rs(10),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: rs(12),
    zIndex: 20,
  },
  controlPad: {
    width: isTiny ? rs(138) : rs(155),
    height: isTiny ? rs(118) : rs(130),
    alignItems: "center",
    justifyContent: "center",
  },
  controlUp: {
    width: rs(55),
    height: rs(48),
    borderRadius: rs(14),
    backgroundColor: "#0A92FF",
    borderWidth: 2,
    borderColor: "#75D0FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: rs(2),
  },
  controlMiddleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  controlSide: {
    width: rs(50),
    height: rs(50),
    borderRadius: rs(14),
    backgroundColor: "#0A92FF",
    borderWidth: 2,
    borderColor: "#75D0FF",
    alignItems: "center",
    justifyContent: "center",
  },
  controlCenter: {
    width: rs(50),
    height: rs(50),
    borderRadius: rs(12),
    backgroundColor: "#1B2D4A",
    borderWidth: 2,
    borderColor: "#4A617E",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: rs(2),
  },
  swipeHintBox: {
    flex: 1,
    marginLeft: rs(8),
    minHeight: rs(58),
    borderRadius: rs(17),
    backgroundColor: "rgba(0,0,0,0.55)",
    borderWidth: 2,
    borderColor: "#FFD24F",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: rs(8),
  },
  swipeHintText: {
    color: "#FFFFFF",
    fontSize: fs(13),
    fontWeight: "900",
  },
  swipeHintSub: {
    color: "#E9F4FF",
    fontSize: fs(9),
    fontWeight: "800",
    marginTop: rs(2),
  },
  pauseOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.72)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
  },
  pauseTitle: {
    color: "#FFFFFF",
    fontSize: fs(40),
    fontWeight: "900",
    marginBottom: rs(20),
  },
  pauseResumeBtn: {
    width: "70%",
    minHeight: rs(58),
    borderRadius: rs(18),
    backgroundColor: "#5ECE1B",
    borderWidth: 3,
    borderColor: "#D9FF75",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: rs(12),
  },
  pauseResumeText: {
    color: "#FFFFFF",
    fontSize: fs(24),
    fontWeight: "900",
  },
  pauseHomeBtn: {
    width: "70%",
    minHeight: rs(52),
    borderRadius: rs(16),
    backgroundColor: "#087BE8",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  pauseHomeText: {
    color: "#FFFFFF",
    fontSize: fs(20),
    fontWeight: "900",
  },
  resultContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: rs(18),
    paddingBottom: rs(22),
  },
  boardImage: {
    width: "100%",
    height: isShort ? rs(260) : rs(315),
    resizeMode: "contain",
  },
  rewardBoardImage: {
    width: "100%",
    height: isShort ? rs(285) : rs(340),
    resizeMode: "contain",
  },
  boardTextLayer: {
    position: "absolute",
    top: isShort ? height * 0.22 : height * 0.24,
    width: "76%",
    alignItems: "center",
  },
  rewardTextLayer: {
    position: "absolute",
    top: isShort ? height * 0.22 : height * 0.24,
    width: "76%",
    alignItems: "center",
  },
  gameOverTitle: {
    color: "#D6281F",
    fontSize: fs(34),
    fontWeight: "900",
    marginBottom: rs(10),
    textShadowColor: "#FFFFFF",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  levelCompleteTitle: {
    color: "#168D32",
    fontSize: fs(28),
    fontWeight: "900",
    marginBottom: rs(6),
  },
  rewardSubTitle: {
    color: "#7B430E",
    fontSize: fs(15),
    fontWeight: "900",
    marginBottom: rs(10),
  },
  statRow: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: rs(4),
  },
  statLabel: {
    color: "#4E2E0E",
    fontSize: fs(16),
    fontWeight: "900",
  },
  statValue: {
    color: "#0E5CBE",
    fontSize: fs(16),
    fontWeight: "900",
  },
  rewardRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: rs(8),
  },
  rewardItem: {
    alignItems: "center",
    marginHorizontal: rs(16),
  },
  rewardIcon: {
    width: rs(55),
    height: rs(55),
    resizeMode: "contain",
  },
  rewardStar: {
    color: "#FFD84D",
    fontSize: fs(52),
    fontWeight: "900",
    textShadowColor: "#A96300",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 1,
  },
  rewardValue: {
    color: "#5A2708",
    fontSize: fs(20),
    fontWeight: "900",
    marginTop: rs(2),
  },
  rewardSmallText: {
    color: "#5A2708",
    fontSize: fs(11),
    fontWeight: "900",
    textAlign: "center",
    width: "85%",
  },
});