import database from '@react-native-firebase/database';

interface PushResponse {
  success: true | false;
  error?: any;
  responseData?: string | number | boolean | object | null;
}

type AddEventPushRequest = {
  eventId: string | number[];
  eventTitle: string;
  eventDate: string;
};

type PushRequest = AddEventPushRequest;

export const pushNewEntry = (url: string, data: PushRequest): PushResponse => {
  try {
    database().ref(url).push(data);
    return {success: true};
  } catch (error) {
    return {success: false, error: error};
  }
};

export const getData = (url: string) => {
  try {
    database()
      .ref(url)
      .once('value')
      .then(snapshot => {
        let responseObj = snapshot.val();
        let responseArr = [];
        if (responseObj && Object.keys(responseObj).length > 0) {
          for (const key in responseObj) {
            responseArr.push(responseObj[key]);
          }
        }
        return {success: true, responseData: responseArr};
      })
      .catch(err => {
        return {success: false, error: err};
      });
  } catch (error) {
    return {success: false, error: error};
  }
};
