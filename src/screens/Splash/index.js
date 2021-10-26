import React, {useEffect} from "react";
import {View,Text,SafeAreaView,Image} from "react-native";
import {styles} from "./styles"
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import theme from "../../themes/index"
import { inject, observer } from "mobx-react"; 
import AsyncStorage from '@react-native-async-storage/async-storage'
import GVs from "../../store/Global_Var"

export default inject("store")(observer(Splash));

 function Splash(props) {

  const {setuser,setcars}=props.store;
   
  useEffect(() => {
   getUserData();  //in local storage
  },[])

  const getUserData = async () => {
   try {
      const jsonValue = await AsyncStorage.getItem('userData')
                  if (jsonValue != null) {
                   const v = JSON.parse(jsonValue)
                   let car=[]
                   if(GVs.cars.length>0){
                     GVs.cars.map((e,i,a)=>{
                       if(e.uid==v.id){
                         car.push(e)
                       }
                     })
                   }
                 
                  setcars(car) 
                  setuser(v)             
     } 
   } catch (e) {
     console.log("get user data error : ", e)
   }
 }

  return (
  <SafeAreaView style={styles.container}>
    
      <Image source={require('../../assets/Splash_Logo/animatedtruck.gif')} />
			<View> 
		 	<theme.Text style={{ fontSize: 30,fontFamily:theme.fonts.fontBold, color: '#0e47a1',alignSelf:"center"}}>Deliver iT</theme.Text>
			</View>
  
  </SafeAreaView>
     );
  }
 
 
 
 
 
 
  
  