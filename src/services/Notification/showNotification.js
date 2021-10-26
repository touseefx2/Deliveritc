 import PushNotification , {Importance} from 'react-native-push-notification'

 export const showNotification =(title,message )=>{
 
        //if schedule mesgae send chanel must creat deafault or custom and add files inmanifest must see document
   
      PushNotification.createChannel(
        {
          channelId: "default-channel-id", // (required)
          channelName: `Default channel`, // (required)
          channelDescription: "A default channel", // (optional) default: undefined.
          sound:"ios_notification.mp3",
          soundName: "notification.mp3", // (optional) See `soundName` parameter of `localNotification` function
          importance: Importance.HIGH, // (optional) default: 4. Int value of the Android notification importance
          vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
           foreground: true, // BOOLEAN: If the notification was received in foreground or not
          
        },
        (created) => console.log(`createChannel 'default-channel-id' returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
      );

      PushNotification.localNotification({
         channelId:"default-channel-id",
         showWhen:true,
         soundName: "notification.mp3",
         playSound: true,
         when:new Date(),
         ignoreInForeground: false,
         message: title,
         title:   message,
         foreground: true, // BOOLEAN: If the notification was received in foreground or not
        
    });
 


}

 