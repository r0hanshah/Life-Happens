import { useEffect, useState } from "react";

interface ToggleSwitchProps {
  state: boolean;
  onToggle: (on:boolean) => void;
  disable: boolean;
}

export default function ToggleSwitch({
  state,
  onToggle,
  disable,
}: ToggleSwitchProps) {
  const [isOn, setIsOn] = useState(state);

  useEffect(()=>{setIsOn(state)},[state])

  const handleToggle = () => {
    if (!disable)
    {
        const newState = !isOn;
        setIsOn(newState);
        onToggle(newState);
    }
  };

  return (
    <button 
      onClick={handleToggle} 
      style={{
        width:40, 
        height:20, 
        borderRadius:10, 
        backgroundColor: isOn ? "#1ecbe1" : "#303030", 
        zIndex:999,
        border: 'none',
        cursor: disable ? 'not-allowed' : 'pointer',
        position: 'relative',
        padding: 0
      }}
    >
        <div style={{
            position:'absolute', 
            width:22, 
            height:22, 
            borderRadius:'50%', 
            boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.5)',
            backgroundColor: 'white',
            opacity: disable ? 0.5 : 1,
            marginBottom: 1,
            transition: isOn ? 'right 0.3s ease' : 'left 0.3s ease',
            ...(isOn ? {right: 0} : {left: 0})
        }}/>
    </button>
  );
}