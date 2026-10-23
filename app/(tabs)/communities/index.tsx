import { useCommunities, useCreateCommunity, useJoinCommunity } from "@/hooks/useCommunities";
import { useTheme } from "@/theme/ThemeProvider";
import { useDebounce } from "@/hooks/useDebounce";
import { Search, UsersRound, Plus, X, ChevronRight, ImagePlus, ArrowUpRight } from "lucide-react-native";
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

  const closeCreate = () => {
    if (create.isPending) return;
    setShowCreate(false);
    setFormError("");
  };

  const chooseCommunityImage = async () => {
    try {
      if (Platform.OS !== "web") {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          setFormError("Allow photo library access to choose a community image.");
          return;
        }
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
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Could not open your image library.");
    }
  };

  const submitCreate = async () => {
    if (name.trim().length < 3) {
      setFormError("Use at least 3 characters for the community name.");
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
      setFormError("");
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Could not create community.");
    }
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.headingBlock}>
            <Text style={[styles.eyebrow, { color: colors.accent }]}>PLAY TOGETHER</Text>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Communities</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Find your people. Compete together.
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Create community"
            onPress={() => {
              setFormError("");
              setShowCreate(true);
            }}
            style={[styles.createButton, { backgroundColor: colors.accent }]}
          >
            <Plus size={17} color="#090D18" />
            <Text style={styles.createButtonTextAccent}>Create</Text>
          </Pressable>
        </View>

        <View style={[styles.searchBox, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
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
          {!!search && (
            <Pressable onPress={() => setSearch("")} accessibilityLabel="Clear search" hitSlop={8}>
              <X size={17} color={colors.textSecondary} />
            </Pressable>
          )}
        </View>
      </View>

      {communities.isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
          <Text style={[styles.stateDescription, { color: colors.textSecondary }]}>Finding communities…</Text>
        </View>
      ) : communities.isError ? (
        <View style={styles.center}>
          <Text style={[styles.stateTitle, { color: colors.textPrimary }]}>Couldn’t load communities</Text>
          <Text style={[styles.stateDescription, { color: colors.textSecondary, textAlign: "center" }]}>
            {communities.error.message}
          </Text>
          <Pressable onPress={() => communities.refetch()} style={[styles.retry, { backgroundColor: colors.primary }]}>
            <Text style={styles.primaryButtonText}>Try again</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={communities.data ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.list, { paddingBottom: 28 + insets.bottom }]}
          refreshing={communities.isRefetching}
          onRefresh={() => communities.refetch()}
          ListEmptyComponent={
            <View style={styles.empty}>
              <UsersRound size={28} color={colors.textSecondary} />
              <Text style={[styles.stateTitle, { color: colors.textPrimary }]}>No communities found</Text>
              <Text style={[styles.stateDescription, { color: colors.textSecondary, textAlign: "center" }]}>
                Try another search or create the first community.
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const memberCount = item.memberCount ?? item.membersCount;
            const isJoining = join.isPending && join.variables === item.id;
            const openCommunity = () =>
              router.push({ pathname: "/(tabs)/group/[groupId]/chat", params: { groupId: item.id } });

            return (
              <View style={[styles.communityRow, { borderBottomColor: colors.border }]}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={item.isMember ? `Open ${item.name}` : `${item.name} community details`}
                  disabled={!item.isMember}
                  onPress={openCommunity}
                  style={styles.communityPressable}
                >
                  <View style={[styles.communityIcon, { backgroundColor: colors.primary + "18" }]}>
                    {item.imageUrl ? (
                      <Image source={{ uri: item.imageUrl }} style={styles.communityImage} resizeMode="cover" />
                    ) : (
                      <UsersRound size={21} color={colors.primary} />
                    )}
                  </View>
                  <View style={styles.communityBody}>
                    <Text style={[styles.communityName, { color: colors.textPrimary }]} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
                      {item.description || "A place to connect, organize competitions, and play together."}
                    </Text>
                    <Text style={[styles.meta, { color: colors.textSecondary }]}>
                      {typeof memberCount === "number" ? `${memberCount} members` : "Community"}
                      {item.visibility === "PRIVATE" ? " · Private" : " · Public"}
                    </Text>
                  </View>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  disabled={isJoining}
                  onPress={() => item.isMember ? openCommunity() : join.mutate(item.id)}
                  style={styles.joinButton}
                >
                  {isJoining ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : (
                    <>
                      <Text style={[styles.joinText, { color: colors.primary }]}>{item.isMember ? "Open" : "Join"}</Text>
                      <ArrowUpRight size={15} color={colors.primary} />
                    </>
                  )}
                </Pressable>
              </View>
            );
          }}
        />
      )}

      <Modal
        visible={showCreate}
        animationType="slide"
        presentationStyle={Platform.OS === "ios" ? "pageSheet" : "fullScreen"}
        onRequestClose={closeCreate}
      >
        <KeyboardAvoidingView
          style={[styles.modal, { backgroundColor: colors.background }]}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? insets.top : 0}
        >
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <View style={styles.modalHeading}>
              <Text style={[styles.eyebrow, { color: colors.accent }]}>YOUR SPACE, YOUR RULES</Text>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Create a community</Text>
            </View>
            <Pressable
              onPress={closeCreate}
              accessibilityRole="button"
              accessibilityLabel="Close create community form"
              disabled={create.isPending}
              hitSlop={10}
              style={styles.closeButton}
            >
              <X size={21} color={colors.textPrimary} />
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={[styles.form, { paddingBottom: Math.max(24, insets.bottom + 16) }]}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
            automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
          >
            <Text style={[styles.formIntro, { color: colors.textSecondary }]}>
              Give your squad a name. Add a description or image so people know what you’re about.
            </Text>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>
                Community image <Text style={{ color: colors.textSecondary, fontWeight: "400" }}>· Optional</Text>
              </Text>
              <View style={styles.imageRow}>
                <View style={[styles.imagePreviewFrame, { backgroundColor: colors.surface }]}>
                  {communityImage ? (
                    <Image source={{ uri: communityImage.uri }} style={styles.imagePreview} resizeMode="cover" />
                  ) : (
                    <ImagePlus size={24} color={colors.textSecondary} />
                  )}
                </View>
                <View style={styles.imageActions}>
                  <Text style={[styles.imageHelp, { color: colors.textSecondary }]}>
                    A landscape image works best.
                  </Text>
                  <Pressable
                    onPress={chooseCommunityImage}
                    disabled={create.isPending}
                    style={[styles.imagePicker, { borderColor: colors.border }]}
                  >
                    <ImagePlus size={16} color={colors.primary} />
                    <Text style={[styles.imagePickerText, { color: colors.textPrimary }]}>
                      {communityImage ? "Change image" : "Choose image"}
                    </Text>
                  </Pressable>
                  {communityImage && (
                    <Pressable onPress={() => setCommunityImage(null)} accessibilityRole="button" hitSlop={6}>
                      <Text style={styles.removeImage}>Remove image</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Community name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g. Lagos Weekend League"
                placeholderTextColor={colors.textSecondary}
                maxLength={60}
                returnKeyType="next"
                editable={!create.isPending}
                accessibilityLabel="Community name"
                style={[styles.field, { color: colors.textPrimary, backgroundColor: colors.surface, borderBottomColor: colors.border }]}
              />
              <Text style={[styles.fieldHint, { color: colors.textSecondary }]}>{name.trim().length}/60 characters</Text>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>
                Description <Text style={{ color: colors.textSecondary, fontWeight: "400" }}>· Optional</Text>
              </Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="What brings your community together?"
                placeholderTextColor={colors.textSecondary}
                multiline
                maxLength={300}
                editable={!create.isPending}
                textAlignVertical="top"
                accessibilityLabel="Community description"
                style={[styles.field, styles.descriptionField, { color: colors.textPrimary, backgroundColor: colors.surface, borderBottomColor: colors.border }]}
              />
              <Text style={[styles.fieldHint, { color: colors.textSecondary }]}>{description.length}/300 characters</Text>
            </View>

            {!!formError && (
              <View style={[styles.errorRow, { backgroundColor: colors.surface }]}>
                <Text style={styles.error}>{formError}</Text>
              </View>
            )}

            <Pressable
              accessibilityRole="button"
              disabled={create.isPending}
              onPress={submitCreate}
              style={[
                styles.submitButton,
                { backgroundColor: colors.accent, opacity: create.isPending ? 0.65 : 1 },
              ]}
            >
              {create.isPending ? (
                <ActivityIndicator color="#090D18" />
              ) : (
                <>
                  <Text style={styles.submitButtonText}>Create community</Text>
                  <ChevronRight size={17} color="#090D18" />
                </>
              )}
            </Pressable>
            <Text style={[styles.footerNote, { color: colors.textSecondary }]}>
              You’ll become the owner and can invite members after creation.
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, gap: 18 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  headingBlock: { flex: 1, minWidth: 0 },
  eyebrow: { fontSize: 10, fontWeight: "800", letterSpacing: 1.7, marginBottom: 6 },
  title: { fontSize: 30, fontWeight: "800", letterSpacing: -1.1 },
  subtitle: { fontSize: 13, lineHeight: 19, marginTop: 5 },
  createButton: { minHeight: 40, paddingHorizontal: 13, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, borderRadius: 2 },
  createButtonTextAccent: { color: "#090D18", fontSize: 13, fontWeight: "800" },
  searchBox: { minHeight: 46, borderBottomWidth: 1, paddingHorizontal: 11, flexDirection: "row", alignItems: "center", gap: 10 },
  searchInput: { flex: 1, minHeight: 44, fontSize: 14, outlineStyle: "none" as any },
  list: { paddingHorizontal: 20 },
  communityRow: { minHeight: 100, borderBottomWidth: StyleSheet.hairlineWidth, paddingVertical: 15, flexDirection: "row", alignItems: "center", gap: 12 },
  communityPressable: { flex: 1, minWidth: 0, flexDirection: "row", alignItems: "center", gap: 13 },
  communityIcon: { width: 54, height: 54, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  communityImage: { width: "100%", height: "100%" },
  communityBody: { flex: 1, gap: 4 },
  communityName: { fontSize: 15, fontWeight: "750" as any, letterSpacing: -0.15 },
  description: { fontSize: 12, lineHeight: 17 },
  meta: { fontSize: 11, marginTop: 1, letterSpacing: 0.1 },
  joinButton: { minWidth: 48, minHeight: 38, paddingHorizontal: 7, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 3 },
  joinText: { fontSize: 12, fontWeight: "700" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 28 },
  stateTitle: { fontSize: 16, fontWeight: "750" as any, marginTop: 12, marginBottom: 5 },
  stateDescription: { fontSize: 13, lineHeight: 19, marginTop: 6 },
  retry: { marginTop: 16, paddingHorizontal: 18, paddingVertical: 11, borderRadius: 2 },
  primaryButtonText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  empty: { alignItems: "center", paddingVertical: 52, paddingHorizontal: 28 },
  modal: { flex: 1 },
  modalHeader: { minHeight: 88, paddingHorizontal: 22, paddingVertical: 18, borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 16 },
  modalHeading: { flex: 1, gap: 2 },
  modalTitle: { fontSize: 24, fontWeight: "800", letterSpacing: -0.65 },
  closeButton: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  form: { paddingHorizontal: 22, paddingTop: 22, gap: 24 },
  formIntro: { fontSize: 13, lineHeight: 20, maxWidth: 560 },
  fieldGroup: { gap: 9 },
  label: { fontSize: 13, fontWeight: "700", letterSpacing: 0.1 },
  imageRow: { flexDirection: "row", alignItems: "center", gap: 15 },
  imagePreviewFrame: { width: 96, height: 72, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  imagePreview: { width: "100%", height: "100%" },
  imageActions: { flex: 1, alignItems: "flex-start", gap: 9 },
  imageHelp: { fontSize: 12 },
  imagePicker: { minHeight: 36, paddingHorizontal: 10, borderWidth: StyleSheet.hairlineWidth, flexDirection: "row", alignItems: "center", gap: 7, borderRadius: 2 },
  imagePickerText: { fontSize: 12, fontWeight: "600" },
  removeImage: { color: "#dc2626", fontSize: 12, fontWeight: "600" },
  field: { minHeight: 48, borderBottomWidth: 1, paddingHorizontal: 12, paddingVertical: 11, fontSize: 14, borderRadius: 0 },
  descriptionField: { minHeight: 104, paddingTop: 12 },
  fieldHint: { fontSize: 11, textAlign: "right" },
  errorRow: { paddingHorizontal: 12, paddingVertical: 10, borderLeftWidth: 2, borderLeftColor: "#dc2626" },
  error: { color: "#dc2626", fontSize: 12, lineHeight: 18 },
  submitButton: { minHeight: 48, paddingHorizontal: 15, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 2, marginTop: 2 },
  submitButtonText: { color: "#090D18", fontSize: 13, fontWeight: "800" },
  footerNote: { fontSize: 11, lineHeight: 17, textAlign: "center", marginTop: -12 },
});
