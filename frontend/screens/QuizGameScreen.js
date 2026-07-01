// // screens/QuizGameScreen.js

// import React, { useEffect, useMemo, useRef, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ImageBackground,
//   SafeAreaView,
//   StatusBar,
//   ScrollView,
//   Modal,
//   Platform,
//   useWindowDimensions,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { LinearGradient } from "expo-linear-gradient";

// const MAX_LEVEL = 100;
// const QUESTIONS_PER_LEVEL = 4;
// const START_COINS = 80;
// const QUESTION_TIME = 20;

// const QUIZ_BG = require("../assets/images/quizbackground.png");

// const BASE_LEVELS = {
//   1: [
//     { q: "The Sun is a ______.", o: ["planet", "star", "moon", "cloud"], a: 1 },
//     { q: "Plants need ______ to grow.", o: ["sand", "water", "stone", "plastic"], a: 1 },
//     { q: "We breathe in ______.", o: ["carbon dioxide", "smoke", "oxygen", "water"], a: 2 },
//     { q: "Fish live in ______.", o: ["air", "land", "trees", "water"], a: 3 },
//   ],
//   2: [
//     { q: "The Earth moves around the ______.", o: ["moon", "sun", "stars", "clouds"], a: 1 },
//     { q: "The color of the sky is ______.", o: ["green", "blue", "red", "yellow"], a: 1 },
//     { q: "Humans have ______ sense organs.", o: ["three", "four", "five", "six"], a: 2 },
//     { q: "The moon shines by reflecting ______ light.", o: ["star", "bulb", "sun", "fire"], a: 2 },
//   ],
//   3: [
//     { q: "A baby plant is called a ______.", o: ["leaf", "seedling", "branch", "root"], a: 1 },
//     { q: "The largest planet is ______.", o: ["earth", "mars", "jupiter", "venus"], a: 2 },
//     { q: "Animals need ______ to live.", o: ["water", "toys", "cars", "books"], a: 0 },
//     { q: "The hardest part of our body is ______.", o: ["skin", "bone", "tooth", "hair"], a: 2 },
//   ],
//   4: [
//     { q: "The shape of the Earth is ______.", o: ["flat", "round", "square", "triangle"], a: 1 },
//     { q: "We get milk from ______.", o: ["dog", "cat", "cow", "lion"], a: 2 },
//     { q: "The national bird of India is ______.", o: ["crow", "peacock", "sparrow", "eagle"], a: 1 },
//     { q: "The largest animal is the ______.", o: ["elephant", "giraffe", "whale", "horse"], a: 2 },
//   ],
//   5: [
//     { q: "The planet we live on is ______.", o: ["mars", "jupiter", "earth", "venus"], a: 2 },
//     { q: "We use ______ to see.", o: ["nose", "ears", "eyes", "hands"], a: 2 },
//     { q: "The number of days in a week is ______.", o: ["5", "6", "7", "8"], a: 2 },
//     { q: "The festival of lights is ______.", o: ["holi", "diwali", "eid", "christmas"], a: 1 },
//   ],
//   6: [
//     { q: "The national animal of India is the ______.", o: ["lion", "tiger", "elephant", "leopard"], a: 1 },
//     { q: "The national flower of India is the ______.", o: ["rose", "lotus", "sunflower", "lily"], a: 1 },
//     { q: "The national fruit of India is the ______.", o: ["mango", "apple", "banana", "orange"], a: 0 },
//     { q: "The national bird of India is the ______.", o: ["crow", "peacock", "sparrow", "parrot"], a: 1 },
//   ],
//   7: [
//     { q: "India’s capital city is ______.", o: ["Mumbai", "Chennai", "New Delhi", "Kolkata"], a: 2 },
//     { q: "The Prime Minister of India lives in ______.", o: ["Rashtrapati Bhavan", "Parliament", "White House", "PM House"], a: 3 },
//     { q: "The Indian national flag has ______ colors.", o: ["2", "3", "4", "5"], a: 1 },
//     { q: "The Indian currency is called ______.", o: ["Dollar", "Rupee", "Euro", "Pound"], a: 1 },
//   ],
//   8: [
//     { q: "A group of stars is called a ______.", o: ["galaxy", "constellation", "planet", "orbit"], a: 1 },
//     { q: "The biggest ocean is the ______ Ocean.", o: ["Indian", "Atlantic", "Pacific", "Arctic"], a: 2 },
//     { q: "The tallest mountain in the world is ______.", o: ["K2", "Mount Everest", "Kangchenjunga", "Alps"], a: 1 },
//     { q: "The largest continent is ______.", o: ["Africa", "Europe", "Asia", "Australia"], a: 2 },
//   ],
//   9: [
//     { q: "The day after Sunday is ______.", o: ["Saturday", "Monday", "Friday", "Tuesday"], a: 1 },
//     { q: "There are ______ months in a year.", o: ["10", "11", "12", "13"], a: 2 },
//     { q: "A year has ______ days.", o: ["360", "364", "365", "366"], a: 2 },
//     { q: "February has ______ days in a leap year.", o: ["28", "29", "30", "31"], a: 1 },
//   ],
//   10: [
//     { q: "The largest land animal is the ______.", o: ["horse", "elephant", "giraffe", "rhino"], a: 1 },
//     { q: "The fastest land animal is the ______.", o: ["tiger", "lion", "cheetah", "leopard"], a: 2 },
//     { q: "The animal known as the Ship of the Desert is the ______.", o: ["horse", "camel", "donkey", "cow"], a: 1 },
//     { q: "The largest bird in the world is the ______.", o: ["eagle", "ostrich", "peacock", "sparrow"], a: 1 },
//   ],
//   11: [
//     { q: "The Sun is a star.", o: ["True", "False"], a: 0 },
//     { q: "Fish live on land.", o: ["True", "False"], a: 1 },
//     { q: "Humans have five senses.", o: ["True", "False"], a: 0 },
//     { q: "The Moon gives its own light.", o: ["True", "False"], a: 1 },
//   ],
//   12: [
//     { q: "Plants need water to grow.", o: ["True", "False"], a: 0 },
//     { q: "Dogs can fly.", o: ["True", "False"], a: 1 },
//     { q: "The sky is blue.", o: ["True", "False"], a: 0 },
//     { q: "Ice is hot.", o: ["True", "False"], a: 1 },
//   ],
//   13: [
//     { q: "There are 7 days in a week.", o: ["True", "False"], a: 0 },
//     { q: "A year has 10 months.", o: ["True", "False"], a: 1 },
//     { q: "We breathe oxygen.", o: ["True", "False"], a: 0 },
//     { q: "The Sun rises in the west.", o: ["True", "False"], a: 1 },
//   ],
//   14: [
//     { q: "An elephant is the largest land animal.", o: ["True", "False"], a: 0 },
//     { q: "Birds have teeth.", o: ["True", "False"], a: 1 },
//     { q: "Milk is white in color.", o: ["True", "False"], a: 0 },
//     { q: "Fire is cold.", o: ["True", "False"], a: 1 },
//   ],
//   15: [
//     { q: "Water freezes into ice.", o: ["True", "False"], a: 0 },
//     { q: "The Earth is flat.", o: ["True", "False"], a: 1 },
//     { q: "We use our eyes to see.", o: ["True", "False"], a: 0 },
//     { q: "Rain comes from clouds.", o: ["True", "False"], a: 0 },
//   ],
//   16: [
//     { q: "Day, Night, Day, Night, ___ ?", o: ["Night", "Day", "Evening", "Morning"], a: 1 },
//     { q: "Solid, Liquid, Gas, ___ ?", o: ["Water", "Ice", "Plasma", "Stone"], a: 2 },
//     { q: "Seed, Plant, Flower, ___ ?", o: ["Leaf", "Fruit", "Root", "Stem"], a: 1 },
//     { q: "Sunrise, Noon, Sunset, ___ ?", o: ["Morning", "Night", "Evening", "Afternoon"], a: 1 },
//   ],
//   17: [
//     { q: "Spring, Summer, Autumn, ___ ?", o: ["Winter", "Rainy", "Cold", "Hot"], a: 0 },
//     { q: "Egg, Chick, Hen, ___ ?", o: ["Rooster", "Bird", "Egg", "Chicken"], a: 2 },
//     { q: "Monday, Tuesday, Wednesday, ___ ?", o: ["Sunday", "Friday", "Thursday", "Saturday"], a: 2 },
//     { q: "Earth, Moon, Sun, ___ ?", o: ["Star", "Planet", "Galaxy", "Sky"], a: 3 },
//   ],
//   18: [
//     { q: "Red, Orange, Yellow, ___ ?", o: ["Blue", "Green", "Purple", "Pink"], a: 1 },
//     { q: "Baby, Child, Teen, ___ ?", o: ["Old", "Adult", "Infant", "Youth"], a: 1 },
//     { q: "Rain, River, Sea, ___ ?", o: ["Cloud", "Ocean", "Water", "Ice"], a: 1 },
//     { q: "Small, Medium, Large, ___ ?", o: ["Huge", "Short", "Tiny", "Big"], a: 0 },
//   ],
//   19: [
//     { q: "Head, Shoulder, Knee, ___ ?", o: ["Hand", "Foot", "Toe", "Neck"], a: 2 },
//     { q: "Morning, Afternoon, Evening, ___ ?", o: ["Noon", "Night", "Day", "Dawn"], a: 1 },
//     { q: "Ice, Water, Steam, ___ ?", o: ["Gas", "Liquid", "Solid", "Cloud"], a: 0 },
//     { q: "Sun, Mercury, Venus, ___ ?", o: ["Earth", "Mars", "Jupiter", "Saturn"], a: 0 },
//   ],
//   20: [
//     { q: "Inhale, Exhale, Inhale, ___ ?", o: ["Breathe", "Exhale", "Stop", "Air"], a: 1 },
//     { q: "Push, Pull, Push, ___ ?", o: ["Stop", "Lift", "Pull", "Drop"], a: 2 },
//     { q: "Seed, Root, Stem, ___ ?", o: ["Leaf", "Flower", "Fruit", "Plant"], a: 0 },
//     { q: "Hot, Warm, Cool, ___ ?", o: ["Cold", "Heat", "Fire", "Ice"], a: 0 },
//   ],
//   21: [
//     { q: "M__rket", o: ["o", "a", "i", "e"], a: 1 },
//     { q: "C__nsumer", o: ["o", "u", "a", "i"], a: 0 },
//     { q: "S__pply", o: ["a", "i", "u", "o"], a: 2 },
//     { q: "D__mand", o: ["i", "e", "a", "o"], a: 1 },
//   ],
//   22: [
//     { q: "P__oduction", o: ["r", "o", "a", "u"], a: 0 },
//     { q: "C__pital", o: ["o", "a", "i", "e"], a: 1 },
//     { q: "I__vestment", o: ["n", "a", "o", "e"], a: 0 },
//     { q: "R__venue", o: ["i", "a", "e", "o"], a: 2 },
//   ],
//   23: [
//     { q: "B__dget", o: ["a", "e", "u", "o"], a: 2 },
//     { q: "E__onomy", o: ["c", "k", "v", "x"], a: 0 },
//     { q: "T__x", o: ["i", "a", "o", "e"], a: 1 },
//     { q: "P__ofit", o: ["a", "i", "r", "o"], a: 2 },
//   ],
//   24: [
//     { q: "E__penditure", o: ["a", "i", "o", "x"], a: 3 },
//     { q: "S__vings", o: ["e", "i", "a", "o"], a: 2 },
//     { q: "B__nking", o: ["a", "i", "o", "e"], a: 0 },
//     { q: "L__ability", o: ["a", "i", "o", "e"], a: 1 },
//   ],
//   25: [
//     { q: "I__flation", o: ["n", "a", "e", "o"], a: 0 },
//     { q: "D__ficit", o: ["e", "i", "a", "o"], a: 1 },
//     { q: "S__ock", o: ["i", "t", "a", "o"], a: 1 },
//     { q: "D__vidend", o: ["a", "e", "i", "o"], a: 2 },
//   ],
//   26: [
//     { q: "Which animal says 'Moo'?", o: ["Dog", "Cat", "Cow", "Sheep"], a: 2 },
//     { q: "Which animal says 'Baa'?", o: ["Goat", "Sheep", "Horse", "Pig"], a: 1 },
//     { q: "Which animal says 'Neigh'?", o: ["Horse", "Donkey", "Cow", "Dog"], a: 0 },
//     { q: "Which animal says 'Oink'?", o: ["Dog", "Pig", "Cat", "Cow"], a: 1 },
//   ],
//   27: [
//     { q: "Which animal says 'Woof'?", o: ["Dog", "Cat", "Cow", "Lion"], a: 0 },
//     { q: "Which animal says 'Meow'?", o: ["Dog", "Lion", "Cat", "Tiger"], a: 2 },
//     { q: "Which animal says 'Roar'?", o: ["Tiger", "Lion", "Elephant", "Bear"], a: 1 },
//     { q: "Which animal says 'Trumpet'?", o: ["Horse", "Elephant", "Dog", "Lion"], a: 1 },
//   ],
//   28: [
//     { q: "Which animal says 'Hiss'?", o: ["Cat", "Dog", "Tiger", "Snake"], a: 3 },
//     { q: "Which animal says 'Quack'?", o: ["Goose", "Duck", "Chicken", "Swan"], a: 1 },
//     { q: "Which animal says 'Cluck'?", o: ["Duck", "Turkey", "Chicken", "Goose"], a: 2 },
//     { q: "Which animal says 'Coo'?", o: ["Pigeon", "Crow", "Owl", "Parrot"], a: 0 },
//   ],
//   29: [
//     { q: "Which animal says 'Howl'?", o: ["Dog", "Wolf", "Fox", "Bear"], a: 1 },
//     { q: "Which animal says 'Buzz'?", o: ["Bee", "Fly", "Ant", "Wasp"], a: 0 },
//     { q: "Which animal says 'Honk'?", o: ["Duck", "Swan", "Pelican", "Goose"], a: 3 },
//     { q: "Which animal says 'Screech'?", o: ["Eagle", "Owl", "Parrot", "Crow"], a: 1 },
//   ],
//   30: [
//     { q: "Which animal says 'Growl'?", o: ["Bear", "Lion", "Tiger", "Dog"], a: 0 },
//     { q: "Which animal says 'Chirp'?", o: ["Chicken", "Sparrow", "Bird", "Parrot"], a: 2 },
//     { q: "Which animal says 'Snort'?", o: ["Horse", "Donkey", "Pig", "Cow"], a: 2 },
//     { q: "Which animal says 'Caw'?", o: ["Raven", "Crow", "Pigeon", "Owl"], a: 1 },
//   ],
// };

