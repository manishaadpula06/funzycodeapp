// screens/ForgotPasswordScreen.js

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

const { width, height } = Dimensions.get("window");
const isSmallDevice = height < 740;

const COLORS = {
  bg: "#061B3A",
  inputBg: "rgba(1, 15, 42, 0.68)",
  inputBorder: "rgba(55, 130, 255, 0.75)",
  white: "#FFFFFF",
  muted: "rgba(226, 232, 240, 0.74)",
  cyan: "#22C7FF",
  blue: "#18B9FF",
  green: "#35D07F",
  red: "#FF5A6A",
};

export default function ForgotPasswordScreen({ navigation }) {
  const { forgotPassword, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    const result = await forgotPassword(email);

    if (!result.ok) {
      setError(result.message || "Unable to send reset request.");
      return;
    }

    setMessage(result.message);
  };

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <ImageBackground
        source={require("../assets/images/loginbackground.png")}
        style={styles.background}
        imageStyle={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scrollContent}>
            <View style={styles.mainCard}>
              <View style={styles.logoArea}>
                <Image source={require("../assets/images/logo.png")} style={styles.logo} resizeMode="contain" />
              </View>

              <View style={styles.headerBox}>
                <Text style={styles.title}>Forgot Password?</Text>
                <Text style={styles.subtitle}>Enter your email to request password reset</Text>
              </View>

              <View style={styles.formBox}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputBox}>
                  <Ionicons name="mail-outline" size={24} color="rgba(226,232,240,0.9)" style={styles.inputIcon} />
                  <TextInput
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      setError("");
                      setMessage("");
                    }}
                    placeholder="Enter your email"
                    placeholderTextColor="rgba(226,232,240,0.62)"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.input}
                  />
                </View>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                {message ? <Text style={styles.successText}>{message}</Text> : null}

                <TouchableOpacity activeOpacity={0.9} onPress={handleSubmit} disabled={loading} style={[styles.loginButton, loading && styles.disabledButton]}>
                  <Text style={styles.loginButtonText}>{loading ? "Sending..." : "Send Request"}</Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.75} onPress={() => navigation.navigate("Login")} style={styles.backButton}>
                  <Text style={styles.backText}>Back to Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
}

const CARD_WIDTH = width * 0.94;
const LOGO_WIDTH = width * 0.58;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  background: { flex: 1, width: "100%", height: "100%" },
  backgroundImage: { width: "100%", height: "100%" },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0, 8, 28, 0.08)" },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: width * 0.03, paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 12 : 16, paddingBottom: 22, alignItems: "center", justifyContent: "center" },
  mainCard: { width: CARD_WIDTH },
  logoArea: { alignItems: "center", justifyContent: "center", height: isSmallDevice ? 120 : 150 },
  logo: { width: LOGO_WIDTH, height: LOGO_WIDTH * 0.62 },
  headerBox: { marginBottom: isSmallDevice ? 22 : 26 },
  title: { color: COLORS.white, fontSize: width < 380 ? 30 : 36, lineHeight: width < 380 ? 36 : 44, fontWeight: "900" },
  subtitle: { marginTop: 8, color: COLORS.muted, fontSize: width < 380 ? 17 : 20, lineHeight: width < 380 ? 24 : 28, fontWeight: "600" },
  formBox: { width: "100%" },
  label: { color: COLORS.cyan, fontSize: width < 380 ? 17 : 19, fontWeight: "900", marginLeft: 4, marginBottom: 10 },
  inputBox: { height: isSmallDevice ? 58 : 66, borderRadius: 22, borderWidth: 1.3, borderColor: COLORS.inputBorder, backgroundColor: COLORS.inputBg, flexDirection: "row", alignItems: "center", paddingHorizontal: width < 380 ? 14 : 18 },
  inputIcon: { marginRight: width < 380 ? 10 : 14 },
  input: { flex: 1, color: COLORS.white, fontSize: width < 380 ? 15 : 18, fontWeight: "700", paddingVertical: 0 },
  errorText: { color: COLORS.red, fontSize: width < 380 ? 13 : 15, fontWeight: "800", marginTop: 10, marginLeft: 4 },
  successText: { color: COLORS.green, fontSize: width < 380 ? 13 : 15, fontWeight: "800", marginTop: 10, marginLeft: 4 },
  loginButton: { marginTop: 28, height: isSmallDevice ? 58 : 66, borderRadius: 22, backgroundColor: COLORS.blue, alignItems: "center", justifyContent: "center", shadowColor: "#18B9FF", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.75, shadowRadius: 16, elevation: 14, borderWidth: 1.1, borderColor: "rgba(255,255,255,0.18)" },
  loginButtonText: { color: COLORS.white, fontSize: width < 380 ? 21 : 25, fontWeight: "900" },
  disabledButton: { opacity: 0.65 },
  backButton: { alignSelf: "center", marginTop: 24 },
  backText: { color: COLORS.cyan, fontSize: width < 380 ? 15 : 18, fontWeight: "900" },
});
