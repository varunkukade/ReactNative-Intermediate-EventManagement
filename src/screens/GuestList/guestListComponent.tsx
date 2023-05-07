import React, {ReactElement, useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Platform,
  RefreshControl,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors, measureMents} from '../../utils/appStyles';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';
import TextComponent from '../../reusables/text';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import {useAppDispatch, useAppSelector} from '../../reduxConfig/store';
import {generateArray} from '../../utils/commonFunctions';
import {
  EachPerson,
  getNextEventJoinersAPICall,
  getNextSearchedEventJoinersAPICall,
  getPeopleAPICall,
  getSearchedPeopleAPICall,
  setlastFetchedUserId,
  updatePeople,
} from '../../reduxConfig/slices/peopleSlice';
import {InputComponent} from '../../reusables';
import {debounce} from 'lodash';

type EventJoinerListProps = {
  onLongPressUser: (data: EachPerson) => void;
};

const GuestListComponent = ({
  onLongPressUser,
}: EventJoinerListProps): ReactElement => {
  let dataProvider = new DataProvider((r1, r2) => {
    return r1 !== r2;
  });

  const skelatons = generateArray(5);

  //useStates
  const [searchedUser, setSearchedUser] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  //dispatch and selectors
  const dispatch = useAppDispatch();
  const theme = useAppSelector(state => state.user.currentUser.theme);
  const currentSelectedEvent = useAppSelector(
    state => state.events.currentSelectedEvent,
  );
  const originalPeople = useAppSelector(state => state.people.originalPeople);

  const peopleState = useAppSelector(state => state.people);
  const getPeopleArray = (peopleState: EachPerson[]) => {
    return peopleState.filter(
      eachPerson => eachPerson.eventId === currentSelectedEvent?.eventId,
    );
  };
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

  const handleResponse = (resp: any) => {
    if (resp.payload && resp.meta.requestStatus === 'rejected') {
      if (Platform.OS === 'android')
        ToastAndroid.show(resp.payload?.message, ToastAndroid.SHORT);
    }
    if (
      resp.payload &&
      resp.meta.requestStatus === 'fulfilled' &&
      resp.payload.successMessagetype === 'noMoreUsers'
    ) {
      if (Platform.OS === 'android')
        ToastAndroid.showWithGravity(
          resp.payload?.message,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
    }
  };

  const fetchMoreEventJoiners = () => {
    //onEndReachedThresholdRelative = 0.1 means if user has scrolled and if end of visible content is within the 10% from end of list, then load more items.
    if (peopleState.statuses.getNextEventJoinersAPICall === 'loading') return;
    if (searchedUser === '') {
      dispatch(getNextEventJoinersAPICall()).then(resp => {
        handleResponse(resp);
      });
    } else {
      dispatch(
        getNextSearchedEventJoinersAPICall({
          searchedValue: searchedUser.trim().split(' ').join(''),
        }),
      ).then(resp => {
        handleResponse(resp);
      });
    }
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

  //show fotter while loading more people
  const getFooter = () => {
    if (peopleState.statuses.getNextEventJoinersAPICall === 'loading')
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
              marginBottom: 10,
            }}
            weight="bold">
            Fetching More Event Joiners...
          </TextComponent>
        </View>
      );
    else return null;
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
        style={[
          styles.eachEventComponent,
          {backgroundColor: colors[theme].cardColor},
        ]}>
        <View style={styles.firstSection}>
          <TextComponent
            numberOfLines={2}
            weight="normal"
            style={{
              color: colors[theme].textColor,
              fontSize: 14,
            }}>
            {data.userName}
          </TextComponent>
          {data.userMobileNumber ? (
            <TextComponent
              weight="bold"
              style={{
                color: colors[theme].textColor,
                fontSize: 15,
              }}>
              {data.userMobileNumber}
            </TextComponent>
          ) : null}
        </View>
        <View style={styles.secondSection}>
         <TextComponent weight='normal' style={{ color: data.isPaymentPending ? colors[theme].errorColor : colors[theme].greenColor}}>
           { `Payment ${data.isPaymentPending ? 'Pending' : 'Completed'}` }
         </TextComponent>
        </View>
        <View style={styles.thirdSection}>
          <EntypoIcons
            name="chevron-right"
            color={colors[theme].textColor}
            size={27}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const showSearchedUsers = useCallback(
    debounce(searchedValue => {
      let updatedPeople;
      if (searchedValue === '') {
        updatedPeople = originalPeople.map(eachPeople => {
          return eachPeople;
        });
        dispatch(updatePeople(updatedPeople));
        dispatch(
          setlastFetchedUserId(updatedPeople[updatedPeople.length - 1].userId),
        );
      } else {
        dispatch(getSearchedPeopleAPICall({searchedValue}));
      }
    }, 1000),
    [dispatch, originalPeople],
  );

  const handleUserSearch = (searchedValue: string) => {
    setSearchedUser(searchedValue);
    showSearchedUsers(searchedValue.trim().split(' ').join(''));
  };

  return (
    <>
      <View>
        <TextComponent
          weight="bold"
          style={{
            color: colors[theme].textColor,
            fontSize: 15,
            marginBottom: 10,
          }}>
          Total Guests:{' '}
          {peopleData?.getSize() && peopleData?.getSize() > 0
            ? peopleData?.getSize()
            : 0}
        </TextComponent>
      </View>
      {
        peopleState.statuses.getPeopleAPICall === 'succeedded' ? (
          <View
          style={[
            styles.searchInput,
            {backgroundColor: colors[theme].cardColor},
          ]}>
          <InputComponent
            value={searchedUser}
            onChangeText={value => handleUserSearch(value)}
            placeholder="Search guest by name..."
          />
        </View>
        ): null
      }

      {peopleState.statuses.getPeopleAPICall === 'succeedded' &&
      peopleData?.getSize() > 0 ? (
        <RecyclerListView
          rowRenderer={rowRenderer}
          dataProvider={peopleData}
          layoutProvider={layoutProvider}
          initialRenderIndex={0}
          scrollViewProps={{
            showsVerticalScrollIndicator: false,
            refreshControl: (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={async () => {
                  setRefreshing(true)
                  if(searchedUser){
                    dispatch(getSearchedPeopleAPICall({searchedValue: searchedUser.trim().split(' ').join('')})).then(res => {
                      if (res.meta.requestStatus === 'rejected' && res.payload) {
                        if (Platform.OS === 'android')
                          ToastAndroid.show(res.payload.message, ToastAndroid.SHORT);
                      }
                      setRefreshing(false)
                    });
                  }else {
                    dispatch(getPeopleAPICall()).then(res => {
                      if (res.meta.requestStatus === 'rejected' && res.payload) {
                        if (Platform.OS === 'android')
                          ToastAndroid.show(res.payload.message, ToastAndroid.SHORT);
                      }
                      setRefreshing(false)
                    });
                  }
                }}
              />
            )
          }}
          onEndReachedThresholdRelative={0.1}
          onEndReached={fetchMoreEventJoiners}
          renderFooter={() => getFooter()}
        />
      ) : peopleState.statuses.getPeopleAPICall === 'loading' ? (
        skelatons.map((eachItem, index) => (
          <View
            key={index}
            style={[
              styles.eventLoadingSkelaton,
              {backgroundColor: colors[theme].lavenderColor},
            ]}
          />
        ))
      ) : peopleState.statuses.getPeopleAPICall === 'failed' ? (
        <View
          style={[
            styles.eventLoadingSkelaton,
            {marginTop: 30, backgroundColor: colors[theme].lavenderColor},
          ]}>
          <TextComponent weight="bold">
            'Failed to fetch guests. Please try again after some time'
          </TextComponent>
        </View>
      ) : (
        <View
          style={[
            styles.eventLoadingSkelaton,
            {marginTop: 30, backgroundColor: colors[theme].lavenderColor},
          ]}>
          <TextComponent style={{color: colors[theme].greyColor}} weight="bold">
            No Records Found!
          </TextComponent>
        </View>
      )}
    </>
  );
};

export const MemoizedGuestListComponent = React.memo(
  GuestListComponent,
);

const styles = StyleSheet.create({
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
  firstSection: {
    width: '50%',
    height: '100%',
    justifyContent: 'space-evenly',
  },
  secondSection: {
    width: '25%',
    height: '100%',
    justifyContent: 'space-evenly',
    alignItems: "center"
  },
  thirdSection: {
    width: '25%',
    height: '100%',
    alignItems: 'flex-end',
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
