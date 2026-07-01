import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useAuth } from "./AuthContext";
import { getApiErrorMessage } from "../services/apiClient";
import gameService from "../services/gameService";
import levelService from "../services/levelService";
import giftService from "../services/giftService";
import rewardService from "../services/rewardService";
import miniGameService from "../services/miniGameService";

export const TOTAL_LEVELS = 50;

export const GAME_LIMITS = {
  INITIAL_COINS: 250,
  INITIAL_STARS: 10,
  LEVEL_SECONDS: 120,
  LEVEL_REWARD_COINS: 50,
  HINT_COST_COINS: 20,
  EXTRA_TIME_COST_COINS: 50,
  EXTRA_TIME_SECONDS: 30,
  MAX_EXTRA_TIME_PER_LEVEL: 3,
  AUTOFIX_COST_STARS: 1,
  WHATSAPP_REWARD_COINS: 500,
};

const createLevel = ({
  id,
  type,
  title,
  slug,
  taskText,
  hintCode,
  requiredTags,
  requiredKeywords,
}) => ({
  id,
  level: id,
  house: Math.floor((id - 1) / 5) + 1,
  step: ((id - 1) % 5) + 1,
  type,
  title,
  slug,
  heading: title,
  taskText,
  hintCode,
  requiredTags,
  requiredKeywords,
  rewardCoins: GAME_LIMITS.LEVEL_REWARD_COINS,
  seconds: GAME_LIMITS.LEVEL_SECONDS,
});

