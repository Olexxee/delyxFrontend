export const Shapes = {
  circle: "circle",
  square: "square",
  triangle: "triangle",
  x: "x",
} as const;

export type Shape = (typeof Shapes)[keyof typeof Shapes];

export const NEUTRAL_SHAPES: Shape[] = [
  Shapes.circle,
  Shapes.square,
  Shapes.triangle,
];

export const OUTCOME_SHAPES = {
  WIN: Shapes.triangle,
  LOSS: Shapes.x,
  DRAW: Shapes.circle,
};
