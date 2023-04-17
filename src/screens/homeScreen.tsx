import React, {ReactElement, useState} from 'react';
import {Alert, StyleSheet, TouchableOpacity, View} from 'react-native';
import {MemoizedEventListComponent} from '../components/eventListComponent';
import {MemoizedWelcomeComponent} from '../components/welcomeComponent';
import {colors, measureMents} from '../utils/appStyles';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {HomeStackParamList} from '../navigation/homeStackNavigator';
import ScreenWrapper from './screenWrapper';

const HomeScreen = (): ReactElement => {
  //navigation state
  const navigation: NativeStackNavigationProp<
    HomeStackParamList,
    'BottomTabNavigator'
  > = useNavigation();
    
  const onAddEventClick = () => {
    navigation.navigate('AddEventScreen');
  };
  return (
    <>
      <ScreenWrapper>
        <View style={styles.wrapperComponent}>
          <MemoizedWelcomeComponent />
          <MemoizedEventListComponent />
        </View>
      </ScreenWrapper>
      <TouchableOpacity
        onPress={onAddEventClick}
        activeOpacity={0.7}
        style={styles.addEventButton}>
        <EntypoIcons name="plus" color={colors.whiteColor} size={20} />
      </TouchableOpacity>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  wrapperComponent: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: measureMents.leftPadding,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
  },
  addEventButtonContainer: {
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addEventButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 15,
    right: 15,
  },
});
