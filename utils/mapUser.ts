import type { User } from "@/types/auth";

export function mapApiUser(apiUser: any): User {
  return {
    id: apiUser.id,
    email: apiUser.email,
    username: apiUser.username,
    avatar:
      apiUser.profilePicture &&
      apiUser.profilePicture !== "Upload A picture"
        ? apiUser.profilePicture
        : null,
    role: apiUser.role,
    verified: apiUser.verified,
  };
}
