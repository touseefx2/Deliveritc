import React ,{ } from 'react';
import theme from "../themes";
import LinearGradient from 'react-native-linear-gradient';
import {Text,StyleSheet,View,TouchableOpacity,Platform, StatusBar} from 'react-native';
import utils from "./index";;
import CardView from 'react-native-cardview'
 
export default function stackHeader(props){

    let screen=props.screen
    let title=props.title;
    let navigation=props.nav;
    let scrollY=props.scrollY;

    const goBack=()=>{

        
      
       

    }

    
 return(
  <CardView
  cardElevation={scrollY>0?6:0}
  cardMaxElevation={scrollY>0?6:0}>
           
           <LinearGradient  colors={[theme.color.mainColor,theme.color.mainColor]} style={styles.header}>
           
           <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",paddingHorizontal:15, paddingVertical:5,width:"100%"}}>

            <View style={{width:"10%"}}>
           <TouchableOpacity onPress={()=>{goBack()}}   > 
             <utils.vectorIcon.Ionicons name="arrow-back-sharp" color={theme.color.titleColor} size={35}/>  
             </TouchableOpacity> 
           </View>

             <View style={{width:"80%"}}>
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
          color:theme.color.titleColor,
          fontWeight:"600",
          textTransform:"capitalize",
          letterSpacing:0.5,
          lineHeight:28
      }
	  
})