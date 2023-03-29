import React, {ReactElement} from 'react';
import {StyleSheet, View} from 'react-native';
import {colors, measureMents} from '../utils/appStyles';
import {HomeStackParamList} from '../navigation/homeStackNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import TextComponent from '../reusables/textComponent';
import {useAppSelector} from '../reduxConfig/store';
import {getDate, getTime} from '../utils/commonFunctions';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';

const EventDetailsScreen = (): ReactElement => {
  //navigation and route
  const navigation: NativeStackNavigationProp<
    HomeStackParamList,
    'EventDetailsScreen'
  > = useNavigation();
  const route: RouteProp<HomeStackParamList, 'EventDetailsScreen'> = useRoute();

  //selectors
  const eventDetails = useAppSelector(state =>
    state.events.events.find(
      eachEvent => eachEvent.eventId == route.params.eventId,
    ),
  );

  return (
    <>
      {eventDetails ? (
        <View style={styles.wrapperComponent}>
          <TextComponent
            weight="extraBold"
            style={{
              fontSize: 24,
              color: colors.primaryColor,
              marginBottom: 24,
            }}>
            {eventDetails.eventTitle}
          </TextComponent>
          <View style={styles.eventCommon}>
            <AntDesignIcons
              name="calendar"
              color={colors.primaryColor}
              size={18}
              style={{marginRight: 20}}
            />
            <TextComponent
              weight="semibold"
              style={{
                color: colors.primaryColor,
                fontSize: 16,
              }}>
              {getDate(new Date(eventDetails.eventDate))},{' '}
              {getTime(new Date(eventDetails.eventTime))}
            </TextComponent>
          </View>
          <View style={styles.eventCommon}>
            <Ionicons
              name="location-outline"
              color={colors.primaryColor}
              size={22}
              style={{marginRight: 20}}
            />
            <TextComponent
              weight="semibold"
              style={{
                color: colors.primaryColor,
                fontSize: 17,
              }}>
              {eventDetails.eventLocation}
            </TextComponent>
          </View>
        </View>
      ) : null}
    </>
  );
};

export default EventDetailsScreen;

const styles = StyleSheet.create({
  wrapperComponent: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: measureMents.leftPadding,
  },
  eventCommon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
});
