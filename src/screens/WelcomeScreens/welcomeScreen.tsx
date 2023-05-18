import React, {ReactElement, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import ScreenWrapper from '../screenWrapper';
import {generateArray} from '../../utils/commonFunctions';
import {colors, measureMents} from '../../utils/appStyles';
import {useAppSelector} from '../../reduxConfig/store';
import {ButtonComponent, TextComponent} from '../../reusables';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../navigation/authStackNavigator';
import {useNavigation} from '@react-navigation/native';

const marginConst = 20;

const WelcomeScreen = () => {
  //useSelectors
  const theme = useAppSelector(state => state.user.currentUser.theme);

  //useState
  const [noOfScreens, setNoOfScreens] = useState([
    {
        id: 1,
        active: true
    },
    {
        id: 2,
        active: false
    },
    {
        id: 3,
        active: false
    }
  ])

  //navigation state
  const authStackNavigation: NativeStackNavigationProp<
    AuthStackParamList,
    'SignupScreen'
  > = useNavigation();

//   const returnLastActiveScreenId = () => {
//     for (let i = noOfScreens.length - 1; i >= 0; i--) {
//         if (noOfScreens[i].active === true) {
//           return noOfScreens[i].id;
//         }
//     }
//     return null; // Term not found
//   }

  const onNextClick = () => {
    // let lastActiveScreenId = returnLastActiveScreenId()
    // if(lastActiveScreenId === noOfScreens.length) authStackNavigation.navigate("SignupScreen")
    // let updatedScreens = noOfScreens.map((eachScreen) => {
    //     if(lastActiveScreenId && eachScreen.id === lastActiveScreenId + 1){
    //         return { ...eachScreen, active: true}
    //     } else return eachScreen
    // })
    // setNoOfScreens(updatedScreens)
  };

  return (
    <ScreenWrapper>
      <View style={styles.progressContainer}>
        {noOfScreens.map(eachScreen => (
          <View
            style={[
              styles.eachProgressBar,
              {
                width:
                  (measureMents.windowWidth - marginConst * (noOfScreens.length + 1)) /
                  noOfScreens.length,
                backgroundColor: eachScreen.active ? colors[theme].primaryColor : colors[theme].greyColor,
              },
            ]}
          />
        ))}
      </View>
      <View style={styles.buttonContainer}>
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
  buttonContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 15,
    paddingHorizontal: marginConst,
  },
});
