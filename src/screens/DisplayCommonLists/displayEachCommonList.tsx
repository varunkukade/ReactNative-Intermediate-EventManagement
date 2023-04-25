import React, {ReactElement} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useAppSelector} from '../../reduxConfig/store';
import {colors, measureMents} from '../../utils/appStyles';
import {TextComponent} from '../../reusables';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import { CommonListObject } from '../../reduxConfig/slices/peopleSlice';

type EachUserComponentProps = {
  eachCommonList: CommonListObject;
  expandCommonList: (id: string) => void;
};

const DisplayEachCommonList = ({
  eachCommonList,
  expandCommonList
}: EachUserComponentProps): ReactElement => {
  //dispatch and selectors
  const theme = useAppSelector(state => state.user.currentUser.theme);

  return (
    <View>
      <View
        style={[
          styles.mainContainer,
          {
            backgroundColor: colors[theme].cardColor,
            borderBottomLeftRadius: eachCommonList.expanded ? 0 : 20,
            borderBottomRightRadius: eachCommonList.expanded ? 0 : 20,
            marginBottom: eachCommonList.expanded ? 0 : measureMents.leftPadding,
          },
        ]}>
        <TextComponent
          weight="semibold"
          style={{color: colors[theme].textColor}}>
          {eachCommonList.commonListName}
        </TextComponent>
        <TouchableOpacity
          style={{position: 'absolute', right: '7%'}}
          activeOpacity={0.8}
          onPress={() => {
            console.log("clicked")
            expandCommonList(eachCommonList.commonListId)
          }}>
          <EntypoIcons
            name={
              eachCommonList.expanded
                ? 'chevron-with-circle-up'
                : 'chevron-with-circle-down'
            }
            color={colors[theme].iconLightPinkColor}
            size={27}
          />
        </TouchableOpacity>
      </View>
      {eachCommonList.expanded ? (
        <View
          style={[
            styles.form,
            {
              backgroundColor: colors[theme].cardColor,
            },
          ]}>
          {
            eachCommonList.users.map((eachUser)=> (
              <View style={[styles.eachUser, { backgroundColor: colors[theme].lightLavenderColor}]}>
                <TextComponent style={{color: colors[theme].textColor}} weight="semibold">{eachUser.userName}</TextComponent>
              </View>
            ))
          }
        </View>
      ) : null}
    </View>
  );
};

export default React.memo(DisplayEachCommonList);

const styles = StyleSheet.create({
  mainContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: measureMents.leftPadding,
    paddingVertical: measureMents.leftPadding
  },
  form: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingBottom: measureMents.leftPadding,
    marginBottom: measureMents.leftPadding,
    paddingHorizontal: measureMents.leftPadding,
  },
  eachUser: {
    paddingHorizontal: measureMents.leftPadding,
    borderRadius: 20,
    paddingVertical: measureMents.leftPadding,
    marginTop: 10
  },
});
