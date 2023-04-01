import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import database from '@react-native-firebase/database';
import apiUrls from '../apiUrls';

export type EachPerson = {
  userId: string | number[];
  userEmail: string;
  userMobileNumber: string;
  userName: string;
  eventId: string | number [];
  isPaymentPending: boolean;
};

type PeopleState = {
  people: EachPerson[];
  status: 'idle' | 'succeedded' | 'failed' | 'loading';
  error: string;
};

const initialState: PeopleState = {
  people: [],
  status: 'idle',
  error: '',
};

export const peopleSlice = createSlice({
  name: 'people',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(addPeopleAPICall.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(addPeopleAPICall.fulfilled, (state, action) => {
        state.status = 'succeedded';
        const {userId, userEmail, userMobileNumber, userName, eventId, isPaymentPending} = action.meta.arg;
        state.people.push({
          userId,
          userEmail,
          userMobileNumber,
          userName,
          eventId,
          isPaymentPending
        });
      })
      .addCase(addPeopleAPICall.rejected, (state, action) => {
        state.error = 'Failed to add User. Please try again after some time';
        state.status = 'failed';
      })
      .addCase(getPeopleAPICall.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(getPeopleAPICall.fulfilled, (state, action) => {
        state.people.length = 0;
        if (action.payload.responseData) {
          state.people = JSON.parse(
            JSON.stringify(action.payload.responseData),
          );
        }
        state.status = 'succeedded';
      })
      .addCase(getPeopleAPICall.rejected, (state, action) => {
        state.error =
          'Failed to fetch People for this event. Please try again after some time';
        state.status = 'failed';
      });
  },
});

export default peopleSlice.reducer;

export const addPeopleAPICall = createAsyncThunk(
  'people/addPeople',
  async (requestObject: EachPerson, thunkAPI) => {
    try {
      database().ref(apiUrls.people).push(requestObject);
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
              responseArr.push(responseObj[key]);
            }
          }
        });
      return {success: true, responseData: responseArr};
    } catch (err) {
      return {success: false, error: err};
    }
  },
);
