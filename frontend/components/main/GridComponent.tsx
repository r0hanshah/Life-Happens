import React from 'react';
import { View, StyleSheet } from 'react-native';
import BorderComponent from './BorderComponent';

interface GridProps {
  offset: number;
}

const GridComponent: React.FC<GridProps> = ({ offset }) => {
  return (
    <View style={[styles.grid, {marginTop: offset}]}>
      <View style={styles.row}>
        <BorderComponent id='0v0' borderColor="blue" orientation="vertical"  lastRow = {false} />
        <BorderComponent id='0h0' borderColor="red" orientation="horizontal" lastRow = {false}  />

        <BorderComponent id='0v1' borderColor="blue" orientation="vertical"  lastRow = {false} />
        <BorderComponent id='0h1' borderColor="red" orientation="horizontal" lastRow = {false}  />
 
        <BorderComponent id='0v2' borderColor="blue" orientation="vertical"  lastRow = {false} />
        <BorderComponent id='0h2' borderColor="red" orientation="horizontal" lastRow = {false}  />

        <BorderComponent id='0v3' borderColor="blue" orientation="vertical"  lastRow = {false} />
        <BorderComponent id='0h3' borderColor="red" orientation="horizontal" lastRow = {false}  />

        <BorderComponent id='0v4' borderColor="blue" orientation="vertical"  lastRow = {false} />
        <BorderComponent id='0h4' borderColor="red" orientation="horizontal" lastRow = {false}  />

        <BorderComponent id='0v5' borderColor="blue" orientation="vertical"  lastRow = {false} />
        <BorderComponent id='0h5' borderColor="red" orientation="horizontal" lastRow = {false}  />

        <BorderComponent id='0v6' borderColor="blue" orientation="vertical"  lastRow = {false} />
        <BorderComponent id='0h6' borderColor="red" orientation="horizontal" lastRow = {false}  />

        <BorderComponent id='0v7' borderColor="blue" orientation="vertical"  lastRow = {false} />
      </View>
      <View style={styles.row}>
        <BorderComponent id='1v0' borderColor="blue" orientation="vertical" lastRow = {false} />
        <BorderComponent id='1h0' borderColor="red" orientation="horizontal" lastRow = {false} />

        <BorderComponent id='1v1' borderColor="blue" orientation="vertical" lastRow = {false} />
        <BorderComponent id='1h1' borderColor="red" orientation="horizontal" lastRow = {false} />

        <BorderComponent id='1v2' borderColor="blue" orientation="vertical" lastRow = {false} />
        <BorderComponent id='1h2' borderColor="red" orientation="horizontal" lastRow = {false} />

        <BorderComponent id='1v3' borderColor="blue" orientation="vertical" lastRow = {false} />
        <BorderComponent id='1h3' borderColor="red" orientation="horizontal" lastRow = {false} />

        <BorderComponent id='1v4' borderColor="blue" orientation="vertical" lastRow = {false} />
        <BorderComponent id='1h4' borderColor="red" orientation="horizontal" lastRow = {false} />

        <BorderComponent id='1v5' borderColor="blue" orientation="vertical" lastRow = {false} />
        <BorderComponent id='1h5' borderColor="red" orientation="horizontal" lastRow = {false} />

        <BorderComponent id='1v6' borderColor="blue" orientation="vertical" lastRow = {false} />
        <BorderComponent id='1h6' borderColor="red" orientation="horizontal" lastRow = {false} />

        <BorderComponent id='1v7' borderColor="blue" orientation="vertical" lastRow = {false} />
      </View>
      <View style={styles.row}>
        <BorderComponent id='2v0' borderColor="blue" orientation="vertical" lastRow = {false} />
        <BorderComponent id='2h0' borderColor="red" orientation="horizontal" lastRow = {false} />

        <BorderComponent id='2v1' borderColor="blue" orientation="vertical" lastRow = {false} />
        <BorderComponent id='2h1' borderColor="red" orientation="horizontal" lastRow = {false} />

        <BorderComponent id='2v2' borderColor="blue" orientation="vertical" lastRow = {false} />
        <BorderComponent id='2h2' borderColor="red" orientation="horizontal" lastRow = {false} />

        <BorderComponent id='2v3' borderColor="blue" orientation="vertical" lastRow = {false} />
        <BorderComponent id='2h3' borderColor="red" orientation="horizontal" lastRow = {false} />

        <BorderComponent id='2v4' borderColor="blue" orientation="vertical" lastRow = {false} />
        <BorderComponent id='2h4' borderColor="red" orientation="horizontal" lastRow = {false} />

        <BorderComponent id='2v5' borderColor="blue" orientation="vertical" lastRow = {false} />
        <BorderComponent id='2h5' borderColor="red" orientation="horizontal" lastRow = {false} />

        <BorderComponent id='2v6' borderColor="blue" orientation="vertical" lastRow = {false} />
        <BorderComponent id='2h6' borderColor="red" orientation="horizontal" lastRow = {false} />

        <BorderComponent id='2v7' borderColor="blue" orientation="vertical" lastRow = {false} />
      </View>
      <View style={styles.row}>
        <BorderComponent id='3v0' borderColor="blue" orientation="vertical" lastRow = {false} />
        <BorderComponent id='3h0' borderColor="red" orientation="horizontal" lastRow = {false} />

        <BorderComponent id='3v1' borderColor="blue" orientation="vertical" lastRow = {false} />
        <BorderComponent id='3h1' borderColor="red" orientation="horizontal" lastRow = {false} />

        <BorderComponent id='3v2' borderColor="blue" orientation="vertical" lastRow = {false} />
        <BorderComponent id='3h2' borderColor="red" orientation="horizontal" lastRow = {false} />

        <BorderComponent id='3v3' borderColor="blue" orientation="vertical" lastRow = {false} />
        <BorderComponent id='3h3' borderColor="red" orientation="horizontal" lastRow = {false} />

        <BorderComponent id='3v4' borderColor="blue" orientation="vertical" lastRow = {false} />
        <BorderComponent id='3h4' borderColor="red" orientation="horizontal" lastRow = {false} />

        <BorderComponent id='3v5' borderColor="blue" orientation="vertical" lastRow = {false} />
        <BorderComponent id='3h5' borderColor="red" orientation="horizontal" lastRow = {false} />

        <BorderComponent id='3v6' borderColor="blue" orientation="vertical" lastRow = {false} />
        <BorderComponent id='3h6' borderColor="red" orientation="horizontal" lastRow = {false} />

        <BorderComponent id='3v7' borderColor="blue" orientation="vertical" lastRow = {false} />
      </View>
      <View style={styles.row}>
        <BorderComponent id='4v0' borderColor="blue" orientation="vertical" lastRow = {true} />
        <BorderComponent id='4h0' borderColor="red" orientation="horizontal" lastRow = {true} />

        <BorderComponent id='4v1' borderColor="blue" orientation="vertical" lastRow = {true} />
        <BorderComponent id='4h1' borderColor="red" orientation="horizontal" lastRow = {true} />

        <BorderComponent id='4v2' borderColor="blue" orientation="vertical" lastRow = {true} />
        <BorderComponent id='4h2' borderColor="red" orientation="horizontal" lastRow = {true} />

        <BorderComponent id='4v3' borderColor="blue" orientation="vertical" lastRow = {true} />
        <BorderComponent id='4h3' borderColor="red" orientation="horizontal" lastRow = {true} />

        <BorderComponent id='4v4' borderColor="blue" orientation="vertical" lastRow = {true} />
        <BorderComponent id='4h4' borderColor="red" orientation="horizontal" lastRow = {true} />

        <BorderComponent id='4v5' borderColor="blue" orientation="vertical" lastRow = {true} />
        <BorderComponent id='4h5' borderColor="red" orientation="horizontal" lastRow = {true} />

        <BorderComponent id='4v6' borderColor="blue" orientation="vertical" lastRow = {true} />
        <BorderComponent id='4h6' borderColor="red" orientation="horizontal" lastRow = {true} />

        <BorderComponent id='4v7' borderColor="blue" orientation="vertical" lastRow = {true} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flex: 1,
    position: 'absolute'
  },
  row: {
    flexDirection: 'row',
  },
});

export default GridComponent;