import { GroupShellProvider } from "@/authContext/GroupShellContext";
import { useGroupHub } from "@/hooks/useGroupHub";
import { mapGroupHubToGroupShellVM } from "@/mappers/group.mapper";
import { useTheme } from "@/theme/ThemeProvider";
import { Avatar } from "@/components/ui/Avatar";
import {
  Slot,
  useLocalSearchParams,
  useRouter,
  useSegments,
} from "expo-router";
import {
  Info,
  MessageCircle,
  Trophy,
  Users,
  ArrowLeft,
} from "lucide-react-native";
import { useMemo } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TABS = [
  { name: "chat", label: "Chat", Icon: MessageCircle },
  { name: "tournaments", label: "Tournaments", Icon: Trophy },
  { name: "members", label: "Members", Icon: Users },
  { name: "info", label: "Info", Icon: Info },
] as const;

export default function GroupSpaceLayout() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const segments = useSegments();
  const { groupId } = useLocalSearchParams<{ groupId: string }>();

  const { data, isLoading, isError } = useGroupHub(groupId);

  const shell = useMemo(() => {
    return data ? mapGroupHubToGroupShellVM(data) : null;
  }, [data]);

  // Determine active tab from current route segment
  const activeTab = segments[segments.length - 1] ?? "chat";

  if (!groupId || isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#000",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  if (isError || !shell) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#000",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 24,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 15 }}>
          Failed to load group
        </Text>
      </View>
    );
  }

  return (
    <GroupShellProvider shell={shell}>
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        {/* ── Group Header ── */}
        <View
          style={{
            paddingTop: insets.top,
            backgroundColor: colors.surface,
            borderBottomWidth: 0.5,
            borderBottomColor: colors.border,
          }}
        >
          {/* Top row: back + identity + live badge */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingTop: 10,
              paddingBottom: 12,
              gap: 12,
            }}
          >
            <Pressable
              onPress={() => router.back()}
              hitSlop={12}
              style={{
                width: 34,
                height: 34,
                borderRadius: 17,
                backgroundColor: colors.surfaceLight,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ArrowLeft size={16} color={colors.textPrimary} />
            </Pressable>

            <Avatar
              uri={shell.avatarUrl}
              label={shell.fallbackLabel}
              size={38}
            />

            <View style={{ flex: 1 }}>
              <Text
                numberOfLines={1}
                style={{
                  color: colors.textPrimary,
                  fontSize: 15,
                  fontWeight: "700",
                  letterSpacing: -0.2,
                }}
              >
                {shell.name}
              </Text>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 11,
                  marginTop: 1,
                }}
              >
                {shell.memberCount} member{shell.memberCount === 1 ? "" : "s"} ·{" "}
                {shell.myRole}
              </Text>
            </View>

            {shell.activeTournament && (
              <View
                style={{
                  backgroundColor: colors.accent + "22",
                  borderRadius: 8,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderWidth: 1,
                  borderColor: colors.accent + "44",
                }}
              >
                <Text
                  style={{
                    color: colors.accent,
                    fontSize: 10,
                    fontWeight: "800",
                    letterSpacing: 0.5,
                  }}
                >
                  LIVE
                </Text>
              </View>
            )}
          </View>

          {/* Tab bar row */}
          <View style={{ flexDirection: "row" }}>
            {TABS.map(({ name, label, Icon }) => {
              const focused = activeTab === name;
              return (
                <Pressable
                  key={name}
                  onPress={() =>
                    router.push({
                      pathname: `/(tabs)/group/[groupId]/${name}` as any,
                      params: { groupId },
                    })
                  }
                  style={{
                    flex: 1,
                    alignItems: "center",
                    paddingVertical: 10,
                    gap: 3,
                    borderBottomWidth: 2,
                    borderBottomColor: focused ? colors.accent : "transparent",
                  }}
                >
                  <Icon
                    size={18}
                    color={focused ? colors.accent : colors.textSecondary}
                  />
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: "700",
                      letterSpacing: 0.3,
                      color: focused ? colors.accent : colors.textSecondary,
                    }}
                  >
                    {label.toUpperCase()}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* ── Screen content ── */}
        <View style={{ flex: 1 }}>
          <Slot />
        </View>
      </View>
    </GroupShellProvider>
  );
}
