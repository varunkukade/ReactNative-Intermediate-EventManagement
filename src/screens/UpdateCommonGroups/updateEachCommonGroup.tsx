import React, {ReactElement} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useAppSelector} from '@/reduxConfig/store';
import {colors, measureMents} from '@/utils/appStyles';
import {TextComponent} from '@/reusables';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import {CommonListObject} from '@/reduxConfig/slices/peopleSlice';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from '@/navigation/homeStackNavigator';
import {useNavigation} from '@react-navigation/native';

type UpdateEachCommonListProps = {
  eachCommonList: CommonListObject;
};

const UpdateEachCommonList = ({
  eachCommonList,
}: UpdateEachCommonListProps): ReactElement => {
  //dispatch and selectors
  const theme = useAppSelector(state => state.user.currentUser.theme);
  //navigation and route state
  const navigation: NativeStackNavigationProp<
    HomeStackParamList,
    'UpdateCommonGroupsScreen'
  > = useNavigation();
  const onSingleUserPress = () => {
    navigation.navigate('UpdateCommonGroupsUsersScreen', {
      selectedCommonListId: eachCommonList.commonListId,
      selectedCommonListName: eachCommonList.commonListName,
    });
  };

  return (
    <TouchableOpacity
      onPress={onSingleUserPress}
      activeOpacity={0.7}
      style={[
        styles.mainContainer,
        {
          backgroundColor: colors[theme].cardColor,
        },
      ]}>
      <View style={styles.textComponentContainer}>
        <TextComponent
          weight="semibold"
          style={{color: colors[theme].textColor}}>
          {eachCommonList.commonListName}
        </TextComponent>
      </View>
      <EntypoIcons
        style={styles.expandButton}
        name="chevron-with-circle-right"
        color={colors[theme].iconLightPinkColor}
        size={27}
      />
    </TouchableOpacity>
  );
};

export default React.memo(UpdateEachCommonList);

const styles = StyleSheet.create({
  mainContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: measureMents.leftPadding,
    paddingVertical: measureMents.leftPadding,
    width: '100%',
    flexDirection: 'row',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: measureMents.leftPadding,
  },
  textComponentContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: '85%',
  },
  expandButton: {
    width: '15%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
