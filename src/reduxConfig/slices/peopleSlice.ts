import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import apiUrls from '../apiUrls';
import firestore from '@react-native-firebase/firestore';
import {MessageType} from './eventsSlice';
import {RootState, store} from '../store';
import {PAGINATION_CONSTANT} from '../../utils/constants';
import auth from '@react-native-firebase/auth';

type status = 'idle' | 'succeedded' | 'failed' | 'loading';

export type EachPerson = {
  userId: string;
  userEmail: string;
  userMobileNumber: string;
  userName: string;
  eventId: string | number[];
  isPaymentPending: boolean;
  paymentMode?: string;
  createdAt: string;
};

type PeopleState = {
  people: EachPerson[];
  originalPeople: EachPerson[];
  lastFetchedUserId: string;
  statuses: {
    addPeopleAPICall: status;
    addPeopleInBatchAPICall: status;
    getPeopleAPICall: status;
    removePeopleAPICall: status;
    updatePeopleAPICall: status;
    getNextEventJoinersAPICall: status;
    addCommonListAPICall: status;
    getCommonListsAPICall: status;
  };
  loadingMessage: string;
  commonLists: CommonListObject[];
};

const initialState: PeopleState = {
  people: [],
  originalPeople:[],
  lastFetchedUserId: '',
  statuses: {
    addPeopleAPICall: 'idle',
    addPeopleInBatchAPICall: 'idle',
    getPeopleAPICall: 'idle',
    removePeopleAPICall: 'idle',
    updatePeopleAPICall: 'idle',
    getNextEventJoinersAPICall: 'idle',
    addCommonListAPICall: 'idle',
    getCommonListsAPICall: 'idle',
  },
  loadingMessage: '',
  commonLists: [],
};

