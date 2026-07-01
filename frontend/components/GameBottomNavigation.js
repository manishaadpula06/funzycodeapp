





// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Dimensions,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";

// const { width } = Dimensions.get("window");

// const COLORS = {
//   cyan: "#00D9FF",
//   white: "#FFFFFF",
//   muted: "rgba(255,255,255,0.62)",
//   bg: "rgba(1, 10, 30, 0.94)",
//   border: "rgba(0,217,255,0.38)",
// };

// export default function GameBottomNavigation({ navigation, activeTab = "Home" }) {
//   const tabs = [
//     { key: "Home",     label: "Home",     icon: "home",            route: "GameSelection" },
//     { key: "Games",    label: "Games",    icon: "game-controller", route: "Games"         },
//     { key: "Progress", label: "Progress", icon: "trophy",          route: "Progress"      },
//     { key: "Badges",   label: "Badges",   icon: "ribbon",          route: "Badges"        },
//     { key: "Settings", label: "Settings", icon: "settings",        route: "Settings"      },
//   ];

//   const goToScreen = (route) => {
//     const routeNames = navigation?.getState?.()?.routeNames || [];
//     if (routeNames.includes(route)) {
//       navigation.navigate(route);
//     }
//   };

//   return (
//     <View style={styles.wrapper}>
//       {tabs.map((tab) => {
//         const active = activeTab === tab.key;
//         return (
//           <TouchableOpacity
//             key={tab.key}
//             activeOpacity={0.85}
//             onPress={() => goToScreen(tab.route)}
//             style={[styles.tab, active && styles.activeTab]}
//           >
//             <Ionicons
//               name={tab.icon}
//               size={active ? 21 : 18}
//               color={active ? COLORS.cyan : COLORS.muted}
//             />
//             <Text style={[styles.label, active && styles.activeLabel]}>
//               {tab.label}
//             </Text>
//           </TouchableOpacity>
//         );
//       })}
//     </View>
//   );
// }

// const TAB_WIDTH = (width - 28 - 10) / 5; // (screen - margins - padding) / tabs

// const styles = StyleSheet.create({
//   // ✅ Fixed height, no margin — parent controls positioning
//   wrapper: {
//     height: 58,
//     marginHorizontal: 14,
//     borderRadius: 22,
//     backgroundColor: COLORS.bg,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 5,
//     shadowColor: COLORS.cyan,
//     shadowOpacity: 0.22,
//     shadowRadius: 12,
//     shadowOffset: { width: 0, height: 0 },
//     elevation: 12,
//   },

//   tab: {
//     width: TAB_WIDTH,
//     height: 48,
//     borderRadius: 18,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   activeTab: {
//     backgroundColor: "rgba(0,217,255,0.12)",
//     borderWidth: 1,
//     borderColor: "rgba(0,217,255,0.65)",
//   },

//   label: {
//     marginTop: 2,
//     fontSize: 8.5,
//     fontWeight: "800",
//     color: COLORS.muted,
//   },

//   activeLabel: {
//     color: COLORS.cyan,
//   },
// });

























import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const COLORS = {
  cyan: "#00D9FF",
  white: "#FFFFFF",
  muted: "rgba(255,255,255,0.62)",
  bg: "rgba(1, 10, 30, 0.94)",
  border: "rgba(0,217,255,0.38)",
};

const TABS = [
  {
    key: "Home",
    label: "Home",
    icon: "home",
    route: "GameSelection",
  },
  {
    key: "Games",
    label: "Games",
    icon: "game-controller",
    route: "FunGames",
  },
  {
    key: "Progress",
    label: "Progress",
    icon: "trophy",
    route: "Progress",
  },
  {
    key: "Badges",
    label: "Badges",
    icon: "ribbon",
    route: "Badges",
  },
  {
    key: "Settings",
    label: "Settings",
    icon: "settings",
    route: "Settings",
  },
];

export default function GameBottomNavigation({
  navigation,
  activeTab = "Home",
}) {
  const goToScreen = (route) => {
    const routeNames = navigation?.getState?.()?.routeNames || [];

    if (routeNames.includes(route)) {
      navigation.navigate(route);
    }
  };

  return (
    <View style={styles.wrapper}>
      {TABS.map((tab) => {
        const active = activeTab === tab.key;

        return (
          <TouchableOpacity
            key={tab.key}
            activeOpacity={0.85}
            onPress={() => goToScreen(tab.route)}
            style={[styles.tab, active && styles.activeTab]}
          >
            <Ionicons
              name={tab.icon}
              size={active ? 21 : 18}
              color={active ? COLORS.cyan : COLORS.muted}
            />

            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={[styles.label, active && styles.activeLabel]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: Platform.OS === "ios" ? 16 : 10,
    height: 58,
    borderRadius: 22,
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    shadowColor: COLORS.cyan,
    shadowOpacity: 0.22,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
    zIndex: 999,
  },

  tab: {
    flex: 1,
    height: 48,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 1,
  },

  activeTab: {
    backgroundColor: "rgba(0,217,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(0,217,255,0.65)",
  },

  label: {
    marginTop: 2,
    fontSize: width < 360 ? 7.5 : 8.5,
    fontWeight: "800",
    color: COLORS.muted,
    textAlign: "center",
  },

  activeLabel: {
    color: COLORS.cyan,
  },
});