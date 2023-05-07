import React, {ReactElement, useCallback, useEffect, useState} from 'react';
import {FlatList, Platform, RefreshControl, StyleSheet, ToastAndroid, View, } from 'react-native';
import {colors, measureMents} from '../utils/appStyles';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../navigation/homeStackNavigator';
import {useNavigation} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../reduxConfig/store';
import {ButtonComponent, TextComponent} from '../reusables';
import ScreenWrapper from './screenWrapper';
import {generateArray} from '../utils/commonFunctions';
import {
  EachPerson,
  addPeopleInBatchAPICall,
  getCommonListsAPICall,
  getPeopleAPICall,
  updateCommonList,
} from '../reduxConfig/slices/peopleSlice';

const SelectContactScreen = (): ReactElement => {
   
  //navigation and route state
  const navigation: NativeStackNavigationProp<
    HomeStackParamList,
    'SelectContactScreen'
  > = useNavigation();

  //dispatch and selectors
  const dispatch = useAppDispatch();

  //useStates

  
  return (
    <ScreenWrapper>
     
    </ScreenWrapper>
  );
};

export default SelectContactScreen;

const styles = StyleSheet.create({

});
