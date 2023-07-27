import React, { ReactElement, ReactNode } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TouchableNativeFeedbackProps,
  TouchableOpacityProps,
  TextStyle,
} from 'react-native';
import { colors } from '@/utils/appStyles';
import TextComponent from './text';
import { useAppSelector } from '@/reduxConfig/store';

type ButtonCommonProps = TouchableNativeFeedbackProps & TouchableOpacityProps;

interface ButtonComponentProps
  extends Omit<ButtonCommonProps, 'activeOpacity' | 'disabled'> {
  children: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  bgColor?: string;
  isDisabled?: boolean;
}

const ButtonComponent = ({
  children,
  containerStyle,
  textStyle,
  bgColor,
  isDisabled = false,
  ...props
}: ButtonComponentProps): ReactElement => {
  const theme = useAppSelector((state) => state.user.currentUser.theme);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={isDisabled}
      {...props}
      style={[
        containerStyle,
        styles.wrapperComponent,
        {
          backgroundColor: bgColor
            ? bgColor
            : isDisabled
            ? colors[theme].disabledButtonColor
            : colors[theme].buttonColor,
        },
      ]}
    >
      <TextComponent
        style={[
          {
            color: isDisabled
              ? colors[theme].greyColor
              : colors[theme].whiteColor,
          },
          textStyle,
        ]}
        weight="bold"
      >
        {children}
      </TextComponent>
    </TouchableOpacity>
  );
};

export default ButtonComponent;

const styles = StyleSheet.create({
  wrapperComponent: {
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
});
