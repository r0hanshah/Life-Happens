import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, useWindowDimensions, Animated, ViewStyle, TextStyle } from 'react-native';
import MainController from '../../../controllers/main/MainController';
import moment from 'moment';

interface WeekProps {
    dayNodes: React.JSX.Element[];
    scrollY: Animated.Value
}

// start date and get week of that date and tasks for that week

const WeekDisplay: React.FC<WeekProps> = ({dayNodes, scrollY}) => {
    const [scrollValue, setScrollValue] = useState(0);
    const currentDate = new Date()
    const controller = MainController.getInstance()

    useEffect(() => {
        const listenerId = scrollY.addListener(({ value }) => {
        setScrollValue(value);
        });

        // Clean up the listener on component unmount
        return () => {
        scrollY.removeListener(listenerId);
        };
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
          <View style={{position:'absolute', flexDirection:'row', alignItems:'center', left:-80, top:(i*60)*0.547 + 50}}>
              <Text style={{color:'#D35454'}}>{i}</Text>
              <View style={{width:20, height:1, backgroundColor:'#D35454'}}/>
          </View>
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

    const hourStyle:TextStyle=
    {
        color:'#717171', 
        textAlign:'right', 
        marginBottom:23,
        backgroundColor:'#151515',
        paddingRight:15,
        width:'auto',
        height: 10
    }

    const nonKeyHourStyle:TextStyle=
    {
        width:35,
    }

    return(
        <View style={{backgroundColor:'#151515', height:'100%'}}>
            {(scrollValue > 200 && scrollValue < 1000) ? <View style={{position:'absolute', top: scrollValue-210, backgroundColor:'#151515', height: 80,
              width: 100, paddingTop:40, zIndex:999, left:-91}}></View> : <></>}

            {(dateDifference >= 0 && dateDifference <= 10080) ? 
            <View style={{position:'absolute', flexDirection:'row', alignItems:'center', left:-80, top:calculateMinutesSinceMidnight(currentDate)*0.547 + 50}}>
                <Text style={{color:'#D35454', marginRight:5}}>{formatTime(currentDate)}</Text>
                <View style={{height:5, width:5, backgroundColor:'#D35454', borderRadius:5}}/>
                <View style={{width:53, height:1, backgroundColor:'#D35454'}}/>
            </View> :
            // Display lines based off the hour
            <></>
            // renderHourlyLines()
            }
            
            
            <View style={{position:'absolute', flexDirection:'column', left:-40, marginTop:80, alignItems:'flex-end'}}>
                <Text style={hourStyle}>1 AM</Text>
                <Text style={[hourStyle, nonKeyHourStyle]}>2</Text>
                <Text style={[hourStyle, nonKeyHourStyle]}>3</Text>
                <Text style={[hourStyle, nonKeyHourStyle]}>4</Text>
                <Text style={[hourStyle, nonKeyHourStyle]}>5</Text>
                <Text style={[hourStyle, nonKeyHourStyle]}>6</Text>
                <Text style={[hourStyle, nonKeyHourStyle]}>7</Text>
                <Text style={[hourStyle, nonKeyHourStyle]}>8</Text>
                <Text style={[hourStyle, nonKeyHourStyle]}>9</Text>
                <Text style={[hourStyle, nonKeyHourStyle]}>10</Text>
                <Text style={[hourStyle, nonKeyHourStyle]}>11</Text>
                <Text style={[hourStyle]}>12 PM</Text>
                <Text style={hourStyle}>1 PM</Text>
                <Text style={[hourStyle, nonKeyHourStyle]}>2</Text>
                <Text style={[hourStyle, nonKeyHourStyle]}>3</Text>
                <Text style={[hourStyle, nonKeyHourStyle]}>4</Text>
                <Text style={[hourStyle, nonKeyHourStyle]}>5</Text>
                <Text style={[hourStyle, nonKeyHourStyle]}>6</Text>
                <Text style={[hourStyle, nonKeyHourStyle]}>7</Text>
                <Text style={[hourStyle, nonKeyHourStyle]}>8</Text>
                <Text style={[hourStyle, nonKeyHourStyle]}>9</Text>
                <Text style={[hourStyle, nonKeyHourStyle]}>10</Text>
                <Text style={[hourStyle, nonKeyHourStyle]}>11</Text>
                <Text style={hourStyle}>12 AM</Text>
            </View>
            <View style={{flexDirection:'row', justifyContent:'space-around', marginVertical:10}}>
                {dayNodes}
            </View>
        </View>
    )
}

export default WeekDisplay