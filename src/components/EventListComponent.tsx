import React, {ReactElement, useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors, measureMents} from '../utils/appStyles';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';
import TextComponent from '../reusables/textComponent';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import {EventType} from '../utils/commonTypes';
import {getData} from '../utils/firebaseMethods';
import {useFocusEffect} from '@react-navigation/native';

const EventListComponent = (): ReactElement => {
  let dataProvider = new DataProvider((r1, r2) => {
    return r1 !== r2;
  });

  const generateArray = (n: number): number[] => {
    let arr = new Array(n);
    for (let i = 0; i < n; i++) {
      arr[i] = i;
    }
    return arr;
  };

  const [eventsList, setEventsList] = useState<DataProvider | null>(null);
  const [loadingEvents, setLoadingEvents] = useState<boolean>(true);
  const skelatons = generateArray(5);

  useFocusEffect(
    React.useCallback(() => {
      let data = getData('/events');
      console.log("Data",data)
      if (data?.success) {
        if (data.responseData) {
          setEventsList(data.responseData);
        } else setEventsList([]);
        setLoadingEvents(false);
        console.log("data.responseData",data);
      } else {
        setLoadingEvents(false);
      }

      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, []),
  );

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
    data: EventType,
    index: number,
  ): ReactElement => {
    return (
      <View key={index} style={styles.eachEventComponent}>
        <View style={styles.secondSection}>
          <TextComponent
            weight="normal"
            style={{
              color: colors.primaryColor,
              fontSize: 14,
            }}>
            Event - {index + 1}
          </TextComponent>
          <TextComponent
            weight="bold"
            style={{
              color: colors.primaryColor,
              fontSize: 15,
            }}>
            25th March 2023
          </TextComponent>
        </View>
        <View style={styles.thirdSection}>
          <TouchableOpacity activeOpacity={0.7} style={styles.navigateButton}>
            <EntypoIcons
              name="chevron-right"
              color={colors.whiteColor}
              size={20}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.eventListContainer}>
      <TextComponent
        weight="bold"
        style={{color: colors.primaryColor, fontSize: 15, marginBottom: 10}}>
        Total Events:{' '}
        {eventsList?.getSize() && eventsList?.getSize() > 0
          ? eventsList?.getSize()
          : 0}
      </TextComponent>
      {eventsList && eventsList?.getSize() > 0 ? (
        <RecyclerListView
          rowRenderer={rowRenderer}
          dataProvider={eventsList}
          layoutProvider={layoutProvider}
          initialRenderIndex={0}
          scrollViewProps={{showsVerticalScrollIndicator: false}}
        />
      ) : loadingEvents ? (
        skelatons.map((eachItem, index) => (
          <View key={index} style={styles.eventLoadingSkelaton} />
        ))
      ) : (
        <View style={[styles.eventLoadingSkelaton, {marginTop: 30}]}>
          <TextComponent weight="bold">No events found!</TextComponent>
        </View>
      )}
    </View>
  );
};

export const MemoizedEventListComponent = React.memo(EventListComponent);

const styles = StyleSheet.create({
  eventListContainer: {
    flex: 1,
    marginTop: 25,
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
    alignItems: 'center',
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
});
