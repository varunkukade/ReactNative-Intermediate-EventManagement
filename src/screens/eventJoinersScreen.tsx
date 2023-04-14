import React, {ReactElement, useEffect, useState} from 'react';
import {
  Platform,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors, measureMents} from '../utils/appStyles';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';
import TextComponent from '../reusables/text';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import {useAppDispatch, useAppSelector} from '../reduxConfig/store';
import {generateArray} from '../utils/commonFunctions';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../navigation/homeStackNavigator';
import {useNavigation} from '@react-navigation/native';
import {
  EachPerson,
  getPeopleAPICall,
  removePeopleAPICall,
  updatePeopleAPICall,
  updatePeopleAPICallRequest,
} from '../reduxConfig/slices/peopleSlice';
import BottomHalfPopupComponent, {
  EachAction,
} from '../reusables/bottomHalfPopup';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CenterPopupComponent, {popupData} from '../reusables/centerPopup';
import {TopTabParamList} from '../navigation/topTabsNavigator';
import {RadioButtonComponent} from '../reusables';
import {EachPaymentMethod} from './addPeopleScreen';

type EventJoinersScreenProps = {
  type: 'all' | 'pending' | 'completed';
};

const EventJoinersScreen = ({
  type,
  ...props
}: EventJoinersScreenProps): ReactElement => {
  const skelatons = generateArray(5);
  let dataProvider = new DataProvider((r1, r2) => {
    return r1 !== r2;
  });

  //navigation
  const navigation: NativeStackNavigationProp<
    HomeStackParamList,
    'EventJoinersTopTab'
  > = useNavigation();

  const TopTabNavigation: NativeStackNavigationProp<TopTabParamList, 'All'> =
    useNavigation();

  //useStates
  const [selectedUser, setSelectedUser] = useState<EachPerson | null>(null);

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
  ]
  const [paymentModes, setPaymentModes] = useState<EachPaymentMethod[]>(initialPaymentModes);

  const currentSelectedEvent = useAppSelector(
    state => state.events.currentSelectedEvent,
  );

  const getPeopleArray = (peopleState: EachPerson[]) => {
    if (type === 'all')
      return peopleState.filter(
        eachPerson => eachPerson.eventId === currentSelectedEvent?.eventId,
      );
    else if (type === 'pending')
      return peopleState.filter(
        eachPerson =>
          eachPerson.isPaymentPending &&
          eachPerson.eventId === currentSelectedEvent?.eventId,
      );
    else
      return peopleState.filter(
        eachPerson =>
          !eachPerson.isPaymentPending &&
          eachPerson.eventId === currentSelectedEvent?.eventId,
      );
  };

  //dispatch and selectors
  const dispatch = useAppDispatch();
  const peopleState = useAppSelector(state => state.people);
  const peopleData = dataProvider.cloneWithRows(
    getPeopleArray(peopleState.people),
  );

  useEffect(() => {
    dispatch(getPeopleAPICall()).then(res => {
      if (res.meta.requestStatus === 'rejected' && res.payload) {
        if (Platform.OS === 'android')
          ToastAndroid.show(res.payload.message, ToastAndroid.SHORT);
      }
    });
  }, []);

  //layout provider helps recycler view to get the dimensions straight ahead and avoid the expensive calculation
  let layoutProvider = new LayoutProvider(
    index => {
      return 0;
    },
    (type, dim) => {
      dim.width = measureMents.windowWidth - 2 * measureMents.leftPadding;
      dim.height = 100;
    },
  );

  const onLongPressUser = (user: EachPerson) => {
    //when user click long press on any user show then buttons to mark user as complete or pending.
    setSelectedUser(user);
    setIsModalVisible(!isModalVisible);
  };

  //Given type and data return the View component
  const rowRenderer = (
    type: number,
    data: EachPerson,
    index: number,
  ): ReactElement => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        key={index}
        onLongPress={() => onLongPressUser(data)}
        style={styles.eachEventComponent}>
        <View style={styles.secondSection}>
          <TextComponent
            numberOfLines={2}
            weight="normal"
            style={{
              color: colors.primaryColor,
              fontSize: 14,
            }}>
            {data.userName}
          </TextComponent>
          <TextComponent
            weight="bold"
            style={{
              color: colors.primaryColor,
              fontSize: 15,
            }}>
            +91 {data.userMobileNumber}
          </TextComponent>
        </View>
        <View style={styles.thirdSection}>
          <EntypoIcons
            name="chevron-right"
            color={colors.primaryColor}
            size={27}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const onMoveToCompletedClick = () => {
    setIsModalVisible(!isModalVisible);
    setIsPaymentModePopupVisible(!isPaymentModePopupVisible);
  };

  const onMoveToPendingClick = () => {
    setIsModalVisible(!isModalVisible);
    setIsMoveToPendingPopupVisible(!isMoveToPendingPopupVisible);
  };

  const onDeleteUserClick = () => {
    setIsModalVisible(!isModalVisible);
    setIsDeletePopupVisible(!isDeletePopupVisible);
  };

  const onCancelClick = () => {
    if (isDeletePopupVisible) setIsDeletePopupVisible(false);
    if (isMoveToCompletedPopupVisible) setIsMoveToCompletedPopupVisible(false);
    if (isMoveToPendingPopupVisible) setIsMoveToPendingPopupVisible(false);
    if (isPaymentModePopupVisible) setIsPaymentModePopupVisible(false);
    setPaymentModes(initialPaymentModes)
  };

  const onConfirmDeleteClick = () => {
    //call delete API and delete the user from list.
    if (!selectedUser) return;
    setIsDeletePopupVisible(false);
    dispatch(removePeopleAPICall({userId: selectedUser?.userId})).then(resp => {
      if (resp.meta.requestStatus === 'fulfilled') {
        if (Platform.OS === 'android' && resp.payload)
          ToastAndroid.show(resp.payload.message, ToastAndroid.SHORT);
      } else {
        if (Platform.OS === 'android' && resp.payload)
          ToastAndroid.show(resp.payload.message, ToastAndroid.SHORT);
      }
    });
  };

  const onConfirmPaymentModeClick = () => {
    setIsPaymentModePopupVisible(false);
    setIsMoveToCompletedPopupVisible(true)
  };

  const onConfirmMoveClick = () => {
    //update people list with updated value of isPending.
    if (!selectedUser) return;
    let isPending = selectedUser.isPaymentPending;
    setIsMoveToCompletedPopupVisible(false);
    setIsMoveToPendingPopupVisible(false);
    let requestObj: updatePeopleAPICallRequest = {
      userId: selectedUser.userId,
      newUpdate: {isPaymentPending: !selectedUser.isPaymentPending },
    }
    if(isPending){
      //if admin is opting for payment completed right now, then pass payment mode in request obj
      paymentModes.forEach(eachMode => {
        if (eachMode.selected) requestObj.newUpdate.paymentMode = eachMode.name;
      });
    }else {
      //if admin is opting for payment pending, then pass payment mode as empty in request obj
      requestObj.newUpdate.paymentMode = ""
    }
    dispatch(
      updatePeopleAPICall(requestObj),
    ).then(resp => {
      if (resp.meta.requestStatus === 'fulfilled') {
        if (isPending) {
          TopTabNavigation.navigate('Completed');
          setPaymentModes(initialPaymentModes)
        }
        else TopTabNavigation.navigate('Pending');
        if (Platform.OS === 'android' && resp.payload)
          ToastAndroid.show(resp.payload.message, ToastAndroid.SHORT);
      } else {
        if (Platform.OS === 'android' && resp.payload)
          ToastAndroid.show(resp.payload.message, ToastAndroid.SHORT);
      }
    });
  };

  const onRadioBtnClick = (item: EachPaymentMethod) => {
    let updatedState = paymentModes.map(eachMethod =>
      eachMethod.id === item.id
        ? {...eachMethod, selected: true}
        : {...eachMethod, selected: false},
    );
    setPaymentModes(updatedState);
  };

  let actionsArray: EachAction[] = [
    {
      label: 'Move to Completed',
      icon: () => (
        <EntypoIcons
          size={22}
          color={colors.blackColor}
          name="chevron-with-circle-right"
        />
      ),
      onClick: () => onMoveToCompletedClick(),
      isVisible: selectedUser?.isPaymentPending ? true : false,
    },
    {
      label: 'Move to Pending',
      icon: () => (
        <EntypoIcons
          size={22}
          color={colors.blackColor}
          name="chevron-with-circle-right"
        />
      ),
      onClick: () => onMoveToPendingClick(),
      isVisible: !selectedUser?.isPaymentPending ? true : false,
    },
    {
      label: 'Delete User',
      icon: () => (
        <MaterialIcons
          size={22}
          color={colors.blackColor}
          name="delete-outline"
        />
      ),
      onClick: () => onDeleteUserClick(),
      isVisible: true,
    },
  ];

  let deletePopupData: popupData = {
    header: 'Delete User',
    description: 'Are you sure to remove this user? This cannot be undone.',
    onCancelClick: onCancelClick,
    onConfirmClick: onConfirmDeleteClick,
  };

  let choosePaymentModePopupData: popupData = {
    header: 'Choose Payment Mode',
    description:
      'Select the payment mode through which user has completed the payment.',
    onCancelClick: onCancelClick,
    onConfirmClick: onConfirmPaymentModeClick,
  };

  let moveToCompletedPopupData: popupData = {
    header: 'Move to Completed',
    description:
      'Are you sure to move this user to completed tab?',
    onCancelClick: onCancelClick,
    onConfirmClick: onConfirmMoveClick,
  };

  let moveToPendingPopupData: popupData = {
    header: 'Move to Pending',
    description:
      'Are you sure to move this user to pending tab? Pending tab includes users who have not yet completed the payment for this event.',
    onCancelClick: onCancelClick,
    onConfirmClick: onConfirmMoveClick,
  };

  return (
    <>
      <View style={styles.eventListContainer}>
        <TextComponent
          weight="bold"
          style={{color: colors.blackColor, fontSize: 15, marginBottom: 10}}>
          Total People:{' '}
          {peopleData?.getSize() && peopleData?.getSize() > 0
            ? peopleData?.getSize()
            : 0}
        </TextComponent>
        {peopleState.statuses.getPeopleAPICall === 'succeedded' &&
        peopleData?.getSize() > 0 ? (
          <RecyclerListView
            rowRenderer={rowRenderer}
            dataProvider={peopleData}
            layoutProvider={layoutProvider}
            initialRenderIndex={0}
            scrollViewProps={{showsVerticalScrollIndicator: false}}
          />
        ) : peopleState.statuses.getPeopleAPICall === 'loading' ? (
          skelatons.map((eachItem, index) => (
            <View key={index} style={styles.eventLoadingSkelaton} />
          ))
        ) : peopleState.statuses.getPeopleAPICall === 'failed' ? (
          <View style={[styles.eventLoadingSkelaton, {marginTop: 30}]}>
            <TextComponent weight="bold">
              'Failed to fetch users. Please try again after some time'
            </TextComponent>
          </View>
        ) : (
          <View style={[styles.eventLoadingSkelaton, {marginTop: 30}]}>
            <TextComponent style={{color: colors.greyColor}} weight="bold">
              No Records Found!
            </TextComponent>
          </View>
        )}
      </View>
      {type === 'all' ? (
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.addEventButton}
          onPress={() => navigation.navigate('AddPeopleScreen')}>
          <EntypoIcons name="plus" color={colors.whiteColor} size={20} />
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
        setIsModalVisible={setIsPaymentModePopupVisible}
        >
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
    </>
  );
};

export default EventJoinersScreen;

const styles = StyleSheet.create({
  eventListContainer: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: measureMents.leftPadding,
  },
  eachEventComponent: {
    backgroundColor: colors.whiteColor,
    height: 90,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: measureMents.leftPadding,
  },
  eventLoadingSkelaton: {
    backgroundColor: colors.lavenderColor,
    height: 90,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondSection: {
    width: '80%',
    height: '100%',
    justifyContent: 'space-evenly',
  },
  thirdSection: {
    width: '20%',
    height: '100%',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  navigateButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addEventButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primaryColor,
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
  },
});
