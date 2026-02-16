import { useTheme } from "@/theme/ThemeProvider";
import * as ImagePicker from "expo-image-picker";
import { Camera, Triangle, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const PRIVACY_OPTIONS = ["public", "private", "protected"];

// Define the payload type to match apiService exactly
type CreateGroupPayload =
  | FormData
  | { name: string; privacy: string; avatar: string | null };

interface CreateGroupModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (payload: CreateGroupPayload) => void;
  isSubmitting: boolean;
}

export default function CreateGroupModal({
  visible,
  onClose,
  onConfirm,
  isSubmitting,
}: CreateGroupModalProps) {
  const { colors } = useTheme();
  const [name, setName] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [privacy, setPrivacy] = useState("public");

  // --------------------
  // Pick Image
  // --------------------
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      return Alert.alert("Permission Denied", "Permission needed to access gallery");
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setImage(result.assets[0].uri);
    }
  };

  // --------------------
  // Handle Create
  // --------------------
  const handleCreate = () => {
    if (!name.trim()) return Alert.alert("Required", "Enter a group name");

    let payload: CreateGroupPayload;

    if (image) {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("privacy", privacy);

      const filename = image.split("/").pop()?.split("?")[0] || "avatar.jpg";
      const fileType = filename.split(".").pop() || "jpg";

      // Append image data
      formData.append("avatar", {
        uri: image,
        name: filename,
        type: `image/${fileType}`,
      } as any);

      payload = formData;
    } else {
      // Matches the signature: { name, privacy, avatar: null }
      payload = {
        name: name.trim(),
        privacy,
        avatar: null
      };
    }

    onConfirm(payload);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.surface }]}>
          <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
            NEW GROUP
          </Text>

          <TouchableOpacity
            style={[
              styles.avatarCircle,
              { backgroundColor: colors.surfaceLight, borderColor: colors.border }
            ]}
            onPress={pickImage}
          >
            {image ? (
              <Image source={{ uri: image }} style={styles.fullImage} />
            ) : (
              <Camera size={40} color={colors.accent} />
            )}
          </TouchableOpacity>

          <TextInput
            style={[
              styles.input,
              { borderBottomColor: colors.accent, color: colors.textPrimary }
            ]}
            placeholder="Group name..."
            placeholderTextColor={colors.textSecondary}
            value={name}
            onChangeText={setName}
          />

          <View style={styles.privacyContainer}>
            {PRIVACY_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt}
                onPress={() => setPrivacy(opt)}
                style={[
                  styles.privacyTab,
                  privacy === opt && { backgroundColor: colors.accent, borderColor: colors.accent },
                ]}
              >
                <Text style={{ color: privacy === opt ? "#fff" : colors.textSecondary }}>
                  {opt.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.shapeButton, { borderColor: colors.gold }]}
              disabled={isSubmitting}
            >
              <X size={28} color={colors.error} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleCreate}
              style={[styles.shapeButton, { borderColor: colors.accent }]}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color={colors.accent} />
              ) : (
                <Triangle size={28} fill={colors.accent} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.85)", justifyContent: "center" },
  container: { margin: 20, borderRadius: 32, padding: 24, alignItems: "center" },
  modalTitle: { fontSize: 20, fontWeight: "900", marginBottom: 25 },
  avatarCircle: { width: 130, height: 130, borderRadius: 65, overflow: "hidden", justifyContent: "center", alignItems: "center", borderWidth: 2, borderStyle: "dashed", marginBottom: 25 },
  fullImage: { width: "100%", height: "100%" },
  input: { width: "100%", borderBottomWidth: 2, paddingVertical: 12, fontSize: 18, marginBottom: 25, textAlign: "center" },
  privacyContainer: { flexDirection: "row", marginBottom: 35, borderRadius: 12, overflow: "hidden", borderWidth: 1, borderColor: "#333" },
  privacyTab: { paddingVertical: 8, paddingHorizontal: 12, alignItems: "center", minWidth: 80 },
  buttonRow: { flexDirection: "row", width: "100%", justifyContent: "space-evenly" },
  shapeButton: { width: 64, height: 64, borderRadius: 20, borderWidth: 3, justifyContent: "center", alignItems: "center" },
});