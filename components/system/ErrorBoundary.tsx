import React from "react";
import { View, Text } from "react-native";

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.error("UI Error:", error);
  }

  render() {
    if (this.state.hasError) {
      return null; // fail silently
    }
    return this.props.children;
  }
}
