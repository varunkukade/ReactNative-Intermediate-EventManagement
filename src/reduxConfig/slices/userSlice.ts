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
      await auth()
        .createUserWithEmailAndPassword(
          requestObject.email,
          requestObject.password,
        )
        .then(resp => {
          message = 'Account Created Successfully';
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            message = 'Email address is already in use!';
          }
          if (error.code === 'auth/invalid-email') {
            message = 'Email address is invalid!';
          }
          if(error.code === 'auth/weak-password') {
            message = 'Password should be atleast 6 characters long.'
          }
        });
      return {message: message};
    } catch (err: any) {
      //return rejected promise.
      return thunkAPI.rejectWithValue({
        message: 'Failed to create account. Please try again after some time',
      } as MessageType);
    }
  },
);

// export const signinAPICall = createAsyncThunk<
//   //type of successfull returned obj
//   {
//     message: string;
//   },
//   //type of request obj passed to payload creator
//   {
//     email: string;
//     password: string;
//   },
//   //type of returned error obj from rejectWithValue
//   {
//     rejectValue: MessageType;
//   }
// >(
//   'user/signin',
//   async (requestObj: {email: string; password: string}, thunkAPI) => {
//     try {
//       firestore().collection(apiUrls.events).doc(requestObj).delete();
//       return {message: 'Logged In successfully'};
//     } catch (err) {
//       //return rejected promise
//       return thunkAPI.rejectWithValue({
//         message: 'Failed to login. Please try again after some time',
//       } as MessageType);
//     }
//   },
// );
