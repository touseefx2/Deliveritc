import React  from "react";
import { View,StyleSheet,Image, TouchableOpacity,Text} from "react-native";
import { Window } from "../themes/Window";
import utils from "./index"
import { inject, observer } from "mobx-react"; 
import theme from "../themes/index"
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


export default inject("userStore","generalStore","carStore","tripStore")(observer(StackHeader));


  function StackHeader (props) {
 
    return(

<View style={{ height:hp("7%"),flexDirection:"row",alignItems:"center",width:"100%",borderBottomColor:"silver",borderBottomWidth:0.5,padding:10}}>
    
<TouchableOpacity style={{width:40,height:"100%"}}  onPress={()=>{props.p.navigation.goBack()}} >
<utils.vectorIcon.Ionicons style={{opacity:0.8}}  name="arrow-back-outline" size={30} color="black"   /> 
</TouchableOpacity>

{props.title!=""&&(
   <theme.Text   style={{fontSize:22,fontFamily:theme.fonts.fontMedium,color:"black",marginLeft:15}}> 
   {props.title} 
  </theme.Text>
)}

</View>
 

    )

   
   } 
   
      
 

 



const styles = StyleSheet.create({
                                  
    bell: {
      right:0,    
      position:"absolute",
 
    } ,
   image: {
        width: 40,
        height: 40,
        borderRadius: 20,
      //  borderWidth: 2,
      //  borderColor: "black",
      } ,
     
  })
  