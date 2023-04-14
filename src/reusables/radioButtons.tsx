import React, {ReactElement, ReactNode, useState} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {colors, fontStyles} from '../utils/appStyles';
import TextComponent from './text';

interface RadioButtonComponentProps {
    onPress: () => void
    selected: boolean;
    children: ReactNode
}

const RadioButtonComponent = ({ onPress, selected, children }: RadioButtonComponentProps): ReactElement => {
  return (
    <View style={styles.radioButtonContainer}>
      <TouchableOpacity onPress={onPress} style={styles.radioButton}>
        {selected ? <View style={styles.radioButtonIcon} /> : null}
      </TouchableOpacity>
      <TouchableOpacity onPress={onPress}>
        <TextComponent weight='semibold' style={styles.radioButtonText}>{children}</TextComponent>
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
    borderColor: colors.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonIcon: {
    height: 14,
    width: 14,
    borderRadius: 7,
    backgroundColor: colors.primaryColor,
  },
  radioButtonText: {
    fontSize: 16,
    marginLeft: 16,
  },
});
