import React  from "react";
import { View,StyleSheet,Image, TouchableOpacity,Text} from "react-native";
import { Window } from "../themes/Window";
import utils from "./index"
import { inject, observer } from "mobx-react"; 
import theme from "../themes/index"
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


export default inject("userStore","generalStore","carStore","tripStore")(observer(DrawerHeader));


  function DrawerHeader (props) {

 if(props.title!=""){
  return(

    <View style={{ height:hp("5%"),flexDirection:"row",alignItems:"center",width:"100%" }}>
        
    
    <TouchableOpacity style={{width:"10%",height:"100%" }}  onPress={()=>{props.p.navigation.openDrawer()}} >
    <utils.vectorIcon.Ionicons  name="md-menu" size={30} color="black" />
    </TouchableOpacity>
    
       <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:22,fontFamily:theme.fonts.fontMedium,color:"black",marginLeft:15,width:"85%",lineHeight:35}}> 
          {props.title} 
         </theme.Text>
    
    
    </View>
    
        )
 }   else{
  return(

    <View style={{ height:hp("5%"),flexDirection:"row",alignItems:"center",width:"100%",justifyContent:"space-between"}}>
        
        
    <TouchableOpacity style={{width:"10%",height:"100%"}}  onPress={()=>{props.p.navigation.openDrawer()}} >
    <utils.vectorIcon.Ionicons  name="md-menu" size={30} color="black" />
    </TouchableOpacity>

<View style={{flexDirection:"row",alignItems:"center"}}>

 
  <TouchableOpacity
   onPress={()=>{props.p.navigation.navigate("Profile")}}
  style={{flexDirection:"row",alignItems:"center"}}>
  <utils.vectorIcon.AntDesign  name="user" size={20} color={theme.color.buttonLinerGC1}/>
      <theme.Text   style={{fontSize:15,fontFamily:theme.fonts.fontMedium,color:"black",marginLeft:3}}> 
          Profile 
       </theme.Text>
  </TouchableOpacity> 
   
   
  <TouchableOpacity
   onPress={()=>{props.p.navigation.navigate("Tripstack")}}
  style={{flexDirection:"row",alignItems:"center",marginLeft:20}}>
    <utils.vectorIcon.Fontisto  name="car" size={20} color={theme.color.buttonLinerGC1}/>
      <theme.Text   style={{fontSize:15,fontFamily:theme.fonts.fontMedium,color:"black",marginLeft:3}}> 
          Trips 
       </theme.Text>
  </TouchableOpacity> 

  </View>

    </View>
    

        )

 }
 

   
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
  