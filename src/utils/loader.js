import React   from "react";
import { View,Modal,ActivityIndicator,Text} from "react-native";
import theme from "../themes/index"

export function Loader (props){

  const bc=  'rgba(0,0,0,0.7)';

return(
    <Modal
    animationType='fade'
    transparent={true}
    visible={props.loader}
    >

    <View style={{ flex: 1, backgroundColor: bc, justifyContent: 'center', alignItems: 'center',padding:5 }}>
  
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