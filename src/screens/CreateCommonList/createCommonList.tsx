import React, {ReactElement, useState, useCallback} from 'react';
import {
  FlatList,
  StyleSheet,
  View,
} from 'react-native';
import {colors, measureMents} from '../../utils/appStyles';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../../navigation/homeStackNavigator';
import {useNavigation} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../../reduxConfig/store';
import {ButtonComponent, TextComponent} from '../../reusables';
import ScreenWrapper from '../screenWrapper';
import uuid from 'react-native-uuid';
import EachUserComponent from './eachUserComponent';

interface EachFormField<T> {
  value: T;
  errorMessage: string;
}

export type EachUserFormData = {
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
  const [users, setUsers] = useState<EachUserFormData[]>([
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

  const expandUser = useCallback(
    (userId: string | number[]) => {
      let updatedArr = users.map(eachUser => {
        if (eachUser.userId === userId)
          return {...eachUser, expanded: !eachUser.expanded};
        else return eachUser;
      });
      setUsers(updatedArr);
    },
    [users, setUsers],
  );

  const deleteUser = useCallback(
    (userId: string | number[]) => {
      setUsers(users.filter(eachUser => eachUser.userId !== userId));
    },
    [setUsers, users],
  );

  const onChangeForm = useCallback(
    (
      value: string | boolean,
      fieldName: 'userName' | 'userMobileNumber' | 'userEmail',
      id: string | number[],
    ): void => {
      let newArr = users.map(eachUser => {
        if (eachUser.userId === id)
          return {
            ...eachUser,
            [fieldName]: {...eachUser[fieldName], value},
          };
        else return eachUser;
      });
      setUsers(newArr);
    },
    [users, setUsers],
  );

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
        renderItem={({item}) => (
          <EachUserComponent
            eachUser={item}
            deleteUser={deleteUser}
            expandUser={expandUser}
            onChangeForm={onChangeForm}
          />
        )}
        keyExtractor={item => item.userId.toString()}
      />
      <View style={[styles.description, { paddingBottom: 20}]}>
        <ButtonComponent isDisabled={users.length === 0}>CREATE LIST</ButtonComponent>
      </View>
    </ScreenWrapper>
  );
};

export default CreateCommonList;

const styles = StyleSheet.create({
  description: {
    paddingTop: 10,
    paddingHorizontal: measureMents.leftPadding,
  },
});
