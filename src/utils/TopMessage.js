import React, { useEffect }  from "react";
import { View,StyleSheet,Text} from "react-native";
import theme from "../themes/index";



export default function ToptMessage(props){
  
   return(
      <View style={{backgroundColor:"black",padding:2}}>
       <theme.Text style={{alignSelf:"center",color:"white",fontSize:14}}>{props.msg}</theme.Text>
       </View>
   )
}