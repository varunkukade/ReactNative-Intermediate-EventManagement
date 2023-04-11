import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  cancelAnimation,
  runOnUI,
} from 'react-native-reanimated';
import TextComponent from './textComponent';
import {colors} from '../utils/appStyles';
import {useAppSelector} from '../reduxConfig/store';

const SIZE = 60;

const LoadingAnimation = () => {
  //useSharedValue lets us create a value which is completely handled by UI thread. UseState create a value handled by js thread.
  const scale = useSharedValue(1.3);

  //create a worklet which will run on UI thread
  //whenever shared value inside the worklet changes, worklet reruns.
  const reanimatedStyle = useAnimatedStyle(() => {
    return {
      //opacity: progress.value,
      transform: [{scale: scale.value}],
    };
  }, []);

  //selectors
  const eventSlice = useAppSelector(state => state.events);
  const userSlice = useAppSelector(state => state.user);
  const peopleSlice = useAppSelector(state => state.people);

  const eventSliceStatuses = useAppSelector(state => state.events.statuses);
  const userSliceStatuses = useAppSelector(state => state.user.statuses);
  const peopleSliceStatuses = useAppSelector(state => state.people.statuses);

  function getLoadingMessage() {
    let LOADING = 'loading';
    if (
      eventSliceStatuses.addEventAPICall === LOADING ||
      eventSliceStatuses.removeEventAPICall === LOADING
    )
      return eventSlice.loadingMessage;
    else if (
      userSliceStatuses.signinAPICall === LOADING ||
      userSliceStatuses.signupAPICall === LOADING ||
      userSliceStatuses.forgotPasswordAPICall === LOADING ||
      userSliceStatuses.updateProfileAPICall === LOADING
    )
      return userSlice.loadingMessage;
    else if (
      peopleSliceStatuses.addPeopleAPICall === LOADING ||
      peopleSliceStatuses.removePeopleAPICall === LOADING ||
      peopleSliceStatuses.updatePeopleAPICall === LOADING
    )
      return peopleSlice.loadingMessage;
  }
  function shouldDisplayLoading() {
    let LOADING = 'loading';
    return (
      eventSliceStatuses.addEventAPICall === LOADING ||
      eventSliceStatuses.removeEventAPICall === LOADING ||
      userSliceStatuses.signinAPICall === LOADING ||
      userSliceStatuses.signupAPICall === LOADING ||
      userSliceStatuses.forgotPasswordAPICall === LOADING ||
      userSliceStatuses.logoutAPICall === LOADING ||
      userSliceStatuses.updateProfileAPICall === LOADING ||
      peopleSliceStatuses.addPeopleAPICall === LOADING ||
      peopleSliceStatuses.removePeopleAPICall === LOADING ||
      peopleSliceStatuses.updatePeopleAPICall === LOADING
    );
  }

  useEffect(() => {
    //start scaling animation
    scale.value = withRepeat(withSpring(1), -1, true);

    return () => cancelAnimation(scale);
  }, []);

  return (
    <>
      {shouldDisplayLoading() ? (
        <View style={styles.indicatorWrapper}>
          <Animated.View
            style={[
              {
                height: SIZE,
                width: SIZE,
                marginBottom: 15,
                borderRadius: SIZE / 2,
              },
              reanimatedStyle,
            ]}>
            <Animated.View style={[styles.loadingAnimation]} />
          </Animated.View>
          <TextComponent
            weight="bold"
            style={{color: colors.whiteColor, fontSize: 16}}>
            {getLoadingMessage()}
          </TextComponent>
        </View>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  indicatorWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 10000,
  },
  loadingAnimation: {
    width: SIZE,
    height: SIZE,
    backgroundColor: colors.lavenderColor,
    borderRadius: SIZE / 2,
  },
  leftHeart: {
    transform: [{rotate: '-45deg'}],
    left: 55,
  },
  rightHeart: {
    transform: [{rotate: '45deg'}],
    right: 55,
  },
  heartShape: {
    width: 30,
    height: 45,
    position: 'absolute',
    top: 0,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: '#FF0000',
  },
});

export default LoadingAnimation;
