import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import TaskModel from '../../../models/TaskModel';
import TreeNode from './TreeNode';

const { width, height } = Dimensions.get('window');

interface TreeProps {
    rootTask:TaskModel
    currentTask:TaskModel
}

const Tree: React.FC<TreeProps> = ({rootTask, currentTask}) => {

  const XOFFSET = 200
  const YOFFSET = 120
  const HALF_XOFFSET = XOFFSET/2
  
  const renderTree = () => {
    // Start from the root task and do BFS and push elements into an array that will be displayed with their offset determined by their level and the amount of nodes on the level
    const nodes: JSX.Element[] = [];
    const queue: { task: TaskModel; level: number }[] = [{ task: rootTask, level: 0 }];
    const xOffsetMap: Map<number, number> = new Map([[0,width/2]])

    while (queue.length > 0) {
      const { task, level } = queue.shift()!;

      const isCurrentTask = task.id === currentTask.id;

      nodes.push(
        <TreeNode
          key={task.id}
          task={task}
          style={{top:level*YOFFSET, left:xOffsetMap.get(level), position:'absolute'}}
        />
      );

      task.children?.forEach((child) => {
        queue.push({ task: child, level: level + 1 });

        xOffsetMap.set(level+1, xOffsetMap.get(level+1) != undefined ? xOffsetMap.get(level+1)! - HALF_XOFFSET - (HALF_XOFFSET/2)*(child.children.length) : xOffsetMap.get(level)! - (HALF_XOFFSET/2)*(child.children.length))
      });

      xOffsetMap.set(level, xOffsetMap.get(level)! + XOFFSET + (HALF_XOFFSET)*(task.children.length))
    }

    // Return array
    return nodes;
  }

  return (
    renderTree()
  );
};

export default Tree;