// BorderComponent.tsx
import React from 'react';
import style from '@/styles/components/main/wireframe/borderComponent.module.css'

interface BorderComponentProps {
  id: string;
  colorQueue: Array<[string, number, string, boolean, boolean?, boolean?]>;
  orientation: 'horizontal' | 'vertical'; // Specify the valid values for orientation
  lastRow: boolean;
  numberOfRows: number
}

const BorderComponent: React.FC<BorderComponentProps> = ({ colorQueue, orientation, lastRow }) => {
  const windowWidth = window.global.innerWidth;
  const windowHeight = 630;

  const renderBorders = () => {
    return colorQueue.map((value, index) => {
      let backgroundColor = value[0], 
          amountFill = value[1] , 
          rootTaskId = value[2], 
          leftBound = value[3], 
          placedInlastRow= value[4] ? value[4] : false ,
          pointLeft = value[5] ? value[5] : false

      const containerStyle = orientation === 'horizontal' ? (leftBound? style.HLContainer : style.HRContainer) : style.VContainer
      const zIndex = -(index + 1); // Set zIndex to stack borders

      const existsInLastRowOnly = amountFill < 0
      amountFill = Math.abs(amountFill)

      return (
        <div key={`cont${index}`} className={containerStyle} style={{
          width: '100%',
          height: '100%',
          justifyContent: lastRow ? "flex-start" : "center", ...(placedInlastRow && orientation === 'vertical' ? {alignItems:'flex-end'} : orientation === 'vertical' ? {alignItems: 'center', flexDirection:'column'} : {})}}>
          {/* Empty space for when drawing vertical lines */}
          <div style={{
            height: orientation==='vertical'? lastRow ? ((windowHeight / 6) * 0.9 + 50)*(1-amountFill < 0 ? 0 : 1-amountFill) : ((windowHeight / 6) * 0.9)*(1-amountFill) : 2,
            display: orientation==='vertical'? 'flex' : 'none'
          }} />
          {/* The actual wire being drawn */}
          <div
            key={index}
            style={
              {
                zIndex:zIndex,
                position: orientation==='horizontal' ? 'absolute' : 'relative',
                backgroundColor: backgroundColor,
                width: orientation === 'horizontal' ? ((windowWidth / 7) * 0.83)*(leftBound ? amountFill : amountFill==1 ? 1 :  1-amountFill) + (amountFill == 1 ? 2 : 0) : 2,
                height: orientation === 'vertical' ?  lastRow ? ((windowHeight / 6)* 0.9)*amountFill + 50 : ((windowHeight / 6) * 0.9)*amountFill : 2,
                top: orientation ==='vertical'? lastRow && amountFill <= 1 ? -48*(1-amountFill): 0: 2
              ,
              ...(existsInLastRowOnly ? {top: 144.5} : {})
              }}
          />
          {/* Wire that connects the rest of the wire to the day it belongs to */}
          {
            amountFill < 1 &&
            <div
            key={index + 0.5}
            style={{
                zIndex: zIndex,
                position: 'absolute',
                backgroundColor: backgroundColor,
                width: orientation === 'horizontal' ? 2 : 20,
                height: orientation === 'vertical' ?  2 : 20 + (lastRow ? 50: 0),
                top: existsInLastRowOnly ? 144.5 : orientation ==='vertical'? lastRow ? -48*(1-amountFill) : ((windowHeight / 6) * 0.9)*(1-amountFill) : -16 - (lastRow ? 50: 0),
                ...(orientation == 'vertical' ? pointLeft ? {right:2} : {left:2} : leftBound ? {left: ((windowWidth / 7) * 0.83)*(leftBound ? amountFill : amountFill==1 ? 1 :  1-amountFill) + (amountFill == 1 ? 2 : 0)} : {right: ((windowWidth / 7) * 0.83)*(leftBound ? amountFill : amountFill==1 ? 1 : 1-amountFill) + (amountFill == 1 ? 2 : 0)})
            }}
            />
          }
          {/* Wire that connects the rest to the task it belongs to */}
          {
            lastRow && orientation === 'vertical' &&
            <div
            key={index + 0.9}
            style ={{
                zIndex: zIndex,
                position: 'absolute',
                backgroundColor: backgroundColor,
                width: 100,
                height: 2,
                top: ((windowHeight / 6)* 0.9)*amountFill + 50 + (existsInLastRowOnly ? 144.5 : 0),
                ...(leftBound ? {left:0} : {right:0})
            }}
            />
          }
        </div>
      );
    });
  };

  const containerStyle: React.CSSProperties = {
    width: orientation === 'horizontal' ? (windowWidth / 7) * 0.83 : 2,
    height: orientation === 'vertical' && lastRow 
      ? (windowHeight / 6) * 0.9 + 50 
      : orientation === 'vertical' 
      ? (windowHeight / 6) * 0.9 
      : 2,
    position: 'relative'
  };

  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    zIndex: -999,
    backgroundColor: 'rgba(255, 255, 255, 0)',
    width: orientation === 'horizontal' ? (windowWidth / 7) * 0.83 : 2,
    height: orientation === 'vertical' && lastRow
      ? (windowHeight / 6) * 0.9 + 50
      : orientation === 'vertical'
      ? (windowHeight / 6) * 0.9
      : 2,
    top: 2
  };

  return (
    <div style={containerStyle}>
      {renderBorders()}
      <div key='base' style={baseStyle} />
    </div>
  );
};

export default BorderComponent;