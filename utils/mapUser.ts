import type { User } from "@/types/auth";

export function mapApiUser(apiUser: any): User {
  const id = String(apiUser?.id ?? apiUser?._id ?? "");
  const rawRole = String(apiUser?.role ?? "USER").toLowerCase();
  return {
    id,
    _id: id,
    email: String(apiUser?.email ?? ""),
    username: String(apiUser?.username ?? apiUser?.name ?? ""),
    avatar:
      apiUser?.avatar && apiUser.avatar !== "Upload A picture"
        ? apiUser.avatar
        : apiUser?.profilePicture && apiUser.profilePicture !== "Upload A picture"
          ? apiUser.profilePicture
          : undefined,
    role: rawRole === "admin" ? "admin" : "user",
    verified: Boolean(apiUser?.verified ?? apiUser?.isVerified ?? false),
  };
}
