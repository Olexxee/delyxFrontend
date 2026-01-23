import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // <- import SafeAreaView
import api from "@/api/api";
import { GroupCard } from "./GroupCard";
import { useRouter } from "expo-router";
import { useTheme } from "@/theme/ThemeProvider";
import { useSocket } from "@/api/socketRegistry";

export const GroupListScreen = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const { socket } = useSocket();

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const res = await api.get("/groups");
      if (res.data.success) {
        setGroups(res.data.data.map((g) => ({ ...g, unreadCount: 0 })));
      }
    } catch (err) {
      console.error("Failed to fetch groups:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGroupPress = (chatRoomId) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.chatRoomId === chatRoomId ? { ...g, unreadCount: 0 } : g
      )
    );
    // router.push(`/chat/${chatRoomId}`);
  };

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
      setGroups((prev) =>
        prev.map((g) =>
          g.chatRoomId === msg.chatRoomId
            ? {
              ...g,
              lastMessage: {
                encryptedContent: msg.encryptedContent,
                sender: msg.sender,
                createdAt: msg.createdAt,
              },
              lastMessageAt: msg.createdAt,
              unreadCount: (g.unreadCount || 0) + 1,
            }
            : g
        )
      );
    };

    socket.on("new_group_message", handleNewMessage);
    return () => socket.off("new_group_message", handleNewMessage);
  }, [socket]);

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : groups.length === 0 ? (
        <View style={styles.centered}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No groups found.
          </Text>
        </View>
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <GroupCard group={item} onPress={handleGroupPress} />}
          contentContainerStyle={{ paddingVertical: 8, paddingBottom: 16 }} // extra padding for bottom safe area
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },
});
