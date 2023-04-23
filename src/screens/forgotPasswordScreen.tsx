import React, { useState } from 'react';
import {Platform, StyleSheet, ToastAndroid, View} from 'react-native';
import { ButtonComponent, InputComponent, TextComponent } from '../reusables';
import { emailValidation } from '../utils/commonFunctions';
import { useAppDispatch, useAppSelector } from '../reduxConfig/store';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/authStackNavigator';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { forgotPasswordAPICall } from '../reduxConfig/slices/userSlice';
import { HomeStackParamList } from '../navigation/homeStackNavigator';
import ScreenWrapper from './screenWrapper';
import { colors, measureMents } from '../utils/appStyles';

const constants = {
  email: 'email',
};

interface EachFormField<T> {
  value: T;
  errorMessage: string;
}

type ForgotPasswordFormData = {
  email: EachFormField<string>;
};
const ForgotPasswordScreen = () => {
  let initialForgotPasswordForm: ForgotPasswordFormData = {
    email: {value: '', errorMessage: ''},
  };
  const [forgotPasswordForm, setSignupForm] =
    useState<ForgotPasswordFormData>(initialForgotPasswordForm);

  const theme = useAppSelector(state => state.user.currentUser.theme)

  const onChangeForm = (
    value: string | Date | boolean,
    fieldName: string,
  ): void => {
    setSignupForm({
      ...forgotPasswordForm,
      [fieldName]: {value: value, errorMessage: ''},
    });
  };

  //dispatch and selectors
  const dispatch = useAppDispatch();

  //navigation and route state
  const homeStackNavigator: NativeStackNavigationProp<HomeStackParamList, 'BottomTabNavigator'> = useNavigation()
  const authStackNavigation: NativeStackNavigationProp<
    AuthStackParamList,
    'SigninScreen'
  > = useNavigation();
  const route: RouteProp<AuthStackParamList,'ForgotPasswordScreen'> = useRoute()

  const setFormErrors = (
    type?: '' | 'empty',
    eventFormObj?: ForgotPasswordFormData,
  ) => {
    if (type === 'empty') {
      setSignupForm({
        ...forgotPasswordForm,
        email: {
          ...forgotPasswordForm.email,
          errorMessage: '',
        },
      });
    } else {
      if (eventFormObj) setSignupForm(eventFormObj);
    }
  };

  const onFormSubmit = (): void => {
    const {email} = forgotPasswordForm;
    if (
      emailValidation(email.value).isValid
    ) {
      setFormErrors('empty');
      let requestObj: {email: string;} = {
        email: email.value,
      };
      dispatch(forgotPasswordAPICall(requestObj)).then(res => {
        if (res.meta.requestStatus === 'fulfilled') {
          if (Platform.OS === 'android' && res.payload)
            ToastAndroid.show(res.payload.message, ToastAndroid.SHORT);
          if(route.params?.isResetPassword)  homeStackNavigator.pop(); 
          else authStackNavigation.navigate("SigninScreen")
        } else {
          if (Platform.OS === 'android' && res.payload)
            ToastAndroid.show(res.payload.message, ToastAndroid.SHORT);
        }
      });
    } else {
      //set the errors if exist
      setFormErrors('', {
        ...forgotPasswordForm,
        email: {
          ...email,
          errorMessage: emailValidation(email.value).errorMessage,
        },
      });
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.welcomeMessage}>
        <TextComponent
          style={{fontSize: 16, color: colors[theme].whiteColor, textAlign:"center"}}
          weight="normal">
         Enter your registered email below to recieve password reset email.
        </TextComponent>
      </View>
      <View style={[styles.mainContainer, {  backgroundColor: colors[theme].cardColor}]}>
      <InputComponent
          value={forgotPasswordForm.email.value}
          onChangeText={value => onChangeForm(value, constants.email)}
          label="Email"
          required
          errorMessage={forgotPasswordForm.email.errorMessage}
          placeholder="abc@gmail.com"
        />
        <ButtonComponent
          onPress={onFormSubmit}
          containerStyle={{marginTop: 30}}>
          Send
        </ButtonComponent>
      </View>
    </ScreenWrapper>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  welcomeMessage: {
    paddingTop: 30,
    paddingHorizontal: measureMents.leftPadding,
    paddingBottom: 40,
  },
  mainContainer: {
    flex: 1,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: measureMents.leftPadding,
  },
});
