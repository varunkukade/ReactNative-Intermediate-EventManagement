import React, {ReactElement} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors, measureMents} from '../utils/appStyles';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';
import TextComponent from '../reusables/text';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import {useAppSelector} from '../reduxConfig/store';
import {generateArray} from '../utils/commonFunctions';
import { EachPerson } from '../reduxConfig/slices/peopleSlice';

type EventJoinerListProps = {
    onLongPressUser: (data: EachPerson) => void;
    type: string;
}

const EventJoinersListComponent = ({ onLongPressUser, type}: EventJoinerListProps): ReactElement => {
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

  return (
    <>
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
    </>
  );
};

export const MemoizedEventJoinerListComponent = React.memo(
  EventJoinersListComponent,
);

const styles = StyleSheet.create({
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
});
