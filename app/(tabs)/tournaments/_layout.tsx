import { Stack } from "expo-router";

export default function TournamentStack() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="[tournamentId]" />
        </Stack>
    );
}