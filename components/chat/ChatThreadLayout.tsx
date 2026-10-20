import React from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? insets.top : 0}
    >
      <View style={{ flex: 1 }}>
        {header}
        {contextStrip}
        <View style={{ flex: 1 }}>{messageList}</View>
        {composer}
      </View>
    </KeyboardAvoidingView>
  );
}
