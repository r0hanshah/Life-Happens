import React from 'react';

interface LinearGradientProps {
  colors: [string, string];
  style?: React.CSSProperties;
  children?: React.ReactNode;
  direction?: 'to bottom' | 'to top' | 'to right' | 'to left';
}

const LinearGradient: React.FC<LinearGradientProps> = ({
  colors,
  style = {},
  children,
  direction = 'to bottom',
}) => {
  const gradientStyle: React.CSSProperties = {
    background: `linear-gradient(${direction}, ${colors[0]}, ${colors[1]})`,
    width: '100%',
    height: '100%',
    ...style,
  };

  return <div style={gradientStyle}>{children}</div>;
};

export default LinearGradient;