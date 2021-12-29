// import React ,{useEffect,useRef,useState,useCallback} from 'react';
// import { StyleSheet,TouchableOpacity,View,Linking,SafeAreaView,Text,Modal, ImageBackground,Dimensions,Image,Alert,ScrollView,TouchableWithoutFeedback} from 'react-native';
// import styles from './styles';
// import theme from "../../../themes/index"
// import utils from "../../../utils/index"
// import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
// import { inject, observer } from "mobx-react"; 
// import MapView, { PROVIDER_GOOGLE,Marker,Circle } from 'react-native-maps';
// import SearchBox from "../SearchBox/index"
// import Header from '../Header/index';
// import Footer from "../Footer/index"
// import * as Progress from 'react-native-progress';
// import LinearGradient from 'react-native-linear-gradient';
// import call from 'react-native-phone-call'
// import CountDown from 'react-native-countdown-component';
// import moment from "moment";
// import StarRating from 'react-native-star-rating';
// import {Input } from '@ui-kitten/components';
// import { tr } from 'date-fns/locale';

//    export default inject("store")(observer(MapContainer));

//    function MapContainer (props)   {

//     let waitTime=60     //  sec
//     let cancelTime=40  //   sec  

//     let canceltripnotcuttime=10 //1min or 60 sec no cut charges
     
//   const {region}=props;
//   const { user,setuser,isInternet ,cl,setcl,isl,request,changerequest,trip,settrip} = props.store;

//   const [ct, setct] = useState(waitTime);  //current time
//   const [captainwt, setcaptainwt] = useState(0);  //captain w8 time

//   // const [cl, setcl] = useState("");  //curent marker locaion 
  
//   const [loader, setloader] = useState(false); //loading indctr in button
//   const [l, setl] = useState(false); //loading 
 
//   const [search,setsearch] = useState(""); //destntn adress st from google places
//   const [showLoc,setshowLoc] = useState(false); //destntn adress st from google places

//   const [activeChecked, setActiveChecked] = useState("");
//   const [ridemodal,setridemodal] = useState(false);
//   const [tripdetailmodal,settripdetailmodal] = useState(false);

  

//   const [atime,setatime] = useState("");  //trip acept time jb acpt kr lya us k bad ktne time ho gya wo chk krta


//   const [accept,setaccept] = useState(false);
//   const [arrive,setarrive] = useState(false);
//   const [startride,setstartride] = useState(false);
//   const [endride,setendride] = useState(false);

//   const [p,setp] = useState(0); //progress //10 sec

//   const [dcp,setdcp] = useState("..."); // distance from current loc to pickup location  reqst modal
//   const [tcp,settcp] = useState("..."); // time from current loc to pickup location      reqesr modal

//   const [dpd,setdpd] = useState("..."); // distance from    pickup location to dropofloce  startride true
//   const [tpd,settpd] = useState("..."); // time from  pickup location to dropofloce  startride true


//   const [nolpl,setnolpl] = useState(0); //numofline in pickup location in trip modal

//   const [starCount,setstarCount] = useState(0);

 
//   const [cash,setcash] = useState("");

 

 
//   const mapRef = useRef();
  

//   const clearallFields=()=>{
//     setaccept(false);
//     setarrive(false);
//     setstartride(false);
//     setendride(false);
//     setatime("");
//     setstarCount(0);
//     setcash("");
//     setp(0);
//     setdcp("");
//     settcp("");
//     setdpd("");
//     settpd("");
//     setridemodal(false);
//     settripdetailmodal(false);
//     setcaptainwt(0);
//     setct(waitTime);
//     setnolpl(0);
//   }
 
 
// useEffect(() => {
 
//   if(ridemodal==true){

//   const interval = setInterval(() => {
//       setp(p+0.1)
//   }, 1000);

//   if(p>=1){
//       clearInterval(interval)
//       setp(0);
//       onclickSkip()
//       }

//   return () => {
//     clearInterval(interval)
//    }

//   }

//   if(ridemodal!=true){
//     setp(0)
//   }
// }, [p,ridemodal])

 
  
//   const fetchDistanceBetweenPointsOnline = (lat1, lng1, lat2, lng2,c) => { // Pass Latitude & Longitude of both points as a parameter
//     var urlToFetchDistance = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins='+lat1+','+lng1+'&destinations='+lat2+'%2C'+lng2+'&key=' +"AIzaSyCmGLNexx4tD6Gg0v2Qz75MVXr5db3ClH0";
//     fetch(urlToFetchDistance)
//             .then(res => {
//            return res.json()
//   })
//   .then(res => {

//             //  console.log("res : ",res.rows[0].elements)

//              var distanceString = res.rows[0].elements[0].distance.text;
//               var timeString = res.rows[0].elements[0].duration.text;
//               var timeSecond = res.rows[0].elements[0].duration.value;
//             // console.log("distanceString : ",res.rows[0].elements[0])
//             if(c=="requestride"){
//               setdcp(distanceString)
//               settcp(timeString)
//             }else if(c=="startride"){
//               setdpd(distanceString)
//               let s=timeSecond
//               var travelTime = moment(new Date()).add(s, 'seconds').format('hh:mm A')
//               settpd(travelTime)
              
 
//               if(trip.length>0){
//                 trip.map((e,i,a)=>{
//                 if(e.id==request.id){
//                   trip[i].total_distance=distanceString
//                   trip[i].total_time=s
//                   }
//                 })
//               }

//               changerequest("TotalDistancendTime","","","","",distanceString,s)

//                     }

            
//             // return distanceString;
//     // Do your stuff here
//   })
//   .catch(error => {
//             console.log("Problem occurred fetchdsistancematric : ",error);
//   });
// }

// const onclickSkip=()=>{
//   if(trip.length>0){
//     trip.map((e,i,a)=>{
//       if(e.id==request.id){
//         trip[i].status= "skip";
//         trip[i].cancelby= "captain";
//         trip[i].captainid= user.id;
//         trip[i].captaincarid= user.selectedCar;
//       }
//     })
//   }
  
//   changerequest("skip",user.id,user.selectedCar)
//   // clearvariableSkipModal();
//   clearallFields()
// }

// const onClickReject=()=>{
 
//   if(trip.length>0){
//     trip.map((e,i,a)=>{
//       if(e.id==request.id){
//         trip[i].status= "reject";
//         trip[i].cancelby= "captain";
//         trip[i].captainid= user.id;
//         trip[i].captaincarid= user.selectedCar;
//       }
//     })
//   }
  
