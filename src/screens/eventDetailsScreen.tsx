import React, {ReactElement} from 'react';
import {StyleSheet, View} from 'react-native';
import {colors, measureMents} from '../utils/appStyles';
import { HomeStackParamList } from '../navigation/homeStackNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import TextComponent from '../reusables/textComponent';


const EventDetailsScreen = (): ReactElement => {
  //navigation state
  const navigation: NativeStackNavigationProp<HomeStackParamList, "EventDetailsScreen"> =
    useNavigation();

  
  return (
    <View>
        <TextComponent weight="bold">Hey</TextComponent>
    </View>
  );
};

export default EventDetailsScreen;

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
    backgroundColor: colors.primaryColor,
    alignItems: "center",
    justifyContent: "center",
    position: 'absolute',
    bottom: 15,
    right: 15,
  },
});
