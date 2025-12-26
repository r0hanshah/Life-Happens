import React, { useEffect, useState } from 'react';
import TaskModel from '@/models/TaskModel';

const CircularProgressBar = ({ percentage, task }: {percentage:number, task:TaskModel })  => {
    // Calculate the radius, circumference, and stroke width
    const radius = 15;
    const strokeWidth = 2;
    const circumference = 2 * Math.PI * radius;
    
    // Calculate the progress value
    const [progress, setProgress] = useState(circumference - (percentage) * circumference)

    useEffect(()=>{
      setProgress(circumference - (task.getPercentCompleteness()) * circumference)
      console.log("Progress changed!")
    },[percentage])
    
    return (
      <div style={styles.container}>
        <svg height="40" width="40" style={{ transform: 'rotate(-90deg)' }}>
          {/* Draw the gradient background */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00ff00" />
              <stop offset="100%" stopColor="#00ff00" />
            </linearGradient>
          </defs>
          
          {/* Draw the background circle */}
          <circle
            cx="20"
            cy="20"
            r={radius}
            fill="none"
            stroke="#303030"
            strokeWidth={strokeWidth}
          />
          
          {/* Draw the progress bar */}
          <circle
            cx="20"
            cy="20"
            r={radius}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={progress}
          />
        </svg>
      </div>
    );
  };

  const styles: Record<string, React.CSSProperties> = {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
  };

  export default CircularProgressBar