 import {StyleSheet} from "react-native";
 import {Window}  from "../../themes/Window/index";
 import GV from "./Global_Var"
 import GVs from "../../store/Global_Var"
 import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

 export const styles = StyleSheet.create({
    container:{ flex: 1,backgroundColor:"white"},
    title1:{fontSize:24,color:"black",fontFamily:GVs.fontBold,marginTop:15},
    title2:{fontSize:16,color:"#9B9B9B",marginTop:15},
   
    inputContainer:{marginTop:40},

   title:{fontSize:GV.titleFontSize,color:GV.titleTextColor ,fontWeight:"bold",fontStyle:"italic"},
 
    Item:{borderRadius:4,height:44,padding:5},

    Input:{fontSize:GV.InputFieldFontSize},
   button1: {width:Window.Width-40, alignItems:"center",justifyContent:"center",borderRadius:4,height:45,alignSelf:"center"},
   button1Text:{color:GV.button1TextColor,fontWeight:"bold",fontSize:GV.button1FontSize,width:Window.Width-60}


 });
