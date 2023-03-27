import database from '@react-native-firebase/database';

interface PushResponse {
    success: true | false;
    error?: any
}

type AddEventPushRequest = {
    eventId: string | number[];
    eventTitle: string;
    eventDate: string;
}

type PushRequest = AddEventPushRequest 

export const pushNewEntry = (url: string, data : PushRequest) : PushResponse  => {
  try {
    database().ref(url).push(data);
    return { success: true }
  } catch (error) {
    return { success: false, error: error }
  }
};
