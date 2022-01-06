import React ,{useEffect,useRef,useState} from 'react';
import {Image,SafeAreaView,View,Text,ScrollView} from 'react-native';
import { TextInput,Button } from 'react-native-paper';
import utils from "../../../utils/index"
import LinearGradient from 'react-native-linear-gradient';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { inject, observer } from "mobx-react"; 
import MapContainer from '../../Map/MapContainer/index';
import { Container,NativeBaseProvider } from 'native-base';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Geolocation from '@react-native-community/geolocation';
import theme  from "../../../themes/index";
import ConnectivityManager from 'react-native-connectivity-status'
import styles from "./styles"
import { formatDistance, subDays ,startOfWeek,endOfWeek} from 'date-fns'
import moment from 'moment';

 
export default inject("userStore","generalStore","carStore","tripStore")(observer(Profile));
 
 
 function Profile(props)   {
  // const { user,setuser,setcl,cl,isl,setisl,setrequest,request,trip,settrip,cars} = props.store;
  const [loader,setloader]=useState(false);
 

//   const renderPic=()=>{
//     return(
//       <View style={{width:"100%",padding:5,alignItems:"center",justifyContent:"center"}}>
//      <Image source={require("../../../assets/dp.png")}  style={{width:130,height:130,borderRadius:65,resizeMode:"contain"}} />
//      <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:20,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:30,width:"90%",backgroundColor:"white",textAlign:"center"}}>{user.name}</theme.Text>
//       </View>
//     )
//   }

//   const Sep=()=>{
//     return  <View style={{height:10}} />
//   }

//   const SepLine=()=>{
//    return   <View style={{width:"100%",backgroundColor:"gray",height:0.5,alignSelf:"center",opacity:0.3}} />
//   }

//   const renderprofile = ()=>
// { 
 
//    let c1="Personal"
//    let c2="Car"
//    let fs=14

//    let carname=""
//    let carid=""
//    let carnum=""
//    let carcolor=""
//    let carfuel=""
//    let carcapacity=""
//    let carpower=""

//    if(cars.length>0){
//      cars.map((e,i,a)=>{
//      if(e.id==user.selectedCar){
//        carname=e.name;carid=e.id;carnum=e.number;carfuel=e.fuel;carcolor=e.color;carcapacity=e.seatCapacity;carpower=e.cc
//      }
//      })
//    }

// return(
//   <View style={{}}>

// <theme.Text style={styles.cardtitle}>{c1}</theme.Text>
// {Sep()}
// {Sep()}
// {Sep()}
//  <View style={{flexDirection:"row",alignItems:"center",width:"98%",alignSelf:"center",justifyContent:"space-between" }}>
//  <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20,width:"38%"}}>Captain ID</theme.Text>
//  <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"52%"}}>{user.id}</theme.Text>
//  </View>
//  {Sep()}
//  {SepLine()}
//  {Sep()}
//  <View style={{flexDirection:"row",alignItems:"center",width:"98%",alignSelf:"center",justifyContent:"space-between"}}>
//  <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20,width:"38%"}}>Name</theme.Text>
//  <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"52%"}}>{user.name}</theme.Text>
//  </View>
//  {Sep()}
//  {SepLine()}
//  {Sep()}
//  <View style={{flexDirection:"row",alignItems:"center",width:"98%",alignSelf:"center",justifyContent:"space-between" }}>
//  <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20, width:"38%"}}>Phone</theme.Text>
//  <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"52%" }}>{user.phone}</theme.Text>
//  </View>
//  {Sep()}
//  {SepLine()}
//  {Sep()}
//  <View style={{flexDirection:"row",alignItems:"center",width:"98%",alignSelf:"center",justifyContent:"space-between" }}>
//  <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20 ,width:"38%"}}>Date of joining</theme.Text>
//  <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"52%" }}>{user.createdAt}</theme.Text>
//  </View>
//  {Sep()}
//  {SepLine()}
//  {Sep()}
//  <View style={{flexDirection:"row",alignItems:"center",width:"98%",alignSelf:"center",justifyContent:"space-between" }}>
//  <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20 ,width:"38%"}}>National ID</theme.Text>
//  <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"52%" }}>{user.cnic}</theme.Text>
//  </View>

 
// <theme.Text style={[styles.cardtitle,{marginTop:30}]}>{c2}</theme.Text>
// {Sep()}
// {Sep()}
// {Sep()}
//  <View style={{flexDirection:"row",alignItems:"center",width:"98%",alignSelf:"center",justifyContent:"space-between" }}>
//  <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20 ,width:"38%"}}>Car ID</theme.Text>
//  <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"52%" }}>{carid}</theme.Text>
//  </View>
//  {Sep()}
//  {SepLine()}
//  {Sep()}
//  <View style={{flexDirection:"row",alignItems:"center",width:"98%",alignSelf:"center",justifyContent:"space-between" }}>
//  <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20 ,width:"38%"}}>Name</theme.Text>
//  <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"52%" }}>{carname}</theme.Text>
//  </View>
//  {Sep()}
//  {SepLine()}
//  {Sep()}
//  <View style={{flexDirection:"row",alignItems:"center",width:"98%",alignSelf:"center",justifyContent:"space-between" }}>
//  <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20 ,width:"38%"}}>Number</theme.Text>
//  <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"52%" }}>{carnum}</theme.Text>
//  </View>
//  {Sep()}
//  {SepLine()}
//  {Sep()}
//  <View style={{flexDirection:"row",alignItems:"center",width:"98%",alignSelf:"center",justifyContent:"space-between" }}>
//  <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20, width:"38%"}}>Color</theme.Text>
//  <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"52%" }}>{carcolor}</theme.Text>
//  </View>
//  {Sep()}
//  {SepLine()}
//  {Sep()}
//  <View style={{flexDirection:"row",alignItems:"center",width:"98%",alignSelf:"center",justifyContent:"space-between" }}>
//  <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20 ,width:"38%"}}>Seat Capacity</theme.Text>
//  <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"52%" }}>{carcapacity}</theme.Text>
//  </View>
//  {Sep()}
//  {SepLine()}
//  {Sep()}
//  <View style={{flexDirection:"row",alignItems:"center",width:"98%",alignSelf:"center",justifyContent:"space-between"}}>
//  <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20 ,width:"38%"}}>Power</theme.Text>
//  <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"52%" }}>{carpower} cc</theme.Text>
//  </View>
//  {Sep()}
//  {SepLine()}
//  {Sep()}
//  <View style={{flexDirection:"row",alignItems:"center",width:"98%",alignSelf:"center",justifyContent:"space-between" }}>
//  <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20 ,width:"38%"}}>Fuel</theme.Text>
//  <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"52%" }}>{carfuel}</theme.Text>
//  </View>
// {Sep()}
// {Sep()}
// {Sep()}

// </View>

// )
// }

 
  return(
 <SafeAreaView style={styles.container}>
 <utils.StackHeader p={props} title="Profile" /> 
 <ScrollView>
 <View style={{padding:10}}> 
 {/* {renderPic()}
 {renderprofile()} */}
 </View>
 </ScrollView>
 </SafeAreaView>
)
    
  }