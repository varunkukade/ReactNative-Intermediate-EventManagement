import React, {useState} from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors, measureMents} from '../utils/appStyles';
import {ButtonComponent, InputComponent, TextComponent} from '../reusables';
import {useAppDispatch} from '../reduxConfig/store';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/rootStackNavigator';
import {useNavigation} from '@react-navigation/native';
import {emailValidation, passwordValidation} from '../utils/commonFunctions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {signinAPICall} from '../reduxConfig/slices/userSlice';
import {AuthStackParamList} from '../navigation/authStackNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

const constants = {
  email: 'email',
  password: 'password',
};

interface EachFormField<T> {
  value: T;
  errorMessage: string;
}

type SigninFormData = {
  email: EachFormField<string>;
  password: EachFormField<string>;
};
const SigninScreen = () => {
  let initialSigninForm: SigninFormData = {
    email: {value: 'varunkukade888@gmail.com', errorMessage: ''},
    password: {value: 'Vk@#$2211', errorMessage: ''},
  };
  const [signinForm, setSignupForm] =
    useState<SigninFormData>(initialSigninForm);

  const [showPassword, setShowPassword] = useState(false);

  const onChangeForm = (
    value: string | Date | boolean,
    fieldName: string,
  ): void => {
    setSignupForm({
      ...signinForm,
      [fieldName]: {value: value, errorMessage: ''},
    });
  };

  //dispatch and selectors
  const dispatch = useAppDispatch();

  //navigation state
  const navigation: NativeStackNavigationProp<RootStackParamList, 'HomeStack'> =
    useNavigation();
  //navigation state
  const authStackNavigation: NativeStackNavigationProp<
    AuthStackParamList,
    'SigninScreen'
  > = useNavigation();

  const setFormErrors = (
    type?: '' | 'empty',
    eventFormObj?: SigninFormData,
  ) => {
    if (type === 'empty') {
      setSignupForm({
        ...signinForm,
        email: {
          ...signinForm.email,
          errorMessage: '',
        },
        password: {
          ...signinForm.password,
          errorMessage: '',
        },
      });
    } else {
      if (eventFormObj) setSignupForm(eventFormObj);
    }
  };

  const updateAsyncStorage = async (): Promise<void> => {
    try {
      await AsyncStorage.setItem('isAuthenticated', 'true');
    } catch (e) {
      // saving error
    }
  };

  const onFormSubmit = (): void => {
    const {email, password} = signinForm;
    if (
      emailValidation(email.value).isValid &&
      passwordValidation(password.value).isValid
    ) {
      setFormErrors('empty');
      let requestObj: {email: string; password: string} = {
        email: email.value,
        password: password.value,
      };
      dispatch(signinAPICall(requestObj)).then(res => {
        if (res.meta.requestStatus === 'fulfilled') {
          if (Platform.OS === 'android' && res.payload)
            ToastAndroid.show(res.payload.message, ToastAndroid.SHORT);
          setSignupForm(initialSigninForm);
          //Navigation state object - https://reactnavigation.org/docs/navigation-state/
          updateAsyncStorage();
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
        ...signinForm,
        email: {
          ...email,
          errorMessage: emailValidation(email.value).errorMessage,
        },
        password: {
          ...password,
          errorMessage: passwordValidation(password.value).errorMessage,
        },
      });
    }
  };
  return (
    <View style={styles.wrapperComponent}>
      <View style={styles.welcomeMessage}>
        <TextComponent
          style={{
            fontSize: 19,
            color: colors.whiteColor,
            marginBottom: 10,
            textAlign: 'center',
          }}
          weight="bold">
          Hi, Welcome Back 👋🏻
        </TextComponent>
        <TextComponent
          style={{fontSize: 16, color: colors.whiteColor, textAlign: 'center'}}
          weight="normal">
          You can continue to login to manage your events.
        </TextComponent>
      </View>
      <View style={styles.mainContainer}>
        <InputComponent
          value={signinForm.email.value}
          onChangeText={value => onChangeForm(value, constants.email)}
          label="Email"
          errorMessage={signinForm.email.errorMessage}
          placeholder="abc@gmail.com"
        />
        <InputComponent
          value={signinForm.password.value}
          onChangeText={value => onChangeForm(value, constants.password)}
          label="Password"
          errorMessage={signinForm.password.errorMessage}
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
        <TouchableOpacity
          onPress={() => authStackNavigation.navigate('ForgotPasswordScreen')}
          style={{marginTop: 10, alignSelf: 'flex-end'}}>
          <TextComponent
            style={{
              fontSize: 14,
              color: colors.primaryColor,
            }}
            weight="bold">
            Forgot Password?
          </TextComponent>
        </TouchableOpacity>
        <ButtonComponent
          onPress={onFormSubmit}
          containerStyle={{marginTop: 30}}>
          Sign-in
        </ButtonComponent>
        <TouchableOpacity
          onPress={() => authStackNavigation.navigate('SignupScreen')}
          style={{marginTop: 15}}>
          <TextComponent
            style={{
              fontSize: 14,
              color: colors.primaryColor,
              textAlign: 'center',
            }}
            weight="bold">
            Don't have an account ? Sign Up
          </TextComponent>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SigninScreen;

const styles = StyleSheet.create({
  wrapperComponent: {
    flex: 1,
    backgroundColor: colors.primaryColor,
  },
  welcomeMessage: {
    paddingTop: 30,
    paddingHorizontal: measureMents.leftPadding,
    paddingBottom: 40,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: colors.whiteColor,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: measureMents.leftPadding,
  },
});
