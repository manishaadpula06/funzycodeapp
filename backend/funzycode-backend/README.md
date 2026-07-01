# FunzyCode Backend

Spring Boot + MySQL backend for the existing Expo React Native FunzyCode app.

## Stack

- Java 17
- Spring Boot 3.x
- Maven
- MySQL
- Spring Data JPA
- Spring Security JWT
- Lombok
- Validation
- Swagger/OpenAPI
- Global exception handling

## Project Structure

```text
src/main/java/com/funzycode/backend
├── config
├── controller
├── dto
├── entity
├── repository
├── service
│   └── impl
├── security
├── exception
├── response
└── util
```

## MySQL Setup

```bash
mysql -u root -p
```

```sql
CREATE DATABASE funzycode_db;
```

Default DB config is in `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/funzycode_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=root
```

Change username/password if your MySQL credentials are different.

## Run Backend

```bash
cd funzycode-backend
mvn clean install
mvn spring-boot:run
```

Backend URL:

```text
http://localhost:8080
```

Swagger:

```text
http://localhost:8080/swagger-ui.html
```

## Important Security Notes

Change these before production:

```properties
app.jwt.secret=change-this-secret-key-to-a-very-long-production-secret-key-1234567890
app.admin.secret=change-this-admin-secret
```

## API Response Format

```json
{
  "success": true,
  "message": "Success message",
  "data": {}
}
```

## Postman Testing Flow

### 1. Register user

POST `http://localhost:8080/api/auth/register`

```json
{
  "fullName": "Hari Prasad",
  "email": "hari@example.com",
  "password": "123456",
  "avatarUrl": ""
}
```

Response:

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "JWT_TOKEN_HERE",
    "tokenType": "Bearer",
    "user": {
      "id": 1,
      "fullName": "Hari Prasad",
      "email": "hari@example.com",
      "role": "USER"
    }
  }
}
```

### 2. Login

POST `http://localhost:8080/api/auth/login`

```json
{
  "email": "hari@example.com",
  "password": "123456"
}
```

Copy the token and add it in Postman Headers:

```text
Authorization: Bearer JWT_TOKEN_HERE
```

### 3. Get profile

GET `http://localhost:8080/api/auth/me`

### 4. Get game progress

GET `http://localhost:8080/api/game/progress`

Response contains coins, stars, currentLevel, completedCount, levels, gifts, soundEnabled, and shareRewardClaimed.

### 5. Start level

POST `http://localhost:8080/api/levels/1/start`

### 6. Save code

POST `http://localhost:8080/api/levels/1/save-code`

```json
{
  "submittedCode": "moveForward(); jump();",
  "secondsLeft": 42
}
```

### 7. Complete level

POST `http://localhost:8080/api/levels/1/complete`

```json
{
  "submittedCode": "moveForward(); jump();",
  "secondsLeft": 35,
  "starsEarned": 3,
  "coinsEarned": 100
}
```

### 8. Open gift

POST `http://localhost:8080/api/gifts/1/open`

```json
{
  "giftId": "gift-level-1"
}
```

### 9. Claim WhatsApp reward

POST `http://localhost:8080/api/rewards/whatsapp`

### 10. Save mini-game score

POST `http://localhost:8080/api/mini-games/scores`

```json
{
  "gameName": "MazeEscapeScreen",
  "score": 1200,
  "coinsEarned": 50,
  "starsEarned": 1,
  "durationSeconds": 90
}
```

### 11. Get mini-game leaderboard

GET `http://localhost:8080/api/mini-games/leaderboard/MazeEscapeScreen`

## Create Admin User

To create an admin user, call register with `adminSecret` matching `app.admin.secret`.

POST `http://localhost:8080/api/auth/register`

```json
{
  "fullName": "Admin",
  "email": "admin@funzycode.com",
  "password": "admin123",
  "adminSecret": "change-this-admin-secret"
}
```

Then login as admin and call:

```text
GET /api/admin/users
GET /api/admin/users/{id}
GET /api/admin/users/{id}/progress
GET /api/admin/leaderboard
DELETE /api/admin/users/{id}
```

## Frontend Base URL Later

For Expo mobile testing, do not use `localhost` in the mobile app. Use your PC IPv4 address:

```js
export const API_BASE_URL = "http://YOUR_PC_IPV4:8080/api";
```

Example:

```js
export const API_BASE_URL = "http://192.168.0.17:8080/api";
```

## Game Rules Implemented

- 50 coding levels are created per user.
- Level 1 starts as `CURRENT`; others start as `LOCKED`.
- Completing a level unlocks the next level.
- Completing a level gives coins/stars from request body, default 100 coins and 3 stars.
- Hint costs 50 coins and can be used once per level.
- Auto-fix costs 1 star and can be used once per level.
- Extra time costs 100 coins and can be used multiple times.
- Gift can be opened once per completed level.
- Gift reward randomly gives 0, 50, or 100 coins.
- WhatsApp reward gives 500 coins once per user.
- Mini-game scores are saved and leaderboard APIs are available.
