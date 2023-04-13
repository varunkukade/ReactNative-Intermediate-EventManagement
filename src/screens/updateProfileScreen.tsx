import React, {useEffect, useRef, useState} from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors, measureMents} from '../utils/appStyles';
import {ButtonComponent, InputComponent, TextComponent} from '../reusables';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  confirmPasswordValidation,
  emailValidation,
  mobileNumbervalidation,
  passwordValidation,
  updateTheAsyncStorage,
} from '../utils/commonFunctions';
import {useAppDispatch} from '../reduxConfig/store';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/rootStackNavigator';
import auth from '@react-native-firebase/auth';
import {
  EachUser,
  UpdateProfileRequest,
  getProfileDataAPICall,
  logoutAPICall,
  resetUserState,
  updateProfileAPICall,
} from '../reduxConfig/slices/userSlice';
import { resetEventState } from '../reduxConfig/slices/eventsSlice';
import { resetPeopleState } from '../reduxConfig/slices/peopleSlice';

const constants = {
  name: 'name',
  email: 'email',
  currentPassword: 'currentPassword',
  password: 'password',
  confirmPasssword: 'confirmPasssword',
  mobileNumber: 'mobileNumber',
};

interface EachFormField<T> {
  value: T;
  errorMessage: string;
}

type UpdateProfileFormData = {
  name: EachFormField<string>;
  email: EachFormField<string>;
  currentPassword: EachFormField<string>;
  password: EachFormField<string>;
  confirmPasssword: EachFormField<string>;
  mobileNumber: EachFormField<string>;
};

