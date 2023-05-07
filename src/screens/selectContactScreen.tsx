import React, {ReactElement, useCallback, useEffect, useState} from 'react';
import {
    FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors, measureMents} from '../utils/appStyles';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../navigation/homeStackNavigator';
import {useNavigation} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../reduxConfig/store';
import {
  ButtonComponent,
  CheckboxComponent,
  ImageComponent,
  InputComponent,
  TextComponent,
} from '../reusables';
import ScreenWrapper from './screenWrapper';
import {generateArray} from '../utils/commonFunctions';
import {
  EachContact,
  EachPerson,
  addPeopleInBatchAPICall,
  getDeviceContactsAPICall,
  getPeopleAPICall,
  updateContacts,
  updateSelected,
} from '../reduxConfig/slices/peopleSlice';
import Animated, {
  Easing,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { debounce } from 'lodash';
import moment from 'moment';

const PROFILE_PICTURE_SIZE = 43;

const SelectContactScreen = (): ReactElement => {
  const skelatons = generateArray(8);

  //navigation and route state
  const navigation: NativeStackNavigationProp<
    HomeStackParamList,
    'SelectContactScreen'
  > = useNavigation();

  //dispatch and selectors
  const dispatch = useAppDispatch();
  const peopleState = useAppSelector(state => state.people);
  const theme = useAppSelector(state => state.user.currentUser.theme);
  const currentSelectedEvent = useAppSelector(
    state => state.events.currentSelectedEvent,
  );

  //useStates
  const [refreshing, setRefreshing] = useState(false);
  const [searchedValue, setSearchedValue] = useState('');

  useEffect(() => {
    dispatch(getDeviceContactsAPICall()).then(resp => {
      if (resp.payload && resp.meta.requestStatus === 'rejected') {
        if (Platform.OS === 'android')
          ToastAndroid.show(resp.payload?.message, ToastAndroid.SHORT);
      }
    });
    return () => {
      let updatedContacts = peopleState.contacts.map(eachContact => {
        return {
          ...eachContact,
          selected: false,
        };
      });
      dispatch(updateContacts(updatedContacts));
    };
  }, []);

  const addContactsToEvent = () => {
    if (!currentSelectedEvent) return null;
    let requestArr: Omit<EachPerson, 'userId'>[] = [];
    peopleState.originalContacts.forEach(eachContact => {
      if(eachContact.selected)
      requestArr.push({
        userEmail: eachContact.contactEmailAddress || '',
        userMobileNumber: eachContact.contactPhoneNumber || '',
        userName: eachContact.contactName,
        eventId: currentSelectedEvent.eventId,
        isPaymentPending: true,
        paymentMode: '',
        createdAt: new Date().toString(),
      });
    });
    dispatch(addPeopleInBatchAPICall(requestArr)).then(resp => {
      if (resp.meta.requestStatus === 'fulfilled') {
        if (Platform.OS === 'android' && resp.payload)
          ToastAndroid.show(resp.payload.message, ToastAndroid.SHORT);
        dispatch(getPeopleAPICall());
        navigation.navigate('GuestListScreen');
      } else {
        if (Platform.OS === 'android' && resp.payload)
          ToastAndroid.show(resp.payload.message, ToastAndroid.SHORT);
      }
    });
  };

  const onContactSelected = (value: boolean, id: string) => {
    dispatch(updateSelected({value, id}));
  };

  const getSkalatonName = (fullName: string) => {
    let arr = fullName.split(' ');
    if (arr.length > 1) {
      return arr[0][0].toUpperCase() + arr[1][0].toUpperCase();
    } else {
      return arr[0][0].toUpperCase();
    }
  };

  const getSelectedCount = () => {
    let count = 0;
    peopleState.originalContacts.forEach(eachContact => {
      if (eachContact.selected) count += 1;
    });
    return count;
  }

  const showSearchedContacts = useCallback(
    debounce(searchedValue => {
      let updatedContacts: EachContact[];
      if (searchedValue === '') {
        updatedContacts = peopleState.originalContacts.map(eachContact => {
          return eachContact;
        });
      } else {
        let updatedSearchValue: string = searchedValue
          .toLowerCase()
          .trim()
          .split(' ')
          .join('');
        updatedContacts = peopleState.originalContacts.filter(eachContact => {
          if (
            eachContact.contactName &&
            eachContact.contactName
              .toLowerCase()
              .trim()
              .split(' ')
              .join('')
              .includes(updatedSearchValue)
          ) {
            return true;
          } else if(eachContact.contactPhoneNumber &&
            eachContact.contactPhoneNumber
              .trim()
              .split(' ')
              .join('')
              .includes(updatedSearchValue)){
            return true;
          }
        });
      }
      dispatch(updateContacts(updatedContacts));
    }, 1000),
    [dispatch, peopleState.originalContacts],
  );

  const handleContactSearch = (searchedValue: string) => {
    setSearchedValue(searchedValue);
    showSearchedContacts(searchedValue);
  };


  const renderEachContact = (item: EachContact) => {
    return (
      <View>
        <TouchableOpacity
          style={[
            styles.mainContainer,
            {
              backgroundColor: colors[theme].cardColor,
              borderRadius: 20,
              marginBottom: measureMents.leftPadding,
            },
          ]}
          activeOpacity={0.7}
          onPress={() => onContactSelected(!item.selected, item.contactId)}>
          <View style={styles.avatar}>
            {item.contactAvatar === '' ? (
              <View
                style={[
                  styles.profilePicSkaleton,
                  {
                    backgroundColor: colors[theme].lightLavenderColor,
                    alignSelf: 'flex-start',
                  },
                ]}>
                <TextComponent
                  style={{color: colors[theme].textColor}}
                  weight="semibold">
                  {getSkalatonName(item.contactName)}
                </TextComponent>
              </View>
            ) : (
              <ImageComponent
                source={{uri: item.contactAvatar}}
                style={{
                  width: PROFILE_PICTURE_SIZE,
                  height: PROFILE_PICTURE_SIZE,
                  borderRadius: PROFILE_PICTURE_SIZE / 2,
                  alignSelf: 'flex-start',
                }}
              />
            )}
          </View>
          <View style={styles.textComponentContainer}>
            <TextComponent
              weight="semibold"
              style={{color: colors[theme].textColor}}>
              {item.contactName}
            </TextComponent>
            {item.contactPhoneNumber ? (
              <TextComponent
                weight="semibold"
                style={{color: colors[theme].greyColor, marginTop: 5}}>
                {item.contactPhoneNumber}
              </TextComponent>
            ) : null}
          </View>
          <View style={styles.checkBoxContainer}>
            <CheckboxComponent
              value={item.selected}
              onValueChange={value => onContactSelected(value, item.contactId)}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScreenWrapper>
      <View
        style={[
          styles.searchInput,
          {backgroundColor: colors[theme].cardColor},
        ]}>
        <InputComponent
          value={searchedValue}
          placeholder='Search through name / cell no...'
          onChangeText={value => handleContactSearch(value)}
        />
      </View>
      {peopleState.statuses.getDeviceContactsAPICall === 'succeedded' &&
      peopleState.contacts.length > 0 ? (
        <FlatList
          data={peopleState.contacts}
          style={{
            paddingHorizontal: measureMents.leftPadding,
            paddingVertical: measureMents.leftPadding,
            marginBottom: 20,
          }}
          renderItem={({item}) => renderEachContact(item)}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={async () => {
                setRefreshing(true);
                dispatch(getDeviceContactsAPICall()).then(resp => {
                  if (resp.payload && resp.meta.requestStatus === 'rejected') {
                    if (Platform.OS === 'android')
                      ToastAndroid.show(
                        resp.payload?.message,
                        ToastAndroid.SHORT,
                      );
                  }
                  setRefreshing(false);
                });
              }}
            />
          }
          keyExtractor={item => item.contactId.toString()}
        />
      ) : peopleState.statuses.getDeviceContactsAPICall === 'loading' ? (
        skelatons.map((eachItem, index) => (
          <View
            key={index}
            style={[
              styles.contactsSkalaton,
              {backgroundColor: colors[theme].lavenderColor, height: 60},
            ]}
          />
        ))
      ) : peopleState.statuses.getDeviceContactsAPICall === 'failed' ? (
        <View
          style={[
            styles.contactsSkalaton,
            {
              marginTop: 30,
              height: 100,
              backgroundColor: colors[theme].lavenderColor,
            },
          ]}>
          <TextComponent style={{color: colors[theme].textColor}} weight="bold">
            Failed to fetch contacts. Please try again after some time
          </TextComponent>
        </View>
      ) : (
        <View
          style={[
            styles.contactsSkalaton,
            {
              marginTop: 30,
              height: 60,
              backgroundColor: colors[theme].lavenderColor,
            },
          ]}>
          <TextComponent
            style={{color: colors[theme].textColor, fontSize: 16}}
            weight="bold">
            No records found!
          </TextComponent>
        </View>
      )}
      {peopleState.statuses.getDeviceContactsAPICall === 'succeedded' &&
      peopleState.contacts.length > 0 ? (
        <View style={styles.addButton}>
          <ButtonComponent
            isDisabled={getSelectedCount() > 0 ? false : true}
            onPress={addContactsToEvent}>
            {getSelectedCount() === 0
              ? 'ADD'
              : getSelectedCount() === 1
              ? `Add 1 User`
              : `Add ${getSelectedCount()} Users`}
          </ButtonComponent>
        </View>
      ) : null}
    </ScreenWrapper>
  );
};

export default SelectContactScreen;

const styles = StyleSheet.create({
  contactsSkalaton: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: measureMents.leftPadding,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: measureMents.leftPadding,
  },
  addButton: {
    paddingHorizontal: measureMents.leftPadding,
    paddingBottom: 20,
  },
  mainContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: measureMents.leftPadding,
    paddingVertical: measureMents.leftPadding,
    width: '100%',
    flexDirection: 'row',
  },
  textComponentContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: '72%',
    flexDirection: 'column',
  },
  checkBoxContainer: {
    width: '10%',
  },
  avatar: {
    width: '18%',
  },
  profilePicSkaleton: {
    width: PROFILE_PICTURE_SIZE,
    height: PROFILE_PICTURE_SIZE,
    borderRadius: PROFILE_PICTURE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInput: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: measureMents.leftPadding - 10,
    marginHorizontal: measureMents.leftPadding,
    borderRadius: 20,
  },
});
