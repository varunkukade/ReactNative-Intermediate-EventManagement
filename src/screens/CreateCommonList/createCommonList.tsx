import React, {ReactElement, useState, useCallback, useEffect} from 'react';
import {FlatList, StyleSheet, View, Keyboard, Platform, ToastAndroid} from 'react-native';
import {colors, measureMents} from '../../utils/appStyles';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../../navigation/homeStackNavigator';
import {useNavigation} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../../reduxConfig/store';
import {ButtonComponent, InputComponent, TextComponent} from '../../reusables';
import ScreenWrapper from '../screenWrapper';
import uuid from 'react-native-uuid';
import EachUserComponent from './eachUserComponent';
import {
  emailValidation,
  generateArray,
  mobileNumbervalidation,
} from '../../utils/commonFunctions';
import CenterPopupComponent, {popupData} from '../../reusables/centerPopup';
import {MAX_BULK_ADDITION} from '../../utils/constants';
import { EachPerson, addCommonListAPICall } from '../../reduxConfig/slices/peopleSlice';
import auth from '@react-native-firebase/auth';

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
  const [bulkUserModal, setBulkUserModal] = useState(false);
  const [bulkUserCount, setBulkUserCount] = useState('1');
  const [keyboardStatus, setKeyboardStatus] = useState(false);
  const [listNameModal, setListNameModal] = useState(false);
  const [listName, setListName] = useState({
    value: "",
    errorMessage: ""
  });

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
    setUsers([
      ...users,
      {
        userId: uuid.v4(),
        expanded: true,
        userName: {value: '', errorMessage: ''},
        userMobileNumber: {value: '', errorMessage: ''},
        userEmail: {value: '', errorMessage: ''},
        isValidUser: '',
      },
    ]);
  };

  const onAddBulkUserClick = () => {
    setBulkUserModal(true);
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
          newUserEmail.errorMessage === ''
            ? 'YES'
            : 'NO',
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

  const callApi = useCallback(() => {
    let requestArr: Omit<EachPerson, 'userId' | 'eventId'>[] = [];
    users.forEach(eachUser => {
      requestArr.push({
        userEmail: eachUser.userEmail?.value || "",
        userMobileNumber: eachUser.userMobileNumber?.value || "",
        userName: eachUser.userName.value,
        isPaymentPending: true,
        createdAt: new Date().toString(),
        paymentMode: '',
      });
    });
    let requestObj = {
      commonListName: listName.value,
      createdBy: auth().currentUser?.uid,
      createdAt: new Date().toString(),
      users: requestArr
    }
    dispatch(addCommonListAPICall(requestObj)).then(resp => {
      if (resp.meta.requestStatus === 'fulfilled') {
        if (Platform.OS === 'android' && resp.payload)
          ToastAndroid.show(resp.payload.message, ToastAndroid.SHORT);
        setUsers([
          {
            userId: uuid.v4(),
            expanded: true,
            userName: {value: '', errorMessage: ''},
            userMobileNumber: {value: '', errorMessage: ''},
            userEmail: {value: '', errorMessage: ''},
            isValidUser: '',
          },
        ])
        navigation.pop();
      } else {
        if (Platform.OS === 'android' && resp.payload)
          ToastAndroid.show(resp.payload.message, ToastAndroid.SHORT);
      }
    });
  },[]);

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
      setListNameModal(true)
    }
  };

  const onCancelClick = useCallback(() => {
    setBulkUserModal(false);
    setBulkUserCount('1');
  }, [setBulkUserModal, setBulkUserCount]);

  const onListNameCancelClick = useCallback(() => {
    setListNameModal(false);
    setListName({value: "", errorMessage: ""})
  }, [setListNameModal, setListName]);

  const onListNameConfirmClick = useCallback(() => {
    if(listName.value){
      setListName({...listName, errorMessage: ""})
      setListNameModal(false);
      callApi()
    }else {
      setListName({...listName, errorMessage: "List Name cannot be empty."})
    }
  }, [listName, setListName, setListNameModal, callApi ]);

  const onConfirmClick = useCallback(() => {
    let updatedUsers = [...users];
    generateArray(parseInt(bulkUserCount)).forEach(() => {
      updatedUsers.push({
        userId: uuid.v4(),
        expanded: true,
        userName: {value: '', errorMessage: ''},
        userMobileNumber: {value: '', errorMessage: ''},
        userEmail: {value: '', errorMessage: ''},
        isValidUser: '',
      });
    });
    setUsers(updatedUsers);
    setBulkUserModal(false);
  }, [users, bulkUserCount, setUsers, setBulkUserModal]);

  //create new instance of this function only when dependencies change
  const addBulkUserPopupData = useCallback((): popupData => {
    return {
      header: 'Add Bulk Users',
      description: 'Enter the no of users to add in bulk.',
      onCancelClick: onCancelClick,
      onConfirmClick: onConfirmClick,
    };
  }, [onCancelClick, onConfirmClick]);

   //create new instance of this function only when dependencies change
   const listNamePopupData = useCallback((): popupData => {
    return {
      header: 'Final Step',
      description: 'Name the list',
      onCancelClick: onListNameCancelClick,
      onConfirmClick: onListNameConfirmClick,
    };
  }, [onListNameCancelClick, onListNameConfirmClick]);

  const getBulkCountErrorMessage = () => {
    return bulkUserCount &&
      parseInt(bulkUserCount) >= 1 &&
      parseInt(bulkUserCount) <= MAX_BULK_ADDITION
      ? ''
      : bulkUserCount === ''
      ? 'User Count cannot be empty.'
      : parseInt(bulkUserCount) > MAX_BULK_ADDITION
      ? `Max cap is ${MAX_BULK_ADDITION}.`
      : 'Invalid Count.';
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
          <View style={styles.buttonContainer}>
            <ButtonComponent
              containerStyle={{paddingHorizontal: measureMents.leftPadding}}
              onPress={onAddUserClick}>
              ADD SINGLE USER
            </ButtonComponent>
            <ButtonComponent
              containerStyle={{paddingHorizontal: measureMents.leftPadding}}
              onPress={onAddBulkUserClick}>
              ADD BULK USERS
            </ButtonComponent>
          </View>
          <TextComponent
            style={{color: colors[theme].textColor, marginTop: 10}}
            weight="semibold">
            Total Users Added: {users.length}
          </TextComponent>
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
      <CenterPopupComponent
        popupData={addBulkUserPopupData}
        isModalVisible={bulkUserModal}
        setIsModalVisible={setBulkUserModal}>
        <InputComponent
          value={bulkUserCount}
          keyboardType="numeric"
          onChangeText={value => setBulkUserCount(value)}
          errorMessage={getBulkCountErrorMessage()}
        />
      </CenterPopupComponent>
      <CenterPopupComponent
        popupData={listNamePopupData}
        isModalVisible={listNameModal}
        setIsModalVisible={setListNameModal}>
        <InputComponent
          value={listName.value}
          onChangeText={value => setListName({ ...listName, value})}
          errorMessage={listName.errorMessage}
        />
      </CenterPopupComponent>
    </ScreenWrapper>
  );
};

export default CreateCommonList;

const styles = StyleSheet.create({
  description: {
    paddingTop: 10,
    paddingHorizontal: measureMents.leftPadding,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
