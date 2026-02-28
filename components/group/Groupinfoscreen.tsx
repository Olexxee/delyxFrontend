import { useGroupInfo } from "@/api/groups.api";
import { useLocalSearchParams, useRouter } from "expo-router";
import { GroupInfoView } from "./GroupInfoView";


export default function GroupInfoScreen() {
    const router = useRouter();
    const { groupId } = useLocalSearchParams<{ groupId: string }>();
    const { data: group, isLoading } = useGroupInfo(groupId);
    console.log("Route groupId:", groupId);

    if (isLoading || !group) return null;

    return (
        <GroupInfoView
            group={group}
            onBack={() => router.back()}
            showHeader
        />
    );
}