//   changerequest("reject",user.id,user.selectedCar)
//   // clearvariableSkipModal();
//    clearallFields()
// }
  
// const onClickAccept=()=>{
//     setl(true);
    
//     if(trip.length>0){
//       trip.map((e,i,a)=>{
//         if(e.id==request.id){
//           trip[i].status= "accept";
//           trip[i].accept= true;
//           trip[i].captainid= user.id;
//           trip[i].captaincarid= user.selectedCar;
//         }
//       })
//     }
//     changerequest("accept",user.id,user.selectedCar)
    


//     setTimeout(() => 
//     {
//     setaccept(true);setridemodal(!ridemodal);setl(false);setatime(new Date())
//   }, 1500);
// }

//   const  renderRideRequestModal=()=>{
  
//     fetchDistanceBetweenPointsOnline(
//       cl.latitude,
//       cl.longitude,
//       request.pickupLocation.region.latitude,
//       request.pickupLocation.region.longitude,
//       "requestride")
  
//     return(
//       <Modal
//       animationType='fade'
//       transparent={true}
//       visible={ridemodal}>
  
//   <View style={{ flex: 1, backgroundColor:'rgba(0,0,0.2,0.9)', justifyContent: 'center', alignItems: 'center' }}>
    
// <View style={{flexDirection:"row",justifyContent:"space-between",width:wp("90%")}}>

//  <theme.Text   style={{fontSize:16,color:"white"}}> 
//  Intercity Trip
//  </theme.Text>

// <TouchableOpacity onPress={()=>{onclickSkip()}}>
//  <theme.Text   style={{fontSize:16,color:"white"}}> 
//  Skip
//  </theme.Text>
//  </TouchableOpacity>

// </View>
 
// <View style={{backgroundColor:"white",width:wp("90%"),height:hp("80%"),borderRadius:10,marginTop:30}}>
// <ImageBackground  blurRadius={2} source={require("../../../assets/map.jpeg")} style={{flex:1,borderRadius:10}} >

// <TouchableOpacity onPress={()=>{onClickReject()}}>
// <View style={{backgroundColor:"white",borderRadius:10,flexDirection:"row",alignItems:"center",justifyContent:"center",width:90,height:30,marginTop:10,marginLeft:10}}>
// <utils.vectorIcon.Entypo name="circle-with-cross" color={theme.color.mainPlaceholderColor} size={20}/>
// <theme.Text   style={{fontSize:15,color:theme.color.mainPlaceholderColor}}> 
// Reject
//  </theme.Text>
// </View>
// </TouchableOpacity>

// <View style={{flex:1,marginTop:50}}>
 
// <View style={{backgroundColor:"white",borderRadius:10 ,padding:5,width:180,position:"absolute",right:10,elevation:5}}>
// <theme.Text   style={{fontSize:12,color:theme.color.buttonLinerGC1,fontFamily:theme.fonts.fontBold}}> 
// Dropoff
//  </theme.Text>

//  <theme.Text numberOfLines={3} ellipsizeMode="tail"   style={{fontSize:13,color:"black",fontFamily:theme.fonts.fontMedium,width:"100%",textTransform:"capitalize"}}> 
//  {request.dropoffLocation.name}
//  </theme.Text>
// </View>

// <View style={{backgroundColor:theme.color.buttonLinerGC1,borderRadius:10,padding:5,width:180,position:"absolute",left:10,top:110,elevation:5}}>
// <theme.Text   style={{fontSize:12,color:"white",fontFamily:theme.fonts.fontBold}}> 
// Pickup
//  </theme.Text>

//  <theme.Text numberOfLines={3} ellipsizeMode="tail"   style={{fontSize:13,color:"white",fontFamily:theme.fonts.fontMedium,width:"100%",textTransform:"capitalize"}}> 
// {request.pickupLocation.name}
//  </theme.Text>
// </View>

// </View>


// <View style={{backgroundColor:"white",width:"95%",height:220,alignSelf:"center",borderRadius:10,position:"absolute",bottom:10,elevation:5,padding:5}}>


// <View style={{backgroundColor:"white",padding:5,marginTop:-20,alignSelf:"center",borderRadius:10,elevation:1}}>
// <theme.Text numberOfLines={1} ellipsizeMode="tail"   style={{fontSize:14,color:"black",fontFamily:theme.fonts.fontMedium}}> 
// {tcp} | {dcp}
//  </theme.Text>
// </View>
 
// <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center",padding:5,width:"100%",height:"25%"}}>

//   <View style={{backgroundColor:"silver",width:40,height:40,borderRadius:20,alignItems:"center",justifyContent:"center"}}>
//   <utils.vectorIcon.MaterialIcons name="location-searching" size={25} color="blue"/>
//   </View>

//   <theme.Text  numberOfLines={1} ellipsizeMode="tail"  style={{fontSize:17,marginLeft:10,color:"black",fontFamily:theme.fonts.fontMedium,textTransform:"capitalize",width:"83%"}}> 
//   Intercity - Islamabad
//  </theme.Text>

// </View>


// <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center",padding:5,width:"100%",height:"35%"}}>

// <View style={{width:"27%",flexDirection:"row",alignItems:"center",justifyContent:"space-evenly"}}>
// <utils.vectorIcon.Entypo name="user" color="silver" size={18}/>
// <Text style={{fontSize:14}}>{request.rating}</Text>
// <utils.vectorIcon.Entypo name="star" color={theme.color.buttonLinerGC1} size={18}/>
// </View>

// <View style={{width:"73%",flexDirection:"row",alignItems:"center",justifyContent:"space-evenly"}}>
// <theme.Text numberOfLines={1} ellipsizeMode="tail"  style={{fontSize:14,color:"silver",fontFamily:theme.fonts.fontMedium,textTransform:"capitalize",width:"95%"}}> 
//   Earn: <theme.Text  style={{fontSize:14,color:"black",fontFamily:theme.fonts.fontMedium,textTransform:"capitalize"}}>{request.rs} pkr | cash</theme.Text>
//  </theme.Text>
// </View>
  

// </View>

  
// <TouchableOpacity style={{alignItems:"center",justifyContent:"center",padding:5,width:"100%",height:"33%"}} 
// onPress={()=>{onClickAccept()}}>
// <theme.Text   style={{fontSize:14,color:theme.color.buttonLinerGC1,fontFamily:theme.fonts.fontBold}}> 
//  Tap to accept
//  </theme.Text>
 
