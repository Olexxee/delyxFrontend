import React from "react";
import { View } from "react-native";

type Props = {
  header: React.ReactNode;
  contextStrip?: React.ReactNode;
  messageList: React.ReactNode;
  composer: React.ReactNode;
};

export function ChatThreadLayout({
  header,
  contextStrip,
  messageList,
  composer,
}: Props) {
  return (
    <View style={{ flex: 1 }}>
      {header}
      {contextStrip}
      <View style={{ flex: 1 }}>{messageList}</View>
      {composer}
    </View>
  );
}
