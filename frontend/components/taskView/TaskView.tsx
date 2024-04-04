import React from 'react';
import { View, StyleSheet, ViewStyle, useWindowDimensions, Text, TouchableHighlight } from 'react-native';
import { useFonts, Inter_500Medium } from '@expo-google-fonts/inter';
import { LinearGradient } from 'expo-linear-gradient';

import TaskModel from '../../models/TaskModel';
import MainController from '../../controllers/main/MainController';
import { Double } from 'react-native/Libraries/Types/CodegenTypes';
interface TaskViewProps {
  task: TaskModel;
  isLeft: Boolean;
}

const TaskView: React.FC<TaskViewProps> = ({ task, isLeft }) => {

  const controller = MainController.getInstance();

  const dependentStyle = () => {
    if (isLeft)
    {
        return StyleSheet.create({
            container: {
                flexDirection: 'row',
                borderBottomRightRadius: 20,
                borderTopRightRadius: 20,
                borderRightWidth: 3,
            }
        });
    }
  }

  return(
    <View style={{overflow:'hidden', minHeight:'100%'}}>
        <View style={isLeft ? styles.gradientOverlayL : styles.gradientOverlayR}>
            <LinearGradient
            colors={[task.color, darkenColor(task.color, 0.9)]}              
            style={styles.gradient}/>
        </View>
        <View style={[styles.container, isLeft ? styles.containerL : styles.containerR]}>
            {/* Circle with wire extending from it */}
            <View>
                
            </View>
            {/* Content */}
            <View>
                
            </View>
            {/* X and other page manipulation components */}
            <View>
                
            </View>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
    gradientOverlayL: {
        ...StyleSheet.absoluteFillObject,
        borderBottomRightRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
    },
    gradientOverlayR: {
        ...StyleSheet.absoluteFillObject,
        borderBottomLeftRadius: 20,
        borderTopLeftRadius: 20,
        overflow: 'hidden',
    },
    gradient: {
        flex: 1,
    },
    container: {
        backgroundColor: "#151515",
        zIndex: 1, 
        padding: 10,
        minWidth: '95%',
        minHeight: '100%'
    },
    containerL: {
        flexDirection: 'row',
        borderBottomRightRadius: 20,
        borderTopRightRadius: 20,
        marginRight: 3
    },
    containerR: {
        flexDirection: 'row-reverse',
        borderBottomLeftRadius: 20,
        borderTopLeftRadius: 20,
        marginLeft: 3
    }
  });

  function darkenColor(color:String, factor:Double) {
    // Convert hex color to RGB
    let hex = color.replace(/^#/, '');
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
  
    // Darken each RGB component
    r = Math.round(r * (1 - factor));
    g = Math.round(g * (1 - factor));
    b = Math.round(b * (1 - factor));
  
    // Ensure values are within range
    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));
  
    // Convert RGB back to hex
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
  }

export default TaskView;