import { Avatar } from "@/components/ui/Avatar";
import { useTheme } from "@/theme/ThemeProvider";
import { ChevronLeft, Info, Shield } from "lucide-react-native";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ChatHeaderProps {
  name: string;
  avatarUri?: string;
  onBack: () => void;
  memberCount?: number;
  chatRoomId?: string;
  groupId?: string;
}

export default function ChatHeader({
  name,
  avatarUri,
  onBack,
  memberCount,
  chatRoomId,
  groupId,
}: ChatHeaderProps) {
  const { colors } = useTheme();
  const router = useRouter();

  const handleOpenGroupInfo = () => {
    if (!groupId && !chatRoomId) return;
    router.push({
      pathname: "/(groups)/group-info",
      params: {
        groupId: groupId ?? chatRoomId,
        name,
        avatar: avatarUri ?? "",
      },
    });
  };

  return (
    <View style={[styles.header, { borderBottomColor: colors.border }]}>
      <TouchableOpacity onPress={onBack} style={styles.headerBtn}>
        <ChevronLeft color={colors.textPrimary} size={28} />
      </TouchableOpacity>

      {/* Tappable center area → Group Info */}
      <TouchableOpacity
        style={styles.centerArea}
        onPress={handleOpenGroupInfo}
        activeOpacity={0.7}
      >
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
      </TouchableOpacity>

      <TouchableOpacity style={styles.headerBtn} onPress={handleOpenGroupInfo}>
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
  centerArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 4,
  },
  headerInfo: { flex: 1, marginLeft: 10 },
  headerName: { fontSize: 16, fontWeight: "700" },
  encryptionBadge: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  encryptionText: { fontSize: 10, fontWeight: "600" },
});