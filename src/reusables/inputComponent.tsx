import React, {ReactElement, ReactNode} from 'react';
import {StyleSheet, View, TextInputProps, TextInput} from 'react-native';
import {colors, fontStyles} from '../utils/appStyles';
import TextComponent from './textComponent';

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
  return (
    <View>
      <TextComponent
        weight="semibold"
        style={{fontSize: 16, color: colors.primaryColor}}>
        {label}
      </TextComponent>
      <View style={styles.textInputWrapper}>
        <TextInput
          style={[styles.input, {marginBottom: errorMessage ? 0 : 15}]}
          {...props}
          placeholderTextColor={colors.greyColor}
          onChangeText={onChangeText}
          value={value}
          cursorColor={colors.primaryColor}
        />
        {rightIconComponent ? rightIconComponent : null}
      </View>
      {errorMessage ? (
        <TextComponent
          weight="normal"
          style={{
            fontSize: 14,
            color: colors.errorColor,
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
  },
  input: {
    backgroundColor: colors.lightLavenderColor,
    marginTop: 7,
    borderRadius: 15,
    paddingVertical: 13,
    paddingHorizontal: 13,
    fontFamily: fontStyles.regular,
    color: colors.blackColor,
    fontSize: 15,
    width: '100%',
  },
});
