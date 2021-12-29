import React ,{ } from 'react';
import theme from "../themes";
import LinearGradient from 'react-native-linear-gradient';
import {Text,StyleSheet,View,TouchableOpacity,Platform, StatusBar} from 'react-native';
import utils from "./index";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import CardView from 'react-native-cardview'


export default function drawerHeader(props){

    let screen=props.screen
    let title=props.title;
    let navigation=props.nav;
    let scrollY=props.scrollY;

    const onClick=()=>{
         navigation.openDrawer();
    }

    
 return(
  <CardView
  cardElevation={scrollY>0?6:0}
  cardMaxElevation={scrollY>0?6:0}>
           
           <LinearGradient  colors={[theme.color.bc1,theme.color.bc2]} style={styles.header}>
           
           <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",padding:10,width:"100%"}}>

            <TouchableOpacity style={{width:"10%"}} onPress={()=>{onClick()}} > 
             <utils.vectorIcon.Ionicons name="ios-menu" color={theme.color.mainColor} size={30}/>  
            </TouchableOpacity> 
          
             <View style={{width:"85%"}}>
             <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>{title}</Text>
             </View>  

             </View>  
             
             </LinearGradient>

  </CardView>
        
          )
    }
   
   
  


  const styles = StyleSheet.create({
	header: {
		    width:"100%",
        marginTop:Platform.OS=="ios"?theme.window.statusBarHeight:0,
	  },
      title:{
          fontSize:22,
          color:theme.color.mainColor,
          fontWeight:"600",
          textTransform:"capitalize",
          letterSpacing:0.5,
          lineHeight:28
       
      }
	  
})