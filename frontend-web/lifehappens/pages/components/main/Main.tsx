import React, { useEffect, useState, useRef } from 'react';
import WireFrame from './wireframe/WireFrame';
import TaskModel from '@/models/TaskModel';
import moment from 'moment';
import RootTaskList from './rootTaskList/RootTaskList';
import TaskView from '../taskView/TaskView';
import ProfileView from '../profileView/ProfileView';

import MainController from '@/controllers/main/MainController';
import UserModel from '@/models/UserModel';

import DeleteAccount from './deleteAccount/DeleteAccount';
import EditAccount from './editAccount/EditAccount';

interface Tasks {
    rootTasks: TaskModel[]; // Only root tasks
    signOut: ()=>void;
}

const DEBUG = false

const Main: React.FC<Tasks> = ({signOut}) => {

  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
  const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 768;
  const tempUser = new UserModel("guy", "Super Guy", "", "superGuy@ufl.edu")

  const controller = MainController.getInstance();
  var selectedTask = controller.getSelectedTask();

  const [blurVisible, setBlurVisible] = useState(false);
  const [editAccount, setEditAccount] = useState(false);

  const [reRender, setReRender] = useState<boolean>(false)

  const [task, setTask] = useState<TaskModel | null>(null);
  const [slideTranslateX, setSlideTranslateX] = useState(0);
  const [slideProfileTranslateX, setSlideProfileTranslateX] = useState(0);

  const [rootTasks, setRootTasks] = useState<TaskModel[]>([]);
  const [profileClicked, setProfileClicked] = useState(false);

  const [displayType, setDisplayType] = useState(0);

  // Update display type
  useEffect(()=>{
    const displayListener = controller.getDisplay();

    const listener = (display: number) => {
      setDisplayType(display);
    };

    displayListener.addListener(listener)

    return () => {
      displayListener.removeListener(listener);
    };
  }, [controller])

  // Load in tasks on appear
  useEffect(() => {
    console.log('Number of tasks', controller.getTasks().getValue().length)
    if (DEBUG) {
      controller.setUser(tempUser)
      setRootTasks([])
    }
    else{
      loadRootTasks()
    }
  }, [controller])

  // Load in tasks
  const loadRootTasks = () =>
  {
    const tasks: TaskModel[] = controller.getTasks().getValue()
    setRootTasks(tasks)
    // Load based off the month
    //TODO: Filter out the tasks that match the month and year
  }

  // Animation
  const slideFromLeft = slideTranslateX;

  // Update tasks array
  useEffect(()=>{
    const taskListener = controller.getTasks();

    const listener = (tasks: TaskModel[]) => {
      setRootTasks(tasks);
    };

    taskListener.addListener(listener)

    return () => {
      taskListener.removeListener(listener);
    };
  }, [controller])

  // Update counter state when counterProperty changes
  useEffect(() => {
    const taskListener = controller.getSelectedTask();

    const listener = (task: TaskModel | null) => {
      setTask(task);
    };

    taskListener.addListener(listener)

    return () => {
      taskListener.removeListener(listener);
    };
  }, [controller]);

  // Rerender the page
  useEffect(() => {
    const renderListener = controller.getReRender();

    const listener = (bool: boolean) => {
      setReRender(bool);
    };

    renderListener.addListener(listener)

    return () => {
      renderListener.removeListener(listener);
    };
  }, [controller]);

  useEffect(() => {
    console.log("Running from rerender")
    const orderedMaps = getAllLeafNodes(rootTasks)
    setLeafNodesMap(orderedMaps[0]);
    setRootTaskMap(orderedMaps[1])
  }, [reRender])

  const [leafNodesMap, setLeafNodesMap] = useState<{[key:string]:TaskModel[]}>({});
  const [rootTaskMap, setRootTaskMap] = useState<{[key:string]:TaskModel[]}>({ // O for left bound root tasks and 1 for right bound root tasks
    "0":[],
    "1":[]
  });

  const [currentMonth, setCurrentMonth] = useState(moment());

  useEffect(()=>{
    const momentListener = controller.getMoment();

    const listener = (moment: moment.Moment) => {
      setCurrentMonth(moment);
    };

    momentListener.addListener(listener)

    return () => {
      momentListener.removeListener(listener);
    };
  },[controller])

  const [weekNumber, setWeekNumber] = useState(1);
  
  useEffect(()=>{
    const firstDayOfDisplay = currentMonth.clone().startOf('month').startOf('week');
    const lastDayOfCurrentWeek = currentMonth.clone().endOf('week')
    const diff = lastDayOfCurrentWeek.diff(firstDayOfDisplay, 'days') + 1

    setWeekNumber(diff/7)

  },[currentMonth])

  const fontsLoaded = true; // Fonts are loaded by Next.js automatically
    
  // Extract leaf nodes from root tasks with breadth first search
    const getAllLeafNodes=(rootTasks:TaskModel[]):[{ [key: string]: TaskModel[]}, { [key: string]: TaskModel[]}] =>
    {
      var allLeafNodes:{[key:string]:TaskModel[]} = {}
      var sidedRootTasks:{ [key: string]: TaskModel[]} = {
        "0":[],
        "1":[]
      }

      for(var rootTask of rootTasks)
      {
        const leafNodes:TaskModel[] = bfsTree(rootTask)

        const key = (leafNodes:TaskModel[], parentId:string): string =>
        {
          var sum:number = 0
          var count:number = 0
          for(const node of leafNodes)
          {
            sum += node.startDate.getDay()
            count += 1
          }
          const average = sum / count
          rootTask.isLeft = average <= 3
          sidedRootTasks[average > 3 ? "0":"1"].push(rootTask)
          return parentId + ":::" + (average > 3 ? "0":"1")
        }

        allLeafNodes[key(leafNodes, rootTask.id)] = leafNodes
      }

      return [allLeafNodes, sidedRootTasks]
    }

    const bfsTree=(root:TaskModel):TaskModel[] =>
    {
      var q:TaskModel[] = []
      var leafNodes:TaskModel[] = []

      q.push(root)

      while(q.length != 0)
      {
        var observedNode:TaskModel = q[0]
        if(observedNode.children.length == 0)
        {
          leafNodes.push(observedNode)
        }
        else
        {
          for(const child of observedNode.children)
          {
            q.push(child)
          }
        }
        q.shift()
      }

      return leafNodes
    }

    function getOrdinalSuffix(day: number): string {
      if (day > 3 && day < 21) return 'th'; // for 11th to 20th
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    }
    
    function formatDate(date: Date): string {
      const day = date.getDate();
      const dayWithSuffix = day + getOrdinalSuffix(day);
      
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long', // e.g., Monday
        month: 'short',  // e.g., Sep
        year: 'numeric', // e.g., 2024
      };
      
      const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
      
      // Construct the final formatted string
      return `${formattedDate.split(",")[0]} ${dayWithSuffix}, ${formattedDate.split(",")[1].trim()}`;
    }

    // Set all leaf nodes
    useEffect(() => {
      console.log("Running use effect")
      const orderedMaps = getAllLeafNodes(rootTasks)
      setLeafNodesMap(orderedMaps[0]);
      setRootTaskMap(orderedMaps[1])
    }, [rootTasks]);

    useEffect(() => {
      if (task) {
        setSlideTranslateX(windowWidth * 0.49);
      } else {
        setSlideTranslateX(0);
      }
    }, [task, windowWidth]);

    useEffect(() => {
      if (profileClicked) {
        setSlideProfileTranslateX(windowWidth * 0.49);
      } else {
        setSlideProfileTranslateX(0);
      }
    }, [profileClicked, windowWidth]);

    const scrollY = 0; // Simple scroll state for React web

    return (
      <div style={{flex: '1', width:'100%', display: 'flex', flexDirection: 'column', position: 'relative'}}>
        
        {/* Slide in view for task */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            height: '100vh',
            width: task ? windowWidth * 0.49 : 0,
            [task && task.isLeftBound() ? 'right' : 'left']: 0,
            backgroundColor: 'white',
            overflow: 'auto',
            transition: 'width 0.3s ease',
            zIndex: 100
          }}
        >
          {task && <TaskView task={task} isLeft={!task.isLeftBound()} onPress={()=>{controller.setSelectedTask(null)}}/>}
        </div>

        {/* Slide in view for profile */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100vh',
            width: profileClicked ? windowWidth * 0.49 : 0,
            backgroundColor: 'white',
            overflow: 'auto',
            transition: 'width 0.3s ease',
            zIndex: 100
          }}
        >
          {profileClicked && 
          <ProfileView 
            user={controller.getUser().getValue()!} 
            onPress={()=>{setProfileClicked(false)}} 
            signOut={()=>{
            localStorage.removeItem('authToken');
              signOut();
            }} 
            deletAccount={()=>{setBlurVisible(true)}} 
            editAccount={()=>{setEditAccount(true)}}
          />}
        </div>

        {/* Blur overlay for delete account */}
        {blurVisible && (
          <div style={{
            position: 'fixed',
            zIndex: 999,
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            display: 'flex',
            justifyContent:'center',
            alignItems:'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }}>
            <DeleteAccount cancel={()=>{setBlurVisible(false)}} user={controller.getUser().getValue()!} deleteAccount={signOut}/>
          </div>
        )}

        {/* Blur overlay for edit account */}
        {editAccount && (
          <div style={{
            position: 'fixed',
            zIndex: 999,
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            display: 'flex',
            justifyContent:'center',
            alignItems:'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }}>
            <EditAccount cancel={()=>{setEditAccount(false)}} user={controller.getUser().getValue()!} saveChanges={signOut}/>
          </div>
        )}
        
        <div style={{width:"100%", paddingBottom:'80px', overflow: 'auto', flex: 1}}>
          <div style={{display: 'flex', flexDirection: 'row', marginLeft:'9%', marginRight: '9%', paddingTop: 80, justifyContent:'space-between', zIndex:99, alignItems: 'center'}}>
            <div style={{display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center'}}>

              {displayType > 0 ? 
              <button style={{ backgroundColor:'#303030', width:50, height:50, borderRadius:40, display: 'flex', justifyContent:'center', alignItems:'center', marginRight:10, border: 'none', cursor: 'pointer'}} onClick={()=>{
                controller.setDisplay(0)
                }}>
                <img src={require('../../assets/calendar_icon.png').default || require('../../assets/calendar_icon.png')} style={{
                  width:30, height:30, opacity: 0.5
                }}/>
              </button>
              : null}

              {displayType > 1 ? 
              <button style={{ backgroundColor:'#303030', width:50, height:50, borderRadius:40, display: 'flex', justifyContent:'center', alignItems:'center', marginRight:10, border: 'none', cursor: 'pointer'}} onClick={()=>{
                controller.setMoment(currentMonth.clone().endOf('week'))
                controller.setDisplay(1)
                }}>
                <img src={require('../../assets/week_icon.png').default || require('../../assets/week_icon.png')} style={{
                  width:30, height:30, opacity: 0.5
                }}/>
              </button>
              : null}

              {/* Month navigation */}

              <button onClick={()=>{
                controller.setMoment(moment(currentMonth).subtract(1, displayType == 1 ? 'weeks' : displayType == 2 ? 'days' : 'months'));
                controller.setReRender(controller.getReRender().getValue() ? false : true)
                }} style={{border: 'none', backgroundColor: 'transparent', cursor: 'pointer'}}>
                <img src={require('../../assets/chev_white.png').default || require('../../assets/chev_white.png')} style={{width:30, height:20, transform:'rotate(90deg)'}}/>
              </button>
              
              <h1 style={{color:'white', fontSize:60, marginLeft: 20, marginRight: 20, margin: '0 20px', fontWeight: 900}}>
                {currentMonth.format( displayType == 1 ? 'MMM YYYY' : displayType == 2? 'dddd Do, MMM YYYY' :  'MMMM YYYY')}
                {displayType == 1 ? ' - Week ' + weekNumber : ''}
              </h1>

              <button onClick={()=>{
                controller.setMoment(moment(currentMonth).add(1, displayType == 1 ? 'weeks' : displayType == 2 ? 'days' : 'months'));
                controller.setReRender(controller.getReRender().getValue() ? false : true)
                }} style={{border: 'none', backgroundColor: 'transparent', cursor: 'pointer'}}>
                <img src={require('../../assets/chev_white.png').default || require('../../assets/chev_white.png')} style={{width:30, height:20, transform:'rotate(-90deg)'}}/>
              </button>

              <button style={{backgroundColor:'#303030', borderRadius:10, width:80, height:40, display: 'flex', alignItems:'center', justifyContent:'center', marginLeft:20, border: 'none', cursor: 'pointer'}} onClick={
                ()=>{
                  controller.setMoment(displayType==1? moment(new Date()).endOf('week') : moment(new Date()))
                  controller.setReRender(controller.getReRender().getValue() ? false: true)
                }
              }>
                <span style={{color:'#717171', fontWeight: 900, fontSize:20}}>Today</span>
              </button>
            </div>
            

            <button style={{display: 'flex', justifyContent:'center', alignItems:'center', height: 80, width: 80, backgroundColor:'orange', borderRadius:50, border: 'none', cursor: 'pointer'}}
            onClick={()=>{
              setProfileClicked(profileClicked ? false :true)
              controller.setSelectedTask(null)
            }}
            >
              <span style={{color:'white', fontSize:40, fontWeight: 'bold'}}>{controller.getUser().getValue()?.name.at(0)}</span>
            </button>
          </div>          
          
          {/* Calendar */}
          <div style={{marginTop:20}}>
            <WireFrame leafNodesMap={leafNodesMap} sidedRootTasksMap={rootTaskMap} inMoment={currentMonth} scrollY={scrollY}/>
          </div>

          {/* Root task list */}
          <div style={{width: controller.getDisplay().getValue() == 2 ? "95%" : "100%", margin: '0 auto'}}>
            <div style={{display: 'flex', justifyContent:'space-between', flexDirection:'row', alignItems:'flex-end'}}>
              <h1 style={{color:'white', fontSize:60, marginLeft:'9%', paddingTop:80, paddingBottom: 20, fontWeight: 900, margin: 0}}>Root Tasks</h1>

              <button style={{width:80, height:80, borderRadius:'50%', backgroundColor:'rgba(30,30,30,1)', display: 'flex', alignItems:'center', justifyContent:'center', marginRight:'9%', marginBottom:20, border: 'none', cursor: 'pointer'}}
              onClick={() => {
                if(controller.getSelectedTask().getValue() === null)
                  controller.createNewTask()
                  if(controller.getDisplay().getValue() != 0)
                    console.log(controller.getReRender().getValue())
                    controller.setReRender(controller.getReRender().getValue()? false : true)
                    console.log(controller.getReRender().getValue())
              }}
              >
                <img src={require('../../assets/x_mark_white.png').default || require('../../assets/x_mark_white.png')} style={{width:15, height:15, transform:'rotate(-45deg)', opacity: controller.getSelectedTask().getValue() === null ? 1 : 0.2}}/>
              </button>
            </div>
            
            <div style={{maxWidth: "auto", display: 'flex', justifyContent: 'center'}}>
              <RootTaskList rootTasksMap={rootTaskMap} inMoment={currentMonth}/>
            </div>
          </div>
          
          
        </div>
      </div>
    );
}

export default Main