import { Avatar } from "@/components/ui/Avatar";
import { useTheme } from "@/theme/ThemeProvider";
import { useRouter } from "expo-router";
import { ChevronLeft, Info, Shield } from "lucide-react-native";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
  const [showAvatar, setShowAvatar] = useState(false);

  const handleOpenGroupInfo = () => {
    const id = groupId ?? chatRoomId;

    console.log("Opening Group Info with ID:", id);

    if (!id) return;

    router.push({
      pathname: "/(groups)/group-info",
      params: { groupId: id },
    });
  };

  return (
    <>
      <View
        style={[
          styles.header,
          {
            borderBottomColor: colors.border,
            backgroundColor: colors.surface,
          },
        ]}
      >
        {/* Back */}
        <TouchableOpacity
          onPress={onBack}
          style={styles.sideButton}
          activeOpacity={0.7}
        >
          <ChevronLeft color={colors.textPrimary} size={26} />
        </TouchableOpacity>

        {/* Center (Avatar + Name) */}
        <TouchableOpacity
          style={styles.centerArea}
          onPress={handleOpenGroupInfo}
          activeOpacity={0.8}
        >
          <TouchableOpacity
            onPress={() => {
              console.log("Avatar Pressed");
              setShowAvatar(true);
            }}
            activeOpacity={0.8}
          >
            <Avatar uri={avatarUri} size={42} />
          </TouchableOpacity>

          <View style={styles.headerInfo}>
            <Text
              style={[styles.headerName, { color: colors.textPrimary }]}
              numberOfLines={1}
            >
              {name}
            </Text>

            <View style={styles.encryptionBadge}>
              <Shield size={10} color={colors.accent} />
              <Text
                style={[
                  styles.encryptionText,
                  { color: colors.accent },
                ]}
              >
                {" "}End-to-end Encrypted
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Info */}
        <TouchableOpacity
          style={styles.sideButton}
          onPress={handleOpenGroupInfo}
          activeOpacity={0.7}
        >
          <Info color={colors.textPrimary} size={22} />
        </TouchableOpacity>
      </View>

      {/* WhatsApp-Style Avatar Preview */}
      <Modal visible={showAvatar} transparent animationType="fade">
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setShowAvatar(false)}
        >
          <Avatar uri={avatarUri} size={240} />
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },

  sideButton: {
    padding: 8,
  },

  centerArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
  },

  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },

  headerName: {
    fontSize: 16,
    fontWeight: "700",
  },

  encryptionBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },

  encryptionText: {
    fontSize: 10,
    fontWeight: "600",
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.92)",
    justifyContent: "center",
    alignItems: "center",
  },
});