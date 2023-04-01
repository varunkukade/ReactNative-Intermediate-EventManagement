import React, {ReactElement} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {colors, measureMents} from '../utils/appStyles';
import {HomeStackParamList} from '../navigation/homeStackNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import TextComponent from '../reusables/textComponent';
import {useAppSelector} from '../reduxConfig/store';
import {getDate, getTime} from '../utils/commonFunctions';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ButtonComponent } from '../reusables';

const EventDetailsScreen = (): ReactElement | null => {
  //navigation and route
  const navigation: NativeStackNavigationProp<
    HomeStackParamList,
    'EventDetailsScreen'
  > = useNavigation();
  const route: RouteProp<HomeStackParamList, 'EventDetailsScreen'> = useRoute();

  //selectors
  const selectedEventDetails = useAppSelector(state => state.common.currentSelectedEvent);

  if (!selectedEventDetails) return null;

  return (
    <ScrollView style={styles.wrapperComponent} showsVerticalScrollIndicator={false}>
      <View style={styles.topSection}>
        <TextComponent
          weight="extraBold"
          style={{
            fontSize: 24,
            color: colors.primaryColor,
            marginBottom: 24,
          }}>
          {selectedEventDetails.eventTitle}
        </TextComponent>
        <View style={styles.eventCommon}>
          <AntDesignIcons
            name="calendar"
            color={colors.iconLightPinkColor}
            size={18}
            style={{marginRight: 20}}
          />
          <TextComponent
            weight="semibold"
            style={{
              color: colors.primaryColor,
              fontSize: 16,
            }}>
            {getDate(new Date(selectedEventDetails.eventDate))},{' '}
            {getTime(new Date(selectedEventDetails.eventTime))}
          </TextComponent>
        </View>
        <View style={styles.eventCommon}>
          <Ionicons
            name="location-outline"
            color={colors.iconLightPinkColor}
            size={22}
            style={{marginRight: 20}}
          />
          <TextComponent
            weight="semibold"
            style={{
              color: colors.primaryColor,
              fontSize: 16,
            }}>
            {selectedEventDetails.eventLocation}
          </TextComponent>
        </View>
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.eventDetailsSubContainer1}>
          <TextComponent style={styles.commonText} weight="bold">
            {selectedEventDetails.mealProvided
              ? 'Meals provided by organiser'
              : 'Meals not provided by organiser'}
          </TextComponent>
        </View>
        {selectedEventDetails.eventFees === '0' ? (
          <View style={styles.eventDetailsSubContainer1}>
            <TextComponent style={styles.commonText} weight="bold">
              Free Event
            </TextComponent>
          </View>
        ) : null}
        <View style={styles.eventDetailsSubContainer1}>
          <TextComponent style={styles.commonText} weight="bold">
            {selectedEventDetails.accomodationProvided
              ? 'Accomodation provided by organiser'
              : 'Accomodation not provided by organiser'}
          </TextComponent>
        </View>
        <View
          style={{
            borderBottomColor: colors.greyColor,
            borderBottomWidth: StyleSheet.hairlineWidth,
            marginVertical: 20,
          }}
        />
        <TextComponent
          style={{fontSize: 17, color: colors.primaryColor}}
          weight="extraBold">
          Description
        </TextComponent>
        <TextComponent
          numberOfLines={5}
          style={{fontSize: 16, color: colors.primaryColor, marginTop: 10}}
          weight="normal">
          {selectedEventDetails.eventDesc}
        </TextComponent>
        <View
          style={{
            borderBottomColor: colors.greyColor,
            borderBottomWidth: StyleSheet.hairlineWidth,
            marginVertical: 20,
          }}
        />
        {selectedEventDetails.eventFees !== "0" ? (
          <>
            <TextComponent
              style={{fontSize: 17, color: colors.primaryColor}}
              weight="extraBold">
              Fees
            </TextComponent>
            <TextComponent
              numberOfLines={5}
              style={{fontSize: 16, color: colors.primaryColor, marginTop: 10}}
              weight="normal">
              Rs. {selectedEventDetails.eventFees}
            </TextComponent>
          </>
        ) : null}
        <View
          style={{
            borderBottomColor: colors.greyColor,
            borderBottomWidth: StyleSheet.hairlineWidth,
            marginVertical: 20,
          }}
        />
        <ButtonComponent onPress={() => navigation.navigate("EventJoinersTopTab") } containerStyle={{marginBottom: 30}}> Go to People list  🚀</ButtonComponent>
      </View>
    </ScrollView>
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
    backgroundColor: colors.whiteColor,
    paddingHorizontal: measureMents.leftPadding,
    paddingVertical: measureMents.leftPadding,
    flex: 1,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  },
  eventDetailsSubContainer1: {
    paddingVertical: 10,
    backgroundColor: colors.lavenderColor,
    marginBottom: 15,
    paddingHorizontal: measureMents.leftPadding,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  commonText: {
    color: colors.primaryColor,
    fontSize: 14,
  },
});
