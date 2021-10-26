import React   from "react";
import { View,Modal,ActivityIndicator,Text} from "react-native";
import theme from "../themes/index"

export function Loader (props){

  const bc= (props.location==true || props.dark==true)? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.6)'

return(
    <Modal
    animationType='fade'
    transparent={true}
    visible={props.loader}
    >

    <View style={{ flex: 1, backgroundColor: bc, justifyContent: 'center', alignItems: 'center' }}>
  
  {props.location==true && (
  <Text style={{alignSelf:"center",fontSize:14,color:"white"}}>
  Getting Current Location ....
  </Text>)}

    <ActivityIndicator
     size='large'
     color={theme.color.buttonLinerGC1}
    />

    </View>

  </Modal>
)
}