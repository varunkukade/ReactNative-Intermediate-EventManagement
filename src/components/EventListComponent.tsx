import React, {ReactElement, useEffect} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {colors, measureMents} from '../utils/appStyles';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';
import TextComponent from '../reusables/textComponent';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import { useAppDispatch, useAppSelector } from '../reduxConfig/store';
import { generateArray } from '../utils/commonFunctions';
import { EachEvent, getEventsAPICall } from '../reduxConfig/slices/eventsSlice';
import moment from 'moment';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/homeStackNavigator';
import { useNavigation } from '@react-navigation/native';
import { setSelectedEvent } from '../reduxConfig/slices/commonSlice';

const EventListComponent = (): ReactElement => {

  const skelatons = generateArray(5);
  let dataProvider = new DataProvider((r1, r2) => {
    return r1 !== r2;
  });
  
  //navigation
  const navigation: NativeStackNavigationProp<HomeStackParamList, "HomeScreen"> =
    useNavigation();

  //dispatch and selectors
  const dispatch = useAppDispatch();
  const eventsState = useAppSelector(state => state.events)
  const eventsData = dataProvider.cloneWithRows(eventsState.events);
 
  useEffect(()=> {
    //when this screen is mounted call getEvents API.
    //if you want to call something when screen is focused, use useFocusEffect.
    dispatch(getEventsAPICall())
  }, [])


  //layout provider helps recycler view to get the dimensions straight ahead and avoid the expensive calculation
  let layoutProvider = new LayoutProvider(
    index => {
      return 0;
    },
    (type, dim) => {
      dim.width = measureMents.windowWidth - 2 * measureMents.leftPadding;
      dim.height = 100;
    },
  );
  
  //Given type and data return the View component
  const rowRenderer = (
    type: number,
    data: EachEvent,
    index: number,
  ): ReactElement => {
    return (
      <View key={index} style={styles.eachEventComponent}>
        <View style={styles.secondSection}>
          <TextComponent
            weight="normal"
            style={{
              color: colors.primaryColor,
              fontSize: 14,
            }}>
            {data.eventTitle}
          </TextComponent>
          <TextComponent
            weight="bold"
            style={{
              color: colors.primaryColor,
              fontSize: 15,
            }}>
            {moment(new Date(data.eventDate)).format('LL')}
          </TextComponent>
        </View>
        <View style={styles.thirdSection}>
          <TouchableOpacity activeOpacity={0.7} onPress={()=> {
            dispatch(setSelectedEvent(data))
            navigation.navigate("EventDetailsScreen")
          }} style={styles.navigateButton}>
            <EntypoIcons
              name="chevron-right"
              color={colors.whiteColor}
              size={20}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.eventListContainer}>
      <TextComponent
        weight="bold"
        style={{color: colors.primaryColor, fontSize: 15, marginBottom: 10}}>
        Total Events:{' '}
        {eventsData?.getSize() && eventsData?.getSize() > 0
          ? eventsData?.getSize()
          : 0}
      </TextComponent>
      {eventsState.status === "succeedded" && eventsData?.getSize() > 0 ? (
        <RecyclerListView
          rowRenderer={rowRenderer}
          dataProvider={eventsData}
          layoutProvider={layoutProvider}
          initialRenderIndex={0}
          scrollViewProps={{showsVerticalScrollIndicator: false}}
        />
      ) : eventsState.status === "loading" ? (
        skelatons.map((eachItem, index) => (
          <View key={index} style={styles.eventLoadingSkelaton} />
        ))
      ) : eventsState.status === "failed" ? (
        <View style={[styles.eventLoadingSkelaton, {marginTop: 30}]}>
          <TextComponent weight="bold">{eventsState.error}</TextComponent>
        </View>
      ): (
        <View style={[styles.eventLoadingSkelaton, {marginTop: 30}]}>
          <TextComponent weight="bold">No Events Found!</TextComponent>
        </View>
      )}
    </View>
  );
};

export const MemoizedEventListComponent = React.memo(EventListComponent);

const styles = StyleSheet.create({
  eventListContainer: {
    flex: 1,
    marginTop: 25,
  },
  eachEventComponent: {
    backgroundColor: colors.whiteColor,
    height: 90,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: measureMents.leftPadding,
  },
  eventLoadingSkelaton: {
    backgroundColor: colors.lavenderColor,
    height: 90,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondSection: {
    width: '80%',
    height: '100%',
    justifyContent: 'space-evenly',
  },
  thirdSection: {
    width: '20%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigateButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
