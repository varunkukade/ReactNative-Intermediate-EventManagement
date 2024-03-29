import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { EachContact, updateSelected } from '@/reduxConfig/slices/peopleSlice';
import { colors, measureMents } from '@/utils/appStyles';
import { useAppDispatch, useAppSelector } from '@/reduxConfig/store';
import { CheckboxComponent, ImageComponent, TextComponent } from '@/reusables';

const PROFILE_PICTURE_SIZE = 43;
const ITEM_HEIGHT = 80;

type RenderEachComponentProps = {
  item: EachContact;
};

const RenderEachContact = React.memo(
  ({ item }: RenderEachComponentProps) => {
    //dispatch and selectors
    const dispatch = useAppDispatch();
    const theme = useAppSelector((state) => state.user.currentUser.theme);

    const getSkalatonName = useCallback((fullName: string) => {
      let arr = fullName.split(' ');
      if (arr.length > 1) {
        return arr[0][0].toUpperCase() + arr[1][0].toUpperCase();
      } else {
        return arr[0][0].toUpperCase();
      }
    }, []);

    const onContactSelected = (value: boolean, id: string) => {
      dispatch(updateSelected({ value, id }));
    };

    return (
      <View>
        <TouchableOpacity
          style={[
            styles.mainContainer,
            {
              backgroundColor: colors[theme].cardColor,
              borderRadius: 20,
              marginBottom: measureMents.leftPadding,
            },
          ]}
          activeOpacity={0.7}
          onPress={() => onContactSelected(!item.selected, item.contactId)}
        >
          <View style={styles.avatar}>
            {item.contactAvatar === '' ? (
              <View
                style={[
                  styles.profilePicSkaleton,
                  {
                    backgroundColor: colors[theme].lightLavenderColor,
                    alignSelf: 'flex-start',
                  },
                ]}
              >
                <TextComponent
                  style={{ color: colors[theme].textColor }}
                  weight="semibold"
                >
                  {getSkalatonName(item.contactName)}
                </TextComponent>
              </View>
            ) : (
              <ImageComponent
                source={{ uri: item.contactAvatar }}
                style={{
                  width: PROFILE_PICTURE_SIZE,
                  height: PROFILE_PICTURE_SIZE,
                  borderRadius: PROFILE_PICTURE_SIZE / 2,
                  alignSelf: 'flex-start',
                }}
              />
            )}
          </View>
          <View style={styles.textComponentContainer}>
            <TextComponent
              weight="semibold"
              style={{ color: colors[theme].textColor }}
            >
              {item.contactName}
            </TextComponent>
            {item.contactPhoneNumber ? (
              <TextComponent
                weight="semibold"
                style={{ color: colors[theme].greyColor, marginTop: 5 }}
              >
                {item.contactPhoneNumber}
              </TextComponent>
            ) : null}
          </View>
          <View style={styles.checkBoxContainer}>
            <CheckboxComponent
              value={item.selected}
              onValueChange={(value) =>
                onContactSelected(value, item.contactId)
              }
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  },
  (
    prevProps: RenderEachComponentProps,
    nextProps: RenderEachComponentProps,
  ) => {
    const { selected } = nextProps.item;
    const { selected: prevIsSelected } = prevProps.item;

    /*if the props are equal, it won't update*/
    const isSelectedEqual = selected === prevIsSelected;

    return isSelectedEqual;
  },
);

export default RenderEachContact;

const styles = StyleSheet.create({
  mainContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: measureMents.leftPadding,
    paddingVertical: measureMents.leftPadding,
    width: '100%',
    height: ITEM_HEIGHT,
    flexDirection: 'row',
  },
  textComponentContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: '72%',
    flexDirection: 'column',
  },
  checkBoxContainer: {
    width: '10%',
  },
  avatar: {
    width: '18%',
  },
  profilePicSkaleton: {
    width: PROFILE_PICTURE_SIZE,
    height: PROFILE_PICTURE_SIZE,
    borderRadius: PROFILE_PICTURE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
