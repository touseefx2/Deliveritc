import React ,{useEffect,useRef,useState} from 'react';
import { Dimensions } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
 
const styles = {
       Box:{
        bottom:0,
         width:wp("100%"),
         padding:10,
        position:"absolute",
        backgroundColor:"white",
        alignItems:"center",
        justifyContent:"center"
    },
    inputWrapper:{
        backgroundColor:"white",
        width:"70%",
        opacity:0.8,
        borderRadius:2,
        height:40,
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-evenly"
    },
    
    inputSearch:{
        fontSize:13,
        width:"75%",
        borderWidth:0
    },
    label:{
        fontSize:10,
        fontStyle: "italic",
        marginLeft:10,
        marginTop:10,
        marginBottom:0
    }
};

export default styles;