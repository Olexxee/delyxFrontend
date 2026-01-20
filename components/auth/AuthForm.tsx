import { AppButton } from "@/components/ui/AppButton";
import { AppInput } from "@/components/ui/AppInput";
import { BlurView } from "expo-blur";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Field } from "./authFormTypes";

interface AuthFormProps {
  title: string;
  subtitle: string;
  fields: Field[];
  submitLabel: string;
  loading: boolean;
  onSubmit: () => void;
  footerLabel: string;
  onFooterPress: () => void;
  showRememberMe?: boolean;
}

export function AuthForm({
  title,
  subtitle,
  fields,
  submitLabel,
  loading,
  onSubmit,
  footerLabel,
  onFooterPress,
  showRememberMe = false,
}: AuthFormProps) {
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <BlurView intensity={20} tint="light" style={styles.glassContainer}>
      <View style={styles.innerContainer}>
        {/* Title Section */}
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          {fields.map((field) => (
            <AppInput
              key={field.key}
              placeholder={field.placeholder}
              value={field.value}
              onChangeText={field.onChangeText}
              secureTextEntry={field.secureTextEntry}
              keyboardType={field.keyboardType}
              autoCapitalize={field.autoCapitalize}
              icon={field.icon}
              style={styles.input}
            />
          ))}

          {/* Remember Me & Forgot Password */}
          {showRememberMe && (
            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={styles.rememberContainer}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View
                  style={[styles.checkbox, rememberMe && styles.checkboxActive]}
                >
                  {rememberMe && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.rememberText}>Remember me</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Submit Button */}
          <AppButton
            label={submitLabel}
            onPress={onSubmit}
            loading={loading}
            style={styles.button}
            variant="primary"
          />

          {/* Footer Text */}
          <TouchableOpacity onPress={onFooterPress} style={styles.footer}>
            <Text style={styles.footerText}>{footerLabel}</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Login Buttons */}
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialIcon}>G</Text>
              <Text style={styles.socialText}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialIcon}>⚙</Text>
              <Text style={styles.socialText}>GitHub</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  innerContainer: {
    padding: 32,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
  form: {
    width: "100%",
  },
  input: {
    marginBottom: 16,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.5)",
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActive: {
    backgroundColor: "#ffffff",
    borderColor: "#ffffff",
  },
  checkmark: {
    color: "#6366f1",
    fontSize: 14,
    fontWeight: "700",
  },
  rememberText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
  },
  forgotText: {
    color: "#06b6d4",
    fontSize: 14,
    fontWeight: "600",
  },
  button: {
    marginBottom: 16,
  },
  footer: {
    alignItems: "center",
    marginBottom: 24,
  },
  footerText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  dividerText: {
    color: "rgba(255, 255, 255, 0.7)",
    paddingHorizontal: 12,
    fontSize: 14,
  },
  socialRow: {
    flexDirection: "row",
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
  },
  socialIcon: {
    fontSize: 20,
    color: "#ffffff",
  },
  socialText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
});
