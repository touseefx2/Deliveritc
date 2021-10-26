import React   from "react";
import { View,Image} from "react-native";
import theme from "../themes/index"

export function FlagIcon (props){

    let countryCode=props.countryCode || ""
     let image=""

    if(countryCode=="+92")
    image=require('../assets/flag/pk.png')
    if(countryCode=="+91")
    image=require('../assets/flag/ind.png')
    if(countryCode=="+84")
    image=require('../assets/flag/vtn.png')
    if(countryCode=="+374")
    image=require('../assets/flag/armn.png')



return(

     <Image style={{width:25,height:25}} source={image} />
)
}