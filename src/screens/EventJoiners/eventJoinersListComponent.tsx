import React, {ReactElement, useEffect} from 'react';
import {
  ActivityIndicator,
  Platform,
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
  getPeopleAPICall,
} from '../../reduxConfig/slices/peopleSlice';

type EventJoinerListProps = {
  onLongPressUser: (data: EachPerson) => void;
  type: string;
};

const EventJoinersListComponent = ({
  onLongPressUser,
  type,
}: EventJoinerListProps): ReactElement => {
  //dispatch and selectors
  const dispatch = useAppDispatch();
  const theme = useAppSelector(state => state.user.currentUser.theme);

  useEffect(() => {
    dispatch(getPeopleAPICall()).then(res => {
      if (res.meta.requestStatus === 'rejected' && res.payload) {
        if (Platform.OS === 'android')
          ToastAndroid.show(res.payload.message, ToastAndroid.SHORT);
      }
    });
  }, []);

  const fetchMoreEventJoiners = () => {
    //onEndReachedThresholdRelative = 0.1 means if user has scrolled and if end of visible content is within the 10% from end of list, then load more items.
    if (peopleState.statuses.getNextEventJoinersAPICall === 'loading') return;
    dispatch(getNextEventJoinersAPICall()).then(resp => {
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
    });
  };

  let dataProvider = new DataProvider((r1, r2) => {
    return r1 !== r2;
  });

  const skelatons = generateArray(5);

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

  const currentSelectedEvent = useAppSelector(
    state => state.events.currentSelectedEvent,
  );

  const peopleState = useAppSelector(state => state.people);
  const peopleData = dataProvider.cloneWithRows(
    getPeopleArray(peopleState.people),
  );

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
        <View style={styles.secondSection}>
          <TextComponent
            numberOfLines={2}
            weight="normal"
            style={{
              color: colors[theme].textColor,
              fontSize: 14,
            }}>
            {data.userName}
          </TextComponent>
          <TextComponent
            weight="bold"
            style={{
              color: colors[theme].textColor,
              fontSize: 15,
            }}>
            +91 {data.userMobileNumber}
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

  return (
    <>
      <TextComponent
        weight="bold"
        style={{
          color: colors[theme].textColor,
          fontSize: 15,
          marginBottom: 10,
        }}>
        Total People:{' '}
        {peopleData?.getSize() && peopleData?.getSize() > 0
          ? peopleData?.getSize()
          : 0}
      </TextComponent>
      <TextComponent
        weight="bold"
        style={{
          color: colors[theme].greyColor,
          fontSize: 15,
          marginBottom: 10,
        }}>
        Note - You can modify/delete user by long pressing it.
      </TextComponent>
      {peopleState.statuses.getPeopleAPICall === 'succeedded' &&
      peopleData?.getSize() > 0 ? (
        <RecyclerListView
          rowRenderer={rowRenderer}
          dataProvider={peopleData}
          layoutProvider={layoutProvider}
          initialRenderIndex={0}
          scrollViewProps={{showsVerticalScrollIndicator: false}}
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
            'Failed to fetch users. Please try again after some time'
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

export const MemoizedEventJoinerListComponent = React.memo(
  EventJoinersListComponent,
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
  footerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
