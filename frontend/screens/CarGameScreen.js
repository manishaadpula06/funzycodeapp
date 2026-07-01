

// screens/CarGameScreen.js

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  SafeAreaView,
  Modal,
  ScrollView,
  Platform,
  PanResponder,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const LANE_COUNT = 3;

const START_SCORE = 0;
const START_RUN_COINS = 0;
const START_WALLET_COINS = 0;
const START_LIVES = 3;
const MAX_LIVES = 5;
const LIFE_PRICE = 20;

const CAR_ASSETS = {
  blue: require("../assets/images/cars/car_blue_top_clean.png"),
  yellow: require("../assets/images/cars/car_yellow_top_clean.png"),
  red: require("../assets/images/cars/car_red_top_clean.png"),
  truck: require("../assets/images/cars/car_hawler_truck_.png"),
  neon: require("../assets/images/cars/neon pulse.png"),
  shadow: require("../assets/images/cars/shadow drift.png"),
  titan: require("../assets/images/cars/titan SUV.png"),
  viper: require("../assets/images/cars/viper GT.png"),
};

const CARS = [
  {
    id: "viper",
    name: "Viper GT",
    image: CAR_ASSETS.viper,
    price: 0,
    speedBoost: 1.25,
    color: "#22D3EE",
  },
  {
    id: "blue",
    name: "Blue Racer",
    image: CAR_ASSETS.blue,
    price: 0,
    speedBoost: 1,
    color: "#38BDF8",
  },
  {
    id: "yellow",
    name: "Yellow Legend",
    image: CAR_ASSETS.yellow,
    price: 40,
    speedBoost: 1.04,
    color: "#FACC15",
  },
  {
    id: "red",
    name: "Red Top",
    image: CAR_ASSETS.red,
    price: 45,
    speedBoost: 1.06,
    color: "#EF4444",
  },
  {
    id: "shadow",
    name: "Shadow Drift",
    image: CAR_ASSETS.shadow,
    price: 50,
    speedBoost: 1.08,
    color: "#A855F7",
  },
  {
    id: "neon",
    name: "Neon Pulse",
    image: CAR_ASSETS.neon,
    price: 55,
    speedBoost: 1.1,
    color: "#06B6D4",
  },
  {
    id: "titan",
    name: "Titan SUV",
    image: CAR_ASSETS.titan,
    price: 85,
    speedBoost: 1.18,
    color: "#CBD5E1",
  },
  {
    id: "truck",
    name: "Hawler Truck",
    image: CAR_ASSETS.truck,
    price: 95,
    speedBoost: 1.2,
    color: "#F97316",
  },
];