//  <Progress.Bar animated style={{position:"absolute",bottom:0}} progress={p}  color={theme.color.buttonLinerGC1} width={300} />
// </TouchableOpacity>
  
// </View>


// </ImageBackground>
//     </View>

//       </View>
  
//     </Modal>
//     )
// }

//   const onTextLayout = useCallback(e => {
//      setnolpl(e.nativeEvent.lines.length<=5?e.nativeEvent.lines.length:5)
// }, []);

//    const renderDOT=()=>{
//   const dot = []
//  for (let index = 0; index< nolpl-1; index++) {
//     dot.push(<utils.vectorIcon.Entypo style={{marginTop:5}} name="dot-single" size={20} color="silver"/>)
// }
// return dot;
//   }

//   const callUser=()=>{
//     const args = {
//       number: request.number, // String value with the number to call
//       prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call 
//     }
//     call(args).catch((e)=>{console.log("call error : ",e)})
//   }

//   const canceltripYes=()=>{

//     setl(true)

//     var acptTime = moment(atime, "hh:mm:ss a");
//     var crntTime = moment(new Date(), "hh:mm:ss a");
 
//     var duration = moment.duration(crntTime.diff(acptTime));
 
//     var sec = parseInt(duration.asSeconds());

     
//     if(trip.length>0){
//       trip.map((e,i,a)=>{
//       if(e.id==request.id){
//       trip[i].status= "cancel"
//       trip[i].cancelStatus= sec<=canceltripnotcuttime?"unPaid":"unPaidcut"; //is wait time is not over  or any other erergency
//       trip[i].cancelby= "captain";
//         }
//       })
//     }
//     changerequest(sec<=canceltripnotcuttime?"cancelunPaid":"cancelunPaidcut")

//     setTimeout(() => {
//       clearallFields()
//       // settripdetailmodal(!tripdetailmodal);
//       // setaccept(!accept);
//       // setdcp("...");
//       // settcp("...");
//       // settpd("");
//       // setdpd("");
//       // setct(waitTime)
//        setl(false);
//       // setatime("");
//       utils.ToastAndroid.ToastAndroid_LBC("Cancel trip success.")
//     }, 1200);

  

    
//   }
  
//   const cancelTrip=()=>{
//     Alert.alert(
//       "Confirmation",
//       "Are you sure you want to cancel this trip ?",
//       [
//         {
//           text: "No",
//           onPress: () => console.log("Cancel Pressed"),
//           style: "cancel"
//         },
//         { text: "Yes", onPress: () =>  {canceltripYes()} }
//       ]
//     );
//   }
  
//   const cancelJob=()=>{
//     Alert.alert(
//       "Confirmation",
//       "Are you sure you want to cancel this job ?",
//       [
//         {
//           text: "No",
//           onPress: () => console.log("Cancel Pressed"),
//           style: "cancel"
//         },
//         { text: "Yes", onPress: () =>  {cancelJobYes()} }
//       ]
//     );
//   }
  
//   const cancelJobYes=()=>{

//     setl(true)

//     var at = moment(captainwt, "hh:mm:ss a"); //arive for pickup start time
//     var crntTime = moment(new Date(), "hh:mm:ss a");
 
//     var duration = moment.duration(crntTime.diff(at));
 
//     var sec = parseInt(duration.asSeconds());  //arived to start w8 time

//     if(trip.length>0){
//       trip.map((e,i,a)=>{
//       if(e.id==request.id){
//         trip[i].status= "cancel"
//         trip[i].wait_time=sec
//         trip[i].cancelStatus= "Paid";  //if wait time is over
//         trip[i].cancelby= "captain";
//         }
//       })
//     }
   
//     changerequest("cancelPaid","","","",sec)
 
//     setTimeout(() => {
//       // setaccept(!accept);
//       // setarrive(!arrive)
//       // settcp("...")
//       // setdcp("...")
//       // setct(waitTime)
//       clearallFields()
//    setl(false)
//       utils.ToastAndroid.ToastAndroid_SBC("JOb cancel success !")
//     }, 1200);
//   }
 
//   const renderTripDetailModal=()=>{
//     return(
//      <Modal 
//      isVisible={tripdetailmodal}
//      backdropOpacity={0.6}
//      onRequestClose={() => { settripdetailmodal(!tripdetailmodal) }}
//      >
//      <View style=
//      {{
//      flex:1,
//      backgroundColor:"white", 
//      height:hp("100%"), 
//      width:wp('100%'), 
//      alignSelf: 'center'
//      }}>
  

// <View style={{flexDirection:"row",alignItems:"center",padding:10,backgroundColor:"black"}}>
 
//  <TouchableOpacity onPress={()=>{settripdetailmodal(!tripdetailmodal)}}>
//  <utils.vectorIcon.Entypo name="cross" size={30} color="white" />
//  </TouchableOpacity>

// <theme.Text style={{fontSize:18,fontFamily:theme.fonts.fontMedium,color:"white",marginLeft:15}}> 
//      Trip details
//   </theme.Text>
// </View>

// <View style={{backgroundColor:"white",elevation:5}}>
// <View style={{borderBottomColor:theme.color.buttonLinerGC1,borderBottomWidth:2,width:150,marginTop:10,alignItems:"center",justifyContent:"center"}}>
// <theme.Text style={{fontSize:16,fontFamily:theme.fonts.fontBold,color:theme.color.buttonLinerGC1}}> 
//      CURRENT PICKUP
//   </theme.Text>
//   </View>
// </View>
 
 
//  <ScrollView contentContainerStyle={{flex:1}}>
 
//  <View style={{flexDirection:"row",alignItems:"center",backgroundColor:"white",borderBottomColor:"silver",borderBottomWidth:0.5,paddingHorizontal:10,paddingVertical:20,justifyContent:"space-between"}}>

//  <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:20,fontFamily:theme.fonts.fontMedium,color:"balck",width:"80%",textTransform:"capitalize"}}> 
//    {request.name}
//   </theme.Text>

// <TouchableOpacity onPress={()=>{callUser()}}>
// <View style={{width:60,height:60,alignItems:"center",justifyContent:"center",backgroundColor:theme.color.buttonLinerGC1,borderRadius:30}}>
// <utils.vectorIcon.FontAwesome name="phone" color="white" size={25} />
// </View>
// </TouchableOpacity>

//  </View>

