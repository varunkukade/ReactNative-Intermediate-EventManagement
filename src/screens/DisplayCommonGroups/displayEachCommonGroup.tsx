import React, { ReactElement } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useAppSelector } from '@/reduxConfig/store';
import { colors, measureMents } from '@/utils/appStyles';
import { CheckboxComponent, TextComponent } from '@/reusables';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import { CommonListObject } from '@/reduxConfig/slices/peopleSlice';

type EachUserComponentProps = {
  eachCommonList: CommonListObject;
  expandCommonList: (id: string) => void;
  onUserSelected: (
    value: boolean,
    commonListId: string,
    userId: string,
  ) => void;
  onAllUsersSelected: (value: boolean, commonListId: string) => void;
};

const DisplayEachCommonList = ({
  eachCommonList,
  expandCommonList,
  onUserSelected,
  onAllUsersSelected,
}: EachUserComponentProps): ReactElement => {
  //dispatch and selectors
  const theme = useAppSelector((state) => state.user.currentUser.theme);

  return (
    <View>
      <View
        style={[
          styles.mainContainer,
          {
            backgroundColor: colors[theme].cardColor,
            borderBottomLeftRadius: eachCommonList.expanded ? 0 : 20,
            borderBottomRightRadius: eachCommonList.expanded ? 0 : 20,
            marginBottom: eachCommonList.expanded
              ? 0
              : measureMents.leftPadding,
          },
        ]}
      >
        <View style={styles.textComponentContainer}>
          <TextComponent
            weight="semibold"
            style={{ color: colors[theme].textColor }}
          >
            {eachCommonList.commonListName}
          </TextComponent>
        </View>
        <View style={styles.checkBoxContainer}>
          <CheckboxComponent
            value={eachCommonList.users.every((eachUser) => eachUser.selected)}
            //style={{position: 'absolute', right: "35%"}}
            onValueChange={(value) =>
              onAllUsersSelected(value, eachCommonList.commonListId)
            }
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.expandButton}
          onPress={() => {
            expandCommonList(eachCommonList.commonListId);
          }}
        >
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
          ]}
        >
          {eachCommonList.users.map((eachUser, index) => (
            <TouchableOpacity
              activeOpacity={0.6}
              key={index}
              onPress={() => {
                onUserSelected(
                  !eachUser.selected,
                  eachCommonList.commonListId,
                  eachUser.userId,
                );
              }}
              style={[
                styles.eachUser,
                { backgroundColor: colors[theme].lightLavenderColor },
              ]}
            >
              <View style={styles.userNameContainer}>
                <TextComponent
                  style={{ color: colors[theme].textColor }}
                  weight="semibold"
                >
                  {eachUser.userName}
                </TextComponent>
              </View>
              <View style={styles.userCheckboxContainer}>
                <CheckboxComponent
                  value={eachUser.selected}
                  onValueChange={(value) =>
                    onUserSelected(
                      value,
                      eachCommonList.commonListId,
                      eachUser.userId,
                    )
                  }
                />
              </View>
            </TouchableOpacity>
          ))}
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
    paddingHorizontal: measureMents.leftPadding,
    paddingVertical: measureMents.leftPadding,
    width: '100%',
    flexDirection: 'row',
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
    paddingVertical: measureMents.leftPadding - 10,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textComponentContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: '75%',
  },
  checkBoxContainer: {
    width: '10%',
  },
  expandButton: {
    width: '15%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userNameContainer: {
    width: '90%',
  },
  userCheckboxContainer: {
    width: '10%',
  },
});
