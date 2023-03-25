import React, {ReactElement} from 'react';
import FastImage, {FastImageProps} from 'react-native-fast-image';
import {StyleSheet} from 'react-native';

const ImageComponent = (props: FastImageProps): ReactElement => {
  return (
    <FastImage
      {...props}
      resizeMode={FastImage.resizeMode.contain}
    />
  );
};

export default ImageComponent;

