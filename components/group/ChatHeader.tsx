import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ChevronLeft, Shield, Info } from "lucide-react-native";
import { useTheme } from "@/theme/ThemeProvider";
import { Avatar } from "@/components/ui/Avatar";

interface ChatHeaderProps {
  name: string;
  avatarUri?: string;
  onBack: () => void;
}

export default function ChatHeader({
  name,
  avatarUri,
  onBack,
}: ChatHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.header, { borderBottomColor: colors.border }]}>
      <TouchableOpacity onPress={onBack} style={styles.headerBtn}>
        <ChevronLeft color={colors.textPrimary} size={28} />
      </TouchableOpacity>

      <Avatar uri={avatarUri} size={40} />

      <View style={styles.headerInfo}>
        <Text
          style={[styles.headerName, { color: colors.textPrimary }]}
          numberOfLines={1}
        >
          {name}
        </Text>

        <View style={styles.encryptionBadge}>
          <Shield size={10} color={colors.accent} />
          <Text style={[styles.encryptionText, { color: colors.accent }]}>
            {" "}End-to-end Encrypted
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.headerBtn}>
        <Info color={colors.textPrimary} size={22} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerBtn: { padding: 5 },
  headerInfo: { flex: 1, marginLeft: 10 },
  headerName: { fontSize: 16, fontWeight: "700" },
  encryptionBadge: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  encryptionText: { fontSize: 10, fontWeight: "600" },
});
