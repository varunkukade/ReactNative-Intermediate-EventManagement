import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import apiUrls from '../apiUrls';
import firestore from '@react-native-firebase/firestore';
import {MessageType} from './eventsSlice';

type status = 'idle' | 'succeedded' | 'failed' | 'loading';

export type EachPerson = {
  userId: string;
  userEmail: string;
  userMobileNumber: string;
  userName: string;
  eventId: string | number[];
  isPaymentPending: boolean;
};

type PeopleState = {
  people: EachPerson[];
  statuses: {
    addPeopleAPICall: status;
    getPeopleAPICall: status;
    removePeopleAPICall: status;
    updatePeopleAPICall: status;
  };
  loadingMessage: string;
};

const initialState: PeopleState = {
  people: [],
  statuses: {
    addPeopleAPICall: 'idle',
    getPeopleAPICall: 'idle',
    removePeopleAPICall: 'idle',
    updatePeopleAPICall: 'idle',
  },
  loadingMessage: ''
};

export const peopleSlice = createSlice({
  name: 'people',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(addPeopleAPICall.pending, (state, action) => {
        state.loadingMessage = 'Adding User To Event'
        state.statuses.addPeopleAPICall = 'loading';
      })
      .addCase(addPeopleAPICall.fulfilled, (state, action) => {
        state.statuses.addPeopleAPICall = 'succeedded';
      })
      .addCase(addPeopleAPICall.rejected, (state, action) => {
        state.statuses.addPeopleAPICall = 'failed';
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
        }
        state.statuses.getPeopleAPICall = 'succeedded';
      })
      .addCase(getPeopleAPICall.rejected, (state, action) => {
        state.statuses.getPeopleAPICall = 'failed';
      })
      .addCase(removePeopleAPICall.pending, (state, action) => {
        state.loadingMessage = 'Deleting the user'
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
        state.loadingMessage = 'Updating User Status'
        state.statuses.updatePeopleAPICall = 'loading';
      })
      .addCase(updatePeopleAPICall.fulfilled, (state, action) => {
        const {isPaymentPending} = action.meta.arg.newUpdate;
        state.people = state.people.map(eachPerson => {
          if (eachPerson.userId === action.meta.arg.userId) {
            if (isPaymentPending !== undefined)
              eachPerson.isPaymentPending = isPaymentPending;
            return eachPerson;
          } else return eachPerson;
        });
        state.statuses.updatePeopleAPICall = 'succeedded';
      })
      .addCase(updatePeopleAPICall.rejected, (state, action) => {
        state.statuses.removePeopleAPICall = 'failed';
      });
  },
});

export const {reset: resetPeopleState} =
  peopleSlice.actions;
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
    } catch (err) {
      return thunkAPI.rejectWithValue({
        message: 'Failed to add user. Please try again after some time',
      });
    }
  },
);

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
  } catch (err) {
    return thunkAPI.rejectWithValue({
      message: 'Failed to remove user. Please try again after some time',
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
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          let updatedObj = JSON.parse(JSON.stringify(documentSnapshot.data()));
          updatedObj.userId = documentSnapshot.id;
          responseArr.push(updatedObj);
        });
        //return the resolved promise with data.
        return {
          responseData: responseArr,
          message: 'Users fetched successfully',
        };
      });
  } catch (err) {
    return thunkAPI.rejectWithValue({
      message: 'Failed to fetch users. Please try again after some time',
    });
  }
});

type updatePeopleAPICallRequest = {
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
    } catch (err) {
      return thunkAPI.rejectWithValue({
        message: 'Failed to update user. Please try again after some time',
      });
    }
  },
);
