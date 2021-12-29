import React, { useEffect }  from "react";
import { View,StyleSheet,Text} from "react-native";
import theme from "../themes/index";
import LinearGradient from 'react-native-linear-gradient';


export default function topMessage(props){
  
   const style={paddingVertical:4,paddingHorizontal:10}
   const textStyle={alignSelf:"center",fontWeight:"400",color:theme.color.errorColor,fontSize:14}

   return(
      <LinearGradient  colors={[theme.color.mainColor,theme.color.mainColor]} style={style}>
       <Text style={textStyle}>{props.msg}</Text>
      </LinearGradient>
      
   )
}