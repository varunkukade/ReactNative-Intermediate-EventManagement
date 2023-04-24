import React, {ReactElement, useState, useCallback, useEffect} from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Keyboard,
  Platform,
  ToastAndroid,
  TouchableOpacity,
} from 'react-native';
import {colors, measureMents} from '../../utils/appStyles';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../../navigation/homeStackNavigator';
import {useNavigation} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../../reduxConfig/store';
import {ButtonComponent, InputComponent, TextComponent} from '../../reusables';
import ScreenWrapper from '../screenWrapper';
import uuid from 'react-native-uuid';
import {
  emailValidation,
  generateArray,
  mobileNumbervalidation,
} from '../../utils/commonFunctions';
import CenterPopupComponent, {popupData} from '../../reusables/centerPopup';
import {MAX_BULK_ADDITION} from '../../utils/constants';
import {
  EachPerson,
  addCommonListAPICall,
  getCommonListsAPICall,
} from '../../reduxConfig/slices/peopleSlice';
import auth from '@react-native-firebase/auth';
import EntypoIcons from 'react-native-vector-icons/Entypo';

interface EachFormField<T> {
  value: T;
  errorMessage: string;
}

export type EachUserFormData = {
  userId: string | number[];
  expanded: boolean;
  userName: EachFormField<string>;
  userMobileNumber?: EachFormField<string>;
  userEmail?: EachFormField<string>;
  isValidUser: '' | 'YES' | 'NO';
};

export type EachPaymentMethod = {
  id: number;
  value: boolean;
  name: 'Cash' | 'Online';
  selected: boolean;
};

const DisplayCommonLists = (): ReactElement => {
  //navigation and route state
  const navigation: NativeStackNavigationProp<
    HomeStackParamList,
    'CreateCommonList'
  > = useNavigation();

  //dispatch and selectors
  const dispatch = useAppDispatch();
  const currentSelectedEvent = useAppSelector(state => state.events.currentSelectedEvent)
  const theme = useAppSelector(state => state.user.currentUser.theme);


  useEffect(() => {
     dispatch(getCommonListsAPICall())
  }, [])

  return (
    <ScreenWrapper>
      <View style={styles.description}>
          <TextComponent
            style={{
              fontSize: 15,
              color: colors[theme].textColor,
              textAlign: 'center',
              marginBottom: 20,
            }}
            weight="semibold">
            Select people that you want to add in {currentSelectedEvent?.eventTitle}
          </TextComponent>
        </View>
    </ScreenWrapper>
  );
};

export default DisplayCommonLists;

const styles = StyleSheet.create({
    description: {
        paddingTop: 10,
        paddingHorizontal: measureMents.leftPadding,
      },
});
