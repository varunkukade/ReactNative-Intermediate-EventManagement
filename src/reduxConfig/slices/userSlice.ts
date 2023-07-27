import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import apiUrls from '../apiUrls';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { RootState } from '../store';
import { GOOGLE_CONST } from '@/utils/constants';
import { setAsyncStorage } from '@/utils/commonFunctions';

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
    googleSigninAPICall: status;
  };
  currentUser: {
    signinMethod: string;
    theme: 'light' | 'dark';
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
    googleSigninAPICall: 'idle',
  },
  currentUser: {
    signinMethod: '',
    theme: 'light',
  },
  loadingMessage: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    reset: (state) => {
      state.statuses = {
        signupAPICall: 'idle',
        signinAPICall: 'idle',
        logoutAPICall: 'idle',
        forgotPasswordAPICall: 'idle',
        updateProfileAPICall: 'idle',
        uploadProfilePictureAPICall: 'idle',
        getProfilePictureAPICall: 'idle',
        getProfileDataAPICall: 'idle',
        googleSigninAPICall: 'idle',
      };
      (state.currentUser.signinMethod = ''), (state.loadingMessage = '');
    },
    setCurrentUser: (state, action: PayloadAction<string>) => {
      state.currentUser.signinMethod = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.currentUser.theme = action.payload;
      setAsyncStorage('theme', action.payload);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(signupAPICall.pending, (state) => {
        state.loadingMessage = 'Creating Your Account...';
        state.statuses.signupAPICall = 'loading';
      })
      .addCase(signupAPICall.fulfilled, (state) => {
        state.statuses.signupAPICall = 'succeedded';
      })
      .addCase(signupAPICall.rejected, (state) => {
        state.statuses.signupAPICall = 'failed';
      })
      .addCase(signinAPICall.pending, (state) => {
        state.loadingMessage = 'Logging You In...';
        state.statuses.signinAPICall = 'loading';
      })
      .addCase(signinAPICall.fulfilled, (state) => {
        state.statuses.signinAPICall = 'succeedded';
      })
      .addCase(signinAPICall.rejected, (state) => {
        state.statuses.signinAPICall = 'failed';
      })
      .addCase(logoutAPICall.pending, (state) => {
        state.loadingMessage = 'Logging You Out...';
        state.statuses.logoutAPICall = 'loading';
      })
      .addCase(logoutAPICall.fulfilled, (state) => {
        state.statuses.logoutAPICall = 'succeedded';
      })
      .addCase(logoutAPICall.rejected, (state) => {
        state.statuses.logoutAPICall = 'failed';
      })
      .addCase(forgotPasswordAPICall.pending, (state) => {
        state.loadingMessage = 'Sending You Email...';
        state.statuses.forgotPasswordAPICall = 'loading';
      })
      .addCase(forgotPasswordAPICall.fulfilled, (state) => {
        state.statuses.forgotPasswordAPICall = 'succeedded';
      })
      .addCase(forgotPasswordAPICall.rejected, (state) => {
        state.statuses.forgotPasswordAPICall = 'failed';
      })
      .addCase(updateProfileAPICall.pending, (state) => {
        state.loadingMessage = 'Updating the profile...';
        state.statuses.updateProfileAPICall = 'loading';
      })
      .addCase(updateProfileAPICall.fulfilled, (state) => {
        state.statuses.updateProfileAPICall = 'succeedded';
      })
      .addCase(updateProfileAPICall.rejected, (state) => {
        state.statuses.updateProfileAPICall = 'failed';
      })
      .addCase(uploadProfilePictureAPICall.pending, (state) => {
        state.loadingMessage = 'Updating Profile Picture...';
        state.statuses.uploadProfilePictureAPICall = 'loading';
      })
      .addCase(uploadProfilePictureAPICall.fulfilled, (state) => {
        state.statuses.uploadProfilePictureAPICall = 'succeedded';
      })
      .addCase(uploadProfilePictureAPICall.rejected, (state) => {
        state.statuses.uploadProfilePictureAPICall = 'failed';
      })
      .addCase(getProfilePictureAPICall.pending, (state) => {
        state.statuses.getProfilePictureAPICall = 'loading';
      })
      .addCase(getProfilePictureAPICall.fulfilled, (state) => {
        state.statuses.getProfilePictureAPICall = 'succeedded';
      })
      .addCase(getProfilePictureAPICall.rejected, (state) => {
        state.statuses.getProfilePictureAPICall = 'failed';
      })
      .addCase(getProfileDataAPICall.pending, (state) => {
        state.loadingMessage = 'Fetching Profile Data...';
        state.statuses.getProfileDataAPICall = 'loading';
      })
      .addCase(getProfileDataAPICall.fulfilled, (state) => {
        state.statuses.getProfileDataAPICall = 'succeedded';
      })
      .addCase(getProfileDataAPICall.rejected, (state) => {
        state.statuses.getProfileDataAPICall = 'failed';
      })
      .addCase(googleSigninAPICall.pending, (state) => {
        state.loadingMessage = 'Logging You In...';
        state.statuses.googleSigninAPICall = 'loading';
      })
      .addCase(googleSigninAPICall.fulfilled, (state) => {
        state.statuses.googleSigninAPICall = 'succeedded';
      })
      .addCase(googleSigninAPICall.rejected, (state) => {
        state.statuses.googleSigninAPICall = 'failed';
      });
  },
});
export const {
  reset: resetUserState,
  setCurrentUser,
  setTheme,
} = userSlice.actions;
export default userSlice.reducer;

