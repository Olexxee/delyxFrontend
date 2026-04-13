import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";
import { useInbox } from "@/hooks/useConversations";
import { useMyGroups } from "@/hooks/useMyGroups";
import { mapConversationItemToConversationListItemVM } from "@/mappers/conversation.mapper";
import { mapGroupListItemToVM } from "@/mappers/group.mapper";
import { ChatsPane } from "@/components/chat/chat-hub/ChatsPane";
import { GroupsPane } from "@/components/chat/chat-hub/GroupsPane";

type HubTab = "chats" | "groups";

export default function ChatHubScreen() {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<HubTab>("chats");

  const inboxQuery = useInbox();
  const groupsQuery = useMyGroups();

  const chatItems = useMemo(() => {
    return (inboxQuery.data?.items || [])
      .filter((item) => item.type === "direct")
      .map(mapConversationItemToConversationListItemVM);
  }, [inboxQuery.data?.items]);

  const groupItems = useMemo(() => {
    const rawGroups = (groupsQuery.data as any)?.data || groupsQuery.data || [];

    return rawGroups.map(mapGroupListItemToVM);
  }, [groupsQuery.data]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Messages
        </Text>
      </View>

      <View
        style={[
          styles.segmentWrap,
          { backgroundColor: colors.surfaceLight },
        ]}
      >
        <Pressable
          onPress={() => setActiveTab("chats")}
          style={[
            styles.segment,
            activeTab === "chats" && {
              backgroundColor: colors.surface,
            },
          ]}
        >
          <Text style={{ color: colors.textPrimary, fontWeight: "600" }}>
            Chats
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab("groups")}
          style={[
            styles.segment,
            activeTab === "groups" && {
              backgroundColor: colors.surface,
            },
          ]}
        >
          <Text style={{ color: colors.textPrimary, fontWeight: "600" }}>
            Groups
          </Text>
        </Pressable>
      </View>

      <View style={styles.body}>
        {activeTab === "chats" ? (
          <ChatsPane
            items={chatItems}
            isLoading={inboxQuery.isLoading}
            isError={inboxQuery.isError}
            onRetry={inboxQuery.refetch}
          />
        ) : (
          <GroupsPane
            items={groupItems}
            isLoading={groupsQuery.isLoading}
            isError={groupsQuery.isError}
            onRetry={groupsQuery.refetch}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  segmentWrap: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 14,
    padding: 4,
  },
  segment: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    flex: 1,
  },
});