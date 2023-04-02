import React, {ReactElement, useState} from 'react';
import {Alert, ScrollView, StyleSheet, View} from 'react-native';
import {measureMents} from '../utils/appStyles';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../navigation/homeStackNavigator';
import {useNavigation} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../reduxConfig/store';
import {ButtonComponent, InputComponent} from '../reusables';
import {mobileNumbervalidation} from '../utils/commonFunctions';
import { EachPerson, addPeopleAPICall } from '../reduxConfig/slices/peopleSlice';

type ConstantsType = {
  userName: 'userName';
  userMobileNumber: 'userMobileNumber';
  userEmail: 'userEmail';
};
const constants: ConstantsType = {
  userName: 'userName',
  userMobileNumber: 'userMobileNumber',
  userEmail: 'userEmail',
};

interface EachFormField<T> {
  value: T;
  errorMessage: string;
}

type AddPeopleFormData = {
  userName: EachFormField<string>;
  userMobileNumber: EachFormField<string>;
  userEmail: EachFormField<string>;
};

const AddPeopleScreen = (): ReactElement => {
  //navigation state
  const navigation: NativeStackNavigationProp<
    HomeStackParamList,
    'AddPeopleScreen'
  > = useNavigation();

  //dispatch and selectors
  const dispatch = useAppDispatch();
  const selectedEventDetails = useAppSelector(state => state.common.currentSelectedEvent);

  //we are storing Date type in state and we will convert it to string for displaying on screen or passing to database.
  let initialEventForm: AddPeopleFormData = {
    userName: {value: '', errorMessage: ''},
    userMobileNumber: {value: '', errorMessage: ''},
    userEmail: {value: '', errorMessage: ''},
  };
  const [eventForm, setEventForm] =
    useState<AddPeopleFormData>(initialEventForm);

  const onChangeForm = (
    value: string,
    fieldName: 'userName' | 'userMobileNumber' | 'userEmail',
  ): void => {
    setEventForm({
      ...eventForm,
      [fieldName]: {...eventForm[fieldName], value: value},
    });
  };

  const setFormErrors = (type? : "" | "empty", eventFormObj?: AddPeopleFormData) => {
    if (type === 'empty') {
      setEventForm({
        ...eventForm,
        userName: {
          ...eventForm.userName,
          errorMessage: '',
        },
        userMobileNumber: {
          ...eventForm.userMobileNumber,
          errorMessage: '',
        },
      });
    } else {
      if(eventFormObj) setEventForm(eventFormObj);
    }
  };

  const onFormSubmit = (): void => {
    const {userEmail, userMobileNumber, userName} = eventForm;
    if (
      mobileNumbervalidation(userMobileNumber.value).isValid &&
      userName.value
    ) {
      if(selectedEventDetails){
        setFormErrors('empty');
        let requestObj: Omit<EachPerson, 'userId'> = {
          userEmail: userEmail.value,
          userMobileNumber: userMobileNumber.value,
          userName: userName.value,
          isPaymentPending: true,
          eventId: selectedEventDetails.eventId,
        };
        dispatch(addPeopleAPICall(requestObj)).then(resp => {
          if (resp.meta.requestStatus === "fulfilled") {
            Alert.alert('User added successfully!');
            setEventForm(initialEventForm);
            navigation.navigate('EventJoinersTopTab')
          } else {
            Alert.alert('Error in adding the user. Please try after some time.');
          }
        });
      }
    } else {
      //set the errors if exist
      setFormErrors("", {
        ...eventForm,
        userName: {
          ...userName,
          errorMessage: userName.value ? '' : 'User Name cannot be empty.',
        },
        userMobileNumber: {
          ...userMobileNumber,
          errorMessage: mobileNumbervalidation(userMobileNumber.value)
            .errorMessage,
        },
      });
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.wrapperComponent}>
        <InputComponent
          value={eventForm.userName.value}
          onChangeText={value => onChangeForm(value, constants.userName)}
          label="Enter Name"
          errorMessage={eventForm.userName.errorMessage}
          placeholder="Varun Kukade"
        />
        <InputComponent
          value={eventForm.userMobileNumber.value}
          onChangeText={value =>
            onChangeForm(value, constants.userMobileNumber)
          }
          label="Enter Mobile Number"
          keyboardType="numeric"
          errorMessage={eventForm.userMobileNumber.errorMessage}
          placeholder="9028476756"
        />
        <InputComponent
          value={eventForm.userEmail.value}
          onChangeText={value => onChangeForm(value, constants.userEmail)}
          label="Enter Email"
          placeholder="varun.k@gmail.com"
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

export default AddPeopleScreen;

const styles = StyleSheet.create({
  wrapperComponent: {
    flex: 1,
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: measureMents.leftPadding,
  },
  dateTimePickerContainer: {
    marginBottom: 10,
    borderRadius: 20,
  },
});
