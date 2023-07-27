import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/utils/appStyles';
import CheckBox, { CheckBoxProps } from '@react-native-community/checkbox';
import TextComponent from './text';
import { useAppSelector } from '@/reduxConfig/store';

interface CheckboxComponentProps extends CheckBoxProps {
  label?: string;
}

const CheckboxComponent = ({
  label,
  ...props
}: Omit<CheckboxComponentProps, 'boxType' | 'tintColors'>): ReactElement => {
  const theme = useAppSelector((state) => state.user.currentUser.theme);

  return (
    <View style={styles.wrapperComponent}>
      <CheckBox
        style={styles.checkBox}
        {...props}
        boxType="circle"
        tintColors={{ true: colors[theme].textColor }}
      />
      {label ? (
        <TextComponent
          style={{ color: colors[theme].textColor }}
          weight="semibold"
        >
          {label}
        </TextComponent>
      ) : null}
    </View>
  );
};

export default CheckboxComponent;

const styles = StyleSheet.create({
  wrapperComponent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
  checkBox: {},
});
