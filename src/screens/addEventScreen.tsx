import React, { ReactElement, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  ToastAndroid,
  Platform,
} from 'react-native';
import { colors, measureMents } from '@/utils/appStyles';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/navigation/homeStackNavigator';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@/reduxConfig/store';
import {
  addEventAPICall,
  EachEvent,
  updateEventAPICall,
} from '@/reduxConfig/slices/eventsSlice';
import {
  ButtonComponent,
  CheckboxComponent,
  DateTimePickerComponent,
  InputComponent,
} from '@/reusables';
import { getDate, getTime } from '@/utils/commonFunctions';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import ScreenWrapper from './screenWrapper';
import { screens } from '@/utils/constants';

const constants = {
  eventTitle: 'eventTitle',
  eventDate: 'eventDate',
  eventTime: 'eventTime',
  eventDesc: 'eventDesc',
  eventLocation: 'eventLocation',
  eventFees: 'eventFees',
  mealProvided: 'mealProvided',
  accomodationProvided: 'accomodationProvided',
};

interface EachFormField<T> {
  value: T;
  errorMessage: string;
}

type AddEventFormData = {
  eventTitle: EachFormField<string>;
  eventDate: EachFormField<Date>;
  eventDesc: EachFormField<string>;
  eventTime: EachFormField<Date>;
  eventLocation: EachFormField<string>;
  eventFees: EachFormField<string>;
  mealProvided: EachFormField<boolean>;
  accomodationProvided: EachFormField<boolean>;
};

