import { useSearchGroups } from "@/api/groups.api";
import { useSocket } from "@/api/socketRegistry";
import CreateGroupModal from "@/components/group/CreateGroupModal";
import { GroupInfoModal } from "@/components/group/GroupInfoModal";
import { CreateGroupFAB } from "@/components/ui/CreateGroupFAB";
import { useCreateGroup } from "@/hooks/mutations/useCreateGroup";
import { useDebounce } from "@/hooks/useDebounce";
import { useDiscoverGroups } from "@/hooks/useDiscoverGroups";
import { useMyGroups } from "@/hooks/useMyGroups";
import { useTheme } from "@/theme/ThemeProvider";
import type { GroupOverview } from "@/types/group";
import { useQueryClient } from "@tanstack/react-query";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, RefreshControl, SectionList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DiscoverGroupItem } from "./DiscoverGroupItem";
import { GroupCardSkeleton } from "./GroupCardSkeleton";
import { GroupListItem } from "./GroupListItem";
import { GroupsHeader } from "./GroupsHeader";

// ─── Types ────────────────────────────────────────────────────────────────────

type SectionType = {
  title: string;
  data: GroupOverview[];
};

type CreateGroupPayload =
  | FormData
  | { name: string; privacy: string; avatar: string | null };

// ─── Sort helper (defined outside component to avoid re-creation) ─────────────

