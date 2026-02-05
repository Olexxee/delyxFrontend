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
import { getMyGroups, createGroup } from "@/api/apiService";
import { GroupCard } from "./GroupCard";
import { useTheme } from "@/theme/ThemeProvider";
import CreateGroupModal from "./CreateGroupModal";

export default function GroupListScreen() {
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch groups
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

  // Mutation for creating groups
  const mutation = useMutation({
    mutationFn: (payload) => createGroup(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["groups"]);
      setModalVisible(false);
      Alert.alert("Success", "Group created successfully! 🎉");

      const newGroup = data?.group || data?.data;
      if (newGroup?.chatRoom?._id || newGroup?.chatRoomId) {
        router.push({
          pathname: "/(chats)/[chatRoomId]",
          params: {
            chatRoomId: newGroup.chatRoom?._id || newGroup.chatRoomId,
            name: newGroup.name,
            avatar: newGroup.avatar || "",
          },
        });
      }
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error?.response?.data?.message || error.message || "Failed to create group"
      );
    },
  });

  const handleOpenGroup = (group) => {
    if (!group.chatRoomId) {
      Alert.alert("Error", "Invalid chat room");
      return;
    }

    router.push({
      pathname: "/(chats)/[chatRoomId]",
      params: {
        chatRoomId: group.chatRoomId,
        name: group.name,
        avatar: group.avatar || "",
      },
    });
  };

  // --------------------
  // Confirm handler
  // --------------------
  const handleConfirm = ({ name, image, privacy }: { name: string; image?: string; privacy: string }) => {
    if (!name || !privacy) return;

    let payload;

    if (image) {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("privacy", privacy);

      const filename = image.split("/").pop()?.split("?")[0] || "avatar.jpg";
      const fileType = filename.split(".").pop() || "jpg";

      formData.append("avatar", {
        uri: image,
        name: filename,
        type: `image/${fileType}`,
      } as any);

      payload = formData;
    } else {
      payload = { name, privacy };
    }

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

      <TouchableOpacity style={[styles.fab, { backgroundColor: colors.accent }]} onPress={() => setModalVisible(true)}>
        <Plus color="#FFF" size={30} />
      </TouchableOpacity>

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
