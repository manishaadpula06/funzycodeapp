import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AuthProvider } from "./context/AuthContext";
import { GameProvider } from "./context/GameContext";
import { navigationRef } from "./services/navigationService";

import SplashScreen from "./screens/SplashScreen";
import OnBoardingScreen from "./screens/OnBoardingScreen";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import GameSelectionScreen from "./screens/GameSelectionScreen";
import FunGamesScreen from "./screens/FunGamesScreen";
import ProgressScreen from "./screens/ProgressScreen";
import BadgesScreen from "./screens/BadgesScreen";
import SettingsScreen from "./screens/SettingsScreen";
import RouteMapScreen from "./screens/RouteMapScreen";
import MissionScreen from "./screens/MissionScreen";
import CodingScreen from "./screens/CodingScreen";
import LiveResultScreen from "./screens/LiveResultScreen";
import GiftModalScreen from "./screens/GiftModalScreen";
import FailedModalScreen from "./screens/FailedModalScreen";

import MazeEscapeScreen from "./screens/MazeEscapeScreen";
import WordHuntGameScreen from "./screens/WordHuntGameScreen";
import MemoryMatchScreen from "./screens/MemoryMatchScreen";
import ChessGameScreen from "./screens/ChessGameScreen";
import QuizGameScreen from "./screens/QuizGameScreen";
import CarGameScreen from "./screens/CarGameScreen";
import JungleCoinEscapeScreen from "./screens/JungleCoinEscapeScreen";
import WaterSortScreen from "./screens/WaterSortScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          >
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="OnBoarding" component={OnBoardingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />

            <Stack.Screen name="Home" component={GameSelectionScreen} />
            <Stack.Screen name="GameSelection" component={GameSelectionScreen} />
            <Stack.Screen name="Games" component={FunGamesScreen} />
            <Stack.Screen name="FunGames" component={FunGamesScreen} />
            <Stack.Screen name="FunGamesScreen" component={FunGamesScreen} />
            <Stack.Screen name="Progress" component={ProgressScreen} />
            <Stack.Screen name="Badges" component={BadgesScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />

            <Stack.Screen name="RouteMapScreen" component={RouteMapScreen} />
            <Stack.Screen name="MissionScreen" component={MissionScreen} />
            <Stack.Screen name="CodingScreen" component={CodingScreen} />
            <Stack.Screen name="LiveResultScreen" component={LiveResultScreen} />
            <Stack.Screen name="MazeEscapeScreen" component={MazeEscapeScreen} />
            <Stack.Screen name="WordHuntGame" component={WordHuntGameScreen} />
            <Stack.Screen name="MemoryMatch" component={MemoryMatchScreen} />
            <Stack.Screen name="ChessGame" component={ChessGameScreen} />
            <Stack.Screen name="QuizGame" component={QuizGameScreen} />
            <Stack.Screen name="CarGame" component={CarGameScreen} />
            <Stack.Screen name="JungleCoinEscape" component={JungleCoinEscapeScreen} />
            <Stack.Screen name="WaterSort" component={WaterSortScreen} />

            <Stack.Screen
              name="GiftModalScreen"
              component={GiftModalScreen}
              options={{
                animation: "fade",
              }}
            />

            <Stack.Screen
              name="FailedModalScreen"
              component={FailedModalScreen}
              options={{
                animation: "fade",
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </GameProvider>
    </AuthProvider>
  );
}
