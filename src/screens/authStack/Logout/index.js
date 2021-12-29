import React, { Component, useEffect,useState } from "react";
import { View} from "react-native";
import utils from "../../../utils/index"
import AsyncStorage from '@react-native-async-storage/async-storage'
import { inject, observer } from "mobx-react"; 
import {fcmService} from "../../../services/Notification/FCMService" 
import {notificationManager} from "../../../services/Notification/NotificationManager" 
 
export default inject("userStore","generalStore","carStore")(observer(Logout));
 
 function Logout (props) {
 
const [loader,setloader]=useState(true);

// const {Logout} = props.userStore;

//when db use
//if user is online and logout so automtc offline time add in onlinetime array in db and then logout



    //  const  logoutcall = async () => {
        
    //         try {
    //             await AsyncStorage.removeItem('userData')
    //             setcars([])
    //             setuser("")
    //             settrip([])
    //             setrequest([])
    //             setloader(false)
    //             fcmService.unRegister();
    //             notificationManager.unRegister();
    //          } catch (e) {       
    //            console.log("logout error remove async storage  : ", e)
    //            setloader(false)
    //          }
             
    //   }
 
 
// useEffect(()=>{
//   setTimeout(() => {
//     logoutcall();
//   }, 600);   
// },[])
  
return(
<View >   
<utils.Loader loader={loader} />
   </View>
)
    

  }


 