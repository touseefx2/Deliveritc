import React from "react";
import {Image} from 'react-native';
import utils from "../../utils";

 
 const homeIcon= {
drawerLabel: 'Home',
headerShown: false,
  drawerIcon: ({ focused, size }) => (
         
    <Image 
    style={{width:22,height:22}}
    resizeMode="contain"
    source={require("../../assets/drawer_items_icon/home.png")}
    />
    // <utils.vectorIcon.AntDesign
    //   name="home"
    //   size={GV.iconSize}
    //   color={focused ? GV.iconfocuscolor : GV.iconunfocuscolor}
    // />
  )
}
 
const profileIcon = {
// unmountOnBlur:true,
headerShown: false,
drawerIcon: ({ focused, size }) => (
  <Image 
  style={{width:22,height:22}}
  resizeMode="contain"
  source={require("../../assets/drawer_items_icon/profile.png")}
  />
)  
}

const skillIcon = {
  headerShown: false,
  // title:"Categories",
  drawerIcon: ({ focused, size }) => (
      
    <Image 
    style={{width:22,height:22}}
    resizeMode="contain"
    source={require("../../assets/drawer_items_icon/skills.png")}
    />
  )  
  }

  const cpIcon = {
    headerShown: false,
    unmountOnBlur:true,
    // title:"Categories",
    drawerIcon: ({ focused, size }) => (
        
      <Image 
      style={{width:22,height:22}}
      resizeMode="contain"
      source={require("../../assets/drawer_items_icon/skills.png")}
      />
    )  
    }
  


  const carIcon = {
    headerShown: false,
    // title:"Categories",
    drawerIcon: ({ focused, size }) => ( 
      <utils.vectorIcon.Ionicons name="ios-car-sport-outline" color="white" size={22} />
    )  
    }

  const nIcon = {
    headerShown: false,
    // title:"Categories",
    drawerIcon: ({ focused, size }) => (
         <utils.vectorIcon.SimpleLineIcons size={22} name="bell" color="white" />
    )  
    }

  const reportIcon = {
    headerShown: false,
    drawerIcon: ({ focused, size }) => (
      <Image 
      style={{width:22,height:22}}
      resizeMode="contain"
      source={require("../../assets/drawer_items_icon/reports.png")}
      />
    )  
    }

const chatIcon = {
  headerShown: false,
  drawerIcon: ({ focused, size }) => (
    <Image 
    style={{width:22,height:22}}
    resizeMode="contain"
    source={require("../../assets/drawer_items_icon/chat.png")}
    />
  )  
 

}

const rateIcon = {
  headerShown: false,
 title:"Rate the app",
  drawerIcon: ({ focused, size}) => (
    <Image 
    style={{width:22,height:22}}
    resizeMode="contain"
    source={require("../../assets/drawer_items_icon/star.png")}
    />
  )
}


const logoutIcon = {
  headerShown: false,
  title:"Sign out",
  drawerIcon: ({ focused, size}) => (
    <Image 
    style={{width:22,height:22}}
    resizeMode="contain"
    source={require("../../assets/drawer_items_icon/exit.png")}
    />
  )
}

const icon={homeIcon,logoutIcon,profileIcon,chatIcon,skillIcon,reportIcon,rateIcon,nIcon,carIcon,cpIcon}

export default icon;


 