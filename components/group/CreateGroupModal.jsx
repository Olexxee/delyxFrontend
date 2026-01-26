import React, { useState } from "react";
import { Modal, View, TextInput, TouchableOpacity, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Camera, Triangle, X } from "lucide-react-native"; 
import { Shapes } from "../../theme/shapes";
import { useTheme } from "@/theme/ThemeProvider";

const PRIVACY_OPTIONS = ["public", "private", "protected"];

export default function CreateGroupModal({ visible, onClose, onConfirm, isSubmitting }) {
  const { colors } = useTheme();
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [privacy, setPrivacy] = useState("public");

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return alert('Permission needed to access gallery');

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleCreate = () => {
    if (!name.trim()) return alert("Please enter a group name");
    if (!image) return alert("Please upload a group avatar");
    
    // Pass the data back to the mutation
    onConfirm({ name, image, privacy });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent transparentStatusBar>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.surface }]}>
          
          <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>NEW GROUP</Text>

          {/* WhatsApp Style Avatar Picker */}
          <TouchableOpacity 
            onPress={pickImage} 
            style={[styles.avatarCircle, { backgroundColor: colors.surfaceLight, borderColor: colors.border }]}
          >
            {image ? (
              <Image source={{ uri: image }} style={styles.fullImage} />
            ) : (
              <View style={styles.placeholderContent}>
                <Camera size={40} color={colors.accent} />
                <Text style={[styles.addText, { color: colors.accent }]}>ADD PHOTO</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* WhatsApp Style Borderless Input */}
          <TextInput
            style={[styles.input, { borderBottomColor: colors.accent, color: colors.textPrimary }]}
            placeholder="Group name..."
            placeholderTextColor={colors.textSecondary}
            value={name}
            onChangeText={setName}
            maxLength={25}
          />

          {/* Privacy Selector - Essential for your backend validator */}
          <View style={styles.privacyContainer}>
            {PRIVACY_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt}
                onPress={() => setPrivacy(opt)}
                style={[
                  styles.privacyTab,
                  privacy === opt && { backgroundColor: colors.accent, borderColor: colors.accent }
                ]}
              >
                <Text style={[styles.privacyText, { color: privacy === opt ? '#fff' : colors.textSecondary }]}>
                  {opt.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Action Buttons using Custom Shapes */}
          <View style={styles.buttonRow}>
            
            {/* Cancel Action - Shape: X */}
            <View style={styles.actionItem}>
              <TouchableOpacity 
                onPress={onClose} 
                style={[styles.shapeButton, { borderColor: colors.error }]}
                disabled={isSubmitting}
              >
                <X size={28} color={colors.error} strokeWidth={3} />
              </TouchableOpacity>
              <Text style={[styles.label, { color: colors.textSecondary }]}>CANCEL</Text>
            </View>

            {/* Create Action - Shape: Triangle */}
            <View style={styles.actionItem}>
              <TouchableOpacity 
                onPress={handleCreate} 
                style={[styles.shapeButton, { borderColor: colors.accent }]}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color={colors.accent} />
                ) : (
                  <Triangle size={28} fill={colors.accent} color={colors.accent} />
                )}
              </TouchableOpacity>
              <Text style={[styles.label, { color: colors.accent }]}>CREATE</Text>
            </View>

          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.85)", justifyContent: "center" },
  container: { margin: 20, borderRadius: 32, padding: 24, alignItems: "center" },
  modalTitle: { fontSize: 20, fontWeight: "900", marginBottom: 25, letterSpacing: 2 },
  avatarCircle: { width: 130, height: 130, borderRadius: 65, overflow: "hidden", justifyContent: "center", alignItems: "center", borderWidth: 2, borderStyle: 'dashed', marginBottom: 25 },
  fullImage: { width: "100%", height: "100%" },
  placeholderContent: { alignItems: "center" },
  addText: { fontSize: 10, fontWeight: "bold", marginTop: 8 },
  input: { width: "100%", borderBottomWidth: 2, paddingVertical: 12, fontSize: 18, marginBottom: 25, textAlign: 'center' },
  privacyContainer: { flexDirection: 'row', marginBottom: 35, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#333' },
  privacyTab: { paddingVertical: 8, paddingHorizontal: 12, alignItems: 'center', minWidth: 80 },
  privacyText: { fontSize: 10, fontWeight: '800' },
  buttonRow: { flexDirection: "row", width: "100%", justifyContent: "space-evenly" },
  actionItem: { alignItems: "center" },
  shapeButton: { width: 64, height: 64, borderRadius: 20, borderWidth: 3, justifyContent: "center", alignItems: "center", marginBottom: 8 },
  label: { fontSize: 11, fontWeight: "900" }
});