import React, {ReactElement, useCallback, useEffect, useState} from 'react';
import {FlatList, Platform, RefreshControl, StyleSheet, ToastAndroid, TouchableOpacity, View} from 'react-native';
import {colors, measureMents} from '../../utils/appStyles';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../../navigation/homeStackNavigator';
import {useNavigation} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../../reduxConfig/store';
import {ButtonComponent, TextComponent} from '../../reusables';
import ScreenWrapper from '../screenWrapper';
import {generateArray} from '../../utils/commonFunctions';
import {
  EachPerson,
  addPeopleInBatchAPICall,
  getCommonListsAPICall,
  getPeopleAPICall,
  updateCommonList,
} from '../../reduxConfig/slices/peopleSlice';
import DisplayEachCommonList from './displayEachCommonGroup';
import EntypoIcons from 'react-native-vector-icons/Entypo';

const DisplayCommonGroups = (): ReactElement => {
  //recycler view states
  const skelatons = generateArray(2);
  //navigation and route state
  const navigation: NativeStackNavigationProp<
    HomeStackParamList,
    'CreateCommonGroup'
  > = useNavigation();

  //dispatch and selectors
  const dispatch = useAppDispatch();
  const currentSelectedEvent = useAppSelector(
    state => state.events.currentSelectedEvent,
  );
  const selectedEventDetails = useAppSelector(
    state => state.events.currentSelectedEvent,
  );
  const peopleState = useAppSelector(state => state.people);
  const theme = useAppSelector(state => state.user.currentUser.theme);

  //useStates
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(getCommonListsAPICall({expanded: true})).then((resp) => {
      if (resp.payload && resp.meta.requestStatus === 'rejected') {
        if (Platform.OS === 'android')
          ToastAndroid.show(
            resp.payload?.message,
            ToastAndroid.SHORT,
          );
      }
    })
  }, []);

  const expandCommonList = useCallback(
    (id: string) => {
      let updatedArr = peopleState.commonLists.map(eachCommonList => {
        if (eachCommonList.commonListId === id)
          return {...eachCommonList, expanded: !eachCommonList.expanded};
        else return eachCommonList;
      });
      dispatch(updateCommonList(updatedArr));
    },
    [peopleState.commonLists, dispatch],
  );

  const onUserSelected = useCallback(
    (value: boolean, commonListId: string, userId: string) => {
      let updatedArr = peopleState.commonLists.map(eachCommonList => {
        if (eachCommonList.commonListId === commonListId) {
          let updatedUserArr = eachCommonList.users.map(eachUser => {
            if (eachUser.userId === userId)
              return {...eachUser, selected: value};
            else return eachUser;
          });
          return {...eachCommonList, users: updatedUserArr};
        } else return eachCommonList;
      });
      dispatch(updateCommonList(updatedArr));
    },
    [peopleState.commonLists, dispatch],
  );

  const onAllUsersSelected = useCallback(
    (value: boolean, commonListId: string) => {
      let updatedArr = peopleState.commonLists.map(eachCommonList => {
        if (eachCommonList.commonListId === commonListId) {
          let updatedUserArr = eachCommonList.users.map(eachUser => {
            return {...eachUser, selected: value};
          });
          return {...eachCommonList, users: updatedUserArr};
        } else return eachCommonList;
      });
      dispatch(updateCommonList(updatedArr));
    },
    [peopleState.commonLists, dispatch],
  );

  const isAtleastOneUserSelected = () => {
    let isAtleastOneUserSelected = false;
    peopleState.commonLists.map(eachCommonList => {
      if (eachCommonList.users.some(eachUser => eachUser.selected))
        isAtleastOneUserSelected = true;
    });
    return isAtleastOneUserSelected;
  };

  const getSelectedCount = () => {
    let count = 0;
    peopleState.commonLists.map(eachCommonList => {
      let innerCount = eachCommonList.users.reduce((prevValue, currentValue) => {
        return prevValue + (currentValue.selected ? 1 : 0);
      }, 0);
      count = count + innerCount
    });
    return count;
  }

  const addUsersToEvent = () => {
    if (!selectedEventDetails) return null;
    let requestArr: Omit<EachPerson, 'userId'>[] = [];
    peopleState.commonLists.forEach(eachCommonList => {
      let newArr: Omit<EachPerson, 'userId'>[] = eachCommonList.users
        .filter(eachUser => eachUser.selected)
        .map(({selected, userId, ...rest}) => {
          return {
            ...rest,
            eventId: selectedEventDetails.eventId,
            createdAt: new Date().toString(),
          };
        });
      requestArr.push(...newArr);
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

  return (
    <ScreenWrapper>
      <View style={styles.description}>
        <TextComponent
          style={{
            fontSize: 15,
            color: colors[theme].textColor,
            
            marginBottom: 20,
          }}
          weight="semibold">
          {
            peopleState.commonLists.length === 0 ? `First create common group of users and then you can select users from it to add in ${currentSelectedEvent?.eventTitle} event.` : `Select users that you want to add in ${currentSelectedEvent?.eventTitle} as a guests.`
          }
        </TextComponent>
      </View>
      {peopleState.statuses.getCommonListsAPICall === 'succeedded' &&
      peopleState.commonLists.length > 0 ? (
        <FlatList
          data={peopleState.commonLists}
          style={{
            paddingHorizontal: measureMents.leftPadding,
            paddingVertical: measureMents.leftPadding,
            marginBottom: 20,
          }}
          renderItem={({item}) => (
            <DisplayEachCommonList
              expandCommonList={expandCommonList}
              eachCommonList={item}
              onUserSelected={onUserSelected}
              onAllUsersSelected={onAllUsersSelected}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={async () => {
                setRefreshing(true);
                dispatch(getCommonListsAPICall({expanded: true})).then((resp) => {
                  if (resp.payload && resp.meta.requestStatus === 'rejected') {
                    if (Platform.OS === 'android')
                      ToastAndroid.show(
                        resp.payload?.message,
                        ToastAndroid.SHORT,
                      );
                  }
                  setRefreshing(false);
                })
              }}
            />
          }
          keyExtractor={item => item.commonListId.toString()}
        />
      ) : peopleState.statuses.getCommonListsAPICall === 'loading' ? (
        skelatons.map((eachItem, index) => (
          <View
            key={index}
            style={[
              styles.commonListSkalaton,
              {backgroundColor: colors[theme].lavenderColor, height: 300},
            ]}>
            {generateArray(3).map((eachSkalaton, index) => (
              <View
                key={index}
                style={[
                  styles.eachUser,
                  {backgroundColor: colors[theme].lightLavenderColor},
                ]}></View>
            ))}
          </View>
        ))
      ) : peopleState.statuses.getCommonListsAPICall === 'failed' ? (
        <View
          style={[
            styles.commonListSkalaton,
            {marginTop: 30, height: 100, backgroundColor: colors[theme].lavenderColor},
          ]}>
          <TextComponent style={{color: colors[theme].textColor}} weight="bold">
            Failed to fetch common groups. Please try again after some time
          </TextComponent>
        </View>
      ) : (
        <View
          style={[
            styles.commonListSkalaton,
            {marginTop: 30, height: 100, backgroundColor: colors[theme].lavenderColor},
          ]}>
          <TextComponent
            style={{color: colors[theme].textColor, fontSize: 16}}
            weight="bold">
            No records found!
          </TextComponent>
        </View>
      )}
      {peopleState.commonLists.length > 0 ? (
        <View style={styles.addButton}>
          <ButtonComponent
            isDisabled={!isAtleastOneUserSelected()}
            onPress={addUsersToEvent}>
              {
                isAtleastOneUserSelected() ? (
                  `ADD ${getSelectedCount()} USERS`
                ): `ADD`
              }
          </ButtonComponent>
        </View>
      ) : null}
      <TouchableOpacity
        onPress={() => navigation.navigate('CreateCommonGroup')}
        activeOpacity={0.7}
        style={[
          styles.addCustomListButton,
          {backgroundColor: colors[theme].commonPrimaryColor},
        ]}>
        <EntypoIcons name="plus" color={colors[theme].whiteColor} size={20} />
      </TouchableOpacity>
    </ScreenWrapper>
  );
};

export default DisplayCommonGroups;

const styles = StyleSheet.create({
  description: {
    paddingTop: 10,
    paddingHorizontal: measureMents.leftPadding,
  },
  commonListSkalaton: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: measureMents.leftPadding,
  },
  eachUser: {
    paddingHorizontal: measureMents.leftPadding,
    borderRadius: 20,
    paddingVertical: measureMents.leftPadding * 1.4,
    width: '90%',
    marginBottom: measureMents.leftPadding,
  },
  addButton: {
    paddingHorizontal: measureMents.leftPadding,
    paddingBottom: 20,
  },
  addCustomListButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 80,
    right: 25,
  },
});
