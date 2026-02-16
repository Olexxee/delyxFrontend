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

import { DiscoverGroupItem } from "./DiscoverGroupItem";
import { GroupCardSkeleton } from "./GroupCardSkeleton";
import { GroupListItem } from "./GroupListItem";
import { GroupsHeader } from "./GroupsHeader";

const [selectedGroup, setSelectedGroup] = useState<any | null>(null);
const [isGroupInfoVisible, setIsGroupInfoVisible] = useState(false);
const [isJoining, setIsJoining] = useState(false);


export default function GroupListScreen() {
    const { colors } = useTheme();
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);

    const debouncedSearch = useDebounce(searchQuery, 400);

    /* ================= QUERIES & MUTATIONS ================= */
    const { data: myGroups = [], isLoading: isMyGroupsLoading, refetch: refetchMyGroups } = useMyGroups();
    const { data: discoverPages, isLoading: isDiscoverLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch: refetchDiscover } = useDiscoverGroups(debouncedSearch);
    const { mutate: performCreateGroup, isPending: isCreating } = useCreateGroup();

    /* ================= HANDLERS ================= */
    const handleGroupPress = (id: string) => router.push(`/chat/${id}`);
    const handleCreateConfirm = (payload: FormData | { name: string; privacy: string; avatar: string | null }) => {
        performCreateGroup(payload, {
            onSuccess: () => {
                setIsModalVisible(false);
                refetchMyGroups();
                Alert.alert("Success", "Group created successfully!");
            },
            onError: (error: any) => Alert.alert("Error", error?.message || "Failed to create group"),
        });
    };
    const handleEndReached = () => { if (hasNextPage && !isFetchingNextPage) fetchNextPage(); };

    /* ================= DATA PROCESSING ================= */
    const discoverGroups = useMemo(() => {
        if (!discoverPages?.pages) return [];
        return discoverPages.pages.flatMap((page) => page.groups);
    }, [discoverPages]);

    const sections = useMemo(() => [
        { title: "MY GROUPS", data: Array.isArray(myGroups) ? myGroups : [] },
        { title: "DISCOVER", data: Array.isArray(discoverGroups) ? discoverGroups : [] },
    ], [myGroups, discoverGroups]);

    /* ================= RENDER HELPERS ================= */
    const renderItem = useCallback(({ item, section }: any) => {
        if (section.title === "MY GROUPS") {
            return <GroupListItem group={item} onPress={handleGroupPress} />;
        }
        return (
            <DiscoverGroupItem
                group={item}
                onPressInfo={() => {
                    setSelectedGroup(item);
                    setIsGroupInfoVisible(true);
                }}
            />
        );
    }, []);


    const renderSectionHeader = useCallback(({ section }: any) => (
        <View style={{ paddingHorizontal: 16, paddingVertical: 8, backgroundColor: colors.surface }}>
            <Text style={{ color: colors.textSecondary, fontWeight: "700" }}>{section.title}</Text>
        </View>
    ), [colors]);

    /* ================= RENDER ================= */
    if (isMyGroupsLoading || isDiscoverLoading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
                <GroupsHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
                {Array.from({ length: 6 }).map((_, i) => <GroupCardSkeleton key={i} />)}
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
            <GroupsHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

            <SectionList
                sections={sections}
                keyExtractor={(item, index) => (item._id ?? item.id ?? String(index))}
                renderItem={renderItem}
                renderSectionHeader={renderSectionHeader}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.4}
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={() => { refetchMyGroups(); refetchDiscover(); }}
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
