# ReactNative-Intermediate-EventManagement
Event Management App

Motive of this app is to have one stop solution for all the event management for events like wedding, business seminars, birthdays, paid events/free events. Admin/host/organiser will be able to add/invite people to the events. This project is in progress.If you want to run, you can clone it directly. 

  Components included in the app: This app is currently supports Android mobiles. Soon we will add the support for IOS devices.

   1. Project is completely strictly type scoped by Typescript 
   2. React Native Firebase - firestore for database and quering data, authentication for signup, signin, logout, forgot password purpose.
   3. React navigation native stack , React Navigation Material bottom and top tabs - For screens, tabs and navigation of screens
   4. Redux Toolkit - This is the recommanded approach by react core team instead of just redux. This helps to reduce most of the boilerplate code for redux for gobal data/state management. This includes thunk middleware by default.
   5. React native Date Picker - For date and time input. 
   6. React Native Fast Image - This is improved wrapper for the Core Image Component. It includes better caching and performance.
   7. Recycler ListView - This is third party library by Flipcart for displaying the infinite list. It is better than core Flatlist component as it recycles the non visible views for displaying new views.This reduces expensive operation of creating new objects for new views and also avoid expensive garbage collection for old views.
   8. React-native-modal - Updated version of https://reactnative.dev/docs/modal. You can view sleek bottom half modal and center modal for various actions.
   9. React-native-async-storage - For storage of data to remember state of logged in user.


  Current features in the app: 

   1. Create an new account, Sign-in to existing account, Forgot password, Logout.
   2. After logged in - Organise new event with event name, desc, date, time, location, fees(if any)
   2. View all the events at one place. View event details by clicking on each event. You can also delete the event.
   4. Add people to the event. Delete added people from the event.
   5. View all people added in event at one place. People are divided into 3 tabs (All people, people who have payment pending, people who have payement completed). 
   6. You can move users in tab from pending to completed and viceversa. You can also remove the people from that event.

App Screenshots: (If any color design mismatches in UI please ignore. I am Not very good at designing the ui😅)

Signup Screen
https://user-images.githubusercontent.com/66090579/230915105-4293b034-b038-4f44-9e71-7f73df45970b.png

Login Screen
https://user-images.githubusercontent.com/66090579/230915102-7afb96ad-ea9c-4718-a815-18c8c49138c4.png

Forgot password Screen 
https://user-images.githubusercontent.com/66090579/230915096-11a2716d-ce06-49c2-a016-d8e599d257cd.png

Landing dashboard 
https://user-images.githubusercontent.com/66090579/230915093-b66f49da-5493-4c1f-b0ef-f372850332d4.png

Add new event screen 
https://user-images.githubusercontent.com/66090579/230915090-1179f6cb-c2f3-4206-8905-cb252772f60a.png
https://user-images.githubusercontent.com/66090579/230915087-bea6eeaa-7963-4372-9817-3f94fab9e1b9.png

Specific Event Details 
https://user-images.githubusercontent.com/66090579/230915083-56e5cf3a-e045-41c1-8ce0-80337a8ef933.png

Add new people to specific event
https://user-images.githubusercontent.com/66090579/230915080-de9320da-b148-4762-8d5a-f248fc31bcc8.png

View all added people at one place 
https://user-images.githubusercontent.com/66090579/230915076-21ba39b1-70c7-4fce-a6ff-579fce5fcd93.png

You can delete, move users to completed/pending tabs
https://user-images.githubusercontent.com/66090579/230915072-010970b7-d0b5-4b2b-b214-6001d0e3e072.png

Popup/modal for specific action confirmation
https://user-images.githubusercontent.com/66090579/230915064-e8ccfc85-e1c2-44b1-989a-2281e79f35dc.png

Settings screen
https://user-images.githubusercontent.com/66090579/230915054-7e7ca411-1506-444e-ad7f-916302afe395.png

Logout the user from the app
https://user-images.githubusercontent.com/66090579/230915042-e929c808-46aa-4b00-9379-93683e41c870.png

Logout Video 
https://user-images.githubusercontent.com/66090579/230918247-de4f6446-2ec8-4661-b5a7-41624125e2b7.mov


