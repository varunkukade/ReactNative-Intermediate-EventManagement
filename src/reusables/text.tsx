import React, {ReactElement, ReactNode} from 'react';
import {StyleSheet, Text, View, TextProps} from 'react-native';
import {fontStyles} from '@/utils/appStyles';

interface TextComponentProps extends Omit<TextProps, 'fontFamily'> {
  children: ReactNode;
  weight: 'normal' | 'bold' | 'semibold' | 'extraBold';
}

const TextComponent = ({
  children,
  style,
  weight = 'normal',
  ...props
}: TextComponentProps): ReactElement => {
  const fontFamily =
    weight === 'normal'
      ? fontStyles.regular
      : weight === 'bold'
      ? fontStyles.bold
      : weight === 'extraBold'
      ? fontStyles.extraBold
      : fontStyles.semibold;
  return (
    <View style={styles.wrapperComponent}>
      <Text {...props} style={[{fontFamily}, style]}>
        {children}
      </Text>
    </View>
  );
};

export default TextComponent;

const styles = StyleSheet.create({
  wrapperComponent: {},
});
