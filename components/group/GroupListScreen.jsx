import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  ActivityIndicator,
  View,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react-native";
import { useRouter } from "expo-router";
import { getMyGroups, createGroup, getGroupAESKey } from "@/api/apiService";
import { GroupCard } from "./GroupCard";
import { useTheme } from "@/theme/ThemeProvider";
import CreateGroupModal from "./CreateGroupModal";

export default function GroupListScreen() {
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  // 1️⃣ Fetch groups
  const { data: groups = [], isLoading, isRefetching, refetch } = useQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      const res = await getMyGroups();
      const data = res?.data || [];
      if (!Array.isArray(data)) return [];

      return data.map((g) => ({
        id: g.id,
        name: g.name,
        avatar: g.avatar,
        chatRoomId: g.chatRoomId || null,
        lastMessage: g.lastMessage || null,
        lastMessageAt: g.lastMessageAt || null,
        unreadCount: 0,
      }));
    },
  });

  // 2️⃣ Create group mutation
  const mutation = useMutation({
    mutationFn: (payload) => createGroup(payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["groups"]);
      setModalVisible(false);
      Alert.alert("Success", "Group created successfully! 🎉");
    },
    onError: (error) => {
      Alert.alert("Error", error?.response?.data?.message || "Failed to create group");
    },
  });

  // 3️⃣ Open group chat
  const handleOpenGroup = async (group) => {
    if (!group.chatRoomId) return;

    try {
      const aesKeyRes = await getGroupAESKey(group.chatRoomId);
      const aesKey = aesKeyRes?.data?.aesKey || "";

      if (!aesKey) {
        Alert.alert("Error", "Failed to fetch encryption key for this group.");
        return;
      }

      router.push({
        pathname: "/(tabs)/groupChatScreen",
        params: {
          chatRoomId: group.chatRoomId,
          name: group.name,
          avatar: group.avatar || "",
          aesKey,
        },
      });
    } catch (err) {
      console.error("Failed to open group chat:", err);
      Alert.alert("Error", "Could not open chat. Please try again.");
    }
  };

  // 4️⃣ Handle create group form
  const handleConfirm = ({ name, image, privacy }) => {
    if (!name || !privacy) return;

    // Build FormData if image exists, else plain JSON
    const payload = image
      ? (() => {
          const formData = new FormData();
          formData.append("name", name.toString());
          formData.append("privacy", privacy.toString());

          const uriParts = image.split(".");
          const fileType = uriParts[uriParts.length - 1];

          formData.append("avatar", {
            uri: image,
            name: `avatar.${fileType}`,
            type: `image/${fileType}`,
          });

          return formData;
        })()
      : { name: name.toString(), privacy: privacy.toString(), avatar: null };

    mutation.mutate(payload);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
      {isLoading && !isRefetching ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <GroupCard group={item} onPress={() => handleOpenGroup(item)} />}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.accent} />}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={{ color: colors.textSecondary }}>No groups found.</Text>
            </View>
          }
          contentContainerStyle={{ paddingVertical: 8, paddingBottom: 80 }}
        />
      )}

      {/* FAB */}
      <TouchableOpacity style={[styles.fab, { backgroundColor: colors.accent }]} onPress={() => setModalVisible(true)}>
        <Plus color="#FFF" size={30} />
      </TouchableOpacity>

      {/* Create group modal */}
      <CreateGroupModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirm}
        isSubmitting={mutation.isPending}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
});
