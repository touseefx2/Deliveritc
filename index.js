import 'react-native-gesture-handler';
import React   from "react";
import {AppRegistry,LogBox,StatusBar} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { configure } from "mobx"
// import  store from "./src/store/Store/index" 
import messaging from '@react-native-firebase/messaging';
import PushNotification  from 'react-native-push-notification'
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import {showNotification} from "./src/services/Notification/showNotification"
import store from "./src/store/index"
import { Provider } from 'mobx-react';
import { create } from 'mobx-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

configure({ useProxies: "never" }) 
LogBox.ignoreAllLogs(true);
 

PushNotification.configure({ 
   
    onNotification: async function (notification) {
    console.log("onNOTIFICATION :", notification);

    let data=null;
    let title=notification.data.trip?"New Trip":notification.title;
    let msg=notification.message || ""



    if(!notification.data)
    {
        return 
    }

    if(notification.data)
    {
      data=notification.data; 
    }

   if(notification.userInteraction==false)
   {
    showNotification(title,msg)
   }

   if(notification.userInteraction==true )
  {
        console.log("ntfctn click")
   }
   
     if(title=="New Trip"){
       if(data && store.tripStore.request==false ){
        store.tripStore.getReqById(data.trip,"")
       }
     }
 
     if(title="Trip has been canceled."){
       if(store.tripStore.request!=false){
         store.tripStore.getReqById(store.tripStore.request._id,"check")
       }
      
     }

  notification.finish(PushNotificationIOS.FetchResult.NoData);
  // console.log('OK')
  },
 
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


const  hydrateStores= async()=> {
    const hydrate = create({ storage: AsyncStorage });
    await hydrate('userstore', store.userStore);
    await hydrate('tripstore', store.tripStore);
    await hydrate('carstore', store.carStore); 
}

function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }
  // {MainApp()}
}

function MainApp() {
  hydrateStores();
  return(
            <Provider  {...store}>
                <App/>
            </Provider>
      
            )
  }
    
AppRegistry.registerComponent(appName, () => MainApp);
 