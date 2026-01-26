import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  View,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react-native";
import { getMyGroups, createGroupApi } from "@/api/apiService";
import { GroupCard } from "./GroupCard";
import { useTheme } from "@/theme/ThemeProvider";
import CreateGroupModal from "./CreateGroupModal";

export default function GroupListScreen() {
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const [modalVisible, setModalVisible] = useState(false);

  // 1. FETCH GROUPS (With Cache Persistence)
  const { 
    data: groups = [], 
    isLoading, 
    isRefetching, 
    refetch 
  } = useQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      const res = await getMyGroups();
      const data = res?.data;
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

  // 2. CREATE GROUP MUTATION
  const mutation = useMutation({
    mutationFn: (formData) => createGroupApi(formData),
    onSuccess: () => {
      // Refresh the group list immediately
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      setModalVisible(false);
      Alert.alert("Success", "Group created successfully! 🎉");
    },
    onError: (error) => {
      Alert.alert("Error", error.response?.data?.message || "Failed to create group");
    }
  });

  // 3. HANDLE FORM DATA SUBMISSION
  const handleConfirm = async ({ name, image, privacy }) => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("privacy", privacy);
    
    // Process image for Multer backend
    if (image) {
      const uriParts = image.split('.');
      const fileType = uriParts[uriParts.length - 1];
      
      formData.append("avatar", {
        uri: image,
        name: `avatar.${fileType}`,
        type: `image/${fileType}`,
      });
    }

    mutation.mutate(formData);
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
          renderItem={({ item }) => (
            <GroupCard 
              group={item} 
              onPress={(chatId) => console.log("Navigate to chat:", chatId)} 
            />
          )}
          refreshControl={
            <RefreshControl 
              refreshing={isRefetching} 
              onRefresh={refetch} 
              tintColor={colors.accent} 
            />
          }
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={{ color: colors.textSecondary }}>No groups found.</Text>
            </View>
          }
          contentContainerStyle={{ paddingVertical: 8, paddingBottom: 80 }}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.accent }]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Plus color="#FFF" size={30} />
      </TouchableOpacity>

      {/* MODAL */}
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