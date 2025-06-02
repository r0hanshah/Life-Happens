import React from 'react';
import style from '@/styles/components/main/rootTaskList/listItem.module.css'
import TouchableOpacity from '@/pages/native/TouchableOpacity';
import { Inter } from 'next/font/google'
import TaskModel from '@/models/TaskModel';

import MainController from '@/controllers/main/MainController';
import CircularProgressBar from '../../taskView/CircularProgressView';

interface ListItemProps
{
    rootTask: TaskModel
    leftBound: boolean
    index:number
    lowerDate:Date
    higherDate:Date
}

const ListItem: React.FC<ListItemProps> = ({ rootTask, leftBound, index, lowerDate, higherDate }) => 
{
    const controller = MainController.getInstance();

    let display = controller.getDisplay().getValue()

    leftBound = display == 2 ? true : leftBound

    const windowWidth = window.global.innerWidth;

    const getNumberOfLeafTasksBefore = (node:TaskModel) => {
        if (node.children.length === 0 && node.startDate < lowerDate) {
            return 1;
          }
          
          // Initialize count for leaf nodes before the given date
          let count = 0;
        
          // Recursively check each child node
          for (const child of node.children) {
            count += getNumberOfLeafTasksBefore(child);
          }
        
          return count;
    }
    
    const getNumberOfLeafTasksAfter = (node:TaskModel) => {
        if (node.children.length === 0 && node.startDate > higherDate) {
            return 1;
          }
          
          // Initialize count for leaf nodes before the given date
          let count = 0;
        
          // Recursively check each child node
          for (const child of node.children) {
            count += getNumberOfLeafTasksAfter(child);
          }
        
          return count;
    }

    const Inter_500Medium = Inter({
        weight: '500'
    })

    return (
        

            <div  key={rootTask.id} style={{height: 50, width: "auto", flexDirection: "row", overflow:"visible", marginBottom: 10, justifyContent: leftBound ? "flex-start" : "flex-end"}}>

                {/* <div style={{width: 2, height: 195 + index * 60, backgroundColor: rootTask.color, bottom: 168 + index * 60, display: leftBound ? "flex": "none"}}/> */}
                <div style={{width: windowWidth*(display == 2 ? 0.009 : 0.018), height: 2, backgroundColor: "rgba(255,255,255,0)", marginTop: 25, marginLeft:1, display: leftBound ? "flex": "none"}}/>

                    <TouchableOpacity style={{borderRadius: 25}} onClick={() => controller.setSelectedTask(rootTask)}>
                        
                        <div className={style.container} style={{flexDirection: leftBound ? 'row' : 'row-reverse', width: windowWidth * (display == 2 ? 0.80 : 0.395), justifyContent: "flex-start"}}>

                            <>
                                <div className={style.circle} style={{backgroundColor: rootTask.color, display: "flex"}}/>

                                <p className={Inter_500Medium.className} style={{
                                    color: '#fff',
                                }}>{rootTask.title}</p>
                            </>

                            <div style={{flexDirection:'row', marginInline:50, alignItems:'center'}}>
                                <p className={style.circle} style={{
                                    color: '#fff',
                                    marginInline:5
                                }}>{getNumberOfLeafTasksBefore(rootTask)}</p>
                                <img src={require('@/assets/triangle_right.png')} style={{
                                    width:20, height:20, opacity: 0.2, marginInline:5, transform: 'rotate(180deg)'
                                }}/>

                                {windowWidth > 800 && 
                                    <div style={{flexDirection: 'row', marginInline: 10, alignItems:'center'}}>

                                        <CircularProgressBar percentage={rootTask.getPercentCompleteness()} task={rootTask}/>

                                        <p style={{color: 'gray', fontSize:10}}>{(rootTask.getPercentCompleteness()*100).toFixed(1)}%</p>

                                    </div>
                                }
                            
                                <img src={require('@/assets/triangle_right.png')} style={{
                                    width:20, height:20, opacity: 0.2, marginInline:5
                                }}/>
                                <p className={Inter_500Medium.className} style={{
                                    color: '#fff',
                                    marginInline:5
                                }}>{getNumberOfLeafTasksAfter(rootTask)}</p>
                            </div>
                        </div>

                    </TouchableOpacity>

                <div style={{width: windowWidth*0.018, height: 2, backgroundColor: "rgba(255,255,255,0)", marginTop: 25, marginRight:1, display: !leftBound ? "flex": "none"}}/>

            </div>
    )
}

export default ListItem