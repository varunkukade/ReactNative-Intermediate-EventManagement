import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import uuid from 'react-native-uuid';
import database from '@react-native-firebase/database';
import apiUrls from '../apiUrls';

export type EachEvent = {
  eventId: string | number[];
  eventTitle: string;
  eventDate: string;
};

type EventsState = {
  events: EachEvent[];
  status: 'idle' | 'succeedded' | 'failed' | 'loading';
  error: string;
};

const initialState: EventsState = {
  events: [],
  status: 'idle',
  error: '',
};

export const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    addEvent: (state, action: PayloadAction<EachEvent>) => {
      state.events.push({
        eventId: uuid.v4(),
        eventTitle: action.payload.eventTitle,
        eventDate: action.payload.eventDate,
      });
    },
    removeEvent: (state, action: PayloadAction<string>) => {
      state.events.filter(eachEvent => {
        return eachEvent.eventId !== action.payload;
      });
    },
  },
  extraReducers(builder) {
    builder
      .addCase(addEventAPICall.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(addEventAPICall.fulfilled, (state, action) => {
        state.status = 'succeedded';
        const {eventDate, eventId, eventTitle} = action.meta.arg;
        state.events.push({
          eventId,
          eventTitle,
          eventDate,
        });
      })
      .addCase(addEventAPICall.rejected, (state, action) => {
        state.error = 'Failed to add event. Please try again after some time';
        state.status = 'failed';
      })
      .addCase(getEventsAPICall.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(getEventsAPICall.fulfilled, (state, action) => {
        state.events.length = 0;
        if (action.payload.responseData) {
          state.events = JSON.parse(
            JSON.stringify(action.payload.responseData),
          );
        }
        state.status = 'succeedded';
      })
      .addCase(getEventsAPICall.rejected, (state, action) => {
        state.error =
          'Failed to fetch events. Please try again after some time';
        state.status = 'failed';
      });
  },
});

export const {addEvent: addEventAction, removeEvent: removeEventAction} =
  eventsSlice.actions;
export default eventsSlice.reducer;

export const addEventAPICall = createAsyncThunk(
  'events/addEvent',
  async (requestObject: EachEvent, thunkAPI) => {
    try {
      database().ref(apiUrls.events).push(requestObject);
      return {success: true};
    } catch (err) {
      return {success: false, error: err};
    }
  },
);

export const getEventsAPICall = createAsyncThunk(
  'events/getEvent',
  async () => {
    let responseArr: EachEvent[] = [];
    try {
      await database()
        .ref(apiUrls.events)
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