// const buildLevels = () => {
//   const finalLevels = { ...BASE_LEVELS };

//   for (let level = 31; level <= MAX_LEVEL; level += 1) {
//     const sourceLevel = ((level - 1) % 30) + 1;

//     finalLevels[level] = BASE_LEVELS[sourceLevel].map((item, index) => {
//       const options = [...item.o];

//       return {
//         q: `${item.q}`,
//         o: options,
//         a: item.a,
//         id: `level-${level}-q-${index + 1}`,
//       };
//     });
//   }

//   return finalLevels;
// };

// const LEVELS = buildLevels();

// const POWERUPS = [
//   { key: "hint", label: "Hint", icon: "bulb", cost: 15, color: "#22C55E" },
//   { key: "fifty", label: "50/50", icon: "git-compare", cost: 20, color: "#3B82F6" },
//   { key: "time", label: "+10s", icon: "time", cost: 25, color: "#F59E0B" },
//   { key: "skip", label: "Skip", icon: "play-forward", cost: 30, color: "#A855F7" },
// ];

// const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// export default function QuizGameScreen({ navigation }) {
//   const { width, height } = useWindowDimensions();

//   const [started, setStarted] = useState(false);
//   const [level, setLevel] = useState(1);
//   const [unlockedLevel, setUnlockedLevel] = useState(1);
//   const [coins, setCoins] = useState(START_COINS);

//   const [questionIndex, setQuestionIndex] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
//   const [selectedAnswer, setSelectedAnswer] = useState(null);
//   const [answered, setAnswered] = useState(false);

//   const [correctInLevel, setCorrectInLevel] = useState(0);
//   const [totalCorrect, setTotalCorrect] = useState(0);
//   const [bestStars, setBestStars] = useState({});

//   const [hiddenOptions, setHiddenOptions] = useState([]);
//   const [hintText, setHintText] = useState("");

//   const [levelCompleteVisible, setLevelCompleteVisible] = useState(false);
//   const [gameOverVisible, setGameOverVisible] = useState(false);
//   const [levelsVisible, setLevelsVisible] = useState(false);

//   const [lastReward, setLastReward] = useState(0);
//   const [lastStars, setLastStars] = useState(0);
//   const [toast, setToast] = useState("");

//   const toastTimer = useRef(null);

//   const pageWidth = Math.min(width - 18, 430);
//   const isSmallHeight = height < 720;
//   const question = LEVELS[level]?.[questionIndex] || LEVELS[1][0];
//   const progress = (questionIndex + 1) / QUESTIONS_PER_LEVEL;
//   const timerPercent = clamp(timeLeft / QUESTION_TIME, 0, 1);

//   const showToast = (message) => {
//     setToast(message);

//     if (toastTimer.current) clearTimeout(toastTimer.current);

//     toastTimer.current = setTimeout(() => {
//       setToast("");
//     }, 1400);
//   };

//   useEffect(() => {
//     if (!started || answered || levelCompleteVisible || gameOverVisible || levelsVisible) {
//       return undefined;
//     }

//     const interval = setInterval(() => {
//       setTimeLeft((prev) => Math.max(prev - 1, 0));
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [started, answered, levelCompleteVisible, gameOverVisible, levelsVisible]);

//   useEffect(() => {
//     if (!started || answered) return;

//     if (timeLeft === 0) {
//       handleAnswer(-1);
//     }
//   }, [timeLeft, started, answered]);

//   useEffect(() => {
//     return () => {
//       if (toastTimer.current) clearTimeout(toastTimer.current);
//     };
//   }, []);

//   const handleBack = () => {
//     if (navigation?.canGoBack?.()) {
//       navigation.goBack();
//       return;
//     }

//     navigation?.navigate?.("FunGames");
//   };

//   const resetQuestionState = () => {
//     setTimeLeft(QUESTION_TIME);
//     setSelectedAnswer(null);
//     setAnswered(false);
//     setHiddenOptions([]);
//     setHintText("");
//   };

//   const initLevel = (targetLevel) => {
//     const safeLevel = clamp(targetLevel, 1, MAX_LEVEL);

//     setLevel(safeLevel);
//     setQuestionIndex(0);
//     setCorrectInLevel(0);
//     resetQuestionState();

//     setLevelCompleteVisible(false);
//     setGameOverVisible(false);
//   };

//   const finishLevel = (finalCorrect) => {
//     const stars = finalCorrect >= 4 ? 3 : finalCorrect >= 2 ? 2 : 1;
//     const reward = level * 2 + stars * 20 + finalCorrect * 10;

//     setLastStars(stars);
//     setLastReward(reward);
//     setCoins((prev) => prev + reward);

//     setBestStars((prev) => ({
//       ...prev,
//       [level]: Math.max(prev[level] || 0, stars),
//     }));

//     if (level === unlockedLevel && level < MAX_LEVEL) {
//       setUnlockedLevel(level + 1);
//     }

//     setLevelCompleteVisible(true);
//   };

//   const goNextQuestion = (updatedCorrect) => {
//     if (questionIndex + 1 >= QUESTIONS_PER_LEVEL) {
//       finishLevel(updatedCorrect);
//       return;
//     }

//     setQuestionIndex((prev) => prev + 1);
//     resetQuestionState();
//   };

//   const handleAnswer = (answerIndex) => {
//     if (answered) return;

//     const correct = answerIndex === question.a;
//     const updatedCorrect = correct ? correctInLevel + 1 : correctInLevel;

//     setSelectedAnswer(answerIndex);
//     setAnswered(true);

//     if (correct) {
//       setCoins((prev) => prev + 10);
//       setCorrectInLevel(updatedCorrect);
//       setTotalCorrect((prev) => prev + 1);
//     }

//     setTimeout(() => {
//       goNextQuestion(updatedCorrect);
//     }, 850);
//   };

//   const payCoins = (cost) => {
//     if (coins < cost) {
//       showToast(`Need ${cost} coins`);
//       return false;
//     }

//     setCoins((prev) => prev - cost);
//     return true;
//   };

//   const useHint = () => {
//     if (answered) return;
//     if (!payCoins(15)) return;

//     const correctOption = question.o[question.a];
//     setHintText(`Hint: Correct answer is "${correctOption}"`);
//   };

