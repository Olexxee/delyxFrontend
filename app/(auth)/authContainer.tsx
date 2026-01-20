import { UserContext } from "@/authContext/UserContext";
import { AppButton } from "@/components/ui/AppButton";
import { AppInput } from "@/components/ui/AppInput";
import { Colors } from "@/theme/color";
import { Shapes } from "@/theme/shapes";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useContext, useEffect, useRef, useState } from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Map shapes to emoji for demonstration
const ShapeIcons: Record<string, string> = {
  circle: "⚪",
  square: "⬛",
  triangle: "🔺",
  x: "❌",
};

export function AuthContainer() {
  const { setUser } = useContext(UserContext);

  const [screen, setScreen] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');

  const animValue = useRef(new Animated.Value(0)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  // Floating shapes
  const floatingShapes = useRef(
    Array.from({ length: 6 }).map(() => ({
      x: Math.random() * SCREEN_WIDTH,
      y: new Animated.Value(Math.random() * SCREEN_HEIGHT),
      scale: new Animated.Value(0.5 + Math.random() * 0.5),
      opacity: new Animated.Value(0.2 + Math.random() * 0.5),
      rotate: new Animated.Value(Math.random()),
      shape:
        Object.values(Shapes)[
          Math.floor(Math.random() * Object.values(Shapes).length)
        ],
    })),
  ).current;

  // Animate floating shapes
  useEffect(() => {
    floatingShapes.forEach((shape) => {
      const animate = () => {
        Animated.parallel([
          Animated.timing(shape.y, {
            toValue: Math.random() * (SCREEN_HEIGHT - 100),
            duration: 4000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
          Animated.timing(shape.rotate, {
            toValue: Math.random(),
            duration: 6000 + Math.random() * 4000,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(shape.scale, {
              toValue: 0.8 + Math.random() * 0.3,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(shape.scale, {
              toValue: 0.5 + Math.random() * 0.5,
              duration: 2000,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(shape.opacity, {
            toValue: 0.1 + Math.random() * 0.5,
            duration: 4000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
        ]).start(() => animate());
      };
      animate();
    });
  }, []);

  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ).start();
    } else {
      spinAnim.stopAnimation();
      spinAnim.setValue(0);
    }
  }, [loading]);

  const switchScreen = () => {
    const nextScreen = screen === "login" ? "register" : "login";
    setScreen(nextScreen);
    Animated.timing(animValue, {
      toValue: nextScreen === "login" ? 0 : 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const handleLogin = async () => {
  if (!email || !password) {
    setError('Email and password are required');
    return;
  }

  setLoading(true);
  setError('');

  try {
    const { loginUser } = await import('@/');
    const user = await loginUser({ email, password });
    setUser(user);
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


 const handleRegister = async () => {
  if (!name || !email || !password) {
    setError('Name, email, and password are required');
    return;
  }

  setLoading(true);
  setError('');

  try {
    const { registerUser } = await import('@/api/apiService');
    const user = await registerUser({ name, email, password });
    setUser(user);
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  const opacityLogin = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });
  const opacityRegister = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  const translateLogin = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -SCREEN_WIDTH],
  });
  const translateRegister = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_WIDTH, 0],
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <LinearGradient
          colors={[Colors.textPrimary, Colors.surface]}
          style={styles.gradient}
        >
          {/* Floating shapes */}
          {floatingShapes.map((shape, i) => (
            <Animated.Text
              key={i}
              style={{
                position: "absolute",
                fontSize: 48,
                color: Colors.primary + "55",
                opacity: shape.opacity,
                transform: [
                  { translateX: shape.x },
                  { translateY: shape.y },
                  {
                    rotate: shape.rotate.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "360deg"],
                    }),
                  },
                  { scale: shape.scale },
                ],
              }}
            >
              {ShapeIcons[shape.shape]}
            </Animated.Text>
          ))}

          {/* Navbar */}
          <View style={styles.navbar}>
            <Text style={styles.appName}>
              Delyx <Text style={styles.appIcon}>✦</Text>
            </Text>
          </View>

          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.screenContainer}>
              {/* LOGIN */}
              <Animated.View
                style={[
                  styles.animatedScreen,
                  {
                    opacity: opacityLogin,
                    transform: [{ translateX: translateLogin }],
                  },
                ]}
                pointerEvents={screen === "login" ? "auto" : "none"}
              >
                <BlurView
                  intensity={25}
                  tint="dark"
                  style={styles.glassContainer}
                >
                  <View style={styles.innerContainer}>
                    <Text style={[styles.title, { color: Colors.textPrimary }]}>
                      Welcome Back
                    </Text>
                    <Text
                      style={[styles.subtitle, { color: Colors.textSecondary }]}
                    >
                      Sign in to your account
                    </Text>

                    {/* Display error if exists */}
{error ? (
  <Text style={{ color: 'red', marginBottom: 16, textAlign: 'center' }}>
    {error}
  </Text>
) : null}

                    <AppInput
                      placeholder="Email Address"
                      value={email}
                      onChangeText={setEmail}
                      icon="mail"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      style={{ marginBottom: 16 }}
                    />
                    <AppInput
                      placeholder="Password"
                      value={password}
                      onChangeText={setPassword}
                      icon="lock"
                      secureTextEntry
                      style={{ marginBottom: 16 }}
                    />

                    <AppButton
                      label="Sign In"
                      onPress={handleLogin}
                      loading={loading}
                      variant="primary"
                    />

                    <TouchableOpacity
                      onPress={switchScreen}
                      style={{ marginTop: 20 }}
                    >
                      <Text
                        style={{
                          color: Colors.textSecondary,
                          textAlign: "center",
                        }}
                      >
                        Don't have an account?{" "}
                        <Text
                          style={{ color: Colors.accent, fontWeight: "700" }}
                        >
                          Register
                        </Text>
                      </Text>
                    </TouchableOpacity>
                  </View>
                </BlurView>
              </Animated.View>

              {/* REGISTER */}
              <Animated.View
                style={[
                  styles.animatedScreen,
                  {
                    opacity: opacityRegister,
                    transform: [{ translateX: translateRegister }],
                  },
                ]}
                pointerEvents={screen === "register" ? "auto" : "none"}
              >
                <BlurView
                  intensity={25}
                  tint="dark"
                  style={styles.glassContainer}
                >
                  <View style={styles.innerContainer}>
                    <Text style={[styles.title, { color: Colors.textPrimary }]}>
                      Create Account
                    </Text>
                    <Text
                      style={[styles.subtitle, { color: Colors.textSecondary }]}
                    >
                      Join Delyx today
                    </Text>

                    {/* Display error if exists */}
{error ? (
  <Text style={{ color: 'red', marginBottom: 16, textAlign: 'center' }}>
    {error}
  </Text>
) : null}

                    <AppInput
                      placeholder="Username"
                      value={name}
                      onChangeText={setName}
                      icon="user"
                      style={{ marginBottom: 16 }}
                    />
                    <AppInput
                      placeholder="Email Address"
                      value={email}
                      onChangeText={setEmail}
                      icon="mail"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      style={{ marginBottom: 16 }}
                    />
                    <AppInput
                      placeholder="Password"
                      value={password}
                      onChangeText={setPassword}
                      icon="lock"
                      secureTextEntry
                      style={{ marginBottom: 16 }}
                    />

                    <AppButton
                      label="Register"
                      onPress={handleRegister}
                      loading={loading}
                      variant="primary"
                    />

                    <TouchableOpacity
                      onPress={switchScreen}
                      style={{ marginTop: 20 }}
                    >
                      <Text
                        style={{
                          color: Colors.textSecondary,
                          textAlign: "center",
                        }}
                      >
                        Already have an account?{" "}
                        <Text
                          style={{ color: Colors.accent, fontWeight: "700" }}
                        >
                          Login
                        </Text>
                      </Text>
                    </TouchableOpacity>
                  </View>
                </BlurView>
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
  navbar: {
    width: "100%",
    paddingVertical: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    marginTop: 0,
  },
  appName: { fontSize: 32, fontWeight: "900", color: Colors.primary },
  appIcon: { fontSize: 28, color: Colors.accent },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  screenContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  animatedScreen: { position: "absolute", width: "100%", alignItems: "center" },
  glassContainer: {
    width: "90%",
    maxWidth: 420,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: Colors.surfaceLight + "CC",
    borderWidth: 1,
    borderColor: Colors.borderLight,
    minHeight: SCREEN_HEIGHT * 0.75,
    maxHeight: SCREEN_HEIGHT * 0.9,
    justifyContent: "center",
    paddingVertical: 20,
  },
  innerContainer: { padding: 24, justifyContent: "center", flexGrow: 1 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 8 },
  subtitle: { fontSize: 16, marginBottom: 24 },
});

