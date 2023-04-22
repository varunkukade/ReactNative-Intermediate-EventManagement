import React, {ReactElement, ReactNode} from 'react';
import {StyleSheet, View, TextInputProps, TextInput} from 'react-native';
import {colors, fontStyles} from '../utils/appStyles';
import TextComponent from './text';
import { useAppSelector } from '../reduxConfig/store';

interface InputComponentProps extends Omit<TextInputProps,'cursorColor'> {
  onChangeText: (value: string) => void;
  value: string;
  label?: string;
  errorMessage?: string;
  rightIconComponent?: ReactNode;
}

const InputComponent = ({
  onChangeText,
  value,
  label,
  errorMessage,
  rightIconComponent,
  ...props
}: InputComponentProps): ReactElement => {
  const theme = useAppSelector(state => state.user.currentUser.theme)

  return (
    <View>
      <TextComponent
        weight="semibold"
        style={{fontSize: 16, color: colors[theme].textColor}}>
        {label}
      </TextComponent>
      <View style={styles.textInputWrapper}>
        <TextInput
          style={[styles.input, {marginBottom: errorMessage ? 0 : 15,  backgroundColor: colors[theme].lightLavenderColor,  color: colors[theme].textColor}]}
          {...props}
          placeholderTextColor={colors[theme].textColor}
          onChangeText={onChangeText}
          value={value}
          cursorColor={colors[theme].textColor}
        />
        {rightIconComponent ? rightIconComponent : null}
      </View>
      {errorMessage ? (
        <TextComponent
          weight="normal"
          style={{
            fontSize: 14,
            color: colors[theme].errorColor,
            marginBottom: 15,
            marginTop: 5,
          }}>
          {errorMessage}
        </TextComponent>
      ) : null}
    </View>
  );
};

export default InputComponent;

const styles = StyleSheet.create({
  textInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5
  },
  input: {
    marginTop: 7,
    borderRadius: 15,
    paddingVertical: 13,
    paddingHorizontal: 13,
    fontFamily: fontStyles.regular,
    fontSize: 15,
    width: '100%',
  },
});
