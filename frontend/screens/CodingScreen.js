
// screens/CodingScreen.js

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import * as Speech from "expo-speech";

import { useGame } from "../context/GameContext";

const { width, height } = Dimensions.get("window");

const COIN_IMAGE = require("../assets/images/coin.png");
const TIMER_IMAGE = require("../assets/images/timer.png");
const LEVEL_BG = require("../assets/images/level1.png");

const isVeryTiny = width < 330;
const isTiny = width < 350;
const isSmall = width < 380;
const isShort = height < 720;

const clamp = (value, min, max) => Math.max(min, Math.min(value, max));
const SCALE = clamp(width / 390, 0.74, 1);
const fs = (value) => Math.round(value * SCALE);
const rs = (value) => Math.round(value * SCALE);

const PAGE_PADDING = isVeryTiny ? 5 : isTiny ? 6 : 8;

const safeNumber = (value, fallback = 1) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const getLevelTypeLabel = (type) => {
  if (type === "css") return "HTML + CSS";
  if (type === "javascript") return "HTML + CSS + JS";
  return "HTML";
};

const getCodePlaceholder = (type) => {
  if (type === "css") return "Type your HTML and CSS code here...";
  if (type === "javascript") {
    return "Type your HTML, CSS, and JavaScript code here...";
  }
  return "Type your HTML code here...";
};

const getTypeIcon = (type) => {
  if (type === "javascript") return "logo-javascript";
  if (type === "css") return "color-palette";
  return "logo-html5";
};

const makeCodeLines = (codeText) => {
  const cleanCode = String(codeText || "").trim();
  if (!cleanCode) return [""];
  return cleanCode.split("\n");
};

