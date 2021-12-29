import   React, { useEffect,useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {screen}  from "../../screens/authStack/index"
 
const  Stack = createStackNavigator();
 
  export default   authStack = ()=> 
{
    return(
    <Stack.Navigator 
       initialRouteName="Login"
       screenOptions={{animationEnabled: false,headerShown:false}}
       >

       <Stack.Screen  name="Login" component={screen.Login}  />
       <Stack.Screen  name="OTP" component={screen.Otp}   />
       {/*  <Stack.Screen  name="ResetPin" component={screen.ResetPin}  /> */}
   
    </Stack.Navigator>
    )
}
 