import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useRouter } from "expo-router";
import { useGroupShell } from "@/authContext/GroupShellContext";

export default function GroupChatResolverScreen() {
  const router = useRouter();
  const { shell } = useGroupShell();

  useEffect(() => {
    if (!shell.chatRoomId) return;

    router.replace({
      pathname: "/(chats)/[chatRoomId]",
      params: { chatRoomId: shell.chatRoomId },
    });
  }, [router, shell.chatRoomId]);

  return (
    <View className="flex-1 items-center justify-center bg-black">
      <ActivityIndicator />
    </View>
  );
}