//   const useFifty = () => {
//     if (answered) return;
//     if (hiddenOptions.length) {
//       showToast("50/50 already used");
//       return;
//     }

//     if (!payCoins(20)) return;

//     const wrongOptions = question.o
//       .map((_, index) => index)
//       .filter((index) => index !== question.a);

//     setHiddenOptions(wrongOptions.slice(0, Math.min(2, wrongOptions.length)));
//   };

//   const useTime = () => {
//     if (answered) return;
//     if (!payCoins(25)) return;

//     setTimeLeft((prev) => prev + 10);
//     showToast("+10 seconds");
//   };

//   const useSkip = () => {
//     if (answered) return;
//     if (!payCoins(30)) return;

//     goNextQuestion(correctInLevel);
//   };

//   const handlePowerup = (key) => {
//     if (key === "hint") useHint();
//     if (key === "fifty") useFifty();
//     if (key === "time") useTime();
//     if (key === "skip") useSkip();
//   };

//   const nextLevel = () => {
//     setLevelCompleteVisible(false);

//     if (level >= MAX_LEVEL) {
//       setGameOverVisible(true);
//       return;
//     }

//     initLevel(level + 1);
//   };

//   const restartGame = () => {
//     setCoins(START_COINS);
//     setUnlockedLevel(1);
//     setBestStars({});
//     setTotalCorrect(0);
//     setStarted(true);
//     initLevel(1);
//   };

//   const openLevel = (targetLevel) => {
//     if (targetLevel > unlockedLevel) {
//       const cost = targetLevel * 10;

//       if (coins < cost) {
//         showToast(`Need ${cost} coins to unlock`);
//         return;
//       }

//       setCoins((prev) => prev - cost);
//       setUnlockedLevel((prev) => Math.max(prev, targetLevel));
//       setLevelsVisible(false);
//       setStarted(true);
//       initLevel(targetLevel);
//       return;
//     }

//     setLevelsVisible(false);
//     setStarted(true);
//     initLevel(targetLevel);
//   };

//   const renderOption = (option, index) => {
//     const isCorrect = answered && index === question.a;
//     const isWrong = answered && selectedAnswer === index && selectedAnswer !== question.a;
//     const isHidden = hiddenOptions.includes(index);

//     if (isHidden) {
//       return (
//         <View key={`hidden-${index}`} style={[styles.optionButton, styles.optionHidden]}>
//           <Text style={styles.optionHiddenText}>Removed</Text>
//         </View>
//       );
//     }

//     return (
//       <TouchableOpacity
//         key={`${question.q}-${index}`}
//         activeOpacity={0.86}
//         disabled={answered}
//         onPress={() => handleAnswer(index)}
//         style={[
//           styles.optionButton,
//           isCorrect && styles.optionCorrect,
//           isWrong && styles.optionWrong,
//         ]}
//       >
//         <View style={styles.optionCircle}>
//           <Text style={styles.optionCircleText}>{String.fromCharCode(65 + index)}</Text>
//         </View>

//         <Text style={styles.optionText}>{option}</Text>
//       </TouchableOpacity>
//     );
//   };

//   const renderLevelButton = (itemLevel) => {
//     const locked = itemLevel > unlockedLevel;
//     const stars = bestStars[itemLevel] || 0;
//     const current = itemLevel === level;

//     return (
//       <TouchableOpacity
//         key={`level-${itemLevel}`}
//         activeOpacity={0.85}
//         onPress={() => openLevel(itemLevel)}
//         style={[
//           styles.levelButton,
//           locked && styles.levelButtonLocked,
//           current && styles.levelButtonCurrent,
//         ]}
//       >
//         <Text style={[styles.levelButtonText, locked && styles.levelButtonLockedText]}>
//           {locked ? "🔒" : itemLevel}
//         </Text>

//         {!locked && (
//           <Text style={styles.levelStarText}>
//             {stars > 0 ? "★".repeat(stars) : "•"}
//           </Text>
//         )}
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <View
//       style={[
//         styles.root,
//         Platform.OS === "web" && {
//           width: "100vw",
//           height: "100vh",
//           overflow: "hidden",
//         },
//       ]}
//     >
//       <ImageBackground source={QUIZ_BG} style={styles.bg} resizeMode="cover">
//         <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

//         <LinearGradient
//           colors={[
//             "rgba(0,0,0,0.10)",
//             "rgba(0,0,0,0.32)",
//             "rgba(0,0,0,0.74)",
//             "rgba(0,0,0,0.90)",
//           ]}
//           locations={[0, 0.34, 0.72, 1]}
//           style={styles.overlay}
//         >
//           <SafeAreaView style={styles.safe}>
//             <ScrollView
//               style={styles.scroll}
//               showsVerticalScrollIndicator={false}
//               contentContainerStyle={[
//                 styles.scrollContent,
//                 { minHeight: height - (Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0) },
//               ]}
//             >
//               <View style={[styles.headerShell, { width: pageWidth }]}>
//                 <View style={styles.topHeader}>
//                   <TouchableOpacity activeOpacity={0.85} style={styles.backButton} onPress={handleBack}>
//                     <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
//                   </TouchableOpacity>

//                   <View style={styles.titleBox}>
//                     <Text style={styles.title}>Fun Quiz</Text>
//                     <Text style={styles.subtitle}>Level {level} / {MAX_LEVEL}</Text>
//                   </View>

//                   <TouchableOpacity
//                     activeOpacity={0.85}
//                     style={styles.levelsButton}
//                     onPress={() => setLevelsVisible(true)}
//                   >
//                     <Ionicons name="grid" size={23} color="#FFFFFF" />
//                   </TouchableOpacity>
//                 </View>

//                 <View style={styles.statsRow}>
//                   <StatPill icon="cash" value={`${coins}`} color="#FFD86B" />
//                   <StatPill icon="time" value={`${timeLeft}s`} color="#FF5C7A" />
//                   <StatPill icon="checkmark-done" value={`${questionIndex + 1}/${QUESTIONS_PER_LEVEL}`} color="#22C55E" />
//                 </View>

//                 <View style={styles.timerTrack}>
//                   <View style={[styles.timerFill, { width: `${timerPercent * 100}%` }]} />
//                 </View>

//                 <View style={styles.progressTrack}>
//                   <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
//                 </View>
//               </View>

//               <View style={[styles.quizCard, { width: pageWidth }]}>
//                 <View style={styles.questionBadge}>
//                   <Ionicons name="help-circle" size={20} color="#FFFFFF" />
//                   <Text style={styles.questionBadgeText}>Question {questionIndex + 1}</Text>
//                 </View>

//                 <Text style={styles.questionText}>{question.q}</Text>

//                 {!!hintText && (
//                   <View style={styles.hintBox}>
//                     <Ionicons name="bulb" size={17} color="#FFD86B" />
//                     <Text style={styles.hintText}>{hintText}</Text>
//                   </View>
//                 )}

//                 <View style={styles.optionsBox}>
//                   {question.o.map((option, index) => renderOption(option, index))}
//                 </View>

//                 {answered && (
//                   <Text style={styles.answerMessage}>
//                     {selectedAnswer === question.a ? "🎉 Correct!" : "❌ Wrong answer!"}
//                   </Text>
//                 )}
//               </View>

//               <View style={[styles.powerPanel, { width: pageWidth }]}>
//                 {POWERUPS.map((item) => (
//                   <PowerButton
//                     key={item.key}
//                     icon={item.icon}
//                     label={item.label}
//                     cost={item.cost}
//                     color={item.color}
//                     onPress={() => handlePowerup(item.key)}
//                   />
//                 ))}
//               </View>
//             </ScrollView>
//           </SafeAreaView>
//         </LinearGradient>
//       </ImageBackground>

//       <Modal transparent visible={!started} animationType="fade">
//         <View style={styles.modalBackdrop}>
//           <View style={styles.startCard}>
//             <Text style={styles.startEmoji}>🌟</Text>
//             <Text style={styles.startTitle}>Fun Quiz Game</Text>
//             <Text style={styles.startDesc}>
//               Complete 100 quiz levels, answer questions, collect coins, and unlock levels.
//             </Text>

//             <TouchableOpacity
//               activeOpacity={0.9}
//               style={styles.startButton}
//               onPress={() => {
//                 setStarted(true);
//                 initLevel(level);
//               }}
//             >
//               <Ionicons name="play" size={24} color="#111827" />
//               <Text style={styles.startButtonText}>Start Quiz</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       <Modal transparent visible={levelCompleteVisible} animationType="fade">
//         <View style={styles.modalBackdrop}>
//           <View style={styles.resultCard}>
//             <Text style={styles.resultEmoji}>🎉</Text>
//             <Text style={styles.resultTitle}>Level Complete!</Text>
//             <Text style={styles.resultSub}>You completed level {level}</Text>

//             <Text style={styles.starsText}>{"★".repeat(lastStars)}</Text>

//             <View style={styles.rewardPill}>
//               <Ionicons name="cash" size={21} color="#FFD86B" />
//               <Text style={styles.rewardText}>+{lastReward} Coins</Text>
//             </View>

//             <TouchableOpacity activeOpacity={0.9} style={styles.nextButton} onPress={nextLevel}>
//               <Text style={styles.nextButtonText}>
//                 {level >= MAX_LEVEL ? "Finish Game" : "Next Level"}
//               </Text>
//               <Ionicons name="arrow-forward" size={20} color="#111827" />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       <Modal transparent visible={gameOverVisible} animationType="fade">
//         <View style={styles.modalBackdrop}>
//           <View style={styles.resultCard}>
//             <Text style={styles.resultEmoji}>🏆</Text>
//             <Text style={styles.resultTitle}>Game Complete!</Text>
//             <Text style={styles.resultSub}>Total Correct Answers: {totalCorrect}</Text>

//             <View style={styles.rewardPill}>
//               <Ionicons name="cash" size={21} color="#FFD86B" />
//               <Text style={styles.rewardText}>{coins} Coins</Text>
//             </View>

//             <TouchableOpacity activeOpacity={0.9} style={styles.nextButton} onPress={restartGame}>
//               <Ionicons name="refresh" size={20} color="#111827" />
//               <Text style={styles.nextButtonText}>Restart</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       <Modal transparent visible={levelsVisible} animationType="slide">
//         <View style={styles.modalBackdrop}>
//           <View style={styles.levelsCard}>
//             <View style={styles.levelsHeader}>
//               <View>
//                 <Text style={styles.levelsTitle}>Choose Level</Text>
//                 <Text style={styles.levelsSub}>
//                   Unlocked {unlockedLevel} / {MAX_LEVEL}
//                 </Text>
//               </View>

