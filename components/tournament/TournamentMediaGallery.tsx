import { useTournamentMedia } from "@/hooks/useTournamentMedia";
import { useTheme } from "@/theme/ThemeProvider";
import type { TournamentMediaAsset, TournamentMediaRole } from "@/api/tournamentMediaApi";
import * as ImagePicker from "expo-image-picker";
import { ImagePlus, Images, Pencil, Trash2 } from "lucide-react-native";
import React, { useMemo } from "react";
import { ActivityIndicator, Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
  communityId: string;
  tournamentId: string;
  canManage: boolean;
}

const SLOTS: { role: TournamentMediaRole; title: string; hint: string }[] = [
  { role: "COVER", title: "Cover image", hint: "Main tournament banner" },
  { role: "PROMO", title: "Promo artwork", hint: "Promotional image" },
  { role: "GALLERY_1", title: "Gallery image 1", hint: "Optional supporting image" },
  { role: "GALLERY_2", title: "Gallery image 2", hint: "Optional supporting image" },
];

export default function TournamentMediaGallery({ communityId, tournamentId, canManage }: Props) {
  const { colors } = useTheme();
  const { data = [], isLoading, isError, uploadMutation, removeMutation } = useTournamentMedia(communityId, tournamentId);
  const mediaByRole = useMemo(
    () => new Map<TournamentMediaRole, TournamentMediaAsset>(data.map((item) => [item.role, item])),
    [data],
  );

  const pickImage = async (role: TournamentMediaRole) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Photo access needed", "Allow Delyx to access your photo library to add tournament artwork.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.84,
    });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    uploadMutation.mutate(
      { role, asset: { uri: asset.uri, fileName: asset.fileName, mimeType: asset.mimeType } },
      {
        onError: (error) => Alert.alert("Upload failed", error instanceof Error ? error.message : "Please try again."),
      },
    );
  };

  const confirmRemove = (asset: TournamentMediaAsset) => {
    Alert.alert("Remove artwork?", "This removes the image from this tournament. It does not delete the stored media asset.", [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: () => removeMutation.mutate(asset.id, {
        onError: (error) => Alert.alert("Could not remove image", error instanceof Error ? error.message : "Please try again."),
      }) },
    ]);
  };

  return (
    <View style={[styles.panel, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.headingRow}>
        <View style={[styles.headingIcon, { backgroundColor: colors.accent + "18" }]}>
          <Images size={18} color={colors.accent} />
        </View>
        <View style={styles.headingText}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Tournament artwork</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {data.length} of 4 images · cover, promo and gallery
          </Text>
        </View>
        {isLoading ? <ActivityIndicator color={colors.accent} /> : null}
      </View>

      {isError ? (
        <Text style={[styles.message, { color: colors.textSecondary }]}>Artwork could not be loaded.</Text>
      ) : null}

      <View style={styles.grid}>
        {SLOTS.map((slot) => {
          const asset = mediaByRole.get(slot.role);
          const busy = uploadMutation.isPending || removeMutation.isPending;
          return (
            <View key={slot.role} style={[styles.slot, { borderColor: colors.border, backgroundColor: colors.background }]}>
              {asset ? (
                <Image source={{ uri: asset.url }} style={styles.image} resizeMode="cover" />
              ) : (
                <View style={[styles.placeholder, { backgroundColor: colors.surfaceLight }]}>
                  <ImagePlus size={22} color={colors.textSecondary} />
                  <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>No image</Text>
                </View>
              )}
              <View style={styles.slotBody}>
                <Text style={[styles.slotTitle, { color: colors.textPrimary }]}>{slot.title}</Text>
                <Text style={[styles.slotHint, { color: colors.textSecondary }]}>{slot.hint}</Text>
                {canManage ? (
                  <View style={styles.actions}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={asset ? `Replace ${slot.title}` : `Add ${slot.title}`}
                      disabled={busy}
                      onPress={() => pickImage(slot.role)}
                      style={[styles.actionButton, { backgroundColor: colors.accent, opacity: busy ? 0.55 : 1 }]}
                    >
                      {uploadMutation.isPending ? <ActivityIndicator size="small" color={colors.background} /> : asset ? <Pencil size={14} color={colors.background} /> : <ImagePlus size={14} color={colors.background} />}
                      <Text style={[styles.actionText, { color: colors.background }]}>{asset ? "Replace" : "Add image"}</Text>
                    </Pressable>
                    {asset ? (
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Remove ${slot.title}`}
                        disabled={busy}
                        onPress={() => confirmRemove(asset)}
                        style={[styles.removeButton, { borderColor: colors.border, opacity: busy ? 0.55 : 1 }]}
                      >
                        <Trash2 size={14} color={colors.textSecondary} />
                      </Pressable>
                    ) : null}
                  </View>
                ) : null}
              </View>
            </View>
          );
        })}
      </View>
      {canManage ? (
        <Text style={[styles.footnote, { color: colors.textSecondary }]}>
          Images are optimized by the server. Replacing an image keeps the current artwork until the new upload succeeds.
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { borderWidth: 1, borderRadius: 22, padding: 14, gap: 14 },
  headingRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  headingIcon: { width: 40, height: 40, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  headingText: { flex: 1, gap: 3 },
  title: { fontSize: 16, fontWeight: "800", letterSpacing: -0.2 },
  subtitle: { fontSize: 12 },
  message: { fontSize: 13 },
  grid: { gap: 12 },
  slot: { borderWidth: 1, borderRadius: 16, overflow: "hidden" },
  image: { width: "100%", height: 150, backgroundColor: "#1F2937" },
  placeholder: { height: 110, alignItems: "center", justifyContent: "center", gap: 8 },
  placeholderText: { fontSize: 12 },
  slotBody: { padding: 12, gap: 5 },
  slotTitle: { fontSize: 13, fontWeight: "800" },
  slotHint: { fontSize: 11 },
  actions: { flexDirection: "row", gap: 8, marginTop: 7 },
  actionButton: { flex: 1, minHeight: 38, borderRadius: 10, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7 },
  actionText: { fontSize: 12, fontWeight: "800" },
  removeButton: { width: 40, minHeight: 38, borderWidth: 1, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  footnote: { fontSize: 11, lineHeight: 16 },
});
