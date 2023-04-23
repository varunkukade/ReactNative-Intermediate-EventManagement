# ReactNative-Intermediate-EventManagement
Event Management App

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


App Screenshots:

Demo Videos link as of 14th april = 
Prelogin - https://drive.google.com/file/d/1FlNpAaVBOzX8EZfqhWTinHW7aCw0koFe/view?usp=share_link

Postlogin - https://drive.google.com/file/d/1Htr9Mzg6Acr4UsndDgr72F29mjU_EqyK/view?usp=share_link


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

Update the profile
https://user-images.githubusercontent.com/66090579/230950059-4e4021b3-fcd9-497f-a59f-edc1700000cb.png

Logout the user from the app
https://user-images.githubusercontent.com/66090579/230915042-e929c808-46aa-4b00-9379-93683e41c870.png



