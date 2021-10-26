import React from "react";
import { View,Text} from "react-native";
import theme from "../themes/index";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

 function  ShowEmptyRecords(msg,style){
    return(
       <View style={style}>
         <theme.Text style={{fontSize:18,color:theme.color.mainPlaceholderColor,alignSelf:"center"}}>{msg}</theme.Text>
       </View>
      
    )
 }

 export default message =  {
     ShowEmptyRecords
 }