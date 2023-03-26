import React, {ReactElement} from 'react';
import {StyleSheet, View, TextInputProps, TextInput} from 'react-native';
import {colors, fontStyles} from '../utils/appStyles';
import TextComponent from './textComponent';

interface InputComponentProps extends TextInputProps {
  onChangeText: (value: string) => void;
  value: string;
  label?: string;
  errorMessage?: string
}

const InputComponent = ({
  onChangeText,
  value,
  label,
  errorMessage,
  ...props
}: InputComponentProps): ReactElement => {
  return (
    <View>
      <TextComponent weight="semibold" style={{fontSize: 16, color: colors.primaryColor}}>
        {label}
      </TextComponent>
      <TextInput
        style={[styles.input, {marginBottom: errorMessage ? 0: 15}]}
        {...props}
        onChangeText={onChangeText}
        value={value}
        cursorColor={colors.primaryColor}
      />
      {
        errorMessage ? (
            <TextComponent weight='normal' style={{fontSize: 14, color: colors.errorColor, marginBottom: 15, marginTop: 5 }}>{errorMessage}</TextComponent>
        ): null
      }
    </View>
  );
};

export default InputComponent;

const styles = StyleSheet.create({
    input: {
        backgroundColor:colors.whiteColor,
        marginTop:7,
        borderRadius: 15,
        paddingVertical: 13,
        paddingHorizontal: 13,
        fontFamily: fontStyles.regular,
        color: colors.blackColor,
        fontSize: 15
    },
});
