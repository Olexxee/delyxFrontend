import React, { useState } from "react";
import { Modal, View, TextInput, TouchableOpacity, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera, Triangle, X } from "lucide-react-native";
import { useTheme } from "@/theme/ThemeProvider";

const PRIVACY_OPTIONS = ["public", "private", "protected"];

export default function CreateGroupModal({ visible, onClose, onConfirm, isSubmitting }) {
  const { colors } = useTheme();
  const [name, setName] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [privacy, setPrivacy] = useState("public");

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return alert('Permission needed to access gallery');

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]?.uri) setImage(result.assets[0].uri);
  };

  const handleCreate = () => {
    if (!name.trim()) return alert("Enter a group name");

    // If image exists, use FormData
    if (image) {
      const formData = new FormData();
      formData.append("name", name.toString());
      formData.append("privacy", privacy.toString());

      const uriParts = image.split('.');
      const fileType = uriParts[uriParts.length - 1];

      formData.append("avatar", {
        uri: image,
        name: `avatar.${fileType}`,
        type: `image/${fileType}`,
      });

      onConfirm(formData);
    } else {
      // If no image, send plain JSON
      onConfirm({
        name: name.toString(),
        privacy: privacy.toString(),
        avatar: null,
      });
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.surface }]}>
          <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>NEW GROUP</Text>

          <TouchableOpacity
            style={[styles.avatarCircle, { backgroundColor: colors.surfaceLight, borderColor: colors.border }]}
            onPress={pickImage}
          >
            {image ? <Image source={{ uri: image }} style={styles.fullImage} /> : <Camera size={40} color={colors.accent} />}
          </TouchableOpacity>

          <TextInput
            style={[styles.input, { borderBottomColor: colors.accent, color: colors.textPrimary }]}
            placeholder="Group name..."
            placeholderTextColor={colors.textSecondary}
            value={name}
            onChangeText={setName}
          />

          <View style={styles.privacyContainer}>
            {PRIVACY_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt}
                onPress={() => setPrivacy(opt)}
                style={[
                  styles.privacyTab,
                  privacy === opt && { backgroundColor: colors.accent, borderColor: colors.accent },
                ]}
              >
                <Text style={{ color: privacy === opt ? '#fff' : colors.textSecondary }}>{opt.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.shapeButton, { borderColor: colors.error }]}
              disabled={isSubmitting}
            >
              <X size={28} color={colors.error} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleCreate}
              style={[styles.shapeButton, { borderColor: colors.accent }]}
              disabled={isSubmitting}
            >
              {isSubmitting ? <ActivityIndicator color={colors.accent} /> : <Triangle size={28} fill={colors.accent} />}
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
  avatarCircle: { width: 130, height: 130, borderRadius: 65, overflow: "hidden", justifyContent: "center", alignItems: "center", borderWidth: 2, borderStyle: 'dashed', marginBottom: 25 },
  fullImage: { width: "100%", height: "100%" },
  input: { width: "100%", borderBottomWidth: 2, paddingVertical: 12, fontSize: 18, marginBottom: 25, textAlign: 'center' },
  privacyContainer: { flexDirection: 'row', marginBottom: 35, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#333' },
  privacyTab: { paddingVertical: 8, paddingHorizontal: 12, alignItems: 'center', minWidth: 80 },
  buttonRow: { flexDirection: "row", width: "100%", justifyContent: "space-evenly" },
  shapeButton: { width: 64, height: 64, borderRadius: 20, borderWidth: 3, justifyContent: "center", alignItems: "center" },
});
