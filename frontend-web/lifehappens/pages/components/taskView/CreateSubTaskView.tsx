import React, { useState, useEffect } from 'react';
import TaskModel from '@/models/TaskModel';
import MainController from '@/controllers/main/MainController';

import DateSelector from './DateSelector';
import TimeSelector from './TimeSelector';
import { remove_email_notification } from '@/services/taskServices';

interface CreateSubTaskViewProps {
  parentTask: TaskModel;
  task: TaskModel;
  isLeft: Boolean;
  zIndex: number;
  handleDeleteNewTask: (task:TaskModel) => void;
}

const CreateSubTaskView: React.FC<CreateSubTaskViewProps> = ({ parentTask, task, isLeft, zIndex, handleDeleteNewTask }) => {

  const [isMovable, setIsMovable] = useState(task.isMovable)
  const [title, setTitle] = useState(task.title)

  const onChangeText = (newText: React.SetStateAction<string>) => {
    setTitle(newText);
    task.title = newText.toString()
  }

  const calculateDuration = (startDate:Date, endDate:Date) => {
    const diffMs = Math.abs(endDate.getTime() - startDate.getTime());
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 60) {
        return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}`;
    } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
    } else {
        return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    }
  };

  const handleAddTask = () => {
    const mainController = MainController.getInstance();

    // Remove notifications for parent task
    remove_email_notification(mainController.getUser().getValue()!.id, parentTask.id, "start_task")
    remove_email_notification(mainController.getUser().getValue()!.id, parentTask.id, "end_task")

    parentTask.children.push(task)
    for(const parent of task.ancestors)
    {
        if (parent.endDate < task.endDate) {parent.endDate = task.endDate; mainController.saveEditToTask(parent)}
        if (parent.startDate > task.startDate) { parent.startDate = task.startDate; mainController.saveEditToTask(parent)}
    }
    mainController.storeTaskOnFirestore(task)
    
    handleDeleteNewTask(task)
    
    mainController.setReRender(mainController.getReRender().getValue() ? false : true)
  }

  // For date pickers
    const [duration, setDuration] = useState(calculateDuration(task.startDate, task.endDate));
    const [durationFromNow, setDurationFromNow] = useState(calculateDuration(new Date(), task.endDate));


  return(
    <div style={{
      display: 'flex',
      alignItems: isLeft ? 'flex-start' : 'flex-end',
      marginTop: 20,
      paddingBottom: 20,
      zIndex: zIndex,
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: '95%',
        backgroundColor: 'rgba(50, 50, 50, 1)',
        borderRadius: 30,
        zIndex: zIndex,
        paddingBottom: 20,
      }}>
        {/* Title and progress section */}
        <div style={{
          display: 'flex',
          flexDirection: isLeft ? 'row' : 'row-reverse',
          justifyContent: 'space-between',
          marginTop: 10,
          width: '100%',
          alignItems: 'center',
          position: 'relative',
        }}>
          <div style={{
            display: 'flex',
            flexDirection: isLeft ? 'row' : 'row-reverse',
            alignItems: 'center',
          }}>
            <div style={{
              backgroundColor: task.color,
              width: 20,
              height: 20,
              borderRadius: 20,
              margin: 10,
            }} />
            <input
              style={{
                color: 'white',
                border: 'none',
                height: 20,
                textAlign: isLeft ? 'left' : 'right',
                backgroundColor: 'transparent',
                fontFamily: 'Arial, sans-serif',
              }}
              onChange={(e) => onChangeText(e.target.value)}
              value={title}
              placeholder="Sub Task Title..."
            />
          </div>
          <span style={{ color: 'white' }}>Leaf Task</span>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            margin: '0 20px',
            padding: 10,
            alignItems: 'center',
            gap: 5,
          }}>
            <div style={{
              width: 30,
              height: 30,
              borderRadius: 30,
              border: '2px solid gray',
              marginRight: 10,
            }} />
            <span style={{ color: 'gray' }}>0%</span>
          </div>

          {/* Connector lines */}
          <div style={{
            height: 2,
            width: 50,
            position: 'absolute',
            backgroundColor: task.color,
            ...(isLeft ? { marginLeft: -50 } : { marginRight: -50 }),
          }} />
          <div style={{
            height: 420,
            width: 1.5,
            position: 'absolute',
            backgroundColor: task.color,
            marginTop: -418,
            ...(isLeft ? { marginLeft: -50.0 } : { marginRight: -50.0 }),
          }} />
        </div>

        {/* Settings section */}
        <div style={{ width: '100%', paddingLeft: 25, paddingRight: 25 }}>
          {/* Start Date */}
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
            zIndex: 4,
          }}>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <img
                style={{ width: 20, height: 20, marginLeft: 10, marginRight: 10, opacity: 0.3 }}
                src={require('../../assets/calendar_icon.png')}
              />
              <span style={{ color: 'gray' }}>Start Date</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <DateSelector task={task} modStartDate={true} updateFunctions={[setDuration, setDurationFromNow]} updateServer={false} />
              <TimeSelector task={task} modStartDate={true} updateFunctions={[setDuration, setDurationFromNow]} updateServer={false} />
            </div>
          </div>

          {/* End Date */}
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
            zIndex: 3,
          }}>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <img
                style={{ width: 20, height: 20, marginLeft: 10, marginRight: 10, opacity: 0.3 }}
                src={require('../../assets/calendar_icon.png')}
              />
              <span style={{ color: 'gray' }}>End Date</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <DateSelector task={task} modStartDate={false} updateFunctions={[setDuration, setDurationFromNow]} updateServer={false} />
              <TimeSelector task={task} modStartDate={false} updateFunctions={[setDuration, setDurationFromNow]} updateServer={false} />
            </div>
          </div>

          {/* Duration */}
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <img
                style={{ width: 20, height: 20, marginLeft: 10, marginRight: 10, opacity: 0.3 }}
                src={require('../../assets/clock_icon.png')}
              />
              <span style={{ color: 'gray' }}>Duration</span>
            </div>
            <span style={{ color: 'gray' }}>{duration}</span>
          </div>

          {/* Duration From Now */}
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <img
                style={{ width: 20, height: 20, marginLeft: 10, marginRight: 10, opacity: 0.3 }}
                src={require('../../assets/clock_icon.png')}
              />
              <span style={{ color: 'gray' }}>Duration From Now</span>
            </div>
            <span style={{ color: 'gray' }}>{durationFromNow}</span>
          </div>

          {/* Is Movable */}
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <img
                style={{ width: 20, height: 20, marginLeft: 10, marginRight: 10, opacity: 0.3 }}
                src={require('../../assets/robot_icon.png')}
              />
              <span style={{ color: 'gray' }}>Is Movable?</span>
            </div>
            <button
              onClick={() => {
                task.isMovable = task.isMovable ? false : true;
                setIsMovable(task.isMovable);
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                color: 'gray',
              }}
            >
              {isMovable ? 'Yes' : 'No'}
            </button>
          </div>

          {/* AI Notes */}
          {task.notes.length > 0 && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              marginTop: 15,
            }}>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <span style={{
                  color: 'white',
                  fontFamily: 'Arial, sans-serif',
                  fontSize: 20,
                  fontWeight: 'bold',
                }}>
                  AI Notes
                </span>
              </div>
              <span style={{ color: 'gray', marginTop: 20, marginBottom: 20 }}>
                {task.notes}
              </span>
            </div>
          )}
        </div>

        {/* Cancel and Create buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          width: '100%',
          paddingLeft: 25,
          paddingRight: 25,
          paddingTop: 20,
          zIndex: -1,
        }}>
          <button
            style={{
              width: 200,
              backgroundColor: '#151515',
              height: 40,
              borderRadius: 50,
              border: '2px solid red',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              fontSize: 16,
            }}
            onClick={() => {
              handleDeleteNewTask(task);
            }}
          >
            Cancel
          </button>
          <button
            style={{
              width: 200,
              backgroundColor: '#151515',
              height: 40,
              borderRadius: 50,
              border: '2px solid white',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              fontSize: 16,
            }}
            onClick={handleAddTask}
          >
            Create Sub Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateSubTaskView;