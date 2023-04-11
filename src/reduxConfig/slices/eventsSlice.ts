import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';
import apiUrls from '../apiUrls';
import auth from '@react-native-firebase/auth';

export type MessageType = {
  message: string;
};

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
  createdBy: string
};

type EventsState = {
  events: EachEvent[];
  currentSelectedEvent: EachEvent | null;
  statuses: {
    addEventAPICall: status;
    getEventAPICall: status;
    removeEventAPICall: status;
  };
  loadingMessage: string;
};

const initialState: EventsState = {
  events: [],
  currentSelectedEvent: null,
  statuses: {
    addEventAPICall: 'idle',
    getEventAPICall: 'idle',
    removeEventAPICall: 'idle',
  },
  loadingMessage: ''
};

export const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setSelectedEvent: (state, action: PayloadAction<EachEvent>) => {
      state.currentSelectedEvent = JSON.parse(JSON.stringify(action.payload));
    },
  },
  extraReducers(builder) {
    builder
      .addCase(addEventAPICall.pending, (state, action) => {
        state.loadingMessage = 'Creating New Event'
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
        const currentUser = auth().currentUser
        state.events.length = 0;
        if (action.payload.responseData) {
          state.events = JSON.parse(
            JSON.stringify(action.payload.responseData.filter((eachEvent) => eachEvent.createdBy === currentUser?.uid)),
          );
        }
        state.statuses.getEventAPICall = 'succeedded';
      })
      .addCase(getEventsAPICall.rejected, (state, action) => {
        state.statuses.getEventAPICall = 'failed';
      })
      .addCase(removeEventAPICall.pending, (state, action) => {
        state.loadingMessage = 'Deleting the Event'
        state.statuses.removeEventAPICall = 'loading';
      })
      .addCase(removeEventAPICall.fulfilled, (state, action) => {
        state.events = state.events.filter(
          eachEvent => eachEvent.eventId !== action.meta.arg.eventId,
        );
        state.statuses.removeEventAPICall = 'succeedded';
      })
      .addCase(removeEventAPICall.rejected, (state, action) => {
        state.statuses.removeEventAPICall = 'failed';
      });
  },
});

export default eventsSlice.reducer;
export const {setSelectedEvent} =
  eventsSlice.actions;

export const addEventAPICall = createAsyncThunk<
  //type of successfull returned obj
  {
    message: string;
  },
  //type of request obj passed to payload creator
  Omit<EachEvent, 'eventId'>,
  //type of returned error obj from rejectWithValue
  {
    rejectValue: MessageType;
  }
>(
  'events/addEvent',
  async (requestObject: Omit<EachEvent, 'eventId'>, thunkAPI) => {
    try {
      return await firestore()
        .collection(apiUrls.events)
        .add(requestObject)
        .then(res => {
          return {message: 'Event added successfully'};
        });
    } catch (err) {
      //return rejected promise.
      return thunkAPI.rejectWithValue({
        message: 'Failed to add event. Please try again after some time',
      } as MessageType);
    }
  },
);

export const removeEventAPICall = createAsyncThunk<
  //type of successfull returned obj
  {
    message: string;
  },
  //type of request obj passed to payload creator
  {
    eventId: string;
  },
  //type of returned error obj from rejectWithValue
  {
    rejectValue: MessageType;
  }
>('people/removeEvent', async (requestObj: {eventId: string}, thunkAPI) => {
  try {
    return await firestore()
      .collection(apiUrls.events)
      .doc(requestObj.eventId)
      .delete()
      .then(res => {
        return {message: 'Event removed successfully'};
      });
  } catch (err) {
    //return rejected promise
    return thunkAPI.rejectWithValue({
      message: 'Failed to remove events. Please try again after some time',
    } as MessageType);
  }
});

export const getEventsAPICall = createAsyncThunk<
  //type of successfull returned obj
  {
    responseData: EachEvent[];
    message: string;
  },
  //type of request obj passed to payload creator
  undefined,
  //type of returned error obj from rejectWithValue
  {
    rejectValue: MessageType;
  }
>('events/getEvent', async (_, thunkAPI) => {
  //this callback is called as payload creator callback.
  let responseArr: EachEvent[] = [];
  try {
    return await firestore()
      .collection(apiUrls.events)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          let updatedObj = JSON.parse(JSON.stringify(documentSnapshot.data()));
          updatedObj.eventId = documentSnapshot.id;
          responseArr.push(updatedObj);
        });
        //return the resolved promise with data.
        return {
          responseData: responseArr,
          message: 'Event fetched successfully',
        };
      });
  } catch (err) {
    //return rejected promise from payload creator
    return thunkAPI.rejectWithValue({
      message: 'Failed to fetch events. Please try again after some time',
    } as MessageType);
  }
});
