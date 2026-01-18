import { FeedItem } from "@/constants/mockFeed";
import { NEUTRAL_SHAPES, OUTCOME_SHAPES, Shape } from "@/theme/shapes";

function randomShape(): Shape {
  return NEUTRAL_SHAPES[Math.floor(Math.random() * NEUTRAL_SHAPES.length)];
}

export function resolveAvatarShapes(item: FeedItem) {
  // RESULT → deterministic for your avatar
  if (item.type === "RESULT") {
    return {
      your: OUTCOME_SHAPES[item.outcome ?? "DRAW"],
      opponent: randomShape(),
    };
  }

  // FIXTURE & LIVE → both avatars random
  return {
    your: randomShape(),
    opponent: randomShape(),
  };
}
