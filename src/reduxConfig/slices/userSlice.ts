import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import auth from '@react-native-firebase/auth';

export type MessageType = {
  message: string;
};

type status = 'idle' | 'succeedded' | 'failed' | 'loading';

export type User = {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  isAdmin: boolean;
};

type userState = {
  userData: User;
  statuses: {
    signupAPICall: status;
    signinAPICall: status;
  };
};

const initialState: userState = {
  userData: {
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    isAdmin: false,
  },
  statuses: {
    signupAPICall: 'idle',
    signinAPICall: 'idle',
  },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(signupAPICall.pending, (state, action) => {
        state.statuses.signupAPICall = 'loading';
      })
      .addCase(signupAPICall.fulfilled, (state, action) => {
        state.statuses.signupAPICall = 'succeedded';
      })
      .addCase(signupAPICall.rejected, (state, action) => {
        state.statuses.signupAPICall = 'failed';
      });
    //   .addCase(signinAPICall.pending, (state, action) => {
    //     state.statuses.signinAPICall = 'loading';
    //   })
    //   .addCase(signinAPICall.fulfilled, (state, action) => {
    //     state.statuses.signinAPICall = 'succeedded';
    //   })
    //   .addCase(signinAPICall.rejected, (state, action) => {
    //     state.statuses.signinAPICall = 'failed';
    //   });
  },
});

export default userSlice.reducer;

export const signupAPICall = createAsyncThunk<
  //type of successfull returned obj
  {
    message: string;
  },
  //type of request obj passed to payload creator
  {email: string; password: string},
  //type of returned error obj from rejectWithValue
  {
    rejectValue: MessageType;
  }
>(
  'user/signup',
  async (requestObject: {email: string; password: string}, thunkAPI) => {
    try {
      let message = '';
      return await auth()
        .createUserWithEmailAndPassword(
          requestObject.email,
          requestObject.password,
        )
        .then(resp => {
          message = 'Account Created Successfully';
          return {message: message};
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            message = 'Email address is already in use!';
          }
          if (error.code === 'auth/invalid-email') {
            message = 'Email address is invalid!';
          }
          if (error.code === 'auth/weak-password') {
            message = 'Password should be atleast 6 characters long.';
          }
          return thunkAPI.rejectWithValue({message: message});
        });
    } catch (err: any) {
      //return rejected promise.
      return thunkAPI.rejectWithValue({
        message: 'Failed to create account. Please try again after some time',
      } as MessageType);
    }
  },
);

export const signinAPICall = createAsyncThunk<
  //type of successfull returned obj
  {
    message: string;
  },
  //type of request obj passed to payload creator
  {
    email: string;
    password: string;
  },
  //type of returned error obj from rejectWithValue
  {
    rejectValue: MessageType;
  }
>(
  'user/signin',
  async (requestObj: {email: string; password: string}, thunkAPI) => {
    let message = '';
    try {
      return await auth()
        .signInWithEmailAndPassword(requestObj.email, requestObj.password)
        .then(resp => {
          message = 'Logged In Successfully';
          return {message: message};
        })
        .catch(error => {
          if (error.code === 'auth/user-disabled') {
            message = 'Email address is disabled!';
          }
          if (error.code === 'auth/invalid-email') {
            message = 'Email address is invalid!';
          }
          if (error.code === 'auth/user-not-found') {
            message =
              'Account doesnt exist with this email. Create new account with this email.';
          }
          if (error.code === 'auth/wrong-password') {
            message = 'Wrong password for email.';
          }
          return thunkAPI.rejectWithValue({message: message});
        });
    } catch (err) {
      //return rejected promise
      return thunkAPI.rejectWithValue({
        message: 'Failed to login. Please try again after some time',
      } as MessageType);
    }
  },
);

export const logoutAPICall = createAsyncThunk<
  //type of successfull returned obj
  {
    message: string;
  },
  //type of request obj passed to payload creator
  undefined,
  //type of returned error obj from rejectWithValue
  {
    rejectValue: MessageType;
  }
>('user/logout', async (_, thunkAPI) => {
  let message = '';
  try {
    return await auth()
      .signOut()
      .then(resp => {
        message = 'Logged Out Successfully';
        return {message: message};
      })
      .catch(error => {
        message = 'Failed to logout. Please try again after some time';
        return thunkAPI.rejectWithValue({message: message});
      });
  } catch (err) {
    //return rejected promise
    return thunkAPI.rejectWithValue({
      message: 'Failed to logout. Please try again after some time',
    } as MessageType);
  }
});
