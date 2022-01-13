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
 
   const {user,authToken,setUser,setcl,cl,Logout,setonline} = props.userStore;
  const {cars,setCars} =  props.carStore;
  const {setrequest,accept,request,getReqById,setatime,setaccept,getreqloader,setgetreqloader,gro,setgro,endride} = props.tripStore;
  const {setLocation,isLocation,isInternet} = props.generalStore;


 
  const [loader,setloader]=useState(false);
 

  const renderPic=()=>{
    return(
      <View style={{width:"100%",padding:5,alignItems:"center",justifyContent:"center"}}>
     <Image source={{uri:user.profile_image}}  style={{width:130,height:130,borderRadius:65}} />
     <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:20,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:30,width:"95%",backgroundColor:"white",textAlign:"center",marginTop:10}}>{user.fullname}</theme.Text>
      </View>
    )
  }

  const Sep=()=>{
    return  <View style={{height:10}} />
  }

  const SepLine=()=>{
   return   <View style={{width:"100%",backgroundColor:"gray",height:0.5,alignSelf:"center",opacity:0.3}} />
  }

  const renderprofile = ()=>
{ 
 
   let c1="Personal"
   let c2="Car"
   let fs=14

   let carname=""
   let carid=""
   let carnum=""
   let carcolor=""
   let carfuel=""
   let carcapacity=""
   let carpower=""
   let cartype=""
   let maxweight=0

    
       carname=cars.car_name.name;carid=cars._id;carnum=cars.registration_number;carcolor=cars.color;carcapacity=cars.seating_capacitiy;
       cartype=cars.type.type;
       carpower=cars.engine_capacitiy;carfuel=cars.fuel,maxweight=cars.max_weight
     

return(
  <View style={{}}>

<theme.Text style={styles.cardtitle}>{c1}</theme.Text>
 {Sep()}
 {SepLine()}
 {Sep()}
 <View style={{flexDirection:"row",alignItems:"center",width:"98%",alignSelf:"center",justifyContent:"space-between"}}>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20,width:"38%"}}>Name</theme.Text>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"52%"}}>{user.fullname}</theme.Text>
 </View>
 {Sep()}
 {SepLine()}
 {Sep()}
 <View style={{flexDirection:"row",alignItems:"center",width:"98%",alignSelf:"center",justifyContent:"space-between" }}>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20, width:"38%"}}>Phone</theme.Text>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"52%" }}>{user.mobile_number}</theme.Text>
 </View>
 {user.email && user.email!="" &&(
   <View>
 {Sep()}
 {SepLine()}
 {Sep()}
 <View style={{flexDirection:"row",alignItems:"center",width:"98%",alignSelf:"center",justifyContent:"space-between" }}>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20,width:"38%"}}>Email</theme.Text>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"52%"}}>{user.email}</theme.Text>
 </View>
   </View>
 )}
 {Sep()}
 {SepLine()}
 {Sep()}
 <View style={{flexDirection:"row",alignItems:"center",width:"98%",alignSelf:"center",justifyContent:"space-between" }}>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20 ,width:"38%"}}>Date of joining</theme.Text>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"52%" }}>{moment(user.createdAt).format("D MMM Y")}</theme.Text>
 </View>
 {Sep()}
 {SepLine()}
 {Sep()}
 <View style={{flexDirection:"row",alignItems:"center",width:"98%",alignSelf:"center",justifyContent:"space-between" }}>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20 ,width:"38%"}}>Cnic</theme.Text>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"52%" }}>{user.cnic}</theme.Text>
 </View>

 
<theme.Text style={[styles.cardtitle,{marginTop:30}]}>{c2}</theme.Text>
 {Sep()}
 {SepLine()}
 {Sep()}
 <View style={{flexDirection:"row",alignItems:"center",width:"98%",alignSelf:"center",justifyContent:"space-between" }}>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20 ,width:"38%"}}>Name</theme.Text>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"52%" }}>{carname}</theme.Text>
 </View>
 {Sep()}
 {SepLine()}
 {Sep()}
  <View style={{flexDirection:"row",alignItems:"center",width:"98%",alignSelf:"center",justifyContent:"space-between" }}>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20 ,width:"38%"}}>Type</theme.Text>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"52%" }}>{cartype}</theme.Text>
 </View>
 {Sep()}
 {SepLine()}
 {Sep()}
 <View style={{flexDirection:"row",alignItems:"center",width:"98%",alignSelf:"center",justifyContent:"space-between" }}>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20 ,width:"38%"}}>Number</theme.Text>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"52%" }}>{carnum}</theme.Text>
 </View>
 {Sep()}
 {SepLine()}
 {Sep()}
 <View style={{flexDirection:"row",alignItems:"center",width:"98%",alignSelf:"center",justifyContent:"space-between" }}>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20, width:"38%"}}>Color</theme.Text>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"52%" }}>{carcolor}</theme.Text>
 </View>
 {Sep()}
 {SepLine()}
 {Sep()}
 <View style={{flexDirection:"row",alignItems:"center",width:"98%",alignSelf:"center",justifyContent:"space-between" }}>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20 ,width:"38%"}}>Seat Capacity</theme.Text>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"52%" }}>{carcapacity}</theme.Text>
 </View>
 {Sep()}
 {SepLine()}
 {Sep()}
 <View style={{flexDirection:"row",alignItems:"center",width:"98%",alignSelf:"center",justifyContent:"space-between" }}>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20 ,width:"38%"}}>Weight</theme.Text>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"52%" }}>{maxweight} Kg</theme.Text>
 </View>
 {Sep()}
 {SepLine()}
 {Sep()}
 <View style={{flexDirection:"row",alignItems:"center",width:"98%",alignSelf:"center",justifyContent:"space-between"}}>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20 ,width:"38%"}}>Power</theme.Text>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"52%" }}>{carpower} cc</theme.Text>
 </View>
 {Sep()}
 {SepLine()}
 {Sep()}
 <View style={{flexDirection:"row",alignItems:"center",width:"98%",alignSelf:"center",justifyContent:"space-between" }}>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20 ,width:"38%"}}>Fuel</theme.Text>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"52%" }}>{carfuel}</theme.Text>
 </View>
{Sep()}
{Sep()}
{Sep()}

</View>

)
}

 
  return(
 <SafeAreaView style={styles.container}>
 <utils.StackHeader p={props} title="Profile" /> 
 <ScrollView>
 <View style={{padding:10}}> 
 {renderPic()}
 {renderprofile()}
 </View>
 </ScrollView>
 </SafeAreaView>
)
    
  }