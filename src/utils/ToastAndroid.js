import {  ToastAndroid} from "react-native";

 
  const ToastAndroid_SB=(msg)=>{
    ToastAndroid.showWithGravity(
    msg,
     ToastAndroid.SHORT,
     ToastAndroid.BOTTOM)
     }

    const ToastAndroid_LB=(msg)=>{
        ToastAndroid.showWithGravity(
        msg,
         ToastAndroid.LONG,
         ToastAndroid.BOTTOM)
         }
       
         const ToastAndroid_LBC=(msg)=>{
          ToastAndroid.showWithGravity(
          msg,
           ToastAndroid.LONG,
           ToastAndroid.CENTER)
           }

         const ToastAndroid_SBC=(msg)=>{
          ToastAndroid.showWithGravity(
          msg,
           ToastAndroid.SHORT,
           ToastAndroid.CENTER)
           
          
          }

          const ToastAndroid_SBT=(msg)=>{
            ToastAndroid.showWithGravity(
            msg,
             ToastAndroid.SHORT,
             ToastAndroid.TOP)
             }

      

         export default {
             ToastAndroid_SB,
             ToastAndroid_SBC,
             ToastAndroid_SBT,
             ToastAndroid_LBC,
             ToastAndroid_LB
         }

         