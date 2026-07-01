


import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  SafeAreaView,
  Animated,
  Platform,
} from "react-native";

const { width, height } = Dimensions.get("window");

const COLORS = {
  background: "#061B3A",
  cardBorder: "rgba(120, 150, 255, 0.55)",
  white: "#FFFFFF",
  muted: "rgba(226, 232, 240, 0.78)",
  cyan: "#22C7FF",
  dotInactive: "rgba(148, 163, 184, 0.65)",
  buttonBlue: "#18B9FF",
};

const onboardingData = [
  {
    id: "1",
    image: require("../assets/images/onboardingbackground1.png"),
    title: "Learn to Code\nthe Fun Way",
    description:
      "Explore interactive lessons and exciting\nchallenges designed just for you.",
  },
  {
    id: "2",
    image: require("../assets/images/onboardingbackground2.png"),
    title: "Solve. Think.\nBecome a Pro!",
    description:
      "Solve puzzles, unlock achievements and\nlevel up your coding skills.",
  },
];

export default function OnBoardingScreen({ navigation }) {
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToLogin = () => {
    navigation.replace("Login");
  };

  const handleNext = () => {
    const nextIndex = currentIndex + 1;

    if (nextIndex < onboardingData.length) {
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    } else {
      goToLogin();
    }
  };

  const handleSkip = () => {
    goToLogin();
  };

  const onMomentumScrollEnd = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    setCurrentIndex(index);
  };

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {onboardingData.map((_, index) => (
          <View
            key={index.toString()}
            style={[
              styles.dot,
              currentIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    );
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.slide}>
        <View style={styles.card}>
          <View style={styles.imageWrapper}>
            <Image
              source={item.image}
              style={styles.mainImage}
              resizeMode="cover"
            />
          </View>

          <View style={styles.textArea}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>

          <View style={styles.bottomArea}>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={handleSkip}
              style={styles.skipButton}
            >
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>

            {renderDots()}

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleNext}
              style={styles.nextButton}
            >
              <Text style={styles.nextIcon}>›</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <View style={styles.container}>
        <Animated.FlatList
          ref={flatListRef}
          data={onboardingData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          onMomentumScrollEnd={onMomentumScrollEnd}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
        />
      </View>
    </SafeAreaView>
  );
}

const CARD_WIDTH = width * 0.88;
const CARD_HEIGHT = height * 0.9;
const IMAGE_HEIGHT = height * 0.52;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  slide: {
    width,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: height * 0.025,
  },

  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 28,
    borderWidth: 1.4,
    borderColor: COLORS.cardBorder,
    backgroundColor: "#071B3B",
    overflow: "hidden",
    shadowColor: "#1EA7FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: Platform.OS === "ios" ? 0.25 : 0.35,
    shadowRadius: 20,
    elevation: 12,
  },

  imageWrapper: {
    width: "100%",
    height: IMAGE_HEIGHT,
    overflow: "hidden",
  },

  mainImage: {
    width: "100%",
    height: "100%",
  },

  textArea: {
    alignItems: "center",
    paddingHorizontal: 22,
    marginTop: height < 720 ? 20 : 28,
  },

  title: {
    color: COLORS.white,
    fontSize: width < 380 ? 30 : 36,
    lineHeight: width < 380 ? 38 : 45,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: 0.3,
  },

  description: {
    marginTop: 18,
    color: COLORS.muted,
    fontSize: width < 380 ? 14 : 16,
    lineHeight: width < 380 ? 22 : 25,
    fontWeight: "500",
    textAlign: "center",
  },

  bottomArea: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: height < 720 ? 22 : 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  skipButton: {
    minWidth: 56,
    paddingVertical: 10,
  },

  skipText: {
    color: COLORS.cyan,
    fontSize: 17,
    fontWeight: "700",
  },

  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  dot: {
    height: 10,
    borderRadius: 10,
    marginHorizontal: 5,
  },

  activeDot: {
    width: 14,
    backgroundColor: COLORS.cyan,
  },

  inactiveDot: {
    width: 10,
    backgroundColor: COLORS.dotInactive,
  },

  nextButton: {
    width: width < 380 ? 62 : 72,
    height: width < 380 ? 62 : 72,
    borderRadius: 100,
    backgroundColor: COLORS.buttonBlue,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#18B9FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 14,
    elevation: 12,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.18)",
  },

  nextIcon: {
    color: COLORS.white,
    fontSize: width < 380 ? 48 : 54,
    lineHeight: width < 380 ? 50 : 56,
    fontWeight: "300",
    marginTop: -4,
  },
});