import React, { useEffect, useState } from 'react';
import moment, { Duration } from 'moment';
import TaskModel from '@/models/TaskModel';
import MainController from '@/controllers/main/MainController';
import { request_email_notification } from '@/services/taskServices';
import TaskViewController from '@/controllers/taskView/TaskViewController';


const TimeSelector =({task, modStartDate, updateFunctions, updateServer} : {task:TaskModel, modStartDate:boolean, updateFunctions:Array<(duration:string) => void>, updateServer:boolean}) => {
    const mainController = MainController.getInstance();
    const taskController = new TaskViewController(task)

    const [isSquareVisible, setIsSquareVisible] = useState(false);
    const [hours, setHours] = useState<string>(modStartDate ? (task.startDate.getHours() > 12 ? task.startDate.getHours() - 12 : task.startDate.getHours()).toString() :(task.endDate.getHours() > 12 ? task.endDate.getHours() - 12 : task.endDate.getHours()).toString());
    const [hoursInt, setHoursInt] = useState<number>(parseInt(hours))

    const [minutes, setMinutes] = useState<string>(modStartDate ? task.startDate.getMinutes().toString().length <= 1 ? ('00'+task.startDate.getMinutes().toString()).slice(-2) : task.startDate.getMinutes().toString()  : task.endDate.getMinutes().toString().length <= 1 ? ('00'+task.endDate.getMinutes().toString()).slice(-2) : task.endDate.getMinutes().toString());
    
    const [minInts, setMinInts] = useState<number>(parseInt(minutes))
    const [isPM, setIsPM] = useState<boolean>((modStartDate ? task.startDate.getHours() > 12 : task.endDate.getHours() > 12));


    useEffect(()=>{
      const popupListener = mainController.getToggledPopupKey();
  
      const listener = (key:string) => {
        setIsSquareVisible(mainController.getToggledPopupKey().getValue() == task.id + 't' + modStartDate)
      };
  
      popupListener.addListener(listener)
  
      return () => {
          popupListener.removeListener(listener);
      }
  
    },[mainController])

    const handleContainerClick = () => {
      mainController.setToggledPopupKey(mainController.getToggledPopupKey().getValue() == task.id+'t'+modStartDate ? '' : task.id + 't' + modStartDate)
      setIsSquareVisible(mainController.getToggledPopupKey().getValue() == task.id + 't' + modStartDate);
    };

    const togglePeriod = () => {
      setIsPM(prevState => !prevState);
    };

    useEffect(()=>{
      setHours(modStartDate ? (task.startDate.getHours() > 12 ? task.startDate.getHours() - 12 : task.startDate.getHours()).toString() :(task.endDate.getHours() > 12 ? task.endDate.getHours() - 12 : task.endDate.getHours()).toString());
      setHoursInt(modStartDate ? (task.startDate.getHours() > 12 ? task.startDate.getHours() - 12 : task.startDate.getHours()) :(task.endDate.getHours() > 12 ? task.endDate.getHours() - 12 : task.endDate.getHours()))
      setMinutes(modStartDate ? task.startDate.getMinutes().toString().length <= 1 ? ('00'+task.startDate.getMinutes().toString()).slice(-2) : task.startDate.getMinutes().toString()  : task.endDate.getMinutes().toString().length <= 1 ? ('00'+task.endDate.getMinutes().toString()).slice(-2) : task.endDate.getMinutes().toString());
      setMinInts(modStartDate ? task.startDate.getMinutes() : task.endDate.getMinutes())
      setIsPM((modStartDate ? task.startDate.getHours() > 12 : task.endDate.getHours() > 12));
      updateFunctions.at(0)!(calculateDuration(task.startDate, task.endDate))
      updateFunctions.at(1)!(calculateDuration(new Date(), task.endDate))
    }, [task])

    const validateAndExtractTime = (hourStr: string, minuteStr: string): { hour: number, minute: number } | string => {
      // Validate hour string
      const hour = parseInt(hourStr);
      if (isNaN(hour) || hour <= 0 || hour > 12) {
          return 'Invalid hour value. Please enter a number between 1 and 12.';
      }
  
      // Validate minute string
      const minute = parseInt(minuteStr);
      if (isNaN(minute) || minute < 0 || minute > 59) {
          return 'Invalid minute value. Please enter a number between 0 and 59.';
      }
  
      // If both hour and minute are valid, return them
      return { hour, minute };
    };

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

    const handleValidation = () => {
      const validationResult = validateAndExtractTime(hours, minutes);
      if (typeof validationResult === 'string') {
        alert(validationResult); // Show an alert with the error message
      } else {
        // Handle the valid time data here
        const { hour, minute } = validationResult;
        setHoursInt(hour);
        setMinInts(minute);

        setHours(hour.toString());
        setMinutes(minutes.toString().length <= 1 ? ('00'+minutes.toString()).slice(-2) : minutes.toString());

        taskController.handle_datetime_changes(task.startDate.getFullYear(), task.startDate.getMonth(), task.startDate.getDate(), hour + (isPM && hour != 12 ? 12 : 0), minute, modStartDate ? "start" : "end", mainController, updateServer)

        for(const parent of task.ancestors)
        {
          if(modStartDate ? parent.endDate < task.endDate : parent.startDate > task.startDate)
            if(modStartDate) { parent.startDate = task.startDate }
            else { parent.endDate = task.endDate}
            
        }
        updateFunctions.at(0)!(calculateDuration(task.startDate, task.endDate))
        updateFunctions.at(1)!(calculateDuration(new Date(), task.endDate))      
        mainController.setToggledPopupKey('')
        setIsSquareVisible(false);
      }
    };

    return (
      <div style={styles.container}>
        <button onClick={handleContainerClick} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
          <div style={{ ...styles.pickerContainer, alignItems: 'flex-end' }}>
            <span style={{ color: 'gray' }}>{hours}:{minutes} {isPM ? 'PM' : 'AM'}</span> 
          </div>
        </button>
        {isSquareVisible && 
        <div style={styles.square}>
          <div style={styles.timeInput}>
            <input
              style={styles.input}
              type="text"
              value={hours}
              onChange={(e) => { setHours(e.target.value) }}
              inputMode="numeric"
              maxLength={2}
            />
            <span style={{ ...styles.separator, color: 'gray' }}>:</span>
            <input
              style={styles.input}
              type="text"
              value={minutes}
              inputMode="numeric"
              onChange={(e) => {
                setMinutes(e.target.value)
              }}
              maxLength={2}
            />
            <button onClick={togglePeriod} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
              <span style={styles.period}>{isPM ? 'PM' : 'AM'}</span>
            </button>
            <button onClick={handleValidation} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', marginLeft: 10 }}>
              <img src={require('../../assets/chev_white.png').default} alt="confirm" style={{ width: 20, height: 10, transform: 'rotate(180deg)' }} />
            </button>
          </div>
        </div>
        }
        
      </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: 80,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  pickerContainer: {
    width: 80,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  square: {
    width: 230,
    height: 70,
    position: 'absolute',
    backgroundColor: 'rgba(30,30,30,1)',
    marginTop: 100,
    marginRight: 0,
    zIndex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  dropdownContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    minWidth: 100,
  },
  calendarContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    padding: 10,
  },
  yearDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderColor: 'white',
    borderWidth: 1,
    height: 100,
  },
  dayColumn: {
    width: '14%',
    display: 'flex',
    alignItems: 'center',
  },
  dayCell: {
    width: 40,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
  },
  disabledDay: {
    backgroundColor: '#ddd',
  },
  today: {
    backgroundColor: 'lightblue',
  },
  timeInput: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    width: 50,
    height: 40,
    borderWidth: 1,
    border: '1px solid #ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 5,
    fontSize: 16,
    color: 'white',
  },
  separator: {
    fontSize: 20,
    marginRight: 5,
  },
  period: {
    fontSize: 16,
    marginLeft: 5,
    color: 'gray',
  },
  timezone: {
    marginTop: 10,
    fontSize: 14,
    color: 'gray',
  },
  modalContainer: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeZoneItem: {
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottom: '1px solid #ccc',
  },
  closeButton: {
    marginTop: 20,
    color: 'blue',
    fontSize: 16,
    textDecoration: 'underline',
  },
};

export default TimeSelector;