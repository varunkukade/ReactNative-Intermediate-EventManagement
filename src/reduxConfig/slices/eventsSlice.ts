import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import database from '@react-native-firebase/database';
import apiUrls from '../apiUrls';

type status = 'idle' | 'succeedded' | 'failed' | 'loading'

export type EachEvent = {
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventDesc: string;
  eventLocation: string;
  eventFees: string
  mealProvided: boolean
  accomodationProvided: boolean
};

type EventsState = {
  events: EachEvent[];
  statuses: {
    addEventAPICall: status;
    getEventAPICall: status;
  }
  errors: {
    addEventAPICall: string,
    getEventAPICall: string
  },
};

const initialState: EventsState = {
  events: [],
  statuses: {
    addEventAPICall:'idle',
    getEventAPICall:'idle'
  },
  errors: {
    addEventAPICall:'',
    getEventAPICall:''
  },
};

export const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    addEvent: (state, action: PayloadAction<EachEvent>) => {
      const {eventTitle, eventDate, eventDesc, eventId,eventLocation, eventTime, eventFees, mealProvided, accomodationProvided} = action.payload
      state.events.push({
        eventId,
        eventTitle,
        eventDate,
        eventTime,
        eventDesc,
        eventLocation,
        eventFees,
        mealProvided,
        accomodationProvided
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
        state.statuses.addEventAPICall = 'loading';
      })
      .addCase(addEventAPICall.fulfilled, (state, action) => {
        state.statuses.addEventAPICall = 'succeedded';
      })
      .addCase(addEventAPICall.rejected, (state, action) => {
        state.errors.addEventAPICall = 'Failed to add event. Please try again after some time';
        state.statuses.addEventAPICall = 'failed';
      })
      .addCase(getEventsAPICall.pending, (state, action) => {
        state.statuses.getEventAPICall = 'loading';
      })
      .addCase(getEventsAPICall.fulfilled, (state, action) => {
        state.events.length = 0;
        if (action.payload.responseData) {
          state.events = JSON.parse(
            JSON.stringify(action.payload.responseData),
          );
        }
        state.statuses.getEventAPICall = 'succeedded';
      })
      .addCase(getEventsAPICall.rejected, (state, action) => {
        state.errors.getEventAPICall =
          'Failed to fetch events. Please try again after some time';
        state.statuses.getEventAPICall = 'failed';
      });
  },
});

export const {addEvent: addEventAction, removeEvent: removeEventAction} =
  eventsSlice.actions;
export default eventsSlice.reducer;

export const addEventAPICall = createAsyncThunk(
  'events/addEvent',
  async (requestObject: Omit<EachEvent,'eventId'> , thunkAPI) => {
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
              let updatedObj = JSON.parse(JSON.stringify(responseObj[key]));
              updatedObj.eventId = key;
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