const LEVELS = [
  createLevel({
    id: 1,
    type: "html",
    title: "Fishing Spot",
    slug: "fishing-spot",
    taskText:
      "Create a simple Fishing Spot page using html, body, h1, p, and button.",
    hintCode: `<html>
  <body>
    <h1>Fishing Spot</h1>
    <p>Catch the fish here</p>
    <button>Start Fishing</button>
  </body>
</html>`,
    requiredTags: ["html", "body", "h1", "p", "button"],
    requiredKeywords: ["fishing", "fish"],
  }),

  createLevel({
    id: 2,
    type: "html",
    title: "Flower Garden",
    slug: "flower-garden",
    taskText:
      "Create a Flower Garden page using html, body, h1, p, and button.",
    hintCode: `<html>
  <body>
    <h1>Flower Garden</h1>
    <p>Plant beautiful flowers in the garden</p>
    <button>Start Garden</button>
  </body>
</html>`,
    requiredTags: ["html", "body", "h1", "p", "button"],
    requiredKeywords: ["flower", "garden"],
  }),

  createLevel({
    id: 3,
    type: "html",
    title: "Cat House",
    slug: "cat-house",
    taskText:
      "Create a Cat House page using html, body, h1, p, img, and button.",
    hintCode: `<html>
  <body>
    <h1>Cat House</h1>
    <p>Make a small home for the cat</p>
    <img src="https://placekitten.com/200/140" alt="cat" />
    <button>Feed Cat</button>
  </body>
</html>`,
    requiredTags: ["html", "body", "h1", "p", "img", "button"],
    requiredKeywords: ["cat", "house", "alt"],
  }),

  createLevel({
    id: 4,
    type: "html",
    title: "Fruit Shop",
    slug: "fruit-shop",
    taskText:
      "Create a Fruit Shop page using html, body, h1, p, ul, li, and button.",
    hintCode: `<html>
  <body>
    <h1>Fruit Shop</h1>
    <p>Fresh fruits are ready</p>
    <ul>
      <li>Apple</li>
      <li>Banana</li>
      <li>Mango</li>
    </ul>
    <button>Buy Fruits</button>
  </body>
</html>`,
    requiredTags: ["html", "body", "h1", "p", "ul", "li", "button"],
    requiredKeywords: ["fruit", "apple", "banana"],
  }),

  createLevel({
    id: 5,
    type: "html",
    title: "Coin Bridge",
    slug: "coin-bridge",
    taskText:
      "Create a Coin Bridge page using html, body, h1, div, span, p, and button.",
    hintCode: `<html>
  <body>
    <h1>Coin Bridge</h1>
    <div>
      <span>Coin</span>
      <p>Collect coins on the bridge</p>
      <button>Cross Bridge</button>
    </div>
  </body>
</html>`,
    requiredTags: ["html", "body", "h1", "div", "span", "p", "button"],
    requiredKeywords: ["coin", "bridge"],
  }),

  createLevel({
    id: 6,
    type: "html",
    title: "Candy Gate",
    slug: "candy-gate",
    taskText:
      "Create a Candy Gate page using html, body, header, h1, p, and button.",
    hintCode: `<html>
  <body>
    <header>
      <h1>Candy Gate</h1>
    </header>
    <p>Open the sweet candy gate</p>
    <button>Open Gate</button>
  </body>
</html>`,
    requiredTags: ["html", "body", "header", "h1", "p", "button"],
    requiredKeywords: ["candy", "gate"],
  }),

  createLevel({
    id: 7,
    type: "html",
    title: "River Dock",
    slug: "river-dock",
    taskText:
      "Create a River Dock page using html, body, section, h1, p, and button.",
    hintCode: `<html>
  <body>
    <section>
      <h1>River Dock</h1>
      <p>Park the boat near the river dock</p>
      <button>Dock Boat</button>
    </section>
  </body>
</html>`,
    requiredTags: ["html", "body", "section", "h1", "p", "button"],
    requiredKeywords: ["river", "dock", "boat"],
  }),

  createLevel({
    id: 8,
    type: "html",
    title: "Cloud Path",
    slug: "cloud-path",
    taskText:
      "Create a Cloud Path page using html, body, main, h1, p, and button.",
    hintCode: `<html>
  <body>
    <main>
      <h1>Cloud Path</h1>
      <p>Walk safely on the cloud path</p>
      <button>Start Path</button>
    </main>
  </body>
</html>`,
    requiredTags: ["html", "body", "main", "h1", "p", "button"],
    requiredKeywords: ["cloud", "path"],
  }),

  createLevel({
    id: 9,
    type: "html",
    title: "Magic Tree",
    slug: "magic-tree",
    taskText:
      "Create a Magic Tree page using html, body, article, h1, p, and button.",
    hintCode: `<html>
  <body>
    <article>
      <h1>Magic Tree</h1>
      <p>Grow the magic tree with water</p>
      <button>Grow Tree</button>
    </article>
  </body>
</html>`,
    requiredTags: ["html", "body", "article", "h1", "p", "button"],
    requiredKeywords: ["magic", "tree", "grow"],
  }),

  createLevel({
    id: 10,
    type: "html",
    title: "Toy House",
    slug: "toy-house",
    taskText:
      "Create a Toy House page using html, body, h1, p, ol, li, and button.",
    hintCode: `<html>
  <body>
    <h1>Toy House</h1>
    <p>Keep the toys inside the house</p>
    <ol>
      <li>Car</li>
      <li>Ball</li>
      <li>Doll</li>
    </ol>
    <button>Add Toys</button>
  </body>
</html>`,
    requiredTags: ["html", "body", "h1", "p", "ol", "li", "button"],
    requiredKeywords: ["toy", "house", "car", "ball"],
  }),

  createLevel({
    id: 11,
    type: "html",
    title: "School Bus",
    slug: "school-bus",
    taskText:
      "Create a School Bus page using html, body, nav, h1, p, and button.",
    hintCode: `<html>
  <body>
    <nav>Bus Route</nav>
    <h1>School Bus</h1>
    <p>The school bus is ready for pickup</p>
    <button>Start Ride</button>
  </body>
</html>`,
    requiredTags: ["html", "body", "nav", "h1", "p", "button"],
    requiredKeywords: ["school", "bus", "pickup"],
  }),

  createLevel({
    id: 12,
    type: "html",
    title: "Animal Park",
    slug: "animal-park",
    taskText:
      "Create an Animal Park page using html, body, h1, p, table, tr, and td.",
    hintCode: `<html>
  <body>
    <h1>Animal Park</h1>
    <p>Welcome to the animal park</p>
    <table>
      <tr>
        <td>Lion</td>
        <td>Tiger</td>
      </tr>
    </table>
  </body>
</html>`,
    requiredTags: ["html", "body", "h1", "p", "table", "tr", "td"],
    requiredKeywords: ["animal", "park", "lion"],
  }),

  createLevel({
    id: 13,
    type: "html",
    title: "Space Rocket",
    slug: "space-rocket",
    taskText:
      "Create a Space Rocket page using html, body, h1, p, strong, and button.",
    hintCode: `<html>
  <body>
    <h1>Space Rocket</h1>
    <p>Launch the <strong>rocket</strong> into space</p>
    <button>Launch</button>
  </body>
</html>`,
    requiredTags: ["html", "body", "h1", "p", "strong", "button"],
    requiredKeywords: ["space", "rocket", "launch"],
  }),

  createLevel({
    id: 14,
    type: "html",
    title: "Ice Cream Truck",
    slug: "ice-cream-truck",
    taskText:
      "Create an Ice Cream Truck page using html, body, h1, p, select, option, and button.",
    hintCode: `<html>
  <body>
    <h1>Ice Cream Truck</h1>
    <p>Choose your ice cream flavor</p>
    <select>
      <option>Vanilla</option>
      <option>Chocolate</option>
    </select>
    <button>Order</button>
  </body>
</html>`,
    requiredTags: ["html", "body", "h1", "p", "select", "option", "button"],
    requiredKeywords: ["ice", "cream", "vanilla"],
  }),

  createLevel({
    id: 15,
    type: "html",
    title: "Book Library",
    slug: "book-library",
    taskText:
      "Create a Book Library page using html, body, h1, p, input, and button.",
    hintCode: `<html>
  <body>
    <h1>Book Library</h1>
    <p>Search your favorite book</p>
    <input placeholder="Book name" />
    <button>Search</button>
  </body>
</html>`,
    requiredTags: ["html", "body", "h1", "p", "input", "button"],
    requiredKeywords: ["book", "library", "search"],
  }),

  createLevel({
    id: 16,
    type: "html",
    title: "Music Stage",
    slug: "music-stage",
    taskText:
      "Create a Music Stage page using html, body, h1, p, audio, and button.",
    hintCode: `<html>
  <body>
    <h1>Music Stage</h1>
    <p>Play music on the stage</p>
    <audio controls></audio>
    <button>Play Show</button>
  </body>
</html>`,
    requiredTags: ["html", "body", "h1", "p", "audio", "button"],
    requiredKeywords: ["music", "stage", "controls"],
  }),

  createLevel({
    id: 17,
    type: "html",
    title: "Video Room",
    slug: "video-room",
    taskText:
      "Create a Video Room page using html, body, h1, p, video, and button.",
    hintCode: `<html>
  <body>
    <h1>Video Room</h1>
    <p>Watch a learning video</p>
    <video controls width="240"></video>
    <button>Open Video</button>
  </body>
</html>`,
    requiredTags: ["html", "body", "h1", "p", "video", "button"],
    requiredKeywords: ["video", "room", "controls"],
  }),

  createLevel({
    id: 18,
    type: "html",
    title: "Profile Card",
    slug: "profile-card",
    taskText:
      "Create a Profile Card using html, body, div, h1, p, img, and button.",
    hintCode: `<html>
  <body>
    <div>
      <img src="https://via.placeholder.com/120" alt="profile" />
      <h1>My Profile</h1>
      <p>I am learning coding</p>
      <button>Follow</button>
    </div>
  </body>
</html>`,
    requiredTags: ["html", "body", "div", "img", "h1", "p", "button"],
    requiredKeywords: ["profile", "coding", "follow"],
  }),

  createLevel({
    id: 19,
    type: "html",
    title: "Contact Form",
    slug: "contact-form",
    taskText:
      "Create a Contact Form using html, body, form, input, textarea, and button.",
    hintCode: `<html>
  <body>
    <h1>Contact Form</h1>
    <form>
      <input placeholder="Name" />
      <textarea placeholder="Message"></textarea>
      <button>Send</button>
    </form>
  </body>
</html>`,
    requiredTags: ["html", "body", "h1", "form", "input", "textarea", "button"],
    requiredKeywords: ["contact", "name", "message"],
  }),

  createLevel({
    id: 20,
    type: "html",
    title: "Birthday Invite",
    slug: "birthday-invite",
    taskText:
      "Create a Birthday Invite page using html, body, h1, p, time, and button.",
    hintCode: `<html>
  <body>
    <h1>Birthday Invite</h1>
    <p>Come to my birthday party</p>
    <time>6:00 PM</time>
    <button>Join Party</button>
  </body>
</html>`,
    requiredTags: ["html", "body", "h1", "p", "time", "button"],
    requiredKeywords: ["birthday", "party", "join"],
  }),

  createLevel({
    id: 21,
    type: "css",
    title: "Green Button",
    slug: "green-button",
    taskText:
      "Create a button and style it with CSS using background, color, padding, and border-radius.",
    hintCode: `<html>
  <head>
    <style>
      button {
        background: green;
        color: white;
        padding: 12px;
        border-radius: 10px;
      }
    </style>
  </head>
  <body>
    <h1>Green Button</h1>
    <button>Start</button>
  </body>
</html>`,
    requiredTags: ["html", "head", "style", "body", "h1", "button"],
    requiredKeywords: ["background", "green", "color", "padding", "border-radius"],
  }),

  createLevel({
    id: 22,
    type: "css",
    title: "Blue Card",
    slug: "blue-card",
    taskText:
      "Create a card using div and style it with CSS background, border, padding, and border-radius.",
    hintCode: `<html>
  <head>
    <style>
      div {
        background: lightblue;
        border: 3px solid blue;
        padding: 20px;
        border-radius: 16px;
      }
    </style>
  </head>
  <body>
    <div>
      <h1>Blue Card</h1>
      <p>This is a styled card</p>
    </div>
  </body>
</html>`,
    requiredTags: ["html", "head", "style", "body", "div", "h1", "p"],
    requiredKeywords: ["background", "lightblue", "border", "padding", "border-radius"],
  }),

  createLevel({
    id: 23,
    type: "css",
    title: "Red Title",
    slug: "red-title",
    taskText:
      "Create a title and style the h1 using CSS color, text-align, and font-size.",
    hintCode: `<html>
  <head>
    <style>
      h1 {
        color: red;
        text-align: center;
        font-size: 34px;
      }
    </style>
  </head>
  <body>
    <h1>Red Title</h1>
    <p>The title is styled with CSS</p>
  </body>
</html>`,
    requiredTags: ["html", "head", "style", "body", "h1", "p"],
    requiredKeywords: ["color", "red", "text-align", "font-size"],
  }),

  createLevel({
    id: 24,
    type: "css",
    title: "Round Image",
    slug: "round-image",
    taskText:
      "Create an image and make it round using CSS width, height, and border-radius.",
    hintCode: `<html>
  <head>
    <style>
      img {
        width: 140px;
        height: 140px;
        border-radius: 70px;
      }
    </style>
  </head>
  <body>
    <h1>Round Image</h1>
    <img src="https://via.placeholder.com/140" alt="round image" />
  </body>
</html>`,
    requiredTags: ["html", "head", "style", "body", "h1", "img"],
    requiredKeywords: ["width", "height", "border-radius", "alt"],
  }),

  createLevel({
    id: 25,
    type: "css",
    title: "Yellow Box",
    slug: "yellow-box",
    taskText:
      "Create a yellow box using div and CSS width, height, background, and margin.",
    hintCode: `<html>
  <head>
    <style>
      div {
        width: 180px;
        height: 120px;
        background: yellow;
        margin: 20px;
      }
    </style>
  </head>
  <body>
    <h1>Yellow Box</h1>
    <div></div>
  </body>
</html>`,
    requiredTags: ["html", "head", "style", "body", "h1", "div"],
    requiredKeywords: ["width", "height", "background", "yellow", "margin"],
  }),

  createLevel({
    id: 26,
    type: "css",
    title: "Flex Row",
    slug: "flex-row",
    taskText:
      "Create three boxes in a row using CSS display flex and gap.",
    hintCode: `<html>
  <head>
    <style>
      .row {
        display: flex;
        gap: 10px;
      }

      .box {
        background: orange;
        padding: 20px;
      }
    </style>
  </head>
  <body>
    <h1>Flex Row</h1>
    <div class="row">
      <div class="box">1</div>
      <div class="box">2</div>
      <div class="box">3</div>
    </div>
  </body>
</html>`,
    requiredTags: ["html", "head", "style", "body", "h1", "div"],
    requiredKeywords: ["display", "flex", "gap", "class", "box"],
  }),

  createLevel({
    id: 27,
    type: "css",
    title: "Center Text",
    slug: "center-text",
    taskText:
      "Center text inside a card using CSS text-align, padding, and background.",
    hintCode: `<html>
  <head>
    <style>
      .card {
        background: pink;
        padding: 20px;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Center Text</h1>
      <p>This text is centered</p>
    </div>
  </body>
</html>`,
    requiredTags: ["html", "head", "style", "body", "div", "h1", "p"],
    requiredKeywords: ["text-align", "center", "padding", "background", "card"],
  }),

  createLevel({
    id: 28,
    type: "css",
    title: "Shadow Card",
    slug: "shadow-card",
    taskText:
      "Create a card with CSS box-shadow, padding, background, and border-radius.",
    hintCode: `<html>
  <head>
    <style>
      .card {
        background: white;
        padding: 20px;
        border-radius: 16px;
        box-shadow: 0 4px 12px gray;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Shadow Card</h1>
      <p>This card has a shadow</p>
    </div>
  </body>
</html>`,
    requiredTags: ["html", "head", "style", "body", "div", "h1", "p"],
    requiredKeywords: ["box-shadow", "border-radius", "padding", "background", "card"],
  }),

  createLevel({
    id: 29,
    type: "css",
    title: "Gradient Banner",
    slug: "gradient-banner",
    taskText:
      "Create a banner with CSS linear-gradient, color, padding, and text-align.",
    hintCode: `<html>
  <head>
    <style>
      .banner {
        background: linear-gradient(orange, red);
        color: white;
        padding: 24px;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="banner">
      <h1>Gradient Banner</h1>
    </div>
  </body>
</html>`,
    requiredTags: ["html", "head", "style", "body", "div", "h1"],
    requiredKeywords: ["linear-gradient", "orange", "red", "color", "padding"],
  }),

  createLevel({
    id: 30,
    type: "css",
    title: "Styled List",
    slug: "styled-list",
    taskText:
      "Create a list and style list items using CSS background, margin, and padding.",
    hintCode: `<html>
  <head>
    <style>
      li {
        background: lightgreen;
        margin: 8px;
        padding: 10px;
      }
    </style>
  </head>
  <body>
    <h1>Styled List</h1>
    <ul>
      <li>HTML</li>
      <li>CSS</li>
      <li>JavaScript</li>
    </ul>
  </body>
</html>`,
    requiredTags: ["html", "head", "style", "body", "h1", "ul", "li"],
    requiredKeywords: ["background", "lightgreen", "margin", "padding"],
  }),

  createLevel({
    id: 31,
    type: "css",
    title: "Login Box",
    slug: "login-box",
    taskText:
      "Create a login box and style inputs using CSS padding, border, and margin.",
    hintCode: `<html>
  <head>
    <style>
      input {
        padding: 10px;
        border: 2px solid blue;
        margin: 6px;
      }

      button {
        background: blue;
        color: white;
        padding: 10px;
      }
    </style>
  </head>
  <body>
    <h1>Login Box</h1>
    <input placeholder="Username" />
    <input placeholder="Password" />
    <button>Login</button>
  </body>
</html>`,
    requiredTags: ["html", "head", "style", "body", "h1", "input", "button"],
    requiredKeywords: ["padding", "border", "margin", "username", "password"],
  }),

  createLevel({
    id: 32,
    type: "css",
    title: "Navbar Style",
    slug: "navbar-style",
    taskText:
      "Create a navbar and style it using CSS background, color, display flex, and gap.",
    hintCode: `<html>
  <head>
    <style>
      nav {
        background: purple;
        color: white;
        display: flex;
        gap: 20px;
        padding: 12px;
      }
    </style>
  </head>
  <body>
    <nav>
      <span>Home</span>
      <span>Games</span>
      <span>Profile</span>
    </nav>
  </body>
</html>`,
    requiredTags: ["html", "head", "style", "body", "nav", "span"],
    requiredKeywords: ["background", "purple", "display", "flex", "gap"],
  }),

  createLevel({
    id: 33,
    type: "css",
    title: "Circle Badge",
    slug: "circle-badge",
    taskText:
      "Create a circle badge using CSS width, height, border-radius, and background.",
    hintCode: `<html>
  <head>
    <style>
      .badge {
        width: 90px;
        height: 90px;
        border-radius: 45px;
        background: gold;
        text-align: center;
        padding-top: 32px;
      }
    </style>
  </head>
  <body>
    <div class="badge">100</div>
  </body>
</html>`,
    requiredTags: ["html", "head", "style", "body", "div"],
    requiredKeywords: ["width", "height", "border-radius", "background", "gold"],
  }),

  createLevel({
    id: 34,
    type: "css",
    title: "Hover Button",
    slug: "hover-button",
    taskText:
      "Create a button and add CSS hover effect using button:hover.",
    hintCode: `<html>
  <head>
    <style>
      button {
        background: blue;
        color: white;
        padding: 12px;
      }

      button:hover {
        background: red;
      }
    </style>
  </head>
  <body>
    <h1>Hover Button</h1>
    <button>Hover Me</button>
  </body>
</html>`,
    requiredTags: ["html", "head", "style", "body", "h1", "button"],
    requiredKeywords: ["button:hover", "background", "blue", "red"],
  }),

  createLevel({
    id: 35,
    type: "css",
    title: "Responsive Box",
    slug: "responsive-box",
    taskText:
      "Create a responsive box using CSS width, max-width, margin, and background.",
    hintCode: `<html>
  <head>
    <style>
      .box {
        width: 90%;
        max-width: 300px;
        margin: auto;
        background: skyblue;
        padding: 20px;
      }
    </style>
  </head>
  <body>
    <div class="box">
      <h1>Responsive Box</h1>
      <p>This box fits the screen</p>
    </div>
  </body>
</html>`,
    requiredTags: ["html", "head", "style", "body", "div", "h1", "p"],
    requiredKeywords: ["width", "max-width", "margin", "auto", "skyblue"],
  }),

  createLevel({
    id: 36,
    type: "javascript",
    title: "Click Alert",
    slug: "click-alert",
    taskText:
      "Create a button that runs JavaScript using onclick and alert.",
    hintCode: `<html>
  <body>
    <h1>Click Alert</h1>
    <button onclick="showMessage()">Click Me</button>

    <script>
      function showMessage() {
        alert("Hello FunzyCode");
      }
    </script>
  </body>
</html>`,
    requiredTags: ["html", "body", "h1", "button", "script"],
    requiredKeywords: ["onclick", "function", "alert"],
  }),

  createLevel({
    id: 37,
    type: "javascript",
    title: "Change Text",
    slug: "change-text",
    taskText:
      "Create a button that changes h1 text using JavaScript getElementById.",
    hintCode: `<html>
  <body>
    <h1 id="title">Old Text</h1>
    <button onclick="changeText()">Change</button>

    <script>
      function changeText() {
        document.getElementById("title").innerText = "New Text";
      }
    </script>
  </body>
</html>`,
    requiredTags: ["html", "body", "h1", "button", "script"],
    requiredKeywords: ["onclick", "function", "getElementById", "innerText"],
  }),

  createLevel({
    id: 38,
    type: "javascript",
    title: "Color Changer",
    slug: "color-changer",
    taskText:
      "Create a button that changes page background color using JavaScript.",
    hintCode: `<html>
  <body>
    <h1>Color Changer</h1>
    <button onclick="changeColor()">Change Color</button>

    <script>
      function changeColor() {
        document.body.style.background = "yellow";
      }
    </script>
  </body>
</html>`,
    requiredTags: ["html", "body", "h1", "button", "script"],
    requiredKeywords: ["onclick", "function", "document.body.style.background", "yellow"],
  }),

  createLevel({
    id: 39,
    type: "javascript",
    title: "Click Counter",
    slug: "click-counter",
    taskText:
      "Create a click counter using JavaScript variable, function, and innerText.",
    hintCode: `<html>
  <body>
    <h1 id="count">0</h1>
    <button onclick="addCount()">Click</button>

    <script>
      let count = 0;

      function addCount() {
        count = count + 1;
        document.getElementById("count").innerText = count;
      }
    </script>
  </body>
</html>`,
    requiredTags: ["html", "body", "h1", "button", "script"],
    requiredKeywords: ["let", "count", "onclick", "function", "innerText"],
  }),

  createLevel({
    id: 40,
    type: "javascript",
    title: "Show Image",
    slug: "show-image",
    taskText:
      "Create a button that shows an image using JavaScript display style.",
    hintCode: `<html>
  <body>
    <h1>Show Image</h1>
    <button onclick="showImage()">Show</button>
    <img id="photo" src="https://via.placeholder.com/160" alt="photo" style="display:none;" />

    <script>
      function showImage() {
        document.getElementById("photo").style.display = "block";
      }
    </script>
  </body>
</html>`,
    requiredTags: ["html", "body", "h1", "button", "img", "script"],
    requiredKeywords: ["onclick", "function", "style.display", "block"],
  }),

  createLevel({
    id: 41,
    type: "javascript",
    title: "Hide Text",
    slug: "hide-text",
    taskText:
      "Create a button that hides a paragraph using JavaScript display none.",
    hintCode: `<html>
  <body>
    <h1>Hide Text</h1>
    <p id="text">Hide this text</p>
    <button onclick="hideText()">Hide</button>

    <script>
      function hideText() {
        document.getElementById("text").style.display = "none";
      }
    </script>
  </body>
</html>`,
    requiredTags: ["html", "body", "h1", "p", "button", "script"],
    requiredKeywords: ["onclick", "function", "style.display", "none"],
  }),

  createLevel({
    id: 42,
    type: "javascript",
    title: "Input Greeting",
    slug: "input-greeting",
    taskText:
      "Create an input and button that shows greeting text using JavaScript value.",
    hintCode: `<html>
  <body>
    <h1>Input Greeting</h1>
    <input id="name" placeholder="Your name" />
    <button onclick="sayHello()">Say Hello</button>
    <p id="result"></p>

    <script>
      function sayHello() {
        let name = document.getElementById("name").value;
        document.getElementById("result").innerText = "Hello " + name;
      }
    </script>
  </body>
</html>`,
    requiredTags: ["html", "body", "h1", "input", "button", "p", "script"],
    requiredKeywords: ["value", "onclick", "function", "result", "hello"],
  }),

  createLevel({
    id: 43,
    type: "javascript",
    title: "Simple Add",
    slug: "simple-add",
    taskText:
      "Create JavaScript that adds two numbers and shows the result.",
    hintCode: `<html>
  <body>
    <h1>Simple Add</h1>
    <p id="answer"></p>
    <button onclick="addNumbers()">Add</button>

    <script>
      function addNumbers() {
        let total = 5 + 3;
        document.getElementById("answer").innerText = total;
      }
    </script>
  </body>
</html>`,
    requiredTags: ["html", "body", "h1", "p", "button", "script"],
    requiredKeywords: ["function", "let", "total", "getElementById", "innerText"],
  }),

  createLevel({
    id: 44,
    type: "javascript",
    title: "Toggle Box",
    slug: "toggle-box",
    taskText:
      "Create a button that toggles a box using JavaScript if condition.",
    hintCode: `<html>
  <body>
    <h1>Toggle Box</h1>
    <div id="box">Box</div>
    <button onclick="toggleBox()">Toggle</button>

    <script>
      function toggleBox() {
        let box = document.getElementById("box");

        if (box.style.display === "none") {
          box.style.display = "block";
        } else {
          box.style.display = "none";
        }
      }
    </script>
  </body>
</html>`,
    requiredTags: ["html", "body", "h1", "div", "button", "script"],
    requiredKeywords: ["if", "else", "style.display", "onclick", "function"],
  }),

  createLevel({
    id: 45,
    type: "javascript",
    title: "Random Number",
    slug: "random-number",
    taskText:
      "Create a button that shows a random number using Math.random.",
    hintCode: `<html>
  <body>
    <h1>Random Number</h1>
    <p id="number"></p>
    <button onclick="makeNumber()">Generate</button>

    <script>
      function makeNumber() {
        let number = Math.floor(Math.random() * 10);
        document.getElementById("number").innerText = number;
      }
    </script>
  </body>
</html>`,
    requiredTags: ["html", "body", "h1", "p", "button", "script"],
    requiredKeywords: ["Math.random", "Math.floor", "onclick", "function"],
  }),

  createLevel({
    id: 46,
    type: "javascript",
    title: "Mini Calculator",
    slug: "mini-calculator",
    taskText:
      "Create a mini calculator using two inputs, button, Number, and innerText.",
    hintCode: `<html>
  <body>
    <h1>Mini Calculator</h1>
    <input id="num1" placeholder="First number" />
    <input id="num2" placeholder="Second number" />
    <button onclick="calculate()">Calculate</button>
    <p id="total"></p>

    <script>
      function calculate() {
        let a = Number(document.getElementById("num1").value);
        let b = Number(document.getElementById("num2").value);
        document.getElementById("total").innerText = a + b;
      }
    </script>
  </body>
</html>`,
    requiredTags: ["html", "body", "h1", "input", "button", "p", "script"],
    requiredKeywords: ["Number", "value", "calculate", "innerText"],
  }),

  createLevel({
    id: 47,
    type: "javascript",
    title: "Todo Add",
    slug: "todo-add",
    taskText:
      "Create a todo app that adds input text into a list using JavaScript.",
    hintCode: `<html>
  <body>
    <h1>Todo Add</h1>
    <input id="todo" placeholder="Todo item" />
    <button onclick="addTodo()">Add Todo</button>
    <ul id="list"></ul>

    <script>
      function addTodo() {
        let text = document.getElementById("todo").value;
        let item = document.createElement("li");
        item.innerText = text;
        document.getElementById("list").appendChild(item);
      }
    </script>
  </body>
</html>`,
    requiredTags: ["html", "body", "h1", "input", "button", "ul", "script"],
    requiredKeywords: ["createElement", "appendChild", "value", "innerText"],
  }),

  createLevel({
    id: 48,
    type: "javascript",
    title: "Digital Clock",
    slug: "digital-clock",
    taskText:
      "Create a digital clock using Date and toLocaleTimeString.",
    hintCode: `<html>
  <body>
    <h1>Digital Clock</h1>
    <p id="clock"></p>
    <button onclick="showTime()">Show Time</button>

    <script>
      function showTime() {
        let now = new Date();
        document.getElementById("clock").innerText = now.toLocaleTimeString();
      }
    </script>
  </body>
</html>`,
    requiredTags: ["html", "body", "h1", "p", "button", "script"],
    requiredKeywords: ["Date", "toLocaleTimeString", "function", "clock"],
  }),

  createLevel({
    id: 49,
    type: "javascript",
    title: "Light Switch",
    slug: "light-switch",
    taskText:
      "Create a light switch that changes background color using JavaScript.",
    hintCode: `<html>
  <body>
    <h1>Light Switch</h1>
    <button onclick="turnOn()">Turn On</button>
    <button onclick="turnOff()">Turn Off</button>

    <script>
      function turnOn() {
        document.body.style.background = "white";
      }

      function turnOff() {
        document.body.style.background = "black";
      }
    </script>
  </body>
</html>`,
    requiredTags: ["html", "body", "h1", "button", "script"],
    requiredKeywords: ["turnOn", "turnOff", "document.body.style.background"],
  }),

  createLevel({
    id: 50,
    type: "javascript",
    title: "Final Mini Game",
    slug: "final-mini-game",
    taskText:
      "Create a final mini game button that increases score using JavaScript.",
    hintCode: `<html>
  <head>
    <style>
      body {
        text-align: center;
        font-family: Arial;
      }

      button {
        background: green;
        color: white;
        padding: 14px;
        border-radius: 12px;
      }
    </style>
  </head>
  <body>
    <h1>Final Mini Game</h1>
    <p>Score: <span id="score">0</span></p>
    <button onclick="addScore()">Get Point</button>

    <script>
      let score = 0;

      function addScore() {
        score = score + 1;
        document.getElementById("score").innerText = score;
      }
    </script>
  </body>
</html>`,
    requiredTags: ["html", "head", "style", "body", "h1", "p", "span", "button", "script"],
    requiredKeywords: ["score", "onclick", "function", "getElementById", "innerText"],
  }),
];

