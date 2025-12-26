import React, { useState, useEffect } from 'react';
import moment, { Duration } from 'moment';
import TaskModel from '@/models/TaskModel';

import MainController from '@/controllers/main/MainController';


const ColorSelector =({task, isLeft, updateFunctions} : {task:TaskModel, isLeft:Boolean, updateFunctions:Array<(duration:string) => void>}) => {

    const [isSquareVisible, setIsSquareVisible] = useState(false);
    const [hexCode, setHexCode] = useState(task.color.substring(1))

    const mainController = MainController.getInstance()
   
    const handleContainerClick = () => {
      mainController.setToggledPopupKey(mainController.getToggledPopupKey().getValue() == task.id+'c' ? '' : task.id + 'c')
      setIsSquareVisible(mainController.getToggledPopupKey().getValue() == task.id+'c');
    };

    useEffect(()=>{
      const popupListener = mainController.getToggledPopupKey();
  
      const listener = (key:string) => {
        setIsSquareVisible(mainController.getToggledPopupKey().getValue() == task.id+'c')
      };
  
      popupListener.addListener(listener)
  
      return () => {
          popupListener.removeListener(listener);
      }
  
    },[mainController])

    const handleChangeColor = () => {
      const hexRegex = /^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

      if (hexRegex.test(hexCode))
      {
        const color = "#" + hexCode
        colorTree(task.ancestors.length > 0 ? task.ancestors[task.ancestors.length-1] : task, color)

        mainController.setReRender(mainController.getReRender().getValue() ? false : true)
        mainController.setToggledPopupKey('')
        setIsSquareVisible(false)
      }
      else
      {
        setHexCode(task.color.substring(1))
      }
    }

    const colorTree = (rootTask:TaskModel, color:string)=> {
      // Conduct bfs
      var q = [rootTask]
      while(q.length > 0)
      {
        q[0].color = color
        MainController.getInstance().saveEditToTask(q[0])
        for(const subTask of q[0].children)
        {
          q.push(subTask)
        }
        q.shift()
      }
    }

    return (
      <div style={{
        width: 80,
        display: 'flex',
        justifyContent: 'center',
        alignItems: isLeft ? 'flex-start' : 'flex-end',
      }}>
        <button
          onClick={handleContainerClick}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <div style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: task.color,
            marginTop: 27,
            margin: '27px 25px',
          }} />
        </button>
        {isSquareVisible && (
          <div style={styles.square}>
            <div style={{ ...styles.timeInput, width: '90%' }}>
              <div style={{
                width: 20,
                height: 20,
                borderRadius: 15,
                backgroundColor: '#' + hexCode,
              }} />
              <span style={{ color: 'white', margin: '0 10px' }}>#</span>
              <input
                style={styles.input}
                value={hexCode}
                onChange={(e) => setHexCode(e.target.value)}
                maxLength={6}
                type="text"
              />
              <button
                onClick={() => handleChangeColor()}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  marginLeft: 10,
                }}
              >
                <img
                  src={require('../../assets/chev_white.png')}
                  style={{
                    width: 20,
                    height: 10,
                    marginLeft: 10,
                    transform: 'rotate(180deg)',
                  }}
                />
              </button>
            </div>
            <div style={{ margin: 10, width: '90%' }}>
              {[
                { code: 'FF0000', name: 'Red' },
                { code: 'FFA800', name: 'Orange' },
                { code: 'FFF500', name: 'Yellow' },
                { code: '24FF00', name: 'Green' },
                { code: '0038FF', name: 'Blue' },
                { code: '35EDF9', name: 'Light Blue' },
                { code: '8001FF', name: 'Purple' },
              ].map((color) => (
                <button
                  key={color.code}
                  onClick={() => setHexCode(color.code)}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '95%',
                    justifyContent: 'flex-start',
                    margin: '5px 0',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 15,
                      backgroundColor: '#' + color.code,
                    }}
                  />
                  <span style={{ color: 'white', marginLeft: 20 }}>
                    {color.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: 80,
    justifyContent: 'center',
  },
  pickerContainer: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  square: {
    width: 200,
    height: 300,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    minWidth: 100,
    display: 'flex',
  },
  calendarContainer: {
    display: 'flex',
    flexDirection: 'row' as const,
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
  timeInput: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  input: {
    width: 80,
    height: 40,
    padding: 10,
    marginRight: 5,
    fontSize: 16,
    color: 'white',
    backgroundColor: 'transparent',
    border: 'none',
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  timeZoneItem: {
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    borderBottomStyle: 'solid',
  },
  closeButton: {
    marginTop: 20,
    color: 'blue',
    fontSize: 16,
    textDecoration: 'underline',
  },
};

export default ColorSelector;