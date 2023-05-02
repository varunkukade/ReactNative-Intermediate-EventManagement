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
import TextComponent from './text';
import {colors} from '../utils/appStyles';
import {useAppSelector} from '../reduxConfig/store';

const SIZE = 60;
const LOADING = 'loading';

const LoadingAnimation = () => {
  //useSharedValue lets us create a value which is completely handled by UI thread. UseState create a value handled by js thread.
  const scale = useSharedValue(1.3);

  //create a worklet which will run on UI thread. useAnimatedStyle automatically mark callback as worklet
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
  const theme = useAppSelector(state => state.user.currentUser.theme)

  const eventSliceStatuses = useAppSelector(state => state.events.statuses);
  const userSliceStatuses = useAppSelector(state => state.user.statuses);
  const peopleSliceStatuses = useAppSelector(state => state.people.statuses);

  function getLoadingMessage() {
    if (
      eventSliceStatuses.addEventAPICall === LOADING ||
      eventSliceStatuses.removeEventAPICall === LOADING ||
      eventSliceStatuses.updateEventAPICall === LOADING
    )
      return eventSlice.loadingMessage;
    else if (
      userSliceStatuses.signinAPICall === LOADING ||
      userSliceStatuses.signupAPICall === LOADING ||
      userSliceStatuses.forgotPasswordAPICall === LOADING ||
      userSliceStatuses.updateProfileAPICall === LOADING || 
      userSliceStatuses.uploadProfilePictureAPICall === LOADING || 
      userSliceStatuses.getProfileDataAPICall === LOADING ||
      userSliceStatuses.googleSigninAPICall === LOADING
    )
      return userSlice.loadingMessage;
    else if (
      peopleSliceStatuses.addPeopleAPICall === LOADING ||
      peopleSliceStatuses.addPeopleInBatchAPICall === LOADING ||
      peopleSliceStatuses.removePeopleAPICall === LOADING ||
      peopleSliceStatuses.updatePeopleAPICall === LOADING ||
      peopleSliceStatuses.addCommonListAPICall === LOADING ||
      peopleSliceStatuses.getCommonListsAPICall === LOADING || 
      peopleSliceStatuses.removeCustomListAPICall === LOADING
    )
      return peopleSlice.loadingMessage;
  }
  function shouldDisplayLoading() {
    return (
      eventSliceStatuses.addEventAPICall === LOADING ||
      eventSliceStatuses.removeEventAPICall === LOADING ||
      eventSliceStatuses.updateEventAPICall === LOADING || 
      userSliceStatuses.signinAPICall === LOADING ||
      userSliceStatuses.signupAPICall === LOADING ||
      userSliceStatuses.forgotPasswordAPICall === LOADING ||
      userSliceStatuses.logoutAPICall === LOADING ||
      userSliceStatuses.updateProfileAPICall === LOADING ||
      userSliceStatuses.uploadProfilePictureAPICall === LOADING ||
      userSliceStatuses.getProfileDataAPICall === LOADING || 
      userSliceStatuses.googleSigninAPICall === LOADING ||
      peopleSliceStatuses.addPeopleAPICall === LOADING ||
      peopleSliceStatuses.addPeopleInBatchAPICall === LOADING ||
      peopleSliceStatuses.removePeopleAPICall === LOADING ||
      peopleSliceStatuses.updatePeopleAPICall === LOADING ||
      peopleSliceStatuses.addCommonListAPICall === LOADING ||
      peopleSliceStatuses.getCommonListsAPICall === LOADING || 
      peopleSliceStatuses.removeCustomListAPICall === LOADING 
    );
  }

  useEffect(() => {
    // Update the shared value on the UI thread within the useEffect hook
    const updateValue = () => {
      'worklet';
      scale.value = withRepeat(withSpring(1), -1, true);
    }; 
    runOnUI(updateValue)();
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
            <Animated.View style={[styles.loadingAnimation, { backgroundColor: colors[theme].lavenderColor}]} />
          </Animated.View>
          <TextComponent
            weight="bold"
            style={{color: colors[theme].whiteColor, fontSize: 16}}>
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
