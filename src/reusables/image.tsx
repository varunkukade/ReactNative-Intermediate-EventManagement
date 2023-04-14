import React, {ReactElement} from 'react';
import FastImage, {FastImageProps} from 'react-native-fast-image';

const ImageComponent = (props: Omit<FastImageProps,'resizeMode'>): ReactElement => {
  return (
    <FastImage
      {...props}
      resizeMode={FastImage.resizeMode.contain}
    />
  );
};

export default ImageComponent;

