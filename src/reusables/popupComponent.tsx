import React, {ReactElement, ReactNode} from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import Modal, {ModalProps} from 'react-native-modal';

interface CenterPopupComponentProps extends Omit<ModalProps, 'animationIn' | 'animationOut' | 'onBackButtonPress' | 'onBackdropPress' | 'isVisible'> {
  children: ReactNode;
  isModalVisible: boolean;
  setIsModalVisible: (value: boolean) => void
}

const CenterPopupComponent = ({
  children,
  setIsModalVisible,
  isModalVisible,
  ...props
}: CenterPopupComponentProps): ReactElement => {
  return (
    <Modal
      animationIn="fadeIn"
      animationOut="fadeOut"
      onBackButtonPress={() => setIsModalVisible(!isModalVisible)}
      onBackdropPress={() => setIsModalVisible(!isModalVisible)}
      {...props}
      isVisible={isModalVisible}>
      <View style={styles.modalContainer}>
        {children}
      </View>
    </Modal>
  );
};

export default CenterPopupComponent;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 0.4,
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  }
});