const UpdateProfileScreen = () => {
  let initialFormData: UpdateProfileFormData = {
    name: {value: auth().currentUser?.displayName || '', errorMessage: ''},
    email: {value: auth().currentUser?.email || '', errorMessage: ''},
    currentPassword: {value: '', errorMessage: ''},
    password: {value: '', errorMessage: ''},
    confirmPasssword: {value: '', errorMessage: ''},
    mobileNumber: {
      value: '',
      errorMessage: '',
    },
  };
  const [updateProfileForm, setUpdateProfileForm] =
    useState<UpdateProfileFormData>(initialFormData);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  let profileData = useRef<null | EachUser>(null)

  useEffect(() => {
    dispatch(getProfileDataAPICall()).then(resp => {
      if (resp.payload) {
        if (
          Platform.OS === 'android' &&
          resp.meta.requestStatus === 'fulfilled' &&
          resp.payload.type === 'success'
        ) {
          profileData.current = resp.payload.responseData
          setUpdateProfileForm({
            ...updateProfileForm,
            mobileNumber: {
              value: resp.payload.responseData.mobileNumber,
              errorMessage: '',
            },
          });
        }
      }
    });
  }, []);

  const onChangeForm = (
    value: string | Date | boolean,
    fieldName: string,
  ): void => {
    setUpdateProfileForm({
      ...updateProfileForm,
      [fieldName]: {value: value, errorMessage: ''},
    });
  };

  //dispatch and selectors
  const dispatch = useAppDispatch();

  //navigation state
  const rootNavigation: NativeStackNavigationProp<
    RootStackParamList,
    'HomeStack'
  > = useNavigation();

  const setFormErrors = (
    type?: '' | 'empty',
    eventFormObj?: UpdateProfileFormData,
  ) => {
    if (type === 'empty') {
      setUpdateProfileForm({
        ...updateProfileForm,
        name: {
          ...updateProfileForm.name,
          errorMessage: '',
        },
        email: {
          ...updateProfileForm.email,
          errorMessage: '',
        },
        password: {
          ...updateProfileForm.password,
          errorMessage: '',
        },
        currentPassword: {
          ...updateProfileForm.currentPassword,
          errorMessage: '',
        },
        confirmPasssword: {
          ...updateProfileForm.confirmPasssword,
          errorMessage: '',
        },
        mobileNumber: {
          ...updateProfileForm.mobileNumber,
          errorMessage: '',
        },
      });
    } else {
      if (eventFormObj) setUpdateProfileForm(eventFormObj);
    }
  };

  const resetReduxState = () => {
    dispatch(resetEventState());
    dispatch(resetPeopleState());
    dispatch(resetUserState());
  };

  const handleSuccessCase = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    }
    dispatch(logoutAPICall()).then(res => {
      updateTheAsyncStorage("false");
      resetReduxState()
      rootNavigation.reset({
        index: 0,
        routes: [
          {
            name: 'AuthStack',
            state: {
              index: 0,
              routes: [{name: 'SigninScreen'}],
            },
          },
        ],
      });
    });
  };

  const setFormErrorsFun = () => {
    const {
      name,
      email,
      password,
      confirmPasssword,
      mobileNumber,
      currentPassword,
    } = updateProfileForm;
    setFormErrors('', {
      ...updateProfileForm,
      name: {
        ...name,
        errorMessage: name.value ? '' : 'Name cannot be empty.',
      },
      email: {
        ...email,
        errorMessage: emailValidation(email.value).errorMessage,
      },
      currentPassword: {
        ...currentPassword,
        errorMessage: passwordValidation(currentPassword.value).errorMessage,
      },
      password: {
        ...password,
        errorMessage: passwordValidation(password.value).errorMessage,
      },
      confirmPasssword: {
        ...confirmPasssword,
        errorMessage: confirmPasswordValidation(
          password.value,
          confirmPasssword.value,
        ).errorMessage,
      },
      mobileNumber: {
        ...mobileNumber,
        errorMessage: mobileNumbervalidation(mobileNumber.value).errorMessage,
      },
    });
  };

  const onFormSubmit = (): void => {
    const {
      name,
      email,
      password,
      confirmPasssword,
      mobileNumber,
      currentPassword,
    } = updateProfileForm;
    if (
      name.value &&
      emailValidation(email.value).isValid &&
      passwordValidation(currentPassword.value).isValid &&
      passwordValidation(password.value).isValid &&
      confirmPasswordValidation(password.value, confirmPasssword.value)
        .isValid &&
      mobileNumbervalidation(mobileNumber.value).isValid
    ) {
      setFormErrors('empty');
      const authCredential = auth.EmailAuthProvider.credential(
        auth().currentUser?.email,
        currentPassword.value,
      );
      let requestObj: UpdateProfileRequest = {
        name: name.value,
        authCredential: authCredential,
        newEmail: email.value,
        newPassword: password.value,
        newMobileNumberUpdate: {mobileNumber : mobileNumber.value} ,
        docIdInFireStore: profileData.current?.docIdInFireStore || ""
      };
      dispatch(updateProfileAPICall(requestObj)).then(resp => {
        if (resp.meta.requestStatus === 'fulfilled') {
          handleSuccessCase(resp.payload.message);
        } else {
          if (Platform.OS === 'android') {
            ToastAndroid.show(
              resp.payload.message ||
                'Profile Updated failed! Please try again later.',
              ToastAndroid.LONG,
            );
          }
        }
      });
    } else {
      //set the errors if exist
      setFormErrorsFun();
    }
  };

  return (
    <ScrollView
      style={styles.wrapperComponent}
      showsVerticalScrollIndicator={false}>
      <View style={styles.welcomeMessage}>
        <TextComponent
          style={{
            fontSize: 15,
            marginBottom: 10,
            color: colors.whiteColor,
            textAlign: 'center',
          }}
          weight="semibold">
          Here you can change your profile data. You will need to relogin once
          you update email and password.
        </TextComponent>
      </View>
      <View style={styles.mainContainer}>
        <InputComponent
          value={updateProfileForm.name.value}
          onChangeText={value => onChangeForm(value, constants.name)}
          label="Name"
          errorMessage={updateProfileForm.name.errorMessage}
          placeholder="Varun Kukade"
        />
        <InputComponent
          value={updateProfileForm.email.value}
          onChangeText={value => onChangeForm(value, constants.email)}
          label="Email"
          errorMessage={updateProfileForm.email.errorMessage}
          placeholder="abc@gmail.com"
        />
        <InputComponent
          value={updateProfileForm.currentPassword.value}
          onChangeText={value => onChangeForm(value, constants.currentPassword)}
          label="Current Password"
          errorMessage={updateProfileForm.currentPassword.errorMessage}
          placeholder="Enter a current password..."
          secureTextEntry={!showCurrentPassword}
          rightIconComponent={
            <TouchableOpacity
              onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              style={{position: 'absolute', right: 15}}>
              <Ionicons
                name={showCurrentPassword ? 'eye-off-outline' : 'eye-outline'}
                color={colors.iconLightPinkColor}
                size={22}
              />
            </TouchableOpacity>
          }
        />
        <InputComponent
          value={updateProfileForm.password.value}
          onChangeText={value => onChangeForm(value, constants.password)}
          label="New Password"
          errorMessage={updateProfileForm.password.errorMessage}
          placeholder="Enter a New password..."
          secureTextEntry={!showPassword}
          rightIconComponent={
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={{position: 'absolute', right: 15}}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                color={colors.iconLightPinkColor}
                size={22}
              />
            </TouchableOpacity>
          }
        />
        <InputComponent
          value={updateProfileForm.confirmPasssword.value}
          onChangeText={value =>
            onChangeForm(value, constants.confirmPasssword)
          }
          label="Confirm new Password"
          secureTextEntry={!showConfirmPassword}
          errorMessage={updateProfileForm.confirmPasssword.errorMessage}
          placeholder="Confirm the new entered password..."
          rightIconComponent={
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{position: 'absolute', right: 15}}>
              <Ionicons
                name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                color={colors.iconLightPinkColor}
                size={22}
              />
            </TouchableOpacity>
          }
        />
        <InputComponent
          value={updateProfileForm.mobileNumber.value}
          onChangeText={value => onChangeForm(value, constants.mobileNumber)}
          label="Mobile Number"
          keyboardType="numeric"
          errorMessage={updateProfileForm.mobileNumber.errorMessage}
          placeholder="Enter the mobile number..."
        />

        <ButtonComponent
          onPress={onFormSubmit}
          containerStyle={{marginTop: 30}}>
          Update
        </ButtonComponent>
      </View>
    </ScrollView>
  );
};

export default UpdateProfileScreen;

const styles = StyleSheet.create({
  wrapperComponent: {
    flex: 1,
    backgroundColor: colors.primaryColor,
  },
  welcomeMessage: {
    flex: 0.2,
    paddingTop: 10,
    paddingHorizontal: measureMents.leftPadding,
    paddingBottom: 20,
  },
  mainContainer: {
    flex: 0.8,
    backgroundColor: colors.whiteColor,
    paddingHorizontal: measureMents.leftPadding,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 30,
    paddingBottom: 30,
  },
});
