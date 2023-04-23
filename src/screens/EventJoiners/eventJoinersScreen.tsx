import React, {ReactElement, useCallback, useEffect, useState} from 'react';
import {
  Platform,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors, measureMents} from '../../utils/appStyles';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import {useAppDispatch, useAppSelector} from '../../reduxConfig/store';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../../navigation/homeStackNavigator';
import {useNavigation} from '@react-navigation/native';
import {
  EachPerson,
  removePeopleAPICall,
  updatePeopleAPICall,
  updatePeopleAPICallRequest,
} from '../../reduxConfig/slices/peopleSlice';
import BottomHalfPopupComponent, {
  EachAction,
} from '../../reusables/bottomHalfPopup';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CenterPopupComponent, {popupData} from '../../reusables/centerPopup';
import {TopTabParamList} from '../../navigation/topTabsNavigator';
import {RadioButtonComponent} from '../../reusables';
import {EachPaymentMethod} from '../addPeopleScreen';
import {MemoizedEventJoinerListComponent} from './eventJoinersListComponent';
import FeatherIcons from 'react-native-vector-icons/Feather';
import ScreenWrapper from '../screenWrapper';

type EventJoinersScreenProps = {
  type: 'all' | 'pending' | 'completed';
};

const EventJoinersScreen = ({
  type,
  ...props
}: EventJoinersScreenProps): ReactElement => {
  //navigation
  const navigation: NativeStackNavigationProp<
    HomeStackParamList,
    'EventJoinersTopTab'
  > = useNavigation();

  const TopTabNavigation: NativeStackNavigationProp<TopTabParamList, 'All'> =
    useNavigation();

  //useStates
  const [longPressedUser, setLongPressedUser] = useState<EachPerson | null>(null);

  //modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeletePopupVisible, setIsDeletePopupVisible] = useState(false);
  const [isMoveToCompletedPopupVisible, setIsMoveToCompletedPopupVisible] =
    useState(false);
  const [isMoveToPendingPopupVisible, setIsMoveToPendingPopupVisible] =
    useState(false);
  const [isPaymentModePopupVisible, setIsPaymentModePopupVisible] =
    useState(false);

  //payment modes inside the "Move to Completed" popup.
  let initialPaymentModes: EachPaymentMethod[] = [
    {id: 1, value: true, name: 'Cash', selected: true},
    {id: 2, value: false, name: 'Online', selected: false},
  ];
  const [paymentModes, setPaymentModes] =
    useState<EachPaymentMethod[]>(initialPaymentModes);

  //dispatch and selectors
  const dispatch = useAppDispatch();
  const theme = useAppSelector(state => state.user.currentUser.theme)

  const onLongPressUser = React.useCallback(
    (user: EachPerson) => {
      //when user click long press on any user show then buttons to mark user as complete or pending.
      setLongPressedUser(user);
      setIsModalVisible(!isModalVisible);
    },
    [isModalVisible],
  );

  const onMoveToCompletedClick = () => {
    setIsModalVisible(!isModalVisible);
    setIsPaymentModePopupVisible(!isPaymentModePopupVisible);
  };

  const onEditUserClick = () => {
    setIsModalVisible(!isModalVisible)
    setTimeout(()=> {
      if(longPressedUser) navigation.navigate("AddPeopleScreen", { longPressedUser });
    }, 400)
  }

  const onMoveToPendingClick = () => {
    setIsModalVisible(!isModalVisible);
    setIsMoveToPendingPopupVisible(!isMoveToPendingPopupVisible);
  };

  const onDeleteUserClick = () => {
    setIsModalVisible(!isModalVisible);
    setIsDeletePopupVisible(!isDeletePopupVisible);
  };

  const onDeleteCancelClick = useCallback(() => {
    setIsDeletePopupVisible(false);
  }, [setIsDeletePopupVisible]);
  
  const onPaymentModeCancelClick = useCallback(() => {
    setIsPaymentModePopupVisible(false);
    setPaymentModes(initialPaymentModes);
  }, [setIsPaymentModePopupVisible, setPaymentModes, initialPaymentModes]);
  
  const onMoveToCompletedCancelClick = useCallback(() => {
    setIsMoveToCompletedPopupVisible(false);
  }, [setIsMoveToCompletedPopupVisible]);
  
  const onMoveToPendingCancelClick = useCallback(() => {
    setIsMoveToPendingPopupVisible(false);
  }, [setIsMoveToPendingPopupVisible]);
  
  const onConfirmDeleteClick = React.useCallback(() => {
    //call delete API and delete the user from list.
    if (!longPressedUser) return;
    setIsDeletePopupVisible(false);
    dispatch(removePeopleAPICall({userId: longPressedUser?.userId})).then(resp => {
      if (resp.meta.requestStatus === 'fulfilled') {
        if (Platform.OS === 'android' && resp.payload)
          ToastAndroid.show(resp.payload.message, ToastAndroid.SHORT);
      } else {
        if (Platform.OS === 'android' && resp.payload)
          ToastAndroid.show(resp.payload.message, ToastAndroid.SHORT);
      }
    });
  }, [longPressedUser, dispatch, setIsDeletePopupVisible]);

  const onConfirmPaymentModeClick = React.useCallback(() => {
    setIsPaymentModePopupVisible(false);
    setIsMoveToCompletedPopupVisible(true);
  }, [setIsPaymentModePopupVisible, setIsMoveToCompletedPopupVisible]);

  const handleAPICall = useCallback((requestObj: updatePeopleAPICallRequest, isPending: boolean) => {
    dispatch(updatePeopleAPICall(requestObj)).then(resp => {
      if (resp.meta.requestStatus === 'fulfilled') {
        if (isPending) {
          TopTabNavigation.navigate('Completed');
          setPaymentModes(initialPaymentModes);
        } else TopTabNavigation.navigate('Pending');
        if (Platform.OS === 'android' && resp.payload)
          ToastAndroid.show(resp.payload.message, ToastAndroid.SHORT);
      } else {
        if (Platform.OS === 'android' && resp.payload)
          ToastAndroid.show(resp.payload.message, ToastAndroid.SHORT);
      }
    });
  },[dispatch, TopTabNavigation, setPaymentModes, initialPaymentModes])

  const onConfirmMoveClick = React.useCallback(() => {
    //update people list with updated value of isPending.
    if (!longPressedUser) return;
    let isPending = longPressedUser.isPaymentPending;
    setIsMoveToCompletedPopupVisible(false);
    setIsMoveToPendingPopupVisible(false);
    let requestObj: updatePeopleAPICallRequest = {
      userId: longPressedUser.userId,
      newUpdate: {isPaymentPending: !longPressedUser.isPaymentPending},
    };
    if (isPending) {
      //if admin is opting for payment completed right now, then pass payment mode in request obj
      paymentModes.forEach(eachMode => {
        if (eachMode.selected) requestObj.newUpdate.paymentMode = eachMode.name;
      });
    } else {
      //if admin is opting for payment pending, then pass payment mode as empty in request obj
      requestObj.newUpdate.paymentMode = '';
    }
    handleAPICall(requestObj, isPending)
  }, [
    longPressedUser,
    paymentModes,
    setIsMoveToCompletedPopupVisible,
    setIsMoveToPendingPopupVisible,
    handleAPICall
  ]);

  const onRadioBtnClick = React.useCallback((item: EachPaymentMethod) => {
    let updatedState = paymentModes.map(eachMethod =>
      eachMethod.id === item.id
        ? {...eachMethod, selected: true}
        : {...eachMethod, selected: false},
    );
    setPaymentModes(updatedState);
  },[paymentModes,setPaymentModes]) 

  const actionsArray: EachAction[] = [
    {
      label: 'Edit User',
      icon: () => (
        <FeatherIcons
          size={22}
          color={colors[theme].greyColor}
          name="edit-2"
        />
      ),
      onClick: () => onEditUserClick(),
      isVisible: true,
    },
    {
      label: 'Move to Completed',
      icon: () => (
        <EntypoIcons
          size={22}
          color={colors[theme].greyColor}
          name="chevron-with-circle-right"
        />
      ),
      onClick: () => onMoveToCompletedClick(),
      isVisible: longPressedUser?.isPaymentPending ? true : false,
    },
    {
      label: 'Move to Pending',
      icon: () => (
        <EntypoIcons
          size={22}
          color={colors[theme].greyColor}
          name="chevron-with-circle-right"
        />
      ),
      onClick: () => onMoveToPendingClick(),
      isVisible: !longPressedUser?.isPaymentPending ? true : false,
    },
    {
      label: 'Delete User',
      icon: () => (
        <MaterialIcons
          size={22}
          color={colors[theme].greyColor}
          name="delete-outline"
        />
      ),
      onClick: () => onDeleteUserClick(),
      isVisible: true,
    },
  ];

  const deletePopupData = React.useCallback((): popupData => {
    return {
      header: 'Delete User',
      description: 'Are you sure to remove this user? This cannot be undone.',
      onCancelClick: onDeleteCancelClick,
      onConfirmClick: onConfirmDeleteClick,
    };
  }, [onDeleteCancelClick, onConfirmDeleteClick]);

  //create new instance of this function only when dependencies change
  const choosePaymentModePopupData = React.useCallback((): popupData => {
    return {
      header: 'Choose Payment Mode',
      description:
        'Select the payment mode through which user has completed the payment.',
      onCancelClick: onPaymentModeCancelClick,
      onConfirmClick: onConfirmPaymentModeClick,
    };
  }, [onPaymentModeCancelClick, onConfirmPaymentModeClick]);

  //create new instance of this function only when dependencies change
  const moveToCompletedPopupData = React.useCallback((): popupData => {
    return {
      header: 'Move to Completed',
      description: 'Are you sure to move this user to completed tab?',
      onCancelClick: onMoveToCompletedCancelClick,
      onConfirmClick: onConfirmMoveClick,
    };
  }, [onMoveToCompletedCancelClick, onConfirmMoveClick]);

  //create new instance of this function only when dependencies change
  const moveToPendingPopupData = React.useCallback((): popupData => {
    return {
      header: 'Move to Pending',
      description:
        'Are you sure to move this user to pending tab? Pending tab includes users who have not yet completed the payment for this event.',
      onCancelClick: onMoveToPendingCancelClick,
      onConfirmClick: onConfirmMoveClick,
    };
  }, [onMoveToPendingCancelClick, onConfirmMoveClick]);

  return (
    <ScreenWrapper>
      <View style={styles.eventListContainer}>
        <MemoizedEventJoinerListComponent
          onLongPressUser={onLongPressUser}
          type={type}
        />
      </View>
      {type === 'all' ? (
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.addEventButton, { backgroundColor: colors[theme].commonPrimaryColor}]}
          onPress={() => navigation.navigate('AddPeopleScreen')}>
          <EntypoIcons name="plus" color={colors[theme].whiteColor} size={20} />
        </TouchableOpacity>
      ) : null}
      <BottomHalfPopupComponent
        actions={actionsArray}
        modalHeader="User Actions"
        showActions={true}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      />
      <CenterPopupComponent
        popupData={deletePopupData}
        isModalVisible={isDeletePopupVisible}
        setIsModalVisible={setIsDeletePopupVisible}
      />
      <CenterPopupComponent
        popupData={choosePaymentModePopupData}
        isModalVisible={isPaymentModePopupVisible}
        setIsModalVisible={setIsPaymentModePopupVisible}>
        <View style={styles.paymentModes}>
          {paymentModes.map(item => (
            <RadioButtonComponent
              onPress={() => onRadioBtnClick(item)}
              selected={item.selected}
              key={item.id}>
              {item.name}
            </RadioButtonComponent>
          ))}
        </View>
      </CenterPopupComponent>
      <CenterPopupComponent
        popupData={moveToCompletedPopupData}
        isModalVisible={isMoveToCompletedPopupVisible}
        setIsModalVisible={setIsMoveToCompletedPopupVisible}
      />
      <CenterPopupComponent
        popupData={moveToPendingPopupData}
        isModalVisible={isMoveToPendingPopupVisible}
        setIsModalVisible={setIsMoveToPendingPopupVisible}
      />
    </ScreenWrapper>
  );
};

export default EventJoinersScreen;

const styles = StyleSheet.create({
  eventListContainer: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: measureMents.leftPadding,
  },
  addEventButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 60,
    right: 30,
  },
  paymentModes: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    marginBottom: 30
  },
});
