import React, { useEffect, useState } from 'react';
import TaskModel from '@/models/TaskModel';
import CircularProgressBar from '../CircularProgressView';
import MainController from '@/controllers/main/MainController';

interface TreeNodeProps {
    style?: React.CSSProperties
    task: TaskModel
    pathColor: string
}

const TreeNode: React.FC<TreeNodeProps> = ({ task, style, pathColor }) => {
  const mainController = MainController.getInstance()
  const x_offset = 109.5

  const handleClick = () => {
    mainController.setSelectedTask(task)
  }

  const verticalLineColor = task.id == mainController.getSelectedTask().getValue()?.id ? 'gray' : pathColor;

  return (
    <button 
      onClick={handleClick}
      style={{
        ...style,
        width: 220,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#383838',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: pathColor != 'gray' ? 999 : 1,
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        position: 'relative',
      }}
    >
      {/* Vertical line from parent */}
      {task.ancestors.length > 0 && (
        <>
          <div style={{
            position: 'absolute',
            width: 1,
            height: 40,
            bottom: 40,
            backgroundColor: pathColor,
            left: '50%',
            transform: 'translateX(-50%)',
          }} />
          
          {/* Horizontal line to parent */}
          <div style={{
            position: 'absolute',
            width: Math.abs(task.ancestors[0].x - task.x) * 230 + 0.5,
            height: 1,
            bottom: 80,
            backgroundColor: pathColor,
            ...(task.ancestors[0].x < task.x
              ? { right: x_offset }
              : { left: x_offset }),
          }} />
        </>
      )}

      {/* Color indicator dot */}
      <div style={{
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: task.color,
        margin: '0 10px',
        flexShrink: 0,
      }} />
      
      {/* Task title */}
      <span style={{
        color: '#fff',
        fontFamily: 'Arial, sans-serif',
        maxWidth: 120,
        fontSize: 10,
        flex: 1,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>
        {task.title}
      </span>

      {/* Progress section */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        margin: '0 20px',
        padding: 10,
        alignItems: 'center',
        gap: 5,
      }}>
        <CircularProgressBar percentage={task.getPercentCompleteness()} task={task} />
        <span style={{
          color: 'gray',
          fontSize: 10,
          minWidth: 35,
        }}>
          {(task.getPercentCompleteness() * 100).toFixed(1)}%
        </span>
      </div>

      {/* Vertical line to children */}
      {task.children.length > 0 && (
        <div style={{
          position: 'absolute',
          width: 1,
          height: 40,
          top: 40,
          backgroundColor: verticalLineColor,
          left: '50%',
          transform: 'translateX(-50%)',
        }} />
      )}
    </button>
  );
};

export default TreeNode;