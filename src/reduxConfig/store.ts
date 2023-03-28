import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import eventsReducer from './slices/eventsSlice'

export const store = configureStore({
    reducer: {
      events: eventsReducer
    },
  })


type RootState = ReturnType<typeof store.getState> 

export const useAppDispatch: () => typeof store.dispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector