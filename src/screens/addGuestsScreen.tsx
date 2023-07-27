import React, {ReactElement, useCallback, useState} from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
  PermissionsAndroid,
  Linking
} from 'react-native';
import {colors, measureMents} from '@/utils/appStyles';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from '@/navigation/homeStackNavigator';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '@/reduxConfig/store';
import {
  ButtonComponent,
  CheckboxComponent,
  InputComponent,
  RadioButtonComponent,
  TextComponent,
} from '@/reusables';
import {mobileNumbervalidation} from '@/utils/commonFunctions';
import {
  EachPerson,
  addPeopleAPICall,
  getPeopleAPICall,
  updatePeopleAPICall,
  updatePeopleAPICallRequest,
} from '@/reduxConfig/slices/peopleSlice';
import ScreenWrapper from './screenWrapper';
import CenterPopupComponent, {popupData} from '@/reusables/centerPopup';

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

const AddGuestsScreen = (): ReactElement => {
  //navigation and route state
  const navigation: NativeStackNavigationProp<
    HomeStackParamList,
    'AddGuestsScreen'
  > = useNavigation();

  const route: RouteProp<HomeStackParamList, 'AddGuestsScreen'> = useRoute();

  //dispatch and selectors
  const dispatch = useAppDispatch();
  const selectedEventDetails = useAppSelector(
    state => state.events.currentSelectedEvent,
  );
  const theme = useAppSelector(state => state.user.currentUser.theme);

  let longPressedUser = route.params?.longPressedUser;

  //we are storing Date type in state and we will convert it to string for displaying on screen or passing to database.
  let initialEventForm: AddPeopleFormData = {
    userName: {
      value: longPressedUser ? longPressedUser.userName : '',
      errorMessage: '',
    },
    userMobileNumber: {
      value: longPressedUser ? longPressedUser.userMobileNumber : '',
      errorMessage: '',
    },
    userEmail: {
      value: longPressedUser ? longPressedUser.userEmail : '',
      errorMessage: '',
    },
    isPaymentCompleted: {
      value: longPressedUser ? !longPressedUser.isPaymentPending : false,
      errorMessage: '',
    },
  };
  const [eventForm, setEventForm] =
    useState<AddPeopleFormData>(initialEventForm);

  const [paymentModes, setPaymentModes] = useState<EachPaymentMethod[]>([
    {
      id: 1,
      value: true,
      name: 'Cash',
      selected: longPressedUser ? longPressedUser.paymentMode === 'Cash' : true,
    },
    {
      id: 2,
      value: false,
      name: 'Online',
      selected: longPressedUser
        ? longPressedUser.paymentMode === 'Online'
        : false,
    },
  ]);
  const [permissionModal, setPermissionModal] = useState(false)

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

  const updateTheUser = () => {
    if (!selectedEventDetails || !longPressedUser) return null;
    const {userEmail, userMobileNumber, userName, isPaymentCompleted} =
      eventForm;
    let requestObj: updatePeopleAPICallRequest = {
      userId: longPressedUser?.userId,
      newUpdate: {
        userEmail: userEmail.value,
        userMobileNumber: userMobileNumber.value,
        userName: userName.value,
        isPaymentPending: !isPaymentCompleted.value,
        eventId: selectedEventDetails.eventId,
      },
    };
    if (isPaymentCompleted.value) {
      paymentModes.forEach(eachMode => {
        if (eachMode.selected) requestObj.newUpdate.paymentMode = eachMode.name;
      });
    } else {
      requestObj.newUpdate.paymentMode = '';
    }
    dispatch(updatePeopleAPICall(requestObj)).then(resp => {
      if (resp.meta.requestStatus === 'fulfilled') {
        if (Platform.OS === 'android' && resp.payload)
          ToastAndroid.show(resp.payload.message, ToastAndroid.SHORT);
        setEventForm(initialEventForm);
        navigation.pop();
      } else {
        if (Platform.OS === 'android' && resp.payload)
          ToastAndroid.show(resp.payload.message, ToastAndroid.SHORT);
      }
    });
  };

  const createNewUser = () => {
    if (!selectedEventDetails) return null;
    const {userEmail, userMobileNumber, userName, isPaymentCompleted} =
      eventForm;
    let requestObj: Omit<EachPerson, 'userId'> = {
      userEmail: userEmail.value,
      userMobileNumber: userMobileNumber.value,
      userName: userName.value,
      isPaymentPending: !isPaymentCompleted.value,
      eventId: selectedEventDetails.eventId,
      createdAt: new Date().toString(),
    };
    if (isPaymentCompleted.value) {
      paymentModes.forEach(eachMode => {
        if (eachMode.selected) requestObj.paymentMode = eachMode.name;
      });
    } else {
      requestObj.paymentMode = '';
    }
    dispatch(addPeopleAPICall(requestObj)).then(resp => {
      if (resp.meta.requestStatus === 'fulfilled') {
        if (Platform.OS === 'android' && resp.payload)
          ToastAndroid.show(resp.payload.message, ToastAndroid.SHORT);
        setEventForm(initialEventForm);
        dispatch(getPeopleAPICall());
        navigation.navigate('GuestListScreen');
      } else {
        if (Platform.OS === 'android' && resp.payload)
          ToastAndroid.show(resp.payload.message, ToastAndroid.SHORT);
      }
    });
  };

  const onFormSubmit = (): void => {
    const {userMobileNumber, userName} = eventForm;
    if (
      (!userMobileNumber?.value.trim() ||
        mobileNumbervalidation(userMobileNumber.value.trim()).isValid) &&
      userName.value.trim()
    ) {
      if (selectedEventDetails) {
        setFormErrors('empty');
        if (longPressedUser) {
          updateTheUser();
        } else {
          createNewUser();
        }
      }
    } else {
      //set the errors if exist
      const newUserMobileNumber =
        !userMobileNumber?.value.trim() ||
        mobileNumbervalidation(userMobileNumber.value.trim()).isValid
          ? {...userMobileNumber, errorMessage: ''}
          : {
              ...userMobileNumber,
              errorMessage: mobileNumbervalidation(
                userMobileNumber.value.trim(),
              ).errorMessage,
            };
      setFormErrors('', {
        ...eventForm,
        userName: {
          ...userName,
          errorMessage: userName.value ? '' : 'User Name cannot be empty.',
        },
        userMobileNumber: newUserMobileNumber
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

  const checkIfPermissionsGiven = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        navigation.navigate('SelectContactScreen')
      } else {
        setPermissionModal(true);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const onConfirmClick = useCallback(()=> {
    setPermissionModal(false)
    Linking.openSettings();
  }, [Linking])

  const onCancelClick = useCallback(() => {
    setPermissionModal(false)
  }, [setPermissionModal]);

  //create new instance of this function only when dependencies change
  const permissionPopupData = useCallback((): popupData => {
    return {
      header: 'Permission required!',
      description: 'Permission is required to acccess Contacts. Please first give permissions from Settings.',
      onCancelClick: onCancelClick,
      onConfirmClick: onConfirmClick,
      confirmButtonText: "Go to Settings",
      cancelButtonText: "Cancel"
    };
  }, [onCancelClick, onConfirmClick]);

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.mainContainer,
            {backgroundColor: colors[theme].cardColor},
          ]}>
          <InputComponent
            value={eventForm.userName.value}
            onChangeText={value => onChangeForm(value, constants.userName)}
            label="Enter Name"
            required
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
          {!longPressedUser ? (
            <>
              <TouchableOpacity
                onPress={() => navigation.navigate('DisplayCommonGroups')}
                activeOpacity={0.6}>
                <TextComponent
                  weight="semibold"
                  style={{
                    color: colors[theme].textColor,
                    fontSize: 15,
                    marginTop: 20,
                    textAlign: 'center',
                  }}>
                  {' '}
                  Add from common group 👉🏻
                </TextComponent>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={checkIfPermissionsGiven}
                activeOpacity={0.6}>
                <TextComponent
                  weight="semibold"
                  style={{
                    color: colors[theme].textColor,
                    fontSize: 15,
                    marginTop: 20,
                    textAlign: 'center',
                  }}>
                  {' '}
                  Add from contacts 👉🏻
                </TextComponent>
              </TouchableOpacity>
            </>
          ) : null}
          <CenterPopupComponent
        popupData={permissionPopupData}
        isModalVisible={permissionModal}
        setIsModalVisible={setPermissionModal}/>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default AddGuestsScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: measureMents.leftPadding,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 30,
    paddingBottom: 30,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    marginTop: 30,
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
