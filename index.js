import 'react-native-gesture-handler';
import React   from "react";
import {AppRegistry,LogBox,StatusBar} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { configure } from "mobx"
import { Provider } from 'mobx-react';
import  store from "./src/store/Store/index" 
import messaging from '@react-native-firebase/messaging';
import PushNotification  from 'react-native-push-notification'
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import {showNotification} from "./src/services/Notification/showNotification"
 
configure({ useProxies: "never" }) 
LogBox.ignoreAllLogs(true);
 

PushNotification.configure({ 
   
  onNotification: async function (notification) {
    console.log("onNOTIFICATION :", notification);

    if(!notification.data)
    {
        return 
    }

   if(notification.userInteraction==false)
   {
    showNotification(notification.title,notification.message )

      //only show ntfctn
      //  onOpenNotification(Platform.OS == "ios" ?  notification.data.item : notification)
   }

   if(notification.userInteraction==true )
  {
      //  onOpenNotification(Platform.OS == "ios" ?  notification.data.item : notification);
      console.log("ntfctn click")
        alert("click notfication :)")
   }
   
    // process the notification
   // only call calback if not from foreground
     // (required) Called when a remote is received or opened, or local notification is opened
  
 notification.finish(PushNotificationIOS.FetchResult.NoData);
 
    console.log('OK')
  },
  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  popInitialNotification: true,
  requestPermissions: true,

});
 
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('ntfctn fcm Message handled in the background!', remoteMessage);
  // showNotification(remoteMessage.notification.title,remoteMessage.notification.body )
});

function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }
  {MainApp()}
}

function MainApp() {
  return(
           <Provider  store={store}>
                <App/>
            </Provider>
      
            )
  }
    
AppRegistry.registerComponent(appName, () => MainApp);
 