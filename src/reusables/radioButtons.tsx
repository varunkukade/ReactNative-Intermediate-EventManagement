import React, {ReactElement, ReactNode} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {colors} from '@/utils/appStyles';
import TextComponent from './text';
import { useAppSelector } from '@/reduxConfig/store';

interface RadioButtonComponentProps {
    onPress: () => void
    selected: boolean;
    children: ReactNode
}

const RadioButtonComponent = ({ onPress, selected, children }: RadioButtonComponentProps): ReactElement => {
  const theme = useAppSelector(state => state.user.currentUser.theme)

  return (
    <View style={styles.radioButtonContainer}>
      <TouchableOpacity onPress={onPress} style={[styles.radioButton, { borderColor: colors[theme].blackColor}]}>
        {selected ? <View style={[styles.radioButtonIcon, { backgroundColor: colors[theme].commonPrimaryColor}]} /> : null}
      </TouchableOpacity>
      <TouchableOpacity onPress={onPress}>
        <TextComponent style={[styles.radioButtonText, {color: colors[theme].textColor}]} weight='semibold'>{children}</TextComponent>
      </TouchableOpacity>
    </View>
  );
};

export default RadioButtonComponent;

const styles = StyleSheet.create({
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 45,
  },
  radioButton: {
    height: 20,
    width: 20,
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonIcon: {
    height: 14,
    width: 14,
    borderRadius: 7,
  },
  radioButtonText: {
    fontSize: 16,
    marginLeft: 16,
  },
});
