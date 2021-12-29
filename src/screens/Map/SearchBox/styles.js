import React ,{useEffect,useRef,useState} from 'react';
import { Dimensions } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { justifyContent } from "styled-system";

var width = Dimensions.get("window").width; //full width

const styles = {
    searchBox:{
        top:12,
        paddingHorizontal:10,
        position:"absolute",
         width:wp("100%"),
        // backgroundColor:"yellow",
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between"
    },
    inputWrapper:{
        backgroundColor:"white",
        width:"60%",
        opacity:0.8,
        borderRadius:2,
        paddingHorizontal:5,
        height:40,
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center"
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