//               <TouchableOpacity
//                 activeOpacity={0.85}
//                 style={styles.closeButton}
//                 onPress={() => setLevelsVisible(false)}
//               >
//                 <Ionicons name="close" size={24} color="#FFFFFF" />
//               </TouchableOpacity>
//             </View>

//             <Text style={styles.levelsHint}>
//               Locked levels can be unlocked using coins. Unlock cost = level × 10 coins.
//             </Text>

//             <ScrollView showsVerticalScrollIndicator={false}>
//               <View style={styles.levelsGrid}>
//                 {Array.from({ length: MAX_LEVEL }, (_, index) => renderLevelButton(index + 1))}
//               </View>
//             </ScrollView>
//           </View>
//         </View>
//       </Modal>

//       {!!toast && (
//         <View style={styles.toast}>
//           <Text style={styles.toastText}>{toast}</Text>
//         </View>
//       )}
//     </View>
//   );
// }

// function StatPill({ icon, value, color }) {
//   return (
//     <View style={styles.statPill}>
//       <Ionicons name={icon} size={16} color={color} />
//       <Text style={styles.statText}>{value}</Text>
//     </View>
//   );
// }

// function PowerButton({ icon, label, cost, color, onPress }) {
//   return (
//     <TouchableOpacity activeOpacity={0.86} style={styles.powerButton} onPress={onPress}>
//       <View style={[styles.powerCircle, { backgroundColor: color }]}>
//         <Ionicons name={icon} size={20} color="#FFFFFF" />
//       </View>

//       <Text style={styles.powerLabel}>{label}</Text>

