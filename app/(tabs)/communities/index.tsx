import { useCommunities, useCreateCommunity, useJoinCommunity } from "@/hooks/useCommunities";
import { useTheme } from "@/theme/ThemeProvider";
import { useDebounce } from "@/hooks/useDebounce";
import { Search, UsersRound, Plus, X, ChevronRight, ImagePlus } from "lucide-react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Image } from "react-native";
import { useRouter } from "expo-router";
import { uploadMedia } from "@/src/features/media/api";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function CommunitiesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [communityImage, setCommunityImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [formError, setFormError] = useState("");
  const communities = useCommunities(debouncedSearch);
  const create = useCreateCommunity();
  const join = useJoinCommunity();

  const chooseCommunityImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setFormError("Allow photo library access to choose a community image.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      setCommunityImage(result.assets[0]);
      setFormError("");
    }
  };

  const submitCreate = async () => {
    if (name.trim().length < 3) {
      setFormError("Community name must be at least 3 characters.");
      return;
    }
    setFormError("");
    try {
      let imageUrl: string | undefined;
      if (communityImage) {
        const uploaded = await uploadMedia(communityImage, "COMMUNITY_IMAGE");
        imageUrl = uploaded.secureUrl;
      }
      await create.mutateAsync({
        name: name.trim(),
        description: description.trim() || undefined,
        image: imageUrl,
      });
      setName("");
      setDescription("");
      setCommunityImage(null);
      setShowCreate(false);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Could not create community.");
    }
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Communities</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Find your people. Compete together.</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Create community" onPress={() => setShowCreate(true)} style={[styles.createButton, { backgroundColor: colors.accent }]}>
            <Plus size={18} color="#fff" />
            <Text style={styles.createButtonTextAccent}>Create</Text>
          </Pressable>
        </View>
        <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Search size={18} color={colors.textSecondary} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search communities"
            placeholderTextColor={colors.textSecondary}
            returnKeyType="search"
            accessibilityLabel="Search communities"
            style={[styles.searchInput, { color: colors.textPrimary }]}
          />
          {!!search && <Pressable onPress={() => setSearch("")} accessibilityLabel="Clear search"><X size={17} color={colors.textSecondary} /></Pressable>}
        </View>
      </View>

      {communities.isLoading ? (
        <View style={styles.center}><ActivityIndicator color={colors.primary} /><Text style={{ color: colors.textSecondary, marginTop: 10 }}>Finding communities…</Text></View>
      ) : communities.isError ? (
        <View style={styles.center}>
          <Text style={[styles.stateTitle, { color: colors.textPrimary }]}>Couldn’t load communities</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary, textAlign: "center" }]}>{communities.error.message}</Text>
          <Pressable onPress={() => communities.refetch()} style={[styles.retry, { backgroundColor: colors.primary }]}><Text style={styles.createButtonText}>Try again</Text></Pressable>
        </View>
      ) : (
        <FlatList
          data={communities.data ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.list, { paddingBottom: 28 + insets.bottom }]}
          refreshing={communities.isRefetching}
          onRefresh={() => communities.refetch()}
          ListEmptyComponent={<View style={styles.empty}><UsersRound size={32} color={colors.textSecondary} /><Text style={[styles.stateTitle, { color: colors.textPrimary }]}>No communities found</Text><Text style={[styles.subtitle, { color: colors.textSecondary, textAlign: "center" }]}>Try another search or create the first community.</Text></View>}
          renderItem={({ item }) => {
            const memberCount = item.memberCount ?? item.membersCount;
            const isJoining = join.isPending && join.variables === item.id;
            return (
              <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={item.isMember ? `Open ${item.name}` : `${item.name} community details`}
                  disabled={!item.isMember}
                  onPress={() => router.push({ pathname: "/(tabs)/group/[groupId]/chat", params: { groupId: item.id } })}
                  style={styles.communityPressable}
                >
                  <View style={[styles.communityIcon, { backgroundColor: colors.primary + "18" }]}>{item.imageUrl ? <Image source={{ uri: item.imageUrl }} style={styles.communityImage} /> : <UsersRound size={22} color={colors.primary} />}</View>
                  <View style={styles.communityBody}>
                    <Text style={[styles.communityName, { color: colors.textPrimary }]} numberOfLines={1}>{item.name}</Text>
                    <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>{item.description || "A place to connect, organize competitions, and play together."}</Text>
                    <Text style={[styles.meta, { color: colors.textSecondary }]}>{typeof memberCount === "number" ? `${memberCount} members` : "Community"}{item.visibility === "PRIVATE" ? " · Private" : " · Public"}</Text>
                  </View>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  disabled={isJoining}
                  onPress={() => item.isMember
                    ? router.push({ pathname: "/(tabs)/group/[groupId]/chat", params: { groupId: item.id } })
                    : join.mutate(item.id)}
                  style={[styles.joinButton, { borderColor: colors.primary }]}
                >
                  {isJoining ? <ActivityIndicator size="small" color={colors.primary} /> : <><Text style={[styles.joinText, { color: colors.primary }]}>{item.isMember ? "Open" : "Join"}</Text><ChevronRight size={15} color={colors.primary} /></>}
                </Pressable>
              </View>
            );
          }}
        />
      )}

      <Modal visible={showCreate} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowCreate(false)}>
        <KeyboardAvoidingView style={[styles.modal, { backgroundColor: colors.background }]} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? insets.top : 0}>
          <View style={styles.modalHeader}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Create a community</Text>
            <Pressable onPress={() => setShowCreate(false)} accessibilityLabel="Close create community form"><X size={22} color={colors.textPrimary} /></Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled" keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"} automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}>
            <Text style={[styles.label, { color: colors.textPrimary }]}>Community image (optional)</Text>
            {communityImage ? <Image source={{ uri: communityImage.uri }} style={styles.imagePreview} /> : null}
            <Pressable onPress={chooseCommunityImage} style={[styles.imagePicker, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <ImagePlus size={18} color={colors.primary} />
              <Text style={[styles.imagePickerText, { color: colors.textPrimary }]}>{communityImage ? "Change image" : "Choose an image"}</Text>
            </Pressable>
            {communityImage ? <Pressable onPress={() => setCommunityImage(null)} accessibilityRole="button"><Text style={styles.removeImage}>Remove image</Text></Pressable> : null}
            <Text style={[styles.label, { color: colors.textPrimary }]}>Community name</Text>
            <TextInput value={name} onChangeText={setName} placeholder="e.g. Lagos Weekend League" placeholderTextColor={colors.textSecondary} maxLength={60} returnKeyType="next" style={[styles.field, { color: colors.textPrimary, backgroundColor: colors.surface, borderColor: colors.border }]} />
            <Text style={[styles.label, { color: colors.textPrimary }]}>Description (optional)</Text>
            <TextInput value={description} onChangeText={setDescription} placeholder="What brings your community together?" placeholderTextColor={colors.textSecondary} multiline maxLength={300} textAlignVertical="top" style={[styles.field, styles.descriptionField, { color: colors.textPrimary, backgroundColor: colors.surface, borderColor: colors.border }]} />
            {!!formError && <Text style={styles.error}>{formError}</Text>}
            <Pressable disabled={create.isPending} onPress={submitCreate} style={[styles.submitButton, { backgroundColor: colors.primary, opacity: create.isPending ? 0.65 : 1 }]}>
              {create.isPending ? <ActivityIndicator color="#fff" /> : <Text style={styles.createButtonText}>Create community</Text>}
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { paddingHorizontal: 18, paddingTop: 12, paddingBottom: 14, gap: 16 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  title: { fontSize: 25, fontWeight: "800" },
  subtitle: { fontSize: 13, lineHeight: 19, marginTop: 4 },
  createButton: { borderRadius: 12, paddingHorizontal: 13, paddingVertical: 11, flexDirection: "row", alignItems: "center", gap: 6 },
  createButtonText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  createButtonTextAccent: { color: "#090D18", fontSize: 13, fontWeight: "900" },
  searchBox: { minHeight: 48, borderRadius: 14, borderWidth: 1, paddingHorizontal: 13, flexDirection: "row", alignItems: "center", gap: 10 },
  searchInput: { flex: 1, minHeight: 44, fontSize: 15 },
  list: { paddingHorizontal: 16, gap: 11 },
  card: { borderRadius: 17, borderWidth: 1, padding: 14, flexDirection: "row", alignItems: "center", gap: 11 },
  communityPressable: { flex: 1, minWidth: 0, flexDirection: "row", alignItems: "center", gap: 11 },
  communityIcon: { width: 46, height: 46, borderRadius: 14, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  communityImage: { width: "100%", height: "100%" },
  imagePreview: { width: "100%", height: 170, borderRadius: 12, resizeMode: "cover" },
  imagePicker: { minHeight: 46, borderWidth: 1, borderRadius: 12, paddingHorizontal: 13, flexDirection: "row", alignItems: "center", gap: 9 },
  imagePickerText: { fontSize: 14, fontWeight: "600" },
  removeImage: { color: "#dc2626", fontSize: 12, fontWeight: "600", textAlign: "right", marginTop: -4 },
  communityBody: { flex: 1, gap: 3 },
  communityName: { fontSize: 15, fontWeight: "800" },
  description: { fontSize: 12, lineHeight: 17 },
  meta: { fontSize: 11, marginTop: 2 },
  joinButton: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 9, paddingVertical: 8, flexDirection: "row", alignItems: "center", gap: 2 },
  joinText: { fontSize: 12, fontWeight: "700" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 28 },
  stateTitle: { fontSize: 16, fontWeight: "800", marginTop: 12, marginBottom: 5 },
  retry: { marginTop: 14, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10 },
  empty: { alignItems: "center", padding: 38 },
  modal: { flex: 1 },
  modalHeader: { padding: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  form: { padding: 20, gap: 12 },
  label: { fontSize: 13, fontWeight: "700", marginTop: 6 },
  field: { minHeight: 48, borderWidth: 1, borderRadius: 12, paddingHorizontal: 13, paddingVertical: 12, fontSize: 15 },
  descriptionField: { minHeight: 110 },
  error: { color: "#dc2626", fontSize: 13 },
  submitButton: { minHeight: 50, borderRadius: 13, alignItems: "center", justifyContent: "center", marginTop: 10 },
});
