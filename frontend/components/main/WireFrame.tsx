import { StyleSheet, Text, View } from 'react-native';
import GridComponent from './GridComponent';
import ParentNodeGridComponent from './ParentCircleGrid';


interface Tasks {
    tasks: string[];
}

const WireFrame: React.FC<Tasks> = ({ tasks }) => {
    return (
        <View style={styles.container}>
            <GridComponent offset={0} subtaskDispIds={["red,lol|||loll===0,2,1,1", "green,lol|||loll===2,2,3,0", "purple,lol|||loll===3,2:::loll===2,3,3,1"]} />
            <GridComponent offset={1} subtaskDispIds={["yellow,lol|||loll===0,2,2,1"]}/>
            <GridComponent offset={2} subtaskDispIds={["orange,lol|||loll===0,2,3,1","#fff,lol|||loll===1,4,5,1"]}/>
            <ParentNodeGridComponent offset={0} parentNodes={['0,0,red', '3,2,purple']}/>
            <ParentNodeGridComponent offset={1} parentNodes={['0,0,yellow']}/>
            <ParentNodeGridComponent offset={2} parentNodes={['0,0,orange']}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      flex: 1,
      backgroundColor: '#rgba(0,0,0,0)',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default WireFrame
