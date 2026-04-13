import React, { createContext, useContext } from "react";
import type { GroupShellVM } from "@/view-models/group.vm";

type GroupShellContextValue = {
  shell: GroupShellVM;
};

const GroupShellContext = createContext<GroupShellContextValue | null>(null);

export function GroupShellProvider({
  shell,
  children,
}: {
  shell: GroupShellVM;
  children: React.ReactNode;
}) {
  return (
    <GroupShellContext.Provider value={{ shell }}>
      {children}
    </GroupShellContext.Provider>
  );
}

export function useGroupShell() {
  const value = useContext(GroupShellContext);

  if (!value) {
    throw new Error("useGroupShell must be used within GroupShellProvider");
  }

  return value;
}
