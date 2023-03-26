import React, {ReactElement, useState} from 'react';
import {StyleSheet,View} from 'react-native';
import { measureMents} from '../utils/appStyles';
import InputComponent from '../reusables/inputComponent';
import ButtonComponent from '../reusables/buttonComponent';

const constants = {
  eventTitle: 'eventTitle',
  eventDate: 'eventDate',
};

type EachFormField = {
  value: string;
  errorMessage: string;
};

type AddEventFormData = {
  eventTitle: EachFormField;
  eventDate: EachFormField;
};

const AddEventScreen = (): ReactElement => {
  const [eventForm, setEventForm] = useState<AddEventFormData>({
    eventTitle: {value: '', errorMessage: ''},
    eventDate: {value: '', errorMessage: ''},
  });

  const onChangeForm = (value: string, fieldName: string): void => {
    setEventForm({...eventForm, [fieldName]: {value: value, errorMessage: ''}});
  };

  const onFormSubmit = () :void => {
    const { eventTitle, eventDate } = eventForm;
    if(eventTitle.value && eventDate.value){
         //make firebase API call to store the data on database
    }else {
        setEventForm({eventTitle: {...eventTitle, errorMessage: eventTitle.value ? '' : 'Event Name cannot be empty'}, eventDate: {...eventDate, errorMessage: eventDate.value ? '' : 'Event Date cannot be empty' }});
    }
  };

  return (
    <View style={styles.wrapperComponent}>
      <InputComponent
        value={eventForm.eventTitle.value}
        onChangeText={value => onChangeForm(value, constants.eventTitle)}
        label="Event Title"
        errorMessage={eventForm.eventTitle.errorMessage}
        placeholder="Wedding"
      />
      <InputComponent
        value={eventForm.eventDate.value}
        onChangeText={value => onChangeForm(value, constants.eventDate)}
        label="Event Date"
        errorMessage={eventForm.eventDate.errorMessage}
        placeholder = "11/12/2023"
      />
      <ButtonComponent
        onPress={onFormSubmit}
        containerStyle={{marginTop: 30}}>
        Submit
      </ButtonComponent>
    </View>
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
