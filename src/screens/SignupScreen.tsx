import React, {useState} from 'react';
import {Platform, ScrollView, StyleSheet, ToastAndroid, TouchableOpacity, View} from 'react-native';
import {colors, measureMents} from '../utils/appStyles';
import {
  ButtonComponent,
  CheckboxComponent,
  InputComponent,
  TextComponent,
} from '../reusables';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { confirmPasswordValidation, emailValidation, mobileNumbervalidation, passwordValidation } from '../utils/commonFunctions';
import { useAppDispatch } from '../reduxConfig/store';
import { signupAPICall } from '../reduxConfig/slices/userSlice';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/rootStackNavigator';
import auth from '@react-native-firebase/auth';

const constants = {
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'email',
  password: 'password',
  confirmPasssword: 'confirmPasssword',
  mobileNumber: 'mobileNumber',
  isAdmin: 'isAdmin',
};

interface EachFormField<T> {
  value: T;
  errorMessage: string;
}

type SignupFormData = {
  firstName: EachFormField<string>;
  lastName: EachFormField<string>;
  email: EachFormField<string>;
  password: EachFormField<string>;
  confirmPasssword: EachFormField<string>;
  mobileNumber: EachFormField<string>;
  isAdmin: EachFormField<boolean>;
};

const SignupScreen = () => {
  //we are storing Date type in state and we will convert it to string for displaying on screen or passing to database.
  let initialSignupForm: SignupFormData = {
    firstName: {value: 'Varun', errorMessage: ''},
    lastName: {value: 'Kukade', errorMessage: ''},
    email: {value: 'varun.k@gmail.com', errorMessage: ''},
    password: {value: 'varunvarun', errorMessage: ''},
    confirmPasssword: {value: 'varunvarun', errorMessage: ''},
    mobileNumber: {value: '9028421280', errorMessage: ''},
    isAdmin: {value: true, errorMessage: ''},
  };
  const [signupForm, setSignupForm] =
    useState<SignupFormData>(initialSignupForm);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const onChangeForm = (
    value: string | Date | boolean,
    fieldName: string,
  ): void => {
    setSignupForm({
      ...signupForm,
      [fieldName]: {value: value, errorMessage: ''},
    });
  };
  
  //dispatch and selectors
  const dispatch = useAppDispatch();

  //navigation state
  const navigation: NativeStackNavigationProp<
    RootStackParamList,
    "HomeStack"
  > = useNavigation();
  
  const setFormErrors = (type? : "" | "empty", eventFormObj?: SignupFormData) => {
    if (type === 'empty') {
      setSignupForm({
        ...signupForm,
        firstName: {
          ...signupForm.firstName,
          errorMessage: '',
        },
        lastName: {
          ...signupForm.lastName,
          errorMessage: '',
        },
        email: {
          ...signupForm.email,
          errorMessage: '',
        },
        password: {
          ...signupForm.password,
          errorMessage: '',
        },
        confirmPasssword: {
          ...signupForm.confirmPasssword,
          errorMessage: '',
        },
        mobileNumber: {
          ...signupForm.mobileNumber,
          errorMessage: '',
        },
      });
    } else {
      if(eventFormObj) setSignupForm(eventFormObj);
    }
  };

  const onFormSubmit = (): void => {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPasssword,
      mobileNumber,
      isAdmin,
    } = signupForm;
    if (
      firstName.value &&
      lastName.value &&
      emailValidation(email.value).isValid &&
      passwordValidation(password.value).isValid &&
      confirmPasswordValidation(password.value,confirmPasssword.value).isValid && 
      mobileNumbervalidation(mobileNumber.value).isValid
    ) {
      setFormErrors('empty');
      let requestObj: {email: string; password: string} = {
        email: email.value,
        password: password.value
      };
      dispatch(signupAPICall(requestObj)).then((res)=> {
        if (res.meta.requestStatus === 'fulfilled') {
          if(Platform.OS === "android" && res.payload) ToastAndroid.show(res.payload.message, ToastAndroid.SHORT);
          auth().currentUser?.updateProfile({ 
            displayName: firstName.value + lastName.value,
          })
          setSignupForm(initialSignupForm);
          //Navigation state object - https://reactnavigation.org/docs/navigation-state/
          navigation.reset({
            index: 0,
            routes: [
              {
                name: 'HomeStack',
                state: {
                  index: 0,
                  routes: [{name: 'Home'}],
                },
              },
            ],
          });
        } else {
          if(Platform.OS === "android" && res.payload) ToastAndroid.show(res.payload.message, ToastAndroid.SHORT);
        }
      })
    } else {
      //set the errors if exist
      setFormErrors("", {
        ...signupForm,
        firstName: {
          ...firstName,
          errorMessage: firstName.value ? '' : 'First Name cannot be empty.',
        },
        lastName: {
          ...lastName,
          errorMessage: lastName.value ? '' : 'Last Name cannot be empty.',
        },
        email: {
          ...email,
          errorMessage: emailValidation(email.value).errorMessage,
        },
        password: {
          ...password,
          errorMessage: passwordValidation(password.value).errorMessage,
        },
        confirmPasssword: {
          ...confirmPasssword,
          errorMessage: confirmPasswordValidation( password.value,confirmPasssword.value).errorMessage,
        },
        mobileNumber: {
          ...mobileNumber,
          errorMessage: mobileNumbervalidation( mobileNumber.value).errorMessage,
        },
      });
    }
  };


  return (
    <ScrollView
      style={{backgroundColor: 'red'}}
      showsVerticalScrollIndicator={false}>
      <View style={styles.wrapperComponent}>
        <TextComponent
          style={{fontSize: 15, marginBottom: 20}}
          weight="semibold">
          Create an account so you can create and manage all your events at once
          place.
        </TextComponent>
        <InputComponent
          value={signupForm.firstName.value}
          onChangeText={value => onChangeForm(value, constants.firstName)}
          label="First Name"
          errorMessage={signupForm.firstName.errorMessage}
          placeholder="Varun"
        />
        <InputComponent
          value={signupForm.lastName.value}
          onChangeText={value => onChangeForm(value, constants.lastName)}
          label="Last Name"
          errorMessage={signupForm.lastName.errorMessage}
          placeholder="Kukade"
        />
        <InputComponent
          value={signupForm.email.value}
          onChangeText={value => onChangeForm(value, constants.email)}
          label="Email"
          errorMessage={signupForm.email.errorMessage}
          placeholder="abc@gmail.com"
        />
        <InputComponent
          value={signupForm.password.value}
          onChangeText={value => onChangeForm(value, constants.password)}
          label="Password"
          errorMessage={signupForm.password.errorMessage}
          placeholder="Enter a password..."
          secureTextEntry={!showPassword}
          rightIconComponent={
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{position: 'absolute', right: 15}}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                color={colors.iconLightPinkColor}
                size={22}
              />
            </TouchableOpacity>
          }
        />
        <InputComponent
          value={signupForm.confirmPasssword.value}
          onChangeText={value =>
            onChangeForm(value, constants.confirmPasssword)
          }
          label="Confirm Password"
          secureTextEntry= {!showConfirmPassword}
          errorMessage={signupForm.confirmPasssword.errorMessage}
          placeholder="Confirm the entered password..."
          rightIconComponent={
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={{position: 'absolute', right: 15}}>
              <Ionicons
                name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                color={colors.iconLightPinkColor}
                size={22}
              />
            </TouchableOpacity>
          }
        />
        <InputComponent
          value={signupForm.mobileNumber.value}
          onChangeText={value => onChangeForm(value, constants.mobileNumber)}
          label="Mobile Number"
          keyboardType="numeric"
          errorMessage={signupForm.mobileNumber.errorMessage}
          placeholder="Enter the mobile number..."
        />
        <CheckboxComponent
          label="Check this if you are an admin."
          value={signupForm.isAdmin.value}
          onValueChange={value => onChangeForm(value, constants.isAdmin)}
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

export default SignupScreen;

const styles = StyleSheet.create({
  wrapperComponent: {
    flex: 1,
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: measureMents.leftPadding,
    backgroundColor: colors.whiteColor,
  },
});
