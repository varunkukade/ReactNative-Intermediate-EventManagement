import React, {ReactElement, ReactNode} from 'react';
import {StyleSheet, TouchableOpacity, StyleProp, ViewStyle, TouchableNativeFeedbackProps, TouchableOpacityProps, TextStyle} from 'react-native';
import {colors} from '../utils/appStyles';
import TextComponent from './text';

type ButtonCommonProps = TouchableNativeFeedbackProps & TouchableOpacityProps

interface ButtonComponentProps extends Omit<ButtonCommonProps,'activeOpacity'> {
  children: ReactNode;
  containerStyle?: StyleProp<ViewStyle> 
  textStyle?: StyleProp<TextStyle>
  bgColor?: string
} ;

const ButtonComponent = ({
  children,
  containerStyle,
  textStyle,
  bgColor,
  ...props
}: ButtonComponentProps): ReactElement => {

  return (
    <TouchableOpacity activeOpacity={0.7} {...props} style={[containerStyle,styles.wrapperComponent, {backgroundColor: bgColor? bgColor: colors.primaryColor}]}>
        <TextComponent style={[{color: colors.whiteColor}, textStyle]} weight="bold">{children}</TextComponent>
    </TouchableOpacity>
  );
};

export default ButtonComponent;

const styles = StyleSheet.create({
  wrapperComponent: {
    paddingVertical: 13,
    alignItems:"center",
    justifyContent:"center",
    borderRadius: 15
  },
});
