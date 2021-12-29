import React   from "react";
import { View,ActivityIndicator,Text,StyleSheet} from "react-native";
import theme from "../themes/index"
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';

export  default function Loader (props){
 
return(
  <Modal 
  isVisible={props.load}
  backdropOpacity={0.7}
  animationInTiming={props.Fast?0:700}
  backdropTransitionInTiming={props.Fast?0:700}
  animationOutTiming={props.Fast?0:700}
  backdropTransitionOutTiming={props.Fast?0:700}
  onRequestClose={() => { console.log("close") }}
 >

  <LinearGradient 
  colors={[theme.color.bc1,theme.color.bc2]}
  style={styles.LinearGradient}>

    <View style={{width:"12%"}}>
     <ActivityIndicator
     size='large'
     color={theme.color.mainColor}
    />
    </View>

    <View style={{width:"82%"}}>
    <Text numberOfLines={2} ellipsizeMode="tail" style={styles.title}>{props.title}</Text> 
    </View>
   
 
</LinearGradient>
  </Modal>
)
}


const styles = StyleSheet.create({
 
	    LinearGradient:{
	       width:'90%',
         alignSelf:"center",
	       padding:15,
         borderRadius:5,
         flexDirection:"row",
         alignItems:"center",
         justifyContent:"space-between"
	  },
       title:{ fontSize: 17, color: theme.color.mainColor,letterSpacing:0.5,lineHeight:20},
 
})