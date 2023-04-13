import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';

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
    logoutAPICall: status;
    forgotPasswordAPICall: status;
    updateProfileAPICall: status;
    uploadProfilePictureAPICall: status;
    getProfilePictureAPICall: status;
  };
  loadingMessage: string;
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
    logoutAPICall: 'idle',
    forgotPasswordAPICall: 'idle',
    updateProfileAPICall: 'idle',
    uploadProfilePictureAPICall: 'idle',
    getProfilePictureAPICall: 'idle'
  },
  loadingMessage: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(signupAPICall.pending, (state, action) => {
        state.loadingMessage = 'Creating Your Account';
        state.statuses.signupAPICall = 'loading';
      })
      .addCase(signupAPICall.fulfilled, (state, action) => {
        state.statuses.signupAPICall = 'succeedded';
      })
      .addCase(signupAPICall.rejected, (state, action) => {
        state.statuses.signupAPICall = 'failed';
      })
      .addCase(signinAPICall.pending, (state, action) => {
        state.loadingMessage = 'Logging You In';
        state.statuses.signinAPICall = 'loading';
      })
      .addCase(signinAPICall.fulfilled, (state, action) => {
        state.statuses.signinAPICall = 'succeedded';
      })
      .addCase(signinAPICall.rejected, (state, action) => {
        state.statuses.signinAPICall = 'failed';
      })
      .addCase(logoutAPICall.pending, (state, action) => {
        state.loadingMessage = 'Logging You Out';
        state.statuses.logoutAPICall = 'loading';
      })
      .addCase(logoutAPICall.fulfilled, (state, action) => {
        state.statuses.logoutAPICall = 'succeedded';
      })
      .addCase(logoutAPICall.rejected, (state, action) => {
        state.statuses.logoutAPICall = 'failed';
      })
      .addCase(forgotPasswordAPICall.pending, (state, action) => {
        state.loadingMessage = 'Sending You Email';
        state.statuses.forgotPasswordAPICall = 'loading';
      })
      .addCase(forgotPasswordAPICall.fulfilled, (state, action) => {
        state.statuses.forgotPasswordAPICall = 'succeedded';
      })
      .addCase(forgotPasswordAPICall.rejected, (state, action) => {
        state.statuses.forgotPasswordAPICall = 'failed';
      })
      .addCase(updateProfileAPICall.pending, (state, action) => {
        state.loadingMessage = 'Updating the profile';
        state.statuses.updateProfileAPICall = 'loading';
      })
      .addCase(updateProfileAPICall.fulfilled, (state, action) => {
        state.statuses.updateProfileAPICall = 'succeedded';
      })
      .addCase(updateProfileAPICall.rejected, (state, action) => {
        state.statuses.updateProfileAPICall = 'failed';
      })
      .addCase(uploadProfilePictureAPICall.pending, (state, action) => {
        state.loadingMessage = 'Updating Profile Picture';
        state.statuses.uploadProfilePictureAPICall = 'loading';
      })
      .addCase(uploadProfilePictureAPICall.fulfilled, (state, action) => {
        state.statuses.uploadProfilePictureAPICall = 'succeedded';
      })
      .addCase(uploadProfilePictureAPICall.rejected, (state, action) => {
        state.statuses.uploadProfilePictureAPICall = 'failed';
      })
      .addCase(getProfilePictureAPICall.pending, (state, action) => {
        state.statuses.getProfilePictureAPICall = 'loading';
      })
      .addCase(getProfilePictureAPICall.fulfilled, (state, action) => {
        state.statuses.getProfilePictureAPICall = 'succeedded';
      })
      .addCase(getProfilePictureAPICall.rejected, (state, action) => {
        state.statuses.getProfilePictureAPICall = 'failed';
      });
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
          return auth().currentUser?.updateProfile({
            photoURL: ""
          })
        })
        .then((res)=> {
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
          if (error.code === 'auth/too-many-requests') {
            message =
              'Account blocked due to incorrect attempts. Reset password to unblock.';
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

export const forgotPasswordAPICall = createAsyncThunk<
  //type of successfull returned obj
  {
    message: string;
  },
  //type of request obj passed to payload creator
  {
    email: string;
  },
  //type of returned error obj from rejectWithValue
  {
    rejectValue: MessageType;
  }
>('user/forgotPassword', async (requestObj: {email: string}, thunkAPI) => {
  let message = '';
  try {
    return await auth()
      .sendPasswordResetEmail(requestObj.email)
      .then(resp => {
        message = 'Email sent Successfully';
        return {message: message};
      })
      .catch(error => {
        if (error.code === 'auth/invalid-email') {
          message = 'Email address is invalid!';
        }
        if (error.code === 'auth/user-not-found') {
          message = `Account doesn't exist with this email. Create new account with this email.`;
        }
        return thunkAPI.rejectWithValue({message: message});
      });
  } catch (err) {
    //return rejected promise
    return thunkAPI.rejectWithValue({
      message: 'Failed to send email. Please try again after some time',
    } as MessageType);
  }
});

type UpdateProfileRequest = {
  name: string;
  authCredential: FirebaseAuthTypes.AuthCredential;
  newEmail: string;
  newPassword: string;
  mobileNumber: string;
};

export const updateProfileAPICall = createAsyncThunk<
  //type of successfull returned obj
  {
    message: string;
  },
  //type of request obj passed to payload creator
  UpdateProfileRequest,
  //type of returned error obj from rejectWithValue
  {
    rejectValue: MessageType;
  }
>('user/updateProfile', async (requestObj: UpdateProfileRequest, thunkAPI) => {
  let message = '';
  try {
    return await auth()
      .currentUser?.reauthenticateWithCredential(requestObj.authCredential)
      .then(res => {
        return auth().currentUser?.updateProfile({
          displayName: requestObj.name,
        });
      })
      .then(res => {
        return auth().currentUser?.updateEmail(requestObj.newEmail);
      })
      .then(res => {
        return auth().currentUser?.updatePassword(requestObj.newPassword);
      })
      .then(res => {
        message =
          'Profile Updated successfully.Login again with new credentials';
        return {message: message};
      })
      .catch(err => {
        if (err.code === 'auth/no-current-user') {
          message = 'No user currently signed in.';
        }
        if (err.code === 'auth/user-token-expired') {
          message = 'No user currently signed in.';
        }
        if (err.code === 'auth/wrong-password') {
          message =
            'Current password is invalid. Reset the password and then update the profile';
        }
        return thunkAPI.rejectWithValue({message: message});
      });
  } catch (err) {
    //return rejected promise
    return thunkAPI.rejectWithValue({
      message: 'Failed to update profile. Please try again after some time',
    } as MessageType);
  }
});

//upload profile picture to the google cloud storage using firebase storage
export const uploadProfilePictureAPICall = createAsyncThunk<
  //type of successfull returned obj
  {
    message: string;
  },
  //type of request obj passed to payload creator
  {
    imageName: string;
    uploadUri: string;
  },
  //type of returned error obj from rejectWithValue
  {
    rejectValue: MessageType;
  }
>(
  'user/uploadProfilePicture',
  async (
    requestObj: {
      imageName: string;
      uploadUri: string;
    },
    thunkAPI,
  ) => {
    let message = '';
    try {
      return await storage()
        .ref(`/user/${auth().currentUser?.uid}/` + requestObj.imageName)
        .putFile(requestObj.uploadUri)
        .then(resp => {
          message = 'Profile Picture Uploaded Successfully!';
          return {message: message};
        })
        .catch(error => {
          return thunkAPI.rejectWithValue({message: error.message});
        });
    } catch (err) {
      //return rejected promise
      return thunkAPI.rejectWithValue({
        message:
          'Failed to upload profile picture. Please try again after some time',
      } as MessageType);
    }
  },
);

type SuccessType = {
  message: string;
  uri: string;
}

//get profile picture from the google cloud storage using firebase storage
export const getProfilePictureAPICall = createAsyncThunk<
  //type of successfull returned obj
  SuccessType,
  //type of request obj passed to payload creator
  {
    imageName: string;
  },
  //type of returned error obj from rejectWithValue
  {
    rejectValue: MessageType;
  }
>(
  'user/getProfilePicture',
  async (
    requestObj: {
      imageName: string;
    },
    thunkAPI,
  ) => {
    let message = '';
    try {
      return await storage()
        .ref(`/user/${auth().currentUser?.uid}/` + requestObj.imageName)
        .getDownloadURL()
        .then(resp => {
          message = 'Profile Picture Fetched Successfully!';
          return {message: message, uri: resp} as SuccessType;
        })
        .catch(error => {
          return thunkAPI.rejectWithValue({message: error.message} as MessageType);
        });
    } catch (err) {
      //return rejected promise
      return thunkAPI.rejectWithValue({
        message:
          'Failed to fetch profile picture. Please try again after some time',
      } as MessageType);
    }
  },
);