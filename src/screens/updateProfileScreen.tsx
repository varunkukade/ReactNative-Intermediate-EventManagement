import React, {useState} from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors, measureMents} from '../utils/appStyles';
import {
  ButtonComponent,
  CheckboxComponent,
  InputComponent,
  TextComponent,
} from '../reusables';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  confirmPasswordValidation,
  emailValidation,
  mobileNumbervalidation,
  passwordValidation,
} from '../utils/commonFunctions';
import {useAppDispatch} from '../reduxConfig/store';
import {signupAPICall} from '../reduxConfig/slices/userSlice';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/rootStackNavigator';
import auth from '@react-native-firebase/auth';

const constants = {
  name: 'name',
  email: 'email',
  password: 'password',
  confirmPasssword: 'confirmPasssword',
  mobileNumber: 'mobileNumber',
};

interface EachFormField<T> {
  value: T;
  errorMessage: string;
}

type SignupFormData = {
  name: EachFormField<string>;
  email: EachFormField<string>;
  password: EachFormField<string>;
  confirmPasssword: EachFormField<string>;
  mobileNumber: EachFormField<string>;
};

const UpdateProfileScreen = () => {
  let initialSignupForm: SignupFormData = {
    name: {value: 'Varun Kukade', errorMessage: ''},
    email: {value: 'varun.k@gmail.com', errorMessage: ''},
    password: {value: 'Vk@#$2211', errorMessage: ''},
    confirmPasssword: {value: 'Vk@#$2211', errorMessage: ''},
    mobileNumber: {value: '9028421280', errorMessage: ''},
  };
  const [signupForm, setSignupForm] =
    useState<SignupFormData>(initialSignupForm);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
  const navigation: NativeStackNavigationProp<RootStackParamList, 'HomeStack'> =
    useNavigation();

  const setFormErrors = (
    type?: '' | 'empty',
    eventFormObj?: SignupFormData,
  ) => {
    if (type === 'empty') {
      setSignupForm({
        ...signupForm,
        name: {
          ...signupForm.name,
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
      if (eventFormObj) setSignupForm(eventFormObj);
    }
  };

  const onFormSubmit = (): void => {
    const {name, email, password, confirmPasssword, mobileNumber, isAdmin} =
      signupForm;
    if (
      name.value &&
      emailValidation(email.value).isValid &&
      passwordValidation(password.value).isValid &&
      confirmPasswordValidation(password.value, confirmPasssword.value)
        .isValid &&
      mobileNumbervalidation(mobileNumber.value).isValid
    ) {
      setFormErrors('empty');
      let requestObj: {email: string; password: string} = {
        email: email.value,
        password: password.value,
      };
      dispatch(signupAPICall(requestObj)).then(res => {
        if (res.meta.requestStatus === 'fulfilled') {
          if (Platform.OS === 'android' && res.payload)
            ToastAndroid.show(res.payload.message, ToastAndroid.SHORT);
          auth().currentUser?.updateProfile({
            displayName: name.value,
          });
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
          if (Platform.OS === 'android' && res.payload)
            ToastAndroid.show(res.payload.message, ToastAndroid.SHORT);
        }
      });
    } else {
      //set the errors if exist
      setFormErrors('', {
        ...signupForm,
        name: {
          ...name,
          errorMessage: name.value ? '' : 'Name cannot be empty.',
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
    }
  };

  return (
    <ScrollView
      style={styles.wrapperComponent}
      showsVerticalScrollIndicator={false}>
      <View style={styles.welcomeMessage}>
        <TextComponent
          style={{fontSize: 15, marginBottom: 10, color: colors.whiteColor, textAlign:"center"}}
          weight="semibold">
          Create an account so you can create and manage all your events at once
          place.
        </TextComponent>
      </View>
      <View style={styles.mainContainer}>
        <InputComponent
          value={signupForm.name.value}
          onChangeText={value => onChangeForm(value, constants.name)}
          label="Name"
          errorMessage={signupForm.name.errorMessage}
          placeholder="Varun Kukade"
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
          value={signupForm.confirmPasssword.value}
          onChangeText={value =>
            onChangeForm(value, constants.confirmPasssword)
          }
          label="Confirm Password"
          secureTextEntry={!showConfirmPassword}
          errorMessage={signupForm.confirmPasssword.errorMessage}
          placeholder="Confirm the entered password..."
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
          value={signupForm.mobileNumber.value}
          onChangeText={value => onChangeForm(value, constants.mobileNumber)}
          label="Mobile Number"
          keyboardType="numeric"
          errorMessage={signupForm.mobileNumber.errorMessage}
          placeholder="Enter the mobile number..."
        />
        
        <ButtonComponent
          onPress={onFormSubmit}
          containerStyle={{marginTop: 30}}>
          Register
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
    paddingTop: 30,
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
