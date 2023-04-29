import React, {ReactElement, useState, useCallback, useEffect} from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Keyboard,
  Platform,
  ToastAndroid,
  TouchableOpacity,
} from 'react-native';
import {colors, measureMents} from '../../utils/appStyles';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../../navigation/homeStackNavigator';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../../reduxConfig/store';
import {ButtonComponent, InputComponent, TextComponent} from '../../reusables';
import ScreenWrapper from '../screenWrapper';
import uuid from 'react-native-uuid';
import UpdateEachCommonListUser from './updateEachCommonListUser';
import {
  emailValidation,
  generateArray,
  mobileNumbervalidation,
} from '../../utils/commonFunctions';
import CenterPopupComponent, {popupData} from '../../reusables/centerPopup';
import {MAX_BULK_ADDITION} from '../../utils/constants';
import {
    CommonListObject,
  EachPerson,
  addCommonListAPICall,
  removeCustomListAPICall,
} from '../../reduxConfig/slices/peopleSlice';
import auth from '@react-native-firebase/auth';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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

const UpdateCommonListUsersScreen = (): ReactElement => {
  //navigation and route state
  const navigation: NativeStackNavigationProp<
    HomeStackParamList,
    'UpdateCommonListUsersScreen'
  > = useNavigation();

  const route: RouteProp<HomeStackParamList, 'UpdateCommonListUsersScreen'> = useRoute();

  //dispatch and selectors
  const dispatch = useAppDispatch();
  const theme = useAppSelector(state => state.user.currentUser.theme);

  //useStates
  const [users, setUsers] = useState<EachUserFormData[]>([]);
  const [bulkUserCount, setBulkUserCount] = useState('1');
  const [keyboardStatus, setKeyboardStatus] = useState(false);
  const [listName, setListName] = useState({
    value: '',
    errorMessage: '',
  });
  const [showAddUserView, setShowAddUserView] = useState(false);

  //modal states
  const [bulkUserModal, setBulkUserModal] = useState(false);
  const [listNameModal, setListNameModal] = useState(false);
  const [deleteListModal, setDeleteListModal] = useState(false);

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
    setShowAddUserView(!showAddUserView);
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

  const getRequestObj = useCallback(
    (listNameValue: string) => {
      let requestArr: Omit<EachPerson, 'userId' | 'eventId'>[] = [];
      users.forEach(eachUser => {
        requestArr.push({
          userEmail: eachUser.userEmail?.value || '',
          userMobileNumber: eachUser.userMobileNumber?.value || '',
          userName: eachUser.userName.value,
          isPaymentPending: true,
          createdAt: new Date().toString(),
          paymentMode: '',
        });
      });
      return {
        commonListName: listNameValue,
        createdBy: auth().currentUser?.uid,
        createdAt: new Date().toString(),
        users: requestArr,
      };
    },
    [users, auth().currentUser?.uid, new Date().toString()],
  );

  const callApi = useCallback(
    (listNameValue: string) => {
      dispatch(addCommonListAPICall(getRequestObj(listNameValue))).then(
        resp => {
          if (resp.meta.requestStatus === 'fulfilled') {
            if (Platform.OS === 'android' && resp.payload)
              ToastAndroid.show(resp.payload.message, ToastAndroid.SHORT);
            navigation.pop();
          } else {
            if (Platform.OS === 'android' && resp.payload)
              ToastAndroid.show(resp.payload.message, ToastAndroid.SHORT);
          }
        },
      );
    },
    [dispatch, navigation, getRequestObj],
  );

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
      setListNameModal(true);
    }
  };

  const onCancelClick = useCallback(() => {
    setBulkUserModal(false);
    setBulkUserCount('1');
  }, [setBulkUserModal, setBulkUserCount]);

  const onListNameCancelClick = useCallback(() => {
    setListNameModal(false);
    setListName({value: '', errorMessage: ''});
  }, [setListNameModal, setListName]);
  
  const onDeleteCancelClick = useCallback(() => {
    setDeleteListModal(false);
  },[setDeleteListModal])

  const onListNameConfirmClick = useCallback(() => {
    if (listName.value) {
      setListName({...listName, errorMessage: ''});
      setListNameModal(false);
      callApi(listName.value);
    } else {
      setListName({...listName, errorMessage: 'List Name cannot be empty.'});
    }
  }, [listName, setListName, setListNameModal, callApi]);

  const onDeleteConfirmClick = useCallback(()=> {
    if(!route.params?.selectedCommonListId) return;
     //delete this list from common list and pop back to previous screen
     dispatch(removeCustomListAPICall({ customListId: route.params?.selectedCommonListId })).then(
        resp => {
          if (resp.meta.requestStatus === 'fulfilled') {
            if (Platform.OS === 'android' && resp.payload)
              ToastAndroid.show(resp.payload.message, ToastAndroid.SHORT);
            navigation.pop();
          } else {
            if (Platform.OS === 'android' && resp.payload)
              ToastAndroid.show(resp.payload.message, ToastAndroid.SHORT);
          }
        },
      );
  },[route, dispatch, navigation, ])

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

  //create new instance of this function only when dependencies change
  const deletePopupData = useCallback((): popupData => {
    return {
      header: `Delete ${route.params?.selectedCommonListName} ?`,
      description: 'Are you sure to delete this list? This cannot be undone.',
      onCancelClick: onDeleteCancelClick,
      onConfirmClick: onDeleteConfirmClick,
    };
  }, [onDeleteCancelClick, onDeleteConfirmClick, route]);

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

  const onPlusClick = () => {
    setShowAddUserView(!showAddUserView);
  };

  const onDeleteCommonListClick = () => {
    setDeleteListModal(true)
  }

  return (
    <ScreenWrapper>
      {!keyboardStatus ? (
        <View
          style={[
            styles.nameAndDeleteButtonContainer,
            {backgroundColor: colors[theme].cardColor},
          ]}>
          <View style={styles.nameContainer}>
            <InputComponent
              value={listName.value}
              onChangeText={value => setListName({...listName, value})}
              errorMessage={listName.errorMessage}
            />
          </View>
          <TouchableOpacity onPress={onDeleteCommonListClick} style={styles.deleteButtonContainer}>
            <MaterialIcons
              size={30}
              color={colors[theme].errorColor}
              name="delete-outline"
            />
          </TouchableOpacity>
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
          <UpdateEachCommonListUser
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
        <View
          style={[
            {paddingBottom: 20, paddingHorizontal: measureMents.leftPadding},
          ]}>
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
          onChangeText={value => setListName({...listName, value})}
          errorMessage={listName.errorMessage}
        />
      </CenterPopupComponent>
      <CenterPopupComponent
       popupData={deletePopupData}
       isModalVisible = {deleteListModal}
       setIsModalVisible= {setDeleteListModal}
      />
      {showAddUserView && !keyboardStatus ? (
        <View
          style={[
            styles.addUsersView,
            {
              backgroundColor: colors[theme].whiteColor,
              borderColor: colors[theme].blackColor,
              borderWidth: 1,
            },
          ]}>
          <TouchableOpacity
            onPress={onAddUserClick}
            style={[styles.commonAddUserView]}>
            <TextComponent
              style={{color: colors[theme].blackColor}}
              weight="semibold">
              {' '}
              Add Single User
            </TextComponent>
          </TouchableOpacity>
          <View
            style={{
              borderBottomColor: colors[theme].greyColor,
              borderBottomWidth: StyleSheet.hairlineWidth,
              marginHorizontal: '10%',
            }}
          />
          <TouchableOpacity
            onPress={onAddBulkUserClick}
            style={styles.commonAddUserView}>
            <TextComponent
              style={{color: colors[theme].blackColor}}
              weight="semibold">
              Add Bulk User
            </TextComponent>
          </TouchableOpacity>
        </View>
      ) : null}
      {!keyboardStatus ? (
        <TouchableOpacity
          onPress={onPlusClick}
          activeOpacity={0.7}
          style={[
            styles.addUser,
            {backgroundColor: colors[theme].commonPrimaryColor},
          ]}>
          <EntypoIcons name="plus" color={colors[theme].whiteColor} size={20} />
        </TouchableOpacity>
      ) : null}
    </ScreenWrapper>
  );
};

export default UpdateCommonListUsersScreen;

const styles = StyleSheet.create({
  nameAndDeleteButtonContainer: {
    paddingVertical: 10,
    paddingHorizontal: measureMents.leftPadding,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addUsersView: {
    height: 100,
    width: 150,
    position: 'absolute',
    right: 25,
    bottom: 160,
    borderRadius: 20,
  },
  addUser: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 100,
    right: 20,
  },
  commonAddUserView: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.5,
    paddingHorizontal: '10%',
  },
  nameContainer: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonContainer: {
    width: '20%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
