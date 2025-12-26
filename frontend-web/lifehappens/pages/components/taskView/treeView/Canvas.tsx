import React, { useEffect, useState, useRef } from 'react';
import TaskModel from '@/models/TaskModel';
import Tree_RTA from './Tree_RTA';

interface CanvasProps {
    rootTask:TaskModel
    currentTask:TaskModel
}

const Canvas: React.FC<CanvasProps> = ({rootTask, currentTask}) => {
  const [translationX, setTranslationX] = useState(0);
  const [translationY, setTranslationY] = useState(0);
  const [scale, setScale] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const clamp = (val: number, min: number, max: number) => {
    return Math.min(Math.max(val, min), max);
  };

  // Handle mouse wheel for zooming
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (isHovered && canvasRef.current) {
        event.preventDefault();
        const newScale = clamp(scale - event.deltaY * 0.001, 0.5, 3);
        setScale(newScale);
      }
    };

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener('wheel', handleWheel);
      }
    };
  }, [isHovered, scale]);

  // Handle pan (drag)
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    setPanStart({ x: e.clientX - translationX, y: e.clientY - translationY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      const maxTranslateX = window.innerWidth / 2 - 50;
      const maxTranslateY = window.innerHeight / 2 - 50;

      const newX = clamp(e.clientX - panStart.x, -maxTranslateX, maxTranslateX);
      const newY = clamp(e.clientY - panStart.y, -maxTranslateY, maxTranslateY);

      setTranslationX(newX);
      setTranslationY(newY);
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleCanvasMouseLeave = () => {
    setIsHovered(false);
    setIsPanning(false);
  };

  return (
    <div 
      ref={canvasRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleCanvasMouseLeave}
      style={{
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        cursor: isPanning ? 'grabbing' : 'grab',
        backgroundColor: '#1a1a1a'
      }}
    >
      <div
        style={{
          transform: `translate(${translationX}px, ${translationY}px) scale(${scale})`,
          transformOrigin: 'center',
          transition: isPanning ? 'none' : 'transform 0.3s ease',
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          position: 'relative'
        }}
      >
        {/* Generate Tree Here */}
        <Tree_RTA rootTask={rootTask} currentTask={currentTask} />
      </div>
    </div>
  );
};

export default Canvas;
