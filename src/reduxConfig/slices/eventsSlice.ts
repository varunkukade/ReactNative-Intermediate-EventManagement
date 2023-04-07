import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';
import apiUrls from '../apiUrls';

type status = 'idle' | 'succeedded' | 'failed' | 'loading';

export type EachEvent = {
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventDesc: string;
  eventLocation: string;
  eventFees: string;
  mealProvided: boolean;
  accomodationProvided: boolean;
};

type EventsState = {
  events: EachEvent[];
  statuses: {
    addEventAPICall: status;
    getEventAPICall: status;
    removeEventAPICall: status;
  };
};

const initialState: EventsState = {
  events: [],
  statuses: {
    addEventAPICall: 'idle',
    getEventAPICall: 'idle',
    removeEventAPICall: 'idle',
  },
};

export const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    addEvent: (state, action: PayloadAction<EachEvent>) => {
      const {
        eventTitle,
        eventDate,
        eventDesc,
        eventId,
        eventLocation,
        eventTime,
        eventFees,
        mealProvided,
        accomodationProvided,
      } = action.payload;
      state.events.push({
        eventId,
        eventTitle,
        eventDate,
        eventTime,
        eventDesc,
        eventLocation,
        eventFees,
        mealProvided,
        accomodationProvided,
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
        state.statuses.getEventAPICall = 'failed';
      })
      .addCase(removeEventAPICall.pending, (state, action) => {
        state.statuses.removeEventAPICall = 'loading';
      })
      .addCase(removeEventAPICall.fulfilled, (state, action) => {
        state.events = state.events.filter(
          eachEvent => eachEvent.eventId !== action.meta.arg,
        );
        state.statuses.removeEventAPICall = 'succeedded';
      })
      .addCase(removeEventAPICall.rejected, (state, action) => {
        state.statuses.removeEventAPICall = 'failed';
      });
  },
});

export const {addEvent: addEventAction, removeEvent: removeEventAction} =
  eventsSlice.actions;
export default eventsSlice.reducer;

export const addEventAPICall = createAsyncThunk(
  'events/addEvent',
  async (requestObject: Omit<EachEvent, 'eventId'>, thunkAPI) => {
    try {
      await firestore().collection(apiUrls.events).add(requestObject);
      return {message: 'Event added successfully'};
    } catch (err) {
      //return rejected promise.
      return {message: 'Failed to add event. Please try again after some time'};
    }
  },
);

export const removeEventAPICall = createAsyncThunk(
  'people/removeEvent',
  async (eventId: string, thunkAPI) => {
    try {
      firestore().collection(apiUrls.events).doc(eventId).delete();
      return {message: 'Event removed successfully'};
    } catch (err) {
      //return rejected promise
      return {
        message: 'Failed to remove events. Please try again after some time',
      };
    }
  },
);

export const getEventsAPICall = createAsyncThunk(
  'events/getEvent',
  async () => {
    //this callback is called as payload creator callback.
    let responseArr: EachEvent[] = [];
    try {
      await firestore()
        .collection(apiUrls.events)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(documentSnapshot => {
            let updatedObj = JSON.parse(
              JSON.stringify(documentSnapshot.data()),
            );
            updatedObj.eventId = documentSnapshot.id;
            responseArr.push(updatedObj);
          });
        });
      //return the resolved promise with data.
      return {responseData: responseArr, message: 'Event fetched successfully'};
    } catch (err) {
      //return rejected promise.
      return {
        message: 'Failed to fetch events. Please try again after some time',
      };
    }
  },
);