const BASE_GIFT_OPTIONS = [
  {
    type: "empty",
    reward: 0,
    label: "Empty",
  },
  {
    type: "coins50",
    reward: 50,
    label: "50 Coins",
  },
  {
    type: "coins100",
    reward: 100,
    label: "100 Coins",
  },
];

const GameContext = createContext(null);

const clampNumber = (value, min, max) => {
  return Math.max(min, Math.min(max, value));
};

const safeLevelNumber = (levelNumber) => {
  const parsed = Number(levelNumber);
  if (!Number.isFinite(parsed)) return 1;
  return clampNumber(Math.floor(parsed), 1, TOTAL_LEVELS);
};

const cleanCode = (code) => {
  return String(code || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
};

const getUnlockedLevelFromState = (state) => {
  for (let level = 1; level <= TOTAL_LEVELS; level += 1) {
    if (!state.completedLevels.includes(level)) {
      return level;
    }
  }

  return TOTAL_LEVELS;
};

const getInitialState = () => ({
  coins: GAME_LIMITS.INITIAL_COINS,
  stars: GAME_LIMITS.INITIAL_STARS,
  currentLevel: 1,
  completedLevels: [],
  completedStars: {},
  levelCodes: {},
  levelSeconds: {},
  hintUsedLevels: {},
  autoFixUsedLevels: {},
  extraTimeUses: {},
  openedGifts: {},
  shareRewardClaimed: false,
  soundEnabled: true,
  lastMessage: "",
});


const normalizeGiftFromBackend = (gift) => {
  if (!gift) return null;

  const reward = Number(gift.rewardCoins ?? gift.reward ?? 0) || 0;
  const type = reward === 100 ? "coins100" : reward === 50 ? "coins50" : "empty";

  return {
    id: gift.giftId || `level-${gift.levelNumber}-gift-opened`,
    slot: 1,
    type,
    reward,
    label: reward > 0 ? `${reward} Coins` : "Empty",
    opened: !!gift.opened || !!gift.openedAt || true,
    openedAt: gift.openedAt,
  };
};

const mapProgressToLocalState = (progress, previousState = getInitialState()) => {
  const levels = Array.isArray(progress?.levels) ? progress.levels : [];
  const gifts = Array.isArray(progress?.gifts) ? progress.gifts : [];

  const completedLevels = [];
  const completedStars = {};
  const levelCodes = { ...(previousState.levelCodes || {}) };
  const levelSeconds = { ...(previousState.levelSeconds || {}) };
  const hintUsedLevels = {};
  const autoFixUsedLevels = {};
  const extraTimeUses = {};

  levels.forEach((item) => {
    const level = safeLevelNumber(item.levelNumber || item.level || item.id);
    const status = String(item.status || "").toUpperCase();

    if (status === "COMPLETED" && !completedLevels.includes(level)) {
      completedLevels.push(level);
    }

    if (Number(item.starsEarned) > 0) {
      completedStars[level] = clampNumber(Number(item.starsEarned), 1, 3);
    }

    if (typeof item.submittedCode === "string") {
      levelCodes[level] = item.submittedCode;
    }

    if (Number.isFinite(Number(item.secondsLeft))) {
      levelSeconds[level] = Math.max(0, Number(item.secondsLeft));
    }

    if (item.hintUsed) {
      hintUsedLevels[level] = true;
    }

    if (item.autoFixUsed) {
      autoFixUsedLevels[level] = true;
    }

    if (Number(item.extraTimeUses) > 0) {
      extraTimeUses[level] = Number(item.extraTimeUses);
    }
  });

  const openedGifts = {};
  gifts.forEach((gift) => {
    const level = safeLevelNumber(gift.levelNumber || gift.level);
    const normalized = normalizeGiftFromBackend(gift);
    if (normalized) {
      openedGifts[level] = normalized;
    }
  });

  completedLevels.sort((a, b) => a - b);

  const mergedState = {
    ...previousState,
    coins: Math.max(0, Number(progress?.coins ?? previousState.coins ?? GAME_LIMITS.INITIAL_COINS)),
    stars: Math.max(0, Number(progress?.stars ?? previousState.stars ?? GAME_LIMITS.INITIAL_STARS)),
    completedLevels,
    completedStars,
    levelCodes,
    levelSeconds,
    hintUsedLevels,
    autoFixUsedLevels,
    extraTimeUses,
    openedGifts,
    shareRewardClaimed: Boolean(progress?.shareRewardClaimed),
    soundEnabled: progress?.soundEnabled !== undefined ? Boolean(progress.soundEnabled) : previousState.soundEnabled,
    lastMessage: previousState.lastMessage || "",
  };

  const serverCurrentLevel = Number(progress?.currentLevel);
  mergedState.currentLevel = Number.isFinite(serverCurrentLevel)
    ? clampNumber(Math.floor(serverCurrentLevel), 1, TOTAL_LEVELS)
    : getUnlockedLevelFromState(mergedState);

  return mergedState;
};

export function GameProvider({ children }) {
  const { isAuthenticated, token } = useAuth();
  const [gameState, setGameState] = useState(getInitialState);
  const [loadingProgress, setLoadingProgress] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const saveCodeTimersRef = useRef({});
  const mountedRef = useRef(true);

  const backendEnabled = !!isAuthenticated && !!token;

  const applyProgressFromBackend = useCallback((progress) => {
    if (!progress) return;

    setGameState((prev) => mapProgressToLocalState(progress, prev));
  }, []);

  const refreshGameProgress = useCallback(
    async (silent = false) => {
      if (!backendEnabled) return null;

      try {
        if (!silent) setLoadingProgress(true);
        const progress = await gameService.getProgress();

        if (mountedRef.current) {
          applyProgressFromBackend(progress);
        }

        return progress;
      } catch (error) {
        const message = getApiErrorMessage(error);

        if (mountedRef.current && !silent) {
          setGameState((prev) => ({
            ...prev,
            lastMessage: message,
          }));
        }

        return null;
      } finally {
        if (mountedRef.current && !silent) {
          setLoadingProgress(false);
        }
      }
    },
    [applyProgressFromBackend, backendEnabled]
  );

  const runBackendMutation = useCallback(
    async (operation, options = {}) => {
      const { refresh = true, messageOnError = true } = options;

      if (!backendEnabled || typeof operation !== "function") {
        return null;
      }

      try {
        setSyncing(true);
        const data = await operation();

        if (refresh) {
          await refreshGameProgress(true);
        }

        return data;
      } catch (error) {
        const message = getApiErrorMessage(error);

        if (mountedRef.current && messageOnError) {
          setGameState((prev) => ({
            ...prev,
            lastMessage: message,
          }));
        }

        return null;
      } finally {
        if (mountedRef.current) {
          setSyncing(false);
        }
      }
    },
    [backendEnabled, refreshGameProgress]
  );

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      Object.values(saveCodeTimersRef.current || {}).forEach((timerId) => {
        clearTimeout(timerId);
      });
    };
  }, []);

  useEffect(() => {
    if (backendEnabled) {
      refreshGameProgress(false);
    } else {
      setGameState(getInitialState());
    }
  }, [backendEnabled, refreshGameProgress]);

  const currentLevel = useMemo(() => {
    return getUnlockedLevelFromState(gameState);
  }, [gameState.completedLevels]);

  const completedCount = gameState.completedLevels.length;

  const getLevel = useCallback((levelNumber = 1) => {
    const level = safeLevelNumber(levelNumber);
    return LEVELS[level - 1];
  }, []);

  const isLevelCompleted = useCallback(
    (levelNumber) => {
      const level = safeLevelNumber(levelNumber);
      return gameState.completedLevels.includes(level);
    },
    [gameState.completedLevels]
  );

  const isLevelLocked = useCallback(
    (levelNumber) => {
      const level = safeLevelNumber(levelNumber);
      const unlockedLevel = getUnlockedLevelFromState(gameState);

      if (gameState.completedLevels.includes(level)) return false;
      return level > unlockedLevel;
    },
    [gameState]
  );

  const getLevelStatus = useCallback(
    (levelNumber) => {
      const level = safeLevelNumber(levelNumber);

      if (gameState.completedLevels.includes(level)) return "completed";
      if (isLevelLocked(level)) return "locked";
      if (level === currentLevel) return "current";

      return "open";
    },
    [currentLevel, gameState.completedLevels, isLevelLocked]
  );

  const getLevelCode = useCallback(
    (levelNumber) => {
      const level = safeLevelNumber(levelNumber);
      return gameState.levelCodes[level] || "";
    },
    [gameState.levelCodes]
  );

  const setLevelCode = useCallback(
    (levelNumber, code) => {
      const level = safeLevelNumber(levelNumber);
      const submittedCode = String(code || "");

      setGameState((prev) => ({
        ...prev,
        levelCodes: {
          ...prev.levelCodes,
          [level]: submittedCode,
        },
        lastMessage: "",
      }));

      if (backendEnabled) {
        clearTimeout(saveCodeTimersRef.current[level]);
        saveCodeTimersRef.current[level] = setTimeout(() => {
          runBackendMutation(
            () =>
              levelService.saveCode(level, {
                submittedCode,
              }),
            { refresh: false, messageOnError: false }
          );
        }, 700);
      }
    },
    [backendEnabled, runBackendMutation]
  );

  const getLevelSeconds = useCallback(
    (levelNumber) => {
      const level = safeLevelNumber(levelNumber);
      return gameState.levelSeconds[level] ?? getLevel(level).seconds;
    },
    [gameState.levelSeconds, getLevel]
  );

  const setLevelSeconds = useCallback((levelNumber, seconds) => {
    const level = safeLevelNumber(levelNumber);
    const nextSeconds = Math.max(0, Number(seconds) || 0);

    setGameState((prev) => ({
      ...prev,
      levelSeconds: {
        ...prev.levelSeconds,
        [level]: nextSeconds,
      },
    }));
  }, []);

  const setGameMessage = useCallback((message) => {
    setGameState((prev) => ({
      ...prev,
      lastMessage: String(message || ""),
    }));
  }, []);

  const startLevel = useCallback(
    (levelNumber) => {
      const level = safeLevelNumber(levelNumber);

      let result = {
        ok: true,
        message: "",
        level,
      };

      setGameState((prev) => {
        const unlockedLevel = getUnlockedLevelFromState(prev);
        const locked =
          level > unlockedLevel && !prev.completedLevels.includes(level);

        if (locked) {
          result = {
            ok: false,
            message: "This level is locked.",
            level,
          };

          return {
            ...prev,
            lastMessage: result.message,
          };
        }

        return {
          ...prev,
          currentLevel: level,
          levelSeconds: {
            ...prev.levelSeconds,
            [level]: prev.levelSeconds[level] ?? LEVELS[level - 1].seconds,
          },
          lastMessage: "",
        };
      });

      if (result.ok) {
        runBackendMutation(() => levelService.startLevel(level), {
          refresh: true,
          messageOnError: false,
        });
      }

      return result;
    },
    [runBackendMutation]
  );

  const resetLevel = useCallback(
    (levelNumber) => {
      const level = safeLevelNumber(levelNumber);

      setGameState((prev) => ({
        ...prev,
        levelCodes: {
          ...prev.levelCodes,
          [level]: "",
        },
        levelSeconds: {
          ...prev.levelSeconds,
          [level]: LEVELS[level - 1].seconds,
        },
        lastMessage: "",
      }));

      runBackendMutation(
        () =>
          levelService.saveCode(level, {
            submittedCode: "",
            secondsLeft: LEVELS[level - 1].seconds,
          }),
        { refresh: false, messageOnError: false }
      );

      return {
        ok: true,
        message: "Level reset.",
        level,
      };
    },
    [runBackendMutation]
  );

  const tickLevelTimer = useCallback((levelNumber) => {
    const level = safeLevelNumber(levelNumber);

    let nextSecondsValue = 0;

    setGameState((prev) => {
      const currentSeconds =
        prev.levelSeconds[level] ?? LEVELS[level - 1].seconds;
      const nextSeconds = Math.max(currentSeconds - 1, 0);
      nextSecondsValue = nextSeconds;

      return {
        ...prev,
        levelSeconds: {
          ...prev.levelSeconds,
          [level]: nextSeconds,
        },
      };
    });

    return nextSecondsValue;
  }, []);

  const addExtraTime = useCallback((levelNumber) => {
    const level = safeLevelNumber(levelNumber);

    let result = {
      ok: false,
      message: "",
    };

    setGameState((prev) => {
      const usedCount = prev.extraTimeUses[level] || 0;

      if (usedCount >= GAME_LIMITS.MAX_EXTRA_TIME_PER_LEVEL) {
        result = {
          ok: false,
          message: `Extra time limit reached for Level ${level}.`,
        };

        return {
          ...prev,
          lastMessage: result.message,
        };
      }

      if (prev.coins < GAME_LIMITS.EXTRA_TIME_COST_COINS) {
        result = {
          ok: false,
          message: `Need ${GAME_LIMITS.EXTRA_TIME_COST_COINS} coins for extra time.`,
        };

        return {
          ...prev,
          lastMessage: result.message,
        };
      }

      const currentSeconds =
        prev.levelSeconds[level] ?? LEVELS[level - 1].seconds;

      result = {
        ok: true,
        message: `+${GAME_LIMITS.EXTRA_TIME_SECONDS} seconds added.`,
      };

      return {
        ...prev,
        coins: prev.coins - GAME_LIMITS.EXTRA_TIME_COST_COINS,
        levelSeconds: {
          ...prev.levelSeconds,
          [level]: currentSeconds + GAME_LIMITS.EXTRA_TIME_SECONDS,
        },
        extraTimeUses: {
          ...prev.extraTimeUses,
          [level]: usedCount + 1,
        },
        lastMessage: result.message,
      };
    });

    if (result.ok) {
      runBackendMutation(() => levelService.extraTime(level), {
        refresh: true,
      });
    }

    return result;
  }, [runBackendMutation]);

  const buyHint = useCallback((levelNumber) => {
    const level = safeLevelNumber(levelNumber);

    let result = {
      ok: false,
      message: "",
      code: LEVELS[level - 1].hintCode,
    };

    setGameState((prev) => {
      const alreadyUsed = !!prev.hintUsedLevels[level];

      if (alreadyUsed) {
        result = {
          ok: true,
          message: "Hint already unlocked.",
          code: LEVELS[level - 1].hintCode,
        };

        return {
          ...prev,
          lastMessage: "",
        };
      }

      if (prev.coins < GAME_LIMITS.HINT_COST_COINS) {
        result = {
          ok: false,
          message: `Need ${GAME_LIMITS.HINT_COST_COINS} coins for hint.`,
          code: LEVELS[level - 1].hintCode,
        };

        return {
          ...prev,
          lastMessage: result.message,
        };
      }

      result = {
        ok: true,
        message: "Hint unlocked.",
        code: LEVELS[level - 1].hintCode,
      };

      return {
        ...prev,
        coins: prev.coins - GAME_LIMITS.HINT_COST_COINS,
        hintUsedLevels: {
          ...prev.hintUsedLevels,
          [level]: true,
        },
        lastMessage: result.message,
      };
    });

    if (result.ok) {
      runBackendMutation(() => levelService.buyHint(level), {
        refresh: true,
      });
    }

    return result;
  }, [runBackendMutation]);

  const autoFixLevel = useCallback((levelNumber) => {
    const level = safeLevelNumber(levelNumber);
    const fixedCode = LEVELS[level - 1].hintCode;

    let result = {
      ok: false,
      message: "",
      code: fixedCode,
    };

    setGameState((prev) => {
      const alreadyUsed = !!prev.autoFixUsedLevels[level];

      if (!alreadyUsed && prev.stars < GAME_LIMITS.AUTOFIX_COST_STARS) {
        result = {
          ok: false,
          message: `Need ${GAME_LIMITS.AUTOFIX_COST_STARS} star for Auto Fix.`,
          code: fixedCode,
        };

        return {
          ...prev,
          lastMessage: result.message,
        };
      }

      result = {
        ok: true,
        message: alreadyUsed
          ? "Auto Fix already used. Code filled again."
          : "Auto Fix completed. Press Run.",
        code: fixedCode,
      };

      return {
        ...prev,
        stars: alreadyUsed
          ? prev.stars
          : prev.stars - GAME_LIMITS.AUTOFIX_COST_STARS,
        levelCodes: {
          ...prev.levelCodes,
          [level]: fixedCode,
        },
        autoFixUsedLevels: {
          ...prev.autoFixUsedLevels,
          [level]: true,
        },
        lastMessage: result.message,
      };
    });

    if (result.ok) {
      runBackendMutation(() => levelService.autoFix(level), {
        refresh: true,
      });
    }

    return result;
  }, [runBackendMutation]);

  const validateCode = useCallback(
    (levelNumber, submittedCode) => {
      const level = safeLevelNumber(levelNumber);
      const levelInfo = getLevel(level);
      const code = cleanCode(submittedCode);

      const requiredTags = levelInfo.requiredTags || [];
      const requiredKeywords = levelInfo.requiredKeywords || [];
      const selfClosingTags = ["img", "input", "br", "hr", "meta", "link"];

      const tagChecks = requiredTags.map((tag) => {
        const tagName = String(tag).toLowerCase();
        const hasOpeningTag =
          code.includes(`<${tagName}`) || code.includes(`<${tagName}>`);

        const needsClosingTag = !selfClosingTags.includes(tagName);
        const hasClosingTag = needsClosingTag
          ? code.includes(`</${tagName}>`)
          : true;

        return {
          ok: hasOpeningTag && hasClosingTag,
          label: `${tagName} tag`,
        };
      });

      const keywordChecks = requiredKeywords.map((keyword) => ({
        ok: code.includes(String(keyword).toLowerCase()),
        label: keyword,
      }));

      const checks = [...tagChecks, ...keywordChecks];

      const missing = checks
        .filter((item) => !item.ok)
        .map((item) => item.label);

      if (missing.length > 0) {
        return {
          ok: false,
          missing,
          message: `Code is not complete. Missing: ${missing.join(", ")}.`,
        };
      }

      return {
        ok: true,
        missing: [],
        message: `Great! Level ${level} completed.`,
      };
    },
    [getLevel]
  );

  const completeLevel = useCallback(
    (levelNumber, submittedCode, earnedStars = 3) => {
      const level = safeLevelNumber(levelNumber);
      const validation = validateCode(level, submittedCode);

      if (!validation.ok) {
        setGameMessage(validation.message);
        return validation;
      }

      let result = {
        ok: true,
        message: validation.message,
        rewardCoins: 0,
      };

      setGameState((prev) => {
        const alreadyCompleted = prev.completedLevels.includes(level);
        const nextCompletedLevels = alreadyCompleted
          ? prev.completedLevels
          : [...prev.completedLevels, level].sort((a, b) => a - b);

        const rewardCoins = alreadyCompleted
          ? 0
          : LEVELS[level - 1].rewardCoins;

        const oldStars = prev.completedStars[level] || 0;
        const nextStars = clampNumber(Number(earnedStars) || 3, 1, 3);

        result = {
          ok: true,
          message: alreadyCompleted
            ? `Level ${level} already completed.`
            : `Great! Level ${level} completed. +${rewardCoins} coins.`,
          rewardCoins,
        };

        const nextState = {
          ...prev,
          coins: prev.coins + rewardCoins,
          completedLevels: nextCompletedLevels,
          completedStars: {
            ...prev.completedStars,
            [level]: Math.max(oldStars, nextStars),
          },
          levelCodes: {
            ...prev.levelCodes,
            [level]: String(submittedCode || ""),
          },
          levelSeconds: {
            ...prev.levelSeconds,
            [level]: prev.levelSeconds[level] ?? LEVELS[level - 1].seconds,
          },
          lastMessage: result.message,
        };

        return {
          ...nextState,
          currentLevel: getUnlockedLevelFromState(nextState),
        };
      });

      if (result.ok) {
        const secondsLeft =
          gameState.levelSeconds[level] ?? LEVELS[level - 1].seconds;
        const nextStars = clampNumber(Number(earnedStars) || 3, 1, 3);

        runBackendMutation(
          () =>
            levelService.complete(level, {
              submittedCode: String(submittedCode || ""),
              secondsLeft,
              starsEarned: nextStars,
              coinsEarned: result.rewardCoins,
            }),
          { refresh: true }
        );
      }

      return result;
    },
    [gameState.levelSeconds, runBackendMutation, setGameMessage, validateCode]
  );

  const getGiftOptions = useCallback((levelNumber) => {
    const level = safeLevelNumber(levelNumber);
    const shift = (level - 1) % BASE_GIFT_OPTIONS.length;

    return BASE_GIFT_OPTIONS.map((_, index) => {
      const gift =
        BASE_GIFT_OPTIONS[(index + shift) % BASE_GIFT_OPTIONS.length];

      return {
        ...gift,
        id: `level-${level}-gift-${index + 1}-${gift.type}`,
        slot: index + 1,
      };
    });
  }, []);

  const getOpenedGift = useCallback(
    (levelNumber) => {
      const level = safeLevelNumber(levelNumber);
      return gameState.openedGifts[level] || null;
    },
    [gameState.openedGifts]
  );

  const openGift = useCallback(
    (levelNumber, giftId) => {
      const level = safeLevelNumber(levelNumber);
      const giftOptions = getGiftOptions(level);
      const selectedGift = giftOptions.find((gift) => gift.id === giftId);

      if (!selectedGift) {
        return {
          ok: false,
          message: "Gift not found.",
          gift: null,
        };
      }

      let result = {
        ok: true,
        message: "",
        gift: selectedGift,
      };

      setGameState((prev) => {
        const alreadyOpened = prev.openedGifts[level];

        if (alreadyOpened) {
          result = {
            ok: false,
            message: "Gift already opened for this level.",
            gift: alreadyOpened,
          };

          return {
            ...prev,
            lastMessage: result.message,
          };
        }

        const message =
          selectedGift.reward > 0
            ? `You got ${selectedGift.reward} coins!`
            : "This gift is empty.";

        result = {
          ok: true,
          message,
          gift: selectedGift,
        };

        return {
          ...prev,
          coins: prev.coins + selectedGift.reward,
          openedGifts: {
            ...prev.openedGifts,
            [level]: selectedGift,
          },
          lastMessage: message,
        };
      });

      if (result.ok) {
        runBackendMutation(() => giftService.openGift(level, giftId), {
          refresh: true,
        });
      }

      return result;
    },
    [getGiftOptions, runBackendMutation]
  );

  const claimWhatsAppReward = useCallback(() => {
    let result = {
      ok: false,
      message: "",
      rewardCoins: 0,
    };

    setGameState((prev) => {
      if (prev.shareRewardClaimed) {
        result = {
          ok: false,
          message: "WhatsApp reward already claimed.",
          rewardCoins: 0,
        };

        return {
          ...prev,
          lastMessage: result.message,
        };
      }

      result = {
        ok: true,
        message: `WhatsApp shared! +${GAME_LIMITS.WHATSAPP_REWARD_COINS} coins.`,
        rewardCoins: GAME_LIMITS.WHATSAPP_REWARD_COINS,
      };

      return {
        ...prev,
        coins: prev.coins + GAME_LIMITS.WHATSAPP_REWARD_COINS,
        shareRewardClaimed: true,
        lastMessage: result.message,
      };
    });

    if (result.ok) {
      runBackendMutation(() => rewardService.claimWhatsAppReward(), {
        refresh: true,
      });
    }

    return result;
  }, [runBackendMutation]);

  const buildLiveResultHtml = useCallback((levelNumber, submittedCode) => {
    const code = String(submittedCode || "").trim();

    if (!code) {
      return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body>
    <h3>No code typed yet</h3>
  </body>
</html>`;
    }

    const hasHtmlTag = /<html[\s>]/i.test(code);
    const hasBodyTag = /<body[\s>]/i.test(code);
    const hasStyleTag = /<style[\s\S]*?>[\s\S]*?<\/style>/i.test(code);
    const hasScriptTag = /<script[\s\S]*?>[\s\S]*?<\/script>/i.test(code);

    if (hasHtmlTag || hasBodyTag || hasStyleTag || hasScriptTag) {
      return code;
    }

    return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body>
    ${code}
  </body>
</html>`;
  }, []);

  const toggleSound = useCallback(() => {
    setGameState((prev) => {
      const nextSoundEnabled = !prev.soundEnabled;

      runBackendMutation(
        () =>
          gameService.updateProgress({
            soundEnabled: nextSoundEnabled,
          }),
        { refresh: false, messageOnError: false }
      );

      return {
        ...prev,
        soundEnabled: nextSoundEnabled,
      };
    });
  }, [runBackendMutation]);

  const resetGame = useCallback(() => {
    setGameState(getInitialState());

    runBackendMutation(() => gameService.resetGame(), {
      refresh: true,
    });
  }, [runBackendMutation]);

  const saveMiniGameScore = useCallback(
    (payload) => {
      runBackendMutation(() => miniGameService.saveScore(payload), {
        refresh: false,
        messageOnError: false,
      });
    },
    [runBackendMutation]
  );

  const value = useMemo(
    () => ({
      gameState,

      TOTAL_LEVELS,
      GAME_LIMITS,

      levels: LEVELS,
      coins: gameState.coins,
      stars: gameState.stars,
      currentLevel,
      completedLevels: gameState.completedLevels,
      completedStars: gameState.completedStars,
      completedCount,
      totalLevels: TOTAL_LEVELS,
      progressText: `${completedCount} / ${TOTAL_LEVELS}`,
      shareRewardClaimed: gameState.shareRewardClaimed,
      soundEnabled: gameState.soundEnabled,
      lastMessage: gameState.lastMessage,
      loadingProgress,
      syncing,

      refreshGameProgress,
      saveMiniGameScore,

      getLevel,
      startLevel,
      resetLevel,

      getLevelCode,
      setLevelCode,

      getLevelSeconds,
      setLevelSeconds,
      tickLevelTimer,

      isLevelCompleted,
      isLevelLocked,
      getLevelStatus,

      buyHint,
      addExtraTime,
      autoFixLevel,

      validateCode,
      completeLevel,

      getGiftOptions,
      getOpenedGift,
      openGift,

      claimWhatsAppReward,
      buildLiveResultHtml,

      toggleSound,
      setGameMessage,
      resetGame,
    }),
    [
      gameState,
      currentLevel,
      completedCount,
      loadingProgress,
      syncing,
      refreshGameProgress,
      saveMiniGameScore,
      getLevel,
      startLevel,
      resetLevel,
      getLevelCode,
      setLevelCode,
      getLevelSeconds,
      setLevelSeconds,
      tickLevelTimer,
      isLevelCompleted,
      isLevelLocked,
      getLevelStatus,
      buyHint,
      addExtraTime,
      autoFixLevel,
      validateCode,
      completeLevel,
      getGiftOptions,
      getOpenedGift,
      openGift,
      claimWhatsAppReward,
      buildLiveResultHtml,
      toggleSound,
      setGameMessage,
      resetGame,
    ]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error("useGame must be used inside GameProvider");
  }

  return context;
}
