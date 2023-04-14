import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAppDispatch} from '../reduxConfig/store';
import {resetEventState} from '../reduxConfig/slices/eventsSlice';
import {resetPeopleState} from '../reduxConfig/slices/peopleSlice';
import {resetUserState} from '../reduxConfig/slices/userSlice';

export type checkIfEmptyProps = boolean | object | string | number;
export const checkIfEmpty = <T extends checkIfEmptyProps>(value: T) => {
  if (!value) return true;
  else {
    //here value can be string/object/number
    if (value instanceof Object) {
      //if value is either object or array
      if (value instanceof Array) {
        //if value is array
        if (value.length === 0) return true;
        else return false;
      } else {
        //if value is object
        if (Object.keys(value).length === 0) return true;
        else return false;
      }
    } else return false; //if string/number exist return false
  }
};

export const generateArray = (n: number): number[] => {
  let arr = new Array(n);
  for (let i = 0; i < n; i++) {
    arr[i] = i;
  }
  return arr;
};

export const getDate = (date: Date) => {
  return moment(date).format('LL');
};

export const getTime = (time: Date) => {
  return moment(time).format('LT');
};

export const updateTheAsyncStorage = async (str: 'true' | 'false') => {
  try {
    await AsyncStorage.setItem('isAuthenticated', str);
  } catch (e) {
    // saving error
  }
};
export const getTheAsyncStorage = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem('isAuthenticated');
    if (value !== null && value === 'true') {
      // value previously stored
      return true;
    } else return false;
  } catch (e) {
    // error reading value
    return false;
  }
};

type ValidationObject = {
  isValid: boolean;
  errorMessage: string;
};

export const mobileNumbervalidation = (value: string): ValidationObject => {
  let validationObject = {
    isValid: true,
    errorMessage: '',
  };
  if (checkIfEmpty(value)) {
    validationObject = {
      isValid: false,
      errorMessage: 'Mobile Number cannot be empty.',
    };
  } else {
    let pattern = /^[6-9]\d{9}$/;
    if (!pattern.test(value)) {
      validationObject = {
        isValid: false,
        errorMessage: 'Invalid Mobile Number.',
      };
    }
  }
  return validationObject;
};

export const emailValidation = (value: string): ValidationObject => {
  let validationObject = {
    isValid: true,
    errorMessage: '',
  };
  if (checkIfEmpty(value)) {
    validationObject = {
      isValid: false,
      errorMessage: 'Email cannot be empty.',
    };
  } else {
    let pattern =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!pattern.test(value)) {
      validationObject = {
        isValid: false,
        errorMessage: 'Invalid Email.',
      };
    }
  }
  return validationObject;
};

export const passwordValidation = (value: string): ValidationObject => {
  let validationObject = {
    isValid: true,
    errorMessage: '',
  };
  if (checkIfEmpty(value)) {
    validationObject = {
      isValid: false,
      errorMessage: 'Password cannot be empty.',
    };
  } else {
    let minChar = 6;
    if (value.length <= minChar) {
      validationObject = {
        isValid: false,
        errorMessage: 'Minimum 6 characters required.',
      };
    }
  }
  return validationObject;
};

export const confirmPasswordValidation = (
  password: string,
  confirmPassword: string,
): ValidationObject => {
  let validationObject = {
    isValid: true,
    errorMessage: '',
  };
  if (checkIfEmpty(confirmPassword)) {
    validationObject = {
      isValid: false,
      errorMessage: 'Confirm Password cannot be empty.',
    };
  } else {
    if (checkIfEmpty(password)) {
      validationObject = {
        isValid: false,
        errorMessage: 'Password cannot be empty.',
      };
    } else if (password !== confirmPassword) {
      validationObject = {
        isValid: false,
        errorMessage: `Passwords doesn't match`,
      };
    }
  }
  return validationObject;
};
