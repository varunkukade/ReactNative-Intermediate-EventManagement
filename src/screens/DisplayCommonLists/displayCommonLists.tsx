import React, {ReactElement, useCallback, useEffect} from 'react';
import {FlatList, Platform, StyleSheet, ToastAndroid, View} from 'react-native';
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
import DisplayEachCommonList from './displayEachCommonList';

const DisplayCommonLists = (): ReactElement => {
  //recycler view states
  const skelatons = generateArray(2);
  //navigation and route state
  const navigation: NativeStackNavigationProp<
    HomeStackParamList,
    'CreateCommonList'
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

  useEffect(() => {
    dispatch(getCommonListsAPICall({expanded: true}));
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
        navigation.navigate('EventJoinersTopTab');
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
            textAlign: 'center',
            marginBottom: 20,
          }}
          weight="semibold">
          
          {
            peopleState.commonLists.length === 0 ? `First create common list of people and then you can select people from it to add in ${currentSelectedEvent?.eventTitle}` : `Select people that you want to add in
            ${currentSelectedEvent?.eventTitle}`
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
            Failed to fetch common lists. Please try again after some time
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
            No Common Lists Found!
          </TextComponent>
        </View>
      )}
      {peopleState.commonLists.length > 0 ? (
        <View style={styles.addButton}>
          <ButtonComponent
            isDisabled={!isAtleastOneUserSelected()}
            onPress={addUsersToEvent}>
            Submit
          </ButtonComponent>
        </View>
      ) : null}
    </ScreenWrapper>
  );
};

export default DisplayCommonLists;

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
});
