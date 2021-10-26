import React ,{useEffect} from "react";
import { View,Image,Text} from "react-native";
 


export function  PhoneModalComponent(props){
   
 
  return(
                <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
                <View style={{flexDirection:"row",alignItems:"center"}}>
                 <Image source={props.image} style={{width:28,height:28}} /> 
                 <Text style={{color:props.color,fontSize:22,marginLeft:7}}>{props.countryCode}</Text>
                 </View>
                 <Text style={{color:props.color,fontSize:18,textTransform:"capitalize" }}>({props.country})</Text>
                </View>
               
    )
  }

  
   