import { AppButton } from "@/components/ui/AppButton";
import { AppInput } from "@/components/ui/AppInput";
import { Colors } from "@/theme/color";
import { BlurView } from "expo-blur";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface AuthFormProps {
  type: "login" | "register";
  loading: boolean;
  error: string;
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  username?: string;
  setUsername?: (val: string) => void;
  onSubmit: () => void;
  switchScreen: () => void;
}


export function AuthForm({
  type,
  loading,
  error,
  email,
  setEmail,
  password,
  setPassword,
  username,
  setUsername,
  onSubmit,
  switchScreen,
}: AuthFormProps) {
  return (
    <BlurView intensity={25} tint="dark" style={styles.glassContainer}>
      <View style={styles.innerContainer}>
        <Text style={[styles.title, { color: Colors.textPrimary }]}>
          {type === "login" ? "Welcome Back" : "Create Account"}
        </Text>
        <Text style={[styles.subtitle, { color: Colors.textSecondary }]}>
          {type === "login"
            ? "Sign in to your account"
            : "Join Delyx today"}
        </Text>

        {error ? (
          <Text style={{ color: "red", marginBottom: 16, textAlign: "center" }}>
            {error}
          </Text>
        ) : null}

        {type === "register" && username !== undefined && setUsername && (
          <AppInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            icon="user"
            style={{ marginBottom: 16 }}
          />
        )}

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
          label={type === "login" ? "Sign In" : "Register"}
          onPress={onSubmit}
          loading={loading}
          variant="primary"
        />

        <TouchableOpacity onPress={switchScreen} style={{ marginTop: 20 }}>
          <Text style={{ color: Colors.textSecondary, textAlign: "center" }}>
            {type === "login"
              ? "Don't have an account? "
              : "Already have an account? "}
            <Text style={{ color: Colors.accent, fontWeight: "700" }}>
              {type === "login" ? "Register" : "Login"}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  glassContainer: {
    width: "90%",
    maxWidth: 420,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: Colors.surfaceLight + "CC",
    borderWidth: 1,
    borderColor: Colors.borderLight,
    minHeight: 400,
    justifyContent: "center",
    paddingVertical: 20,
  },
  innerContainer: { padding: 24, justifyContent: "center", flexGrow: 1 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 8 },
  subtitle: { fontSize: 16, marginBottom: 24 },
});
