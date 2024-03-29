import React, { ReactElement, useState, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Keyboard,
  Platform,
  ToastAndroid,
  TouchableOpacity,
} from 'react-native';
import { colors, measureMents } from '@/utils/appStyles';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/navigation/homeStackNavigator';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@/reduxConfig/store';
import { ButtonComponent, InputComponent, TextComponent } from '@/reusables';
import ScreenWrapper from '../screenWrapper';
import uuid from 'react-native-uuid';
import UpdateEachCommonListUser from './updateEachCommonGroupUser';
import {
  emailValidation,
  generateArray,
  mobileNumbervalidation,
} from '@/utils/commonFunctions';
import CenterPopupComponent, { popupData } from '@/reusables/centerPopup';
import { MAX_BULK_ADDITION } from '@/utils/constants';
import {
  EachPerson,
  UpdateCommonListRequestObj,
  getCommonListsAPICall,
  removeCustomListAPICall,
  updateCommonListAPICall,
} from '@/reduxConfig/slices/peopleSlice';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Animated, {
  Easing,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { withSpring } from 'react-native-reanimated';

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

const UpdateCommonGroupsUsersScreen = (): ReactElement => {
  //navigation and route state
  const navigation: NativeStackNavigationProp<
    HomeStackParamList,
    'UpdateCommonGroupsUsersScreen'
  > = useNavigation();

  const route: RouteProp<HomeStackParamList, 'UpdateCommonGroupsUsersScreen'> =
    useRoute();

  //dispatch and selectors
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.user.currentUser.theme);
  const selectedCommonList = useAppSelector((state) =>
    state.people.commonLists.find(
      (eachCommonList) =>
        eachCommonList.commonListId === route.params?.selectedCommonListId,
    ),
  );

  //useStates
  const [users, setUsers] = useState<EachUserFormData[]>([]);
  const [bulkUserCount, setBulkUserCount] = useState('1');
  const [removedUserIds, setRemovedUserIds] = useState<string[]>([]);
  const [keyboardStatus, setKeyboardStatus] = useState(false);
  const [listName, setListName] = useState({
    value: selectedCommonList?.commonListName || '',
    errorMessage: '',
  });
  const [showAddUserView, setShowAddUserView] = useState(false);

  //modal states
  const [bulkUserModal, setBulkUserModal] = useState(false);
  const [deleteListModal, setDeleteListModal] = useState(false);

  //UI thread values
  const translateY = useSharedValue(0);
  const height = useSharedValue(100);
  const lastContentOffset = useSharedValue(0);
  const isScrolling = useSharedValue(false);

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

  useEffect(() => {
    if (!selectedCommonList) return;
    let newArr: EachUserFormData[] = selectedCommonList?.users.map(
      (eachUser) => {
        return {
          userId: eachUser.userId,
          expanded: true,
          userName: { value: eachUser.userName, errorMessage: '' },
          userMobileNumber: {
            value: eachUser.userMobileNumber,
            errorMessage: '',
          },
          userEmail: { value: eachUser.userEmail, errorMessage: '' },
          isValidUser: 'YES',
        };
      },
    );
    setUsers(newArr);
  }, [selectedCommonList]);

  const onAddUserClick = () => {
    setUsers([
      ...users,
      {
        userId: uuid.v4() + 'newUser',
        expanded: true,
        userName: { value: '', errorMessage: '' },
        userMobileNumber: { value: '', errorMessage: '' },
        userEmail: { value: '', errorMessage: '' },
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
      let updatedArr;
      if (typeof userId === 'string') {
        updatedArr = users.map((eachUser) => {
          if (eachUser.userId === userId)
            return { ...eachUser, expanded: !eachUser.expanded };
          else return eachUser;
        });
        setUsers(updatedArr);
      }
    },
    [users, setUsers],
  );

  const deleteUser = useCallback(
    (userId: string | number[]) => {
      if (typeof userId === 'string') {
        setUsers(users.filter((eachUser) => eachUser.userId !== userId));
        if (!userId.includes('newUser'))
          setRemovedUserIds((prevState) => [...prevState, userId]);
      }
    },
    [setUsers, users],
  );

  const onChangeForm = useCallback(
    (
      value: string | boolean,
      fieldName: 'userName' | 'userMobileNumber' | 'userEmail',
      id: string | number[],
    ): void => {
      let newArr = users.map((eachUser) => {
        if (eachUser.userId === id)
          return {
            ...eachUser,
            [fieldName]: { ...eachUser[fieldName], value },
          };
        else return eachUser;
      });
      setUsers(newArr);
    },
    [users, setUsers],
  );

  const updateFormErrors = () => {
    const newArr = users.map((user) => {
      const { userName, userMobileNumber, userEmail } = user;
      const newUserName = userName.value.trim()
        ? { ...userName, errorMessage: '' }
        : { ...userName, errorMessage: 'User Name cannot be empty.' };
      const newUserMobileNumber =
        !userMobileNumber?.value.trim() ||
        mobileNumbervalidation(userMobileNumber.value.trim()).isValid
          ? { ...userMobileNumber, errorMessage: '' }
          : {
              ...userMobileNumber,
              errorMessage: mobileNumbervalidation(
                userMobileNumber.value.trim(),
              ).errorMessage,
            };
      const newUserEmail =
        !userEmail?.value.trim() ||
        emailValidation(userEmail.value.trim()).isValid
          ? { ...userEmail, errorMessage: '' }
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
    const { userName, userMobileNumber, userEmail } = user;
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

  const getRequestObj = () => {
    let newlyAddedUsers: Omit<EachPerson, 'userId' | 'eventId'>[] = [];
    let alreadyExistingUsers: Omit<
      EachPerson,
      'eventId' | 'isPaymentPending' | 'createdAt' | 'paymentMode'
    >[] = [];
    users.forEach((eachUser) => {
      if (
        typeof eachUser.userId === 'string' &&
        eachUser.userId.includes('newUser')
      ) {
        newlyAddedUsers.push({
          userEmail: eachUser.userEmail?.value || '',
          userMobileNumber: eachUser.userMobileNumber?.value || '',
          userName: eachUser.userName.value,
          isPaymentPending: true,
          createdAt: new Date().toString(),
          paymentMode: '',
        });
      } else {
        if (typeof eachUser.userId === 'string')
          alreadyExistingUsers.push({
            userEmail: eachUser.userEmail?.value || '',
            userMobileNumber: eachUser.userMobileNumber?.value || '',
            userName: eachUser.userName.value,
            userId: eachUser.userId,
          });
      }
    });
    return {
      commonListName: listName.value,
      commonListId: selectedCommonList?.commonListId,
      newlyAddedUsers,
      alreadyExistingUsers,
      removedUserIds,
    } as UpdateCommonListRequestObj;
  };

  const callApi = () => {
    dispatch(updateCommonListAPICall(getRequestObj())).then((resp) => {
      if (resp.meta.requestStatus === 'fulfilled') {
        if (Platform.OS === 'android' && resp.payload)
          ToastAndroid.show(resp.payload.message, ToastAndroid.SHORT);
        navigation.pop();
        dispatch(getCommonListsAPICall({ expanded: false }));
      } else {
        if (Platform.OS === 'android' && resp.payload)
          ToastAndroid.show(resp.payload.message, ToastAndroid.SHORT);
      }
    });
  };

  const onSaveChangesClick = () => {
    //here loop through all users data and check for name validation
    const allFieldsValid = users.every((user) => {
      return isUserValid(user);
    });

    if (!allFieldsValid) {
      updateFormErrors();
    } else {
      // all fields are valid, submit the form
      updateFormErrors();
      callApi();
    }
  };

  const onCancelClick = useCallback(() => {
    setBulkUserModal(false);
    setBulkUserCount('1');
  }, [setBulkUserModal, setBulkUserCount]);

  const onDeleteCancelClick = useCallback(() => {
    setDeleteListModal(false);
  }, [setDeleteListModal]);

  const onDeleteConfirmClick = useCallback(() => {
    if (!route.params?.selectedCommonListId) return;
    setDeleteListModal(false);
    //delete this list from common list and pop back to previous screen
    dispatch(
      removeCustomListAPICall({
        customListId: route.params?.selectedCommonListId,
      }),
    ).then((resp) => {
      if (resp.meta.requestStatus === 'fulfilled') {
        if (Platform.OS === 'android' && resp.payload)
          ToastAndroid.show(resp.payload.message, ToastAndroid.SHORT);
        navigation.pop();
      } else {
        if (Platform.OS === 'android' && resp.payload)
          ToastAndroid.show(resp.payload.message, ToastAndroid.SHORT);
      }
    });
  }, [route, setDeleteListModal, dispatch, navigation]);

  const onConfirmClick = useCallback(() => {
    let updatedUsers = [...users];
    generateArray(parseInt(bulkUserCount)).forEach(() => {
      updatedUsers.push({
        userId: uuid.v4() + 'newUser',
        expanded: true,
        userName: { value: '', errorMessage: '' },
        userMobileNumber: { value: '', errorMessage: '' },
        userEmail: { value: '', errorMessage: '' },
        isValidUser: '',
      });
    });
    setUsers(updatedUsers);
    setBulkUserModal(false);
  }, [users, bulkUserCount, setUsers, setBulkUserModal]);

  //create new instance of this function only when dependencies change
  const addBulkUserPopupData = useCallback((): popupData => {
    return {
      header: 'Add Users in Bulk',
      description: 'Enter the no of users to add in bulk.',
      onCancelClick: onCancelClick,
      onConfirmClick: onConfirmClick,
    };
  }, [onCancelClick, onConfirmClick]);

  //create new instance of this function only when dependencies change
  const deletePopupData = useCallback((): popupData => {
    return {
      header: `Delete ${route.params?.selectedCommonListName} ?`,
      description: 'Are you sure to delete this group? This cannot be undone.',
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
      ? 'Users Count cannot be empty.'
      : parseInt(bulkUserCount) > MAX_BULK_ADDITION
      ? `Max cap is ${MAX_BULK_ADDITION}.`
      : 'Invalid Count.';
  };

  const onPlusClick = () => {
    setShowAddUserView(!showAddUserView);
  };

  const onDeleteCommonListClick = () => {
    setDeleteListModal(true);
  };

  const scrollHandler = useAnimatedScrollHandler({
    //this hook automatically makes every fun inside as worklet
    onScroll: (event) => {
      if (
        lastContentOffset.value > event.contentOffset.y &&
        isScrolling.value
      ) {
        //user is going up the list by scrolling down, show the header.
        translateY.value = 0;
        height.value = 100;
      } else if (
        lastContentOffset.value < event.contentOffset.y &&
        isScrolling.value
      ) {
        //user is going down the list by scrolling up, hide the header.
        translateY.value = -100;
        height.value = 0;
      }
      lastContentOffset.value = event.contentOffset.y;
    },
    onBeginDrag: () => {
      isScrolling.value = true;
    },
    onEndDrag: () => {
      isScrolling.value = false;
    },
  });

  const actionBarStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withSpring(translateY.value),
        },
      ],
      height: withTiming(height.value, {
        duration: 800,
        easing: Easing.inOut(Easing.ease),
      }),
    };
  });

  return (
    <ScreenWrapper>
      <Animated.View
        style={[
          styles.nameAndDeleteButtonContainer,
          { backgroundColor: colors[theme].cardColor },
          actionBarStyle,
        ]}
      >
        <View style={styles.nameContainer}>
          <InputComponent
            value={listName.value}
            onChangeText={(value) => setListName({ ...listName, value })}
            errorMessage={listName.errorMessage}
          />
        </View>
        <TouchableOpacity
          onPress={onDeleteCommonListClick}
          style={styles.deleteButtonContainer}
        >
          <MaterialIcons
            size={30}
            color={colors[theme].errorColor}
            name="delete-outline"
          />
        </TouchableOpacity>
      </Animated.View>
      <Animated.FlatList
        data={users}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        style={{
          paddingHorizontal: measureMents.leftPadding,
          marginTop: 20,
          paddingVertical: measureMents.leftPadding,
          marginBottom: 20,
        }}
        renderItem={({ item }) => (
          <UpdateEachCommonListUser
            eachUser={item}
            deleteUser={deleteUser}
            expandUser={expandUser}
            onChangeForm={onChangeForm}
            isUserValid={item.isValidUser}
          />
        )}
        keyExtractor={(item) => item.userId.toString()}
      />
      {!keyboardStatus ? (
        <View
          style={[
            {
              paddingBottom: 20,
              paddingHorizontal: measureMents.leftPadding,
            },
          ]}
        >
          <ButtonComponent
            onPress={onSaveChangesClick}
            isDisabled={users.length === 0}
          >
            Save Changes
          </ButtonComponent>
        </View>
      ) : null}
      <CenterPopupComponent
        popupData={addBulkUserPopupData}
        isModalVisible={bulkUserModal}
        setIsModalVisible={setBulkUserModal}
      >
        <InputComponent
          value={bulkUserCount}
          keyboardType="numeric"
          onChangeText={(value) => setBulkUserCount(value)}
          errorMessage={getBulkCountErrorMessage()}
        />
      </CenterPopupComponent>
      <CenterPopupComponent
        popupData={deletePopupData}
        isModalVisible={deleteListModal}
        setIsModalVisible={setDeleteListModal}
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
          ]}
        >
          <TouchableOpacity
            onPress={onAddUserClick}
            style={[styles.commonAddUserView]}
          >
            <TextComponent
              style={{ color: colors[theme].blackColor }}
              weight="semibold"
            >
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
            style={styles.commonAddUserView}
          >
            <TextComponent
              style={{ color: colors[theme].blackColor }}
              weight="semibold"
            >
              Add Users in Bulk
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
            { backgroundColor: colors[theme].commonPrimaryColor },
          ]}
        >
          <EntypoIcons name="plus" color={colors[theme].whiteColor} size={20} />
        </TouchableOpacity>
      ) : null}
    </ScreenWrapper>
  );
};

export default UpdateCommonGroupsUsersScreen;

const styles = StyleSheet.create({
  nameAndDeleteButtonContainer: {
    //paddingVertical: 10,
    paddingHorizontal: measureMents.leftPadding,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    marginHorizontal: measureMents.leftPadding,
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
    justifyContent: 'flex-end',
  },
});
