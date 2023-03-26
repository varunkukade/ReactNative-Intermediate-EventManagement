import React, {ReactElement, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {colors, measureMents} from '../utils/appStyles';
import InputComponent from '../reusables/inputComponent';
import ButtonComponent from '../reusables/buttonComponent';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import DateTimePickerComponent from '../reusables/dateTimePickerComponent';
import moment from 'moment';

const constants = {
  eventTitle: 'eventTitle',
  eventDate: 'eventDate',
};

interface EachFormField<T> {
  value: T;
  errorMessage: string;
}

type AddEventFormData = {
  eventTitle: EachFormField<string>;
  eventDate: EachFormField<Date>;
};

const AddEventScreen = (): ReactElement => {
  //we are storing Date type in state and we will convert it to string for displaying on screen or passing to database.
  const [eventForm, setEventForm] = useState<AddEventFormData>({
    eventTitle: {value: '', errorMessage: ''},
    eventDate: {value: new Date(), errorMessage: ''},
  });

  const [show, setShow] = useState<boolean>(false);

  const onChangeForm = (value: string | Date, fieldName: string): void => {
    setEventForm({...eventForm, [fieldName]: {value: value, errorMessage: ''}});
  };

  const onFormSubmit = (): void => {
    const {eventTitle, eventDate} = eventForm;
    if (eventTitle.value && eventDate.value) {
      //make firebase API call to store the data on database
      console.log('All things done');
      console.log(eventForm);
    } else {
      //set the errors if exist
      setEventForm({
        eventTitle: {
          ...eventTitle,
          errorMessage: eventTitle.value ? '' : 'Event Name cannot be empty',
        },
        eventDate: {
          ...eventDate,
          errorMessage: eventDate.value ? '' : 'Event Date cannot be empty',
        },
      });
    }
  };

  return (
    <>
      <View style={styles.wrapperComponent}>
        <InputComponent
          value={eventForm.eventTitle.value}
          onChangeText={value => onChangeForm(value, constants.eventTitle)}
          label="Event Title"
          errorMessage={eventForm.eventTitle.errorMessage}
          placeholder="Wedding"
        />
        <TouchableOpacity activeOpacity={0.7} onPress={() => setShow(!show)}>
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
        <DateTimePickerComponent
          date={eventForm.eventDate.value}
          show={show}
          setDateValue={value => onChangeForm(value, constants.eventDate)}
        />
        <ButtonComponent
          onPress={onFormSubmit}
          containerStyle={{marginTop: 30}}>
          Submit
        </ButtonComponent>
      </View>
    </>
  );
};

export default AddEventScreen;

const styles = StyleSheet.create({
  wrapperComponent: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: measureMents.leftPadding,
  },
});
