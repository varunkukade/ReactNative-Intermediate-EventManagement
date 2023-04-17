import React, {useEffect, useState} from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors, measureMents} from '../utils/appStyles';
import {
  ButtonComponent,
  ImageComponent,
  InputComponent,
  TextComponent,
} from '../reusables';
import {useAppDispatch} from '../reduxConfig/store';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/rootStackNavigator';
import {useNavigation} from '@react-navigation/native';
import {
  emailValidation,
  passwordValidation,
  updateTheAsyncStorage,
} from '../utils/commonFunctions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  googleSigninAPICall,
  signinAPICall,
} from '../reduxConfig/slices/userSlice';
import {AuthStackParamList} from '../navigation/authStackNavigator';

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import ScreenWrapper from './screenWrapper';

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
    email: {value: 'varunkukade999@gmail.com', errorMessage: ''},
    password: {value: 'Vk@#$2211', errorMessage: ''},
  };
  const [signinForm, setSigninForm] =
    useState<SigninFormData>(initialSigninForm);

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '906379393078-52aspsq8ijp3nru2rmu7ph6cria20i48.apps.googleusercontent.com',
    });
  });

  const signIn = async () => {
    try {
      // Check if device supports Google Play
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      // Get the users ID token
      const {idToken} = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      dispatch(googleSigninAPICall({authCredentials: googleCredential})).then(
        res => {
          if (res.meta.requestStatus === 'fulfilled') {
            if (res.payload)
              ToastAndroid.show(res.payload.message, ToastAndroid.SHORT);
            setSigninForm(initialSigninForm);
            updateTheAsyncStorage('true').then(res => {
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
            });
          } else {
            if (res.payload)
              ToastAndroid.show(res.payload.message, ToastAndroid.SHORT);
          }
        },
      );
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        //Alert.alert('Cancel');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Signin in progress');
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('PLAY_SERVICES_NOT_AVAILABLE');
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  const onChangeForm = (
    value: string | Date | boolean,
    fieldName: string,
  ): void => {
    setSigninForm({
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
      setSigninForm({
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
      if (eventFormObj) setSigninForm(eventFormObj);
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
          if (res.payload)
            ToastAndroid.show(res.payload.message, ToastAndroid.SHORT);
          setSigninForm(initialSigninForm);
          updateTheAsyncStorage('true').then(res => {
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
          });
        } else {
          if (res.payload)
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
    <ScreenWrapper>
      <ScrollView>
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
            style={{
              fontSize: 16,
              color: colors.whiteColor,
              textAlign: 'center',
            }}
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
          <TextComponent
            weight="bold"
            style={{textAlign: 'center', fontSize: 18, marginTop: 30}}>
            Or
          </TextComponent>
          <GoogleSigninButton
            style={{
              width: '80%',
              height: 60,
              alignSelf: 'center',
              marginTop: 20,
              marginBottom: 20,
            }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Light}
            onPress={signIn}
          />
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
      </ScrollView>
    </ScreenWrapper>
  );
};

export default SigninScreen;

const styles = StyleSheet.create({
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
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
});