const AddEventScreen = (): ReactElement => {
  //navigation and route state
  const navigation: NativeStackNavigationProp<
    HomeStackParamList,
    'AddEventScreen'
  > = useNavigation();

  const route: RouteProp<HomeStackParamList, 'AddEventScreen'> = useRoute();

  //dispatch and selectors
  const dispatch = useAppDispatch();
  const selectedEventDetails = route.params?.longPressedEvent;
  const theme = useAppSelector((state) => state.user.currentUser.theme);

  //we are storing Date type in state and we will convert it to string for displaying on screen or passing to database.
  let initialEventForm: AddEventFormData = {
    eventTitle: {
      value: selectedEventDetails ? selectedEventDetails.eventTitle : '',
      errorMessage: '',
    },
    eventDesc: {
      value: selectedEventDetails ? selectedEventDetails.eventDesc : '',
      errorMessage: '',
    },
    eventDate: {
      value: selectedEventDetails
        ? new Date(selectedEventDetails.eventDate)
        : new Date(),
      errorMessage: '',
    },
    eventTime: {
      value: selectedEventDetails
        ? new Date(selectedEventDetails.eventTime)
        : new Date(),
      errorMessage: '',
    },
    eventLocation: {
      value: selectedEventDetails ? selectedEventDetails.eventLocation : '',
      errorMessage: '',
    },
    eventFees: {
      value: selectedEventDetails ? selectedEventDetails.eventFees : '',
      errorMessage: '',
    },
    mealProvided: {
      value: selectedEventDetails ? selectedEventDetails.mealProvided : true,
      errorMessage: '',
    },
    accomodationProvided: {
      value: selectedEventDetails
        ? selectedEventDetails.accomodationProvided
        : false,
      errorMessage: '',
    },
  };
  const [eventForm, setEventForm] =
    useState<AddEventFormData>(initialEventForm);

  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);

  const onChangeForm = (
    value: string | Date | boolean,
    fieldName: string,
  ): void => {
    setEventForm({
      ...eventForm,
      [fieldName]: { value: value, errorMessage: '' },
    });
  };

  const currentUser = auth().currentUser;

  const getRequestObj = (user: FirebaseAuthTypes.User) => {
    const {
      eventTitle,
      eventDate,
      eventTime,
      eventDesc,
      eventLocation,
      eventFees,
      mealProvided,
      accomodationProvided,
    } = eventForm;
    return {
      eventTitle: eventTitle.value,
      eventDate: eventDate.value.toString(),
      eventTime: eventTime.value.toString(),
      eventDesc: eventDesc.value,
      eventLocation: eventLocation.value,
      eventFees: eventFees.value,
      mealProvided: mealProvided.value,
      accomodationProvided: accomodationProvided.value,
      createdBy: user?.uid,
    };
  };

  const addNewEvent = () => {
    if (!currentUser) return;
    dispatch(addEventAPICall(getRequestObj(currentUser))).then((resp) => {
      if (resp.meta.requestStatus === 'fulfilled') {
        if (Platform.OS === 'android' && resp.payload)
          ToastAndroid.show(resp.payload.message, ToastAndroid.SHORT);
        setEventForm(initialEventForm);
        //Navigation state object - https://reactnavigation.org/docs/navigation-state/
        navigation.reset({
          index: 0,
          routes: [
            {
              name: screens.BottomTabNavigator,
              state: {
                index: 0,
                routes: [{ name: screens.Home }],
              },
            },
          ],
        });
      } else {
        if (Platform.OS === 'android' && resp.payload)
          ToastAndroid.show(resp.payload.message, ToastAndroid.SHORT);
      }
    });
  };

  const updateExistingEvent = () => {
    if (!currentUser || !selectedEventDetails) return;
    let requestObj: { newUpdate: Omit<EachEvent, 'eventId'>; eventId: string } =
      {
        newUpdate: getRequestObj(currentUser),
        eventId: selectedEventDetails?.eventId,
      };
    dispatch(updateEventAPICall(requestObj)).then((resp) => {
      if (resp.meta.requestStatus === 'fulfilled') {
        if (Platform.OS === 'android' && resp.payload)
          ToastAndroid.show(resp.payload.message, ToastAndroid.SHORT);
        setEventForm(initialEventForm);
        //difference in navigation.pop and navigation.reset - pop removes current component from list but preserves the previous component in stack and navigate (focus) to that component
        //reset removes all the previous history of stacks and navigate (mount) to new component.
        navigation.pop();
      } else {
        if (Platform.OS === 'android' && resp.payload)
          ToastAndroid.show(resp.payload.message, ToastAndroid.SHORT);
      }
    });
  };

  const onFormSubmit = (): void => {
    if (!currentUser) return;
    const { eventTitle, eventDate, eventTime, eventDesc, eventLocation } =
      eventForm;
    if (
      eventTitle.value &&
      eventDate.value &&
      eventTime.value &&
      eventDesc.value &&
      eventLocation.value
    ) {
      if (selectedEventDetails) {
        updateExistingEvent();
      } else {
        addNewEvent();
      }
    } else {
      //set the errors if exist
      setEventForm({
        ...eventForm,
        eventTitle: {
          ...eventTitle,
          errorMessage: eventTitle.value ? '' : 'Event Name cannot be empty',
        },
        eventDate: {
          ...eventDate,
          errorMessage: eventDate.value ? '' : 'Event Date cannot be empty',
        },
        eventTime: {
          ...eventTime,
          errorMessage: eventTime.value ? '' : 'Event Time cannot be empty',
        },
        eventDesc: {
          ...eventDesc,
          errorMessage: eventDesc.value
            ? ''
            : 'Event Description cannot be empty',
        },
        eventLocation: {
          ...eventLocation,
          errorMessage: eventLocation.value
            ? ''
            : 'Event Location cannot be empty',
        },
      });
    }
  };

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.mainContainer,
            { backgroundColor: colors[theme].cardColor },
          ]}
        >
          <InputComponent
            value={eventForm.eventTitle.value}
            onChangeText={(value) => onChangeForm(value, constants.eventTitle)}
            label="Event Title"
            required
            errorMessage={eventForm.eventTitle.errorMessage}
            placeholder="Event Title"
          />
          <InputComponent
            value={eventForm.eventDesc.value}
            onChangeText={(value) => onChangeForm(value, constants.eventDesc)}
            label="Event Description"
            multiline
            required
            numberOfLines={5}
            errorMessage={eventForm.eventDesc.errorMessage}
            placeholder="Add a informative description..."
          />
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowDatePicker(!showDatePicker)}
          >
            <InputComponent
              value={''}
              onChangeText={(value) => onChangeForm(value, constants.eventDate)}
              label="Event Date"
              editable={false}
              required
              errorMessage={eventForm.eventDate.errorMessage}
              placeholder={getDate(eventForm.eventDate.value)}
              rightIconComponent={
                <AntDesignIcons
                  style={{ position: 'absolute', right: 15 }}
                  name="calendar"
                  color={colors[theme].iconLightPinkColor}
                  size={20}
                />
              }
            />
          </TouchableOpacity>
          <View style={styles.dateTimePickerContainer}>
            <DateTimePickerComponent
              mode="date"
              date={eventForm.eventDate.value}
              show={showDatePicker}
              minimumDate={new Date()}
              setDateValue={(value) => onChangeForm(value, constants.eventDate)}
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowTimePicker(!showTimePicker)}
          >
            <InputComponent
              value={''}
              required
              onChangeText={(value) => onChangeForm(value, constants.eventTime)}
              label="Event Time"
              editable={false}
              errorMessage={eventForm.eventTime.errorMessage}
              placeholder={getTime(eventForm.eventTime.value)}
              rightIconComponent={
                <MaterialIcons
                  style={{ position: 'absolute', right: 15 }}
                  name="timer"
                  color={colors[theme].iconLightPinkColor}
                  size={20}
                />
              }
            />
          </TouchableOpacity>
          <View style={styles.dateTimePickerContainer}>
            <DateTimePickerComponent
              mode="time"
              date={eventForm.eventTime.value}
              show={showTimePicker}
              setDateValue={(value) => onChangeForm(value, constants.eventTime)}
            />
          </View>
          <InputComponent
            value={eventForm.eventLocation.value}
            onChangeText={(value) =>
              onChangeForm(value, constants.eventLocation)
            }
            label="Event Location"
            multiline
            required
            numberOfLines={5}
            errorMessage={eventForm.eventLocation.errorMessage}
            placeholder="Add event location..."
          />
          <InputComponent
            value={eventForm.eventFees.value}
            onChangeText={(value) => onChangeForm(value, constants.eventFees)}
            label="Event Fees"
            keyboardType="numeric"
            placeholder="Enter fees in ruppes..."
          />
          <CheckboxComponent
            label="Meal provided by organiser ?"
            value={eventForm.mealProvided.value}
            onValueChange={(value) =>
              onChangeForm(value, constants.mealProvided)
            }
          />
          <CheckboxComponent
            label="Accomodation provided by organiser ?"
            value={eventForm.accomodationProvided.value}
            onValueChange={(value) =>
              onChangeForm(value, constants.accomodationProvided)
            }
          />
          <ButtonComponent
            onPress={onFormSubmit}
            containerStyle={{ marginTop: 30 }}
          >
            Submit
          </ButtonComponent>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default AddEventScreen;

const styles = StyleSheet.create({
  dateTimePickerContainer: {
    marginBottom: 10,
    borderRadius: 20,
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: measureMents.leftPadding,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 30,
    paddingBottom: 30,
    marginTop: 20,
  },
});
