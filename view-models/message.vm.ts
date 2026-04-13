export type ChatMessageVM =
  | {
      kind: "user";
      id: string;
      content: string | null;
      mediaCount: number;
      isMine: boolean;
      senderName: string | null;
      createdAt: string;
      deliveryState?: "sending" | "sent" | "failed";
    }
  | {
      kind: "system";
      id: string;
      content: string;
      createdAt: string;
      action:
        | null
        | {
            type: "open_tournament";
            tournamentId: string;
            label: string;
          };
    };  