FunzyCode Backend Connection Notes
=================================

1) Install required frontend packages:
   npm install axios @react-native-async-storage/async-storage

2) Open services/apiConfig.js and replace YOUR_PC_IPV4 with your computer Wi-Fi IPv4:
   export const API_BASE_URL = "http://192.168.0.17:8080/api";

3) Start Spring Boot backend first:
   cd funzycode-backend
   mvn spring-boot:run

4) Start Expo app:
   cd funzycode
   npx expo start -c

5) Register a new user in the app or Postman first, then login.

Changed / added frontend files:
- package.json
- App.js
- context/AuthContext.js
- context/GameContext.js
- services/apiConfig.js
- services/apiClient.js
- services/authService.js
- services/gameService.js
- services/levelService.js
- services/giftService.js
- services/rewardService.js
- services/miniGameService.js
- services/navigationService.js
- screens/SplashScreen.js
- screens/LoginScreen.js
- screens/SignUpScreen.js
- screens/ForgotPasswordScreen.js
- screens/GameSelectionScreen.js
- screens/ProgressScreen.js
- screens/BadgesScreen.js
- screens/SettingsScreen.js
- components/GameBottomNavigation.js
