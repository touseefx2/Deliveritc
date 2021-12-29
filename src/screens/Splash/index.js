import React, {useEffect} from "react";
import {View,Text,SafeAreaView,Image} from "react-native";
import {styles} from "./styles"
import theme from "../../themes/index"
import { inject, observer } from "mobx-react"; 
 
export default inject("userStore","generalStore","carStore","tripStore")(observer(Splash));

 function Splash(props) {

  const {setLoader,user,authToken,notificationToken} =  props.userStore;
  const {cars} =  props.carStore;
  const {request,accept} =  props.tripStore;
  const {isInternet}   =  props.generalStore;
 
  useEffect(() => {
    setTimeout(() => {
      setLoader(false);
    }, 1500); 
  },[])

  
  // console.log("user : ",user)
  // console.log("istermacpt : ",user.terms_accepted)
  // console.log("cars : ",cars)
   console.log("at : ",authToken)
  // console.log("nt : ",notificationToken)
  
  console.log("request : ",request)
  console.log("accept : ",accept)


  return (
  <SafeAreaView style={styles.container}>
    
      <Image source={require('../../assets/Splash_Logo/animatedtruck.gif')} />
			<View> 
		 	<theme.Text style={{ fontSize: 30,fontFamily:theme.fonts.fontBold, color: '#0e47a1',alignSelf:"center"}}>Deliver iT</theme.Text>
			</View>
  
  </SafeAreaView>
     );
  }
 
 
 
 
 
 
  
  