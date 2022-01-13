import React  from "react"
import { View,Text,Image,StyleSheet,TouchableOpacity, ScrollView} from "react-native";
import { DrawerContentScrollView,DrawerItemList} from '@react-navigation/drawer';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import theme from "../../themes/index"; 
import { inject, observer } from "mobx-react"; 

export default inject("userStore","generalStore","carStore")(observer(CustomDrawerContent));
 
function CustomDrawerContent (props) {
   
 
  const {user,Logout }=props.userStore;
  const {cars,setCars }=props.carStore;
   
const { state,...rest } = props;

const newState = { ...state}  //copy from state before applying any filter. do not change original state
// newState.routes = newState.routes.filter(item => (item.name !== 'Logout' && item.name !=="Rate" && item.name !=="Notification")) //replace "Login' with your route name
 
   let  carnum=cars.registration_number
   

   const onClick=(c)=>{
    
     if(c=="logout"){
      setCars(false) 
      Logout();
     }

    if(c=="rate"){
      props.navigation.closeDrawer();
    }
   }



    return(  
      <View   style={{flex:1,backgroundColor:theme.color.buttonLinerGC1}} >

<View style={{height:hp("94%")}}>
  
        <DrawerContentScrollView 
        showsVerticalScrollIndicator={false}
        style={{padding:10}} >

<View style={{flexDirection:"row",alignItems:"center"}}>

<View style={{width:90,height:90,borderColor:"white",borderRadius:45,borderWidth:1,backgroundColor:theme.color.buttonLinerGC1,alignItems:"center",justifyContent:"center"}}>
 <Image  style={{width:89,height:89,borderRadius:44}}  source={{uri:user.profile_image}} />
</View>

 
<View style={{width:"63%",marginLeft:7 }}> 
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:18,fontFamily:theme.fonts.fontMedium,textTransform:"capitalize",lineHeight:28,color:"white"}}> 
{user.fullname}
 </theme.Text>  
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:16,color:theme.color.mainPlaceholderColor,textTransform:"capitalize",lineHeight:26}}> 
  {carnum}
 </theme.Text>
 </View>

 

 </View>


<Text style={{fontSize:12,color:"white",marginLeft:15,marginTop:"12%"}}>DASHBOARD</Text>

<View style={{marginTop:"6%"}}>

<View  style={{width:"90%",height:0.5,backgroundColor:"white",alignSelf:"center",marginBottom:10}} />
    
 <DrawerItemList    state={newState} {...rest} />
     
  
<View  style={{width:"90%",height:0.5,backgroundColor:"white",marginTop:"6%",marginBottom:10,alignSelf:"center"}} />
 
                         <TouchableOpacity 
                            style={styles.drawerItem} 
                            onPress={() => { onClick("rate")}} >
                             <Image 
                              style={{width:22,height:22}}
                              resizeMode="contain"
                              source={require("../../assets/drawer_items_icon/star.png")}
                              />
                            <Text style={{fontSize:14,color:"white",marginLeft:30}}>Rate the app</Text>                    
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={[styles.drawerItem,{marginBottom:10}]} 
                            onPress={() => { onClick("logout")}}>
                             <Image 
                              style={{width:22,height:22}}
                              resizeMode="contain"
                              source={require("../../assets/drawer_items_icon/exit.png")}
                              />
                            <Text style={{fontSize:14,color:"white",marginLeft:30}}>Sign out</Text>                    
                        </TouchableOpacity>
  
  </View>

  

        </DrawerContentScrollView>
</View>
      
      
        <View style={{ height:hp("6%"),justifyContent:"center",alignItems:"center",paddingLeft:10,paddingRight:10}}>
         <View style={{flexDirection:"row",justifyContent:"space-between",width:"100%"}}>
        <Text style={{fontSize:12,color:"white",marginLeft:15}}>Legal</Text>
        <Text style={{fontSize:12,color:"white",marginLeft:15}}>Version 1.0</Text>
         </View>
        </View>
   
        

        </View>
                                   );
                               

}


const styles = StyleSheet.create({
                                  
   
  image:{width:104,height:99},
  name:{fontSize:15.5,fontWeight:"bold",color:"white",textTransform:"capitalize"},
  drawerItem:{ 
  flexDirection: 'row',
  width: '100%',
  height: 50,
  alignItems: 'center',
  paddingLeft: 15}
})

 
 