//       <View style={styles.powerCostRow}>
//         <Ionicons name="cash" size={11} color="#FFD86B" />
//         <Text style={styles.powerCost}>{cost}</Text>
//       </View>
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   root: {
//     flex: 1,
//     backgroundColor: "#050816",
//   },

//   bg: {
//     flex: 1,
//     width: "100%",
//     height: "100%",
//   },

//   overlay: {
//     flex: 1,
//   },

//   safe: {
//     flex: 1,
//     paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 24 : 0,
//   },

//   scroll: {
//     flex: 1,
//   },

//   scrollContent: {
//     flexGrow: 1,
//     alignItems: "center",
//     paddingTop: 10,
//     paddingBottom: 24,
//   },


//   topHeader: {
//     marginTop:40,
//     height: 58,
//     borderRadius: 22,
//     backgroundColor: "#073A78",
//     borderWidth: 1.5,
//     borderColor: "rgba(255,255,255,0.18)",
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 8,
//   },

//   backButton: {
//     width: 42,
//     height: 42,
//     borderRadius: 21,
//     backgroundColor: "#FF9D2E",
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 2,
//     borderColor: "#FFD474",
//   },

//   titleBox: {
//     flex: 1,
//     alignItems: "center",
//   },

//   title: {
//     color: "#FFFFFF",
//     fontSize: 22,
//     fontWeight: "900",
//   },

//   subtitle: {
//     color: "#BFFAFE",
//     fontSize: 12,
//     fontWeight: "900",
//   },

//   levelsButton: {
//     width: 42,
//     height: 42,
//     borderRadius: 15,
//     backgroundColor: "#22C55E",
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 2,
//     borderColor: "#A7F3D0",
//   },

//   statsRow: {
//     flexDirection: "row",
//     marginTop: 8,
//   },

//   statPill: {
//     flex: 1,
//     height: 36,
//     marginHorizontal: 4,
//     borderRadius: 18,
//     backgroundColor: "rgba(0,0,0,0.36)",
//     borderWidth: 1,
//     borderColor: "rgba(255,255,255,0.15)",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   statText: {
//     color: "#FFFFFF",
//     fontSize: 12,
//     fontWeight: "900",
//     marginLeft: 5,
//   },

//   timerTrack: {
//     height: 9,
//     marginTop: 8,
//     marginHorizontal: 10,
//     borderRadius: 20,
//     backgroundColor: "rgba(255,255,255,0.14)",
//     overflow: "hidden",
//   },

//   timerFill: {
//     height: "100%",
//     backgroundColor: "#FFD86B",
//     borderRadius: 20,
//   },

//   progressTrack: {
//     height: 6,
//     marginTop: 6,
//     marginHorizontal: 10,
//     borderRadius: 20,
//     backgroundColor: "rgba(255,255,255,0.12)",
//     overflow: "hidden",
//   },

//   progressFill: {
//     height: "100%",
//     backgroundColor: "#22C55E",
//     borderRadius: 20,
//   },

//   quizCard: {
//     marginTop: 14,
//     borderRadius: 28,
//     padding: 15,
//     backgroundColor: "rgba(6, 11, 35, 0.92)",
//     borderWidth: 2,
//     borderColor: "#22D3EE",
//   },

//   questionBadge: {
//     alignSelf: "flex-start",
//     height: 32,
//     borderRadius: 16,
//     paddingHorizontal: 12,
//     backgroundColor: "#2563EB",
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   questionBadgeText: {
//     color: "#FFFFFF",
//     fontSize: 12,
//     fontWeight: "900",
//     marginLeft: 5,
//   },

//   questionText: {
//     color: "#FFFFFF",
//     fontSize: 20,
//     fontWeight: "900",
//     lineHeight: 27,
//     marginTop: 14,
//     textAlign: "center",
//   },

//   hintBox: {
//     marginTop: 12,
//     borderRadius: 16,
//     padding: 10,
//     backgroundColor: "rgba(255,216,107,0.15)",
//     borderWidth: 1,
//     borderColor: "rgba(255,216,107,0.35)",
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   hintText: {
//     color: "#FFFFFF",
//     fontSize: 12,
//     fontWeight: "800",
//     marginLeft: 6,
//     flex: 1,
//   },

//   optionsBox: {
//     marginTop: 16,
//   },

//   optionButton: {
//     minHeight: 54,
//     borderRadius: 18,
//     backgroundColor: "rgba(255,255,255,0.14)",
//     borderWidth: 1.5,
//     borderColor: "rgba(255,255,255,0.18)",
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 12,
//     marginBottom: 10,
//   },

//   optionCorrect: {
//     backgroundColor: "rgba(34,197,94,0.9)",
//     borderColor: "#BBF7D0",
//   },

//   optionWrong: {
//     backgroundColor: "rgba(239,68,68,0.9)",
//     borderColor: "#FECACA",
//   },

//   optionHidden: {
//     justifyContent: "center",
//     backgroundColor: "rgba(255,255,255,0.07)",
//   },

//   optionHiddenText: {
//     color: "rgba(255,255,255,0.55)",
//     fontSize: 14,
//     fontWeight: "900",
//   },

//   optionCircle: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: "rgba(255,255,255,0.22)",
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 10,
//   },

//   optionCircleText: {
//     color: "#FFFFFF",
//     fontSize: 13,
//     fontWeight: "900",
//   },

//   optionText: {
//     flex: 1,
//     color: "#FFFFFF",
//     fontSize: 15,
//     fontWeight: "900",
//   },

//   answerMessage: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "900",
//     textAlign: "center",
//     marginTop: 6,
//   },

//   powerPanel: {
//     marginTop: 12,
//     borderRadius: 24,
//     borderWidth: 2,
//     borderColor: "#22D3EE",
//     backgroundColor: "rgba(6, 11, 35, 0.94)",
//     flexDirection: "row",
//     padding: 7,
//   },

//   powerButton: {
//     flex: 1,
//     minHeight: 72,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   powerCircle: {
//     width: 38,
//     height: 38,
//     borderRadius: 19,
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 2,
//     borderColor: "rgba(255,255,255,0.35)",
//   },

//   powerLabel: {
//     color: "#FFFFFF",
//     fontSize: 10,
//     fontWeight: "900",
//     marginTop: 4,
//   },

//   powerCostRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 2,
//   },

//   powerCost: {
//     color: "#FFD86B",
//     fontSize: 10,
//     fontWeight: "900",
//     marginLeft: 2,
//   },

//   modalBackdrop: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.78)",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 18,
//   },

//   startCard: {
//     width: "100%",
//     maxWidth: 370,
//     borderRadius: 30,
//     backgroundColor: "#07101F",
//     borderWidth: 2,
//     borderColor: "#22D3EE",
//     padding: 24,
//     alignItems: "center",
//   },

//   startEmoji: {
//     fontSize: 50,
//   },

//   startTitle: {
//     color: "#FFFFFF",
//     fontSize: 28,
//     fontWeight: "900",
//     marginTop: 8,
//   },

//   startDesc: {
//     color: "rgba(255,255,255,0.78)",
//     fontSize: 14,
//     fontWeight: "700",
//     textAlign: "center",
//     lineHeight: 21,
//     marginTop: 10,
//     marginBottom: 20,
//   },

//   startButton: {
//     height: 52,
//     paddingHorizontal: 28,
//     borderRadius: 20,
//     backgroundColor: "#FFD86B",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   startButtonText: {
//     color: "#111827",
//     fontSize: 16,
//     fontWeight: "900",
//     marginLeft: 8,
//   },

//   resultCard: {
//     width: "100%",
//     maxWidth: 370,
//     borderRadius: 30,
//     backgroundColor: "#07101F",
//     borderWidth: 2,
//     borderColor: "#22D3EE",
//     padding: 24,
//     alignItems: "center",
//   },

//   resultEmoji: {
//     fontSize: 50,
//   },

//   resultTitle: {
//     color: "#FFFFFF",
//     fontSize: 25,
//     fontWeight: "900",
//     marginTop: 8,
//   },

//   resultSub: {
//     color: "rgba(255,255,255,0.78)",
//     fontSize: 14,
//     fontWeight: "700",
//     textAlign: "center",
//     marginTop: 6,
//   },

//   starsText: {
//     color: "#FFD86B",
//     fontSize: 29,
//     fontWeight: "900",
//     marginTop: 12,
//   },

//   rewardPill: {
//     marginTop: 15,
//     marginBottom: 18,
//     borderRadius: 18,
//     backgroundColor: "rgba(255,216,107,0.16)",
//     borderWidth: 1,
//     borderColor: "rgba(255,216,107,0.35)",
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   rewardText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "900",
//     marginLeft: 8,
//   },

//   nextButton: {
//     height: 50,
//     borderRadius: 20,
//     paddingHorizontal: 24,
//     backgroundColor: "#FFD86B",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   nextButtonText: {
//     color: "#111827",
//     fontSize: 15,
//     fontWeight: "900",
//     marginRight: 8,
//   },

//   levelsCard: {
//     width: "100%",
//     maxWidth: 410,
//     maxHeight: "86%",
//     borderRadius: 28,
//     backgroundColor: "#07101F",
//     borderWidth: 2,
//     borderColor: "#22D3EE",
//     padding: 14,
//   },

//   levelsHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 10,
//   },

//   levelsTitle: {
//     color: "#FFFFFF",
//     fontSize: 22,
//     fontWeight: "900",
//   },

//   levelsSub: {
//     color: "rgba(255,255,255,0.72)",
//     fontSize: 12,
//     fontWeight: "800",
//     marginTop: 2,
//   },

//   closeButton: {
//     width: 42,
//     height: 42,
//     borderRadius: 16,
//     backgroundColor: "rgba(255,255,255,0.14)",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   levelsHint: {
//     color: "rgba(255,255,255,0.76)",
//     fontSize: 12,
//     fontWeight: "700",
//     lineHeight: 18,
//     marginBottom: 10,
//   },

//   levelsGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "center",
//     paddingBottom: 8,
//   },

//   levelButton: {
//     width: 56,
//     height: 52,
//     borderRadius: 16,
//     backgroundColor: "#22C55E",
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 2,
//     borderColor: "rgba(255,255,255,0.22)",
//     margin: 4,
//   },

//   levelButtonLocked: {
//     backgroundColor: "rgba(255,255,255,0.12)",
//   },

//   levelButtonCurrent: {
//     backgroundColor: "#2563EB",
//     borderColor: "#FFD86B",
//   },

//   levelButtonText: {
//     color: "#FFFFFF",
//     fontSize: 14,
//     fontWeight: "900",
//   },

//   levelButtonLockedText: {
//     fontSize: 16,
//   },

//   levelStarText: {
//     color: "#FFD86B",
//     fontSize: 9,
//     fontWeight: "900",
//     marginTop: 1,
//   },

//   toast: {
//     position: "absolute",
//     left: 24,
//     right: 24,
//     bottom: 105,
//     borderRadius: 18,
//     backgroundColor: "rgba(0,0,0,0.9)",
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "rgba(255,255,255,0.16)",
//   },

//   toastText: {
//     color: "#FFFFFF",
//     fontSize: 13,
//     fontWeight: "900",
//   },
// });



































// screens/QuizGameScreen.js

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Modal,
  Platform,
  useWindowDimensions,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const MAX_LEVEL = 100;
const QUESTIONS_PER_LEVEL = 4;
const START_COINS = 80;
const QUESTION_TIME = 20;

const QUIZ_BG = require("../assets/images/quizbackground.png");

const clamp = (v, mn, mx) => Math.min(Math.max(v, mn), mx);

const QUESTION_BANK = [
  [
    { q: "The Sun is a ______.", o: ["Planet", "Star", "Moon", "Cloud"], a: 1 },
    { q: "Plants need ______ to grow.", o: ["Sand", "Water", "Stone", "Plastic"], a: 1 },
    { q: "We breathe in ______.", o: ["Carbon dioxide", "Smoke", "Oxygen", "Water"], a: 2 },
    { q: "Fish live in ______.", o: ["Air", "Land", "Trees", "Water"], a: 3 },
  ],
  [
    { q: "The Earth moves around the ______.", o: ["Moon", "Sun", "Stars", "Clouds"], a: 1 },
    { q: "The color of the sky is ______.", o: ["Green", "Blue", "Red", "Yellow"], a: 1 },
    { q: "Humans have ______ sense organs.", o: ["Three", "Four", "Five", "Six"], a: 2 },
    { q: "The moon shines by reflecting ______ light.", o: ["Star", "Bulb", "Sun", "Fire"], a: 2 },
  ],
  [
    { q: "A baby plant is called a ______.", o: ["Leaf", "Seedling", "Branch", "Root"], a: 1 },
    { q: "The largest planet is ______.", o: ["Earth", "Mars", "Jupiter", "Venus"], a: 2 },
    { q: "Animals need ______ to live.", o: ["Water", "Toys", "Cars", "Books"], a: 0 },
    { q: "The hardest part of our body is ______.", o: ["Skin", "Bone", "Tooth", "Hair"], a: 2 },
  ],
  [
    { q: "The shape of the Earth is ______.", o: ["Flat", "Round", "Square", "Triangle"], a: 1 },
    { q: "We get milk from ______.", o: ["Dog", "Cat", "Cow", "Lion"], a: 2 },
    { q: "The national bird of India is ______.", o: ["Crow", "Peacock", "Sparrow", "Eagle"], a: 1 },
    { q: "The largest animal is the ______.", o: ["Elephant", "Giraffe", "Whale", "Horse"], a: 2 },
  ],
  [
    { q: "The planet we live on is ______.", o: ["Mars", "Jupiter", "Earth", "Venus"], a: 2 },
    { q: "We use ______ to see.", o: ["Nose", "Ears", "Eyes", "Hands"], a: 2 },
    { q: "The number of days in a week is ______.", o: ["5", "6", "7", "8"], a: 2 },
    { q: "The festival of lights is ______.", o: ["Holi", "Diwali", "Eid", "Christmas"], a: 1 },
  ],
  [
    { q: "The national animal of India is the ______.", o: ["Lion", "Tiger", "Elephant", "Leopard"], a: 1 },
    { q: "The national flower of India is the ______.", o: ["Rose", "Lotus", "Sunflower", "Lily"], a: 1 },
    { q: "The national fruit of India is the ______.", o: ["Mango", "Apple", "Banana", "Orange"], a: 0 },
    { q: "The national bird of India is the ______.", o: ["Crow", "Peacock", "Sparrow", "Parrot"], a: 1 },
  ],
  [
    { q: "India's capital city is ______.", o: ["Mumbai", "Chennai", "New Delhi", "Kolkata"], a: 2 },
    { q: "The Indian national flag has ______ colors.", o: ["2", "3", "4", "5"], a: 1 },
    { q: "The Indian currency is called ______.", o: ["Dollar", "Rupee", "Euro", "Pound"], a: 1 },
    { q: "The Taj Mahal is in ______.", o: ["Pakistan", "Bangladesh", "India", "Sri Lanka"], a: 2 },
  ],
  [
    { q: "A group of stars is called a ______.", o: ["Galaxy", "Constellation", "Planet", "Orbit"], a: 1 },
    { q: "The biggest ocean is the ______ Ocean.", o: ["Indian", "Atlantic", "Pacific", "Arctic"], a: 2 },
    { q: "The tallest mountain in the world is ______.", o: ["K2", "Mount Everest", "Kangchenjunga", "Alps"], a: 1 },
    { q: "The largest continent is ______.", o: ["Africa", "Europe", "Asia", "Australia"], a: 2 },
  ],
  [
    { q: "The day after Sunday is ______.", o: ["Saturday", "Monday", "Friday", "Tuesday"], a: 1 },
    { q: "There are ______ months in a year.", o: ["10", "11", "12", "13"], a: 2 },
    { q: "A year has ______ days.", o: ["360", "364", "365", "366"], a: 2 },
    { q: "February has ______ days in a leap year.", o: ["28", "29", "30", "31"], a: 1 },
  ],
  [
    { q: "The largest land animal is the ______.", o: ["Horse", "Elephant", "Giraffe", "Rhino"], a: 1 },
    { q: "The fastest land animal is the ______.", o: ["Tiger", "Lion", "Cheetah", "Leopard"], a: 2 },
    { q: "The Ship of the Desert is the ______.", o: ["Horse", "Camel", "Donkey", "Cow"], a: 1 },
    { q: "The largest bird in the world is the ______.", o: ["Eagle", "Ostrich", "Peacock", "Sparrow"], a: 1 },
  ],
  [
    { q: "The Sun is a star.", o: ["True", "False"], a: 0 },
    { q: "Fish live on land.", o: ["True", "False"], a: 1 },
    { q: "Humans have five senses.", o: ["True", "False"], a: 0 },
    { q: "The Moon gives its own light.", o: ["True", "False"], a: 1 },
  ],
  [
    { q: "Day, Night, Day, Night, ___ ?", o: ["Night", "Day", "Evening", "Morning"], a: 1 },
    { q: "Solid, Liquid, Gas, ___ ?", o: ["Water", "Ice", "Plasma", "Stone"], a: 2 },
    { q: "Seed, Plant, Flower, ___ ?", o: ["Leaf", "Fruit", "Root", "Stem"], a: 1 },
    { q: "Sunrise, Noon, Sunset, ___ ?", o: ["Morning", "Night", "Evening", "Afternoon"], a: 1 },
  ],
  [
    { q: "Fill the blank: M__rket", o: ["o", "a", "i", "e"], a: 1 },
    { q: "Fill the blank: C__nsumer", o: ["o", "u", "a", "i"], a: 0 },
    { q: "Fill the blank: S__pply", o: ["a", "i", "u", "o"], a: 2 },
    { q: "Fill the blank: D__mand", o: ["i", "e", "a", "o"], a: 1 },
  ],
  [
    { q: "Which animal says 'Moo'?", o: ["Dog", "Cat", "Cow", "Sheep"], a: 2 },
    { q: "Which animal says 'Baa'?", o: ["Goat", "Sheep", "Horse", "Pig"], a: 1 },
    { q: "Which animal says 'Neigh'?", o: ["Horse", "Donkey", "Cow", "Dog"], a: 0 },
    { q: "Which animal says 'Oink'?", o: ["Dog", "Pig", "Cat", "Cow"], a: 1 },
  ],
  [
    { q: "What is 2 + 2?", o: ["3", "4", "5", "6"], a: 1 },
    { q: "What is 5 × 3?", o: ["12", "15", "18", "20"], a: 1 },
    { q: "What is 10 ÷ 2?", o: ["4", "5", "6", "7"], a: 1 },
    { q: "What is 7 - 3?", o: ["2", "3", "4", "5"], a: 2 },
  ],
  [
    { q: "Which planet is closest to the Sun?", o: ["Venus", "Earth", "Mercury", "Mars"], a: 2 },
    { q: "How many bones are in the human body?", o: ["196", "206", "216", "226"], a: 1 },
    { q: "What gas do plants absorb?", o: ["Oxygen", "Nitrogen", "Carbon dioxide", "Argon"], a: 2 },
    { q: "What is the chemical symbol for water?", o: ["WA", "H2O", "HO", "W2O"], a: 1 },
  ],
  [
    { q: "How many continents are there?", o: ["5", "6", "7", "8"], a: 2 },
    { q: "What is the capital of France?", o: ["Berlin", "Madrid", "Rome", "Paris"], a: 3 },
    { q: "How many sides does a hexagon have?", o: ["5", "6", "7", "8"], a: 1 },
    { q: "What is the boiling point of water?", o: ["90°C", "95°C", "100°C", "105°C"], a: 2 },
  ],
  [
    { q: "What is H2O commonly known as?", o: ["Salt", "Water", "Sugar", "Acid"], a: 1 },
    { q: "Which vitamin is produced by sunlight?", o: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"], a: 3 },
    { q: "What organ pumps blood in the body?", o: ["Liver", "Kidney", "Heart", "Lungs"], a: 2 },
    { q: "What is the powerhouse of the cell?", o: ["Nucleus", "Ribosome", "Mitochondria", "Vacuole"], a: 2 },
  ],
  [
    { q: "What is 12 × 12?", o: ["132", "140", "144", "148"], a: 2 },
    { q: "Which planet is farthest from the Sun?", o: ["Uranus", "Saturn", "Neptune", "Pluto"], a: 2 },
    { q: "How many sides does an octagon have?", o: ["6", "7", "8", "9"], a: 2 },
    { q: "What is the SI unit of force?", o: ["Watt", "Joule", "Newton", "Pascal"], a: 2 },
  ],
  [
    { q: "Mango is a ______.", o: ["Vegetable", "Fruit", "Grain", "Spice"], a: 1 },
    { q: "Potato grows ______.", o: ["On trees", "Above ground", "Underground", "In water"], a: 2 },
    { q: "Rice is a type of ______.", o: ["Fruit", "Vegetable", "Grain", "Nut"], a: 2 },
    { q: "Milk comes from ______.", o: ["Plants", "Rocks", "Animals", "Sea"], a: 2 },
  ],
  [
    { q: "What does CPU stand for?", o: ["Central Processing Unit", "Computer Personal Unit", "Core Processing Unit", "Control Processing Unit"], a: 0 },
    { q: "What does RAM stand for?", o: ["Random Access Memory", "Read Access Memory", "Random Application Memory", "Read Application Memory"], a: 0 },
    { q: "What does AI stand for?", o: ["Auto Intelligence", "Artificial Intelligence", "Automated Intelligence", "Advanced Intelligence"], a: 1 },
    { q: "Who invented the World Wide Web?", o: ["Bill Gates", "Steve Jobs", "Tim Berners-Lee", "Mark Zuckerberg"], a: 2 },
  ],
  [
    { q: "The Olympic Games are held every ______ years.", o: ["2", "3", "4", "5"], a: 2 },
    { q: "Where were the first modern Olympics held?", o: ["Rome", "London", "Athens", "Paris"], a: 2 },
    { q: "How many rings on the Olympic flag?", o: ["4", "5", "6", "7"], a: 1 },
    { q: "Which sport is NOT in the Olympics?", o: ["Golf", "Rugby", "Cricket", "Handball"], a: 2 },
  ],
  [
    { q: "What is 25% of 100?", o: ["20", "25", "30", "35"], a: 1 },
    { q: "What is 50% of 80?", o: ["30", "35", "40", "45"], a: 2 },
    { q: "What is 10% of 500?", o: ["40", "50", "60", "70"], a: 1 },
    { q: "What is 75% of 200?", o: ["130", "140", "150", "160"], a: 2 },
  ],
  [
    { q: "You have reached Level 100! Roman numeral for 100 is ______.", o: ["XC", "C", "D", "L"], a: 1 },
    { q: "How many zeroes does a googol have?", o: ["10", "50", "100", "1000"], a: 2 },
    { q: "Pi equals approximately ______.", o: ["3.14", "3.41", "3.16", "3.12"], a: 0 },
    { q: "Final Question! What is 100 + 100?", o: ["100", "150", "200", "300"], a: 2 },
  ],
];

const buildLevels = () => {
  const finalLevels = {};
  for (let lvl = 1; lvl <= MAX_LEVEL; lvl += 1) {
    const bankIndex = (lvl - 1) % QUESTION_BANK.length;
    finalLevels[lvl] = QUESTION_BANK[bankIndex].map((item) => ({
      q: item.q,
      o: [...item.o],
      a: item.a,
    }));
  }

  finalLevels[100] = QUESTION_BANK[QUESTION_BANK.length - 1].map((item) => ({
    q: item.q,
    o: [...item.o],
    a: item.a,
  }));

  return finalLevels;
};

const LEVELS = buildLevels();

const POWERUPS = [
  {
    key: "hint",
    label: "Hint",
    icon: "bulb-outline",
    cost: 15,
    color: "#22C55E",
  },
  {
    key: "fifty",
    label: "50/50",
    icon: "git-compare-outline",
    cost: 20,
    color: "#3B82F6",
  },
  {
    key: "time",
    label: "+10s",
    icon: "time-outline",
    cost: 25,
    color: "#F59E0B",
  },
  {
    key: "skip",
    label: "Skip",
    icon: "play-forward-outline",
    cost: 30,
    color: "#A855F7",
  },
];

export default function QuizGameScreen({ navigation }) {
  const { width, height } = useWindowDimensions();

  const fallbackHeight = Dimensions.get("window").height || 760;
  const screenHeight = Math.max(height || 0, fallbackHeight);
  const screenMinHeight = Platform.OS === "web" ? "100vh" : screenHeight;

  const [started, setStarted] = useState(false);
  const [level, setLevel] = useState(1);
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [coins, setCoins] = useState(START_COINS);

  const [questionIndex, setQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answered, setAnswered] = useState(false);

  const [correctInLevel, setCorrectInLevel] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [bestStars, setBestStars] = useState({});

  const [hiddenOptions, setHiddenOptions] = useState([]);
  const [hintText, setHintText] = useState("");

  const [levelCompleteVisible, setLevelCompleteVisible] = useState(false);
  const [gameOverVisible, setGameOverVisible] = useState(false);
  const [levelsVisible, setLevelsVisible] = useState(false);

  const [lastReward, setLastReward] = useState(0);
  const [lastStars, setLastStars] = useState(0);
  const [toast, setToast] = useState("");

  const toastTimer = useRef(null);

  const pageWidth = Math.min(width - 24, 440);
  const question = LEVELS[level]?.[questionIndex] || LEVELS[1][0];

  const progress = (questionIndex + 1) / QUESTIONS_PER_LEVEL;
  const timerPercent = clamp(timeLeft / QUESTION_TIME, 0, 1);

  const timerColor =
    timeLeft > 10 ? "#22C55E" : timeLeft > 5 ? "#F59E0B" : "#EF4444";

  const showToast = (msg) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 1500);
  };

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  useEffect(() => {
    if (
      !started ||
      answered ||
      levelCompleteVisible ||
      gameOverVisible ||
      levelsVisible
    ) {
      return undefined;
    }

    const id = setInterval(() => {
      setTimeLeft((p) => Math.max(p - 1, 0));
    }, 1000);

    return () => clearInterval(id);
  }, [
    started,
    answered,
    levelCompleteVisible,
    gameOverVisible,
    levelsVisible,
  ]);

  useEffect(() => {
    if (!started || answered) return;
    if (timeLeft === 0) {
      handleAnswer(-1);
    }
  }, [timeLeft, started, answered]);

  const handleBack = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
      return;
    }

    navigation?.navigate?.("FunGames");
  };

  const resetQuestion = () => {
    setTimeLeft(QUESTION_TIME);
    setSelectedAnswer(null);
    setAnswered(false);
    setHiddenOptions([]);
    setHintText("");
  };

  const initLevel = (targetLevel) => {
    const safeLevel = clamp(targetLevel, 1, MAX_LEVEL);
    setLevel(safeLevel);
    setQuestionIndex(0);
    setCorrectInLevel(0);
    resetQuestion();
    setStarted(true);
    setLevelCompleteVisible(false);
    setGameOverVisible(false);
    setLevelsVisible(false);
  };

  const finishLevel = (finalCorrect) => {
    const stars = finalCorrect >= 4 ? 3 : finalCorrect >= 2 ? 2 : 1;
    const reward = level * 2 + stars * 20 + finalCorrect * 10;

    setLastStars(stars);
    setLastReward(reward);
    setCoins((p) => p + reward);

    setBestStars((p) => ({
      ...p,
      [level]: Math.max(p[level] || 0, stars),
    }));

    if (level === unlockedLevel && level < MAX_LEVEL) {
      setUnlockedLevel(level + 1);
    }

    setLevelCompleteVisible(true);
  };

  const goNextQuestion = (updatedCorrect) => {
    if (questionIndex + 1 >= QUESTIONS_PER_LEVEL) {
      finishLevel(updatedCorrect);
      return;
    }

    setQuestionIndex((p) => p + 1);
    resetQuestion();
  };

  const handleAnswer = (answerIndex) => {
    if (answered) return;

    const correct = answerIndex === question.a;
    const updatedCorrect = correct ? correctInLevel + 1 : correctInLevel;

    setSelectedAnswer(answerIndex);
    setAnswered(true);

    if (correct) {
      setCoins((p) => p + 10);
      setCorrectInLevel(updatedCorrect);
      setTotalCorrect((p) => p + 1);
    }

    setTimeout(() => {
      goNextQuestion(updatedCorrect);
    }, 850);
  };

  const payCoins = (cost) => {
    if (coins < cost) {
      showToast(`Need ${cost} coins`);
      return false;
    }

    setCoins((p) => p - cost);
    return true;
  };

  const useHint = () => {
    if (answered) return;
    if (!payCoins(15)) return;

    setHintText(`Hint: "${question.o[question.a]}"`);
  };

  const useFifty = () => {
    if (answered) return;

    if (hiddenOptions.length) {
      showToast("50/50 already used");
      return;
    }

    if (!payCoins(20)) return;

    const wrongOptions = question.o
      .map((_, index) => index)
      .filter((index) => index !== question.a);

    setHiddenOptions(wrongOptions.slice(0, Math.min(2, wrongOptions.length)));
  };

  const useTime = () => {
    if (answered) return;
    if (!payCoins(25)) return;

    setTimeLeft((p) => p + 10);
    showToast("⏱ +10 seconds!");
  };

  const useSkip = () => {
    if (answered) return;
    if (!payCoins(30)) return;

    goNextQuestion(correctInLevel);
  };

  const handlePowerup = (key) => {
    if (key === "hint") useHint();
    if (key === "fifty") useFifty();
    if (key === "time") useTime();
    if (key === "skip") useSkip();
  };

  const getOptionStyle = (index) => {
    if (!answered) return styles.optionButton;

    if (index === question.a) {
      return [styles.optionButton, styles.correctOption];
    }

    if (selectedAnswer === index && selectedAnswer !== question.a) {
      return [styles.optionButton, styles.wrongOption];
    }

    return [styles.optionButton, styles.disabledOption];
  };

  const getOptionIcon = (index) => {
    if (!answered) return null;

    if (index === question.a) {
      return <Ionicons name="checkmark-circle" size={18} color="#22C55E" />;
    }

    if (selectedAnswer === index && selectedAnswer !== question.a) {
      return <Ionicons name="close-circle" size={18} color="#EF4444" />;
    }

    return null;
  };

  const nextLevel = () => {
    if (level >= MAX_LEVEL) {
      setLevelCompleteVisible(false);
      setGameOverVisible(true);
      return;
    }

    initLevel(level + 1);
  };

  const restartGame = () => {
    setStarted(false);
    setLevel(1);
    setUnlockedLevel(1);
    setCoins(START_COINS);
    setQuestionIndex(0);
    setCorrectInLevel(0);
    setTotalCorrect(0);
    setBestStars({});
    setLevelCompleteVisible(false);
    setGameOverVisible(false);
    setLevelsVisible(false);
    resetQuestion();
  };

  const renderStars = (count, size = 14) => {
    return (
      <View style={styles.starsRow}>
        {[1, 2, 3].map((star) => (
          <Ionicons
            key={star}
            name={star <= count ? "star" : "star-outline"}
            size={size}
            color="#FACC15"
          />
        ))}
      </View>
    );
  };

  const renderTopChip = (icon, text, color = "#FACC15") => {
    return (
      <View style={styles.topChip}>
        <Ionicons name={icon} size={13} color={color} />
        <Text style={styles.topChipText}>{text}</Text>
      </View>
    );
  };

  const renderOption = (option, index) => {
    if (hiddenOptions.includes(index)) {
      return (
        <View key={index} style={[styles.optionButton, styles.hiddenOption]}>
          <Text style={styles.optionLetter}>
            {String.fromCharCode(65 + index)}
          </Text>
          <Text style={styles.hiddenOptionText}>Removed</Text>
        </View>
      );
    }

    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.85}
        disabled={answered}
        style={getOptionStyle(index)}
        onPress={() => handleAnswer(index)}
      >
        <View style={styles.optionLeft}>
          <View style={styles.optionBadge}>
            <Text style={styles.optionLetter}>
              {String.fromCharCode(65 + index)}
            </Text>
          </View>
          <Text style={styles.optionText}>{option}</Text>
        </View>

        {getOptionIcon(index)}
      </TouchableOpacity>
    );
  };

  const renderPowerup = (item) => {
    return (
      <TouchableOpacity
        key={item.key}
        activeOpacity={0.85}
        style={styles.powerCard}
        onPress={() => handlePowerup(item.key)}
      >
        <View style={[styles.powerIcon, { backgroundColor: item.color }]}>
          <Ionicons name={item.icon} size={18} color="#FFFFFF" />
        </View>

        <Text style={styles.powerLabel}>{item.label}</Text>

        <View style={styles.powerCost}>
          <Ionicons name="logo-bitcoin" size={10} color="#FACC15" />
          <Text style={styles.powerCostText}>{item.cost}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderStartModal = () => {
    return (
      <Modal visible={!started} transparent animationType="fade">
        <View style={[styles.modalOverlay, { minHeight: screenMinHeight }]}>
          <View style={[styles.startCard, { width: Math.min(width - 44, 320) }]}>
            <Ionicons name="sparkles" size={44} color="#FACC15" />

            <Text style={styles.startTitle}>Fun Quiz Game</Text>

            <Text style={styles.startSub}>
              100 exciting levels • 4 questions each
            </Text>

            <Text style={styles.startSub}>
              Collect coins • Use power-ups • Earn stars
            </Text>

            <View style={styles.startInfoRow}>
              <View style={styles.startInfoBadge}>
                <Ionicons name="timer-outline" size={12} color="#FFFFFF" />
                <Text style={styles.startInfoText}>20 sec</Text>
              </View>

              <View style={styles.startInfoBadge}>
                <Ionicons name="logo-bitcoin" size={12} color="#FACC15" />
                <Text style={styles.startInfoText}>{START_COINS} coins</Text>
              </View>

              <View style={styles.startInfoBadge}>
                <Ionicons name="trophy-outline" size={12} color="#FFFFFF" />
                <Text style={styles.startInfoText}>100 levels</Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.startButton}
              onPress={() => initLevel(1)}
            >
              <Ionicons name="play" size={16} color="#101820" />
              <Text style={styles.startButtonText}>Start Quiz</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const renderLevelCompleteModal = () => {
    return (
      <Modal visible={levelCompleteVisible} transparent animationType="fade">
        <View style={[styles.modalOverlay, { minHeight: screenMinHeight }]}>
          <View style={[styles.resultCard, { width: Math.min(width - 42, 330) }]}>
            <Ionicons name="trophy" size={48} color="#FACC15" />

            <Text style={styles.resultTitle}>Level Completed!</Text>

            <Text style={styles.resultSub}>
              Level {level} finished successfully
            </Text>

            {renderStars(lastStars, 26)}

            <View style={styles.resultStatsBox}>
              <View style={styles.resultStat}>
                <Text style={styles.resultStatValue}>
                  {correctInLevel}/{QUESTIONS_PER_LEVEL}
                </Text>
                <Text style={styles.resultStatLabel}>Correct</Text>
              </View>

              <View style={styles.resultStatDivider} />

              <View style={styles.resultStat}>
                <Text style={styles.resultStatValue}>+{lastReward}</Text>
                <Text style={styles.resultStatLabel}>Coins</Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.resultPrimaryButton}
              onPress={nextLevel}
            >
              <Text style={styles.resultPrimaryText}>
                {level >= MAX_LEVEL ? "Finish Game" : "Next Level"}
              </Text>
              <Ionicons name="arrow-forward" size={17} color="#101820" />
            </TouchableOpacity>

            <View style={styles.resultActions}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.resultSmallButton}
                onPress={() => initLevel(level)}
              >
                <Ionicons name="refresh" size={15} color="#FFFFFF" />
                <Text style={styles.resultSmallText}>Replay</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.resultSmallButton}
                onPress={() => {
                  setLevelCompleteVisible(false);
                  setLevelsVisible(true);
                }}
              >
                <Ionicons name="grid-outline" size={15} color="#FFFFFF" />
                <Text style={styles.resultSmallText}>Levels</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderGameOverModal = () => {
    return (
      <Modal visible={gameOverVisible} transparent animationType="fade">
        <View style={[styles.modalOverlay, { minHeight: screenMinHeight }]}>
          <View style={[styles.resultCard, { width: Math.min(width - 42, 330) }]}>
            <Ionicons name="ribbon" size={52} color="#FACC15" />

            <Text style={styles.resultTitle}>Quiz Champion!</Text>

            <Text style={styles.resultSub}>
              You completed the full 100-level quiz game.
            </Text>

            <View style={styles.resultStatsBox}>
              <View style={styles.resultStat}>
                <Text style={styles.resultStatValue}>{totalCorrect}</Text>
                <Text style={styles.resultStatLabel}>Total Correct</Text>
              </View>

              <View style={styles.resultStatDivider} />

              <View style={styles.resultStat}>
                <Text style={styles.resultStatValue}>{coins}</Text>
                <Text style={styles.resultStatLabel}>Coins</Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.resultPrimaryButton}
              onPress={restartGame}
            >
              <Ionicons name="reload" size={17} color="#101820" />
              <Text style={styles.resultPrimaryText}>Play Again</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.closeButton}
              onPress={handleBack}
            >
              <Text style={styles.closeButtonText}>Back to Fun Games</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const renderLevelsModal = () => {
    return (
      <Modal visible={levelsVisible} transparent animationType="slide">
        <View style={[styles.levelModalOverlay, { minHeight: screenMinHeight }]}>
          <View style={[styles.levelSheet, { maxHeight: screenHeight * 0.86 }]}>
            <View style={styles.levelSheetHeader}>
              <View>
                <Text style={styles.levelSheetTitle}>Choose Level</Text>
                <Text style={styles.levelSheetSub}>
                  Unlocked up to Level {unlockedLevel}
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.sheetClose}
                onPress={() => setLevelsVisible(false)}
              >
                <Ionicons name="close" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.levelGrid}
            >
              {Array.from({ length: MAX_LEVEL }).map((_, index) => {
                const lvl = index + 1;
                const locked = lvl > unlockedLevel;
                const active = lvl === level;
                const stars = bestStars[lvl] || 0;

                return (
                  <TouchableOpacity
                    key={lvl}
                    activeOpacity={0.85}
                    disabled={locked}
                    style={[
                      styles.levelButton,
                      active && styles.activeLevelButton,
                      locked && styles.lockedLevelButton,
                    ]}
                    onPress={() => initLevel(lvl)}
                  >
                    {locked ? (
                      <Ionicons name="lock-closed" size={15} color="#6B7280" />
                    ) : (
                      <Text
                        style={[
                          styles.levelButtonText,
                          active && styles.activeLevelButtonText,
                        ]}
                      >
                        {lvl}
                      </Text>
                    )}

                    {!locked && (
                      <View style={styles.levelStarsSmall}>
                        {[1, 2, 3].map((star) => (
                          <Ionicons
                            key={star}
                            name={star <= stars ? "star" : "star-outline"}
                            size={8}
                            color="#FACC15"
                          />
                        ))}
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={[styles.root, { minHeight: screenMinHeight }]}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <ImageBackground
        source={QUIZ_BG}
        resizeMode="cover"
        style={[styles.bg, { minHeight: screenMinHeight }]}
        imageStyle={styles.bgImage}
      >
        <LinearGradient
          colors={[
            "rgba(2, 6, 23, 0.35)",
            "rgba(2, 6, 23, 0.78)",
            "rgba(2, 6, 23, 0.94)",
          ]}
          style={[styles.gradient, { minHeight: screenMinHeight }]}
        >
          <SafeAreaView style={[styles.safe, { minHeight: screenMinHeight }]}>
            <ScrollView
              style={styles.scroll}
              showsVerticalScrollIndicator={false}
              bounces={false}
              contentContainerStyle={[
                styles.scrollContent,
                {
                  minHeight: screenHeight,
                  paddingBottom: Platform.OS === "ios" ? 26 : 18,
                },
              ]}
            >
              <View style={[styles.page, { width: pageWidth }]}>
                <View style={styles.header}>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.backButton}
                    onPress={handleBack}
                  >
                    <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
                  </TouchableOpacity>

                  <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>Fun Quiz</Text>
                    <Text style={styles.headerSub}>Level {level} of 100</Text>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.menuButton}
                    onPress={() => setLevelsVisible(true)}
                  >
                    <Ionicons name="grid" size={19} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>

                <View style={styles.topStats}>
                  {renderTopChip("logo-bitcoin", coins, "#FACC15")}
                  {renderTopChip("time-outline", `${timeLeft}s`, timerColor)}
                  {renderTopChip("heart-outline", `${correctInLevel}/4`, "#22C55E")}
                  {renderTopChip("star-outline", totalCorrect, "#FACC15")}
                </View>

                <View style={styles.progressWrap}>
                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${progress * 100}%` },
                      ]}
                    />
                  </View>
                  <View style={styles.timerTrack}>
                    <View
                      style={[
                        styles.timerFill,
                        {
                          width: `${timerPercent * 100}%`,
                          backgroundColor: timerColor,
                        },
                      ]}
                    />
                  </View>
                </View>

                <View style={styles.questionCard}>
                  <View style={styles.questionTop}>
                    <View style={styles.questionBadge}>
                      <Ionicons
                        name="help-circle-outline"
                        size={13}
                        color="#60A5FA"
                      />
                      <Text style={styles.questionBadgeText}>
                        Question {questionIndex + 1} of {QUESTIONS_PER_LEVEL}
                      </Text>
                    </View>

                    {renderStars(bestStars[level] || 0)}
                  </View>

                  <Text style={styles.questionText}>{question.q}</Text>

                  {hintText ? (
                    <View style={styles.hintBox}>
                      <Ionicons name="bulb" size={15} color="#FACC15" />
                      <Text style={styles.hintText}>{hintText}</Text>
                    </View>
                  ) : null}

                  <View style={styles.optionsWrap}>
                    {question.o.map((option, index) =>
                      renderOption(option, index)
                    )}
                  </View>
                </View>

                <View style={styles.powerupsCard}>
                  <Text style={styles.powerupsTitle}>Power-Ups</Text>

                  <View style={styles.powerupsRow}>
                    {POWERUPS.map(renderPowerup)}
                  </View>
                </View>
              </View>
            </ScrollView>

            {toast ? (
              <View style={styles.toast}>
                <Text style={styles.toastText}>{toast}</Text>
              </View>
            ) : null}

            {renderStartModal()}
            {renderLevelCompleteModal()}
            {renderGameOverModal()}
            {renderLevelsModal()}
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#020617",
    width: "100%",
  },

  bg: {
    flex: 1,
    width: "100%",
    backgroundColor: "#020617",
  },

  bgImage: {
    width: "100%",
    height: "100%",
  },

  gradient: {
    flex: 1,
    width: "100%",
  },

  safe: {
    flex: 1,
    width: "100%",
  },

  scroll: {
    flex: 1,
    width: "100%",
  },

  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? 36 : 10,
    paddingHorizontal: 12,
  },

  page: {
    flex: 1,
    alignSelf: "center",
  },

  header: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },

  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(15, 23, 42, 0.72)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  menuButton: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(34, 197, 94, 0.32)",
    borderWidth: 1,
    borderColor: "rgba(34, 197, 94, 0.45)",
  },

  headerCenter: {
    alignItems: "center",
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },

  headerSub: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 10,
    fontWeight: "700",
    marginTop: 1,
  },

  topStats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 7,
    marginTop: 8,
  },

  topChip: {
    flex: 1,
    minHeight: 27,
    borderRadius: 14,
    paddingHorizontal: 8,
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(15, 23, 42, 0.72)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  topChipText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },

  progressWrap: {
    marginTop: 10,
    gap: 5,
  },

  progressTrack: {
    height: 7,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.12)",
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#22C55E",
  },

  timerTrack: {
    height: 4,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.10)",
  },

  timerFill: {
    height: "100%",
    borderRadius: 999,
  },

  questionCard: {
    marginTop: 12,
    borderRadius: 18,
    padding: 14,
    backgroundColor: "rgba(2, 6, 23, 0.80)",
    borderWidth: 1,
    borderColor: "rgba(56, 189, 248, 0.28)",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },

  questionTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  questionBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "flex-start",
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 999,
    backgroundColor: "rgba(37, 99, 235, 0.16)",
    borderWidth: 1,
    borderColor: "rgba(96, 165, 250, 0.28)",
  },

  questionBadgeText: {
    color: "#BFDBFE",
    fontSize: 10,
    fontWeight: "800",
  },

  starsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
  },

  questionText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    lineHeight: 23,
    textAlign: "center",
    marginVertical: 18,
  },

  hintBox: {
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "rgba(250, 204, 21, 0.13)",
    borderWidth: 1,
    borderColor: "rgba(250, 204, 21, 0.35)",
  },

  hintText: {
    color: "#FEF3C7",
    fontSize: 11,
    fontWeight: "800",
    flex: 1,
  },

  optionsWrap: {
    gap: 10,
  },

  optionButton: {
    minHeight: 44,
    borderRadius: 13,
    paddingHorizontal: 12,
    paddingVertical: 9,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(15, 23, 42, 0.86)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  optionLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  optionBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  optionLetter: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
  },

  optionText: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 17,
  },

  correctOption: {
    backgroundColor: "rgba(34, 197, 94, 0.18)",
    borderColor: "rgba(34, 197, 94, 0.75)",
  },

  wrongOption: {
    backgroundColor: "rgba(239, 68, 68, 0.18)",
    borderColor: "rgba(239, 68, 68, 0.75)",
  },

  disabledOption: {
    opacity: 0.62,
  },

  hiddenOption: {
    opacity: 0.45,
    justifyContent: "flex-start",
    gap: 10,
  },

  hiddenOptionText: {
    color: "rgba(255,255,255,0.58)",
    fontSize: 12,
    fontWeight: "800",
  },

  powerupsCard: {
    marginTop: 12,
    borderRadius: 18,
    padding: 12,
    backgroundColor: "rgba(2, 6, 23, 0.78)",
    borderWidth: 1,
    borderColor: "rgba(56, 189, 248, 0.20)",
  },

  powerupsTitle: {
    color: "rgba(255,255,255,0.76)",
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    textAlign: "center",
    marginBottom: 10,
  },

  powerupsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },

  powerCard: {
    flex: 1,
    minHeight: 70,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    backgroundColor: "rgba(15, 23, 42, 0.88)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  powerIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  powerLabel: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
  },

  powerCost: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },

  powerCostText: {
    color: "#FACC15",
    fontSize: 9,
    fontWeight: "900",
  },

  modalOverlay: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "rgba(2, 6, 23, 0.72)",
  },

  startCard: {
    borderRadius: 18,
    padding: 18,
    alignItems: "center",
    backgroundColor: "rgba(2, 6, 23, 0.92)",
    borderWidth: 1.5,
    borderColor: "#22D3EE",
    shadowColor: "#22D3EE",
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },

  startTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    marginTop: 6,
  },

  startSub: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 11,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 5,
  },

  startInfoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 6,
    marginTop: 13,
  },

  startInfoBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.10)",
  },

  startInfoText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "800",
  },

  startButton: {
    marginTop: 14,
    width: "100%",
    height: 42,
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    backgroundColor: "#FFE07A",
  },

  startButtonText: {
    color: "#101820",
    fontSize: 13,
    fontWeight: "900",
  },

  resultCard: {
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    backgroundColor: "rgba(2, 6, 23, 0.94)",
    borderWidth: 1.5,
    borderColor: "#22D3EE",
  },

  resultTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    marginTop: 8,
    textAlign: "center",
  },

  resultSub: {
    color: "rgba(255,255,255,0.70)",
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 12,
  },

  resultStatsBox: {
    width: "100%",
    minHeight: 76,
    borderRadius: 16,
    marginTop: 16,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  resultStat: {
    flex: 1,
    alignItems: "center",
  },

  resultStatValue: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
  },

  resultStatLabel: {
    color: "rgba(255,255,255,0.62)",
    fontSize: 10,
    fontWeight: "800",
    marginTop: 2,
  },

  resultStatDivider: {
    width: 1,
    height: 42,
    backgroundColor: "rgba(255,255,255,0.12)",
  },

  resultPrimaryButton: {
    width: "100%",
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FFE07A",
    flexDirection: "row",
    gap: 7,
    alignItems: "center",
    justifyContent: "center",
  },

  resultPrimaryText: {
    color: "#101820",
    fontSize: 13,
    fontWeight: "900",
  },

  resultActions: {
    width: "100%",
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },

  resultSmallButton: {
    flex: 1,
    height: 38,
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  resultSmallText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
  },

  closeButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },

  closeButtonText: {
    color: "#BFDBFE",
    fontSize: 12,
    fontWeight: "900",
  },

  levelModalOverlay: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
    backgroundColor: "rgba(2, 6, 23, 0.68)",
  },

  levelSheet: {
    width: "100%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingHorizontal: 14,
    paddingBottom: Platform.OS === "ios" ? 28 : 16,
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "rgba(56, 189, 248, 0.28)",
  },

  levelSheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  levelSheetTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  levelSheetSub: {
    color: "rgba(255,255,255,0.62)",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 2,
  },

  sheetClose: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.10)",
  },

  levelGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
    paddingBottom: 16,
  },

  levelButton: {
    width: 50,
    height: 50,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(15, 23, 42, 0.92)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  activeLevelButton: {
    backgroundColor: "#FACC15",
    borderColor: "#FFFFFF",
  },

  lockedLevelButton: {
    backgroundColor: "rgba(31, 41, 55, 0.80)",
    borderColor: "rgba(255,255,255,0.06)",
  },

  levelButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },

  activeLevelButtonText: {
    color: "#101820",
  },

  levelStarsSmall: {
    flexDirection: "row",
    gap: 0,
    marginTop: 2,
  },

  toast: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: 28,
    minHeight: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(15, 23, 42, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  toastText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center",
  },
});