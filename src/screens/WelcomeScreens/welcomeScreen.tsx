import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import ScreenWrapper from '../screenWrapper';
import { colors, measureMents } from '@/utils/appStyles';
import { useAppSelector } from '@/reduxConfig/store';
import { ButtonComponent, TextComponent } from '@/reusables';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/navigation/authStackNavigator';
import { useNavigation } from '@react-navigation/native';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import Animated, {
  cancelAnimation,
  runOnJS,
  runOnUI,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  WelcomeScreenState,
  initialWelcomeScreens,
  screens,
} from '@/utils/constants';

const marginConst = 20;

const WelcomeScreen = () => {
  //useSelectors
  const theme = useAppSelector((state) => state.user.currentUser.theme);

  //useSharedValue lets us create a value which is completely handled by UI thread. UseState create a value handled by js thread.
  const width1 = useSharedValue(0);
  const width2 = useSharedValue(0);
  const width3 = useSharedValue(0);

  //useState
  const [noOfScreens, setNoOfScreens] = useState(initialWelcomeScreens);

  //navigation state
  const authStackNavigation: NativeStackNavigationProp<
    AuthStackParamList,
    'SignupScreen'
  > = useNavigation();

  //animated styles
  //these are automatically marked as worklet by reanimated.
  //whenever shared value changes, these are rerun so that new width gets applied.
  const reanimatedStyle1 = useAnimatedStyle(() => {
    return {
      width: width1.value,
    };
  }, []);
  const reanimatedStyle2 = useAnimatedStyle(() => {
    return {
      width: width2.value,
    };
  }, []);

  const reanimatedStyle3 = useAnimatedStyle(() => {
    return {
      width: width3.value,
    };
  }, []);

  const getReanimatedStyle = (id: number) => {
    if (id === 1) return reanimatedStyle1;
    if (id === 2) return reanimatedStyle2;
    if (id === 3) return reanimatedStyle3;
  };

  const navigateToSignup = useCallback(() => {
    authStackNavigation.navigate(screens.SignupScreen);
  }, [authStackNavigation]);

  useEffect(() => {
    const startWidth3Animation = () => {
      'worklet';
      width3.value = withTiming(
        (measureMents.windowWidth - marginConst * (noOfScreens.length + 1)) /
          noOfScreens.length,
        { duration: 3500 },
        (finished) => {
          if (finished) {
            // width3 animation completed, move to signup screen
            runOnJS(navigateToSignup)();
          }
        },
      );
    };

    const startWidth2Animation = () => {
      'worklet';
      width2.value = withTiming(
        (measureMents.windowWidth - marginConst * (noOfScreens.length + 1)) /
          noOfScreens.length,
        { duration: 3500 },
        (finished) => {
          if (finished) {
            // width2 animation completed
            runOnJS(showNextScreen)();
            startWidth3Animation(); // Start another animation here
          }
        },
      );
    };

    // Update the shared value on the UI thread within the useEffect hook
    const startWidth1Animation = () => {
      'worklet';
      width1.value = withTiming(
        (measureMents.windowWidth - marginConst * (noOfScreens.length + 1)) /
          noOfScreens.length,
        { duration: 3500 },
        (finished) => {
          if (finished) {
            // width1 animation completed
            runOnJS(showNextScreen)();
            startWidth2Animation(); // Start another animation here
          }
        },
      );
    };
    runOnUI(startWidth1Animation)();
    return () => {
      cancelAnimation(width1);
      cancelAnimation(width2);
      cancelAnimation(width3);
    };
  }, []);

  const getCurrentScreenId = useCallback(
    (screensArray: WelcomeScreenState[]) => {
      for (let i = screensArray.length - 1; i >= 0; i--) {
        if (screensArray[i].active === true) {
          return screensArray[i].id;
        }
      }
      return null; // Term not found
    },
    [],
  );

  const showNextScreen = useCallback(() => {
    let currentScreenId = getCurrentScreenId(noOfScreens);
    if (currentScreenId === noOfScreens.length) navigateToSignup();
    setNoOfScreens((prevState) => {
      let activeScreenId = getCurrentScreenId(prevState);
      return prevState.map((eachScreen) => {
        if (activeScreenId && eachScreen.id === activeScreenId + 1) {
          return { ...eachScreen, active: true };
        } else return eachScreen;
      });
    });
  }, [noOfScreens, setNoOfScreens, navigateToSignup, getCurrentScreenId]);

  const startWidth3Animation = () => {
    'worklet';
    width3.value = withTiming(
      (measureMents.windowWidth - marginConst * (noOfScreens.length + 1)) /
        noOfScreens.length,
      { duration: 3500 },
      (finished) => {
        if (finished) {
          // width3 animation completed, move to signup screen
          runOnJS(navigateToSignup)();
        }
      },
    );
  };

  const startWidth2Animation = () => {
    'worklet';
    width2.value = withTiming(
      (measureMents.windowWidth - marginConst * (noOfScreens.length + 1)) /
        noOfScreens.length,
      { duration: 3500 },
      (finished) => {
        if (finished) {
          // width2 animation completed
          runOnJS(showNextScreen)();
          startWidth3Animation(); // Start another animation here
        }
      },
    );
  };

  // Update the shared value on the UI thread within the useEffect hook
  const startWidth1Animation = () => {
    'worklet';
    width1.value = withTiming(
      (measureMents.windowWidth - marginConst * (noOfScreens.length + 1)) /
        noOfScreens.length,
      { duration: 3500 },
      (finished) => {
        if (finished) {
          // width1 animation completed
          runOnJS(showNextScreen)();
          startWidth2Animation(); // Start another animation here
        }
      },
    );
  };

  const showNextScreenAnimation = (currentScreenId: number) => {
    'worklet';
    let fullWidth =
      (measureMents.windowWidth - marginConst * (noOfScreens.length + 1)) /
      noOfScreens.length;
    if (currentScreenId === 1) {
      width1.value = fullWidth;
      runOnJS(showNextScreen)();
      startWidth2Animation();
    }
    if (currentScreenId === 2) {
      width2.value = fullWidth;
      runOnJS(showNextScreen)();
      startWidth3Animation();
    }
    if (currentScreenId === 3) {
      width3.value = fullWidth;
      runOnJS(navigateToSignup)();
    }
  };

  const showPrevScreenAnimation = (currentScreenId: number) => {
    'worklet';
    if (currentScreenId === 2) {
      width2.value = 0;
      width1.value = 0;
      startWidth1Animation();
    }
    if (currentScreenId === 3) {
      width3.value = 0;
      width2.value = 0;
      startWidth2Animation();
    }
  };

  const showLastScreen = useCallback(() => {
    setNoOfScreens((prevState) => {
      return prevState.map((eachScreen) => {
        if (eachScreen.id === noOfScreens.length) {
          return { ...eachScreen, active: true };
        } else return { ...eachScreen, active: false };
      });
    });
  }, [noOfScreens, setNoOfScreens]);

  const completeAllAnimations = () => {
    'worklet';
    let fullWidth =
      (measureMents.windowWidth - marginConst * (noOfScreens.length + 1)) /
      noOfScreens.length;
    width1.value = fullWidth;
    width2.value = fullWidth;
    width3.value = fullWidth;
    runOnJS(showLastScreen)();
    runOnJS(navigateToSignup)();
  };
  const showNextScreenClick = () => {
    let currentScreenId = getCurrentScreenId(noOfScreens);
    if (currentScreenId) runOnUI(showNextScreenAnimation)(currentScreenId);
  };

  const onSkipClick = () => {
    runOnUI(completeAllAnimations)();
  };

  const onPreviousClick = () => {
    let currentScreenId = getCurrentScreenId(noOfScreens);
    if (currentScreenId) runOnUI(showPrevScreenAnimation)(currentScreenId);
    setNoOfScreens((prevState) => {
      return prevState.map((eachScreen) => {
        if (currentScreenId && eachScreen.id === currentScreenId) {
          return { ...eachScreen, active: false };
        } else if (currentScreenId && eachScreen.id === currentScreenId - 1) {
          return { ...eachScreen, active: true };
        } else return eachScreen;
      });
    });
  };

  return (
    <ScreenWrapper>
      <View style={styles.progressContainer}>
        {noOfScreens.map((eachScreen) => (
          <View
            key={eachScreen.id}
            style={[
              {
                backgroundColor: colors[theme].greyColor,
                width:
                  (measureMents.windowWidth -
                    marginConst * (noOfScreens.length + 1)) /
                  noOfScreens.length,
              },
              styles.eachProgressBar,
            ]}
          >
            <Animated.View
              style={[
                {
                  height: '100%',
                  backgroundColor: colors[theme].commonPrimaryColor,
                },
                getReanimatedStyle(eachScreen.id),
              ]}
            />
          </View>
        ))}
      </View>
      <View style={{ flex: 1 }}>
        {noOfScreens.map((eachScreen) => (
          <View
            style={{
              flex: 1,
              display:
                getCurrentScreenId(noOfScreens) === eachScreen.id
                  ? 'flex'
                  : 'none',
            }}
            key={eachScreen.id}
          >
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={showNextScreenClick}
              style={styles.rightIcon}
            >
              <AntDesignIcons
                name="rightcircleo"
                color={colors[theme].iconLightPinkColor}
                size={40}
              />
            </TouchableOpacity>
            {getCurrentScreenId(noOfScreens) !== 1 ? (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={onPreviousClick}
                style={styles.leftIcon}
              >
                <AntDesignIcons
                  name="leftcircleo"
                  color={colors[theme].iconLightPinkColor}
                  size={40}
                />
              </TouchableOpacity>
            ) : null}
            <View style={styles.heavyTextContainer}>
              <TextComponent
                weight="semibold"
                style={{
                  color: colors[theme].textColor,
                  fontSize: 25,
                  marginBottom: 20,
                  textAlign: 'center',
                }}
              >
                {eachScreen.mainText}
              </TextComponent>
              <ButtonComponent onPress={showNextScreenClick}>
                Next
              </ButtonComponent>
              <TouchableOpacity
                onPress={onSkipClick}
                style={{
                  alignSelf: 'center',
                  paddingHorizontal: 15,
                  paddingVertical: 15,
                }}
              >
                <TextComponent
                  style={{
                    fontSize: 14,
                    color: colors[theme].textColor,
                    textAlign: 'center',
                  }}
                  weight="bold"
                >
                  SKIP
                </TextComponent>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScreenWrapper>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  progressContainer: {
    flexDirection: 'row',
    height: 6,
    marginTop: 10,
    marginLeft: marginConst,
  },
  eachProgressBar: {
    borderRadius: 20,
    marginRight: marginConst,
  },
  heavyTextContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    paddingHorizontal: marginConst * 2,
  },
  rightIcon: {
    position: 'absolute',
    top: '47%',
    right: 20,
  },
  leftIcon: {
    position: 'absolute',
    top: '47%',
    left: 20,
  },
});
