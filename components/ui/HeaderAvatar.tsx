import React from "react";
import { View } from "react-native";
import { Avatar } from "@/components/ui/Avatar";

interface HeaderAvatarProps {
  avatarUri?: string;
  size?: number;
}

export function HeaderAvatar({ avatarUri, size = 44 }: HeaderAvatarProps) {
  return (
    <View>
      <Avatar uri={avatarUri || ""} size={size} />
    </View>
  );
}
