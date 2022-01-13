import React, { useEffect }  from "react";
import { View,StyleSheet,Text} from "react-native";
import theme from "../themes/index";



export default function ToptMessage(props){
  
   if(props.screen!="Login"){
      return(
         <View style={{padding:2}}>
          <theme.Text style={{alignSelf:"center",color:"red",fontSize:13}}>{props.msg}</theme.Text>
          </View>
      )
   }else{
      return(
         <View style={{ }}>
          <theme.Text style={{alignSelf:"center",color:"red",fontSize:14}}>{props.msg}</theme.Text>
          </View>
      )
   }

}