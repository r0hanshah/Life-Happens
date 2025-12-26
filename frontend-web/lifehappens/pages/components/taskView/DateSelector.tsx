import React, { useState, useRef, useEffect } from 'react';
import TaskModel from '@/models/TaskModel';
import moment from 'moment';
import MainController from '@/controllers/main/MainController';
import { request_email_notification } from '@/services/taskServices';
import TaskViewController from '@/controllers/taskView/TaskViewController';


const DateSelector = ({task, modStartDate, updateFunctions, updateServer} : {task:TaskModel, modStartDate:boolean, updateFunctions:Array<(duration:string)=>void>, updateServer:boolean}) => {

    const mainController = MainController.getInstance();
    const taskController = new TaskViewController(task)

    const [isSquareVisible, setIsSquareVisible] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(modStartDate ? task.startDate.getMonth() : task.endDate.getMonth());
    const [selectedYear, setSelectedYear] = useState(modStartDate ? task.startDate.getFullYear() : task.endDate.getFullYear());
    const [selectedDate, setSelectedDate] = useState(modStartDate ? task.startDate : task.endDate)
    const [isYearDropdownVisible, setIsYearDropdownVisible] = useState(false);

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const dayOfWeek = daysOfWeek[(modStartDate ? task.startDate : task.endDate).getDay()];
    const monthName = months[(modStartDate ? task.startDate : task.endDate).getMonth()];
    const dayOfMonth = (modStartDate ? task.startDate : task.endDate).getDate();
    const year = (modStartDate ? task.startDate : task.endDate).getFullYear();
    
    const [formattedDate, setFormattedDate] = useState(`${dayOfWeek}, ${monthName} ${dayOfMonth}, ${year}`);


    useEffect(()=>{
      const popupListener = mainController.getToggledPopupKey();
  
      const listener = (key:string) => {
        setIsSquareVisible(mainController.getToggledPopupKey().getValue() == task.id + 'd' + modStartDate)
      };
  
      popupListener.addListener(listener)
  
      return () => {
          popupListener.removeListener(listener);
      }
  
    },[mainController])

    useEffect(()=>{
      setSelectedMonth(modStartDate ? task.startDate.getMonth() : task.endDate.getMonth());
      setSelectedYear(modStartDate ? task.startDate.getFullYear() : task.endDate.getFullYear());
      setSelectedDate(modStartDate ? task.startDate : task.endDate)
      const dayOfWeek = daysOfWeek[(modStartDate ? task.startDate : task.endDate).getDay()];
      const monthName = months[(modStartDate ? task.startDate : task.endDate).getMonth()];
      const dayOfMonth = (modStartDate ? task.startDate : task.endDate).getDate();
      const yearOfDay = (modStartDate ? task.startDate : task.endDate).getFullYear();
      const formattedDate = `${dayOfWeek}, ${monthName} ${dayOfMonth}, ${yearOfDay}`;
      setFormattedDate(formattedDate);
      for(const parent of task.ancestors)
      {
        if(modStartDate ? parent.endDate < task.endDate : parent.startDate > task.startDate)
          if(modStartDate) { parent.startDate = task.startDate }
          else { parent.endDate = task.endDate}
         
      }
      updateFunctions.at(0)!(calculateDuration(task.startDate, task.endDate))
      updateFunctions.at(1)!(calculateDuration(new Date(), task.endDate))
    }, [task, task.endDate, task.startDate])
  
    const handleContainerClick = () => {
      mainController.setToggledPopupKey(mainController.getToggledPopupKey().getValue() == task.id+'d'+modStartDate ? '' : task.id + 'd' + modStartDate)
      setIsSquareVisible(mainController.getToggledPopupKey().getValue() == task.id + 'd' + modStartDate);
    };
  
    const handlePrevMonth = () => {
      const prevMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
      setSelectedMonth(prevMonth);
    };
  
    const handleNextMonth = () => {
      const nextMonth = selectedMonth === 11 ? 0 : selectedMonth + 1;
      setSelectedMonth(nextMonth);
    };
  
    const handlePrevYear = () => {
      setSelectedYear(selectedYear - 1);
    };
  
    const handleNextYear = () => {
      setSelectedYear(selectedYear + 1);
    };
  
    const handleYearSelect = (year:number) => {
      setSelectedYear(year);
      setIsYearDropdownVisible(false);
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

    const handleDaySelect = (year:number , month:number, day:number|"") => {
      const mainController = MainController.getInstance();
   
      if (typeof day === 'number')
      {
        const date = new Date(year, month-1, day, task.startDate.getHours(), task.startDate.getMinutes()+1)
        setSelectedDate(date)

        if (modStartDate)
        {
          const diff = task.endDate.getTime() - task.startDate.getTime()
          task.endDate = new Date(date.getTime() + diff)
          console.log("This is the new endate: ", task.endDate)
        }

        const dayOfWeek = daysOfWeek[date.getDay()];
        const monthName = months[date.getMonth()];
        const dayOfMonth = date.getDate();
        const yearOfDay = date.getFullYear();

        // Format the date string
        const formattedDate = `${dayOfWeek}, ${monthName} ${dayOfMonth}, ${yearOfDay}`;
        setFormattedDate(formattedDate);

        // Update task date
        taskController.handle_datetime_changes(year, month-1, day, task.startDate.getHours(), task.startDate.getMinutes(), modStartDate ? 'start' : 'end', mainController, updateServer)

        updateFunctions.at(0)!(calculateDuration(task.startDate, task.endDate))
        updateFunctions.at(1)!(calculateDuration(new Date(), task.endDate))

        // Refresh main view
        mainController.setMoment(moment(date))   
      }
     
    }
  
    const renderMonthsDropdown = () => {
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
  
      return (
        <div style={{ ...styles.dropdownContainer, width: '50%' }}>
          <button
            onClick={handlePrevMonth}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <img
              src={require('../../assets/chev_white.png')}
              style={{ width: 15, height: 10, transform: 'rotate(90deg)' }}
            />
          </button>
          <span style={{ color: 'white' }}>{months[selectedMonth]}</span>
          <button
            onClick={handleNextMonth}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <img
              src={require('../../assets/chev_white.png')}
              style={{ width: 15, height: 10, transform: 'rotate(-90deg)' }}
            />
          </button>
        </div>
      );
    };

    const scrollViewRef = useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = useState<number>(0);

    useEffect(() => {
      if (scrollViewRef.current) {
        const screenHeight = window.innerHeight;
        const middleY = (contentHeight - screenHeight) / 2;
        scrollViewRef.current.scrollTop = middleY + 350;
      }
    }, [contentHeight]);

    const onContentSizeChange = (width: number, height: number) => {
      setContentHeight(height);
    };
  
    const renderYearsDropdown = () => {
      const currentYear = new Date().getFullYear();
      const years = Array.from({ length: 100 }, (_, index) => currentYear - 50 + index);
  
      return (
        <div style={{ ...styles.dropdownContainer, width: '25%', zIndex: 1 }}>
          <button
            onClick={handlePrevYear}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <img
              src={require('../../assets/chev_white.png')}
              style={{ width: 15, height: 10, transform: 'rotate(90deg)' }}
            />
          </button>
          <button
            onClick={() => setIsYearDropdownVisible(!isYearDropdownVisible)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              color: 'white',
            }}
          >
            {selectedYear}
          </button>
          <button
            onClick={handleNextYear}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <img
              src={require('../../assets/chev_white.png')}
              style={{ width: 15, height: 10, transform: 'rotate(-90deg)' }}
            />
          </button>
          {isYearDropdownVisible && (
            <div
              ref={scrollViewRef}
              style={{
                ...styles.yearDropdown,
                zIndex: 1,
                maxHeight: 100,
                overflowY: 'auto',
              }}
            >
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => handleYearSelect(year)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'black',
                    width: '100%',
                    padding: 8,
                    textAlign: 'center',
                  }}
                >
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>
      );
    };

    const renderCalendar = () => {
        const currentMonth = moment(new Date(selectedYear, selectedMonth));
        const currentDate = moment(new Date());

        const selectedDay = moment(selectedDate)
        const otherDay = moment(!modStartDate ? task.startDate : task.endDate)

        const firstDayOfMonth = currentMonth.clone().startOf('month');
        const daysInMonth = currentMonth.daysInMonth();
        const startDay = firstDayOfMonth.clone().startOf('week');
        const endDay = firstDayOfMonth.clone().endOf('month').endOf('week');

        const calendarDays = [];
        let currentDay = startDay.clone();

        var offset:number = 0;
        while (currentDay.isBefore(endDay)) 
        {
          const day = parseInt(currentDay.format('D'),);
          const month = parseInt(currentDay.format('M'),);
          const year = parseInt(currentDay.format('YYYY'),);
            calendarDays.push(
                <button
                    key={currentDay.toString()}
                    onClick={() => { handleDaySelect(year, month, day)}}
                    style={{
                      ...styles.dayCell,
                      backgroundColor: (selectedDay.year() == currentDay.year() && selectedDay.month() == currentDay.month() && selectedDay.date() == currentDay.date())? '#D35454' :
                      (otherDay.year() == currentDay.year() && otherDay.month() == currentDay.month() && otherDay.date() == currentDay.date()) ? '#783333' :
                      (currentDate.year() == currentDay.year() && currentDate.month() == currentDay.month() && currentDate.date() == currentDay.date()) ? '#00488A' : 'transparent',
                      cursor: 'pointer',
                      border: 'none',
                    }}
                >
                    <span style={{color: currentDay.month() == firstDayOfMonth.month() ? 'white' : 'gray'}}>{parseInt(currentDay.format('D'),)}</span>
                </button>
            );

            currentDay.add(1, 'day');
            offset += 1;
        }
    
        const calendarDisplay = []
        for(var i = 0; i < calendarDays.length; i+=7)
        {
            calendarDisplay.push(
                <div key={`row${i/7}`} style={{ height: 20, marginTop: 20, display: 'flex', flexDirection: 'row' }}>
                    {calendarDays.slice(i,i+7)}
                </div>
            )
        }
    
        return calendarDisplay;
      };
    

  return (
    <div style={styles.container}>
      <button
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', justifyContent: 'flex-end' }}
        onClick={handleContainerClick}
      >
        <div style={{ ...styles.pickerContainer, alignItems: 'flex-end', display: 'flex', justifyContent: 'flex-end' }}>
          <span style={{ color: 'gray' }}>{formattedDate}</span>
        </div>
      </button>
      {isSquareVisible && (
        <div style={styles.square}>
          <div style={{ display: 'flex', flexDirection: 'row', zIndex: 1 }}>
            {renderMonthsDropdown()}
            {renderYearsDropdown()}
          </div>
          {renderCalendar()}
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', paddingTop: 30, width: '80%' }}>
            <span style={{ color: 'gray' }}>Su</span>
            <span style={{ color: 'gray' }}>M</span>
            <span style={{ color: 'gray' }}>T</span>
            <span style={{ color: 'gray' }}>W</span>
            <span style={{ color: 'gray' }}>Th</span>
            <span style={{ color: 'gray' }}>F</span>
            <span style={{ color: 'gray' }}>S</span>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    display: 'flex',
  },
  pickerContainer: {
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  square: {
    width: 350,
    height: 350,
    position: 'absolute',
    backgroundColor: 'rgba(30,30,30,1)',
    marginTop: 380,
    marginRight: 0,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    display: 'flex',
    flexDirection: 'column',
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
    borderStyle: 'solid',
    borderWidth: 1,
    height: 100,
  },
  dayColumn: {
    width: '14%',
    alignItems: 'center',
    display: 'flex',
  },
  dayCell: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    display: 'flex',
  },
  disabledDay: {
    backgroundColor: '#ddd',
  },
  today: {
    backgroundColor: 'lightblue',
  },
};

export default DateSelector;