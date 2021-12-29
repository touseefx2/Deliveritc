import React, { useEffect }  from "react";
import { View,StyleSheet,Text} from "react-native";
import utils from "./index"
import GVs from "../stores/Global_Var";
import { inject, observer } from "mobx-react"; 


export default  inject("store")(observer(HeaderTitle));

   function HeaderTitle (props) {
   
    let title= props.title || ""
    let type=props.type || ""
    let sid = props.sid || ""
    let st=props.st || ""

    const {allSup} = props.store;

    let sname="";

    if(allSup.length>0){
      allSup.map((e,i,a)=>{
       if(sid==e.id){
        let fn  =  e.FirstName || ""
        let ln  =   e.LastName || ""
         sname= fn+" "+ln 
       }
      })
    }
 

    title=utils.strLength(title,type=="welcomemessage"?"welcomeName":"title")
    let screen=props.screen || ""
    let message= props.message || ""

    message=utils.strLength(message,"tasknameS")

    if(screen!=""){
      screen= utils.strLength(screen,"submitscreentasktitle")
    }


    if ( type=="welcomemessage"){

        return(
       
            <View style={styles.welcome} >
           
            
            <Text style={styles.title}>Hello</Text>
           
            <Text style={[styles.title,{fontFamily:GVs.fontBold,fontSize:30,flexShrink:1}]}>{title}</Text>
             
         
            </View>
        
        
    )


    }else if(type=="headertitle") 
    {

        return(
        
            <View style={styles.welcome} >
            
            
            <Text style={[styles.title,{fontSize: title.length>20?25:30,fontFamily:GVs.fontBold}]}>{title}</Text>
           
          {message!=="" &&<Text style={[styles.title,{color:"#9B9B9B",fontSize:16,flexShrink:1}]}>{message}</Text>}  
          {sid!=="" &&<Text style={[styles.title,{color:"#9B9B9B",fontSize:16,flexShrink:1,textTransform:"capitalize"}]}>Supervised By {sname}</Text>}  
          {st!=="" &&<Text style={[styles.title,{color:"#9B9B9B",fontSize:16,flexShrink:1,textTransform:"capitalize"}]}>{st}</Text>}      
         
            </View>
        
        
    )

    }
  
}

 const styles = StyleSheet.create({
    welcome:
     {
      backgroundColor:null,
       marginTop:20
    },
    titleBox:
    {
     backgroundColor:null,
     marginBottom:"2%"
   },
    logo: {
      width: 50,
      height: 50,
     resizeMode:"contain",
     opacity:0.8
    } ,
    
  
    title:{
        flexShrink:1, 
        textTransform:"capitalize",
        color:"black"
      },
  
  
 });
 