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
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {logoutAPICall} from '../reduxConfig/slices/userSlice';

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

type SignupFormData = {
  name: EachFormField<string>;
  email: EachFormField<string>;
  currentPassword: EachFormField<string>;
  password: EachFormField<string>;
  confirmPasssword: EachFormField<string>;
  mobileNumber: EachFormField<string>;
};

const UpdateProfileScreen = () => {
  let initialSignupForm: SignupFormData = {
    name: {value: auth().currentUser?.displayName || '', errorMessage: ''},
    email: {value: auth().currentUser?.email || '', errorMessage: ''},
    currentPassword: {value: '', errorMessage: ''},
    password: {value: '', errorMessage: ''},
    confirmPasssword: {value: '', errorMessage: ''},
    mobileNumber: {
      value: auth().currentUser?.phoneNumber || '',
      errorMessage: '',
    },
  };
  const [signupForm, setSignupForm] =
    useState<SignupFormData>(initialSignupForm);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
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
  const rootNavigation: NativeStackNavigationProp<
    RootStackParamList,
    'HomeStack'
  > = useNavigation();

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
        currentPassword: {
          ...signupForm.currentPassword,
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

  const handleSuccessCase = () => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(
        'Profile Updated successfully. Login again with new credentials',
        ToastAndroid.SHORT,
      );
    }
    dispatch(logoutAPICall()).then(res => {
      updateTheAsyncStorage();
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

  const handleErrorCodes = (err: any) => {
    let errorMessage = '';
    if (err.code === 'auth/no-current-user') {
      errorMessage = 'No user currently signed in.';
    }
    if (err.code === 'auth/user-token-expired') {
      errorMessage = 'No user currently signed in.';
    }
    if (err.code === 'auth/wrong-password') {
      errorMessage =
        'Current password is invalid. Reset the password and then update the profile';
    }
    if (Platform.OS === 'android') {
      ToastAndroid.show(
        errorMessage || 'Profile Updated failed! Please try again later.',
        ToastAndroid.LONG,
      );
    }
  };

  const setFormErrorsFun = () => {
    const {
      name,
      email,
      password,
      confirmPasssword,
      mobileNumber,
      currentPassword,
    } = signupForm;
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

  const updateTheProfile = async (
    authCredential: FirebaseAuthTypes.AuthCredential,
  ) => {
    const {name, email, password} = signupForm;
    //here first reauthenticate the user and then update the fields one by one.
    auth()
      .currentUser?.reauthenticateWithCredential(authCredential)
      .then(res => {
        return auth().currentUser?.updateProfile({
          displayName: name.value,
        });
      })
      .then(res => {
        return auth().currentUser?.updateEmail(email.value);
      })
      .then(res => {
        return auth().currentUser?.updatePassword(password.value);
      })
      .then(res => {
        handleSuccessCase();
      })
      .catch(err => {
        handleErrorCodes(err);
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
    } = signupForm;
    if (
      name.value &&
      emailValidation(email.value).isValid &&
      passwordValidation(currentPassword.value) &&
      passwordValidation(password.value).isValid &&
      confirmPasswordValidation(password.value, confirmPasssword.value)
        .isValid &&
      mobileNumbervalidation(mobileNumber.value).isValid
    ) {
      setFormErrors('empty');
      if (auth().currentUser?.email) {
        const authCredential = auth.EmailAuthProvider.credential(
          auth().currentUser?.email,
          currentPassword.value,
        );
        updateTheProfile(authCredential);
      }
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
          value={signupForm.currentPassword.value}
          onChangeText={value => onChangeForm(value, constants.currentPassword)}
          label="Current Password"
          errorMessage={signupForm.currentPassword.errorMessage}
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
          value={signupForm.password.value}
          onChangeText={value => onChangeForm(value, constants.password)}
          label="New Password"
          errorMessage={signupForm.password.errorMessage}
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
          value={signupForm.confirmPasssword.value}
          onChangeText={value =>
            onChangeForm(value, constants.confirmPasssword)
          }
          label="Confirm new Password"
          secureTextEntry={!showConfirmPassword}
          errorMessage={signupForm.confirmPasssword.errorMessage}
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
