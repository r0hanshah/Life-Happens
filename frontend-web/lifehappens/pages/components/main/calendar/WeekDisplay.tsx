import React, { useState, useEffect } from 'react';
import style from '@/styles/components/main/calendar/dayDisplay.module.css'
import MainController from '@/controllers/main/MainController';
import moment from 'moment';

interface WeekProps {
    dayNodes: React.JSX.Element[];
    scrollY: number
}

// start date and get week of that date and tasks for that week

const WeekDisplay: React.FC<WeekProps> = ({dayNodes, scrollY}) => {
    const [scrollValue, setScrollValue] = useState(0);
    const currentDate = new Date()
    const controller = MainController.getInstance()

    useEffect(() => {
        setScrollValue(scrollY);
    }, [scrollY]);

    const [reRender, setReRender] = useState<boolean>(false)

  useEffect(()=>{
    const renderListener = controller.getReRender();

    const listener = (bool: boolean) => {
      setReRender(bool);
    };

    renderListener.addListener(listener)

    return () => {
      renderListener.removeListener(listener);
    };
  }, [controller])

    const formatTime = (date:Date) => {
        const hours = (date.getHours()%12).toString();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      };
    
    const calculateMinutesSinceMidnight = (date:Date) => {
        let hours = date.getHours();
        const minutes = date.getMinutes();

        // Convert hours to 12-hour format
        hours = hours % 24;

        // Calculate total minutes since 12:00 AM
        const totalMinutes = hours * 60 + minutes;

        return totalMinutes;
    };

    const renderHourlyLines = () => {
      let lines = []
      for(let i = 0; i < 24; i ++)
      {
        lines.push(
          <div style={{position:'absolute', flexDirection:'row', alignItems:'center', left:-80, top:(i*60)*0.547 + 50}}>
              <p style={{color:'#D35454'}}>{i}</p>
              <div style={{width:20, height:1, backgroundColor:'#D35454'}}/>
          </div>
        )
      }
      return lines
    }

    const getDateDifference = (d1:Date, d2:Date) => {
        const date1Moment = moment(d1);
        const date2Moment = moment(d2);

  
        date2Moment.add(1, 'days'); // Add one day to d2
        
        
        const differenceInMinutes = date2Moment.diff(date1Moment, 'minutes');

        return differenceInMinutes;
      };
    
    const dateDifference = getDateDifference(currentDate, controller.getMoment().getValue().toDate())

    return(
        <div style={{backgroundColor:'#151515', height:'100%'}}>
            {(scrollValue > 200 && scrollValue < 1000) ? <div style={{position:'absolute', top: scrollValue-210, backgroundColor:'#151515', height: 80,
              width: 100, paddingTop:40, zIndex:999, left:-91}}></div> : <></>}

            {(dateDifference >= 0 && dateDifference <= 10080) ? 
            <div style={{position:'absolute', flexDirection:'row', alignItems:'center', left:-80, top:calculateMinutesSinceMidnight(currentDate)*0.547 + 50}}>
                <p style={{color:'#D35454', marginRight:5}}>{formatTime(currentDate)}</p>
                <div style={{height:5, width:5, backgroundColor:'#D35454', borderRadius:5}}/>
                <div style={{width:53, height:1, backgroundColor:'#D35454'}}/>
            </div> :
            // Display lines based off the hour
            <></>
            // renderHourlyLines()
            }
            
            
            <div style={{position:'absolute', flexDirection:'column', left:-40, marginTop:80, alignItems:'flex-end'}}>
                <p className={style.hourStyle}>1 AM</p>
                <p className={style.hourStyle + style.nonKeyHourStyle}>2</p>
                <p className={style.hourStyle + style.nonKeyHourStyle}>3</p>
                <p className={style.hourStyle + style.nonKeyHourStyle}>4</p>
                <p className={style.hourStyle + style.nonKeyHourStyle}>5</p>
                <p className={style.hourStyle + style.nonKeyHourStyle}>6</p>
                <p className={style.hourStyle + style.nonKeyHourStyle}>7</p>
                <p className={style.hourStyle + style.nonKeyHourStyle}>8</p>
                <p className={style.hourStyle + style.nonKeyHourStyle}>9</p>
                <p className={style.hourStyle + style.nonKeyHourStyle}>10</p>
                <p className={style.hourStyle + style.nonKeyHourStyle}>11</p>
                <p className={style.hourStyle}>12 PM</p>
                <p className={style.hourStyle}>1 PM</p>
                <p className={style.hourStyle + style.nonKeyHourStyle}>2</p>
                <p className={style.hourStyle + style.nonKeyHourStyle}>3</p>
                <p className={style.hourStyle + style.nonKeyHourStyle}>4</p>
                <p className={style.hourStyle + style.nonKeyHourStyle}>5</p>
                <p className={style.hourStyle + style.nonKeyHourStyle}>6</p>
                <p className={style.hourStyle + style.nonKeyHourStyle}>7</p>
                <p className={style.hourStyle + style.nonKeyHourStyle}>8</p>
                <p className={style.hourStyle + style.nonKeyHourStyle}>9</p>
                <p className={style.hourStyle + style.nonKeyHourStyle}>10</p>
                <p className={style.hourStyle + style.nonKeyHourStyle}>11</p>
                <p className={style.hourStyle}>12 AM</p>
            </div>
            <div style={{flexDirection:'row', justifyContent:'space-around', marginBlock:10}}>
                {dayNodes}
            </div>
        </div>
    )
}

export default WeekDisplay