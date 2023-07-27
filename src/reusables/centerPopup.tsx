import React, { ReactElement, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Modal, { ModalProps } from 'react-native-modal';
import { colors } from '@/utils/appStyles';
import TextComponent from './text';
import ButtonComponent from './buttonComponent';
import { useAppSelector } from '@/reduxConfig/store';

export type popupData = {
  header: string;
  description: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onCancelClick: () => void;
  onConfirmClick: () => void;
};

interface CenterPopupComponentProps
  extends Omit<
    ModalProps,
    | 'animationIn'
    | 'animationOut'
    | 'onBackButtonPress'
    | 'onBackdropPress'
    | 'isVisible'
  > {
  children: ReactNode;
  isModalVisible: boolean;
  setIsModalVisible: (value: boolean) => void;
  popupData: () => popupData;
}

const CenterPopupComponent = ({
  children,
  setIsModalVisible,
  isModalVisible,
  popupData,
  ...props
}: CenterPopupComponentProps): ReactElement => {
  const theme = useAppSelector((state) => state.user.currentUser.theme);

  return (
    <Modal
      animationIn="bounceIn"
      animationOut="bounceOut"
      onBackButtonPress={() => setIsModalVisible(!isModalVisible)}
      onBackdropPress={() => setIsModalVisible(!isModalVisible)}
      {...props}
      isVisible={isModalVisible}
    >
      <View
        style={[
          styles.modalContainer,
          { backgroundColor: colors[theme].cardColor },
        ]}
      >
        <TextComponent
          numberOfLines={1}
          style={[styles.header, { color: colors[theme].textColor }]}
          weight="extraBold"
        >
          {popupData().header}
        </TextComponent>
        <TextComponent
          numberOfLines={4}
          style={[styles.description, { color: colors[theme].textColor }]}
          weight="normal"
        >
          {popupData().description}
        </TextComponent>
        {children}
        <View style={styles.buttonContainer}>
          <ButtonComponent
            onPress={popupData().onCancelClick}
            containerStyle={styles.button}
            textStyle={{
              color:
                theme === 'light'
                  ? colors[theme].textColor
                  : colors.dark.blackColor,
            }}
            bgColor={
              theme === 'light'
                ? colors.light.lightLavenderColor
                : colors.dark.greyColor
            }
          >
            {popupData().confirmButtonText
              ? popupData().cancelButtonText
              : 'Cancel'}
          </ButtonComponent>
          <ButtonComponent
            onPress={popupData().onConfirmClick}
            containerStyle={styles.button}
          >
            {popupData().confirmButtonText
              ? popupData().confirmButtonText
              : 'Confirm'}
          </ButtonComponent>
        </View>
      </View>
    </Modal>
  );
};

export default React.memo(CenterPopupComponent);

const styles = StyleSheet.create({
  modalContainer: {
    padding: 22,
    borderRadius: 20,
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
  },
  description: {
    fontSize: 15,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    width: '40%',
  },
});