const TRAFFIC_CARS = [
  CAR_ASSETS.yellow,
  CAR_ASSETS.red,
  CAR_ASSETS.truck,
  CAR_ASSETS.titan,
  CAR_ASSETS.shadow,
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const createId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const getRandomLane = () => Math.floor(Math.random() * LANE_COUNT);

const getRandomTrafficImage = () => {
  const index = Math.floor(Math.random() * TRAFFIC_CARS.length);
  return TRAFFIC_CARS[index];
};

const getCarById = (id) => CARS.find((car) => car.id === id) || CARS[0];

const formatNumber = (value) => {
  const num = Math.floor(Number(value) || 0);
  return num.toLocaleString("en-IN");
};

const createStartEntities = () => [
  {
    id: createId(),
    type: "coin",
    lane: 1,
    y: 80,
  },
  {
    id: createId(),
    type: "coin",
    lane: 1,
    y: 160,
  },
  {
    id: createId(),
    type: "coin",
    lane: 2,
    y: 250,
  },
  {
    id: createId(),
    type: "traffic",
    lane: 0,
    y: 300,
    image: CAR_ASSETS.titan,
  },
];

export default function CarGameScreen({ navigation }) {
  const { width, height } = useWindowDimensions();

  const isTiny = width < 350;
  const isSmall = width < 390;
  const isShort = height < 740;

  const metrics = useMemo(() => {
    const topSafe = Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;
    const horizontalPad = isTiny ? 8 : 10;
    const playerWidth = clamp(width * 0.19, 58, isSmall ? 72 : 82);
    const playerHeight = playerWidth * 1.34;
    const trafficWidth = clamp(width * 0.145, 48, isSmall ? 58 : 64);
    const trafficHeight = trafficWidth * 1.45;
    const coinSize = clamp(width * 0.09, 28, 36);

    return {
      topSafe,
      horizontalPad,
      playerWidth,
      playerHeight,
      trafficWidth,
      trafficHeight,
      coinSize,
      headerHeight: isShort ? 46 : 52,
      statHeight: isShort ? 54 : 60,
      hudHeight: isShort ? 42 : 48,
      controlsHeight: isShort ? 64 : 72,
      bottomHeight: isShort ? 42 : 48,
    };
  }, [height, isShort, isSmall, isTiny, width]);

  const frameRef = useRef(null);
  const toastTimer = useRef(null);
  const coinBumpTimer = useRef(null);

  const metricsRef = useRef(metrics);
  const stageSizeRef = useRef({ width: 0, height: 0 });

  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [garageVisible, setGarageVisible] = useState(false);
  const [gameOverVisible, setGameOverVisible] = useState(false);
  const [nightMode, setNightMode] = useState(true);
  const [toast, setToast] = useState("");
  const [coinBump, setCoinBump] = useState(false);

  const gameRef = useRef({
    status: "ready",
    score: START_SCORE,
    runCoins: START_RUN_COINS,
    walletCoins: START_WALLET_COINS,
    lives: START_LIVES,
    speed: 1,
    lane: 1,
    entities: [],
    lastTs: 0,
    obstacleTimer: 0,
    coinTimer: 0,
    dashOffset: 0,
    lastEarned: 0,
    bestScore: 0,
    selectedCarId: "viper",
    ownedCarIds: ["viper", "blue"],
  });

  const [snapshot, setSnapshot] = useState({
    ...gameRef.current,
    entities: [...gameRef.current.entities],
    ownedCarIds: [...gameRef.current.ownedCarIds],
  });

  metricsRef.current = metrics;

  const selectedCar = getCarById(snapshot.selectedCarId);

  const publish = () => {
    const game = gameRef.current;

    setSnapshot({
      ...game,
      entities: [...game.entities],
      ownedCarIds: [...game.ownedCarIds],
    });
  };

  const showToast = (message) => {
    setToast(message);

    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }

    toastTimer.current = setTimeout(() => {
      setToast("");
    }, 1200);
  };

  const pulseCoins = () => {
    setCoinBump(true);

    if (coinBumpTimer.current) {
      clearTimeout(coinBumpTimer.current);
    }

    coinBumpTimer.current = setTimeout(() => {
      setCoinBump(false);
    }, 160);
  };

  const getRoadWidth = () => {
    const stageWidth = stageSizeRef.current.width || width;
    return Math.min(stageWidth * (isTiny ? 0.9 : 0.84), 430);
  };

  const getRoadLeft = () => {
    const stageWidth = stageSizeRef.current.width || width;
    const roadWidth = getRoadWidth();
    return (stageWidth - roadWidth) / 2;
  };

  const getLaneX = (lane) => {
    const roadWidth = getRoadWidth();
    const padding = roadWidth * 0.18;
    const usableWidth = roadWidth - padding * 2;
    const step = usableWidth / (LANE_COUNT - 1);

    return padding + step * lane;
  };

  const getPlayerY = () => {
    const stageHeight = stageSizeRef.current.height || 420;
    const { playerHeight } = metricsRef.current;
    return stageHeight - playerHeight / 2 - (isShort ? 12 : 18);
  };

  const getSpeedKmh = () => Math.floor(snapshot.speed * 96);

  const handleBack = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
      return;
    }

    navigation?.navigate?.("FunGames");
  };

  const moveLane = (direction) => {
    const game = gameRef.current;
    game.lane = clamp(game.lane + direction, 0, LANE_COUNT - 1);
    publish();
  };

  const resetRun = () => {
    const game = gameRef.current;

    game.status = "ready";
    game.score = 0;
    game.runCoins = 0;
    game.lives = START_LIVES;
    game.speed = 1;
    game.lane = 1;
    game.entities = [];
    game.lastTs = 0;
    game.obstacleTimer = 0;
    game.coinTimer = 0;
    game.dashOffset = 0;
    game.lastEarned = 0;

    setGameOverVisible(false);
    publish();
  };

  const startGame = () => {
    const game = gameRef.current;

    if (game.status === "over") {
      resetRun();
    }

    game.status = "running";
    game.lastTs = 0;

    if (game.entities.length === 0) {
      game.entities = createStartEntities();
    }

    setGameOverVisible(false);
    publish();
  };

  const pauseGame = () => {
    const game = gameRef.current;

    if (game.status === "running") {
      game.status = "paused";
      publish();
      return;
    }

    if (game.status === "paused" || game.status === "ready") {
      startGame();
    }
  };

  const endGame = () => {
    const game = gameRef.current;

    if (game.status === "over") return;

    game.status = "over";
    game.lastEarned = game.runCoins;
    game.bestScore = Math.max(game.bestScore, Math.floor(game.score));
    game.entities = [];
    game.lastTs = 0;

    setGameOverVisible(true);
    publish();
  };

  const buyLife = () => {
    const game = gameRef.current;

    if (game.lives >= MAX_LIVES) {
      showToast("Lives are already full");
      return;
    }

    if (game.walletCoins < LIFE_PRICE) {
      showToast(`Need ${LIFE_PRICE} coins`);
      return;
    }

    game.walletCoins -= LIFE_PRICE;
    game.lives += 1;

    showToast("+1 life added");
    publish();
  };

  const continueGame = () => {
    const game = gameRef.current;

    if (game.walletCoins < LIFE_PRICE) {
      showToast(`Need ${LIFE_PRICE} coins to continue`);
      return;
    }

    game.walletCoins -= LIFE_PRICE;
    game.lives = 1;
    game.status = "running";
    game.speed = Math.max(1, game.speed - 0.25);
    game.entities = createStartEntities();
    game.obstacleTimer = 0;
    game.coinTimer = 0;
    game.lastTs = 0;

    setGameOverVisible(false);
    showToast("Continued with 1 life");
    publish();
  };

  const handleCarPress = (car) => {
    const game = gameRef.current;
    const owned = game.ownedCarIds.includes(car.id);
    const selected = game.selectedCarId === car.id;

    if (selected) {
      showToast(`${car.name} already selected`);
      return;
    }

    if (owned) {
      game.selectedCarId = car.id;
      showToast(`${car.name} selected`);
      publish();
      return;
    }

    if (game.walletCoins < car.price) {
      showToast(`Need ${car.price} coins`);
      return;
    }

    game.walletCoins -= car.price;
    game.ownedCarIds = [...game.ownedCarIds, car.id];
    game.selectedCarId = car.id;

    showToast(`${car.name} unlocked`);
    publish();
  };

  const spawnTraffic = () => {
    const game = gameRef.current;

    game.entities.push({
      id: createId(),
      type: "traffic",
      lane: getRandomLane(),
      y: -90,
      image: getRandomTrafficImage(),
    });
  };

  const spawnCoin = () => {
    const game = gameRef.current;

    game.entities.push({
      id: createId(),
      type: "coin",
      lane: getRandomLane(),
      y: -50,
    });
  };

  useEffect(() => {
    const loop = (timestamp) => {
      const game = gameRef.current;

      if (game.status === "running" && stageSizeRef.current.height > 0) {
        if (!game.lastTs) {
          game.lastTs = timestamp;
        }

        const delta = Math.min(0.034, (timestamp - game.lastTs) / 1000);
        game.lastTs = timestamp;

        const car = getCarById(game.selectedCarId);
        const boost = car.speedBoost || 1;
        const playerY = getPlayerY();

        game.speed = Math.min(3.5, game.speed + delta * 0.024);
        game.score += delta * 24 * game.speed * boost;
        game.dashOffset += delta * 230 * game.speed;

        game.obstacleTimer += delta * 1000;
        game.coinTimer += delta * 1000;

        const trafficEvery = Math.max(620, 1320 - game.speed * 170);
        const coinEvery = Math.max(480, 950 - game.speed * 105);

        if (game.obstacleTimer >= trafficEvery) {
          game.obstacleTimer = 0;
          spawnTraffic();
        }

        if (game.coinTimer >= coinEvery) {
          game.coinTimer = 0;

          if (Math.random() < 0.9) {
            spawnCoin();
          }
        }

        const fallSpeed = (225 + game.speed * 108) * boost;
        const nextEntities = [];
        const { coinSize, trafficHeight } = metricsRef.current;

        for (const entity of game.entities) {
          const movedEntity = {
            ...entity,
            y: entity.y + fallSpeed * delta,
          };

          const sameLane = movedEntity.lane === game.lane;
          const distance = Math.abs(movedEntity.y - playerY);

          if (sameLane && movedEntity.type === "coin" && distance < coinSize + 20) {
            game.runCoins += 1;
            game.walletCoins += 1;
            game.score += 35;
            pulseCoins();
            continue;
          }

          if (
            sameLane &&
            movedEntity.type === "traffic" &&
            distance < trafficHeight * 0.54
          ) {
            game.lives -= 1;
            game.score = Math.max(0, game.score - 60);

            if (game.lives <= 0) {
              endGame();
              break;
            }

            showToast("Car hit! -1 life");
            continue;
          }

          if (movedEntity.y < stageSizeRef.current.height + 120) {
            nextEntities.push(movedEntity);
          } else if (movedEntity.type === "traffic") {
            game.score += 12;
          }
        }

        if (game.status === "running") {
          game.entities = nextEntities;
          publish();
        }
      }

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web" || typeof window === "undefined") return;

    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") moveLane(-1);
      if (event.key === "ArrowRight") moveLane(1);
      if (event.key === "Enter") startGame();
      if (event.key?.toLowerCase?.() === "p") pauseGame();
      if (event.key?.toLowerCase?.() === "g") setGarageVisible(true);
      if (event.key?.toLowerCase?.() === "r") resetRun();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }

      if (coinBumpTimer.current) {
        clearTimeout(coinBumpTimer.current);
      }
    };
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => {
        return (
          Math.abs(gesture.dx) > 16 &&
          Math.abs(gesture.dx) > Math.abs(gesture.dy)
        );
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 26) {
          moveLane(1);
        } else if (gesture.dx < -26) {
          moveLane(-1);
        }
      },
    })
  ).current;

  const renderHeader = () => {
    return (
      <View style={[styles.headerOuter, { height: metrics.headerHeight }]}>
        <LinearGradient
          colors={["rgba(18,32,77,0.98)", "rgba(5,10,31,0.98)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <TouchableOpacity
            activeOpacity={0.85}
            style={[
              styles.headerRoundButton,
              {
                width: isTiny ? 36 : 40,
                height: isTiny ? 36 : 40,
                borderRadius: isTiny ? 18 : 20,
              },
            ]}
            onPress={handleBack}
          >
            <Ionicons name="chevron-back" size={isTiny ? 22 : 25} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.headerTitleBox}>
            <Text style={[styles.headerTitle, { fontSize: isTiny ? 16 : 18 }]}>
              Pro Car Rush
            </Text>
            <Text style={styles.headerSubTitle}>Press start • collect coins</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            style={[
              styles.headerRoundButtonPurple,
              {
                width: isTiny ? 36 : 40,
                height: isTiny ? 36 : 40,
                borderRadius: isTiny ? 18 : 20,
              },
            ]}
            onPress={() => setNightMode((prev) => !prev)}
          >
            <Ionicons
              name={nightMode ? "moon" : "sunny"}
              size={isTiny ? 18 : 20}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  };

  const renderStatCard = ({
    icon,
    iconColor,
    title,
    value,
    sub,
    plus,
    heart,
    active,
  }) => {
    return (
      <LinearGradient
        colors={["rgba(12,26,61,0.97)", "rgba(3,8,27,0.97)"]}
        style={[
          styles.statCard,
          {
            height: metrics.statHeight,
            transform: active ? [{ scale: 1.04 }] : [{ scale: 1 }],
          },
        ]}
      >
        <View style={styles.statTitleRow}>
          {heart ? (
            <Text style={styles.statHeartIcon}>♥</Text>
          ) : (
            <Ionicons name={icon} size={isTiny ? 13 : 15} color={iconColor} />
          )}

          <Text numberOfLines={1} style={styles.statTitle}>
            {title}
          </Text>
        </View>

        {heart ? (
          <View style={styles.heartRowBig}>
            {Array.from({ length: MAX_LIVES }).map((_, index) => (
              <Text
                key={index}
                style={[
                  styles.heartBig,
                  index >= snapshot.lives && styles.heartEmpty,
                ]}
              >
                ♥
              </Text>
            ))}
          </View>
        ) : (
          <Text numberOfLines={1} adjustsFontSizeToFit style={styles.statValue}>
            {value}
          </Text>
        )}

        {!!sub && (
          <Text numberOfLines={1} style={styles.statSub}>
            {sub}
          </Text>
        )}

        {plus && (
          <TouchableOpacity activeOpacity={0.85} style={styles.statPlus} onPress={plus}>
            <Ionicons name="add" size={13} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </LinearGradient>
    );
  };

  const renderStats = () => {
    return (
      <View style={styles.statsRow}>
        {renderStatCard({
          icon: "trophy",
          iconColor: "#22D3EE",
          title: "SCORE",
          value: formatNumber(snapshot.score),
          sub: `BEST ${formatNumber(snapshot.bestScore)}`,
        })}

        {renderStatCard({
          icon: "logo-bitcoin",
          iconColor: "#FACC15",
          title: "RUN",
          value: formatNumber(snapshot.runCoins),
          sub: snapshot.status === "running" ? "+1 coin" : "",
          active: coinBump,
        })}

        {renderStatCard({
          icon: "wallet",
          iconColor: "#22C55E",
          title: "WALLET",
          value: formatNumber(snapshot.walletCoins),
          plus: () => setGarageVisible(true),
          active: coinBump,
        })}

        {renderStatCard({
          title: "LIVES",
          heart: true,
          plus: buyLife,
        })}
      </View>
    );
  };

  const renderHud = () => {
    const statusText =
      snapshot.status === "running"
        ? "RUN"
        : snapshot.status === "paused"
        ? "PAUSE"
        : snapshot.status === "over"
        ? "OVER"
        : "READY";

    const statusColor =
      snapshot.status === "running"
        ? "#4ADE80"
        : snapshot.status === "paused"
        ? "#FACC15"
        : snapshot.status === "over"
        ? "#EF4444"
        : "#60A5FA";

    return (
      <View style={[styles.hudGlass, { height: metrics.hudHeight }]}>
        <View style={styles.hudPill}>
          <Text style={styles.hudLabel}>STATUS</Text>
          <Text style={[styles.hudValue, { color: statusColor }]}>{statusText}</Text>
        </View>

        <View style={styles.hudPill}>
          <Ionicons name="speedometer" size={isTiny ? 15 : 17} color="#67E8F9" />
          <Text style={styles.hudValue}>
            {getSpeedKmh()} <Text style={styles.kmhText}>KM/H</Text>
          </Text>
        </View>

        <View style={styles.hudPill}>
          <Text style={styles.hudLabel}>LANE</Text>
          <Text style={styles.hudValue}>{snapshot.lane + 1}/3</Text>
        </View>
      </View>
    );
  };

  const renderCityLights = () => {
    return (
      <>
        <View style={[styles.neonBuilding, styles.buildingLeftOne]} />
        <View style={[styles.neonBuilding, styles.buildingLeftTwo]} />
        <View style={[styles.neonBuilding, styles.buildingRightOne]} />
        <View style={[styles.neonBuilding, styles.buildingRightTwo]} />

        <View style={styles.leftSign}>
          <Text style={styles.signText}>NEON</Text>
        </View>

        <View style={styles.rightSign}>
          <Text style={styles.signTextBlue}>FAST</Text>
        </View>
      </>
    );
  };

  const renderRoadDashes = () => {
    const dashOffset = snapshot.dashOffset % 74;
    const dashes = Array.from({ length: 11 });

    return (
      <>
        {[0.333, 0.666].map((leftRatio) => (
          <View
            key={leftRatio}
            style={[styles.dashColumn, { left: `${leftRatio * 100}%` }]}
          >
            {dashes.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dash,
                  {
                    top: index * 74 + dashOffset - 80,
                  },
                ]}
              />
            ))}
          </View>
        ))}
      </>
    );
  };

  const renderCoin = (entity) => {
    const x = getLaneX(entity.lane);
    const { coinSize } = metrics;

    return (
      <View
        key={entity.id}
        style={[
          styles.coin,
          {
            width: coinSize,
            height: coinSize,
            borderRadius: coinSize / 2,
            left: x - coinSize / 2,
            top: entity.y - coinSize / 2,
            transform: [{ scale: 1 + Math.min(0.25, Math.max(0, entity.y / 1400)) }],
          },
        ]}
      >
        <LinearGradient
          colors={["#FFF7AD", "#FACC15", "#D97706"]}
          style={[
            styles.coinGradient,
            {
              borderRadius: coinSize / 2,
            },
          ]}
        >
          <Text style={[styles.coinText, { fontSize: isTiny ? 13 : 15 }]}>₹</Text>
        </LinearGradient>
      </View>
    );
  };

  const renderTraffic = (entity) => {
    const x = getLaneX(entity.lane);
    const { trafficWidth, trafficHeight } = metrics;

    return (
      <Image
        key={entity.id}
        source={entity.image}
        resizeMode="contain"
        style={[
          styles.trafficCar,
          {
            width: trafficWidth,
            height: trafficHeight,
            left: x - trafficWidth / 2,
            top: entity.y - trafficHeight / 2,
          },
        ]}
      />
    );
  };

  const renderEntity = (entity) => {
    if (entity.type === "coin") {
      return renderCoin(entity);
    }

    return renderTraffic(entity);
  };

  const renderReadyOverlay = () => {
    if (snapshot.status === "running") return null;

    return (
      <View pointerEvents="none" style={styles.readyOverlay}>
        <LinearGradient
          colors={["rgba(15,23,42,0.86)", "rgba(2,6,23,0.86)"]}
          style={styles.readyCard}
        >
          <Ionicons
            name={
              snapshot.status === "paused"
                ? "pause-circle"
                : snapshot.status === "over"
                ? "warning"
                : "flag"
            }
            size={isTiny ? 28 : 34}
            color="#FACC15"
          />
          <Text style={styles.readyTitle}>
            {snapshot.status === "paused"
              ? "Paused"
              : snapshot.status === "over"
              ? "Game Over"
              : "Ready"}
          </Text>
          <Text style={styles.readySub}>Coins come only after START</Text>
        </LinearGradient>
      </View>
    );
  };

  const renderStage = () => {
    return (
      <View
        style={styles.stage}
        {...panResponder.panHandlers}
        onLayout={(event) => {
          const nextSize = {
            width: event.nativeEvent.layout.width,
            height: event.nativeEvent.layout.height,
          };

          stageSizeRef.current = nextSize;
          setStageSize(nextSize);
        }}
      >
        <LinearGradient
          colors={
            nightMode
              ? ["#030014", "#050B22", "#020617"]
              : ["#082F49", "#0F172A", "#020617"]
          }
          style={styles.stageBackground}
        >
          {renderCityLights()}

          <LinearGradient
            colors={["rgba(22,163,74,0.10)", "rgba(3,18,8,0.76)"]}
            style={styles.grassLeft}
          />

          <LinearGradient
            colors={["rgba(22,163,74,0.10)", "rgba(3,18,8,0.76)"]}
            style={styles.grassRight}
          />

          <View
            style={[
              styles.road,
              {
                width: getRoadWidth(),
                left: getRoadLeft(),
              },
            ]}
          >
            <LinearGradient
              colors={["#1E293B", "#111827", "#030712"]}
              style={styles.roadSurface}
            >
              <View style={styles.roadSideGlowLeft} />
              <View style={styles.roadSideGlowRight} />

              {renderRoadDashes()}

              {stageSize.width > 0 &&
                snapshot.entities.map((entity) => renderEntity(entity))}

              {stageSize.width > 0 && (
                <Image
                  source={selectedCar.image}
                  resizeMode="contain"
                  style={[
                    styles.playerCar,
                    {
                      width: metrics.playerWidth,
                      height: metrics.playerHeight,
                      left: getLaneX(snapshot.lane) - metrics.playerWidth / 2,
                      top: getPlayerY() - metrics.playerHeight / 2,
                    },
                  ]}
                />
              )}
            </LinearGradient>
          </View>

          {renderReadyOverlay()}
        </LinearGradient>
      </View>
    );
  };

  const renderControls = () => {
    const centerLabel =
      snapshot.status === "running"
        ? "PAUSE"
        : snapshot.status === "paused"
        ? "RESUME"
        : "START";

    const centerIcon =
      snapshot.status === "running"
        ? "pause"
        : snapshot.status === "paused"
        ? "play"
        : "play";

    const sideSize = isTiny ? 48 : 54;
    const centerSize = isTiny ? 62 : 68;

    return (
      <View style={[styles.controlDock, { height: metrics.controlsHeight }]}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={[
            styles.sideControl,
            {
              width: sideSize,
              height: sideSize,
              borderRadius: sideSize / 2,
            },
          ]}
          onPress={() => moveLane(-1)}
        >
          <Ionicons name="chevron-back" size={isTiny ? 24 : 28} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.9}
          style={[
            styles.centerControlOuter,
            {
              width: centerSize,
              height: centerSize,
              borderRadius: centerSize / 2,
            },
          ]}
          onPress={snapshot.status === "running" ? pauseGame : startGame}
        >
          <LinearGradient
            colors={["#7C3AED", "#312E81", "#06B6D4"]}
            style={[
              styles.centerControl,
              {
                width: centerSize - 8,
                height: centerSize - 8,
                borderRadius: (centerSize - 8) / 2,
              },
            ]}
          >
            <Ionicons name={centerIcon} size={isTiny ? 24 : 27} color="#FFFFFF" />
            <Text style={styles.centerControlText}>{centerLabel}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          style={[
            styles.sideControl,
            {
              width: sideSize,
              height: sideSize,
              borderRadius: sideSize / 2,
            },
          ]}
          onPress={() => moveLane(1)}
        >
          <Ionicons name="chevron-forward" size={isTiny ? 24 : 28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderBottomActions = () => {
    return (
      <View style={[styles.bottomActions, { height: metrics.bottomHeight }]}>
        <TouchableOpacity
          activeOpacity={0.86}
          style={styles.bottomButton}
          onPress={() => setGarageVisible(true)}
        >
          <Ionicons name="car-sport" size={isTiny ? 15 : 17} color="#7DD3FC" />
          <Text style={styles.bottomButtonText}>GARAGE</Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.86} style={styles.bottomButtonLife} onPress={buyLife}>
          <Text style={styles.bottomHeart}>♥</Text>
          <Text style={styles.bottomButtonText}>LIFE {LIFE_PRICE}</Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.86} style={styles.bottomButton} onPress={resetRun}>
          <Ionicons name="refresh" size={isTiny ? 16 : 18} color="#7DD3FC" />
          <Text style={styles.bottomButtonText}>RESET</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderGarageCard = (car) => {
    const owned = snapshot.ownedCarIds.includes(car.id);
    const selected = snapshot.selectedCarId === car.id;
    const canBuy = snapshot.walletCoins >= car.price;

    let buttonText = "SELECT";

    if (selected) {
      buttonText = "SELECTED";
    } else if (!owned) {
      buttonText = canBuy ? `BUY ${car.price}` : `NEED ${car.price}`;
    }

    return (
      <View key={car.id} style={styles.garageCard}>
        <View style={[styles.garageImageBox, { borderColor: car.color }]}>
          <Image source={car.image} style={styles.garageCarImage} resizeMode="contain" />
        </View>

        <View style={styles.garageInfo}>
          <Text numberOfLines={1} style={styles.garageCarName}>
            {car.name}
          </Text>

          <Text style={styles.garageCarMeta}>Speed {car.speedBoost.toFixed(2)}x</Text>

          <View style={styles.garageBadgeRow}>
            {car.price === 0 && (
              <View style={styles.freeBadge}>
                <Text style={styles.freeBadgeText}>FREE</Text>
              </View>
            )}

            {owned && (
              <View style={styles.ownedBadge}>
                <Text style={styles.ownedBadgeText}>OWNED</Text>
              </View>
            )}

            {!owned && car.price > 0 && (
              <View style={styles.priceBadge}>
                <Ionicons name="logo-bitcoin" size={11} color="#FACC15" />
                <Text style={styles.priceBadgeText}>{car.price}</Text>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.86}
          onPress={() => handleCarPress(car)}
          style={[
            styles.garageButton,
            selected && styles.garageButtonSelected,
            !owned && !canBuy && styles.garageButtonDisabled,
          ]}
        >
          <Text
            style={[
              styles.garageButtonText,
              selected && styles.garageButtonSelectedText,
            ]}
          >
            {buttonText}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderGarageModal = () => {
    return (
      <Modal visible={garageVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.garageSheet, { maxHeight: height * 0.9 }]}>
            <View style={styles.sheetHeader}>
              <View>
                <Text style={styles.sheetTitle}>Garage Shop</Text>
                <Text style={styles.sheetSub}>
                  Wallet Coins: {formatNumber(snapshot.walletCoins)}
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.sheetClose}
                onPress={() => setGarageVisible(false)}
              >
                <Ionicons name="close" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.garageList}
            >
              {CARS.map(renderGarageCard)}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const renderGameOverModal = () => {
    return (
      <Modal visible={gameOverVisible} transparent animationType="fade">
        <View style={styles.modalOverlayCenter}>
          <LinearGradient
            colors={["rgba(15,23,42,0.98)", "rgba(2,6,23,0.98)"]}
            style={styles.gameOverCard}
          >
            <Ionicons name="warning" size={40} color="#FACC15" />

            <Text style={styles.gameOverTitle}>Game Over</Text>

            <Text style={styles.gameOverText}>
              Wallet coins increased while you collected coins.
            </Text>

            <View style={styles.resultGrid}>
              <View style={styles.resultBox}>
                <Text style={styles.resultLabel}>SCORE</Text>
                <Text style={styles.resultValue}>{formatNumber(snapshot.score)}</Text>
              </View>

              <View style={styles.resultBox}>
                <Text style={styles.resultLabel}>EARNED</Text>
                <Text style={styles.resultValue}>{snapshot.lastEarned}</Text>
              </View>

              <View style={styles.resultBox}>
                <Text style={styles.resultLabel}>WALLET</Text>
                <Text style={styles.resultValue}>{formatNumber(snapshot.walletCoins)}</Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              style={[
                styles.continueButton,
                snapshot.walletCoins < LIFE_PRICE && styles.disabledButton,
              ]}
              onPress={continueGame}
            >
              <Text style={styles.bottomHeart}>♥</Text>
              <Text style={styles.continueButtonText}>Continue {LIFE_PRICE}</Text>
            </TouchableOpacity>

            <View style={styles.gameOverActions}>
              <TouchableOpacity
                activeOpacity={0.86}
                style={styles.modalSmallButton}
                onPress={() => {
                  setGameOverVisible(false);
                  setGarageVisible(true);
                }}
              >
                <Ionicons name="car-sport" size={16} color="#FFFFFF" />
                <Text style={styles.modalSmallButtonText}>Garage</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.86}
                style={styles.modalSmallButtonDanger}
                onPress={resetRun}
              >
                <Ionicons name="refresh" size={16} color="#FFFFFF" />
                <Text style={styles.modalSmallButtonText}>Restart</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </Modal>
    );
  };

  return (
    <LinearGradient
      colors={
        nightMode
          ? ["#01030D", "#061428", "#020617"]
          : ["#082F49", "#0F172A", "#020617"]
      }
      style={styles.root}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <SafeAreaView
        style={[
          styles.safe,
          {
            paddingTop: metrics.topSafe,
            paddingHorizontal: metrics.horizontalPad,
            paddingBottom: Platform.OS === "ios" ? 24 : 20,
          },
        ]}
      >
        {renderHeader()}
        {renderStats()}
        {renderHud()}
        {renderStage()}
        {renderControls()}
        {renderBottomActions()}
      </SafeAreaView>

      {renderGarageModal()}
      {renderGameOverModal()}

      {!!toast && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#020617",
  },

  safe: {
    flex: 1,
  },

  headerOuter: {
    borderRadius: 22,
    overflow: "hidden",
    marginBottom: 7,
    shadowColor: "#60A5FA",
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 7 },
    elevation: 8,
  },

  header: {
    flex: 1,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.32)",
    paddingHorizontal: 9,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerRoundButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(30,64,175,0.44)",
    borderWidth: 1.3,
    borderColor: "rgba(96,165,250,0.48)",
  },

  headerRoundButtonPurple: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(88,28,135,0.52)",
    borderWidth: 1.3,
    borderColor: "rgba(168,85,247,0.58)",
  },

  headerTitleBox: {
    flex: 1,
    alignItems: "center",
  },

  headerTitle: {
    color: "#FFFFFF",
    fontWeight: "900",
    letterSpacing: 0.4,
  },

  headerSubTitle: {
    color: "rgba(255,255,255,0.68)",
    fontSize: 9,
    fontWeight: "800",
    marginTop: 1,
  },

  statsRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 7,
  },

  statCard: {
    flex: 1,
    borderRadius: 15,
    paddingHorizontal: 6,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: "rgba(96,165,250,0.33)",
    overflow: "hidden",
  },

  statTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },

  statTitle: {
    color: "rgba(255,255,255,0.76)",
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.2,
  },

  statValue: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
    marginTop: 6,
  },

  statSub: {
    color: "#22D3EE",
    fontSize: 8,
    fontWeight: "900",
    marginTop: 3,
  },

  statPlus: {
    position: "absolute",
    right: 5,
    bottom: 5,
    width: 20,
    height: 20,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(30,64,175,0.62)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
  },

  statHeartIcon: {
    color: "#FB7185",
    fontSize: 14,
    fontWeight: "900",
  },

  heartRowBig: {
    flexDirection: "row",
    gap: 1,
    marginTop: 7,
    flexWrap: "wrap",
  },

  heartBig: {
    color: "#FB7185",
    fontSize: 13,
    fontWeight: "900",
    textShadowColor: "rgba(244,63,94,0.6)",
    textShadowRadius: 6,
  },

  heartEmpty: {
    color: "rgba(148,163,184,0.38)",
    textShadowRadius: 0,
  },

  hudGlass: {
    borderRadius: 17,
    padding: 5,
    flexDirection: "row",
    gap: 5,
    backgroundColor: "rgba(7,18,47,0.82)",
    borderWidth: 1,
    borderColor: "rgba(125,211,252,0.38)",
    marginBottom: 7,
    zIndex: 10,
  },

  hudPill: {
    flex: 1,
    borderRadius: 13,
    paddingHorizontal: 6,
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(8,24,61,0.82)",
    borderWidth: 1,
    borderColor: "rgba(96,165,250,0.22)",
  },

  hudLabel: {
    color: "rgba(255,255,255,0.62)",
    fontSize: 8,
    fontWeight: "900",
  },

  hudValue: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },

  kmhText: {
    color: "rgba(255,255,255,0.68)",
    fontSize: 7,
    fontWeight: "900",
  },

  stage: {
    flex: 1,
    minHeight: 310,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "rgba(96,165,250,0.30)",
  },

  stageBackground: {
    flex: 1,
    overflow: "hidden",
  },

  neonBuilding: {
    position: "absolute",
    width: 32,
    backgroundColor: "rgba(30,41,59,0.65)",
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.23)",
  },

  buildingLeftOne: {
    left: 9,
    top: 42,
    height: 100,
  },

  buildingLeftTwo: {
    left: 48,
    top: 72,
    height: 76,
  },

  buildingRightOne: {
    right: 12,
    top: 54,
    height: 104,
  },

  buildingRightTwo: {
    right: 54,
    top: 95,
    height: 64,
  },

  leftSign: {
    position: "absolute",
    left: 7,
    top: 125,
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#E879F9",
    backgroundColor: "rgba(88,28,135,0.36)",
    transform: [{ rotate: "-4deg" }],
  },

  rightSign: {
    position: "absolute",
    right: 7,
    top: 140,
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#22D3EE",
    backgroundColor: "rgba(8,47,73,0.44)",
    transform: [{ rotate: "3deg" }],
  },

  signText: {
    color: "#F0ABFC",
    fontSize: 10,
    fontWeight: "900",
  },

  signTextBlue: {
    color: "#67E8F9",
    fontSize: 10,
    fontWeight: "900",
  },

  grassLeft: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "50%",
  },

  grassRight: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: "50%",
  },

  road: {
    position: "absolute",
    top: 0,
    bottom: 0,
    overflow: "hidden",
  },

  roadSurface: {
    flex: 1,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderColor: "rgba(125,211,252,0.45)",
    overflow: "hidden",
  },

  roadSideGlowLeft: {
    position: "absolute",
    left: 3,
    top: 0,
    bottom: 0,
    width: 5,
    backgroundColor: "rgba(168,85,247,0.70)",
    shadowColor: "#A855F7",
    shadowOpacity: 1,
    shadowRadius: 16,
  },

  roadSideGlowRight: {
    position: "absolute",
    right: 3,
    top: 0,
    bottom: 0,
    width: 5,
    backgroundColor: "rgba(34,211,238,0.70)",
    shadowColor: "#22D3EE",
    shadowOpacity: 1,
    shadowRadius: 16,
  },

  dashColumn: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 3,
  },

  dash: {
    position: "absolute",
    width: 3,
    height: 38,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.72)",
  },

  trafficCar: {
    position: "absolute",
    zIndex: 14,
    transform: [{ rotate: "180deg" }],
  },

  playerCar: {
    position: "absolute",
    zIndex: 30,
    shadowColor: "#38BDF8",
    shadowOpacity: 0.8,
    shadowRadius: 16,
  },

  coin: {
    position: "absolute",
    zIndex: 20,
    shadowColor: "#FACC15",
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 10,
  },

  coinGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#FEF3C7",
  },

  coinText: {
    color: "#92400E",
    fontWeight: "900",
  },

  readyOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 40,
  },

  readyCard: {
    minWidth: 156,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(56,189,248,0.45)",
  },

  readyTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    marginTop: 4,
  },

  readySub: {
    color: "rgba(255,255,255,0.70)",
    fontSize: 10,
    fontWeight: "800",
    marginTop: 3,
  },

  controlDock: {
    marginHorizontal: 18,
    marginTop: -28,
    zIndex: 20,
    borderRadius: 999,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(10,20,45,0.96)",
    borderWidth: 1,
    borderColor: "rgba(96,165,250,0.25)",
  },

  sideControl: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(8,47,73,0.95)",
    borderWidth: 1.5,
    borderColor: "#22D3EE",
    shadowColor: "#22D3EE",
    shadowOpacity: 0.45,
    shadowRadius: 12,
  },

  centerControlOuter: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(124,58,237,0.28)",
    borderWidth: 1.5,
    borderColor: "#A855F7",
    shadowColor: "#A855F7",
    shadowOpacity: 0.7,
    shadowRadius: 16,
  },

  centerControl: {
    alignItems: "center",
    justifyContent: "center",
  },

  centerControlText: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "900",
    marginTop: 1,
  },

  bottomActions: {
    flexDirection: "row",
    gap: 7,
    marginTop: 8,
    marginBottom: Platform.OS === "ios" ? 18 : 16,
  },

  bottomButton: {
    flex: 1,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: "rgba(8,47,73,0.88)",
    borderWidth: 1.2,
    borderColor: "#38BDF8",
  },

  bottomButtonLife: {
    flex: 1,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: "rgba(88,28,135,0.88)",
    borderWidth: 1.2,
    borderColor: "#A855F7",
  },

  bottomButtonText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
  },

  bottomHeart: {
    color: "#FB7185",
    fontSize: 17,
    fontWeight: "900",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(2,6,23,0.80)",
    justifyContent: "flex-end",
  },

  modalOverlayCenter: {
    flex: 1,
    backgroundColor: "rgba(2,6,23,0.80)",
    justifyContent: "center",
    paddingHorizontal: 18,
  },

  garageSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "rgba(56,189,248,0.34)",
    paddingHorizontal: 12,
    paddingTop: 14,
    paddingBottom: Platform.OS === "ios" ? 24 : 14,
  },

  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  sheetTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  sheetSub: {
    color: "#FACC15",
    fontSize: 11,
    fontWeight: "900",
    marginTop: 2,
  },

  sheetClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.10)",
  },

  garageList: {
    paddingBottom: 18,
    gap: 10,
  },

  garageCard: {
    borderRadius: 17,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(15,23,42,0.92)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  garageImageBox: {
    width: 64,
    height: 64,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1.4,
  },

  garageCarImage: {
    width: 56,
    height: 60,
  },

  garageInfo: {
    flex: 1,
    paddingHorizontal: 9,
  },

  garageCarName: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },

  garageCarMeta: {
    color: "rgba(255,255,255,0.62)",
    fontSize: 10,
    fontWeight: "700",
    marginTop: 2,
  },

  garageBadgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    marginTop: 6,
  },

  freeBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: "rgba(34,197,94,0.18)",
  },

  freeBadgeText: {
    color: "#86EFAC",
    fontSize: 8,
    fontWeight: "900",
  },

  ownedBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: "rgba(59,130,246,0.20)",
  },

  ownedBadgeText: {
    color: "#BFDBFE",
    fontSize: 8,
    fontWeight: "900",
  },

  priceBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: "rgba(250,204,21,0.16)",
  },

  priceBadgeText: {
    color: "#FDE68A",
    fontSize: 8,
    fontWeight: "900",
  },

  garageButton: {
    minWidth: 72,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#38BDF8",
  },

  garageButtonSelected: {
    backgroundColor: "#FACC15",
  },

  garageButtonDisabled: {
    backgroundColor: "rgba(100,116,139,0.55)",
  },

  garageButtonText: {
    color: "#061428",
    fontSize: 10,
    fontWeight: "900",
  },

  garageButtonSelectedText: {
    color: "#061428",
  },

  gameOverCard: {
    borderRadius: 24,
    padding: 18,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#38BDF8",
  },

  gameOverTitle: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "900",
    marginTop: 6,
  },

  gameOverText: {
    color: "rgba(255,255,255,0.70)",
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 3,
  },

  resultGrid: {
    width: "100%",
    flexDirection: "row",
    gap: 7,
    marginTop: 14,
    marginBottom: 12,
  },

  resultBox: {
    flex: 1,
    minHeight: 66,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.11)",
  },

  resultLabel: {
    color: "rgba(255,255,255,0.62)",
    fontSize: 8,
    fontWeight: "800",
  },

  resultValue: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
    marginTop: 3,
  },

  continueButton: {
    width: "100%",
    height: 44,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#FACC15",
  },

  disabledButton: {
    opacity: 0.5,
  },

  continueButtonText: {
    color: "#061428",
    fontSize: 13,
    fontWeight: "900",
  },

  gameOverActions: {
    width: "100%",
    flexDirection: "row",
    gap: 9,
    marginTop: 9,
  },

  modalSmallButton: {
    flex: 1,
    height: 39,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  modalSmallButtonDanger: {
    flex: 1,
    height: 39,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: "rgba(239,68,68,0.22)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.34)",
  },

  modalSmallButtonText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
  },

  toast: {
    position: "absolute",
    left: 22,
    right: 22,
    bottom: Platform.OS === "ios" ? 30 : 22,
    minHeight: 40,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 13,
    backgroundColor: "rgba(15,23,42,0.96)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },

  toastText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
    textAlign: "center",
  },
});