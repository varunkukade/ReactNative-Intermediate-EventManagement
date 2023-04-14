import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import apiUrls from '../apiUrls';

export type MessageType = {
  message: string;
  type?: 'failure';
};

type status = 'idle' | 'succeedded' | 'failed' | 'loading';

type userState = {
  statuses: {
    signupAPICall: status;
    signinAPICall: status;
    logoutAPICall: status;
    forgotPasswordAPICall: status;
    updateProfileAPICall: status;
    uploadProfilePictureAPICall: status;
    getProfilePictureAPICall: status;
    getProfileDataAPICall: status;
  };
  loadingMessage: string;
};

const initialState: userState = {
  statuses: {
    signupAPICall: 'idle',
    signinAPICall: 'idle',
    logoutAPICall: 'idle',
    forgotPasswordAPICall: 'idle',
    updateProfileAPICall: 'idle',
    uploadProfilePictureAPICall: 'idle',
    getProfilePictureAPICall: 'idle',
    getProfileDataAPICall: 'idle',
  },
  loadingMessage: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    reset: () => initialState,
  },
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
        console.log('action', action);
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
      })
      .addCase(getProfileDataAPICall.pending, (state, action) => {
        state.loadingMessage = 'Fetching Profile Data';
        state.statuses.getProfileDataAPICall = 'loading';
      })
      .addCase(getProfileDataAPICall.fulfilled, (state, action) => {
        state.statuses.getProfileDataAPICall = 'succeedded';
      })
      .addCase(getProfileDataAPICall.rejected, (state, action) => {
        state.statuses.getProfileDataAPICall = 'failed';
      });
  },
});
export const {reset: resetUserState} = userSlice.actions;
export default userSlice.reducer;

export const signupAPICall = createAsyncThunk<
  //type of successfull returned obj
  {
    message: string;
  },
  //type of request obj passed to payload creator
  {email: string; password: string; mobileNumber: string},
  //type of returned error obj from rejectWithValue
  {
    rejectValue: MessageType;
  }
>(
  'user/signup',
  async (
    requestObject: {email: string; password: string; mobileNumber: string},
    thunkAPI,
  ) => {
    try {
      let message = '';
      await auth().createUserWithEmailAndPassword(
        requestObject.email,
        requestObject.password,
      );
      return await firestore()
        .collection(apiUrls.users)
        .add({
          authId: auth().currentUser?.uid,
          mobileNumber: requestObject.mobileNumber,
        })
        .then(res => {
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
      await auth().signInWithEmailAndPassword(
        requestObj.email,
        requestObj.password,
      );
      return await auth()
        .currentUser?.updateProfile({
          photoURL: '',
        }).then(res => {
          message = 'Logged In Successfully';
          return {message: message} as MessageType;
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
          return thunkAPI.rejectWithValue({message: message} as MessageType);
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

export type UpdateProfileRequest = {
  name: string;
  authCredential: FirebaseAuthTypes.AuthCredential;
  newEmail: string;
  newPassword: string;
  newMobileNumberUpdate: {mobileNumber: string};
  docIdInFireStore: string;
};

export const updateProfileAPICall = createAsyncThunk<
  //type of successfull returned obj
  MessageType,
  //type of request obj passed to payload creator
  UpdateProfileRequest,
  //type of returned error obj from rejectWithValue
  {
    rejectValue: MessageType;
  }
>('user/updateProfile', async (requestObj: UpdateProfileRequest, thunkAPI) => {
  try {
    let message = '';
    await auth().currentUser?.reauthenticateWithCredential(
      requestObj.authCredential,
    );
    await auth().currentUser?.updateProfile({
      displayName: requestObj.name,
    });
    await auth().currentUser?.updateEmail(requestObj.newEmail);
    await auth().currentUser?.updatePassword(requestObj.newPassword);
    return await firestore()
      .collection(apiUrls.users)
      .doc(requestObj.docIdInFireStore)
      .update(requestObj.newMobileNumberUpdate)
      .then(res => {
        message =
          'Profile Updated successfully.Login again with new credentials';
        return {message} as MessageType;
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
        return thunkAPI.rejectWithValue({message} as MessageType);
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
      let task = storage()
        .ref(`/user/${auth().currentUser?.uid}/` + requestObj.imageName)
        .putFile(requestObj.uploadUri);

      task.on('state_changed', taskSnapshot => {
        console.log(
          `upload completed ${
            (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100
          } %`,
        );
        console.log(
          `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
        );
      });

      return task
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
  type: 'success';
};

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
          return {message: message, uri: resp, type: 'success'} as SuccessType;
        })
        .catch(error => {
          return thunkAPI.rejectWithValue({
            message: error.message,
            type: 'failure',
          } as MessageType);
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

export type EachUser = {
  mobileNumber: string;
  authId: string;
  docIdInFireStore: string;
};

type ProfileResponse = {
  responseData: EachUser;
  message: string;
  type: 'success';
};
//get additional profile data stored in Users Collection
export const getProfileDataAPICall = createAsyncThunk<
  //type of successfull returned obj
  ProfileResponse,
  //type of request obj passed to payload creator
  undefined,
  //type of returned error obj from rejectWithValue
  {
    rejectValue: MessageType;
  }
>('user/getProfileData', async (_, thunkAPI) => {
  let profileData: EachUser;
  try {
    return await firestore()
      .collection(apiUrls.users)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          let updatedObj: EachUser = JSON.parse(
            JSON.stringify(documentSnapshot.data()),
          );
          if (updatedObj.authId === auth().currentUser?.uid) {
            profileData = JSON.parse(JSON.stringify(updatedObj));
            profileData.docIdInFireStore = documentSnapshot.id;
          }
        });
        //return the resolved promise with data.
        return {
          responseData: profileData,
          message: 'Profile data fetched successfully',
          type: 'success',
        } as ProfileResponse;
      })
      .catch(error => {
        return thunkAPI.rejectWithValue({
          message: error.message,
          type: 'failure',
        } as MessageType);
      });
  } catch (err) {
    //return rejected promise
    return thunkAPI.rejectWithValue({
      message: 'Failed to fetch profile data. Please try again after some time',
    } as MessageType);
  }
});
