import React, {ReactElement} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useAppSelector} from '../../reduxConfig/store';
import {EachUserFormData} from './createCommonList';
import {colors, measureMents} from '../../utils/appStyles';
import {InputComponent, TextComponent} from '../../reusables';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type EachUserComponentProps = {
  eachUser: EachUserFormData;
  deleteUser: (id: string | number[]) => void;
  expandUser: (id: string | number[]) => void;
  onChangeForm: (
    value: string | boolean,
    fieldName: 'userName' | 'userMobileNumber' | 'userEmail',
    id: string | number[],
  ) => void;
};

type ConstantsType = {
  userName: 'userName';
  userMobileNumber: 'userMobileNumber';
  userEmail: 'userEmail';
};
const constants: ConstantsType = {
  userName: 'userName',
  userMobileNumber: 'userMobileNumber',
  userEmail: 'userEmail',
};

const EachUserComponent = ({
  eachUser,
  deleteUser,
  expandUser,
  onChangeForm,
}: EachUserComponentProps): ReactElement => {
  //dispatch and selectors
  const theme = useAppSelector(state => state.user.currentUser.theme);

  return (
    <>
      <View
        style={[
          styles.mainContainer,
          {
            backgroundColor: colors[theme].cardColor,
            borderBottomLeftRadius: eachUser.expanded ? 0 : 20,
            borderBottomRightRadius: eachUser.expanded ? 0 : 20,
            marginBottom: eachUser.expanded ? 0 : measureMents.leftPadding,
          },
        ]}>
        <TextComponent
          weight="semibold"
          style={{color: colors[theme].textColor}}>
          {eachUser.userName.value}
        </TextComponent>
        <TouchableOpacity
          onPress={() => deleteUser(eachUser.userId)}
          style={{position: 'absolute', right: '20%'}}
          activeOpacity={0.8}>
          <MaterialIcons
            size={27}
            color={colors[theme].greyColor}
            name="delete-outline"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{position: 'absolute', right: '7%'}}
          activeOpacity={0.8}
          onPress={() => expandUser(eachUser.userId)}>
          <EntypoIcons
            name={
              eachUser.expanded
                ? 'chevron-with-circle-up'
                : 'chevron-with-circle-down'
            }
            color={colors[theme].iconLightPinkColor}
            size={27}
          />
        </TouchableOpacity>
      </View>
      {eachUser.expanded ? (
        <View style={[styles.form, {backgroundColor: colors[theme].cardColor}]}>
          <InputComponent
            value={eachUser.userName.value}
            onChangeText={value =>
              onChangeForm(value, constants.userName, eachUser.userId)
            }
            required
            label="Enter Name"
            errorMessage={eachUser.userName.errorMessage}
            placeholder="Name of user..."
          />
          <InputComponent
            value={eachUser.userMobileNumber?.value}
            onChangeText={value =>
              onChangeForm(value, constants.userMobileNumber, eachUser.userId)
            }
            label="Enter Mobile Number"
            keyboardType="numeric"
            placeholder="10 digits"
          />
          <InputComponent
            value={eachUser.userEmail?.value}
            onChangeText={value =>
              onChangeForm(value, constants.userEmail, eachUser.userId)
            }
            label="Enter Email"
            placeholder="Email of user"
          />
        </View>
      ) : null}
    </>
  );
};

export default React.memo(EachUserComponent);

const styles = StyleSheet.create({
  mainContainer: {
    height: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: measureMents.leftPadding,
  },
  form: {
    height: 330,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingBottom: 10,
    marginBottom: measureMents.leftPadding,
    paddingHorizontal: measureMents.leftPadding,
  },
});
