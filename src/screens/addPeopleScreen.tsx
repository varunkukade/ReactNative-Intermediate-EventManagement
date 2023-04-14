import React, {ReactElement, useState} from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  View,
} from 'react-native';
import {colors, measureMents} from '../utils/appStyles';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../navigation/homeStackNavigator';
import {useNavigation} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../reduxConfig/store';
import {
  ButtonComponent,
  CheckboxComponent,
  InputComponent,
  RadioButtonComponent,
} from '../reusables';
import {mobileNumbervalidation} from '../utils/commonFunctions';
import {
  EachPerson,
  addPeopleAPICall,
  getPeopleAPICall,
} from '../reduxConfig/slices/peopleSlice';

type ConstantsType = {
  userName: 'userName';
  userMobileNumber: 'userMobileNumber';
  userEmail: 'userEmail';
  isPaymentCompleted: 'isPaymentCompleted';
};
const constants: ConstantsType = {
  userName: 'userName',
  userMobileNumber: 'userMobileNumber',
  userEmail: 'userEmail',
  isPaymentCompleted: 'isPaymentCompleted',
};

interface EachFormField<T> {
  value: T;
  errorMessage: string;
}

type AddPeopleFormData = {
  userName: EachFormField<string>;
  userMobileNumber: EachFormField<string>;
  userEmail: EachFormField<string>;
  isPaymentCompleted: EachFormField<boolean>;
};

export type EachPaymentMethod = {
  id: number;
  value: boolean;
  name: 'Cash' | 'Online';
  selected: boolean;
};

const AddPeopleScreen = (): ReactElement => {
  //navigation state
  const navigation: NativeStackNavigationProp<
    HomeStackParamList,
    'AddPeopleScreen'
  > = useNavigation();

  //dispatch and selectors
  const dispatch = useAppDispatch();
  const selectedEventDetails = useAppSelector(
    state => state.events.currentSelectedEvent,
  );

  //we are storing Date type in state and we will convert it to string for displaying on screen or passing to database.
  let initialEventForm: AddPeopleFormData = {
    userName: {value: '', errorMessage: ''},
    userMobileNumber: {value: '', errorMessage: ''},
    userEmail: {value: '', errorMessage: ''},
    isPaymentCompleted: {value: false, errorMessage: ''},
  };
  const [eventForm, setEventForm] =
    useState<AddPeopleFormData>(initialEventForm);

  const [paymentModes, setPaymentModes] = useState<EachPaymentMethod[]>([
    {id: 1, value: true, name: 'Cash', selected: true},
    {id: 2, value: false, name: 'Online', selected: false},
  ]);

  const onChangeForm = (
    value: string | boolean,
    fieldName:
      | 'userName'
      | 'userMobileNumber'
      | 'userEmail'
      | 'isPaymentCompleted',
  ): void => {
    setEventForm({
      ...eventForm,
      [fieldName]: {...eventForm[fieldName], value: value},
    });
  };

  const setFormErrors = (
    type?: '' | 'empty',
    eventFormObj?: AddPeopleFormData,
  ) => {
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
      if (eventFormObj) setEventForm(eventFormObj);
    }
  };

  const onFormSubmit = (): void => {
    const {userEmail, userMobileNumber, userName, isPaymentCompleted} =
      eventForm;
    if (
      mobileNumbervalidation(userMobileNumber.value).isValid &&
      userName.value
    ) {
      console.log('hey');
      if (selectedEventDetails) {
        console.log('hii');
        setFormErrors('empty');
        let requestObj: Omit<EachPerson, 'userId'> = {
          userEmail: userEmail.value,
          userMobileNumber: userMobileNumber.value,
          userName: userName.value,
          isPaymentPending: !isPaymentCompleted.value,
          eventId: selectedEventDetails.eventId,
        };
        if (isPaymentCompleted.value) {
          paymentModes.forEach(eachMode => {
            if (eachMode.selected) requestObj.paymentMode = eachMode.name;
          });
        }else {
          requestObj.paymentMode = ""
        }
        dispatch(addPeopleAPICall(requestObj)).then(resp => {
          if (resp.meta.requestStatus === 'fulfilled') {
            if (Platform.OS === 'android' && resp.payload)
              ToastAndroid.show(resp.payload.message, ToastAndroid.SHORT);
            setEventForm(initialEventForm);
            dispatch(getPeopleAPICall());
            navigation.navigate('EventJoinersTopTab');
          } else {
            if (Platform.OS === 'android' && resp.payload)
              ToastAndroid.show(resp.payload.message, ToastAndroid.SHORT);
          }
        });
      }
    } else {
      //set the errors if exist
      setFormErrors('', {
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

  const onRadioBtnClick = (item: EachPaymentMethod) => {
    let updatedState = paymentModes.map(eachMethod =>
      eachMethod.id === item.id
        ? {...eachMethod, selected: true}
        : {...eachMethod, selected: false},
    );
    setPaymentModes(updatedState);
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
        <CheckboxComponent
          label="Check this if User has completed the payment"
          value={eventForm.isPaymentCompleted.value}
          onValueChange={value =>
            onChangeForm(value, constants.isPaymentCompleted)
          }
        />
        {eventForm.isPaymentCompleted.value ? (
          <View style={styles.paymentModes}>
            {paymentModes.map(item => (
              <RadioButtonComponent
                onPress={() => onRadioBtnClick(item)}
                selected={item.selected}
                key={item.id}>
                {item.name}
              </RadioButtonComponent>
            ))}
          </View>
        ) : null}
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
    backgroundColor: colors.whiteColor,
  },
  dateTimePickerContainer: {
    marginBottom: 10,
    borderRadius: 20,
  },
  paymentModes: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
});
