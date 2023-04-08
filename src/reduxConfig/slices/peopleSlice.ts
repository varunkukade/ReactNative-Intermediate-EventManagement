import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import apiUrls from '../apiUrls';
import firestore from '@react-native-firebase/firestore';

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
};

const initialState: PeopleState = {
  people: [],
  statuses: {
    addPeopleAPICall: 'idle',
    getPeopleAPICall: 'idle',
    removePeopleAPICall: 'idle',
    updatePeopleAPICall: 'idle',
  },
};

export const peopleSlice = createSlice({
  name: 'people',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(addPeopleAPICall.pending, (state, action) => {
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
        state.statuses.removePeopleAPICall = 'loading';
      })
      .addCase(removePeopleAPICall.fulfilled, (state, action) => {
        state.people = state.people.filter(
          eachPerson => eachPerson.userId !== action.meta.arg,
        );
        state.statuses.removePeopleAPICall = 'succeedded';
      })
      .addCase(removePeopleAPICall.rejected, (state, action) => {
        state.statuses.removePeopleAPICall = 'failed';
      })
      .addCase(updatePeopleAPICall.pending, (state, action) => {
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

export default peopleSlice.reducer;

export const addPeopleAPICall = createAsyncThunk(
  'people/addPeople',
  async (requestObject: Omit<EachPerson, 'userId'>, thunkAPI) => {
    try {
      await firestore().collection(apiUrls.people).add(requestObject);
      return {message: 'User added successfully'};
    } catch (err) {
      return thunkAPI.rejectWithValue({message: 'Failed to add user. Please try again after some time'});
    }
  },
);

export const removePeopleAPICall = createAsyncThunk(
  'people/removePeople',
  async (userId: string, thunkAPI) => {
    try {
      firestore().collection(apiUrls.people).doc(userId).delete();
      return {message: 'User removed successfully'};
    } catch (err) {
      return thunkAPI.rejectWithValue({
        message: 'Failed to remove user. Please try again after some time',
      });
    }
  },
);

export const getPeopleAPICall = createAsyncThunk(
  'events/getPeople',
  async (_, thunkAPI) => {
    let responseArr: EachPerson[] = [];
    try {
      await firestore()
        .collection(apiUrls.people)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(documentSnapshot => {
            let updatedObj = JSON.parse(
              JSON.stringify(documentSnapshot.data()),
            );
            updatedObj.userId = documentSnapshot.id;
            responseArr.push(updatedObj);
          });
        });
      //return the resolved promise with data.
      return {responseData: responseArr, message: 'Users fetched successfully'};
    } catch (err) {
      return thunkAPI.rejectWithValue({
        message: 'Failed to fetch users. Please try again after some time',
      });
    }
  },
);

type updatePeopleAPICallRequest = {
  userId: string;
  newUpdate: Partial<EachPerson>;
};

export const updatePeopleAPICall = createAsyncThunk(
  'people/updatePeople',
  async (requestObj: updatePeopleAPICallRequest, thunkAPI) => {
    try {
      firestore()
        .collection(apiUrls.people)
        .doc(requestObj.userId)
        .update(requestObj.newUpdate);
      return {
        message: 'User updated successfully!',
      };
    } catch (err) {
      return thunkAPI.rejectWithValue({
        message: 'Failed to update user. Please try again after some time',
      });
    }
  },
);
