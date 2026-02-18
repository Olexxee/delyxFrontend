import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { Alert, RefreshControl, SectionList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CreateGroupModal from "@/components/group/CreateGroupModal";
import { CreateGroupFAB } from "@/components/ui/CreateGroupFAB";
import { useCreateGroup } from "@/hooks/mutations/useCreateGroup";
import { useDebounce } from "@/hooks/useDebounce";
import { useDiscoverGroups } from "@/hooks/useDiscoverGroups";
import { useMyGroups } from "@/hooks/useMyGroups";
import { useTheme } from "@/theme/ThemeProvider";

import type { GroupPrivacy } from "@/types/group";
import { DiscoverGroupItem } from "./DiscoverGroupItem";
import { GroupCardSkeleton } from "./GroupCardSkeleton";
import { GroupListItem } from "./GroupListItem";
import { GroupsHeader } from "./GroupsHeader";

type GroupType = {
  id: string;
  _id?: string;
  name: string;
  avatar?: string | null;
  chatRoomId?: string;
  lastMessage?: any;
  lastMessageAt?: string | null;
  privacy: GroupPrivacy;
  memberCount?: number;
};

type SectionType = {
  title: string;
  data: GroupType[];
};

type CreateGroupPayload = FormData | { name: string; privacy: string; avatar: string | null };

export default function GroupListScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 400);

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

  const { mutate: performCreateGroup, isPending: isCreating } = useCreateGroup();

  /* ================= HANDLERS ================= */
  const handleGroupPress = useCallback(
    (group: GroupType) => {
      if (!group.chatRoomId || !group.name) {
        Alert.alert("Invalid group", "This group cannot be opened at the moment.");
        return;
      }

      router.push({
        pathname: "/(chats)/[chatRoomId]",
        params: {
          chatRoomId: group.chatRoomId,
          name: group.name,
          avatar: group.avatar ?? "",
        },
      });
    },
    [router]
  );

  const handleCreateConfirm = useCallback(
    (payload: CreateGroupPayload) => {
      if (!payload) return;

      performCreateGroup(payload, {
        onSuccess: () => {
          setIsModalVisible(false);
          refetchMyGroups();
          Alert.alert("Success", "Group created successfully!");
        },
        onError: (error: any) =>
          Alert.alert("Error", error?.message || "Failed to create group"),
      });
    },
    [performCreateGroup, refetchMyGroups]
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  /* ================= DATA PROCESSING ================= */
  const discoverGroups: GroupType[] = useMemo(() => {
    return discoverPages?.pages.flatMap((page) => page.groups) ?? [];
  }, [discoverPages]);

  const sections: SectionType[] = useMemo(
    () => [
      { title: "MY GROUPS", data: myGroups ?? [] },
      { title: "DISCOVER", data: discoverGroups ?? [] },
    ],
    [myGroups, discoverGroups]
  );

  /* ================= RENDER HELPERS ================= */
  const renderItem = useCallback(
    ({ item, section }: { item: GroupType; section: SectionType }) => {
      if (!item || !section) return null;

      if (section.title === "MY GROUPS") {
        return <GroupListItem group={item} onPress={() => handleGroupPress(item)} />;
      }

      return <DiscoverGroupItem group={item} onPressInfo={() => undefined} />;
    },
    [handleGroupPress]
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: SectionType }) => {
      if (!section) return null;

      return (
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            backgroundColor: colors.surface,
          }}
        >
          <Text style={{ color: colors.textSecondary, fontWeight: "700" }}>
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
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
        <GroupsHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        {Array.from({ length: 6 }).map((_, i) => (
          <GroupCardSkeleton key={i} />
        ))}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
      <GroupsHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item._id ?? item.id ?? String(index)}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              refetchMyGroups();
              refetchDiscover();
            }}
            tintColor={colors.accent}
          />
        }
        contentContainerStyle={{ paddingBottom: 100 }}
        stickySectionHeadersEnabled
      />

      <CreateGroupFAB onPress={() => setIsModalVisible(true)} />

      <CreateGroupModal
        visible={isModalVisible}
        isSubmitting={isCreating}
        onClose={() => setIsModalVisible(false)}
        onConfirm={handleCreateConfirm}
      />
    </SafeAreaView>
  );
}
