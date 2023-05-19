import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import ScreenWrapper from '../screenWrapper';
import {colors, measureMents} from '../../utils/appStyles';
import {useAppSelector} from '../../reduxConfig/store';
import {ButtonComponent, TextComponent} from '../../reusables';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../navigation/authStackNavigator';
import {useNavigation} from '@react-navigation/native';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';

const marginConst = 20;

const WelcomeScreen = () => {
  //useSelectors
  const theme = useAppSelector(state => state.user.currentUser.theme);

  //useState
  const [noOfScreens, setNoOfScreens] = useState([
    {
      id: 1,
      active: true,
      mainText: 'Event Management Is Now More Simpler, Easier And Practical!',
    },
    {
      id: 2,
      active: false,
      mainText:
        'Create Events, Create Common Guests, Add Guest To Event.',
    },
    {
      id: 3,
      active: false,
      mainText:
        'Invite Users To App And They Can Stay Updated with New Events.',
    },
  ]);

  //navigation state
  const authStackNavigation: NativeStackNavigationProp<
    AuthStackParamList,
    'SignupScreen'
  > = useNavigation();

  const returnLastActiveScreenId = () => {
    for (let i = noOfScreens.length - 1; i >= 0; i--) {
      if (noOfScreens[i].active === true) {
        return noOfScreens[i].id;
      }
    }
    return null; // Term not found
  };

  const onNextClick = () => {
    let lastActiveScreenId = returnLastActiveScreenId();
    if (lastActiveScreenId === noOfScreens.length)
      authStackNavigation.navigate('SignupScreen');
    let updatedScreens = noOfScreens.map(eachScreen => {
      if (lastActiveScreenId && eachScreen.id === lastActiveScreenId + 1) {
        return {...eachScreen, active: true};
      } else return eachScreen;
    });
    setNoOfScreens(updatedScreens);
  };

  const onPreviousClick = () => {
    let lastActiveScreenId = returnLastActiveScreenId();
    let updatedScreens = noOfScreens.map(eachScreen => {
      if (lastActiveScreenId && eachScreen.id === lastActiveScreenId) {
        return {...eachScreen, active: false};
      } else return eachScreen;
    });
    setNoOfScreens(updatedScreens);
  };

  return (
    <ScreenWrapper>
      <View style={styles.progressContainer}>
        {noOfScreens.map(eachScreen => (
          <View
            key={eachScreen.id}
            style={[
              styles.eachProgressBar,
              {
                width:
                  (measureMents.windowWidth -
                    marginConst * (noOfScreens.length + 1)) /
                  noOfScreens.length,
                backgroundColor: eachScreen?.active
                  ? colors[theme].commonPrimaryColor
                  : colors[theme].greyColor,
              },
            ]}
          />
        ))}
      </View>
      <View style={{flex: 1}}>
        {noOfScreens.map(eachScreen => (
          <View
            style={{
              flex: 1,
              display:
                returnLastActiveScreenId() === eachScreen.id ? 'flex' : 'none',
            }}
            key={eachScreen.id}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={onNextClick}
              style={styles.rightIcon}>
              <AntDesignIcons
                name="rightcircleo"
                color={colors[theme].iconLightPinkColor}
                size={40}
              />
            </TouchableOpacity>
            {returnLastActiveScreenId() !== 1 ? (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={onPreviousClick}
                style={styles.leftIcon}>
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
                  fontSize: 30,
                  marginBottom: 20,
                  textAlign: 'center',
                }}>
                {eachScreen.mainText}
              </TextComponent>
              <ButtonComponent onPress={onNextClick}>Next</ButtonComponent>
              <TouchableOpacity
                onPress={() => authStackNavigation.navigate('SignupScreen')}
                style={{
                  alignSelf: 'center',
                  paddingHorizontal: 15,
                  paddingVertical: 15,
                }}>
                <TextComponent
                  style={{
                    fontSize: 14,
                    color: colors[theme].textColor,
                    textAlign: 'center',
                  }}
                  weight="bold">
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
    paddingHorizontal: marginConst*2,
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
