import React,{useState,useEffect} from "react";
import NetInfo from "@react-native-community/netinfo";
import Stack from "./src/navigation/index"
import {AppState} from 'react-native';
import {screens} from "./src/screens/index";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import GlobalFont from 'react-native-global-font'
import theme from "./src/themes/index"
import { inject, observer } from "mobx-react"; 
import DeviceInfo from 'react-native-device-info';
import { NetworkInfo } from "react-native-network-info";
import {ApplicationProvider,} from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import ConnectivityManager from 'react-native-connectivity-status'

export default inject("userStore","generalStore")(observer(App));

 function App(props)  {

  const RootStack = createStackNavigator();
  
  const {user,loader} =  props.userStore;
  const {setLocation,setInternet,setdeviceApi,setappState,isInternet} =  props.generalStore;

 
 
  const handleChange = (newState) => {
    setappState(newState)
  }

useEffect(async () => {
  GlobalFont.applyGlobal(theme.fonts.fontNormal) 
   const locationServicesAvailable = await ConnectivityManager.areLocationServicesEnabled();
   setLocation(locationServicesAvailable)
   const connectivityStatusSubscription = ConnectivityManager.addStatusListener(({ eventType, status }) => {
    switch (eventType) {
      case 'location':
         setLocation(status)
        break;
    }
    })
    const unsubscribe = NetInfo.addEventListener(state => {
      //  console.log("Connection type", state.type);
      setInternet(state.isConnected)
   
    });
    setappState("active")
    AppState.addEventListener('change', handleChange); 
    DeviceInfo.getApiLevel().then((apiLevel) => {setdeviceApi(apiLevel)});

  return () => {
     connectivityStatusSubscription.remove();
     unsubscribe();
     AppState.removeEventListener('change', handleChange);
  }
  
}, [])

 
 
   return ( 
<ApplicationProvider  {...eva} theme={eva.light}>  
<NavigationContainer>
<RootStack.Navigator  screenOptions={{headerShown: false }}>

 
{loader && (
  <RootStack.Screen  name='Splash' component={screens.Splash}/>
)}

{(!loader && !user  )&&(
 <RootStack.Screen name='authStack' component={Stack.authStack}/>
)}

  {(!loader && user  && !user.terms_accepted )&&(
   <RootStack.Screen name='SelectCar' component={screens.SelectCar}/>
)}

 

{(!loader && user  && user.terms_accepted )&&(
 <RootStack.Screen name='captainStack' component={Stack.captainStack}/>
)}
 
 

</RootStack.Navigator>
</NavigationContainer> 
  </ApplicationProvider>
  
    
   )
 

}
  