export const peopleSlice = createSlice({
  name: 'people',
  initialState,
  reducers: {
    reset: () => initialState,
    setlastFetchedUserId: (state, action: PayloadAction<string>) => {
      state.lastFetchedUserId = JSON.parse(JSON.stringify(action.payload));
    },
    updateCommonList: (state, action: PayloadAction<CommonListObject[]>) => {
      state.commonLists = JSON.parse(JSON.stringify(action.payload));
    },
    updatePeopleState: (state, action: PayloadAction<EachPerson[]>) => {
      state.people = JSON.parse(JSON.stringify(action.payload));
    },
  },
  extraReducers(builder) {
    builder
      .addCase(addPeopleAPICall.pending, (state, action) => {
        state.loadingMessage = 'Adding User To Event';
        state.statuses.addPeopleAPICall = 'loading';
      })
      .addCase(addPeopleAPICall.fulfilled, (state, action) => {
        state.statuses.addPeopleAPICall = 'succeedded';
      })
      .addCase(addPeopleAPICall.rejected, (state, action) => {
        state.statuses.addPeopleAPICall = 'failed';
      })
      .addCase(addPeopleInBatchAPICall.pending, (state, action) => {
        state.loadingMessage = 'Adding Users To Event';
        state.statuses.addPeopleInBatchAPICall = 'loading';
      })
      .addCase(addPeopleInBatchAPICall.fulfilled, (state, action) => {
        state.statuses.addPeopleInBatchAPICall = 'succeedded';
      })
      .addCase(addPeopleInBatchAPICall.rejected, (state, action) => {
        state.statuses.addPeopleInBatchAPICall = 'failed';
      })
      .addCase(getPeopleAPICall.pending, (state, action) => {
        state.statuses.getPeopleAPICall = 'loading';
      })
      .addCase(getPeopleAPICall.fulfilled, (state, action) => {
        state.people.length = 0;
        if (action.payload.responseData) {
          state.people = JSON.parse(
            JSON.stringify(action.payload.responseData),
          );
          state.originalPeople = JSON.parse(
            JSON.stringify(action.payload.responseData),
          );
        }
        state.statuses.getPeopleAPICall = 'succeedded';
      })
      .addCase(getPeopleAPICall.rejected, (state, action) => {
        state.statuses.getPeopleAPICall = 'failed';
      })
      .addCase(getNextEventJoinersAPICall.pending, (state, action) => {
        state.statuses.getNextEventJoinersAPICall = 'loading';
      })
      .addCase(getNextEventJoinersAPICall.fulfilled, (state, action) => {
        if (action.payload.responseData.length > 0) {
          state.people = state.people.concat(action.payload.responseData);
        }
        state.statuses.getNextEventJoinersAPICall = 'succeedded';
      })
      .addCase(getNextEventJoinersAPICall.rejected, (state, action) => {
        state.statuses.getNextEventJoinersAPICall = 'failed';
      })
      .addCase(removePeopleAPICall.pending, (state, action) => {
        state.loadingMessage = 'Deleting the user';
        state.statuses.removePeopleAPICall = 'loading';
      })
      .addCase(removePeopleAPICall.fulfilled, (state, action) => {
        state.people = state.people.filter(
          eachPerson => eachPerson.userId !== action.meta.arg.userId,
        );
        state.statuses.removePeopleAPICall = 'succeedded';
      })
      .addCase(removePeopleAPICall.rejected, (state, action) => {
        state.statuses.removePeopleAPICall = 'failed';
      })
      .addCase(updatePeopleAPICall.pending, (state, action) => {
        state.loadingMessage = 'Updating User Status';
        state.statuses.updatePeopleAPICall = 'loading';
      })
      .addCase(updatePeopleAPICall.fulfilled, (state, action) => {
        const {
          isPaymentPending,
          userName,
          userEmail,
          userMobileNumber,
          paymentMode,
        } = action.meta.arg.newUpdate;
        state.people = state.people.map(eachPerson => {
          if (eachPerson.userId === action.meta.arg.userId) {
            if (isPaymentPending !== undefined)
              eachPerson.isPaymentPending = isPaymentPending;
            if (userName) eachPerson.userName = userName;
            if (userEmail) eachPerson.userEmail = userEmail;
            if (userMobileNumber)
              eachPerson.userMobileNumber = userMobileNumber;
            if (paymentMode) eachPerson.paymentMode = paymentMode;
            return eachPerson;
          } else return eachPerson;
        });
        state.statuses.updatePeopleAPICall = 'succeedded';
      })
      .addCase(updatePeopleAPICall.rejected, (state, action) => {
        state.statuses.removePeopleAPICall = 'failed';
      })
      .addCase(addCommonListAPICall.pending, (state, action) => {
        state.loadingMessage = 'Creating Common List...';
        state.statuses.addCommonListAPICall = 'loading';
      })
      .addCase(addCommonListAPICall.fulfilled, (state, action) => {
        state.statuses.addCommonListAPICall = 'succeedded';
      })
      .addCase(addCommonListAPICall.rejected, (state, action) => {
        state.statuses.addCommonListAPICall = 'failed';
      })
      .addCase(getCommonListsAPICall.pending, (state, action) => {
        state.loadingMessage = 'Fetching Common Lists...';
        state.statuses.getCommonListsAPICall = 'loading';
      })
      .addCase(getCommonListsAPICall.fulfilled, (state, action) => {
        state.commonLists.length = 0;
        if (action.payload.responseData) {
          state.commonLists = JSON.parse(
            JSON.stringify(action.payload.responseData),
          );
          state.commonLists = state.commonLists.filter(
            eachCommonList =>
              eachCommonList.createdBy === auth().currentUser?.uid,
          );
        }
        state.statuses.getCommonListsAPICall = 'succeedded';
      })
      .addCase(getCommonListsAPICall.rejected, (state, action) => {
        state.statuses.getCommonListsAPICall = 'failed';
      });
  },
});

export const {
  reset: resetPeopleState,
  setlastFetchedUserId,
  updateCommonList,
  updatePeopleState
} = peopleSlice.actions;
export default peopleSlice.reducer;

export const addPeopleAPICall = createAsyncThunk<
  //type of successfull returned obj
  MessageType,
  //type of request obj passed to payload creator
  Omit<EachPerson, 'userId'>,
  //type of returned error obj from rejectWithValue
  {
    rejectValue: MessageType;
  }
>(
  'people/addPeople',
  async (requestObject: Omit<EachPerson, 'userId'>, thunkAPI) => {
    try {
      return await firestore()
        .collection(apiUrls.people)
        .add(requestObject)
        .then(res => {
          return {message: 'User added successfully'};
        });
    } catch (err: any) {
      return thunkAPI.rejectWithValue({
        message:
          err?.message ||
          'Failed to add user. Please try again after some time',
      });
    }
  },
);

export const addPeopleInBatchAPICall = createAsyncThunk<
  //type of successfull returned obj
  MessageType,
  //type of request obj passed to payload creator
  EachPerson[],
  //type of returned error obj from rejectWithValue
  {
    rejectValue: MessageType;
  }