//  <View style={{flexDirection:"row",alignItems:"center",backgroundColor:"white",borderBottomColor:"silver",borderBottomWidth:0.5,padding:10}}>

//  <utils.vectorIcon.AntDesign name="exclamationcircleo" color="silver" size={18} />
//  <theme.Text numberOfLines={1}  ellipsizeMode="tail" style={{fontSize:18,color:"balck",width:"90%",textTransform:"capitalize",marginLeft:10}}> 
//    {request.rideType}
//   </theme.Text>
 
//  </View>

// <View style={{paddingHorizontal:10,paddingVertical:15,backgroundColor:"white",borderBottomColor:"silver",borderBottomWidth:0.5}}>

// <View style={{flexDirection:"row"}}>
// <View style={{alignItems:"center",justifyContent:"center"}}>
//   <utils.vectorIcon.FontAwesome name="circle-thin" color="silver" size={18} />
//   {nolpl>0 && renderDOT()}
//   {request.dropoffLocation && (
//     <View>
//     <utils.vectorIcon.Entypo style={{marginTop:5}} name="dot-single" size={20} color="silver"/>
//     <utils.vectorIcon.Entypo style={{marginTop:5}} name="dot-single" size={20} color="silver"/>
//     </View>
//   )
//   }
// </View> 
// <theme.Text numberOfLines={5} onTextLayout={onTextLayout} ellipsizeMode="tail" style={{marginTop:-5,fontSize:15,color:"balck",width:"90%",textTransform:"capitalize",marginLeft:10}}> 
//   {request.pickupLocation.name}
//  </theme.Text>
// </View>
  
 
// <View style={{flexDirection:"row"}}>
// <utils.vectorIcon.FontAwesome name="circle" color="silver" size={18} style={{marginLeft:2}}   />
// <theme.Text numberOfLines={5}  ellipsizeMode="tail" style={{marginTop:-5,fontSize:15,color:"balck",width:"90%",textTransform:"capitalize",marginLeft:12.5}}> 
//   {request.dropoffLocation.name}
//  </theme.Text>
//  </View>

 

// </View>

// {ct>cancelTime&&(
//   <TouchableOpacity onPress={()=>{cancelTrip()}}>
// <View style={{backgroundColor:"white",flexDirection:"row",padding:10}}>
// <utils.vectorIcon.Entypo name="circle-with-cross" color="silver" size={20} />

//  <View style={{marginLeft:10,width:"90%"}}>
//  <theme.Text  style={{fontFamily:theme.fonts.fontMedium,fontSize:16,color:"red"}}> 
//   CANCEL TRIP
//  </theme.Text>
//  <theme.Text  style={{fontFamily:theme.fonts.fontMedium,fontSize:14,color:"silver"}}> 
//   Canceling now will lower your completion rate
//  </theme.Text>
//  </View>
 
// </View>
// </TouchableOpacity>
// )}

  
//  </ScrollView>
  
 
//      </View>
//    </Modal>
//     )
//   }

//     const openMap = async (dest, label) => {

//     const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'https://www.google.com/maps/dir/?api=1&travelmode=driving&dir_action=navigate&destination='});
//     let latLng = `${dest.latitude},${dest.longitude}`;
    
//     const url = Platform.select({
//       ios: `https://www.google.com/maps/?api=1&query=${label}&center=${lat},${long}`,
//       android: `${scheme}${latLng}`
//     });

//     Linking.canOpenURL(url)
//     .then((supported) => {
//         if (!supported) {
//            let browser_url =
//             "https://www.google.de/maps/@" +
//             dest.latitude +
//             "," +
//             dest.longitude +
//             "?q=" +
//             label;
//             return Linking.openURL(browser_url);
//         } else {
//             return Linking.openURL(url);
//         }
//     })
//     .catch((err) => console.log('error open google map', err));

//   }

//   const navigateGMaps=(c)=>{
//     let dest=null;
//     if(c=="dropoff"){
//       dest={
//         latitude: request.dropoffLocation.region.latitude,
//         longitude:request.dropoffLocation.region.longitude}
//     }
//     if(c=="pickup"){
//       dest={
//         latitude: request.pickupLocation.region.latitude,
//         longitude:request.pickupLocation.region.longitude}
//     }
   

//   openMap(dest,"");
//   // try {
//   //   openMap(dest);
//   // } catch (error) {
//   //   console.log("open google map error : ",error)
//   // }

//   }

//   const navigatetoGoogleMaps=(c)=>{
//     Alert.alert(
//       "Confirmation",
//       "Are you sure you want to navigate through google maps ?",
//       [
//         {
//           text: "No",
//           onPress: () => console.log("Cancel Pressed"),
//           style: "cancel"
//         },
//         { text: "Yes", onPress: () =>  {navigateGMaps(c)} }
//       ]
//     );
//   }

//     const renderShowLocation=()=>{

//       //when acpt jon
//       if(!arrive&& !startride && accept && !endride){
//         const str=request.pickupLocation.name
//         const title=str.substr(0, str.indexOf(',')); 
//         const title2= str.substr(str.indexOf(",") + 1)
    
//         return(
//        <View style={{position:"absolute",top:0,width:wp("80%"),borderRadius:10,padding:5,backgroundColor:"white",left:10,elevation:3,flexDirection:"row",alignItems:"center"}}>
      
//        <View style={{width:"79.5%",height:"100%",padding:5,marginTop:20}}>
//       <theme.Text  numberOfLines={1} ellipsizeMode="tail" style={{fontSize:17,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20}}> 
//       {title}
//      </theme.Text>  
//      <theme.Text  numberOfLines={1} ellipsizeMode="tail" style={{fontSize:14,color:"gray",lineHeight:20}}> 
//       {title2}
//      </theme.Text> 
//        </View>
    
//        <View style={{backgroundColor:"silver",width:"0.5%",height:"100%",opacity:0.4}} />
    
     
//       <TouchableOpacity  onPress={()=>{navigatetoGoogleMaps("pickup")}}  style={{width:"20%",height:"100%",padding:5,alignItems:"center",justifyContent:"center"}} >
    
//       <Image  source={require("../../../assets/Navigate/navigate.png")} style={{width:35,height:35,opacity:0.8}} />
      
//      <theme.Text  style={{fontSize:14,color:theme.color.buttonLinerGC1,fontFamily:theme.fonts.fontMedium}}> 
//       START
//      </theme.Text>
    
//      </TouchableOpacity>
      
    
//           </View> 
//         )
//       }

