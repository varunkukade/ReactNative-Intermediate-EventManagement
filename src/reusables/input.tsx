import React, { ReactElement, ReactNode, useState } from 'react';
import { StyleSheet, View, TextInputProps, TextInput } from 'react-native';
import { colors, fontStyles } from '@/utils/appStyles';
import TextComponent from './text';
import { useAppSelector } from '@/reduxConfig/store';
interface InputComponentProps extends Omit<TextInputProps, 'cursorColor'> {
  onChangeText: (value: string) => void;
  value: string;
  label?: string;
  errorMessage?: string;
  rightIconComponent?: ReactNode;
  required?: boolean;
}

const InputComponent = ({
  onChangeText,
  value,
  label,
  errorMessage,
  rightIconComponent,
  required = false,
  ...props
}: InputComponentProps): ReactElement => {
  const theme = useAppSelector((state) => state.user.currentUser.theme);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View>
      <View style={styles.textInputWrapper}>
        {
          label && (isFocused || value !== "") ? (
            <View style={styles.topView}>
              <TextComponent
                style={{ fontSize: 14, color: colors[theme].textColor }}
                weight='semibold'>
                {label}
              </TextComponent>
              {required ? (
                <TextComponent
                  weight="semibold"
                  style={{
                    color: colors[theme].errorColor,
                    marginLeft: 5,
                    fontSize: 17,
                  }}
                >
                  *
                </TextComponent>
              ) : null}
            </View>
          ) : null
        }
        <TextInput
          style={[
            styles.input,
            {
              marginBottom: errorMessage ? 0 : 15,
              backgroundColor: colors[theme].lightLavenderColor,
              color: colors[theme].textColor,
            },
          ]}
          {...props}
          placeholder={isFocused ? "" : props.placeholder}
          placeholderTextColor={colors[theme].textColor}
          onChangeText={onChangeText}
          value={value}
          cursorColor={colors[theme].textColor}
          onFocus={() => {
            setIsFocused(true)
          }}
          onBlur={() => {
            setIsFocused(false)
          }}
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
          }}
        >
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
    overflow: 'hidden',
    position: "relative"
  },
  input: {
    marginTop: 10,
    borderRadius: 15,
    paddingVertical: 13,
    paddingHorizontal: 13,
    fontFamily: fontStyles.regular,
    fontSize: 15,
    width: '100%',
    zIndex: 1,

  },
  topView: {
    flexDirection: 'row',
    position: "absolute",
    top: 0,
    left: 15,
    zIndex: 2
  }
});
