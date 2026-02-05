import { Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import ChatContainer from "@/components/group/ChatContainer";
import { API_BASE_URL } from "@/api/api";

type Params = {
  chatRoomId?: string;
  name?: string;
  avatar?: string;
};

export default function GroupChatScreen() {
  const router = useRouter();
  const { chatRoomId, name, avatar } = useLocalSearchParams<Params>();

  if (!chatRoomId || !name) {
    return <Text>Invalid chat</Text>;
  }

  const avatarUri = avatar
    ? `${API_BASE_URL}/files/${avatar}`
    : undefined;

  return (
    <ChatContainer
      chatRoomId={chatRoomId}
      name={name}
      avatarUri={avatarUri}
      onBack={router.back}
    />
  );
}
