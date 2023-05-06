import React, {ReactElement} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {colors, measureMents} from '../utils/appStyles';
import {HomeStackParamList} from '../navigation/homeStackNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import TextComponent from '../reusables/text';
import {useAppSelector} from '../reduxConfig/store';
import {getDate, getTime} from '../utils/commonFunctions';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ButtonComponent} from '../reusables';
import ScreenWrapper from './screenWrapper';

const EventDetailsScreen = (): ReactElement | null => {
  //navigation and route
  const navigation: NativeStackNavigationProp<
    HomeStackParamList,
    'EventDetailsScreen'
  > = useNavigation();

  //selectors
  const selectedEventDetails = useAppSelector(
    state => state.events.currentSelectedEvent,
  );
  const theme = useAppSelector(state => state.user.currentUser.theme)

  if (!selectedEventDetails) return null;

  return (
    <ScreenWrapper>
      <ScrollView
        style={[styles.wrapperComponent]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.topSection}>
          <TextComponent
            weight="extraBold"
            style={{
              fontSize: 24,
              color: colors[theme].textColor,
              marginBottom: 24,
            }}>
            {selectedEventDetails.eventTitle}
          </TextComponent>
          <View style={styles.eventCommon}>
            <AntDesignIcons
              name="calendar"
              color={colors[theme].iconLightPinkColor}
              size={18}
              style={{marginRight: 20}}
            />
            <TextComponent
              weight="semibold"
              style={{
                color: colors[theme].textColor,
                fontSize: 16,
              }}>
              {getDate(new Date(selectedEventDetails.eventDate))},{' '}
              {getTime(new Date(selectedEventDetails.eventTime))}
            </TextComponent>
          </View>
          <View style={styles.eventCommon}>
            <Ionicons
              name="location-outline"
              color={colors[theme].iconLightPinkColor}
              size={22}
              style={{marginRight: 20}}
            />
            <TextComponent
              weight="semibold"
              style={{
                color: colors[theme].textColor,
                fontSize: 16,
              }}>
              {selectedEventDetails.eventLocation}
            </TextComponent>
          </View>
        </View>

        <View style={[styles.bottomSection, { backgroundColor: colors[theme].cardColor}]}>
          <View style={[styles.eventDetailsSubContainer1, { backgroundColor: colors[theme].lightLavenderColor}]}>
            <TextComponent style={[styles.commonText, { color: colors[theme].textColor}]} weight="bold">
              {selectedEventDetails.mealProvided
                ? 'Meals provided by organiser'
                : 'Meals not provided by organiser'}
            </TextComponent>
          </View>
          {selectedEventDetails.eventFees === '0' ? (
            <View style={[styles.eventDetailsSubContainer1, { backgroundColor: colors[theme].lightLavenderColor}]}>
              <TextComponent style={[styles.commonText, { color: colors[theme].textColor}]} weight="bold">
                Free Event
              </TextComponent>
            </View>
          ) : null}
          <View style={[styles.eventDetailsSubContainer1, { backgroundColor: colors[theme].lightLavenderColor}]}>
            <TextComponent style={[styles.commonText, { color: colors[theme].textColor}]} weight="bold">
              {selectedEventDetails.accomodationProvided
                ? 'Accomodation provided by organiser'
                : 'Accomodation not provided by organiser'}
            </TextComponent>
          </View>
          <View
            style={{
              borderBottomColor: colors[theme].greyColor,
              borderBottomWidth: StyleSheet.hairlineWidth,
              marginVertical: 20,
            }}
          />
          <TextComponent
            style={{fontSize: 17, color: colors[theme].textColor}}
            weight="extraBold">
            Description
          </TextComponent>
          <TextComponent
            numberOfLines={5}
            style={{fontSize: 16, color: colors[theme].textColor, marginTop: 10}}
            weight="normal">
            {selectedEventDetails.eventDesc}
          </TextComponent>
          <View
            style={{
              borderBottomColor: colors[theme].greyColor,
              borderBottomWidth: StyleSheet.hairlineWidth,
              marginVertical: 20,
            }}
          />
          {selectedEventDetails.eventFees !== '0' &&
          selectedEventDetails.eventFees !== '' ? (
            <>
              <TextComponent
                style={{fontSize: 17, color: colors[theme].textColor}}
                weight="extraBold">
                Fees
              </TextComponent>
              <TextComponent
                numberOfLines={5}
                style={{
                  fontSize: 16,
                  color: colors[theme].textColor,
                  marginTop: 10,
                }}
                weight="normal">
                Rs. {selectedEventDetails.eventFees}
              </TextComponent>
              <View
                style={{
                  borderBottomColor: colors[theme].greyColor,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  marginVertical: 20,
                }}
              />
            </>
          ) : null}
          <ButtonComponent
            onPress={() => navigation.navigate('EventJoinersScreen')}
            containerStyle={{marginBottom: 30}}>
            {' '}
            Go to People list 🚀
          </ButtonComponent>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default EventDetailsScreen;

const styles = StyleSheet.create({
  wrapperComponent: {
    flex: 1,
    paddingTop: 30,
  },
  eventCommon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  topSection: {
    paddingHorizontal: measureMents.leftPadding,
  },
  bottomSection: {
    paddingHorizontal: measureMents.leftPadding,
    paddingVertical: measureMents.leftPadding,
    flex: 1,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  eventDetailsSubContainer1: {
    paddingVertical: 10,
    marginBottom: 15,
    paddingHorizontal: measureMents.leftPadding,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  commonText: {
    fontSize: 14,
  },
});
