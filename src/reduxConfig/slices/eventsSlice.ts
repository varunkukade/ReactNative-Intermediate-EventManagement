import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import apiUrls from '../apiUrls';
import auth from '@react-native-firebase/auth';
import {PAGINATION_CONSTANT} from '../../utils/constants';
import {RootState, store} from '../store';

export type MessageType = {
  message: string;
  failureType?: 'failure';
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
  createdBy: string;
};

type EventsState = {
  events: EachEvent[];
  lastFetchedEventId: string;
  currentSelectedEvent: EachEvent | null;
  statuses: {
    addEventAPICall: status;
    getEventAPICall: status;
    removeEventAPICall: status;
    getNextEventsAPICall: status;
    updateEventAPICall: status;
  };
  loadingMessage: string;
};

const initialState: EventsState = {
  events: [],
  lastFetchedEventId: 'null',
  currentSelectedEvent: null,
  statuses: {
    addEventAPICall: 'idle',
    getEventAPICall: 'idle',
    removeEventAPICall: 'idle',
    getNextEventsAPICall: 'idle',
    updateEventAPICall: 'idle'
  },
  loadingMessage: '',
};

export const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    reset: () => initialState,
    setSelectedEvent: (state, action: PayloadAction<EachEvent>) => {
      state.currentSelectedEvent = JSON.parse(JSON.stringify(action.payload));
    },
    setLastFetchedEventId: (state, action: PayloadAction<string>) => {
      state.lastFetchedEventId = JSON.parse(JSON.stringify(action.payload));
    },
  },
  extraReducers(builder) {
    builder
      .addCase(addEventAPICall.pending, (state, action) => {
        state.loadingMessage = 'Creating New Event';
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
        const currentUser = auth().currentUser;
        state.events.length = 0;
        if (action.payload.responseData.length > 0) {
          state.events = JSON.parse(
            JSON.stringify(
              action.payload.responseData.filter(
                eachEvent => eachEvent.createdBy === currentUser?.uid,
              ),
            ),
          );
        }
        state.statuses.getEventAPICall = 'succeedded';
      })
      .addCase(getEventsAPICall.rejected, (state, action) => {
        state.statuses.getEventAPICall = 'failed';
      })
      .addCase(getNextEventsAPICall.pending, (state, action) => {
        state.statuses.getNextEventsAPICall = 'loading';
      })
      .addCase(getNextEventsAPICall.fulfilled, (state, action) => {
        if (action.payload.responseData.length > 0) {
          state.events = state.events.concat(
            action.payload.responseData.filter(
              eachEvent => eachEvent.createdBy === auth().currentUser?.uid,
            ),
          );
        }
        state.statuses.getNextEventsAPICall = 'succeedded';
      })
      .addCase(getNextEventsAPICall.rejected, (state, action) => {
        state.statuses.getNextEventsAPICall = 'failed';
      })
      .addCase(removeEventAPICall.pending, (state, action) => {
        state.loadingMessage = 'Deleting the Event';
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
      })
      .addCase(updateEventAPICall.pending, (state, action) => {
        state.loadingMessage = 'Updating the Event';
        state.statuses.updateEventAPICall = 'loading';
      })
      .addCase(updateEventAPICall.fulfilled, (state, action) => {
        const {eventTitle, eventDesc, eventDate, eventFees, eventLocation, eventTime } = action.meta.arg.newUpdate;
        state.events = state.events.map(eachEvent => {
          if (eachEvent.eventId === action.meta.arg.eventId) {
              eachEvent.eventTitle = eventTitle;
              eachEvent.eventDesc = eventDesc;
              eachEvent.eventDate = eventDate;
              eachEvent.eventFees = eventFees;
              eachEvent.eventLocation = eventLocation;
              eachEvent.eventTime = eventTime;
            return eachEvent;
          } else return eachEvent;
        });
        state.statuses.updateEventAPICall = 'succeedded';
      })
      .addCase(updateEventAPICall.rejected, (state, action) => {
        state.statuses.updateEventAPICall = 'failed';
      });
  },
});

export default eventsSlice.reducer;
export const {
  setSelectedEvent,
  reset: resetEventState,
  setLastFetchedEventId,
} = eventsSlice.actions;

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
      .orderBy('eventDate', 'desc')
      .limit(PAGINATION_CONSTANT)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          let updatedObj = JSON.parse(JSON.stringify(documentSnapshot.data()));
          updatedObj.eventId = documentSnapshot.id;
          responseArr.push(updatedObj);
        });
        thunkAPI.dispatch(
          setLastFetchedEventId(responseArr[responseArr.length - 1].eventId),
        );
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

export type SuccessType = {
  responseData: EachEvent[];
  message: string;
  successMessagetype: 'moreEventsExist' | 'noMoreEvents';
};
export const getNextEventsAPICall = createAsyncThunk<
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
>('events/getNextEvents', async (_, {dispatch, getState, rejectWithValue}) => {
  //this callback is called as payload creator callback.
  let responseArr: EachEvent[] = [];
  try {
    let lastDocFetched = await firestore()
      .collection(apiUrls.events)
      .doc(getState().events.lastFetchedEventId)
      .get();
    return await firestore()
      .collection(apiUrls.events)
      .orderBy('eventDate', 'desc')
      .startAfter(lastDocFetched)
      .limit(PAGINATION_CONSTANT)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          let updatedObj = JSON.parse(JSON.stringify(documentSnapshot.data()));
          updatedObj.eventId = documentSnapshot.id;
          responseArr.push(updatedObj);
        });
        if (responseArr.length > 0) {
          dispatch(
            setLastFetchedEventId(responseArr[responseArr.length - 1].eventId),
          );
          //return the resolved promise with data.
          return {
            responseData: responseArr,
            message: 'Event fetched successfully',
            successMessagetype: 'moreEventsExist',
          } as SuccessType;
        } else {
          //return the resolved promise with data.
          return {
            responseData: [],
            message: 'No More Events',
            successMessagetype: 'noMoreEvents',
          } as SuccessType;
        }
      });
  } catch (err) {
    //return rejected promise from payload creator
    return rejectWithValue({
      message: 'Failed to fetch more events. Please try again after some time',
      failureType: 'failure',
    } as MessageType);
  }
});

export const updateEventAPICall = createAsyncThunk<
  //type of successfull returned obj
  {
    message: string;
  },
  //type of request obj passed to payload creator
  {newUpdate: Omit<EachEvent, 'eventId'>; eventId: string},
  //type of returned error obj from rejectWithValue
  {
    rejectValue: MessageType;
  }
>(
  'events/updateEvent',
  async (
    requestObject: {newUpdate: Omit< EachEvent, 'eventId'> ; eventId: string},
    thunkAPI,
  ) => {
    try {
      return await firestore()
        .collection(apiUrls.events)
        .doc(requestObject.eventId)
        .update(requestObject.newUpdate)
        .then(res => {
          return {message: 'Event updated successfully'};
        });
    } catch (err) {
      console.log(err)
      //return rejected promise.
      return thunkAPI.rejectWithValue({
        message: 'Failed to update event. Please try again after some time',
      } as MessageType);
    }
  },
);
