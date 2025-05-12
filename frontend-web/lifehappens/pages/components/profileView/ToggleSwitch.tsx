import { useEffect, useState } from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

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
    <TouchableOpacity onPress={handleToggle} style={{width:40, height:20, borderRadius:10, backgroundColor: isOn ? "#1ecbe1" : "#303030", zIndex:999}}>
        <View style={[
            {
                position:'absolute', 
                width:22, 
                height:22, 
                borderRadius:11, 
                shadowOpacity:0.5, 
                shadowOffset: { width: 5, height: 5 },
                backgroundColor: 'white',
                opacity:disable ? 0.5 : 1,
                marginBottom: 1
            }, 
                isOn ? {right: 0} : {left:0}
                ]}></View>
    </TouchableOpacity>
  );
}