import React, {ReactElement} from 'react';
import {
  StyleSheet,
} from 'react-native';
import DatePicker, {DatePickerProps} from 'react-native-date-picker';
import { measureMents } from '../utils/appStyles';

interface DateTimePickerComponentProps extends DatePickerProps {
  setIsOpen?: (value: boolean) => void;
  setDateValue: (value: Date) => void;
  show?: boolean
}

const DateTimePickerComponent = ({
  setIsOpen,
  setDateValue,
  show,
  ...props
}: DateTimePickerComponentProps): ReactElement | null => {
  return show ? (
      <DatePicker
        mode='date' 
        style={{width: measureMents.windowWidth - (2 * measureMents.leftPadding), height: 150}}
        onConfirm={date => {
          if(setIsOpen) setIsOpen(false);
          setDateValue(date);
        }}
        onDateChange={setDateValue}
        {...props}
        onCancel={() => {
          if(setIsOpen) setIsOpen(false);
        }}
      />
  ): null;
};

export default DateTimePickerComponent;

const styles = StyleSheet.create({});
