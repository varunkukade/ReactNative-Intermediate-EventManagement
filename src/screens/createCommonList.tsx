import React, {ReactElement, useState} from 'react';
import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors, measureMents} from '../utils/appStyles';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../navigation/homeStackNavigator';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../reduxConfig/store';
import {ButtonComponent, InputComponent, TextComponent} from '../reusables';
import {mobileNumbervalidation} from '../utils/commonFunctions';
import ScreenWrapper from './screenWrapper';
import uuid from 'react-native-uuid';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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

interface EachFormField<T> {
  value: T;
  errorMessage: string;
}

type AddUserFormData = {
  userId: string | number[];
  expanded: boolean;
  userName: EachFormField<string>;
  userMobileNumber?: EachFormField<string>;
  userEmail?: EachFormField<string>;
};

export type EachPaymentMethod = {
  id: number;
  value: boolean;
  name: 'Cash' | 'Online';
  selected: boolean;
};

const CreateCommonList = (): ReactElement => {
  //navigation and route state
  const navigation: NativeStackNavigationProp<
    HomeStackParamList,
    'CreateCommonList'
  > = useNavigation();

  //dispatch and selectors
  const dispatch = useAppDispatch();
  const theme = useAppSelector(state => state.user.currentUser.theme);

  const newUser = {
    userId: uuid.v4(),
    expanded: true,
    userName: {value: '', errorMessage: ''},
    userMobileNumber: {value: '', errorMessage: ''},
    userEmail: {value: '', errorMessage: ''},
  };
  //useStates
  const [users, setUsers] = useState<AddUserFormData[]>([
    {
      userId: uuid.v4(),
      expanded: true,
      userName: {value: '', errorMessage: ''},
      userMobileNumber: {value: '', errorMessage: ''},
      userEmail: {value: '', errorMessage: ''},
    },
  ]);

  const onAddUserClick = () => {
    setUsers([...users, newUser]);
  };

  const expandUser = (userId: string | number[]) => {
    let updatedArr = users.map(eachUser => {
        if (eachUser.userId === userId) return { ...eachUser, expanded: !eachUser.expanded };
        else return eachUser;
      })
     // console.log(updatedArr)
    setUsers(updatedArr);
  };

  const deleteUser = (userId: string | number[]) => {
    setUsers(
      users.filter((eachUser) => eachUser.userId !== userId)
    );
  };

  const onChangeForm = (
    value: string | boolean,
    fieldName:
      | 'userName'
      | 'userMobileNumber'
      | 'userEmail',
    id: string | number[],
  ): void => {
    let newArr = users.map(eachUser => {
      if (eachUser.userId === id) return {
        ...eachUser,
        [fieldName]: { ...eachUser[fieldName] , value}
      }
       else return eachUser;
    });
    setUsers(newArr);
  };

  //Given type and data return the View component
  const renderItem = ({item}: {item: AddUserFormData}) => {
    return (
      <>
        <View
          style={[
            styles.mainContainer,
            {
              backgroundColor: colors[theme].cardColor,
              borderBottomLeftRadius: item.expanded ? 0 : 20,
              borderBottomRightRadius: item.expanded ? 0 : 20,
              marginBottom: item.expanded ? 0 : measureMents.leftPadding,
            },
          ]}>
          <TextComponent
            weight="semibold"
            style={{color: colors[theme].textColor}}>
            {item.userName.value}
          </TextComponent>
          <TouchableOpacity onPress={() => deleteUser(item.userId)} style={{position: 'absolute', right: "20%"}} activeOpacity={0.8}>
            <MaterialIcons
              size={27}
              color={colors[theme].greyColor}
              name="delete-outline"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{position: 'absolute', right: "7%"}}
            activeOpacity={0.8}
            onPress={() => expandUser(item.userId)}>
            <EntypoIcons
              name={
                item.expanded
                  ? 'chevron-with-circle-up'
                  : 'chevron-with-circle-down'
              }
              color={colors[theme].iconLightPinkColor}
              size={27}
            />
          </TouchableOpacity>
        </View>
        {console.log("item.userName.value",item.userName.value)}
        {item.expanded ? (
          <View
            style={[styles.form, {backgroundColor: colors[theme].cardColor}]}>
            <InputComponent
              value={item.userName.value}
              onChangeText={value =>
                onChangeForm(value, constants.userName, item.userId)
              }
              required
              label="Enter Name"
              errorMessage={item.userName.errorMessage}
              placeholder="Name of user..."
            />
            <InputComponent
              value={item.userMobileNumber?.value}
              onChangeText={value =>
                onChangeForm(value, constants.userMobileNumber, item.userId)
              }
              label="Enter Mobile Number"
              keyboardType="numeric"
              placeholder="10 digits"
            />
            <InputComponent
              value={item.userEmail?.value}
              onChangeText={value =>
                onChangeForm(value, constants.userEmail, item.userId)
              }
              label="Enter Email"
              placeholder="Email of user"
            />
          </View>
        ) : null}
      </>
    );
  };

  return (
    <ScreenWrapper>
      <View style={styles.description}>
        <TextComponent
          style={{
            fontSize: 15,
            color: colors[theme].textColor,
            textAlign: 'center',
            marginBottom: 20,
          }}
          weight="semibold">
          Create common list of people here and while adding people to any event
          you can select people from this list.
        </TextComponent>
        <ButtonComponent onPress={onAddUserClick}>ADD USER</ButtonComponent>
      </View>
      <FlatList
        data={users}
        style={{
          paddingHorizontal: measureMents.leftPadding,
          marginTop: 20,
          paddingVertical: measureMents.leftPadding,
          marginBottom: 20,
        }}
        renderItem={renderItem}
        keyExtractor={item => item.userId.toString()}
      />
    </ScreenWrapper>
  );
};

export default CreateCommonList;

const styles = StyleSheet.create({
  mainContainer: {
    height: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: measureMents.leftPadding,
  },
  description: {
    paddingTop: 10,
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
