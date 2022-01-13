import   React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import {screens}  from "../../screens/captainStack/index";
import {screen} from "../../screens/authStack/index"
import CustomDrawerContent from "./CustomDrawerContent";
import icon  from './styles';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const Drawer  = createDrawerNavigator();


  export default    captainStack = ()=> 
   {
    return(
    <Drawer.Navigator  
    initialRouteName="Homes"
    drawerStyle={{
      width: wp('80%'),
     height: hp('100%')
    }} 
    screenOptions={{swipeEnabled:true}}
    drawerContentOptions={{
      // activeTintColor: 'red',
      // activeBackgroundColor: 'yellow',
      // inactiveTintColor: 'blue',
      // inactiveBackgroundColor: 'white',
      labelStyle:{
        color:"white",
      }
    }}
    drawerContent={props => <CustomDrawerContent {...props}/>}
    >
    
        <Drawer.Screen  name="Homes" component={Home_Stack} options={icon.homeIcon}  />
        <Drawer.Screen  name="Captain Portal" component={CaptainPortal_Stack} options={icon.cpIcon}  />
       <Drawer.Screen  name="Notifications" component={Notification_Stack} options={icon.nIcon}  />

         {/*  <Drawer.Screen  name="Change PIN" component={screens.ChangePin} options={icon.pinIcon}  />
        <Drawer.Screen  name="Change Car" component={screens.ChangeCar} options={ icon.carIcon}  />
         */}
        {/* <Drawer.Screen  name="Notification" component={Home_Stack} options={ icon.skillIcon}  /> */}

        {/* <Drawer.Screen  name="Logout" component={screen.Logout}  options={{
                drawerLabel: () => null,
                title: null,
                drawerIcon: () => null
            }}/> */}


        {/*  
        <Drawer.Screen  name="Notification" component={Screens.Notification}  
        options={{
                drawerLabel: () => null,
                title: null,
                drawerIcon: () => null
            }}
            />
        <Drawer.Screen  name="Rate" component={Screens.Rate} options={{
                drawerLabel: () => null,
                title: null,
                drawerIcon: () => null
            }}/>
      
*/}
    </Drawer.Navigator>
    )
}
 
  const Stack = createStackNavigator();

  const Home_Stack = ()=> 
{
    return(
   <Stack.Navigator 
       initialRouteName="Home"
       screenOptions={{
         animationEnabled: false
       }}
       headerMode='none'
   >
       <Stack.Screen  name="Home" component={screens.Home}  />
 
   </Stack.Navigator>
    )
}
 
const CaptainPortal_Stack = ()=> 
{
    return(
   <Stack.Navigator 
       initialRouteName="CaptainPortal"
       screenOptions={{
         animationEnabled: false
       }}
       headerMode='none'
   >
       <Stack.Screen  name="CaptainPortal" component={screens.CaptainPortal}  
        // options={props => {
        //   let parent = props.navigation.dangerouslyGetParent();
        //   parent.setOptions({
        //     swipeEnabled: true
        //   })
        // }}
       />

<Stack.Screen  name="Profile" component={screens.Profile}  
        options={props => {
          let parent = props.navigation.dangerouslyGetParent();
          parent.setOptions({
            swipeEnabled:false
          })
        }}
       />

{/* <Stack.Screen  name="Tripstack" component={Trips_Stack}  
        options={props => {
          let parent = props.navigation.dangerouslyGetParent();
          parent.setOptions({
            swipeEnabled:false
          })
        }}
       /> */}

<Stack.Screen  name="TripDetail" component={screens.TripDetail}  
        options={props => {
          let parent = props.navigation.dangerouslyGetParent();
          parent.setOptions({
            swipeEnabled:false
          })
        }}
       />
      
  
   </Stack.Navigator>
    )
}

 

// const Trips_Stack = ()=> 
// {
//     return(
//    <Stack.Navigator 
//        initialRouteName="Trips"
//        screenOptions={{
//          animationEnabled: false
//        }}
//        headerMode='none'
//    >
//        <Stack.Screen  name="Trips" component={screens.Trips}  
//         options={props => {
//           let parent = props.navigation.dangerouslyGetParent();
//           parent.setOptions({
//             swipeEnabled: false
//           })
//         }}
//        />
 

// <Stack.Screen  name="TripDetail" component={screens.TripDetail}  
//         options={props => {
//           let parent = props.navigation.dangerouslyGetParent();
//           parent.setOptions({
//             swipeEnabled:false
//           })
//         }}
//        />
      
  
//    </Stack.Navigator>
//     )
// }


const Notification_Stack = ()=> 
{
    return(
   <Stack.Navigator 
       initialRouteName="Notification"
       screenOptions={{
         animationEnabled: false
       }}
       headerMode='none'
   >
       <Stack.Screen  name="Notification" component={screens.Notification}  
        // options={props => {
        //   let parent = props.navigation.dangerouslyGetParent();
        //   parent.setOptions({
        //     swipeEnabled: true
        //   })
        // }}
       />

<Stack.Screen  name="Notification_Detail" component={screens.Notification_Detail}  
        // options={props => {
        //   let parent = props.navigation.dangerouslyGetParent();
        //   parent.setOptions({
        //     swipeEnabled:false
        //   })
        // }}
       />

 
  
   </Stack.Navigator>
    )
}
 