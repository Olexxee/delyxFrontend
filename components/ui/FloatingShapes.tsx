import { Animated, Dimensions } from "react-native";
import { Shapes } from "@/theme/shapes";
import { Colors } from "@/theme/color";
import { useEffect, useRef } from "react";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const ShapeIcons: Record<string, string> = {
  circle: "⚪",
  square: "⬛",
  triangle: "🔺",
  x: "❌",
};

export function FloatingShapes({ count = 6 }) {
  const floatingShapes = useRef(
    Array.from({ length: count }).map(() => ({
      x: Math.random() * SCREEN_WIDTH,
      y: new Animated.Value(Math.random() * SCREEN_HEIGHT),
      scale: new Animated.Value(0.5 + Math.random() * 0.5),
      opacity: new Animated.Value(0.2 + Math.random() * 0.5),
      rotate: new Animated.Value(Math.random()),
      shape:
        Object.values(Shapes)[
          Math.floor(Math.random() * Object.values(Shapes).length)
        ],
    }))
  ).current;

  useEffect(() => {
    floatingShapes.forEach((shape) => {
      const animate = () => {
        Animated.parallel([
          Animated.timing(shape.y, {
            toValue: Math.random() * (SCREEN_HEIGHT - 100),
            duration: 4000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
          Animated.timing(shape.rotate, {
            toValue: Math.random(),
            duration: 6000 + Math.random() * 4000,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(shape.scale, {
              toValue: 0.8 + Math.random() * 0.3,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(shape.scale, {
              toValue: 0.5 + Math.random() * 0.5,
              duration: 2000,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(shape.opacity, {
            toValue: 0.1 + Math.random() * 0.5,
            duration: 4000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
        ]).start(() => animate());
      };
      animate();
    });
  }, []);

  return (
    <>
      {floatingShapes.map((shape, i) => (
        <Animated.Text
          key={i}
          style={{
            position: "absolute",
            fontSize: 48,
            color: Colors.primary + "55",
            opacity: shape.opacity,
            transform: [
              { translateX: shape.x },
              { translateY: shape.y },
              {
                rotate: shape.rotate.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", "360deg"],
                }),
              },
              { scale: shape.scale },
            ],
          }}
        >
          {ShapeIcons[shape.shape]}
        </Animated.Text>
      ))}
    </>
  );
}
