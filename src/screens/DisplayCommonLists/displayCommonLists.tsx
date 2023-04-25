import React, {ReactElement, useCallback, useEffect} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {colors, measureMents} from '../../utils/appStyles';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../../navigation/homeStackNavigator';
import {useNavigation} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../../reduxConfig/store';
import {TextComponent} from '../../reusables';
import ScreenWrapper from '../screenWrapper';
import {generateArray} from '../../utils/commonFunctions';
import {
  getCommonListsAPICall,
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
  const peopleState = useAppSelector(state => state.people);

  const theme = useAppSelector(state => state.user.currentUser.theme);

  useEffect(() => {
    dispatch(getCommonListsAPICall());
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
          Select people that you want to add in{' '}
          {currentSelectedEvent?.eventTitle}
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
              {backgroundColor: colors[theme].lavenderColor},
            ]}>
            {generateArray(3).map((eachSkalaton, index) => (
              <View
                key = {index}
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
            {marginTop: 30, backgroundColor: colors[theme].lavenderColor},
          ]}>
          <TextComponent style={{color: colors[theme].textColor}} weight="bold">
            Failed to fetch common lists. Please try again after some time
          </TextComponent>
        </View>
      ) : (
        <View
          style={[
            styles.commonListSkalaton,
            {marginTop: 30, backgroundColor: colors[theme].lavenderColor},
          ]}>
          <TextComponent
            style={{color: colors[theme].textColor, fontSize: 16}}
            weight="bold">
            No Common Lists Found!
          </TextComponent>
        </View>
      )}
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
    height: 300,
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
    width:"90%",
    marginBottom: measureMents.leftPadding
  },
});
