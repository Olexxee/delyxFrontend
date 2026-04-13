import React from "react";
import { FlatList } from "react-native";
import type { ChatMessageVM } from "@/view-models/message.vm";
import { UserMessageBubble } from "./UserMessageBubble";
import { SystemMessageBubble } from "./SystemMessageBubble";

type Props = {
  messages: ChatMessageVM[];
  onSystemAction?: (tournamentId: string) => void;
  onEndReached?: () => void;
};

export function ChatMessageList({
  messages,
  onSystemAction,
  onEndReached,
}: Props) {
  return (
    <FlatList
      data={messages}
      keyExtractor={(item) => item.id}
      inverted
      renderItem={({ item }) => {
        if (item.kind === "system") {
          return (
            <SystemMessageBubble message={item} onAction={onSystemAction} />
          );
        }

        return <UserMessageBubble message={item} />;
      }}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.3}
      contentContainerStyle={{ padding: 12 }}
    />
  );
}
