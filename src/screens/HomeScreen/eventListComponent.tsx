import React, {ReactElement, useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ToastAndroid,
  Platform,
  RefreshControl,
} from 'react-native';
import {colors, measureMents} from '../../utils/appStyles';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';
import TextComponent from '../../reusables/text';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import {useAppDispatch, useAppSelector} from '../../reduxConfig/store';
import {generateArray} from '../../utils/commonFunctions';
import {
  EachEvent,
  getEventsAPICall,
  getNextEventsAPICall,
  removeEventAPICall,
  setEvents,
  setSelectedEvent,
} from '../../reduxConfig/slices/eventsSlice';
import moment from 'moment';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../../navigation/homeStackNavigator';
import {useNavigation} from '@react-navigation/native';
import BottomHalfPopupComponent, {
  EachAction,
} from '../../reusables/bottomHalfPopup';
import CenterPopupComponent from '../../reusables/centerPopup';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FeatherIcons from 'react-native-vector-icons/Feather';
import {ActivityIndicator} from 'react-native-paper';
import {InputComponent} from '../../reusables';
import {debounce} from 'lodash';

const EventListComponent = (): ReactElement => {
  const skelatons = generateArray(5);
  let dataProvider = new DataProvider((r1, r2) => {
    return r1 !== r2;
  });

  //navigation
  const navigation: NativeStackNavigationProp<
    HomeStackParamList,
    'BottomTabNavigator'
  > = useNavigation();

  //dispatch and selectors
  const dispatch = useAppDispatch();
  const eventState = useAppSelector(state => state.events);
  const events = useAppSelector(state => state.events.events);
  const originalEventState = useAppSelector(
    state => state.events.originalEvents,
  );
  const eventsData = dataProvider.cloneWithRows(events);
  const theme = useAppSelector(state => state.user.currentUser.theme);

  //useStates
  const [longPressedEvent, setLongPressedEvent] = useState<EachEvent | null>(
    null,
  );
  const [searchedEvent, setSearchedEvent] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  //modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeletePopupVisible, setIsDeletePopupVisible] = useState(false);

  useEffect(() => {
    dispatch(getEventsAPICall()).then(resp => {
      if (resp.payload && resp.meta.requestStatus === 'rejected') {
        if (Platform.OS === 'android')
          ToastAndroid.show(resp.payload?.message, ToastAndroid.SHORT);
      }
    });
  }, []);

  const fetchMoreEvents = () => {
    if (eventState.statuses.getNextEventsAPICall === 'loading') return;
    dispatch(getNextEventsAPICall()).then(resp => {
      if (resp.payload && resp.meta.requestStatus === 'rejected') {
        if (Platform.OS === 'android')
          ToastAndroid.show(resp.payload?.message, ToastAndroid.SHORT);
      }
      if (
        resp.payload &&
        resp.meta.requestStatus === 'fulfilled' &&
        resp.payload.successMessagetype === 'noMoreEvents'
      ) {
        if (Platform.OS === 'android')
          ToastAndroid.showWithGravity(
            resp.payload?.message,
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
      }
    });
  };

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

  const onLongPressEvent = (data: EachEvent) => {
    setLongPressedEvent(data);
    setIsModalVisible(true);
  };

  //Given type and data return the View component
  const rowRenderer = (
    type: number,
    data: EachEvent,
    index: number,
  ): ReactElement => {
    return (
      <TouchableOpacity
        onLongPress={() => onLongPressEvent(data)}
        onPress={() => {
          dispatch(setSelectedEvent(data));
          navigation.navigate('EventDetailsScreen');
        }}
        activeOpacity={0.5}
        key={index}
        style={[
          styles.eachEventComponent,
          {backgroundColor: colors[theme].cardColor},
        ]}>
        <View style={styles.secondSection}>
          <TextComponent
            weight="normal"
            style={{
              color: colors[theme].textColor,
              fontSize: 14,
            }}>
            {data.eventTitle}
          </TextComponent>
          <TextComponent
            weight="bold"
            style={{
              color: colors[theme].textColor,
              fontSize: 15,
            }}>
            {moment(new Date(data.eventDate)).format('LL')}
          </TextComponent>
        </View>
        <View style={styles.thirdSection}>
          <View
            activeOpacity={0.7}
            style={[
              styles.navigateButton,
              {backgroundColor: colors[theme].primaryColor},
            ]}>
            <EntypoIcons
              name="chevron-right"
              color={colors[theme].whiteColor}
              size={20}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const onDeleteEventClick = () => {
    setIsModalVisible(!isModalVisible);
    setIsDeletePopupVisible(!isDeletePopupVisible);
  };

  const onEditEventClick = () => {
    setIsModalVisible(!isModalVisible);
    setTimeout(() => {
      if (longPressedEvent)
        navigation.navigate('AddEventScreen', {longPressedEvent});
    }, 400);
  };

  const onCancelClick = React.useCallback(() => {
    setIsDeletePopupVisible(false);
  }, [setIsDeletePopupVisible]);

  const onConfirmDeleteClick = React.useCallback(() => {
    //call delete API and delete the user from list.
    if (!longPressedEvent) return;
    dispatch(removeEventAPICall({eventId: longPressedEvent.eventId})).then(
      resp => {
        if (resp.meta.requestStatus === 'fulfilled') {
          setIsDeletePopupVisible(false);
          if (Platform.OS === 'android' && resp.payload)
            ToastAndroid.show(resp.payload.message, ToastAndroid.SHORT);
        } else {
          if (Platform.OS === 'android' && resp.payload)
            ToastAndroid.show(resp.payload.message, ToastAndroid.SHORT);
        }
      },
    );
  }, [longPressedEvent, dispatch, removeEventAPICall, setIsDeletePopupVisible]);

  let actionsArray: EachAction[] = [
    {
      label: 'Edit     Event',
      icon: () => (
        <FeatherIcons size={22} color={colors[theme].greyColor} name="edit-2" />
      ),
      onClick: () => onEditEventClick(),
      isVisible: true,
    },
    {
      label: 'Delete Event',
      icon: () => (
        <MaterialIcons
          size={22}
          color={colors[theme].greyColor}
          name="delete-outline"
        />
      ),
      onClick: () => onDeleteEventClick(),
      isVisible: true,
    },
  ];

  const deletePopupData = React.useCallback(() => {
    return {
      header: 'Delete Event',
      description: 'Are you sure to remove this event? This cannot be undone.',
      onCancelClick: onCancelClick,
      onConfirmClick: onConfirmDeleteClick,
    };
  }, [onCancelClick, onConfirmDeleteClick]);

  const getFooter = () => {
    if (eventState.statuses.getNextEventsAPICall === 'loading')
      return (
        <View style={styles.footerContainer}>
          <ActivityIndicator
            color={
              theme === 'light'
                ? colors.light.commonPrimaryColor
                : colors.dark.whiteColor
            }
          />
          <TextComponent
            style={{
              color:
                theme === 'light'
                  ? colors.light.commonPrimaryColor
                  : colors.dark.whiteColor,
              fontSize: 16,
              marginTop: 5,
            }}
            weight="bold">
            Fetching More Events...
          </TextComponent>
        </View>
      );
    else return null;
  };

  const showSearchedEvents = useCallback(
    debounce(searchedValue => {
      let updatedEvents;
      if (searchedValue === '') {
        updatedEvents = originalEventState.map(eachEvent => {
          return eachEvent;
        });
      } else {
        let updatedSearchValue = searchedValue
          .toLowerCase()
          .trim()
          .split(' ')
          .join('');
        updatedEvents = originalEventState.filter(eachEvent => {
          if (
            eachEvent.eventTitle
              .toLowerCase()
              .trim()
              .split(' ')
              .join('')
              .includes(updatedSearchValue)
          ) {
            return true;
          } else {
            let eventDateArray = moment(new Date(eachEvent.eventDate))
              .format('LL')
              .split(' ');
            //eventDateArray = [ "May", "4", "2023"]
            let matched = false;
            eventDateArray.forEach(eachElement => {
              if (eachElement.toLowerCase().trim().includes(updatedSearchValue))
                matched = true;
            });
            return matched;
          }
        });
      }
      dispatch(setEvents(updatedEvents));
    }, 1000),
    [dispatch, originalEventState],
  );

  const handleEventSearch = (searchedValue: string) => {
    setSearchedEvent(searchedValue);
    showSearchedEvents(searchedValue);
  };

  return (
    <>
      <View style={styles.eventListContainer}>
        <TextComponent
          weight="bold"
          style={{
            color: colors[theme].textColor,
            fontSize: 15,
            marginBottom: 10,
          }}>
          Total Events:{' '}
          {eventsData?.getSize() && eventsData?.getSize() > 0
            ? eventsData?.getSize()
            : 0}
        </TextComponent>
        {eventState.statuses.getEventAPICall === 'succeedded' ? (
          <View
            style={[
              styles.searchInput,
              {backgroundColor: colors[theme].cardColor},
            ]}>
            <InputComponent
              value={searchedEvent}
              onChangeText={value => handleEventSearch(value)}
              placeholder="Search event by title / date / month / year..."
            />
          </View>
        ) : null}
        {eventState.statuses.getEventAPICall === 'succeedded' &&
        eventsData?.getSize() > 0 ? (
          <RecyclerListView
            rowRenderer={rowRenderer}
            dataProvider={eventsData}
            layoutProvider={layoutProvider}
            initialRenderIndex={0}
            scrollViewProps={{
              showsVerticalScrollIndicator: false,
              refreshControl: (
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={async () => {
                    setRefreshing(true);
                    if (searchedEvent) {
                      showSearchedEvents(searchedEvent);
                      setRefreshing(false);
                    } else {
                      dispatch(getEventsAPICall()).then(resp => {
                        if (
                          resp.payload &&
                          resp.meta.requestStatus === 'rejected'
                        ) {
                          if (Platform.OS === 'android')
                            ToastAndroid.show(
                              resp.payload?.message,
                              ToastAndroid.SHORT,
                            );
                        }
                        setRefreshing(false);
                      });
                    }
                  }}
                />
              ),
            }}
            onEndReachedThresholdRelative={0.1}
            onEndReached={fetchMoreEvents}
            renderFooter={() => getFooter()}
          />
        ) : eventState.statuses.getEventAPICall === 'loading' ? (
          skelatons.map((eachItem, index) => (
            <View
              key={index}
              style={[
                styles.eventLoadingSkelaton,
                {backgroundColor: colors[theme].lavenderColor},
              ]}
            />
          ))
        ) : eventState.statuses.getEventAPICall === 'failed' ? (
          <View
            style={[
              styles.eventLoadingSkelaton,
              {marginTop: 30, backgroundColor: colors[theme].lavenderColor},
            ]}>
            <TextComponent
              style={{color: colors[theme].textColor}}
              weight="bold">
              Failed to fetch events. Please try again after some time
            </TextComponent>
          </View>
        ) : (
          <View
            style={[
              styles.eventLoadingSkelaton,
              {marginTop: 30, backgroundColor: colors[theme].lavenderColor},
            ]}>
            <TextComponent
              style={{color: colors[theme].textColor}}
              weight="bold">
              No Events Found!
            </TextComponent>
          </View>
        )}
      </View>
      <BottomHalfPopupComponent
        actions={actionsArray}
        modalHeader="Event Actions"
        showActions={true}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      />
      <CenterPopupComponent
        popupData={deletePopupData}
        isModalVisible={isDeletePopupVisible}
        setIsModalVisible={setIsDeletePopupVisible}
      />
    </>
  );
};

export const MemoizedEventListComponent = React.memo(EventListComponent);

const styles = StyleSheet.create({
  eventListContainer: {
    flex: 1,
    marginTop: 25,
  },
  eachEventComponent: {
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigateButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInput: {
    borderRadius: 20,
    marginBottom: 15,
    paddingHorizontal: measureMents.leftPadding - 5,
    alignSelf: 'center',
  },
});
