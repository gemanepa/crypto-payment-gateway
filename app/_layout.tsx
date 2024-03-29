import { useEffect, useState, useRef } from "react";
import { ScrollView, StyleSheet } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "@/lib/hooks/useColorScheme";
import { deviceId } from "@/lib/constants/business";
import Text from "@/lib/components/Text/Text";
import BitnovoDisclaimer from "@/lib/components/BitnovoDisclaimer";
import AppInfoTopDisclaimer from "@/lib/components/AppInfoTopDisclaimer";
import { DynamicScreenHeightContext } from "@/lib/context/DynamicScreenHeightContext";
import isWeb from "@/lib/utils/isWeb";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Mulish: require("../assets/fonts/Mulish-Regular.ttf"),
    "Mulish-Bold": require("../assets/fonts/Mulish-Bold.ttf"),
    "Mulish-Italic": require("../assets/fonts/Mulish-Italic.ttf"),
    "Mulish-Light": require("../assets/fonts/Mulish-Light.ttf"),
    "Mulish-LightItalic": require("../assets/fonts/Mulish-LightItalic.ttf"),
    "Mulish-Medium": require("../assets/fonts/Mulish-Medium.ttf"),
    "Mulish-MediumItalic": require("../assets/fonts/Mulish-MediumItalic.ttf"),
    "Mulish-SemiBold": require("../assets/fonts/Mulish-SemiBold.ttf"),
    "Mulish-SemiBoldItalic": require("../assets/fonts/Mulish-SemiBoldItalic.ttf"),
    "Mulish-ExtraBold": require("../assets/fonts/Mulish-ExtraBold.ttf"),
    "Mulish-ExtraBoldItalic": require("../assets/fonts/Mulish-ExtraBoldItalic.ttf"),
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const [screenHeight, setScreenHeight] = useState(0);
  const colorScheme = useColorScheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollToTop = () => {
    scrollViewRef?.current?.scrollTo({ y: 0, animated: true });
  };

  useEffect(() => {
    if (screenHeight) {
      scrollToTop();
    }
  }, [screenHeight]);

  return (
    <ThemeProvider value={DefaultTheme}>
      <DynamicScreenHeightContext.Provider value={{ setScreenHeight }}>
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          contentContainerStyle={[
            styles.container,
            { height: screenHeight && !isWeb ? screenHeight : "100%" },
          ]}
        >
          {isWeb && !deviceId && (
            <Text weight="Bold" style={{ textAlign: "center" }}>
              Device ID not found. Please make sure to set EXPO_PUBLIC_DEVICE_ID
              on .env file to make server requests.
            </Text>
          )}

          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
          <AppInfoTopDisclaimer />
          <BitnovoDisclaimer />
        </ScrollView>
      </DynamicScreenHeightContext.Provider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    height: "100%",
  },
  scrollHeight: {
    height: 1350,
  },
});
