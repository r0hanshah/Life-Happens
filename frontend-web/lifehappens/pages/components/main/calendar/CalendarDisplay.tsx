import React, { useState, useEffect } from 'react';
import TouchableOpacity from "../../../native/TouchableOpacity"
import DayNode from './DayNode';
import moment from 'moment';
import TaskModel from '@/models/TaskModel';
import MainController from '@/controllers/main/MainController';
import WeekDisplay from './WeekDisplay';
import DayDisplay from './DayDisplay';
import styles from '@/styles/components/main/calendar/calendarDisplay.module.css'

interface CalendarProps {
  offset: number;
  leafNodesMap: { [key:number] : TaskModel[]}; // row,column,color
  inMoment: moment.Moment;
  scrollY: number
}

const CalendarDisplay: React.FC<CalendarProps> = ({ offset, leafNodesMap, inMoment, scrollY }) => {

  const windowWidth = window.global.innerWidth;
  const windowHeight = window.global.innerHeight;

  const mainController = MainController.getInstance()

  const [currentMonth, setCurrentMonth] = useState(inMoment);

  const [weekDays, setWeekDays] = useState<React.JSX.Element[]>([]);

  const [day, setDay] = useState<React.JSX.Element | null>(null);

  const [reRender, setReRender] = useState<boolean>(false)

  useEffect(()=>{
    const renderListener = mainController.getReRender();

    const listener = (bool: boolean) => {
      setReRender(bool);
    };

    renderListener.addListener(listener)

    return () => {
      renderListener.removeListener(listener);
    };
  }, [mainController])

  // Produce map of yyyymmdd (string) : [TaskModel[]]

  useEffect(() => {
    // Fetch or set the initial month based on your requirements
    // For example, you can set it to the current month
    setCurrentMonth(moment(inMoment));
    // const reRenderState = mainController.getReRender().getValue()
    // mainController.setReRender(reRenderState ? false : true)
    console.log(inMoment)
    console.log(leafNodesMap)
    console.log("HERE")

    //Update weeks
    const indexingMoment=inMoment.clone()
    const weekDays:React.JSX.Element[] = [];
    const currentDate = moment(new Date())

    const firstDayOfMonthSet = inMoment.clone().startOf('month').startOf('week');
    var offset = indexingMoment.diff(firstDayOfMonthSet, 'days')

    //Set Day
    setDay(
      <DayNode key={indexingMoment.toString()} dayNumber={parseInt(indexingMoment.format('D'),)} dayOfWeek={0} currentDay={currentDate.year() == indexingMoment.year() && currentDate.month() == inMoment.month() && currentDate.date() == indexingMoment.date()} leafTasks={leafNodesMap.hasOwnProperty(offset) ? leafNodesMap[offset] : []} inMonth={ indexingMoment.month() == currentMonth.month()} lastRowExtension={0} scrollY={scrollY} dayMoment={indexingMoment.clone()}/>
    )

    for(let i =0; i < 7; i++)
    {
      weekDays.push(
          <DayNode key={indexingMoment.toString()} dayNumber={parseInt(indexingMoment.format('D'),)} dayOfWeek={0} currentDay={currentDate.year() == indexingMoment.year() && currentDate.month() == inMoment.month() && currentDate.date() == indexingMoment.date()} leafTasks={leafNodesMap.hasOwnProperty(offset) ? leafNodesMap[offset] : []} inMonth={ indexingMoment.month() == currentMonth.month()} lastRowExtension={0} scrollY={scrollY} dayMoment={indexingMoment.clone()}/>
      );
      
      indexingMoment.subtract(1,'day')
      offset -= 1;
    }

    setWeekDays(weekDays.toReversed())
}, [mainController, leafNodesMap, inMoment]);

  const renderCalendar = () => {
    const firstDayOfMonth = currentMonth.clone().startOf('month');
    const daysInMonth = currentMonth.daysInMonth();
    const startDay = firstDayOfMonth.clone().startOf('week');
    const endDay = firstDayOfMonth.clone().endOf('month').endOf('week');
    const currentDate = moment(new Date())

    const difference = endDay.diff(startDay, 'days')
    const calendarDays:React.JSX.Element[] = [];
    let currentDay = startDay.clone();

    var offset:number = 0;
    while (currentDay.isBefore(endDay)) 
    {
        calendarDays.push(
            <DayNode key={currentDay.toString()} dayNumber={parseInt(currentDay.format('D'),)} dayOfWeek={0} currentDay={currentDate.year() == currentDay.year() && currentDate.month() == currentDay.month() && currentDate.date() == currentDay.date()} leafTasks={leafNodesMap.hasOwnProperty(offset) ? leafNodesMap[offset] : []} inMonth={ currentDay.month() == currentMonth.month()} lastRowExtension={difference - offset < 7 ? 48 : 0} scrollY={scrollY} dayMoment={currentDay.clone()}/>
        );

        currentDay.add(1, 'day');
        offset += 1;
    }

    const calendarDisplay = []
    for(let i = 0; i < calendarDays.length; i+=7)
    {
        calendarDisplay.push(
            <div key={`row${i/7}`} className={styles.row} style={{height: 95, paddingTop: 40}}>
                {calendarDays.slice(i,i+7)}
                <TouchableOpacity onClick={() => {
                  setWeekDays(calendarDays.slice(i,i+7))
                  mainController.setDisplay(1)
                  mainController.setMoment(startDay.clone().add(i+7-1, 'days'))
                  }}>
                  <div style={{position: 'absolute', width:10, height:10, borderRadius: 10, backgroundColor:'#717171', right:-20, marginBlock:15}}></div>
                </TouchableOpacity>
            </div>
        )
    }

    return calendarDisplay;
  };

  return (
    <div className={styles.grid} style={{ width: windowWidth * 0.84}}>
      {mainController.getDisplay().getValue() == 1 ? <WeekDisplay dayNodes={weekDays} scrollY={scrollY}/> : mainController.getDisplay().getValue() == 2 && day ? <DayDisplay dayNode={day} scrollY={scrollY}/> : renderCalendar() }

      {mainController.getDisplay().getValue() < 2 &&
        <div className={styles.row} style={{ height: 40}}>
          <p style={{color:'#717171'}}>Su</p>
          <p style={{color:'#717171'}}>M</p>
          <p style={{color:'#717171'}}>T</p>
          <p style={{color:'#717171'}}>W</p>
          <p style={{color:'#717171'}}>Th</p>
          <p style={{color:'#717171'}}>F</p>
          <p style={{color:'#717171'}}>S</p>
        </div>
      }
      </div>
      
  );
};

export default CalendarDisplay;