const sortByLastMessage = (a: GroupOverview, b: GroupOverview) => {
  const aTime = (a as any).lastMessageAt;
  const bTime = (b as any).lastMessageAt;
  if (!aTime && !bTime) return 0;
  if (!aTime) return 1;
  if (!bTime) return -1;
  return new Date(bTime).getTime() - new Date(aTime).getTime();
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function GroupListScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<GroupOverview | null>(null);
  const debouncedSearch = useDebounce(searchQuery, 400);
  const isSearching = debouncedSearch.trim().length > 0;
  const [isJoining, setIsJoining] = useState(false);

  /* ================= QUERIES & MUTATIONS ================= */
  const {
    data: myGroups = [],
    isLoading: isMyGroupsLoading,
    refetch: refetchMyGroups,
  } = useMyGroups();

  const {
    data: discoverPages,
    isLoading: isDiscoverLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchDiscover,
  } = useDiscoverGroups(debouncedSearch);

  const {
    data: searchResults = [],
    isLoading: isSearchLoading,
  } = useSearchGroups(debouncedSearch);

  const { mutate: performCreateGroup, isPending: isCreating } = useCreateGroup();

  /* ================= HANDLERS (defined early to avoid forward references) ================= */
  const handleGroupPress = useCallback(
    (group: GroupOverview) => {
      if (!group.chatRoomId || !group.name) {
        Alert.alert("Invalid group", "This group cannot be opened at the moment.");
        return;
      }

      const rawAvatar = group.avatar as any;
      const avatarUrl: string =
        typeof rawAvatar === "string"
          ? rawAvatar
          : typeof rawAvatar?.url === "string"
            ? rawAvatar.url
            : "";

      router.push({
        pathname: "/(chats)/[chatRoomId]",
        params: {
          chatRoomId: group.chatRoomId,
          name: group.name,
          avatar: avatarUrl,
          groupId: group.id ?? "",
        },
      });
    },
    [router]
  );

  /* ================= REFETCH ON FOCUS ================= */
  useFocusEffect(
    useCallback(() => {
      refetchMyGroups();
    }, [refetchMyGroups])
  );

  /* ================= REAL-TIME GROUP BUMP ================= */
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg: {
      chatRoomId: string;
      content: string;
      createdAt: string;
    }) => {
      queryClient.setQueryData<GroupOverview[]>(["myGroups"], (prev) => {
        if (!prev) return prev;

        const targetGroup = prev.find((g) => g.chatRoomId === msg.chatRoomId);
        if (!targetGroup) return prev;

        const updated = prev.map((group) => {
          if (group.chatRoomId !== msg.chatRoomId) return group;
          return {
            ...group,
            lastMessage: msg.content,
            lastMessageAt: msg.createdAt,
            unreadCount: (Number((group as any).unreadCount) || 0) + 1,
          };
        });

        return [...updated].sort(sortByLastMessage);
      });
    };

    socket.on("chat:new_message", handleNewMessage);
    return () => {
      socket.off("chat:new_message", handleNewMessage);
    };
  }, [socket, queryClient]);

  // Direct join from the card (no modal) — navigates immediately
  const handleJoinGroup = useCallback(
    (group: GroupOverview) => {
      queryClient.setQueryData<GroupOverview[]>(["myGroups"], (prev = []) => {
        if (prev.find((g) => g.id === group.id)) return prev;
        return [{ ...group, lastMessageAt: new Date().toISOString() }, ...prev];
      });
      refetchMyGroups();
      handleGroupPress(group);
    },
    [queryClient, refetchMyGroups, handleGroupPress]
  );

  const handleCreateConfirm = useCallback(
    (payload: CreateGroupPayload) => {
      if (!payload) return;

      performCreateGroup(payload, {
        onSuccess: (newGroup: GroupOverview) => {
          setIsModalVisible(false);
          if (newGroup) {
            queryClient.setQueryData<GroupOverview[]>(["myGroups"], (prev = []) => [
              { ...newGroup, lastMessageAt: new Date().toISOString() } as GroupOverview,
              ...prev.filter((g) => g.id !== newGroup.id),
            ]);
          }
          refetchMyGroups();
          Alert.alert("Success", "Group created successfully!");
        },
        onError: (error: any) =>
          Alert.alert("Error", error?.message || "Failed to create group"),
      });
    },
    [performCreateGroup, refetchMyGroups, queryClient]
  );

  const handleViewInfo = useCallback(
    (group: GroupOverview) => {
      setSelectedGroup(null);
      router.push({
        pathname: "/(groups)/group-info",
        params: { groupId: group.id },
      });
    },
    [router]
  );

  const handlePressInfo = useCallback(
    (group: GroupOverview) => {
      setSelectedGroup(group);
    },
    []
  );

  const handleModalJoin = useCallback(
    (group: GroupOverview) => {
      handleJoinGroup(group);
    },
    [handleJoinGroup]
  );

  const handleEndReached = useCallback(() => {
    if (!isSearching && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [isSearching, hasNextPage, isFetchingNextPage, fetchNextPage]);

  /* ================= DATA PROCESSING ================= */
  const discoverGroups: GroupOverview[] = useMemo(() => {
    return discoverPages?.pages.flatMap((page) => page.groups) ?? [];
  }, [discoverPages]);

  const sortedMyGroups: GroupOverview[] = useMemo(() => {
    return [...(myGroups ?? [])].sort(sortByLastMessage);
  }, [myGroups]);

  const sections: SectionType[] = useMemo(
    () => [
      { title: "MY GROUPS", data: sortedMyGroups },
      {
        title: isSearching ? "SEARCH RESULTS" : "DISCOVER",
        data: isSearching ? (searchResults as GroupOverview[]) : discoverGroups,
      },
    ],
    [sortedMyGroups, discoverGroups, searchResults, isSearching]
  );

  /* ================= RENDER HELPERS ================= */
  const renderItem = useCallback(
    ({ item, section }: { item: GroupOverview; section: SectionType }) => {
      if (!item || !section) return null;

      if (section.title === "MY GROUPS") {
        return <GroupListItem group={item} onPress={handleGroupPress} />;
      }

      return (
        <DiscoverGroupItem
          group={item}
          onPressInfo={handlePressInfo}   // opens modal
          onJoin={handleJoinGroup}        // joins directly from card
        />
      );
    },
    [handleGroupPress, handleJoinGroup]
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: SectionType }) => {
      if (!section) return null;

      return (
        <View style={[styles.sectionHeader, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            {section.title}
          </Text>
        </View>
      );
    },
    [colors]
  );

  /* ================= RENDER ================= */
  if (isMyGroupsLoading || isDiscoverLoading) {
    return (
      <SafeAreaView style={[styles.screen, { backgroundColor: colors.surface }]}>
        <GroupsHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        {Array.from({ length: 6 }).map((_, i) => (
          <GroupCardSkeleton key={i} />
        ))}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.surface }]}>
      <GroupsHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        removeClippedSubviews
        refreshControl={
          <RefreshControl
            refreshing={isSearchLoading}
            onRefresh={() => {
              refetchMyGroups();
              refetchDiscover();
            }}
            tintColor={colors.accent}
          />
        }
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled
      />

      <CreateGroupFAB onPress={() => setIsModalVisible(true)} />

      <CreateGroupModal
        visible={isModalVisible}
        isSubmitting={isCreating}
        onClose={() => setIsModalVisible(false)}
        onConfirm={handleCreateConfirm}
      />
      <GroupInfoModal
        visible={!!selectedGroup}
        group={selectedGroup}
        onClose={() => setSelectedGroup(null)}
        onJoin={handleModalJoin}
        onViewInfo={handleViewInfo}
        isJoining={isJoining}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1 },
  listContent: { paddingBottom: 100 },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontWeight: "700",
  },
});