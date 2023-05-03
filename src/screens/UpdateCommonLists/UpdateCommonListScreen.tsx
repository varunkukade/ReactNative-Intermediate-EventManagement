import React, {ReactElement, useEffect} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {colors, measureMents} from '../../utils/appStyles';
import {useAppDispatch, useAppSelector} from '../../reduxConfig/store';
import ScreenWrapper from '../screenWrapper';
import {generateArray} from '../../utils/commonFunctions';
import {getCommonListsAPICall} from '../../reduxConfig/slices/peopleSlice';
import UpdateEachCommonList from './updateEachCommonList';
import {TextComponent} from '../../reusables';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/homeStackNavigator';
import { useNavigation } from '@react-navigation/native';
import EntypoIcons from 'react-native-vector-icons/Entypo';

const DisplayCommonLists = (): ReactElement => {
     //navigation and route state
  const navigation: NativeStackNavigationProp<
  HomeStackParamList,
  'UpdateCommonListScreen'
> = useNavigation();

  //recycler view states
  const skelatons = generateArray(5);

  //dispatch and selectors
  const dispatch = useAppDispatch();
  const peopleState = useAppSelector(state => state.people);
  const theme = useAppSelector(state => state.user.currentUser.theme);

  useEffect(() => {
    dispatch(getCommonListsAPICall({expanded: false}));
  }, []);

  return (
    <ScreenWrapper>
      <TextComponent
        style={{
          color: colors[theme].textColor,
          marginTop: 10,
          paddingHorizontal: measureMents.leftPadding,
        }}
        weight="semibold">
        Common List Count: {peopleState.commonLists.length}
      </TextComponent>
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
            <UpdateEachCommonList eachCommonList={item} />
          )}
          keyExtractor={item => item.commonListId.toString()}
        />
      ) : peopleState.statuses.getCommonListsAPICall === 'loading' ? (
        <View style={styles.commonListSkalatonContainer}>
          {skelatons.map((eachItem, index) => (
            <View
              key={index}
              style={[
                styles.commonListSkalaton,
                {backgroundColor: colors[theme].lavenderColor},
              ]}></View>
          ))}
        </View>
      ) : peopleState.statuses.getCommonListsAPICall === 'failed' ? (
        <View style={styles.commonListSkalatonContainer}>
          <View
            style={[
              styles.commonListSkalaton,
              {marginTop: 30, backgroundColor: colors[theme].lavenderColor},
            ]}>
            <TextComponent
              style={{color: colors[theme].textColor}}
              weight="bold">
              Failed to fetch common lists. Please try again after some time
            </TextComponent>
          </View>
        </View>
      ) : (
        <View style={styles.commonListSkalatonContainer}>
          <View
            style={[
              styles.commonListSkalaton,
              {
                marginTop: 30,
                backgroundColor: colors[theme].lavenderColor,
              },
            ]}>
            <TextComponent
              style={{color: colors[theme].textColor, fontSize: 16}}
              weight="bold">
              No Common Lists Found!
            </TextComponent>
          </View>
        </View>
      )}
      <TouchableOpacity
        onPress={() => navigation.navigate('CreateCommonList')}
        activeOpacity={0.7}
        style={[styles.addCustomListButton, { backgroundColor: colors[theme].commonPrimaryColor}]}>
        <EntypoIcons name="plus" color={colors[theme].whiteColor} size={20} />
      </TouchableOpacity>
    </ScreenWrapper>
  );
};

export default DisplayCommonLists;

const styles = StyleSheet.create({
  commonListSkalaton: {
    borderRadius: 20,
    paddingHorizontal: measureMents.leftPadding,
    paddingVertical: measureMents.leftPadding * 1.7,
    width: '100%',
    flexDirection: 'row',
    marginVertical: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  commonListSkalatonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: measureMents.leftPadding,
  },
  addCustomListButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 60,
    right: 25,
  },
});
