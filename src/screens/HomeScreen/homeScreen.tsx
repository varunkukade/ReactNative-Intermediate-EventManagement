import React, {ReactElement, useEffect, useState} from 'react';
import {Keyboard, StyleSheet, TouchableOpacity, View} from 'react-native';
import {MemoizedEventListComponent} from './eventListComponent';
import {MemoizedWelcomeComponent} from './welcomeComponent';
import {colors, measureMents} from '../../utils/appStyles';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {HomeStackParamList} from '../../navigation/homeStackNavigator';
import ScreenWrapper from '../screenWrapper';
import {useAppSelector} from '../../reduxConfig/store';

const HomeScreen = (): ReactElement => {
  //navigation state
  const navigation: NativeStackNavigationProp<
    HomeStackParamList,
    'BottomTabNavigator'
  > = useNavigation();

  const theme = useAppSelector(state => state.user.currentUser.theme);
  const [isKeyboardOpened, setIsKeyboardOpened] = useState(false);

  const onAddEventClick = () => {
    navigation.navigate('AddEventScreen');
  };

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardOpened(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardOpened(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  return (
    <>
      <ScreenWrapper>
        <View style={styles.wrapperComponent}>
          <MemoizedWelcomeComponent />
          <MemoizedEventListComponent />
        </View>
      </ScreenWrapper>
      {!isKeyboardOpened ? (
        <TouchableOpacity
          onPress={onAddEventClick}
          activeOpacity={0.7}
          style={[
            styles.addEventButton,
            {backgroundColor: colors[theme].commonPrimaryColor},
          ]}>
          <EntypoIcons name="plus" color={colors[theme].whiteColor} size={20} />
        </TouchableOpacity>
      ) : null}
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  wrapperComponent: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: measureMents.leftPadding,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
  },
  addEventButtonContainer: {
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addEventButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 15,
    right: 15,
  },
});
