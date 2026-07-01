



import React, { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import {
  View,
  StyleSheet,
  Image,
  ImageBackground,
  Animated,
  Easing,
  Dimensions,
  StatusBar,
  Platform,
} from "react-native";

const { width } = Dimensions.get("window");

export default function SplashScreen({ navigation }) {
  const { initializing, isAuthenticated } = useAuth();
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.82)).current;
  const glowPulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const logoIntro = Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 850,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 5,
        tension: 70,
        useNativeDriver: true,
      }),
    ]);

    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowPulse, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    logoIntro.start();
    glowLoop.start();

    let timer = null;

    if (!initializing) {
      timer = setTimeout(() => {
        if (navigation) {
          navigation.replace(isAuthenticated ? "GameSelection" : "Login");
        }
      }, 3000);
    }

    return () => {
      if (timer) clearTimeout(timer);
      logoIntro.stop();
      glowLoop.stop();
    };
  }, [
    navigation,
    logoOpacity,
    logoScale,
    glowPulse,
    initializing,
    isAuthenticated,
  ]);

  const glowScale = glowPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  const glowOpacity = glowPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.45, 0.9],
  });

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <ImageBackground
        source={require("../assets/images/logobackground.png")}
        style={styles.background}
        imageStyle={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.darkOverlay} />

        <View style={styles.centerContent}>
          <Animated.View
            style={[
              styles.bigCenterGlow,
              {
                opacity: glowOpacity,
                transform: [{ scale: glowScale }],
              },
            ]}
          />

          <Animated.View
            style={[
              styles.logoGlow,
              {
                opacity: glowOpacity,
                transform: [{ scale: glowScale }],
              },
            ]}
          />

          <Animated.View
            style={[
              styles.logoBox,
              {
                opacity: logoOpacity,
                transform: [{ scale: logoScale }],
              },
            ]}
          >
            <Image
              source={require("../assets/images/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>
        </View>
      </ImageBackground>
    </View>
  );
}

const LOGO_WIDTH = width * 0.88;
const LOGO_HEIGHT = LOGO_WIDTH * 0.72;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#063B57",
  },

  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  backgroundImage: {
    width: "100%",
    height: "100%",
  },

  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 10, 26, 0.02)",
  },

  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },


  logoBox: {
    width: LOGO_WIDTH,
    height: LOGO_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },

  logo: {
    width: "100%",
    height: "100%",
  },
});