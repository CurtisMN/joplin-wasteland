import React, {useEffect, useState} from 'react';
import {Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Audio} from "expo-av";
let radio1 = new Audio.Sound((mode = {staysActiveInBackground: true}));
let time = 0;
let radioLength = 0;

const Radio = ({ activeTab }) => {
  const [radioStartTime, setRadioStartTime] = useState();
  const [radioFileLoaded, setRadioFileLoaded] = useState(false);
  const [activeStation, setActiveStation] = useState();
  const [devMode, setDevMode] = useState(false);
  const formatMilliseconds = ms => {
    let milliseconds = parseInt(ms % 1000);
    let seconds = parseInt((ms / 1000) % 60);
    let minutes = parseInt((ms / (1000 * 60)) % 60);
    let hours = parseInt((ms / (1000 * 60 * 60)) % 24);

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    milliseconds = milliseconds < 100 ? '0' + milliseconds : milliseconds;
    milliseconds = milliseconds < 10 ? '0' + milliseconds : milliseconds;

    return hours + ':' + minutes + ':' + seconds + ':' + milliseconds;
  };

  useEffect(() => {
    Audio.setAudioModeAsync({staysActiveInBackground: true});
    setRadioStartTime(new Date('10/11/2019'));
    radio1
      .loadAsync(require('../assets/sounds/radio1.mp3'), {}, false) .then(() => { setRadioFileLoaded(true) })
      .catch(error => {
        console.log(error);
      });
  },[])

  return activeTab !== 'radio' ? null : (
    <View style={[styles.content, styles.radio]}>
      <View
        style={{
          width: '100%',
          paddingTop: 30,
          flex: 0,
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <Text style={{color: 'rgb(117, 250, 76)', fontSize: 30}}>
          Stations
        </Text>
      </View>
      {radioFileLoaded && (
        <TouchableOpacity
          onPress={() => {
            if (activeStation !== 'jar1') {
              var diff = new Date().getTime();

              // console.log(`\nHH:MM:SS:MlS`)
              // console.log(formatMilliseconds(diff))

              radio1.setIsLoopingAsync(true);
              radio1.getStatusAsync().then(function (result) {
                let len = result.durationMillis;
                radioLength = result.durationMillis;
                time = formatMilliseconds(diff % len);
                console.log(diff % len);
                console.log(formatMilliseconds(diff % len));
                radio1.playFromPositionAsync(diff % len);
              });
            } else {
              radio1.stopAsync();
            }

            setActiveStation(activeStation === 'jar1' ? '' : 'jar1')
          }}>
          <Text
            style={[
              styles.radioStationText,
              activeStation === 'jar1' &&
              styles.radioStationTextActive,
            ]}>Joplin Atomic Radio - FM</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={() => {
          Linking.openURL(
            'https://drive.google.com/file/d/18N5mt-UG0r-9vybiVJ_mlu5rCUG1h_tt/vie://drive.google.com/file/d/1Gx63VFtjXlBBCeSDaah4O9CJ_u0S0oel/view',
          );
        }}>
        <Text style={[styles.radioStationText]}>
          Joplin Atomic Radio [DOWNLOAD]
        </Text>
      </TouchableOpacity>
      <View
        style={{
          width: '100%',
          paddingTop: 30,
          borderBottomWidth: 1,
          borderBottomColor: 'rgb(117, 250, 76)',
        }}
      />
      <View style={{width: '100%', paddingTop: 30, paddingLeft: 15}}>
        <Text style={styles.radioStationTextOutOfRangeLabel}>
          OUT OF RANGE
        </Text>
      </View>
      {!radioFileLoaded && (
        <Text
          style={[
            styles.radioStationText,
            styles.radioStationTextOutOfRange,
          ]}>
          Joplin Atomic Radio FM - ACQUIRING SIGNAL
        </Text>
      )}
      <Text
        style={[
          styles.radioStationText,
          styles.radioStationTextOutOfRange,
        ]}>
        NOAA Weather
      </Text>
      <Text
        style={[
          styles.radioStationText,
          styles.radioStationTextOutOfRange,
        ]}>
        Kansas City Now
      </Text>
      <TouchableOpacity
        activeOpacity={1}
        onLongPress={() => {
          devMode
            ? alert('Dev mode deactivated')
            : alert('Dev mode activated');
          setDevMode(!devMode)
        }}>
        <Text
          style={[
            styles.radioStationText,
            styles.radioStationTextOutOfRange,
          ]}>
          Branson Classics
        </Text>
      </TouchableOpacity>
      <Text
        style={[
          styles.radioStationText,
          styles.radioStationTextOutOfRange,
        ]}>
        Webb City Tunes
      </Text>
      {devMode && (
        <Text
          style={[
            styles.radioStationText,
            styles.radioStationTextOutOfRange,
          ]}>
          {'radioFileLoaded: ' +
          radioFileLoaded +
          '\n' +
          'radioStartTime: ' +
          radioStartTime +
          '\n' +
          'currentFileTime: ' +
          time +
          '\n' +
          'radioLength: ' +
          radioLength}
        </Text>
      )}
    </View>
  )
}
export default Radio;

const styles = StyleSheet.create({
  content: {
    zIndex: 1,
    position: 'absolute',
    bottom: 0,
    height: '100%',
    width: '100%',
    paddingTop: 100,
  },
  radioStationText: {
    color: 'rgb(117, 250, 76)',
    marginTop: 15,
    paddingLeft: 15,
    marginRight: 30,
    padding: 3,
  },
  radioStationTextActive: {
    color: 'rgb(36,43,36)',
    backgroundColor: 'rgb(117, 250, 76)',
  },
  radioStationTextOutOfRangeLabel: {
    fontSize: 20,
    color: 'gray',
  },
  radioStationTextOutOfRange: {
    color: 'gray',
  },
});