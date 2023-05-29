# ReactNative-Intermediate-EventManagement
Event Management App

Demo Video 1 - https://drive.google.com/file/d/13OETteTDrtgWuZjW2zKO_B8iyoDpNia_/view?usp=share_link

Demo Video 2 - https://drive.google.com/file/d/1GTqznLrrSMyiQU5ndUTF6lGUjcJucSAP/view?usp=share_link

Motive of this app is to have one stop solution for all the event management for events like wedding, business seminars, birthdays, paid events/free events. Admin/host/organiser will be able to add/invite people to the events. This project is in progress.If you want to run, you can clone it directly. 

  Components included in the app: This app is currently supports Android mobiles. Soon we will add the support for IOS devices.

   1. Project is completely strictly type scoped by Typescript 
   2. React Native Firebase - Used firestore for database and quering data. Used authentication for signup,signin, logout, forgot password purpose. Used cloud storage for storing user's profile picture. Included pagination support.
   3. React navigation native stack , React Navigation Material bottom and top tabs - For screens, tabs and navigation of screens
   4. Redux Toolkit - This is the recommanded approach by react core team instead of just redux. This helps to reduce most of the boilerplate code for redux for gobal data/state management. This includes thunk middleware by default.
   5. React native Date Picker - For date and time input. 
   6. React Native Fast Image - This is improved wrapper for the Core Image Component. It includes better caching and performance.
   7. Recycler ListView - This is third party library by Flipcart for displaying the infinite list. It is better than core Flatlist component as it recycles the non visible views for displaying new views.This reduces expensive operation of creating new objects for new views and also avoid expensive garbage collection for old views.
   8. React-native-modal - Updated version of https://reactnative.dev/docs/modal. You can view sleek bottom half modal and center modal for various actions.
   9. React-native-async-storage - For storage of data to remember state of logged in user.
   10. React-native-image picker and React native permissions - To access the media storage of device.
   11. React-native-reanimated - This is a animated library by React Native. It has better performance than Animated API of React native as Animated API involves constant to and fro communication between UI and JS thread. Reanimated completely works on UI thread by utilizing the concept of worklets.
   12. React-native-image-resizer - Use to create different image sizes for different purposes. Also size of image can be reduced.
   13. React-native-google-signin - Used to integrate Google signin method.


  Current features in the app: 

   1. Create an new account, Sign-in to your account either using email and password, Logout.You can also directly use "Google Signin" And your account will be created for that email selected.
   2. After logged in - You can update email, password, Name, mobile number, profile picture. 
   3. Organise new event with event name, desc, date, time, location, fees(if any)
   4. View all the events at one place. We have used pagination here so that as user scroll down the list , next events will be loaded automatically. View event details by clicking on each event. You can also edit or delete the event.
   5. Add people to the event. You can edit them .You can also remove people from the event. 
   6. View all people added in event at one place. We have used pagination here so that as user scroll down the list, further list will be loaded automatically. People are divided into 3 tabs (All, people who have payment pending, people who have completed the payment). You can move users pending to completed and viceversa. You can create common lists of people to whom you invite frequently (max 200 people at once for now) and add to any event by selecting them from common lists.
   7. You can view app in light and dark mode both.
   8. You can create your own common lists of people and while adding people to any event you can select people from created common lists. You can also add users in bulk (max 200 for now) in common list. You can also update the common list and its users information.
   9. You can view your device contact list and add guest to any event from the list.




