import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { EventsReducer, PeopleReducer, CommonReducer, UserReducer} from './slices'

export const store = configureStore({
    reducer: {
      events: EventsReducer,
      people: PeopleReducer,
      common: CommonReducer,
      user: UserReducer
    },
  })


type RootState = ReturnType<typeof store.getState> 

export const useAppDispatch: () => typeof store.dispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector