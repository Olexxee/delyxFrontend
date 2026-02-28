import { UserContext } from "@/authContext/UserContext";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuth } from "@/components/auth/useAuth";
import { FloatingShapes } from "@/components/ui/FloatingShapes";
import { useTheme } from "@/theme/ThemeProvider";
import { LinearGradient } from "expo-linear-gradient";
import { useContext, useRef, useState } from "react";
import { Animated, Dimensions, KeyboardAvoidingView, ScrollView, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function AuthContainer() {
  const { colors, mode } = useTheme();
  const { setUser } = useContext(UserContext);
  const [screen, setScreen] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const animValue = useRef(new Animated.Value(0)).current;
  const { loading, error, login, register } = useAuth();

  const switchScreen = () => {
    const nextScreen = screen === "login" ? "register" : "login";
    setScreen(nextScreen);
    Animated.timing(animValue, {
      toValue: nextScreen === "login" ? 0 : 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const opacityLogin = animValue.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });
  const opacityRegister = animValue.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
  const translateLogin = animValue.interpolate({ inputRange: [0, 1], outputRange: [0, -SCREEN_WIDTH] });
  const translateRegister = animValue.interpolate({ inputRange: [0, 1], outputRange: [SCREEN_WIDTH, 0] });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <LinearGradient colors={[colors.textPrimary, colors.surface]} style={styles.gradient}>
          <FloatingShapes />

          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <View style={styles.screenContainer}>
              {/* LOGIN */}
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

              {/* REGISTER */}
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
  gradient: { flex: 1 },
  container: { flexGrow: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 16, paddingBottom: 40 },
  screenContainer: { width: "100%", alignItems: "center", justifyContent: "center", position: "relative" },
  animatedScreen: { position: "absolute", width: "100%", alignItems: "center" },
});
