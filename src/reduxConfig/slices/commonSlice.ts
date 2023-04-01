import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import { EachEvent } from './eventsSlice';

type CommonState = {
    currentSelectedEvent: EachEvent | null;
};

const initialState: CommonState = {
  currentSelectedEvent: null
};

export const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setSelectedEvent: (state, action: PayloadAction<EachEvent>) => {
        state.currentSelectedEvent = JSON.parse(JSON.stringify(action.payload))
    }
  },
});

export const {setSelectedEvent} =
  commonSlice.actions;

export default commonSlice.reducer;