//       //when acpt arrived
//      if(arrive && !startride && accept && !endride){
//       const str=request.dropoffLocation.name
//       const title=str.substr(0, str.indexOf(',')); 
//       const title2= str.substr(str.indexOf(",") + 1)
  
//        let textcolor= ct>cancelTime?"#1CC625":"red"
//        let      bbc = ct>cancelTime?"gray":theme.color.buttonLinerGC1                          //button backkgrnd color

//       return(

//         <View style={{position:"absolute",top:0,left:10,right:10}}> 


// <View style={{width:wp("80%"),height:80,borderRadius:10,padding:5,backgroundColor:"white",elevation:3,flexDirection:"row",alignItems:"center"}}>
     
//      <View style={{width:"79.5%",height:"100%",padding:5,marginTop:20}}>
//     <theme.Text  numberOfLines={1} ellipsizeMode="tail" style={{fontSize:17,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20}}> 
//     {title}
//    </theme.Text>  
//    <theme.Text  numberOfLines={1} ellipsizeMode="tail" style={{fontSize:14,color:"gray",lineHeight:20}}> 
//     {title2}
//    </theme.Text> 
//      </View>
  
//      <View style={{backgroundColor:"silver",width:"0.5%",height:"100%",opacity:0.4}} />
  
   
//     <TouchableOpacity  onPress={()=>{navigatetoGoogleMaps("dropoff")}}  style={{width:"20%",height:"100%",padding:5,alignItems:"center",justifyContent:"center"}} >
  
//     <Image  source={require("../../../assets/Navigate/navigate.png")} style={{width:35,height:35,opacity:0.8}} />
    
//    <theme.Text  style={{fontSize:14,color:theme.color.buttonLinerGC1,fontFamily:theme.fonts.fontMedium}}> 
//     START
//    </theme.Text>
  
//    </TouchableOpacity>
    
  
//         </View>


//        <View style={{width:wp("95%"),borderRadius:10,padding:10,marginTop:5,backgroundColor:"white",elevation:3,flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
    
//     <View style={{flexDirection:"row",alignItems:"center"}}>
//    <theme.Text   style={{fontSize:14,color:"black",fontFamily:theme.fonts.fontMedium}}> 
//     Waiting Time
//    </theme.Text>

//    <CountDown
//         size={10}
//         style={{marginLeft:5}}
//         until={waitTime}  //num of second
//         onFinish={() => {}}
//         onChange={(t)=>{setct(t)}}
//         digitStyle={{backgroundColor: '#FFF', borderWidth: 0, borderColor:theme.color.buttonLinerGC1}}
//         digitTxtStyle={{color: textcolor ,fontSize:14}}
//         timeLabelStyle={{color: 'red', fontWeight: 'bold'}}
//         separatorStyle={{color: '#1CC625'}}
//         timeToShow={['M', 'S']}
//         timeLabels={{m: null, s: null}}
//         showSeparator
//       />

//    </View> 

//    <TouchableOpacity
//    disabled={bbc=="gray"?true:false}
//    onPress={()=>{cancelJob()}}
//    style={{backgroundColor:bbc,width:90,height:30,borderRadius:5,alignItems:"center",justifyContent:"center"}}>
//    <theme.Text   style={{fontSize:12,color:"white",fontFamily:theme.fonts.fontMedium}}> 
//     CANCEL JOB
//    </theme.Text>
//    </TouchableOpacity>

//         </View>
 
      
//         </View>

  
//       )
//      }

//      //when start ride
//      if(arrive && startride && accept && !endride){
//       const str=request.dropoffLocation.name
//       const title=str.substr(0, str.indexOf(',')); 
//       const title2= str.substr(str.indexOf(",") + 1)
  
//       console.log("pl1 : ",request.pickupLocation.name)
//       console.log("pl2 : ",request.dropoffLocation.name)

//       fetchDistanceBetweenPointsOnline(
//          cl.latitude,
//          cl.longitude,
//         request.dropoffLocation.region.latitude,
//         request.dropoffLocation.region.longitude,
//         "startride")
     
//       return(

//         <View style={{position:"absolute",top:0,left:10,right:10}}> 


// <View style={{width:wp("80%"),height:80,borderRadius:10,padding:5,backgroundColor:"white",elevation:3,flexDirection:"row",alignItems:"center"}}>
     
//      <View style={{width:"79.5%",height:"100%",padding:5,marginTop:20}}>
//     <theme.Text  numberOfLines={1} ellipsizeMode="tail" style={{fontSize:17,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20}}> 
//     {title}
//    </theme.Text>  
//    <theme.Text  numberOfLines={1} ellipsizeMode="tail" style={{fontSize:14,color:"gray",lineHeight:20}}> 
//     {title2}
//    </theme.Text> 
//      </View>
  
//      <View style={{backgroundColor:"silver",width:"0.5%",height:"100%",opacity:0.4}} />
  
   
//     <TouchableOpacity  onPress={()=>{navigatetoGoogleMaps("dropoff")}}  style={{width:"20%",height:"100%",padding:5,alignItems:"center",justifyContent:"center"}} >
  
//     <Image  source={require("../../../assets/Navigate/navigate.png")} style={{width:35,height:35,opacity:0.8}} />
    
//    <theme.Text  style={{fontSize:14,color:theme.color.buttonLinerGC1,fontFamily:theme.fonts.fontMedium}}> 
//     START
//    </theme.Text>
  
//    </TouchableOpacity>
    
  
//         </View>


//    <View style={{width:wp("95%"),borderRadius:10,paddingVertical:2,paddingHorizontal:5,marginTop:5,backgroundColor:"white",elevation:3,flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
    
//    <View style={{alignItems:"center",justifyContent:"center",width:"49.5%"  }}>
//    <theme.Text   style={{fontSize:16,color:"gray",fontFamily:theme.fonts.fontMedium,textTransform:"uppercase"}}> 
//     Travel Time
//    </theme.Text>
//    <theme.Text   style={{fontSize:14,color:"black",fontFamily:theme.fonts.fontMedium,textTransform:"uppercase"}}> 
//     {tpd}
//    </theme.Text>
//    </View>

// <View style={{backgroundColor:"silver",width:"0.5%",height:"50%"}} />
 
