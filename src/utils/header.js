import React  from "react";
import { View,StyleSheet,Image, TouchableOpacity,Text} from "react-native";
import { Window } from "../themes/Window";
import utils from "./index"
import { inject, observer } from "mobx-react"; 
import theme from "../themes/index"

export default  inject("store")(observer(Header));


  function Header (props) {

    const {deleteRoomInRooms,room,setRoomSort} = props.store;


  
  let type=props.type || ""
 

   if(type=="stack"){

    return(

<View style={{width:60}}>
<utils.vectorIcon.Ionicons  name="arrow-back-outline" size={40} color="black" onPress={()=>{
if(room.length>1){
  setRoomSort();
  }
    if(cm==0){
    deleteRoomInRooms(roomIndex)
    }
   
   props.nav.goBack()
   
  }} /> 
</View>

    )

    
   } 
    else {
    return(
      <View style={{backgroundColor:theme.color.AppHeaderColor,height:50,width:theme.window.Width,borderWidth:0.5,borderBottomColor:"#383838",borderTopColor:theme.color.AppHeaderColor ,justifyContent:"center",alignItems:"center"}}>
      
      {/* <TouchableOpacity onPress={()=>{props.nav.openDrawer()}}>
      <utils.vectorIcon.Ionicons  name="md-menu" size={40} color="#007069" onPress={()=>props.nav.openDrawer()} />
      </TouchableOpacity> */}
      
     
      <theme.Text style={{fontSize:20,color:"white",alignSelf:"center",fontFamily:theme.fonts.fontMedium}}>Galaxie</theme.Text>
      
        
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
  