export const signupAPICall = createAsyncThunk<
  //type of successfull returned obj
  {
    message: string;
  },
  //type of request obj passed to payload creator
  { email: string; password: string; mobileNumber: string; isAdmin: boolean },
  //type of returned error obj from rejectWithValue
  {
    rejectValue: MessageType;
  }
>(
  'user/signup',
  async (
    requestObject: {
      email: string;
      password: string;
      mobileNumber: string;
      isAdmin: boolean;
    },
    thunkAPI,
  ) => {
    let message = '';
    try {
      await auth().createUserWithEmailAndPassword(
        requestObject.email,
        requestObject.password,
      );
      return await firestore()
        .collection(apiUrls.users)
        .add({
          authId: auth().currentUser?.uid,
          mobileNumber: requestObject.mobileNumber,
          isAdmin: requestObject.isAdmin,
        })
        .then(() => {
          message = 'Account Created Successfully';
          return { message: message };
        })
        .catch((error) => {
          return thunkAPI.rejectWithValue({ message: error.message });
        });
    } catch (error: any) {
      console.log(error);
      //return rejected promise.
      if (error?.code === 'auth/email-already-in-use') {
        message = 'Email address is already in use!';
      }
      if (error?.code === 'auth/invalid-email') {
        message = 'Email address is invalid!';
      }
      if (error?.code === 'auth/weak-password') {
        message = 'Password should be atleast 6 characters long.';
      }
      console.log('message', message);
      return thunkAPI.rejectWithValue({
        message: message
          ? message
          : 'Failed to create account. Please try again after some time',
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
  async (requestObj: { email: string; password: string }, thunkAPI) => {
    let message = '';
    try {
      await auth().signInWithEmailAndPassword(
        requestObj.email,
        requestObj.password,
      );
      return await auth()
        .currentUser?.updateProfile({
          photoURL: '',
        })
        .then(() => {
          message = 'Logged In Successfully';
          return { message: message } as MessageType;
        })
        .catch((error) => {
          return thunkAPI.rejectWithValue({
            message: error.message,
          } as MessageType);
        });
    } catch (error: any) {
      //return rejected promise
      console.log('error', error);
      if (error?.code === 'auth/user-disabled') {
        message = 'Email address is disabled!';
      }
      if (error?.code === 'auth/invalid-email') {
        message = 'Email address is invalid!';
      }
      if (error?.code === 'auth/user-not-found') {
        message =
          'Account doesnt exist with this email. Create new account with this email.';
      }
      if (error?.code === 'auth/wrong-password') {
        message = 'Wrong password for email.';
      }
      if (error?.code === 'auth/too-many-requests') {
        message =
          'Account blocked due to incorrect attempts. Reset password to unblock.';
      }
      return thunkAPI.rejectWithValue({
        message: message || 'Failed to login. Please try again after some time',
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
    state: RootState;
  }
>('user/logout', async (_, thunkAPI) => {
  let message = '';
  try {
    if (thunkAPI.getState().user.currentUser.signinMethod === GOOGLE_CONST) {
      //if signin was through google signin then first signout from google to clear active token.
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    }
    return await auth()
      .signOut()
      .then(() => {
        message = 'Logged Out Successfully';
        return { message: message };
      })
      .catch((error) => {
        message = 'Failed to logout. Please try again after some time';
        return thunkAPI.rejectWithValue({ message: error.message || message });
      });
  } catch (err: any) {
    //return rejected promise
    return thunkAPI.rejectWithValue({
      message:
        err?.message || 'Failed to logout. Please try again after some time',
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
>('user/forgotPassword', async (requestObj: { email: string }, thunkAPI) => {
  let message = '';
  try {
    return await auth()
      .sendPasswordResetEmail(requestObj.email)
      .then(() => {
        message = 'Email sent Successfully';
        return { message: message };
      })
      .catch((error) => {
        message = 'Failed to send email. Please try again after some time';
        if (error?.code === 'auth/invalid-email') {
          message = 'Email address is invalid!';
        }
        if (error?.code === 'auth/user-not-found') {
          message = `Account doesn't exist with this email. Create new account with this email.`;
        }
        return thunkAPI.rejectWithValue({ message: message });
      });
  } catch (err: any) {
    //return rejected promise
    return thunkAPI.rejectWithValue({
      message:
        err?.message ||
        'Failed to send email. Please try again after some time',
    } as MessageType);
  }
});

export type UpdateProfileRequest = {
  name: string;
  authCredential: FirebaseAuthTypes.AuthCredential;
  newEmail: string;
  newPassword: string;
  newMobileNumberUpdate: { mobileNumber: string };
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
  let message = '';
  try {
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
      .then(() => {
        message =
          'Profile Updated successfully.Login again with new credentials';
        return { message } as MessageType;
      })
      .catch((err) => {
        return thunkAPI.rejectWithValue({
          message: err.message,
        } as MessageType);
      });
  } catch (err: any) {
    if (err?.code === 'auth/no-current-user') {
      message = 'No user currently signed in.';
    }
    if (err?.code === 'auth/user-token-expired') {
      message = 'No user currently signed in.';
    }
    if (err?.code === 'auth/wrong-password') {
      message =
        'Current password is invalid. Reset the password and then update the profile';
    }
    //return rejected promise
    return thunkAPI.rejectWithValue({
      message:
        message || 'Failed to update profile. Please try again after some time',
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

      task.on('state_changed', (taskSnapshot) => {
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
        .then(() => {
          message = 'Profile Picture Uploaded Successfully!';
          return { message: message };
        })
        .catch((error) => {
          return thunkAPI.rejectWithValue({ message: error?.message });
        });
    } catch (err: any) {
      //return rejected promise
      return thunkAPI.rejectWithValue({
        message:
          err?.message ||
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
        .then((resp) => {
          message = 'Profile Picture Fetched Successfully!';
          return {
            message: message,
            uri: resp,
            type: 'success',
          } as SuccessType;
        })
        .catch((error) => {
          return thunkAPI.rejectWithValue({
            message: error?.message,
            type: 'failure',
          } as MessageType);
        });
    } catch (err: any) {
      //return rejected promise
      return thunkAPI.rejectWithValue({
        message:
          err?.message ||
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
      .then((querySnapshot) => {
        querySnapshot.forEach((documentSnapshot) => {
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
      .catch((error) => {
        return thunkAPI.rejectWithValue({
          message: error?.message,
          type: 'failure',
        } as MessageType);
      });
  } catch (err: any) {
    //return rejected promise
    return thunkAPI.rejectWithValue({
      message:
        err?.message ||
        'Failed to fetch profile data. Please try again after some time',
    } as MessageType);
  }
});

export const googleSigninAPICall = createAsyncThunk<
  //type of successfull returned obj
  {
    message: string;
  },
  //type of request obj passed to payload creator
  {
    authCredentials: FirebaseAuthTypes.AuthCredential;
  },
  //type of returned error obj from rejectWithValue
  {
    rejectValue: MessageType;
  }
>('user/googleSignin', async (requestObj, thunkAPI) => {
  let message = '';
  try {
    let resultAfterSignin = await auth().signInWithCredential(
      requestObj.authCredentials,
    );

    //set the state of signin method as google signin
    if (resultAfterSignin?.additionalUserInfo?.providerId)
      thunkAPI.dispatch(
        setCurrentUser(resultAfterSignin.additionalUserInfo?.providerId),
      );
    //here first check if same user exist in the Users database
    let isAlreadyExist = false;
    let document: FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData>;
    let resultObj = await firestore()
      .collection(apiUrls.users)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((documentSnapshot) => {
          if (documentSnapshot.data()?.authId === auth().currentUser?.uid) {
            isAlreadyExist = true;
            document = documentSnapshot;
          }
        });
        return { document, isAlreadyExist };
      });

    //if already exist and data is not same just update the data
    if (resultObj.isAlreadyExist) {
      if (
        resultAfterSignin?.user?.phoneNumber &&
        resultAfterSignin?.user?.phoneNumber !==
          resultObj.document.data().mobileNumber
      ) {
        await firestore()
          .collection(apiUrls.users)
          .doc(resultObj.document.id)
          .update({
            mobileNumber: resultAfterSignin?.user?.phoneNumber || '',
          });
      }
    } else {
      await firestore()
        .collection(apiUrls.users)
        .add({
          authId: auth().currentUser?.uid,
          mobileNumber: resultAfterSignin?.user?.phoneNumber || '',
          email: resultAfterSignin.user.email,
        });
    }
    message = 'Logged in successfully';
    return { message: message };
  } catch (error: any) {
    //return rejected promise.
    if (error?.code === 'auth/user-disabled') {
      message = 'Email address is disabled!';
    }
    if (error?.code === 'auth/invalid-email') {
      message = 'Email address is invalid!';
    }
    if (error?.code === 'auth/user-not-found') {
      message =
        'Account doesnt exist with this email. Create new account with this email.';
    }
    if (error?.code === 'auth/wrong-password') {
      message = 'Wrong password for email.';
    }
    if (error?.code === 'auth/too-many-requests') {
      message =
        'Account blocked due to incorrect attempts. Reset password to unblock.';
    }
    return thunkAPI.rejectWithValue({
      message:
        message ||
        error?.message ||
        'Failed to login. Please try again after some time',
    } as MessageType);
  }
});
