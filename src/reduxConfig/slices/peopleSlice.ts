import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import database from '@react-native-firebase/database';
import apiUrls from '../apiUrls';

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
  errors: {
    addPeopleAPICall: string;
    getPeopleAPICall: string;
    removePeopleAPICall: string;
    updatePeopleAPICall: string;
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
  errors: {
    addPeopleAPICall: '',
    getPeopleAPICall: '',
    removePeopleAPICall: '',
    updatePeopleAPICall: '',
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
        state.errors.addPeopleAPICall =
          'Failed to add User. Please try again after some time';
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
        state.errors.addPeopleAPICall =
          'Failed to fetch People for this event. Please try again after some time';
        state.statuses.getPeopleAPICall = 'failed';
      })
      .addCase(removePeopleAPICall.pending, (state, action) => {
        state.statuses.removePeopleAPICall = 'loading';
      })
      .addCase(removePeopleAPICall.fulfilled, (state, action) => {
        state.statuses.removePeopleAPICall = 'succeedded';
      })
      .addCase(removePeopleAPICall.rejected, (state, action) => {
        state.errors.removePeopleAPICall =
          'Failed to remove this user from this event. Please try again after some time';
        state.statuses.removePeopleAPICall = 'failed';
      })
      .addCase(updatePeopleAPICall.pending, (state, action) => {
        state.statuses.updatePeopleAPICall = 'loading';
      })
      .addCase(updatePeopleAPICall.fulfilled, (state, action) => {
        state.statuses.updatePeopleAPICall = 'succeedded';
        const {isPaymentPending} = action.meta.arg.newUpdate;
        state.people = state.people.map(eachPerson => {
          if (eachPerson.userId === action.meta.arg.userId) {
            if (isPaymentPending !== undefined)
              eachPerson.isPaymentPending = isPaymentPending;
            return eachPerson;
          } else return eachPerson;
        });
      })
      .addCase(updatePeopleAPICall.rejected, (state, action) => {
        state.errors.updatePeopleAPICall =
          'Failed to remove this user from this event. Please try again after some time';
        state.statuses.removePeopleAPICall = 'failed';
      });
  },
});

export default peopleSlice.reducer;

export const addPeopleAPICall = createAsyncThunk(
  'people/addPeople',
  async (requestObject: Omit<EachPerson, 'userId'>, thunkAPI) => {
    try {
      database().ref(apiUrls.people).push(requestObject);
      return {success: true};
    } catch (err) {
      return {success: false, error: err};
    }
  },
);

export const removePeopleAPICall = createAsyncThunk(
  'people/removePeople',
  async (userId: string, thunkAPI) => {
    try {
      database()
        .ref(apiUrls.people + `/${userId}`)
        .remove();
      return {success: true};
    } catch (err) {
      return {success: false, error: err};
    }
  },
);

export const getPeopleAPICall = createAsyncThunk(
  'events/getPeople',
  async () => {
    let responseArr: EachPerson[] = [];
    try {
      await database()
        .ref(apiUrls.people)
        .once('value')
        .then(snapshot => {
          let responseObj = snapshot.val();
          if (responseObj && Object.keys(responseObj).length > 0) {
            for (const key in responseObj) {
              let updatedObj = JSON.parse(JSON.stringify(responseObj[key]));
              updatedObj.userId = key;
              responseArr.push(updatedObj);
            }
          }
        });
      return {success: true, responseData: responseArr};
    } catch (err) {
      return {success: false, error: err};
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
      database()
        .ref(apiUrls.people + `/${requestObj.userId}`)
        .update(requestObj.newUpdate);
      return {success: true};
    } catch (err) {
      return {success: false, error: err};
    }
  },
);