//    <View style={{alignItems:"center",justifyContent:"center",width:"50%"  }}>
//    <theme.Text   style={{fontSize:16,color:"gray",fontFamily:theme.fonts.fontMedium,textTransform:"uppercase"}}> 
//     Total distance
//    </theme.Text>
//    <theme.Text   style={{fontSize:14,color:"black",fontFamily:theme.fonts.fontMedium,textTransform:"uppercase"}}> 
//    {dpd}
//    </theme.Text>
//    </View>

//     </View>
 
      
//         </View>

  
//       )
//      }

//      //when end ride
  
//   }
 
//   const clickArrivePickup=()=>{

//     Alert.alert(
//       "Confirmation",
//       "Are you sure you want arrive customer pickup location ?",
//       [
//         {
//           text: "No",
//           onPress: () => console.log("Cancel Pressed"),
//           style: "cancel"
//         },
//         { text: "Yes", onPress: () =>  {

//           if(isl==true){
//             setl(true);
//             setTimeout(() => {
//               if(trip.length>0){
//                 trip.map((e,i,a)=>{
//                 if(e.id==request.id){
//                   trip[i].arrive= true
//                   }
//                 })
//               }
//               setarrive(true) 
//               setl(false)
//               setcaptainwt(new Date())
//             }, 1500);
           
//             // getCurrentLocation("arrive")
//           }else if(isl==false){
//             utils.AlertMessage("","Please turn on location !")
//           }

         
//         } }
//       ]
//     );

   
//   }

//   const clickStartRide=()=>{

//     Alert.alert(
//       "Confirmation",
//       "Are you sure you want Start ride to reach customer droppoff location ?",
//       [
//         {
//           text: "No",
//           onPress: () => console.log("Cancel Pressed"),
//           style: "cancel"
//         },
//         { text: "Yes", onPress: () =>  {

//           if(isl==true){
//           setl(true);

//           var at = moment(captainwt, "hh:mm:ss a"); //arive for pickup start time
//           var crntTime = moment(new Date(), "hh:mm:ss a");
       
//           var duration = moment.duration(crntTime.diff(at));
       
//           var sec = parseInt(duration.asSeconds());  //arived to start w8 time
      
//         // console.log("w8 time :",sec)

//           setTimeout(() => {
//             if(trip.length>0){
//               trip.map((e,i,a)=>{
//               if(e.id==request.id){
//                 trip[i].startride=true
//                 trip[i].wait_time=sec
//                 trip[i].startRideTime=new Date()
//                 }
//               })
//             }

//             changerequest("startRide","","","",sec)

//            setstartride(true) 
//             setl(false);
//             setct(waitTime);
//             setcaptainwt(0);
//           }, 1500);
         
//           //  getCurrentLocation("ridestart")
//           }else if(isl==false){
//             utils.AlertMessage("","Please turn on location !")
//           }
            
//         } }
//       ]
//     );

   
//   }

//   const clickEndRide=()=>{

//     Alert.alert(
//       "Confirmation",
//       "Are you sure you want End ride ?",
//       [
//         {
//           text: "No",
//           onPress: () => console.log("Cancel Pressed"),
//           style: "cancel"
//         },
//         { text: "Yes", onPress: () =>  {
//            setl(true);
//           setTimeout(() => {
//             if(trip.length>0){
//               trip.map((e,i,a)=>{
//               if(e.id==request.id){
//                 trip[i].endride=true
//                 trip[i].endRideTime=new Date()
//                 }
//               })
//             }
//             changerequest("endRide")
//             setendride(true) 
//             setl(false);
//           }, 1500);
//         } }
//       ]
//     );
 
//   }
 
//   const clickFinish=()=>{
//     if(trip.length>0){
//       trip.map((e,i,a)=>{
//       if(e.id==request.id){
//         trip[i].finish=true //yani complete ho gya status
//         trip[i].userrate= starCount
//         }
//       })
//     }
//     changerequest("finish","","","","","","",starCount);
//     clearallFields()
//   }

//  const  clickCashSubmit=()=>{

//   if(parseFloat(cash)< parseFloat(request.rs)){
//    Alert.alert("Please donot enter cash  less than fare rupe ! ")
//   }else{
//     Alert.alert(
//       "Confirmation",
//       "Are you sure submit this amount ?",
//       [
//         {
//           text: "No",
//           onPress: () => console.log("Cancel Pressed"),
//           style: "cancel"
//         },
//         { text: "Yes", onPress: () =>  {
   
//            setl(true);
  
//            if(trip.length>0){
//             trip.map((e,i,a)=>{
//             if(e.id==request.id){
//               trip[i].normalPay=true
//               trip[i].collectcash=cash
//               }
//             })
//           }
//            changerequest("cash","","",cash);
  
//           setTimeout(() => {
//             setl(false);
//             setcash("")
//           }, 1200);
//         } }
//       ]
//     );
//   }

 

//  }

//  const renderIcon = (props) => (
 
//   <TouchableWithoutFeedback onPress={()=>setcash("")} >
//    <utils.vectorIcon.Entypo name="cross" size={22} color="gray" />
//   </TouchableWithoutFeedback>
// );

//   const  renderShowButton=()=>{
//     let msg=""
//     let c=0;

//     if(accept && !arrive && !startride && !endride){
//      msg="Arrived for pickup"
//      c=0;
//     }else if(accept && arrive && !startride && !endride){
//       msg="Start Ride"
//       c=1;
//     }else if(accept && arrive && startride && !endride){
//       msg="End trip"
//       c=2;
//     }else if(accept && arrive && startride && endride){
    
//       if(request.cardPay==true )
//       {
//         msg="Finish"
//         c=3
//       }
      
//       if(request.cardPay==false)
//       {
//       msg="submit"
//        c=4  
//       }

//       if(request.normalPay==true )
//       {
//         msg="Finish"
//         c=5
//       }
      
//     }
//  //if card pay done already
//    if(c==3){
//     return(

//       <View style={{position:"absolute",bottom:0,width:wp("95%"),alignSelf:"center",padding:10}}>
      
 
//         <View style={{backgroundColor:"white",width:"100%",borderRadius:4,padding:10,marginBottom:10,elevation:5,flexDirection:"row"}}>
       
//        <View style={{marginTop:-4}}>
//        <utils.vectorIcon.SimpleLineIcons name="credit-card" color="black" size={30} />
//        </View>
       
//        <View style={{marginLeft:10,width:"85%"}}> 
      
//        <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:20,fontFamily:theme.fonts.fontMedium,color:"black",lineHeight:25}}>
//         Trip paid by card
//        </theme.Text>
      
