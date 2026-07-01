FunzyCode Full Stack Project
============================

This ZIP contains both projects:

1) frontend/funzycode
   Expo React Native frontend connected to backend APIs.

2) backend/funzycode-backend
   Spring Boot + MySQL backend with JWT authentication and game APIs.

Start Backend
-------------
1. Create MySQL database:
   CREATE DATABASE funzycode_db;

2. Open backend folder:
   cd backend/funzycode-backend

3. Run backend:
   mvn spring-boot:run

Backend runs on:
   http://localhost:8080

Swagger:
   http://localhost:8080/swagger-ui.html

Start Frontend
--------------
1. Open frontend config:
   frontend/funzycode/services/apiConfig.js

2. Change API_BASE_URL to your PC IPv4 address:
   export const API_BASE_URL = "http://YOUR_PC_IPV4:8080/api";

   Example:
   export const API_BASE_URL = "http://192.168.0.17:8080/api";

3. Install frontend packages:
   cd frontend/funzycode
   npm install
   npm install axios @react-native-async-storage/async-storage

4. Start Expo:
   npx expo start -c

Important
---------
For Expo mobile testing, do not use localhost in apiConfig.js.
Use your laptop/PC Wi-Fi IPv4 address.
