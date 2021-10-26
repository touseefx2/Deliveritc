import React,{useState,useEffect} from "react";
import NetInfo from "@react-native-community/netinfo";
import Stack from "./src/navigation/index"
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
  
export default inject("store")(observer(App));

 function App(props)  {

  const RootStack = createStackNavigator();
  const {setisInternet, setapiLevel,setip,user}=props.store;
  const [loader,setloader] = useState(true);

const handleConnectivityChange = state => {
  if (state.isConnected)
     setisInternet(true)
  else
    setisInternet(false)
};

 
useEffect(()=>{
  
  GlobalFont.applyGlobal(theme.fonts.fontNormal) 
  NetInfo.addEventListener(handleConnectivityChange);
  DeviceInfo.getApiLevel().then((apiLevel) => { setapiLevel(apiLevel)});
  NetworkInfo.getIPAddress().then(ipAddress => { setip(ipAddress)});
  return () => {
    console.log("app close")
  }
},[])

useEffect(() => {
   if(user!=""){
    setTimeout(() => {
    }, 2500);
   }else if(user==""){
    setTimeout(() => {
      setloader(false)
    }, 2500);
   }
}, [user])


console.log("user : ",user)

   return ( 
<ApplicationProvider  {...eva} theme={eva.light}>  
<NavigationContainer>
<RootStack.Navigator  screenOptions={{headerShown: false }}>

 
{loader && (
  <RootStack.Screen  name='Splash' component={screens.Splash}/>
)}

{(!loader && user==""  )&&(
 <RootStack.Screen name='authStack' component={Stack.authStack}/>
)}

 

  {(!loader && user!="" && user.sigin==true && user.acceptterm==true && user.selectedCar=="" )&&(
 <RootStack.Screen name='SelectCar' component={screens.SelectCar}/>
)}

{(!loader && user!="" && user.sigin==true && user.acceptterm==false && user.selectedCar=="" )&&(
 <RootStack.Screen name='SelectCar' component={screens.AcceptTerms}/>
)}

{(!loader && user!=""  && user.sigin==true && user.acceptterm==true &&  user.selectedCar!="" )&&(
 <RootStack.Screen name='captainStack' component={Stack.captainStack}/>
)}
 
 

</RootStack.Navigator>
</NavigationContainer> 
  </ApplicationProvider>
  
    
   )
 

}
  