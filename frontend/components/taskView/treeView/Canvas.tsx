import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const Canvas: React.FC = () => {
  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const prevTranslationX = useSharedValue(0);
  const prevTranslationY = useSharedValue(0);
  const scale = useSharedValue(1);

  const [isHovered, setIsHovered] = useState(false);

  function clamp(val:number, min:number, max:number) {
    return Math.min(Math.max(val, min), max);
  }

  // Pan Gesture
  const panGesture = Gesture.Pan()
        .minDistance(1)
        .onStart(() => {
            prevTranslationX.value = translationX.value;
            prevTranslationY.value = translationY.value;
        })
        .onUpdate((event) => {
            const maxTranslateX = width / 2 - 50;
            const maxTranslateY = height / 2 - 50;

            translationX.value = clamp(
            prevTranslationX.value + event.translationX,
            -maxTranslateX,
            maxTranslateX
            );
            translationY.value = clamp(
            prevTranslationY.value + event.translationY,
            -maxTranslateY,
            maxTranslateY
            );
        })
        .runOnJS(true);

  // Pinch Gesture
  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = event.scale;
    })
    .onEnd(() => {
      scale.value = withSpring(Math.max(1, Math.min(scale.value, 3))); // Constrain scale between 1 and 3
    });

    

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (isHovered) {
        scale.value = withSpring(Math.max(0.5, Math.min(scale.value - event.deltaY * 0.001, 3))); // Adjust sensitivity here
      }
    };

    window.addEventListener('wheel', handleWheel);

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [isHovered, scale]);

  // Combine Pan and Pinch Gestures
  const composedGesture = Gesture.Simultaneous(panGesture, pinchGesture);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translationX.value },
        { translateY: translationY.value },
        { scale: scale.value },
      ],
    };
  });

  return (
    <div onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}>
        <GestureDetector gesture={composedGesture}>
        <Animated.View style={[styles.canvas, animatedStyle]}>
            {/* Add your interactive components here */}
            <View style={styles.box} />
            <View style={[styles.box, { top: 200, left: 200 }]} />
        </Animated.View>
        </GestureDetector>
    </div>
  );
};

const styles = StyleSheet.create({
  canvas: {
    width: width * 2,
    height: height * 2,
    overflow:'hidden'
  },
  box: {
    position: 'absolute',
    width: 100,
    height: 100,
    backgroundColor: 'lightblue',
    borderRadius: 8,
  },
});

export default Canvas;
