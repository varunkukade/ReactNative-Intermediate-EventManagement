import React, {ReactElement, useState} from 'react';
import {Alert, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {colors, measureMents} from '../utils/appStyles';
import InputComponent from '../reusables/inputComponent';
import ButtonComponent from '../reusables/buttonComponent';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import DateTimePickerComponent from '../reusables/dateTimePickerComponent';
import moment from 'moment';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../navigation/homeStackNavigator';
import {useNavigation} from '@react-navigation/native';
import uuid from 'react-native-uuid';
import { useAppDispatch } from '../reduxConfig/store';
import { addEventAPICall } from '../reduxConfig/slices/eventsSlice';

const constants = {
  eventTitle: 'eventTitle',
  eventDate: 'eventDate',
  eventTime:'eventTime',
  eventDesc: 'eventDesc',
  eventLocation: 'eventLocation',
  eventFees:'eventFees'
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
};

const AddEventScreen = (): ReactElement => {
  //navigation state
  const navigation: NativeStackNavigationProp<
    HomeStackParamList,
    'AddEventScreen'
  > = useNavigation();

  //dispatch and selectors
  const dispatch = useAppDispatch();

  //we are storing Date type in state and we will convert it to string for displaying on screen or passing to database.
  let initialEventForm: AddEventFormData = {
    eventTitle: {value: '', errorMessage: ''},
    eventDesc: {value : '', errorMessage: ''},
    eventDate: {value: new Date(), errorMessage: ''},
    eventTime: {value: new Date(), errorMessage: ''},
    eventLocation: {value: '', errorMessage: ''},
    eventFees: {value: '', errorMessage: ''}
  };
  const [eventForm, setEventForm] =
    useState<AddEventFormData>(initialEventForm);

  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);

  const onChangeForm = (value: string | Date, fieldName: string): void => {
    setEventForm({...eventForm, [fieldName]: {value: value, errorMessage: ''}});
  };

  const onFormSubmit = (): void => {
    const {eventTitle, eventDate, eventTime, eventDesc, eventLocation, eventFees} = eventForm;
    if (eventTitle.value && eventDate.value && eventTime.value && eventDesc.value && eventLocation.value) {
      let requestObj = {
        eventId: uuid.v4(),
        eventTitle: eventTitle.value,
        eventDate: eventDate.value.toString(),
        eventTime: eventTime.value.toString(),
        eventDesc: eventDesc.value,
        eventLocation: eventLocation.value,
        eventFees: eventFees.value
      }
      dispatch(addEventAPICall(requestObj))
      .then((resp)=> {
        if(resp.meta.requestStatus === "fulfilled"){
          Alert.alert('Event saved successfully');
          setEventForm(initialEventForm);
          navigation.navigate('HomeScreen');
        }else {
          Alert.alert('Error in saving the event. Please try after some time.');
        }
      })
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
          errorMessage: eventDesc.value ? '' : 'Event Description cannot be empty',
        },
        eventLocation: {
          ...eventLocation,
          errorMessage: eventLocation.value ? '' : 'Event Location cannot be empty',
        },
      });
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.wrapperComponent}>
        <InputComponent
          value={eventForm.eventTitle.value}
          onChangeText={value => onChangeForm(value, constants.eventTitle)}
          label="Event Title"
          errorMessage={eventForm.eventTitle.errorMessage}
          placeholder="Wedding"
        />
        <InputComponent
          value={eventForm.eventDesc.value}
          onChangeText={value => onChangeForm(value, constants.eventDesc)}
          label="Event Description"
          multiline
          numberOfLines={5}
          errorMessage={eventForm.eventDesc.errorMessage}
          placeholder="Add a informative description..."
        />
        <TouchableOpacity activeOpacity={0.7} onPress={() => setShowDatePicker(!showDatePicker)}>
          <InputComponent
            value={''}
            onChangeText={value => onChangeForm(value, constants.eventDate)}
            label="Event Date"
            editable={false}
            errorMessage={eventForm.eventDate.errorMessage}
            placeholder={moment(eventForm.eventDate.value).format('LL')}
            rightIconComponent={
              <AntDesignIcons
                style={{position: 'absolute', right: 15}}
                name="calendar"
                color={colors.primaryColor}
                size={20}
              />
            }
          />
        </TouchableOpacity>
        <View style={styles.dateTimePickerContainer}>
        <DateTimePickerComponent
          mode='date' 
          date={eventForm.eventDate.value}
          show={showDatePicker}
          minimumDate={new Date()}
          setDateValue={value => onChangeForm(value, constants.eventDate)}
        />
        </View>
        <TouchableOpacity activeOpacity={0.7} onPress={() => setShowTimePicker(!showTimePicker)}>
          <InputComponent
            value={''}
            onChangeText={value => onChangeForm(value, constants.eventTime)}
            label="Event Time"
            editable={false}
            errorMessage={eventForm.eventTime.errorMessage}
            placeholder={moment(eventForm.eventTime.value).format('LT')}
            rightIconComponent={
              <MaterialIcons
                style={{position: 'absolute', right: 15}}
                name="timer"
                color={colors.primaryColor}
                size={20}
              />
            }
          />
        </TouchableOpacity>
        <View style={styles.dateTimePickerContainer}>
        <DateTimePickerComponent
           mode='time' 
           date={eventForm.eventTime.value}
           show={showTimePicker}
           setDateValue={value => onChangeForm(value, constants.eventTime)}
        />
        </View>
        <InputComponent
          value={eventForm.eventLocation.value}
          onChangeText={value => onChangeForm(value, constants.eventLocation)}
          label="Event Location"
          multiline
          numberOfLines={5}
          errorMessage={eventForm.eventLocation.errorMessage}
          placeholder="Singh Residency, near Tarakpur bus Stand, Ahmednagar, 414003."
        />
        <InputComponent
          value={eventForm.eventFees.value}
          onChangeText={value => onChangeForm(value, constants.eventFees)}
          label="Event Fees"
          keyboardType='numeric'
          placeholder="Enter fees in ruppes..."
        />
        <ButtonComponent
          onPress={onFormSubmit}
          containerStyle={{marginTop: 30}}>
          Submit
        </ButtonComponent>
      </View>
    </ScrollView>
  );
};

export default AddEventScreen;

const styles = StyleSheet.create({
  wrapperComponent: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: measureMents.leftPadding,
  },
  dateTimePickerContainer: {
    marginBottom: 10,
    borderRadius: 20
  }
});