>('people/addPeopleInBatch', async (users: EachPerson[], thunkAPI) => {
  try {
    console.log(users)
    const batch = firestore().batch();
    users.forEach(user => {
      const userRef = firestore().collection(apiUrls.people).doc(); // Create a new document reference
      batch.set(userRef, user); // Add the user object to the batch
    });
    return batch.commit().then(res => {
      return {message: 'Users added successfully'};
    });
  } catch (err: any) {
    return thunkAPI.rejectWithValue({
      message:
        err?.message || 'Failed to add users. Please try again after some time',
    });
  }
});

export const removePeopleAPICall = createAsyncThunk<
  //type of successfull returned obj
  {
    message: string;
  },
  //type of request obj passed to payload creator
  {
    userId: string;
  },
  //type of returned error obj from rejectWithValue
  {
    rejectValue: MessageType;
  }
>('people/removePeople', async (requestObj: {userId: string}, thunkAPI) => {
  try {
    return await firestore()
      .collection(apiUrls.people)
      .doc(requestObj.userId)
      .delete()
      .then(res => {
        return {message: 'User removed successfully'};
      });
  } catch (err: any) {
    return thunkAPI.rejectWithValue({
      message:
        err?.message ||
        'Failed to remove user. Please try again after some time',
    });
  }
});

export const getPeopleAPICall = createAsyncThunk<
  //type of successfull returned obj
  {
    responseData: EachPerson[];
    message: string;
  },
  //type of request obj passed to payload creator
  undefined,
  //type of returned error obj from rejectWithValue
  {
    rejectValue: MessageType;
  }
>('events/getPeople', async (_, thunkAPI) => {
  let responseArr: EachPerson[] = [];
  try {
    return await firestore()
      .collection(apiUrls.people)
      .orderBy('createdAt', 'desc')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          let updatedObj = JSON.parse(JSON.stringify(documentSnapshot.data()));
          updatedObj.userId = documentSnapshot.id;
          responseArr.push(updatedObj);
        });
        if (responseArr.length > 0) {
          thunkAPI.dispatch(
            setlastFetchedUserId(responseArr[responseArr.length - 1].userId),
          );
        }
        //return the resolved promise with data.
        return {
          responseData: responseArr,
          message: 'Users fetched successfully',
        };
      });
  } catch (err: any) {
    return thunkAPI.rejectWithValue({
      message:
        err?.message ||
        'Failed to fetch users. Please try again after some time',
    });
  }
});

export type updatePeopleAPICallRequest = {
  userId: string;
  newUpdate: Partial<EachPerson>;
};

export const updatePeopleAPICall = createAsyncThunk<
  //type of successfull returned obj
  {
    message: string;
  },
  //type of request obj passed to payload creator
  updatePeopleAPICallRequest,
  //type of returned error obj from rejectWithValue
  {
    rejectValue: MessageType;
  }
>(
  'people/updatePeople',
  async (requestObj: updatePeopleAPICallRequest, thunkAPI) => {
    try {
      return await firestore()
        .collection(apiUrls.people)
        .doc(requestObj.userId)
        .update(requestObj.newUpdate)
        .then(res => {
          return {
            message: 'User updated successfully!',
          };
        });
    } catch (err: any) {
      return thunkAPI.rejectWithValue({
        message:
          err?.message ||
          'Failed to update user. Please try again after some time',
      });
    }
  },
);

export type SuccessType = {
  responseData: EachPerson[];
  message: string;
  successMessagetype: 'moreUsersExist' | 'noMoreUsers';
};
export const getNextEventJoinersAPICall = createAsyncThunk<
  //type of successfull returned obj
  SuccessType,
  //type of request obj passed to payload creator
  undefined,
  //type of thunkAPI
  {
    rejectValue: MessageType;
    dispatch: typeof store.dispatch;
    state: RootState;
  }
>(
  'events/getNextEventJoiners',
  async (_, {dispatch, getState, rejectWithValue}) => {
    //this callback is called as payload creator callback.
    let responseArr: EachPerson[] = [];
    try {
      let lastDocFetched = await firestore()
        .collection(apiUrls.people)
        .doc(getState().people.lastFetchedUserId)
        .get();
      return await firestore()
        .collection(apiUrls.people)
        .orderBy('createdAt', 'desc')
        .startAfter(lastDocFetched)
        .limit(PAGINATION_CONSTANT)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(documentSnapshot => {
            let updatedObj = JSON.parse(
              JSON.stringify(documentSnapshot.data()),
            );
            updatedObj.userId = documentSnapshot.id;
            responseArr.push(updatedObj);
          });
          if (responseArr.length > 0) {
            dispatch(
              setlastFetchedUserId(responseArr[responseArr.length - 1].userId),
            );
            //return the resolved promise with data.
            return {
              responseData: responseArr,
              message: 'Users fetched successfully',
              successMessagetype: 'moreUsersExist',
            } as SuccessType;
          } else {
            //return the resolved promise with data.
            return {
              responseData: [],
              message: 'No More Event Joiners',
              successMessagetype: 'noMoreUsers',
            } as SuccessType;
          }
        });
    } catch (err: any) {
      //return rejected promise from payload creator
      return rejectWithValue({
        message:
          err?.message ||
          'Failed to fetch more users. Please try again after some time',
        failureType: 'failure',
      } as MessageType);
    }
  },
);

