import React   from "react";
import { Alert} from "react-native";
 
export   function AlertMessage(title,message){
    Alert.alert(
        title,
        message,
        [
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ]
      );
}



 