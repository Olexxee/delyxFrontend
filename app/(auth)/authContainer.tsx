import { UserContext } from "@/authContext/UserContext";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuth } from "@/components/auth/useAuth";
import { FloatingShapes } from "@/components/ui/FloatingShapes";
import { useTheme } from "@/theme/ThemeProvider";
import { LinearGradient } from "expo-linear-gradient";
import { useContext, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function AuthContainer() {
  const { colors } = useTheme();
  const { setUser } = useContext(UserContext);
  const insets = useSafeAreaInsets();
  const [screen, setScreen] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const animValue = useRef(new Animated.Value(0)).current;
  const { loading, error, login, register } = useAuth();

  const switchScreen = () => {
    Keyboard.dismiss();
    const nextScreen = screen === "login" ? "register" : "login";
    setScreen(nextScreen);
    Animated.timing(animValue, {
      toValue: nextScreen === "login" ? 0 : 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const opacityLogin = animValue.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });
  const opacityRegister = animValue.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
  const translateLogin = animValue.interpolate({ inputRange: [0, 1], outputRange: [0, -SCREEN_WIDTH] });
  const translateRegister = animValue.interpolate({ inputRange: [0, 1], outputRange: [SCREEN_WIDTH, 0] });

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={["top", "bottom"]}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? insets.top : 0}
      >
        <LinearGradient colors={[colors.textPrimary, colors.surface]} style={styles.gradient}>
          <FloatingShapes />
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
            automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
            contentInsetAdjustmentBehavior="automatic"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.screenContainer}>
              <Animated.View
                style={[styles.animatedScreen, { opacity: opacityLogin, transform: [{ translateX: translateLogin }] }]}
                pointerEvents={screen === "login" ? "auto" : "none"}
              >
                <AuthForm
                  type="login"
                  loading={loading}
                  error={error}
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  onSubmit={() => login(email, password, setUser)}
                  switchScreen={switchScreen}
                />
              </Animated.View>
              <Animated.View
                style={[styles.animatedScreen, { opacity: opacityRegister, transform: [{ translateX: translateRegister }] }]}
                pointerEvents={screen === "register" ? "auto" : "none"}
              >
                <AuthForm
                  type="register"
                  loading={loading}
                  error={error}
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  username={username}
                  setUsername={setUsername}
                  onSubmit={() => register(username, email, password, setUser)}
                  switchScreen={switchScreen}
                />
              </Animated.View>
            </View>
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  gradient: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 32,
  },
  screenContainer: {
    width: "100%",
    minHeight: 420,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  animatedScreen: { width: "100%", alignItems: "center" },
});
