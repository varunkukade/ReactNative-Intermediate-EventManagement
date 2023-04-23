import React, {ReactElement, useState, useCallback, useEffect} from 'react';
import {FlatList, StyleSheet, View, Keyboard} from 'react-native';
import {colors, measureMents} from '../../utils/appStyles';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../../navigation/homeStackNavigator';
import {useNavigation} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../../reduxConfig/store';
import {ButtonComponent, TextComponent} from '../../reusables';
import ScreenWrapper from '../screenWrapper';
import uuid from 'react-native-uuid';
import EachUserComponent from './eachUserComponent';
import {
  emailValidation,
  mobileNumbervalidation,
} from '../../utils/commonFunctions';

interface EachFormField<T> {
  value: T;
  errorMessage: string;
}

export type EachUserFormData = {
  userId: string | number[];
  expanded: boolean;
  userName: EachFormField<string>;
  userMobileNumber?: EachFormField<string>;
  userEmail?: EachFormField<string>;
  isValidUser: '' | 'YES' | 'NO';
};

export type EachPaymentMethod = {
  id: number;
  value: boolean;
  name: 'Cash' | 'Online';
  selected: boolean;
};

const CreateCommonList = (): ReactElement => {
  //navigation and route state
  const navigation: NativeStackNavigationProp<
    HomeStackParamList,
    'CreateCommonList'
  > = useNavigation();

  //dispatch and selectors
  const dispatch = useAppDispatch();
  const theme = useAppSelector(state => state.user.currentUser.theme);

  const newUser: EachUserFormData = {
    userId: uuid.v4(),
    expanded: true,
    userName: {value: '', errorMessage: ''},
    userMobileNumber: {value: '', errorMessage: ''},
    userEmail: {value: '', errorMessage: ''},
    isValidUser: '',
  };
  //useStates
  const [users, setUsers] = useState<EachUserFormData[]>([
    {
      userId: uuid.v4(),
      expanded: true,
      userName: {value: '', errorMessage: ''},
      userMobileNumber: {value: '', errorMessage: ''},
      userEmail: {value: '', errorMessage: ''},
      isValidUser: '',
    },
  ]);

  const [keyboardStatus, setKeyboardStatus] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const onAddUserClick = () => {
    setUsers([...users, newUser]);
  };

  const expandUser = useCallback(
    (userId: string | number[]) => {
      let updatedArr = users.map(eachUser => {
        if (eachUser.userId === userId)
          return {...eachUser, expanded: !eachUser.expanded};
        else return eachUser;
      });
      setUsers(updatedArr);
    },
    [users, setUsers],
  );

  const deleteUser = useCallback(
    (userId: string | number[]) => {
      setUsers(users.filter(eachUser => eachUser.userId !== userId));
    },
    [setUsers, users],
  );

  const onChangeForm = useCallback(
    (
      value: string | boolean,
      fieldName: 'userName' | 'userMobileNumber' | 'userEmail',
      id: string | number[],
    ): void => {
      let newArr = users.map(eachUser => {
        if (eachUser.userId === id)
          return {
            ...eachUser,
            [fieldName]: {...eachUser[fieldName], value},
          };
        else return eachUser;
      });
      setUsers(newArr);
    },
    [users, setUsers],
  );

  const updateFormErrors = () => {
    const newArr = users.map(user => {
      const {userName, userMobileNumber, userEmail} = user;
      const newUserName = userName.value.trim()
        ? {...userName, errorMessage: ''}
        : {...userName, errorMessage: 'User Name cannot be empty.'};
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
      const newUserEmail =
        !userEmail?.value.trim() ||
        emailValidation(userEmail.value.trim()).isValid
          ? {...userEmail, errorMessage: ''}
          : {
              ...userEmail,
              errorMessage: emailValidation(userEmail.value.trim())
                .errorMessage,
            };

      return {
        ...user,
        userName: newUserName,
        userMobileNumber: newUserMobileNumber,
        userEmail: newUserEmail,
        isValidUser:
          newUserName.errorMessage === '' &&
          newUserMobileNumber.errorMessage === '' &&
          newUserEmail.errorMessage === '' ? "YES" : "NO"
      };
    });
    setUsers(newArr);
  };

  const isUserValid = useCallback((user: EachUserFormData) => {
    const {userName, userMobileNumber, userEmail} = user;
    if (
      userName.value.trim() &&
      (!userMobileNumber?.value.trim() ||
        mobileNumbervalidation(userMobileNumber.value.trim()).isValid) &&
      (!userEmail?.value.trim() ||
        emailValidation(userEmail.value.trim()).isValid)
    ) {
      return true;
    } else return false;
  }, []);

  const onCreateListClick = () => {
    //here loop through all users data and check for name validation
    const allFieldsValid = users.every(user => {
      return isUserValid(user);
    });

    if (!allFieldsValid) {
      updateFormErrors();
    } else {
      // all fields are valid, submit the form
      updateFormErrors();
      console.log('all forms valid');
    }
  };

  return (
    <ScreenWrapper>
      {!keyboardStatus ? (
        <View style={styles.description}>
          <TextComponent
            style={{
              fontSize: 15,
              color: colors[theme].textColor,
              textAlign: 'center',
              marginBottom: 20,
            }}
            weight="semibold">
            Create common list of people here and while adding people to any
            event you can select people from this list.
          </TextComponent>
          <ButtonComponent onPress={onAddUserClick}>ADD USER</ButtonComponent>
        </View>
      ) : null}
      <FlatList
        data={users}
        style={{
          paddingHorizontal: measureMents.leftPadding,
          marginTop: 20,
          paddingVertical: measureMents.leftPadding,
          marginBottom: 20,
        }}
        renderItem={({item}) => (
          <EachUserComponent
            eachUser={item}
            deleteUser={deleteUser}
            expandUser={expandUser}
            onChangeForm={onChangeForm}
            isUserValid={item.isValidUser}
          />
        )}
        keyExtractor={item => item.userId.toString()}
      />
      {!keyboardStatus ? (
        <View style={[styles.description, {paddingBottom: 20}]}>
          <ButtonComponent
            onPress={onCreateListClick}
            isDisabled={users.length === 0}>
            CREATE LIST
          </ButtonComponent>
        </View>
      ) : null}
    </ScreenWrapper>
  );
};

export default CreateCommonList;

const styles = StyleSheet.create({
  description: {
    paddingTop: 10,
    paddingHorizontal: measureMents.leftPadding,
  },
});