//        <theme.Text  style={{fontSize:16,fontFamily:theme.fonts.fontMedium,color:"gray",marginTop:10}}>
//         You can view yours earnings in captain portal.
//        </theme.Text>
      
//        </View>
       
//       </View>
      
//       <View style={{backgroundColor:"white",width:"100%",borderRadius:4,padding:10,marginBottom:10,elevation:5}}>
//        <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:22,fontFamily:theme.fonts.fontMedium,color:"black",textTransform:"capitalize",lineHeight:25}}>
//         Rate {request.name}
//        </theme.Text>
      
//        <StarRating
//                containerStyle={{marginVertical:15}}
//               disabled={false}
//               maxStars={5}
//               starStyle={{borderWidth:0}}
//               fullStarColor={theme.color.buttonLinerGC1}
//               rating={starCount}
//               selectedStar={(rating) => setstarCount(rating)}
//             />
      
//       </View>
      
//             <TouchableOpacity onPress={()=>{clickFinish()}} style={[styles.BottomButton,{width:"100%"}]}>
//             <LinearGradient colors={[theme.color.buttonLinerGC1,theme.color.buttonLinerGC2]} style={styles.LinearGradient}>
//                     <View style={[styles.ButtonRight,{width:"100%"}]}>
//                     <Text style={styles.buttonText}>{msg}</Text> 
//                      </View>
//              </LinearGradient>
//              </TouchableOpacity>
   
//       </View>
      
//           )
 
//    }
//    //if colect cash in hand
//    else if(c==4){

//     return(

//       <View style={{position:"absolute",bottom:0,width:wp("95%"),alignSelf:"center",padding:10}}>
      
 
//         <View style={{backgroundColor:"white",width:"100%",borderRadius:4,padding:10,marginBottom:10,elevation:5}}>
       
      
      
//        <theme.Text  style={{fontSize:20,fontFamily:theme.fonts.fontMedium,color:"black" }}>
//         Collect cash
//        </theme.Text>
      
//        <theme.Text numberOfLines={1} ellipsizeMode="tail"  style={{fontSize:16,fontFamily:theme.fonts.fontMedium,color:"gray",textTransform:"capitalize",lineHeight:20,width:"95%"}}>
//         from {request.name}
//        </theme.Text>

//        <View style={{flexDirection:"row",alignItems:"center",width:"100%",justifyContent:"space-between",marginTop:20}}>

//        <theme.Text  style={{fontSize:16,fontFamily:theme.fonts.fontMedium,color:"gray",textTransform:"capitalize",lineHeight:20}}>
//         Total fare
//        </theme.Text>

// <View style={{flexDirection:"row",alignItems:"center"}}>
// <theme.Text  style={{fontSize:22,fontFamily:theme.fonts.fontMedium,color:"gray" }}>
//         PKR
// </theme.Text>
// <theme.Text  style={{fontSize:22,fontFamily:theme.fonts.fontMedium,color:"black",marginLeft:5}}>
//          400
//  </theme.Text>

// </View>
        
       
      

//        </View>
      
//        </View>
       
       
//       <View style={{backgroundColor:"white",width:"100%",borderRadius:4,padding:10,marginBottom:10,elevation:5}}>
//        <theme.Text   style={{fontSize:20,fontFamily:theme.fonts.fontMedium,color:"black",lineHeight:25}}>
//        Enter amount collected
//        </theme.Text>
   
//       <Input
//       value={cash}
//       keyboardType="number-pad"
//       label=''
//       placeholder={"0"}
//       accessoryRight={cash!=""?renderIcon:""}
//       onChangeText={nextValue => setcash(nextValue)}
//     />
     
      
//       </View>
      
//             <TouchableOpacity disabled={cash==""?true:false} onPress={()=>{clickCashSubmit()}} style={[styles.BottomButton,{width:"100%"}]}>
//             <LinearGradient colors={[theme.color.buttonLinerGC1,theme.color.buttonLinerGC2]} style={styles.LinearGradient}>
//                     <View style={[styles.ButtonRight,{width:"100%"}]}>
//                     <Text style={[styles.buttonText,{color:cash==""?"silver":"white"}]}>{msg}</Text> 
//                      </View>
//              </LinearGradient>
//              </TouchableOpacity>
   
//       </View>
      
//           )

//    }
//    //done submit cash
//    else  if(c==5){
//     return(

//       <View style={{position:"absolute",bottom:0,width:wp("95%"),alignSelf:"center",padding:10}}>
      
 
//         <View style={{backgroundColor:"white",width:"100%",borderRadius:4,padding:10,marginBottom:10,elevation:5,flexDirection:"row"}}>
       
//        <View style={{marginTop:-4}}>
//        <utils.vectorIcon.MaterialIcons name="payments" color="black" size={30} />
//        </View>
       
//        <View style={{marginLeft:10,width:"85%"}}> 
      
//        <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:20,fontFamily:theme.fonts.fontMedium,color:"black",lineHeight:25}}>
//         Route eranings
//        </theme.Text>
      
//        <theme.Text  style={{fontSize:16,fontFamily:theme.fonts.fontMedium,color:"gray",marginTop:10}}>
//         You can view yours earnings in captain portal.
//        </theme.Text>
      
//        </View>
       
//       </View>
      
//       <View style={{backgroundColor:"white",width:"100%",borderRadius:4,padding:10,marginBottom:10,elevation:5}}>
//        <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:22,fontFamily:theme.fonts.fontMedium,color:"black",textTransform:"capitalize",lineHeight:25}}>
//         Rate {request.name}
//        </theme.Text>
      
//        <StarRating
//                containerStyle={{marginVertical:15}}
//               disabled={false}
//               maxStars={5}
//               starStyle={{borderWidth:0}}
//               fullStarColor={theme.color.buttonLinerGC1}
//               rating={starCount}
//               selectedStar={(rating) => setstarCount(rating)}
//             />
      
//       </View>
      
//             <TouchableOpacity onPress={()=>{clickFinish()}} style={[styles.BottomButton,{width:"100%"}]}>
//             <LinearGradient colors={[theme.color.buttonLinerGC1,theme.color.buttonLinerGC2]} style={styles.LinearGradient}>
//                     <View style={[styles.ButtonRight,{width:"100%"}]}>
//                     <Text style={styles.buttonText}>{msg}</Text> 
//                      </View>
//              </LinearGradient>
//              </TouchableOpacity>
   
//       </View>
      
//           )
 
