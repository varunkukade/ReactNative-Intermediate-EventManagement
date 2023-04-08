# ReactNative-Intermediate-EventManagement
Event Management App

Motive of this app is to have one stop solution for all the event management for events like wedding, business seminars, birthdays, paid events/free events. Admin/host/organiser will be able to add/invite people to the events. This project is in progress.If you want to run, you can clone it directly. 

  Components included in the app: 

   1. Project is completely strictly type scoped by Typescript 
   2. React Native Firebase - firestore, authentication.
   3. React navigation native stack , React Navigation Material bottom and top tabs - For screens, tabs and navigation of screens
   4. Redux Toolkit - This is the recommanded approach by react core team instead of just redux. This helps to reduce most of the boilerplate code for redux for gobal data/state management. This includes thunk middleware by default.
   5. React native Date Picker - For date and time input. 
   6. React Native Fast Image - This is improved wrapper for the Core Image Component. It includes better caching and performance.
   7. Recycler ListView - This is third party library by Flipcart for displaying the infinite list. It is better than core Flatlist component as it recycles the non visible views for displaying new views.This reduces expensive operation of creating new objects for new views and also avoid expensive garbage collection for old views.
   8. React-native-modal - Updated version of https://reactnative.dev/docs/modal. You can view sleek bottom half modal and center modal for various actions.
   9. React-native-async-storage - For storage of data to remember state of logged in user.


  Current features in the app: 

   1. Create an new account - Signup.
   2. After logged in - add new event with event name, desc, date, time, location, fees(if any)
   2. View all the events at one place. View event details by clicking on each event. You can also delete the event.
   4. Add people to the event. Delete added people from the event.
   5. View all people added in event at one place. People are divided into 3 tabs (All people, people who have payment pending, people who have payement completed). 
   6. You can move users in tab from pending to completed and viceversa. You can also remove the users from that event.
