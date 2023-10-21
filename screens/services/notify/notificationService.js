import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import {getItem, setItem} from '../storageServices';
import NotifService from './NotifService';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  console.log('Authorization status:', authStatus);
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    GetFCMToken();
  }
}

export async function GetFCMToken() {
  let fcmToken = await getItem('fcmToken');
  if (!fcmToken) {
    try {
      const FCM = await messaging().getToken();
      if (FCM) {
        console.log('NEW TOKEN', FCM);

        await setItem('fcmToken', FCM);
        NotificationListner();
      }
    } catch (error) {
      console.log('error', error);
    }
  } else {
    let oldToken = await getItem('fcmToken');
    NotificationListner();
    console.log('oldToken', oldToken);
  }
}

export async function NotificationListner() {
  const notifyService = new NotifService();
  messaging()
    .getInitialNotification()
    .then(async remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from background state:',
          remoteMessage,
        );

        notifyService.localNotif(remoteMessage);
      }
    });

  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
    notifyService.localNotif(remoteMessage);
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
        notifyService.localNotif(remoteMessage);
      }
    });

  messaging().onMessage(async ({notification}) => {
    notifyService.localNotif(notification);
    console.log('Notification on forground mode', notification);
  });
}
const ShowNotification = remoteMessage => {
  const details = {
    channelId: 'test',
    title: remoteMessage.notification.title,
    message: remoteMessage.notification.body,
  };
  PushNotification.localNotification(details);
};
