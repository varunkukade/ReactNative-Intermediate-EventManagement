import React, {ReactElement} from 'react';
import {StyleSheet, View} from 'react-native';
import {colors} from '../utils/appStyles';
import CheckBox, {CheckBoxProps} from '@react-native-community/checkbox';
import TextComponent from './textComponent';

interface CheckboxComponentProps extends CheckBoxProps {
  label: string
}

const CheckboxComponent = ({
  label,
  ...props
}: Omit<CheckboxComponentProps,'boxType' | 'tintColors'>): ReactElement => {
  return (
    <View style={styles.wrapperComponent}>
      <CheckBox
        style={styles.checkBox}
        {...props}
        boxType="circle"
        tintColors={{true:colors.primaryColor}}
      />
      <TextComponent style={{color: colors.primaryColor}} weight='semibold'>{label}</TextComponent>
    </View>
  );
};

export default CheckboxComponent;

const styles = StyleSheet.create({
  wrapperComponent: {
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width:"100%",
    marginBottom:8
  },
  checkBox: {
  }
});
