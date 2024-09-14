import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import TaskModel from '../../../models/TaskModel';
import TreeNode from './TreeNode';
import MainController from '../../../controllers/main/MainController';

const { width, height } = Dimensions.get('window');

const XOFFSET = 230
const YOFFSET = 120

const controller = MainController.getInstance()

interface TreeProps {
    rootTask:TaskModel
    currentTask:TaskModel
}

const Tree_RTA: React.FC<TreeProps> = ({rootTask, currentTask}) => {

  // 1. Assign initial X values to each node
function calculateInitialX(node: TaskModel): void {
  for (const child of node.children) {
      calculateInitialX(child);
  }

  if (!node.isLeftMost()) {
      const previousSibling = node.getPreviousSibling();
      if (previousSibling) {
          node.x = previousSibling.x + 1;
      }
  } else {
      node.x = 0;
  }

  // Center parent over its children
  if (node.children.length > 0) {
      const firstChild = node.getFirstChild();
      const lastChild = node.getLastChild();
      if (firstChild && lastChild) {
          const mid = (firstChild.x + lastChild.x) / 2;

          if (node.isLeftMost()) {
              node.x = mid;
          } else {
              node.mod = node.x - mid;
          }
      }
  }
}

// 2. Apply mod shifts to avoid overlapping of subtrees by calculating contours
function checkConflicts(node: TaskModel): void {
  const previousSibling = node.getPreviousSibling();
  if (previousSibling) {
      const shiftAmount = resolveContourConflicts(previousSibling, node);
      if (shiftAmount > 0) {
          applyShift(node, shiftAmount);
      }
  }

  for (const child of node.children) {
      checkConflicts(child);
  }
}

// Helper to apply a shift to a node and propagate it to all descendants
function applyShift(node: TaskModel, shiftAmount: number): void {
  node.x += shiftAmount;
  node.mod += shiftAmount;
}

// 3. Resolve contour conflicts between sibling subtrees
function resolveContourConflicts(leftNode: TaskModel, rightNode: TaskModel): number {
  const leftContour = getRightContour(leftNode);
  const rightContour = getLeftContour(rightNode);

  let maxOverlap = 0;

  for (const level in leftContour) {
      if (rightContour.hasOwnProperty(level)) {
          const overlap = leftContour[level] - rightContour[level];
          maxOverlap = Math.max(maxOverlap, overlap + 1); // Add spacing of 1
      }
  }

  return maxOverlap;
}

// Get the left contour of a subtree
function getLeftContour(node: TaskModel, modSum: number = 0, contour: Record<number, number> = {}, depth: number = 0): Record<number, number> {
  if (!(depth in contour)) {
      contour[depth] = node.x + modSum;
  } else {
      contour[depth] = Math.min(contour[depth], node.x + modSum);
  }

  modSum += node.mod;
  for (const child of node.children) {
      getLeftContour(child, modSum, contour, depth + 1);
  }

  return contour;
}

// Get the right contour of a subtree
function getRightContour(node: TaskModel, modSum: number = 0, contour: Record<number, number> = {}, depth: number = 0): Record<number, number> {
  if (!(depth in contour)) {
      contour[depth] = node.x + modSum;
  } else {
      contour[depth] = Math.max(contour[depth], node.x + modSum);
  }

  modSum += node.mod;
  for (const child of node.children) {
      getRightContour(child, modSum, contour, depth + 1);
  }

  return contour;
}

// 4. Calculate final X positions based on the mod values
function finalXPosition(node: TaskModel, modSum: number = 0): void {
  node.x += modSum;
  modSum += node.mod;
  for (const child of node.children) {
      finalXPosition(child, modSum);
  }
}

// 5. Adjust the tree if any nodes have negative X values (off-screen adjustment)
function adjustToFitOnScreen(root: TaskModel): void {
  const contour: Record<number, number> = {};
  getLeftContour(root, 0, contour);

  let shiftAmount = 0;
  for (const key in contour) {
      if (contour[key] + shiftAmount < 0) {
          shiftAmount = contour[key] * -1;
      }
  }

  if (shiftAmount > 0) {
      applyShift(root, shiftAmount);
  }
}

// Main Reingold-Tilford Algorithm
function reingoldTilford(root: TaskModel): void {
  // First traversal - Calculate initial X and Mod values
  calculateInitialX(root);

  // Resolve conflicts between sibling subtrees
  checkConflicts(root);

  // Adjust the tree to fit on the screen
  adjustToFitOnScreen(root);

  // Final pass to calculate X positions based on Mod values
  finalXPosition(root);
}

  const [rerender, setRerender] = useState(false)

  useEffect(()=>{
    const momentListener = controller.getReRender();

    const listener = (bool: boolean) => {
      setRerender(bool);
    };

    momentListener.addListener(listener)

    return () => {
      momentListener.removeListener(listener);
    };
  },[controller])

  useEffect(()=>{
    reingoldTilford(rootTask)
  },[rerender])
  
  // Example of rendering the tree nodes in React
  const renderTree = () => {
    // Start from the root task and do BFS and push elements into an array that will be displayed with their offset determined by their level and the amount of nodes on the level
    const nodes: JSX.Element[] = [];
    const queue: { task: TaskModel; level: number }[] = [{ task: rootTask, level: 0 }];
    const xOffsetMap: Map<number, number> = new Map([[0,width/2]])
    const selectedTask = controller.getSelectedTask().getValue()

    while (queue.length > 0) {
      const { task, level } = queue.shift()!;
      console.log(task.title, level, task.x)

      const inPath = selectedTask?.ancestors.some(ancestor => ancestor.id == task.id) || task.id == selectedTask?.id

      nodes.push(
        <TreeNode
          key={task.id}
          task={task}
          style={{top:level*YOFFSET + 200, left:task.x*XOFFSET + 800, position:'absolute'}}
          pathColor={inPath ? task.color : 'gray'}
        />
      );

      task.children?.forEach((child) => {
        queue.push({ task: child, level: level + 1 });
      });
    }

    // Return array
    return nodes;
  }

  return (
    renderTree()
  );
};

export default Tree_RTA;