type AddCommonListAPICallReqObj = {
  commonListName: string;
  createdBy: string;
  createdAt: string;
  users: Omit<EachPerson, 'userId' | 'eventId'>[];
};

export const addCommonListAPICall = createAsyncThunk<
  //type of successfull returned obj
  MessageType,
  //type of request obj passed to payload creator
  AddCommonListAPICallReqObj,
  //type of returned error obj from rejectWithValue
  {
    rejectValue: MessageType;
  }
>(
  'people/addCommonList',
  async (requestObj: AddCommonListAPICallReqObj, thunkAPI) => {
    try {
      // add a document to the CommonList collection
      const commonListDoc = await firestore()
        .collection(apiUrls.commonList)
        .add({
          commonListName: requestObj.commonListName,
          createdBy: requestObj.createdBy,
          createdAt: requestObj.createdAt,
        });

      // add a multiple documents using batch to the CommonListUsers subcollection within CommonList Collection

      // Create a batch instance
      const batch = firestore().batch();

      // Iterate through the array of documents and add them to the batch
      requestObj.users.forEach(doc => {
        const docRef = commonListDoc.collection(apiUrls.commonListUsers).doc();
        batch.set(docRef, doc);
      });

      return await batch.commit().then(res => {
        return {message: 'Common List Created Successfully!'};
      });
    } catch (err: any) {
      return thunkAPI.rejectWithValue({
        message:
          err?.message ||
          'Failed to create common list. Please try again after some time',
      });
    }
  },
);

export type EachUserInCommonList = Omit<EachPerson, 'eventId'> & {
  selected: boolean;
};

export type CommonListObject = {
  commonListName: string;
  createdBy: string;
  createdAt: string;
  users: EachUserInCommonList[];
  commonListId: string;
  expanded: boolean;
};

export const getCommonListsAPICall = createAsyncThunk<
  //type of successfull returned obj
  {
    responseData: CommonListObject[];
    message: string;
  },
  //type of request obj passed to payload creator
  undefined,
  //type of returned error obj from rejectWithValue
  {
    rejectValue: MessageType;
  }
>('events/getCommonLists', async (_, thunkAPI) => {
  let commonListArr: CommonListObject[] = [];
  try {
    const commonListRef = firestore().collection(apiUrls.commonList);

    await commonListRef
      //.where('createdBy', '==', auth().currentUser?.uid)
      .orderBy('createdAt', 'desc')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          let updatedObj: CommonListObject = JSON.parse(
            JSON.stringify(documentSnapshot.data()),
          );
          updatedObj.commonListId = documentSnapshot.id;
          updatedObj.users = [];
          updatedObj.expanded = true;
          commonListArr.push(updatedObj);
        });
      });

    //here get the users for each common list squentially in the array using map.
    let arrayOfPromises = commonListArr.map(async eachCommonList => {
      return await commonListRef
        .doc(eachCommonList.commonListId)
        .collection(apiUrls.commonListUsers)
        .get()
        .then(querySnapshot => {
          const updatedUsers: EachUserInCommonList[] = querySnapshot.docs.map(
            documentSnapshot => {
              const updatedUser: EachUserInCommonList = JSON.parse(
                JSON.stringify(documentSnapshot.data()),
              );
              updatedUser.userId = documentSnapshot.id;
              updatedUser.selected = false;
              return updatedUser;
            },
          );

          // Return the updated eachCommonList object as promise.
          return {
            ...eachCommonList,
            users: updatedUsers,
          };
        });
    });

    //here As API are already called inside MAP method, Promise.all is used to wait for all promises to successfull.
    return await Promise.all(arrayOfPromises).then(res => {
      //return the resolved promise with data.
      return {
        responseData: res,
        message: 'Common Lists fetched successfully',
      };
    });
  } catch (err: any) {
    return thunkAPI.rejectWithValue({
      message:
        err?.message ||
        'Failed to fetch common list. Please try again after some time',
    });
  }
});