//    } 
//    else{
//     return(
//       <View style={{position:"absolute",bottom:0,width:wp("95%"),alignSelf:"center",padding:10 ,flexDirection:"row",justifyContent:"space-between"}}>

//       <TouchableOpacity onPress={()=>{c==0?clickArrivePickup():c==1?clickStartRide():c==2?clickEndRide():{}}} style={styles.BottomButton}>
//   		<LinearGradient colors={[theme.color.buttonLinerGC1,theme.color.buttonLinerGC2]} style={styles.LinearGradient}>
//   			  		<View style={styles.ButtonRight}>
//               <Text style={styles.buttonText}>{msg}</Text> 
//  			      	</View>
//  			</LinearGradient>
//  			</TouchableOpacity>

//        <TouchableOpacity
//        onPress={()=>{settripdetailmodal(!tripdetailmodal)}}
//        style={{width:"12%",backgroundColor:"white",borderRadius:4,height:45,elevation:5,alignItems:"center",justifyContent:"center"}}>
//        <utils.vectorIcon.Entypo  name="dots-three-vertical"  color={"gray"} size={30} />
//        </TouchableOpacity>



//       </View>
//     )
//    } 
 
//   }
   
//   const currentMarker=(reg)=>{
//     return(
//     <Marker 
//     title={'Current location'}
//     description={'users current location'}
    
//     coordinate={reg} pinColor="green">
//     <utils.vectorIcon.MaterialCommunityIcons name="car-hatchback" color="green" size={30} />
//     </Marker>
//     )
//   }

//   const pickupMarker=(mark)=>{
//     return(
//     <Marker  draggable  coordinate={mark} pinColor="green">
//       <View style={{width:30,height:30,borderRadius:15,borderWidth:1,borderColor:theme.color.buttonLinerGC1,alignItems:"center",justifyContent:"center",backgroundColor:"white"}}>
//       <Image source={require("../../../assets/userPin.png")} style={{width:25,height:25}} />
//       </View>
//     </Marker>
//     )
//   }

//   const dropoffMarker=(mark)=>{
//     return(
//     <Marker  draggable  coordinate={mark} pinColor="green">
//       <View style={{width:25,height:25,borderRadius:12.5,borderWidth:1,borderColor:theme.color.buttonLinerGC1,alignItems:"center",justifyContent:"center",backgroundColor:"green"}}>
//    <utils.vectorIcon.Entypo name="location-pin" color="white" size={18}/>
//       </View>
//     </Marker>
//     )
//   }

//   const destinationMarker=()=>{
//     return(
//     <Marker    onPress={()=>setshowLoc(showLoc?false:true)}  draggable  coordinate={search.location} pinColor={theme.color.buttonLinerGC1}>
   
//      {/* {showLoc==true &&(
//    <View    style={{backgroundColor:"white",width:180,padding:5,bottom:10,borderRadius:5,position:"absolute"}}>
//   <theme.Text numberOfLines={6} ellipsizeMode="tail"  style={{fontSize:12,color:"black",width:"100%"}}>{search.name}</theme.Text>
//   </View>
//     )} */}
      
//       <TouchableOpacity  style={{width:25,height:25,borderRadius:12.5,borderWidth:1,borderColor:theme.color.buttonLinerGC1,alignItems:"center",justifyContent:"center",backgroundColor:theme.color.buttonLinerGC1}}>
//         <utils.vectorIcon.Entypo name="location-pin" color="white" size={18}/>
//       </TouchableOpacity>
  
//     </Marker>
//     )
//   }

//   const onChnageUserLoc=(e)=>{
//   // console.log("e : ",e.nativeEvent.coordinate)

//   const window = Dimensions.get('window');
//   const { width, height }  = window
//   const LATITUD_DELTA = 0.0922
//   const LONGITUDE_DELTA = LATITUD_DELTA + (width / height) 

//   const r= 
//   {
//    latitude: e.nativeEvent.coordinate.latitude ,
//    longitude: e.nativeEvent.coordinate.longitude  ,
//    latitudeDelta:LATITUD_DELTA,
//    longitudeDelta: LONGITUDE_DELTA,
//  }

// setcl(r)

//   }
 
//   return(
//   <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>  
//      <MapView
//        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
//        style={styless.map}
//       //  region={region}
//        initialRegion={region}
//        ref={mapRef}
//       onUserLocationChange={(e)=>{onChnageUserLoc(e)}}
//       showsBuildings={true}
//       showsCompass={false}
//       showsUserLocation={true}
//       followsUserLocation={true}
//       zoomEnabled={true}
//       maxZoomLevel={100}
//       showsMyLocationButton={true}
//      >

// {currentMarker(cl!=""?cl:region)}
// {(!accept && search!="") && destinationMarker() }
// {(accept && !arrive) &&   pickupMarker(request.pickupLocation.region)}
// {(accept && arrive && !endride ) && dropoffMarker(request.dropoffLocation.region)}
//  {/* <Circle
//                       center={{
//                         latitude: region.latitude,
//                         longitude: region.longitude
//                       }}
//                       radius={10000}
//                       fillColor='rgba(0,0,0,0.2)'
//                       strokeWidth={0}
// /> */}
//      </MapView> 
 
//    {accept && tripdetailmodal &&  renderTripDetailModal()} 
//    {accept && renderShowLocation()}  
//    {accept && isInternet==false && isl &&<utils.TopMessage msg="Please connect internet" />}  
//    {accept && isl==false && isInternet  && <utils.TopMessage msg="Please turn on location" />}  
//    {accept && isInternet==false && isl==false &&(
//    <View>
//      <utils.TopMessage msg="Please connect internet" />
//     <View style={{marginTop:20}}>
//     <utils.TopMessage msg="Please turn on location" />
//     </View>
    
//      </View>
//      )}
//    {accept && renderShowButton()}
//  {!accept&&<Header   setActiveChecked={(t)=>setActiveChecked(t)}  propsH={props.propsH} />}
//  {!accept &&<SearchBox  Search={search} accept={accept} propsH={props.propsH} setSearch={(t)=>setsearch(t)} /> }
//  {(!accept && ridemodal==false ) && <Footer setridemodal={(c)=>setridemodal(c)} active={activeChecked}/>}
//  {(!accept &&  ridemodal) && renderRideRequestModal() }
//  <utils.Loader dark={true}  loader={l} />
//  </View>
// )
    
// }

// const styless = StyleSheet.create({
//   map: {
//     ...StyleSheet.absoluteFillObject,
//   },
//  });
  