export default function CodingScreen({ navigation, route }) {
  const isFocused = useIsFocused();

  const {
    gameState,
    TOTAL_LEVELS,
    GAME_LIMITS,
    coins,
    stars,
    currentLevel,
    shareRewardClaimed,
    soundEnabled,
    lastMessage,

    getLevel,
    startLevel,
    resetLevel,
    isLevelLocked,

    getLevelCode,
    setLevelCode,

    getLevelSeconds,
    tickLevelTimer,

    buyHint,
    addExtraTime,
    autoFixLevel,

    validateCode,
    completeLevel,
    claimWhatsAppReward,
    buildLiveResultHtml,

    toggleSound,
    setGameMessage,
  } = useGame();

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
    return getLevel(levelNumber) || {};
  }, [getLevel, levelNumber]);

  const levelLocked = isLevelLocked(levelNumber);
  const levelTypeLabel = getLevelTypeLabel(levelInfo?.type);
  const codePlaceholder = getCodePlaceholder(levelInfo?.type);
  const typeIcon = getTypeIcon(levelInfo?.type);

  const code = getLevelCode(levelNumber) || "";
  const secondsLeft = getLevelSeconds(levelNumber);

  const hintAlreadyUnlocked = !!gameState?.hintUsedLevels?.[levelNumber];
  const autoFixAlreadyUsed = !!gameState?.autoFixUsedLevels?.[levelNumber];
  const extraTimeUsed = gameState?.extraTimeUses?.[levelNumber] || 0;

  const [showCoach, setShowCoach] = useState(true);
  const [activeCoachTab, setActiveCoachTab] = useState("code");
  const [showHint, setShowHint] = useState(hintAlreadyUnlocked);
  const [localMessage, setLocalMessage] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasRunOnce, setHasRunOnce] = useState(false);

  const failedOpenedRef = useRef(false);
  const handledParamsRef = useRef("");

  const message = localMessage || lastMessage;

  const timerText = useMemo(() => {
    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }, [secondsLeft]);

  const earnedStars = useMemo(() => {
    if (secondsLeft >= 80) return 3;
    if (secondsLeft >= 40) return 2;
    return 1;
  }, [secondsLeft]);

  const hintCode = useMemo(() => {
    return (
      levelInfo?.hintCode ||
      levelInfo?.solutionCode ||
      `<h1>${levelInfo?.title || "Hello FunzyCode"}</h1>`
    );
  }, [levelInfo]);

  const hintCodeLines = useMemo(() => makeCodeLines(hintCode), [hintCode]);

  const expectedOutput = useMemo(() => {
    return (
      levelInfo?.expectedOutput ||
      levelInfo?.outputText ||
      levelInfo?.previewText ||
      levelInfo?.title ||
      "Output"
    );
  }, [levelInfo]);

  const taskTitle = levelInfo?.title || `Level ${levelNumber}`;
  const taskText =
    levelInfo?.taskText ||
    "Create the page by typing the required code in the editor.";

  const explanationText = useMemo(() => {
    if (levelInfo?.explanation) return levelInfo.explanation;

    if (code.trim()) {
      return `Great job! This code creates the ${taskTitle} page. The heading tag creates the main title, the paragraph tag adds text, and the button tag creates a clickable button.`;
    }

    return "In this level, read the task first. Then type the code shown in Code to Type. After typing, press Run Code to check your output.";
  }, [levelInfo, code, taskTitle]);

  const voiceText = useMemo(() => {
    if (activeCoachTab === "code") {
      return `Type this code. ${hintCode.replace(/[<>/]/g, " ")}`;
    }

    return explanationText;
  }, [activeCoachTab, hintCode, explanationText]);

  const extraTimeDisabled =
    levelLocked ||
    coins < GAME_LIMITS.EXTRA_TIME_COST_COINS ||
    extraTimeUsed >= GAME_LIMITS.MAX_EXTRA_TIME_PER_LEVEL;

  const hintDisabled =
    levelLocked || (!hintAlreadyUnlocked && coins < GAME_LIMITS.HINT_COST_COINS);

  const autoFixDisabled =
    levelLocked ||
    (!autoFixAlreadyUsed && stars < GAME_LIMITS.AUTOFIX_COST_STARS);

  useEffect(() => {
    const result = startLevel(levelNumber);

    failedOpenedRef.current = false;
    setIsCompleted(false);
    setLocalMessage("");
    setGameMessage("");
    setHasRunOnce(false);
    setShowCoach(true);
    setActiveCoachTab("code");

    if (!result.ok) {
      setLocalMessage(result.message);
    }
  }, [levelNumber, startLevel, setGameMessage]);

  useEffect(() => {
    setShowHint(hintAlreadyUnlocked);

    if (hintAlreadyUnlocked) {
      setShowCoach(true);
      setActiveCoachTab("code");
    }
  }, [levelNumber, hintAlreadyUnlocked]);

  useEffect(() => {
    const params = route?.params || {};

    const paramsKey = JSON.stringify({
      level: params.level,
      code: params.code,
      keepCode: params.keepCode,
      extraTime: params.extraTime,
      autoFix: params.autoFix,
      resetLevel: params.resetLevel,
    });

    if (handledParamsRef.current === paramsKey) return;
    handledParamsRef.current = paramsKey;

    if (typeof params.code === "string" && params.keepCode) {
      setLevelCode(levelNumber, params.code);
    }

    if (params.resetLevel) {
      resetLevel(levelNumber);
      setShowHint(false);
      setShowCoach(true);
      setActiveCoachTab("code");
      setLocalMessage("Level reset.");
      setIsCompleted(false);
      setHasRunOnce(false);
      failedOpenedRef.current = false;
      return;
    }

    if (params.autoFix) {
      const result = autoFixLevel(levelNumber);
      setShowHint(true);
      setShowCoach(true);
      setActiveCoachTab("code");
      setLocalMessage(result.message);
      setIsCompleted(false);
      failedOpenedRef.current = false;
      return;
    }

    if (params.extraTime) {
      const result = addExtraTime(levelNumber);
      setLocalMessage(result.message);
      setIsCompleted(false);
      failedOpenedRef.current = false;
    }
  }, [
    route?.params,
    levelNumber,
    resetLevel,
    setLevelCode,
    autoFixLevel,
    addExtraTime,
  ]);

  useEffect(() => {
    if (!isFocused) return;
    if (levelLocked) return;
    if (isCompleted) return;
    if (secondsLeft <= 0) return;

    const intervalId = setInterval(() => {
      tickLevelTimer(levelNumber);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [
    isFocused,
    levelLocked,
    isCompleted,
    secondsLeft,
    levelNumber,
    tickLevelTimer,
  ]);

  useEffect(() => {
    if (!isFocused) return;
    if (levelLocked) return;
    if (isCompleted) return;
    if (secondsLeft !== 0) return;
    if (failedOpenedRef.current) return;

    failedOpenedRef.current = true;

    navigation?.navigate?.("FailedModalScreen", {
      level: levelNumber,
      extraTimeUsed,
    });
  }, [
    isFocused,
    levelLocked,
    secondsLeft,
    isCompleted,
    navigation,
    levelNumber,
    extraTimeUsed,
  ]);

  useEffect(() => {
    return () => {
      Speech.stop();
      setIsSpeaking(false);
    };
  }, []);

  const handleBack = () => {
    Speech.stop();
    setIsSpeaking(false);

    if (navigation?.canGoBack?.()) {
      navigation.goBack();
      return;
    }

    navigation?.navigate?.("RouteMapScreen");
  };

  const handleReset = () => {
    if (levelLocked) {
      setLocalMessage("This level is locked.");
      return;
    }

    Speech.stop();
    setIsSpeaking(false);

    resetLevel(levelNumber);
    setShowHint(false);
    setShowCoach(true);
    setActiveCoachTab("code");
    setLocalMessage("Level reset.");
    setIsCompleted(false);
    setHasRunOnce(false);
    failedOpenedRef.current = false;
  };

  const handleRun = () => {
    if (levelLocked) {
      setLocalMessage(`Level ${levelNumber} is locked.`);
      return;
    }

    if (!code.trim()) {
      setShowCoach(true);
      setActiveCoachTab("code");
      setLocalMessage("Type your code first.");
      return;
    }

    const validation = validateCode(levelNumber, code);

    if (!validation.ok) {
      setShowCoach(true);
      setActiveCoachTab("explain");
      setHasRunOnce(true);
      setLocalMessage(validation.message);
      return;
    }

    const result = completeLevel(levelNumber, code, earnedStars);

    if (!result.ok) {
      setLocalMessage(result.message);
      return;
    }

    setIsCompleted(true);
    setHasRunOnce(true);
    setShowCoach(true);
    setActiveCoachTab("explain");
    failedOpenedRef.current = true;
    setLocalMessage(result.message);

    const liveHtml = buildLiveResultHtml(levelNumber, code);

    setTimeout(() => {
      navigation?.navigate?.("LiveResultScreen", {
        level: levelNumber,
        code,
        liveHtml,
        earnedStars,
      });
    }, 500);
  };

  const handleAddTime = () => {
    if (extraTimeDisabled) {
      if (levelLocked) {
        setLocalMessage("This level is locked.");
        return;
      }

      if (extraTimeUsed >= GAME_LIMITS.MAX_EXTRA_TIME_PER_LEVEL) {
        setLocalMessage(`Extra time limit reached for Level ${levelNumber}.`);
        return;
      }

      setLocalMessage(`Need ${GAME_LIMITS.EXTRA_TIME_COST_COINS} coins.`);
      return;
    }

    const result = addExtraTime(levelNumber);
    setLocalMessage(result.message);

    if (result.ok) {
      setIsCompleted(false);
      failedOpenedRef.current = false;
    }
  };

  const handleHint = () => {
    if (levelLocked) {
      setLocalMessage("This level is locked.");
      return;
    }

    setShowCoach(true);
    setActiveCoachTab("code");

    if (showHint || hintAlreadyUnlocked) {
      setShowHint(true);
      setLocalMessage("Hint opened.");
      return;
    }

    const result = buyHint(levelNumber);

    if (result.ok) {
      setShowHint(true);
    }

    setLocalMessage(result.message);
  };

  const handleFillHint = () => {
    if (levelLocked) {
      setLocalMessage("This level is locked.");
      return;
    }

    setLevelCode(levelNumber, hintCode);
    setShowCoach(true);
    setActiveCoachTab("explain");
    setLocalMessage("Code copied to editor. Press Run Code.");
  };

  const handleAutoFix = () => {
    if (autoFixDisabled) {
      if (levelLocked) {
        setLocalMessage("This level is locked.");
        return;
      }

      setLocalMessage(`Need ${GAME_LIMITS.AUTOFIX_COST_STARS} star for Auto Fix.`);
      return;
    }

    const result = autoFixLevel(levelNumber);

    if (result.ok) {
      setShowHint(true);
      setShowCoach(true);
      setActiveCoachTab("explain");
    }

    setLocalMessage(result.message);
  };

  const handleWhatsAppShare = async () => {
    const shareText =
      "I am learning coding with FunzyCode! Join me and play coding levels with fun games.";

    const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(shareText)}`;
    const webWhatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      shareText
    )}`;

    try {
      const canOpenWhatsapp = await Linking.canOpenURL(whatsappUrl);

      if (canOpenWhatsapp) {
        await Linking.openURL(whatsappUrl);
      } else {
        await Linking.openURL(webWhatsappUrl);
      }

      const result = claimWhatsAppReward();
      setLocalMessage(result.message);
    } catch (error) {
      setLocalMessage("Unable to open WhatsApp.");
    }
  };

  const handleSound = () => {
    toggleSound();
  };

  const handleCoach = () => {
    setShowCoach((prev) => !prev);
  };

  const handleReadTask = async () => {
    try {
      const speaking = await Speech.isSpeakingAsync();

      if (speaking) {
        await Speech.stop();
        setIsSpeaking(false);
        return;
      }

      setIsSpeaking(true);

      Speech.speak(`${taskTitle}. ${taskText}`, {
        language: "en",
        pitch: 1,
        rate: 0.9,
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: () => {
          setIsSpeaking(false);
          setLocalMessage("Unable to read task.");
        },
      });
    } catch (error) {
      setIsSpeaking(false);
      setLocalMessage("Voice not available.");
    }
  };

  const handleVoice = async () => {
    try {
      const speaking = await Speech.isSpeakingAsync();

      if (speaking) {
        await Speech.stop();
        setIsSpeaking(false);
        return;
      }

      setShowCoach(true);
      setActiveCoachTab("voice");
      setIsSpeaking(true);

      Speech.speak(voiceText, {
        language: "en",
        pitch: 1,
        rate: 0.9,
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: () => {
          setIsSpeaking(false);
          setLocalMessage("Unable to play voice.");
        },
      });
    } catch (error) {
      setIsSpeaking(false);
      setLocalMessage("Voice explanation not available.");
    }
  };

  const renderHintCodeBlock = () => {
    return (
      <View style={styles.miniCodeBox}>
        <TouchableOpacity
          style={styles.copyMiniBtn}
          activeOpacity={0.85}
          onPress={handleFillHint}
        >
          <Ionicons name="copy-outline" size={rs(14)} color="#FFFFFF" />
        </TouchableOpacity>

        <ScrollView
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.miniCodeScrollContent}
        >
          {hintCodeLines.map((line, index) => (
            <Text key={`${line}-${index}`} style={styles.miniCodeText}>
              {line}
            </Text>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderCoachBody = () => {
    if (activeCoachTab === "voice") {
      return (
        <View style={styles.voiceBody}>
          <View style={styles.voiceCircle}>
            <Ionicons
              name={isSpeaking ? "stop-circle" : "volume-high"}
              size={rs(30)}
              color="#FFFFFF"
            />
          </View>

          <View style={styles.voiceTextBox}>
            <Text style={styles.voiceTitle}>
              {isSpeaking ? "Voice is playing..." : "Voice Explanation"}
            </Text>
            <Text style={styles.voiceSub}>
              Tap Play to listen to the explanation.
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.voicePlayBtn, isSpeaking && styles.voiceStopBtn]}
            activeOpacity={0.85}
            onPress={handleVoice}
          >
            <Text style={styles.voicePlayText}>
              {isSpeaking ? "Stop" : "Play"}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (activeCoachTab === "code") {
      return (
        <View style={styles.coachSingleBody}>
          <View style={styles.coachSectionHeaderRow}>
            <Text style={styles.coachSectionTitle}>Code to Type</Text>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.copyTextBtn}
              onPress={handleFillHint}
            >
              <Ionicons name="copy-outline" size={rs(13)} color="#FFFFFF" />
              <Text style={styles.copyText}>Copy</Text>
            </TouchableOpacity>
          </View>

          {renderHintCodeBlock()}
        </View>
      );
    }

    return (
      <View style={styles.coachSingleBody}>
        <Text style={styles.coachSectionTitle}>Explanation After Typing</Text>

        <View style={styles.explainPanel}>
          <Text style={styles.explainText}>
            {code.trim() || hasRunOnce ? "Great job!\n" : ""}
            {explanationText}
          </Text>

          <View style={styles.coachKidBox}>
            <Text style={styles.coachKidEmoji}>👦</Text>
            <View style={styles.ideaBubble}>
              <Ionicons name="bulb" size={rs(13)} color="#F0A21C" />
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#008CFF" />

      <ImageBackground source={LEVEL_BG} style={styles.bg} imageStyle={styles.bgImage}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.content}>
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.header}>
                <TouchableOpacity
                  style={styles.backBtn}
                  activeOpacity={0.85}
                  onPress={handleBack}
                >
                  <Ionicons name="arrow-back" size={rs(22)} color="#FFFFFF" />
                </TouchableOpacity>

                <View style={styles.headerPill}>
                  <Image source={COIN_IMAGE} style={styles.coinIcon} />
                  <Text style={styles.headerPillText}>{coins}</Text>
                  <View style={styles.plusMini}>
                    <Ionicons name="add" size={rs(12)} color="#FFFFFF" />
                  </View>
                </View>

                <View style={styles.headerPill}>
                  <Text style={styles.bigStarIcon}>★</Text>
                  <Text style={styles.headerPillText}>{stars}</Text>
                  <View style={styles.plusMini}>
                    <Ionicons name="add" size={rs(12)} color="#FFFFFF" />
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.coachHeaderBtn}
                  activeOpacity={0.85}
                  onPress={handleCoach}
                >
                  <Text style={styles.coachFace}>👦</Text>
                  <Text numberOfLines={1} style={styles.coachHeaderText}>
                    Coach
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.soundBtn, !soundEnabled && styles.soundBtnOff]}
                  activeOpacity={0.85}
                  onPress={handleSound}
                >
                  <Ionicons
                    name={soundEnabled ? "volume-high" : "volume-mute"}
                    size={rs(21)}
                    color="#FFFFFF"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.levelCenterBox}>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelText}>Level {levelNumber}</Text>
                </View>

                <View style={styles.typeBadge}>
                  <Ionicons name={typeIcon} size={rs(13)} color="#FFFFFF" />
                  <Text style={styles.typeBadgeText}>{levelTypeLabel}</Text>
                </View>
              </View>

              <View style={styles.taskCard}>
                <View style={styles.taskLeft}>
                  <View style={styles.taskLabelRow}>
                    <Ionicons name="clipboard" size={rs(16)} color="#216DFF" />
                    <Text style={styles.taskLabel}>TASK</Text>
                  </View>

                  <Text numberOfLines={1} style={styles.taskTitle}>
                    {taskTitle}
                  </Text>
                  <Text numberOfLines={isVeryTiny ? 3 : 4} style={styles.taskText}>
                    {taskText}
                  </Text>
                </View>

                <View style={styles.taskDivider} />

                <View style={styles.outputRight}>
                  <View style={styles.outputLabelRow}>
                    <Ionicons name="eye" size={rs(16)} color="#249A18" />
                    <Text numberOfLines={1} style={styles.outputLabel}>
                      EXPECTED OUTPUT
                    </Text>
                  </View>

                  <View style={styles.outputRow}>
                    <View style={styles.outputBox}>
                      <Text numberOfLines={2} adjustsFontSizeToFit style={styles.outputText}>
                        {expectedOutput}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.readTaskBtn}
                      activeOpacity={0.85}
                      onPress={handleReadTask}
                    >
                      <Ionicons name="volume-high" size={rs(13)} color="#FFFFFF" />
                      <Text numberOfLines={1} style={styles.readTaskText}>
                        Read
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.codeCard}>
                <View style={styles.codeHeader}>
                  <View style={styles.codeHeaderLeft}>
                    <Ionicons name="code-slash" size={rs(20)} color="#6DFF38" />
                    <Text numberOfLines={1} style={styles.codeTitle}>
                      TYPE YOUR CODE HERE
                    </Text>
                  </View>

                  <Ionicons name="expand" size={rs(17)} color="#AEB8C3" />
                </View>

                <View style={styles.editorBody}>
                  <View style={styles.lineNumberBox}>
                    {[1, 2, 3, 4, 5, 6].map((line) => (
                      <Text key={line} style={styles.lineNumber}>
                        {line}
                      </Text>
                    ))}
                  </View>

                  <TextInput
                    value={code}
                    editable={!levelLocked}
                    onChangeText={(text) => {
                      setLevelCode(levelNumber, text);
                      if (localMessage) setLocalMessage("");
                      if (lastMessage) setGameMessage("");
                    }}
                    multiline
                    autoCapitalize="none"
                    autoCorrect={false}
                    textAlignVertical="top"
                    placeholder={codePlaceholder}
                    placeholderTextColor="#68727B"
                    style={[
                      styles.codeInput,
                      levelLocked && styles.codeInputDisabled,
                    ]}
                  />
                </View>
              </View>

              {showCoach && (
                <View style={styles.coachCard}>
                  <View style={styles.coachTop}>
                    <View style={styles.coachTopLeft}>
                      <Text style={styles.coachTopFace}>👦</Text>
                      <Text numberOfLines={1} style={styles.coachTitle}>
                        COACH HELP
                      </Text>
                    </View>

                    <Text numberOfLines={1} style={styles.coachHelpText}>
                      Need help?
                    </Text>

                    <TouchableOpacity
                      style={styles.closeCoachBtn}
                      activeOpacity={0.85}
                      onPress={() => setShowCoach(false)}
                    >
                      <Ionicons name="close" size={rs(18)} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.coachTabs}>
                    <TouchableOpacity
                      style={[
                        styles.coachTab,
                        activeCoachTab === "code" && styles.activeCoachTab,
                      ]}
                      activeOpacity={0.85}
                      onPress={() => setActiveCoachTab("code")}
                    >
                      <Ionicons
                        name="code-slash"
                        size={rs(13)}
                        color={activeCoachTab === "code" ? "#FFFFFF" : "#351D4B"}
                      />
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.coachTabText,
                          activeCoachTab === "code" && styles.activeCoachTabText,
                        ]}
                      >
                        Code
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.coachTab,
                        activeCoachTab === "explain" && styles.activeCoachTab,
                      ]}
                      activeOpacity={0.85}
                      onPress={() => setActiveCoachTab("explain")}
                    >
                      <Ionicons
                        name="bulb"
                        size={rs(13)}
                        color={
                          activeCoachTab === "explain" ? "#FFFFFF" : "#F0A21C"
                        }
                      />
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.coachTabText,
                          activeCoachTab === "explain" &&
                            styles.activeCoachTabText,
                        ]}
                      >
                        Explain
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.coachTab,
                        activeCoachTab === "voice" && styles.activeCoachTab,
                      ]}
                      activeOpacity={0.85}
                      onPress={handleVoice}
                    >
                      <Ionicons
                        name={isSpeaking ? "stop-circle" : "volume-high"}
                        size={rs(13)}
                        color={activeCoachTab === "voice" ? "#FFFFFF" : "#111827"}
                      />
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.coachTabText,
                          activeCoachTab === "voice" && styles.activeCoachTabText,
                        ]}
                      >
                        Voice
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {renderCoachBody()}
                </View>
              )}

              {!!message && (
                <View style={styles.messageBox}>
                  <Text style={styles.messageText}>{message}</Text>
                </View>
              )}

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[
                    styles.mainBtn,
                    styles.resetBtn,
                    levelLocked && styles.disabledBtn,
                  ]}
                  activeOpacity={levelLocked ? 1 : 0.85}
                  onPress={handleReset}
                >
                  <Ionicons name="refresh" size={rs(21)} color="#FFFFFF" />
                  <Text style={styles.mainBtnText}>Reset</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.mainBtn,
                    styles.runBtn,
                    levelLocked && styles.disabledBtn,
                  ]}
                  activeOpacity={levelLocked ? 1 : 0.85}
                  onPress={handleRun}
                >
                  <Ionicons name="play" size={rs(21)} color="#FFFFFF" />
                  <Text style={styles.mainBtnText}>Run Code</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.bottomRow}>
                <TouchableOpacity
                  style={[
                    styles.powerCard,
                    styles.timePowerCard,
                    extraTimeDisabled && styles.disabledBtn,
                  ]}
                  activeOpacity={extraTimeDisabled ? 1 : 0.85}
                  onPress={handleAddTime}
                >
                  <Image source={TIMER_IMAGE} style={styles.powerImage} />
                  <View style={styles.powerTextBox}>
                    <Text numberOfLines={1} style={styles.timePowerTitle}>
                      +30s
                    </Text>
                    <View style={styles.costRow}>
                      <Image source={COIN_IMAGE} style={styles.costCoin} />
                      <Text numberOfLines={1} style={styles.powerCost}>
                        {GAME_LIMITS.EXTRA_TIME_COST_COINS}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.powerLine} />
                  <Text numberOfLines={1} style={styles.powerLimit}>
                    {extraTimeUsed}/{GAME_LIMITS.MAX_EXTRA_TIME_PER_LEVEL}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.powerCard,
                    styles.hintPowerCard,
                    hintDisabled && styles.disabledBtn,
                  ]}
                  activeOpacity={hintDisabled ? 1 : 0.85}
                  onPress={handleHint}
                >
                  <Ionicons name="bulb" size={rs(28)} color="#F0A21C" />
                  <View style={styles.powerTextBox}>
                    <Text numberOfLines={1} style={styles.hintPowerTitle}>
                      Hint
                    </Text>
                    <Text numberOfLines={1} style={styles.hintUnlockText}>
                      {hintAlreadyUnlocked || showHint
                        ? "Unlocked"
                        : `${GAME_LIMITS.HINT_COST_COINS}`}
                    </Text>
                  </View>
                  <View style={styles.powerLine} />
                  <Text numberOfLines={1} style={styles.powerLimit}>
                    {hintAlreadyUnlocked || showHint ? "1" : "0"}/3
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.powerCard,
                    styles.autoPowerCard,
                    autoFixDisabled && styles.disabledBtn,
                  ]}
                  activeOpacity={autoFixDisabled ? 1 : 0.85}
                  onPress={handleAutoFix}
                >
                  <Ionicons name="color-wand" size={rs(28)} color="#E83F7B" />
                  <View style={styles.powerTextBox}>
                    <Text numberOfLines={1} style={styles.autoPowerTitle}>
                      Auto
                    </Text>
                    <View style={styles.costRow}>
                      <Text style={styles.autoStar}>★</Text>
                      <Text numberOfLines={1} style={styles.powerCost}>
                        {autoFixAlreadyUsed
                          ? "Used"
                          : GAME_LIMITS.AUTOFIX_COST_STARS}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.powerLine} />
                  <Text numberOfLines={1} style={styles.powerLimit}>
                    {autoFixAlreadyUsed ? "1" : "0"}/1
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[
                  styles.whatsappBtn,
                  shareRewardClaimed && styles.whatsappClaimedBtn,
                ]}
                activeOpacity={0.88}
                onPress={handleWhatsAppShare}
              >
                <Ionicons name="logo-whatsapp" size={rs(23)} color="#FFFFFF" />

                <View style={styles.whatsappTextBox}>
                  <Text numberOfLines={1} style={styles.whatsappTitle}>
                    Share on WhatsApp
                  </Text>
                  <Text numberOfLines={1} style={styles.whatsappSub}>
                    {shareRewardClaimed
                      ? "500 coins already claimed"
                      : "Get 500 coins"}
                  </Text>
                </View>

                <Image source={COIN_IMAGE} style={styles.whatsappCoin} />
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#008CFF",
  },

  bg: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  bgImage: {
    resizeMode: "cover",
  },

  keyboardView: {
    flex: 1,
  },

  content: {
    flex: 1,
    paddingHorizontal: PAGE_PADDING,
    paddingTop: Platform.OS === "android" ? rs(6) : rs(3),
    paddingBottom: rs(6),
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: rs(14),
  },

  header: {
    marginTop: Platform.OS === "android" ? rs(14) : rs(4),
    minHeight: isVeryTiny ? rs(34) : rs(38),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: rs(6),
  },

  backBtn: {
    width: isVeryTiny ? rs(34) : rs(38),
    height: isVeryTiny ? rs(34) : rs(38),
    borderRadius: rs(10),
    backgroundColor: "#FFC72C",
    borderWidth: 2,
    borderColor: "#A86A00",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },

  headerPill: {
    height: isVeryTiny ? rs(32) : rs(36),
    width: isVeryTiny ? rs(58) : isTiny ? rs(64) : rs(72),
    borderRadius: rs(14),
    backgroundColor: "#052A68",
    borderWidth: 2,
    borderColor: "#001A43",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: rs(3),
    elevation: 4,
  },

  coinIcon: {
    width: isVeryTiny ? rs(18) : rs(21),
    height: isVeryTiny ? rs(18) : rs(21),
    resizeMode: "contain",
    marginRight: rs(2),
  },

  bigStarIcon: {
    color: "#FFD84D",
    fontSize: isVeryTiny ? fs(20) : fs(24),
    fontWeight: "900",
    marginRight: rs(2),
    textShadowColor: "#A15E00",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },

  headerPillText: {
    color: "#FFFFFF",
    fontSize: isVeryTiny ? fs(12) : fs(14),
    fontWeight: "900",
  },

  plusMini: {
    width: isVeryTiny ? rs(16) : rs(18),
    height: isVeryTiny ? rs(16) : rs(18),
    borderRadius: rs(7),
    backgroundColor: "#5DCD26",
    borderWidth: 1.5,
    borderColor: "#2B890B",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: rs(3),
  },

  coachHeaderBtn: {
    height: isVeryTiny ? rs(34) : rs(38),
    width: isVeryTiny ? rs(70) : isTiny ? rs(78) : rs(88),
    borderRadius: rs(13),
    backgroundColor: "#7C37E8",
    borderWidth: 2,
    borderColor: "#4D159B",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: rs(4),
    elevation: 4,
  },

  coachFace: {
    fontSize: isVeryTiny ? fs(16) : fs(18),
    marginRight: rs(2),
  },

  coachHeaderText: {
    color: "#FFFFFF",
    fontSize: isVeryTiny ? fs(12) : fs(14),
    fontWeight: "900",
  },

  soundBtn: {
    width: isVeryTiny ? rs(34) : rs(38),
    height: isVeryTiny ? rs(34) : rs(38),
    borderRadius: rs(10),
    backgroundColor: "#5DCD26",
    borderWidth: 2,
    borderColor: "#2B890B",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },

  soundBtnOff: {
    backgroundColor: "#777777",
    borderColor: "#555555",
  },

  levelCenterBox: {
    alignItems: "center",
    marginBottom: rs(6),
  },

  levelBadge: {
    minWidth: rs(96),
    height: rs(27),
    borderRadius: rs(15),
    backgroundColor: "#1E7BFF",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: rs(4),
  },

  levelText: {
    color: "#FFFFFF",
    fontSize: fs(14),
    fontWeight: "900",
  },

  typeBadge: {
    minWidth: rs(100),
    height: rs(25),
    borderRadius: rs(14),
    backgroundColor: "#174AAE",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  typeBadgeText: {
    color: "#FFFFFF",
    fontSize: fs(11),
    fontWeight: "900",
    marginLeft: rs(4),
  },

  taskCard: {
    backgroundColor: "#FFF7DC",
    borderRadius: rs(14),
    borderWidth: 2,
    borderColor: "#FFB331",
    padding: isVeryTiny ? rs(8) : rs(9),
    marginBottom: rs(7),
    flexDirection: isVeryTiny ? "column" : "row",
    alignItems: isVeryTiny ? "stretch" : "center",
    elevation: 4,
  },

  taskLeft: {
    flex: 1.05,
    paddingRight: isVeryTiny ? 0 : rs(6),
  },

  taskLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: rs(4),
  },

  taskLabel: {
    color: "#094FBF",
    fontSize: fs(11),
    fontWeight: "900",
    marginLeft: rs(5),
  },

  taskTitle: {
    color: "#3B160D",
    fontSize: fs(13),
    fontWeight: "900",
    marginBottom: rs(2),
  },

  taskText: {
    color: "#38190F",
    fontSize: fs(9),
    lineHeight: fs(13),
    fontWeight: "800",
  },

  taskDivider: {
    width: isVeryTiny ? "100%" : 1.5,
    height: isVeryTiny ? 1.5 : "88%",
    backgroundColor: "#F4B24B",
    marginHorizontal: isVeryTiny ? 0 : rs(7),
    marginVertical: isVeryTiny ? rs(7) : 0,
  },

  outputRight: {
    flex: 1,
  },

  outputLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: rs(5),
  },

  outputLabel: {
    color: "#249A18",
    fontSize: fs(9),
    fontWeight: "900",
    marginLeft: rs(5),
  },

  outputRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  outputBox: {
    flex: 1,
    minHeight: isVeryTiny ? rs(42) : rs(48),
    borderRadius: rs(9),
    backgroundColor: "#FFFFFF",
    borderWidth: 1.2,
    borderColor: "#D7C7AF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: rs(5),
  },

  outputText: {
    color: "#111111",
    fontSize: isVeryTiny ? fs(13) : fs(15),
    fontWeight: "900",
    textAlign: "center",
  },

  readTaskBtn: {
    marginLeft: rs(6),
    width: isVeryTiny ? rs(62) : rs(70),
    height: isVeryTiny ? rs(34) : rs(39),
    borderRadius: rs(10),
    backgroundColor: "#5FD019",
    borderWidth: 2,
    borderColor: "#258B0C",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: rs(4),
  },

  readTaskText: {
    color: "#FFFFFF",
    fontSize: fs(9),
    fontWeight: "900",
    marginLeft: rs(3),
  },

  codeCard: {
    height: isShort ? rs(205) : isTiny ? rs(220) : rs(245),
    backgroundColor: "#07151F",
    borderRadius: rs(15),
    borderWidth: 2,
    borderColor: "#091018",
    marginBottom: rs(7),
    overflow: "hidden",
    elevation: 5,
  },

  codeHeader: {
    height: isVeryTiny ? rs(36) : rs(40),
    backgroundColor: "#09131C",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: rs(10),
    flexDirection: "row",
  },

  codeHeaderLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  codeTitle: {
    color: "#6DFF38",
    fontSize: fs(11),
    fontWeight: "900",
    marginLeft: rs(7),
  },

  editorBody: {
    flex: 1,
    flexDirection: "row",
  },

  lineNumberBox: {
    width: isVeryTiny ? rs(34) : rs(39),
    borderRightWidth: 1,
    borderRightColor: "#1D2A35",
    paddingTop: rs(10),
    alignItems: "center",
  },

  lineNumber: {
    color: "#B9C0C7",
    fontSize: fs(14),
    lineHeight: fs(25),
    fontWeight: "700",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },

  codeInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: fs(11),
    lineHeight: fs(18),
    paddingHorizontal: rs(10),
    paddingVertical: rs(10),
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },

  codeInputDisabled: {
    opacity: 0.55,
  },

  coachCard: {
    backgroundColor: "#7B38EC",
    borderRadius: rs(15),
    borderWidth: 2,
    borderColor: "#4D1AAB",
    marginBottom: rs(7),
    overflow: "hidden",
    elevation: 5,
  },

  coachTop: {
    height: isVeryTiny ? rs(39) : rs(44),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: rs(8),
  },

  coachTopLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  coachTopFace: {
    fontSize: isVeryTiny ? fs(22) : fs(25),
    marginRight: rs(5),
  },

  coachTitle: {
    color: "#FFFFFF",
    fontSize: fs(14),
    fontWeight: "900",
  },

  coachHelpText: {
    color: "#FFFFFF",
    fontSize: fs(9),
    fontWeight: "800",
    marginRight: rs(6),
  },

  closeCoachBtn: {
    width: rs(28),
    height: rs(28),
    borderRadius: rs(14),
    backgroundColor: "#5D2DCB",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  coachTabs: {
    flexDirection: "row",
    backgroundColor: "#F7F0FF",
    paddingHorizontal: rs(7),
    paddingTop: rs(7),
  },

  coachTab: {
    flex: 1,
    minHeight: isVeryTiny ? rs(32) : rs(35),
    borderTopLeftRadius: rs(10),
    borderTopRightRadius: rs(10),
    borderWidth: 1.2,
    borderColor: "#CBB7EF",
    backgroundColor: "#F4EDFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: rs(3),
  },

  activeCoachTab: {
    backgroundColor: "#6E35D8",
    borderColor: "#6E35D8",
  },

  coachTabText: {
    color: "#161327",
    fontSize: fs(10),
    fontWeight: "900",
    marginLeft: rs(4),
  },

  activeCoachTabText: {
    color: "#FFFFFF",
  },

  coachSingleBody: {
    backgroundColor: "#F9F6FF",
    marginHorizontal: rs(7),
    marginBottom: rs(7),
    borderBottomLeftRadius: rs(12),
    borderBottomRightRadius: rs(12),
    borderWidth: 1.2,
    borderColor: "#CBB7EF",
    padding: rs(8),
    minHeight: isVeryTiny ? rs(124) : rs(140),
  },

  coachSectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: rs(6),
  },

  coachSectionTitle: {
    color: "#6730D6",
    fontSize: fs(11),
    fontWeight: "900",
    marginBottom: rs(6),
  },

  copyTextBtn: {
    height: rs(25),
    borderRadius: rs(8),
    backgroundColor: "#6E35D8",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: rs(8),
  },

  copyText: {
    color: "#FFFFFF",
    fontSize: fs(9),
    fontWeight: "900",
    marginLeft: rs(3),
  },

  miniCodeBox: {
    flex: 1,
    minHeight: isVeryTiny ? rs(88) : rs(105),
    maxHeight: isShort ? rs(130) : rs(155),
    backgroundColor: "#101B24",
    borderRadius: rs(10),
    paddingHorizontal: rs(8),
    paddingVertical: rs(8),
    borderWidth: 1,
    borderColor: "#243A4B",
  },

  miniCodeScrollContent: {
    paddingRight: rs(26),
    paddingBottom: rs(5),
  },

  copyMiniBtn: {
    position: "absolute",
    right: rs(7),
    top: rs(7),
    width: rs(23),
    height: rs(23),
    borderRadius: rs(7),
    backgroundColor: "#2C3B48",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },

  miniCodeText: {
    color: "#FFFFFF",
    fontSize: fs(9),
    lineHeight: fs(15),
    fontWeight: "700",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },

  explainPanel: {
    flex: 1,
    minHeight: isVeryTiny ? rs(92) : rs(108),
    backgroundColor: "#FFFFFF",
    borderRadius: rs(10),
    borderWidth: 1,
    borderColor: "#E5DAFF",
    padding: rs(8),
    overflow: "hidden",
  },

  explainText: {
    color: "#111827",
    fontSize: fs(10),
    lineHeight: fs(15),
    fontWeight: "800",
    paddingRight: isVeryTiny ? rs(44) : rs(56),
  },

  coachKidBox: {
    position: "absolute",
    right: rs(2),
    bottom: rs(2),
    width: isVeryTiny ? rs(48) : rs(58),
    height: isVeryTiny ? rs(64) : rs(74),
    alignItems: "center",
    justifyContent: "flex-end",
  },

  coachKidEmoji: {
    fontSize: isVeryTiny ? fs(38) : fs(45),
  },

  ideaBubble: {
    position: "absolute",
    right: rs(1),
    top: 0,
    width: rs(24),
    height: rs(24),
    borderRadius: rs(12),
    backgroundColor: "#FFF5C7",
    borderWidth: 1,
    borderColor: "#FFD24F",
    alignItems: "center",
    justifyContent: "center",
  },

  voiceBody: {
    backgroundColor: "#F9F6FF",
    marginHorizontal: rs(7),
    marginBottom: rs(7),
    borderBottomLeftRadius: rs(12),
    borderBottomRightRadius: rs(12),
    borderWidth: 1.2,
    borderColor: "#CBB7EF",
    padding: rs(10),
    flexDirection: "row",
    alignItems: "center",
    minHeight: rs(92),
  },

  voiceCircle: {
    width: rs(48),
    height: rs(48),
    borderRadius: rs(24),
    backgroundColor: "#6E35D8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: rs(9),
  },

  voiceTextBox: {
    flex: 1,
  },

  voiceTitle: {
    color: "#111827",
    fontSize: fs(12),
    fontWeight: "900",
  },

  voiceSub: {
    color: "#4B5563",
    fontSize: fs(9),
    lineHeight: fs(13),
    fontWeight: "700",
    marginTop: rs(2),
  },

  voicePlayBtn: {
    backgroundColor: "#22B947",
    borderRadius: rs(9),
    paddingHorizontal: rs(12),
    paddingVertical: rs(7),
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  voiceStopBtn: {
    backgroundColor: "#D94242",
  },

  voicePlayText: {
    color: "#FFFFFF",
    fontSize: fs(10),
    fontWeight: "900",
  },

  messageBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: rs(9),
    borderWidth: 1.5,
    borderColor: "#FFD24F",
    paddingHorizontal: rs(8),
    paddingVertical: rs(6),
    marginBottom: rs(7),
  },

  messageText: {
    color: "#0A4A28",
    fontSize: fs(10),
    fontWeight: "900",
    textAlign: "center",
  },

  actionRow: {
    flexDirection: "row",
    marginBottom: rs(7),
    paddingHorizontal: rs(8),
  },

  mainBtn: {
    flex: 1,
    height: isVeryTiny ? rs(44) : rs(49),
    borderRadius: rs(13),
    borderWidth: 2,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    elevation: 4,
  },

  resetBtn: {
    backgroundColor: "#FFA914",
    borderColor: "#CE7400",
    marginRight: rs(8),
  },

  runBtn: {
    backgroundColor: "#56CC13",
    borderColor: "#248E08",
    marginLeft: rs(8),
  },

  mainBtnText: {
    color: "#FFFFFF",
    fontSize: fs(14),
    fontWeight: "900",
    marginLeft: rs(6),
  },

  bottomRow: {
    flexDirection: "row",
    marginBottom: rs(7),
  },

  powerCard: {
    flex: 1,
    minHeight: isVeryTiny ? rs(78) : rs(88),
    borderRadius: rs(13),
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: rs(6),
    paddingHorizontal: rs(4),
    elevation: 3,
  },

  timePowerCard: {
    backgroundColor: "#EFF7FF",
    borderColor: "#80B9FF",
    marginRight: rs(4),
  },

  hintPowerCard: {
    backgroundColor: "#FFF8DC",
    borderColor: "#FFCE61",
    marginHorizontal: rs(2),
  },

  autoPowerCard: {
    backgroundColor: "#FFF0F7",
    borderColor: "#FF98BF",
    marginLeft: rs(4),
  },

  disabledBtn: {
    opacity: 0.5,
  },

  powerImage: {
    width: isVeryTiny ? rs(25) : rs(30),
    height: isVeryTiny ? rs(25) : rs(30),
    resizeMode: "contain",
    marginBottom: rs(2),
  },

  powerTextBox: {
    alignItems: "center",
  },

  timePowerTitle: {
    color: "#1B55C8",
    fontSize: fs(10),
    fontWeight: "900",
  },

  hintPowerTitle: {
    color: "#E08015",
    fontSize: fs(10),
    fontWeight: "900",
  },

  autoPowerTitle: {
    color: "#D93675",
    fontSize: fs(10),
    fontWeight: "900",
  },

  costRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: rs(2),
  },

  costCoin: {
    width: rs(13),
    height: rs(13),
    resizeMode: "contain",
    marginRight: rs(3),
  },

  autoStar: {
    color: "#FFD84D",
    fontSize: fs(13),
    fontWeight: "900",
    marginRight: rs(3),
  },

  powerCost: {
    color: "#222222",
    fontSize: fs(9),
    fontWeight: "900",
  },

  hintUnlockText: {
    color: "#078D24",
    fontSize: fs(9),
    fontWeight: "900",
    marginTop: rs(2),
  },

  powerLine: {
    width: "72%",
    height: 1,
    backgroundColor: "rgba(0,0,0,0.18)",
    marginVertical: rs(5),
  },

  powerLimit: {
    color: "#17336B",
    fontSize: fs(9),
    fontWeight: "900",
  },

  whatsappBtn: {
    minHeight: isVeryTiny ? rs(43) : rs(48),
    borderRadius: rs(13),
    backgroundColor: "#20B857",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: rs(12),
    marginHorizontal: rs(4),
    elevation: 4,
  },

  whatsappClaimedBtn: {
    backgroundColor: "#148944",
  },

  whatsappTextBox: {
    flex: 1,
    marginLeft: rs(10),
  },

  whatsappTitle: {
    color: "#FFFFFF",
    fontSize: fs(13),
    fontWeight: "900",
  },

  whatsappSub: {
    color: "#EFFFF0",
    fontSize: fs(9),
    fontWeight: "800",
    marginTop: rs(1),
  },

  whatsappCoin: {
    width: rs(24),
    height: rs(24),
    resizeMode: "contain",
  },
});