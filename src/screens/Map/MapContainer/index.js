import React ,{useEffect,useRef,useState,useCallback} from 'react';
import { StyleSheet,TouchableOpacity,View,Linking,SafeAreaView,Text,Modal, ImageBackground,Dimensions,Image,Alert,ScrollView,TouchableWithoutFeedback} from 'react-native';
import styles from './styles';
import theme from "../../../themes/index"
import utils from "../../../utils/index"
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { inject, observer } from "mobx-react"; 
import MapView, { PROVIDER_GOOGLE,Marker,Circle } from 'react-native-maps';
import SearchBox from "../SearchBox/index"
import Header from '../Header/index';
import Footer from "../Footer/index"
import * as Progress from 'react-native-progress';
import LinearGradient from 'react-native-linear-gradient';
import call from 'react-native-phone-call'
import CountDown from 'react-native-countdown-component';
import moment from "moment";
import StarRating from 'react-native-star-rating';
import {Input } from '@ui-kitten/components';
import { tr } from 'date-fns/locale';
import db from "../../../database/index"


const gapikey="AIzaSyAJeMjKbTTRvoZJe0YoJc48VhaqbtoTmug"
 
export default inject("userStore","generalStore","carStore","tripStore")(observer(MapContainer));
 

   function MapContainer (props)   {

    let waitTime=60     //  sec
    let cancelTime=40  //   sec  

    //before arrive after accept
    let ctnotcuttimeba=10  //2min or 120 sec no cut charges if captain cancel trip before 2 min so not cut charges otherwise cut charges
    let ctcfba=40
   
  //  ,request,changerequest,trip,settrip   //userstore
  const {cars,setCars} =  props.carStore;
  const { user,setUser,cl ,online,authToken,Logout} = props.userStore;
  const {request,changerequest,setrequest,accept,setaccept,atime,setatime} = props.tripStore;
  const {isInternet,isLocation} = props.generalStore;

  let isl=isLocation

  const [mr, setmr] = useState(false);

  
  const [ct, setct] = useState(waitTime);  //current time
  const [captainwt, setcaptainwt] = useState(0);  //captain w8 time

  // const [cl, setcl] = useState("");  //curent marker locaion 
  
  const [loader, setloader] = useState(false); //loading indctr in button
  const [l, setl] = useState(false); //loading 
 
  const [search,setsearch] = useState(""); //destntn adress st from google places
  const [showLoc,setshowLoc] = useState(false); //destntn adress st from google places

  const [activeChecked, setActiveChecked] = useState(online);

  const [tripdetailmodal,settripdetailmodal] = useState(false);
 

  // const [atime,setatime] = useState("");  //trip acept time jb acpt kr lya us k bad ktne time ho gya wo chk krta

  const [skip,setskip] = useState(false);

  // const [accept,setaccept] = useState(false);
  const [arrive,setarrive] = useState(false);
  const [startride,setstartride] = useState(false);
  const [endride,setendride] = useState(false);

  const [ridemodal,setridemodal] = useState(false);
  const [p,setp] = useState(0); //progress //0 to 10 sec after 10 sec skip/rjct click

  const [dcp,setdcp] = useState("..."); // distance from current loc to pickup location  reqst modal
  const [tcp,settcp] = useState("..."); // time from current loc to pickup location      reqesr modal

  const [dpd,setdpd] = useState("..."); // distance from    pickup location to dropofloce  startride true
  const [tpd,settpd] = useState("..."); // time from  pickup location to dropofloce  startride true
 
  const [nolpl,setnolpl] = useState(0); //numofline in pickup location in trip modal

  const [starCount,setstarCount] = useState(0);

 
  const [cash,setcash] = useState("");
 
  const mapRef = useRef();
  

  const clearallFields=()=>{
    settripdetailmodal(false)
    setridemodal(false);
    setaccept(false);
     setrequest(false)
    setarrive(false);
    setstartride(false);
    setendride(false);
    setp(0);
    setatime("");
    settcp("");
    setnolpl(0);
    
    // setcash("");
    // setstarCount(0);
    // setdcp("");
    // setdpd("");
    // settpd("");
    // settripdetailmodal(false);
    // setcaptainwt(0);
    // setct(waitTime);
  
  }


  useEffect(() => {
    if(request){
      setridemodal(true)
     } 
    }, [request])
   
  useEffect(() => {

    if(accept && !mr){

      let mark1={
        latitude:  cl.latitude,
        longitude: cl.longitude,
      }
    
      let mark2={
       latitude: request.pickup.location.latitude,
       longitude:request.pickup.location.longitude ,
      }
    
      mapRef?.current?.fitToCoordinates([mark1,mark2], 
          {  
          animated: true,
          edgePadding: 
          {top: 150,
          right:120,
          bottom: 150,
          left: 120}
            }
        
        );

    }

    if(!accept){
      setrequest(false)
    }

  }, [accept,mr])
 
 

  useEffect(() => {
     if(mr && cl!=""){
       mapRef?.current?.animateToCoordinate(cl,1000)
       setmr(false)
    }
  }, [mr,cl])


  const gotoCurrentLoc=()=>{ 
    mapRef?.current?.animateToCoordinate(cl,1000)
	}

  useEffect(() => {
   if(search!=""){

    let mark1={
      latitude:  cl.latitude,
      longitude: cl.longitude,
    }
  
    let mark2={
     latitude: search.location.latitude,
     longitude:search.location.longitude ,
    }
  
    mapRef?.current?.fitToCoordinates([mark1,mark2], 
      {  
      animated: true,
      edgePadding: 
      {top: 150,
        right:120,
        bottom: 150,
        left: 120}
      
        }
    
    );
  
   }else{
     
     gotoCurrentLoc()
   }
  }, [search])
 
 
useEffect(() => {
 
  if(ridemodal  || accept){

  const interval = setInterval(() => {
      setp(p+0.1)
  }, 1000);

  //15 second left to skip/accept trip
  if(p>=1.5){
      clearInterval(interval)
      onclickSkip()
      }

      if(skip || accept){
        clearInterval(interval)
      }

  return () => {
    clearInterval(interval)
   }

  }

   
}, [p,ridemodal,skip,accept])


  const fetchDistanceBetweenPointsOnline = (lat1, lng1, lat2, lng2,c) => {  
    var urlToFetchDistance = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins='+lat1+','+lng1+'&destinations='+lat2+'%2C'+lng2+'&key='+gapikey;
    fetch(urlToFetchDistance)
             .then(res => {
             return res.json()
  })
  .then(res => {

           
            
              var distanceString = res.rows[0].elements[0].distance.text;
              var timeString = res.rows[0].elements[0].duration.text;
              var timeSecond = res.rows[0].elements[0].duration.value;
            // console.log("distanceString : ",res.rows[0].elements[0])
            if(c=="requestride"){
              // setdcp(distanceString)
              settcp(timeString)
            }else if(c=="startride"){
              setdpd(distanceString)
              let s=timeSecond
              var travelTime = moment(new Date()).add(s, 'seconds').format('hh:mm A')
              settpd(travelTime)
              
 
              if(trip.length>0){
                trip.map((e,i,a)=>{
                if(e.id==request.id){
                  trip[i].total_distance=distanceString
                  trip[i].total_time=s
                  }
                })
              }

              changerequest("TotalDistancendTime","","","","",distanceString,s)

                    }

            
            // return distanceString;
    // Do your stuff here
  })
  .catch(error => {
            console.log("Problem occurred fetchdsistancematric : ",error);
  });
}
 
const onclickSkip=()=>{
   setskip(true);
   setrequest(false);
   setp(0);
   setridemodal(false);
   clearallFields() 
 
   setTimeout(() => {setskip(false)}, 1000); 
}

const onLogout=()=>{
  setCars(false) 
  Logout();
 }
   
const onClickAccept=()=>{
  
  if(isInternet){ 
    setl(true);  

    const bodyData={captain:user._id,vehicle:cars._id}
    const header=authToken;
    // method, path, body, header
    db.api.apiCall("put",db.link.acceptTrip+request._id,bodyData,header)
    .then((response) => {
          
           console.log("Update trip acpt response : " , response);
           setl(false);

          if(response.msg=="Invalid Token"){
            utils.AlertMessage("", response.msg ) ;
            onLogout();
            return;
            }
  
          if(response.success){
              utils.ToastAndroid.ToastAndroid_SB("Accept") 
              setaccept(true);
              setTimeout(() => {
              setridemodal(false)
              }, 1000);
              setatime(new Date()) 

              let mark1={
                latitude:  cl.latitude,
                longitude: cl.longitude,
              }
            
              let mark2={
              latitude: request.pickup.location.latitude,
              longitude:request.pickup.location.longitude ,
              }
            
              mapRef?.current?.fitToCoordinates([mark1,mark2], 
                  {  
                  animated: true,
                  edgePadding: 
                  {top: 50,
                  right:80,
                  bottom: 50,
                  left: 80}
                    }
                
                );

              return;
              }

           if(!response.success){
                utils.AlertMessage("",response.message)
               return;
               }
   

        return;
    }).catch((e) => {
         setl(false);
      //  utils.AlertMessage("","Network request failed");
       console.error("Update trip acept catch error : ", e)
      return;
    })
    

  }else{
    utils.AlertMessage("","Please connect internet")
  }
 
}

 
  const onTextLayout = useCallback(e => {
     setnolpl(e.nativeEvent.lines.length<=5?e.nativeEvent.lines.length:5)
}, []);

   const renderDOT=()=>{
  const dot = []
 for (let index = 0; index< nolpl-1; index++) {
    dot.push(<utils.vectorIcon.Entypo style={{marginTop:5}} name="dot-single" size={20} color="silver"/>)
}
return dot;
  }

  const callUser=(num)=>{
    const args = {
      number: num, // String value with the number to call
      prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call 
    }
    call(args).catch((e)=>{console.log("call error : ",e)})
  }

  const onClickcancelTrip=(r,wt,cf)=>{
    setl(true)
    const bodyData={
      cancellation_reason:r,
      waiting_time:wt,
      canceling_fee:cf
    }
    const rid=request._id
    const header=authToken;
    // method, path, body, header
    db.api.apiCall("put",db.link.cancelTrip+rid,bodyData,header)
    .then((response) => {
      console.log("Cancel trip response : " , response);
      setl(false); 

          if(response.success){
           clearallFields()
            utils.ToastAndroid.ToastAndroid_SB("Cancel") ;
          return;
           }
 
           if(!response.success){
                utils.AlertMessage("",response.message)
               return;
               }
   
        return;
    }).catch((e) => {     
      //  utils.AlertMessage("","Network request failed");
       console.error("Cancel trip   catch error : ", e);
       setl(false); 
      return;
    })


}

//after acpt nd before arrive
  const canceltripYes=()=>{

    if(isInternet){
     let ctt=new Date();
     let at=moment(atime).format("hh:mm:ss a");
     let ct=moment(ctt).format("hh:mm:ss a");
      
      var acptTime = moment(at, "HH:mm:ss a");
      var crntTime = moment(ct, "HH:mm:ss a");
      var duration = moment.duration(crntTime.diff(acptTime));
      var sec = parseInt(duration.asSeconds());
      let cf= sec<=ctnotcuttimeba ? 0 : ctcfba;
     
     
       onClickcancelTrip("Emergency (Canceling before arrive)",sec,cf)

    }else{
      utils.AlertMessage("","Please connect internet !")
    }
  
  }
  
  const cancelTrip=()=>{
    Alert.alert(
      "Confirmation",
      "Are you sure you want to cancel this trip ?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Yes", onPress: () =>  {canceltripYes()} }
      ]
    );
  }
  
  const cancelJob=()=>{
    Alert.alert(
      "Confirmation",
      "Are you sure you want to cancel this job ?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Yes", onPress: () =>  {cancelJobYes()} }
      ]
    );
  }
  
  const cancelJobYes=()=>{

    setl(true)

    var at = moment(captainwt, "hh:mm:ss a"); //arive for pickup start time
    var crntTime = moment(new Date(), "hh:mm:ss a");
 
    var duration = moment.duration(crntTime.diff(at));
 
    var sec = parseInt(duration.asSeconds());  //arived to start w8 time

    if(trip.length>0){
      trip.map((e,i,a)=>{
      if(e.id==request.id){
        trip[i].status= "cancel"
        trip[i].wait_time=sec
        trip[i].cancelStatus= "Paid";  //if wait time is over
        trip[i].cancelby= "captain";
        }
      })
    }
   
    changerequest("cancelPaid","","","",sec)
 
    setTimeout(() => {
      // setaccept(!accept);
      // setarrive(!arrive)
      // settcp("...")
      // setdcp("...")
      // setct(waitTime)
      clearallFields()
   setl(false)
      utils.ToastAndroid.ToastAndroid_SBC("JOb cancel success !")
    }, 1200);
  }
  
    const openMap = async (dest, label) => {

    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'https://www.google.com/maps/dir/?api=1&travelmode=driving&dir_action=navigate&destination='});
    let latLng = `${dest.latitude},${dest.longitude}`;
    
    const url = Platform.select({
      ios: `https://www.google.com/maps/?api=1&query=${label}&center=${lat},${long}`,
      android: `${scheme}${latLng}`
    });

    Linking.canOpenURL(url)
    .then((supported) => {
        if (!supported) {
           let browser_url =
            "https://www.google.de/maps/@" +
            dest.latitude +
            "," +
            dest.longitude +
            "?q=" +
            label;
            return Linking.openURL(browser_url);
        } else {
            return Linking.openURL(url);
        }
    })
    .catch((err) => console.log('error open google map', err));

  }

  const navigateGMaps=(c)=>{
    let dest=null;
    if(c=="dropoff"){
      dest={
        latitude: request.dropoff.location.latitude,
        longitude:request.dropoff.location.longitude}
    }
    if(c=="pickup"){
      dest={
        latitude: request.pickup.location.latitude,
        longitude:request.pickup.location.longitude}
    }
  
  openMap(dest,"");
  
  }

  const navigatetoGoogleMaps=(c)=>{
    Alert.alert(
      "Confirmation",
      "Are you sure you want to navigate through google maps ?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Yes", onPress: () =>  {navigateGMaps(c)} }
      ]
    );
  }

    const renderShowLocation=()=>{

      //when acpt jon
      if(!arrive&& !startride && accept && !endride){
       
        
        const title=request.pickup.name 
        const title2=request.pickup.address
    
        return(
       <View style={{position:"absolute",top:0,width:wp("80%"),borderRadius:10,padding:5,backgroundColor:"white",left:10,elevation:3,flexDirection:"row",alignItems:"center"}}>
      
       <View style={{width:"79.5%",height:"100%",padding:5,marginTop:20}}>
      <theme.Text  numberOfLines={1} ellipsizeMode="tail" style={{fontSize:17,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20}}> 
      {title}
     </theme.Text>  
     <theme.Text  numberOfLines={1} ellipsizeMode="tail" style={{fontSize:14,color:"gray",lineHeight:20}}> 
      {title2}
     </theme.Text> 
       </View>
    
       <View style={{backgroundColor:"silver",width:"0.5%",height:"100%",opacity:0.4}} />
    
     
      <TouchableOpacity  onPress={()=>{navigatetoGoogleMaps("pickup")}}  style={{width:"20%",height:"100%",padding:5,alignItems:"center",justifyContent:"center"}} >
    
      <Image  source={require("../../../assets/Navigate/navigate.png")} style={{width:35,height:35,opacity:0.8}} />
      
     <theme.Text  style={{fontSize:14,color:theme.color.buttonLinerGC1,fontFamily:theme.fonts.fontMedium}}> 
      START
     </theme.Text>
    
     </TouchableOpacity>
      
    
          </View> 
        )
      }

      //when acpt arrived
//      if (accept && arrive && !startride  && !endride){
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


//when start ride
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

  
  }
 
  const clickArrivePickup=()=>{

    // Alert.alert(
    //   "Confirmation",
    //   "Are you sure you want arrive customer pickup location ?",
    //   [
    //     {
    //       text: "No",
    //       onPress: () => console.log("Cancel Pressed"),
    //       style: "cancel"
    //     },
    //     { text: "Yes", onPress: () =>  {

    //       if(isl==true){
    //         setl(true);
    //         setTimeout(() => {
    //           if(trip.length>0){
    //             trip.map((e,i,a)=>{
    //             if(e.id==request.id){
    //               trip[i].arrive= true
    //               }
    //             })
    //           }
    //           setarrive(true) 
    //           setl(false)
    //           setcaptainwt(new Date())
    //         }, 1500);
           
    //         // getCurrentLocation("arrive")
    //       }else if(isl==false){
    //         utils.AlertMessage("","Please turn on location !")
    //       }

         
    //     } }
    //   ]
    // );

   
  }

  const clickStartRide=()=>{

    // Alert.alert(
    //   "Confirmation",
    //   "Are you sure you want Start ride to reach customer droppoff location ?",
    //   [
    //     {
    //       text: "No",
    //       onPress: () => console.log("Cancel Pressed"),
    //       style: "cancel"
    //     },
    //     { text: "Yes", onPress: () =>  {

    //       if(isl==true){
    //       setl(true);

    //       var at = moment(captainwt, "hh:mm:ss a"); //arive for pickup start time
    //       var crntTime = moment(new Date(), "hh:mm:ss a");
       
    //       var duration = moment.duration(crntTime.diff(at));
       
    //       var sec = parseInt(duration.asSeconds());  //arived to start w8 time
      
    //     // console.log("w8 time :",sec)

    //       setTimeout(() => {
    //         if(trip.length>0){
    //           trip.map((e,i,a)=>{
    //           if(e.id==request.id){
    //             trip[i].startride=true
    //             trip[i].wait_time=sec
    //             trip[i].startRideTime=new Date()
    //             }
    //           })
    //         }

    //         changerequest("startRide","","","",sec)

    //        setstartride(true) 
    //         setl(false);
    //         setct(waitTime);
    //         setcaptainwt(0);
    //       }, 1500);
         
    //       //  getCurrentLocation("ridestart")
    //       }else if(isl==false){
    //         utils.AlertMessage("","Please turn on location !")
    //       }
            
    //     } }
    //   ]
    // );

   
  }

  const clickEndRide=()=>{

    // Alert.alert(
    //   "Confirmation",
    //   "Are you sure you want End ride ?",
    //   [
    //     {
    //       text: "No",
    //       onPress: () => console.log("Cancel Pressed"),
    //       style: "cancel"
    //     },
    //     { text: "Yes", onPress: () =>  {
    //        setl(true);
    //       setTimeout(() => {
    //         if(trip.length>0){
    //           trip.map((e,i,a)=>{
    //           if(e.id==request.id){
    //             trip[i].endride=true
    //             trip[i].endRideTime=new Date()
    //             }
    //           })
    //         }
    //         changerequest("endRide")
    //         setendride(true) 
    //         setl(false);
    //       }, 1500);
    //     } }
    //   ]
    // );
 
  }
 
//   const clickFinish=()=>{
//     // if(trip.length>0){
//     //   trip.map((e,i,a)=>{
//     //   if(e.id==request.id){
//     //     trip[i].finish=true //yani complete ho gya status
//     //     trip[i].userrate= starCount
//     //     }
//     //   })
//     // }
//     // changerequest("finish","","","","","","",starCount);
//     // clearallFields()
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

  const  renderShowButton=()=>{
    let msg=""
    let c=0;

    if(accept && !arrive && !startride && !endride){
     msg="Arrived for pickup"
     c=0;
    }
    // else if(accept && arrive && !startride && !endride){
    //   msg="Start Ride"
    //   c=1;
    // }else if(accept && arrive && startride && !endride){
    //   msg="End trip"
    //   c=2;
    // }else if(accept && arrive && startride && endride){
    
    //   if(request.cardPay==true )
    //   {
    //     msg="Finish"
    //     c=3
    //   }
      
    //   if(request.cardPay==false)
    //   {
    //   msg="submit"
    //    c=4  
    //   }

    //   if(request.normalPay==true )
    //   {
    //     msg="Finish"
    //     c=5
    //   }
      
    // }

 //if card pay done already
  //  if(c==3){
  //   return(

  //     <View style={{position:"absolute",bottom:0,width:wp("95%"),alignSelf:"center",padding:10}}>
      
 
  //       <View style={{backgroundColor:"white",width:"100%",borderRadius:4,padding:10,marginBottom:10,elevation:5,flexDirection:"row"}}>
       
  //      <View style={{marginTop:-4}}>
  //      <utils.vectorIcon.SimpleLineIcons name="credit-card" color="black" size={30} />
  //      </View>
       
  //      <View style={{marginLeft:10,width:"85%"}}> 
      
  //      <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:20,fontFamily:theme.fonts.fontMedium,color:"black",lineHeight:25}}>
  //       Trip paid by card
  //      </theme.Text>
      
  //      <theme.Text  style={{fontSize:16,fontFamily:theme.fonts.fontMedium,color:"gray",marginTop:10}}>
  //       You can view yours earnings in captain portal.
  //      </theme.Text>
      
  //      </View>
       
  //     </View>
      
  //     <View style={{backgroundColor:"white",width:"100%",borderRadius:4,padding:10,marginBottom:10,elevation:5}}>
  //      <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:22,fontFamily:theme.fonts.fontMedium,color:"black",textTransform:"capitalize",lineHeight:25}}>
  //       Rate {request.name}
  //      </theme.Text>
      
  //      <StarRating
  //              containerStyle={{marginVertical:15}}
  //             disabled={false}
  //             maxStars={5}
  //             starStyle={{borderWidth:0}}
  //             fullStarColor={theme.color.buttonLinerGC1}
  //             rating={starCount}
  //             selectedStar={(rating) => setstarCount(rating)}
  //           />
      
  //     </View>
      
  //           <TouchableOpacity onPress={()=>{clickFinish()}} style={[styles.BottomButton,{width:"100%"}]}>
  //           <LinearGradient colors={[theme.color.buttonLinerGC1,theme.color.buttonLinerGC2]} style={styles.LinearGradient}>
  //                   <View style={[styles.ButtonRight,{width:"100%"}]}>
  //                   <Text style={styles.buttonText}>{msg}</Text> 
  //                    </View>
  //            </LinearGradient>
  //            </TouchableOpacity>
   
  //     </View>
      
  //         )
 
  //  }

   //if colect cash in hand
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

   //done submit cash
  //  else  if(c==5){
  //   return(

  //     <View style={{position:"absolute",bottom:0,width:wp("95%"),alignSelf:"center",padding:10}}>
      
 
  //       <View style={{backgroundColor:"white",width:"100%",borderRadius:4,padding:10,marginBottom:10,elevation:5,flexDirection:"row"}}>
       
  //      <View style={{marginTop:-4}}>
  //      <utils.vectorIcon.MaterialIcons name="payments" color="black" size={30} />
  //      </View>
       
  //      <View style={{marginLeft:10,width:"85%"}}> 
      
  //      <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:20,fontFamily:theme.fonts.fontMedium,color:"black",lineHeight:25}}>
  //       Route eranings
  //      </theme.Text>
      
  //      <theme.Text  style={{fontSize:16,fontFamily:theme.fonts.fontMedium,color:"gray",marginTop:10}}>
  //       You can view yours earnings in captain portal.
  //      </theme.Text>
      
  //      </View>
       
  //     </View>
      
  //     <View style={{backgroundColor:"white",width:"100%",borderRadius:4,padding:10,marginBottom:10,elevation:5}}>
  //      <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:22,fontFamily:theme.fonts.fontMedium,color:"black",textTransform:"capitalize",lineHeight:25}}>
  //       Rate {request.name}
  //      </theme.Text>
      
  //      <StarRating
  //              containerStyle={{marginVertical:15}}
  //             disabled={false}
  //             maxStars={5}
  //             starStyle={{borderWidth:0}}
  //             fullStarColor={theme.color.buttonLinerGC1}
  //             rating={starCount}
  //             selectedStar={(rating) => setstarCount(rating)}
  //           />
      
  //     </View>
      
  //           <TouchableOpacity onPress={()=>{clickFinish()}} style={[styles.BottomButton,{width:"100%"}]}>
  //           <LinearGradient colors={[theme.color.buttonLinerGC1,theme.color.buttonLinerGC2]} style={styles.LinearGradient}>
  //                   <View style={[styles.ButtonRight,{width:"100%"}]}>
  //                   <Text style={styles.buttonText}>{msg}</Text> 
  //                    </View>
  //            </LinearGradient>
  //            </TouchableOpacity>
   
  //     </View>
      
  //         )
 
  //  } 

  //  else{
    return(
      <View style={{position:"absolute",bottom:0,width:wp("95%"),alignSelf:"center",padding:10 ,flexDirection:"row",justifyContent:"space-between"}}>

      <TouchableOpacity onPress={()=>{c==0?clickArrivePickup():c==1?clickStartRide():c==2?clickEndRide():{}}} style={styles.BottomButton}>
  		<LinearGradient colors={[theme.color.buttonLinerGC1,theme.color.buttonLinerGC2]} style={styles.LinearGradient}>
  			  		<View style={styles.ButtonRight}>
              <Text style={styles.buttonText}>{msg}</Text> 
 			      	</View>
 			</LinearGradient>
 			</TouchableOpacity>

       <TouchableOpacity
       onPress={()=>{settripdetailmodal(!tripdetailmodal)}}
       style={{width:"12%",backgroundColor:"white",borderRadius:4,height:45,elevation:5,alignItems:"center",justifyContent:"center"}}>
       <utils.vectorIcon.Entypo  name="dots-three-vertical"  color={"gray"} size={30} />
       </TouchableOpacity>
 
      </View>
    )

  //  } 
 
  }

  const renderclIndactor=()=>{
  
    return(
      <TouchableOpacity   style={{position:"absolute",top:5,right:5,width:"12%",backgroundColor:"white",opacity:0.8,borderRadius:10,alignItems:"center",justifyContent:"center",paddingHorizontal:3,height:40}}   onPress={()=>gotoCurrentLoc()} >	 
      <utils.vectorIcon.MaterialIcons name="my-location" color="#0E47A1" size={27} />
      </TouchableOpacity>
    )
  }
   
  const renderTripDetailModal=()=>{
    return(
 
     <Modal 
     isVisible={tripdetailmodal}
     backdropOpacity={0.6}
     onRequestClose={() => { settripdetailmodal(!tripdetailmodal) }}
     >
     <View style=
     {{
     flex:1,
     backgroundColor:"white", 
     height:hp("100%"), 
     width:wp('100%'), 
     alignSelf: 'center'
     }}>
  

<View style={{flexDirection:"row",alignItems:"center",padding:10,backgroundColor:"black"}}>
 
 <TouchableOpacity onPress={()=>{settripdetailmodal(!tripdetailmodal)}}>
 <utils.vectorIcon.Entypo name="cross" size={30} color="white" />
 </TouchableOpacity>

<theme.Text style={{fontSize:18,fontFamily:theme.fonts.fontMedium,color:"white",marginLeft:15}}> 
     Trip details
  </theme.Text>
</View>

<View style={{backgroundColor:"white",elevation:5}}>
<View style={{borderBottomColor:theme.color.buttonLinerGC1,borderBottomWidth:2,width:150,marginTop:10,alignItems:"center",justifyContent:"center"}}>
<theme.Text style={{fontSize:16,fontFamily:theme.fonts.fontBold,color:theme.color.buttonLinerGC1}}> 
     CURRENT PICKUP
  </theme.Text>
  </View>
</View>
 
 
 <ScrollView contentContainerStyle={{flex:1}}>
 
 <View style={{flexDirection:"row",alignItems:"center",backgroundColor:"white",borderBottomColor:"silver",borderBottomWidth:0.5,paddingHorizontal:10,paddingVertical:20,justifyContent:"space-between"}}>

 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:20,fontFamily:theme.fonts.fontMedium,color:"balck",width:"78%",textTransform:"capitalize"}}> 
   {request.pickup.name}
  </theme.Text>

<TouchableOpacity onPress={()=>{callUser(request.customer.mobile_number)}}>
<View style={{width:60,height:60,alignItems:"center",justifyContent:"center",backgroundColor:theme.color.buttonLinerGC1,borderRadius:30}}>
<utils.vectorIcon.FontAwesome name="phone" color="white" size={25} />
</View>
</TouchableOpacity>

 </View>

 <View style={{flexDirection:"row",alignItems:"center",backgroundColor:"white",borderBottomColor:"silver",borderBottomWidth:0.5,padding:10}}>

 <utils.vectorIcon.AntDesign name="exclamationcircleo" color="silver" size={18} />
 <theme.Text numberOfLines={1}  ellipsizeMode="tail" style={{fontSize:18,color:"balck",width:"90%",textTransform:"capitalize",marginLeft:10}}> 
   {request.type.type}
  </theme.Text>
 
 </View>

<View style={{paddingHorizontal:10,paddingVertical:15,backgroundColor:"white",borderBottomColor:"silver",borderBottomWidth:0.5}}>

<View style={{flexDirection:"row"}}>
<View style={{alignItems:"center",justifyContent:"center"}}>
  <utils.vectorIcon.FontAwesome name="circle-thin" color="silver" size={18} />
  {nolpl>0 && renderDOT()}
  {request.dropoff.location && (
    <View>
    <utils.vectorIcon.Entypo style={{marginTop:5}} name="dot-single" size={20} color="silver"/>
    <utils.vectorIcon.Entypo style={{marginTop:5}} name="dot-single" size={20} color="silver"/>
    </View>
  )
  }
</View> 
<theme.Text numberOfLines={5} onTextLayout={onTextLayout} ellipsizeMode="tail" style={{marginTop:-5,fontSize:15,color:"balck",width:"90%",textTransform:"capitalize",marginLeft:10}}> 
  {request.pickup.name}
 </theme.Text>
</View>
  
 
<View style={{flexDirection:"row"}}>
<utils.vectorIcon.FontAwesome name="circle" color="silver" size={18} style={{marginLeft:2}}   />
<theme.Text numberOfLines={5}  ellipsizeMode="tail" style={{marginTop:-5,fontSize:15,color:"balck",width:"90%",textTransform:"capitalize",marginLeft:12.5}}> 
  {request.dropoff.name}
 </theme.Text>
 </View>

 

</View>

{ct>cancelTime&&(
  <TouchableOpacity onPress={()=>{cancelTrip()}}>
<View style={{backgroundColor:"white",flexDirection:"row",padding:10}}>
<utils.vectorIcon.Entypo name="circle-with-cross" color="silver" size={20} />

 <View style={{marginLeft:10,width:"90%"}}>
 <theme.Text  style={{fontFamily:theme.fonts.fontMedium,fontSize:16,color:"red"}}> 
  CANCEL TRIP
 </theme.Text>
 <theme.Text  style={{fontFamily:theme.fonts.fontMedium,fontSize:14,color:"silver"}}> 
  Canceling now will lower your completion rate
 </theme.Text>
 </View>
 
</View>
</TouchableOpacity>
)}

  
 </ScrollView>
  
 
     </View>
   </Modal>
    )
  }

  const  renderRideRequestModal=()=>{
  
    fetchDistanceBetweenPointsOnline(
    cl.latitude,
    cl.longitude,
    request.pickup.location.latitude,
    request.pickup.location.longitude,
    "requestride")
  
      
    return(
      <Modal
      animationType='fade'
      transparent={true}
      visible={ridemodal}>
  
  <View style={{ flex: 1, backgroundColor:'rgba(0,0,0.2,0.9)', justifyContent: 'center', alignItems: 'center' }}>
    
<View style={{flexDirection:"row",justifyContent:"space-between",width:wp("90%")}}>

 <theme.Text   style={{fontSize:16,color:"white"}}> 
 Intercity Trip
 </theme.Text>

<TouchableOpacity onPress={()=>{onclickSkip()}}>
 <theme.Text   style={{fontSize:16,color:"white"}}> 
 Skip
 </theme.Text>
 </TouchableOpacity>

</View>
 
<View style={{backgroundColor:"white",width:wp("90%"),height:hp("80%"),borderRadius:10,marginTop:30}}>
<ImageBackground  blurRadius={2} source={require("../../../assets/map.jpeg")} style={{flex:1,borderRadius:10}} >

<TouchableOpacity onPress={()=>{onclickSkip()}}>
<View style={{backgroundColor:"white",borderRadius:10,flexDirection:"row",alignItems:"center",justifyContent:"center",width:90,height:30,marginTop:10,marginLeft:10}}>
<utils.vectorIcon.Entypo name="circle-with-cross" color={theme.color.mainPlaceholderColor} size={20}/>
<theme.Text   style={{fontSize:15,color:theme.color.mainPlaceholderColor}}> 
Reject
 </theme.Text>
</View>
</TouchableOpacity>

<View style={{flex:1,marginTop:50}}>
 
<View style={{backgroundColor:"white",borderRadius:10 ,padding:5,width:180,position:"absolute",right:10,elevation:5}}>
<theme.Text   style={{fontSize:12,color:theme.color.buttonLinerGC1,fontFamily:theme.fonts.fontBold}}> 
Dropoff
 </theme.Text>

 <theme.Text numberOfLines={3} ellipsizeMode="tail"   style={{fontSize:13,color:"black",fontFamily:theme.fonts.fontMedium,width:"100%",textTransform:"capitalize"}}> 
 {request.dropoff.name}
 </theme.Text>
</View>

<View style={{backgroundColor:theme.color.buttonLinerGC1,borderRadius:10,padding:5,width:180,position:"absolute",left:10,top:110,elevation:5}}>
<theme.Text   style={{fontSize:12,color:"white",fontFamily:theme.fonts.fontBold}}> 
Pickup
 </theme.Text>

 <theme.Text numberOfLines={3} ellipsizeMode="tail"   style={{fontSize:13,color:"white",fontFamily:theme.fonts.fontMedium,width:"100%",textTransform:"capitalize"}}> 
  {request.pickup.name}
 </theme.Text>
</View>

</View>


<View style={{backgroundColor:"white",width:"95%",height:220,alignSelf:"center",borderRadius:10,position:"absolute",bottom:10,elevation:5,padding:5}}>


<View style={{backgroundColor:"white",padding:5,marginTop:-20,alignSelf:"center",borderRadius:10,elevation:1}}>
<theme.Text numberOfLines={1} ellipsizeMode="tail"   style={{fontSize:14,color:"black",fontFamily:theme.fonts.fontMedium}}> 
{tcp} | {request.distance} km
 </theme.Text>
</View>
 
<View style={{flexDirection:"row",alignItems:"center",justifyContent:"center",padding:5,width:"100%",height:"25%"}}>

  <View style={{backgroundColor:"silver",width:40,height:40,borderRadius:20,alignItems:"center",justifyContent:"center"}}>
  <utils.vectorIcon.MaterialIcons name="location-searching" size={25} color="blue"/>
  </View>

  <theme.Text  numberOfLines={1} ellipsizeMode="tail"  style={{fontSize:17,marginLeft:10,color:"black",fontFamily:theme.fonts.fontMedium,textTransform:"capitalize",width:"83%"}}> 
  Intercity - Islamabad
 </theme.Text>

</View>


<View style={{flexDirection:"row",alignItems:"center",justifyContent:"center",padding:5,width:"100%",height:"35%"}}>
{/* custmr rating  */}
<View style={{width:"27%",flexDirection:"row",alignItems:"center",justifyContent:"space-evenly"}}>
<utils.vectorIcon.Entypo name="user" color="silver" size={18}/>
<Text style={{fontSize:14}}>3.0</Text> 
<utils.vectorIcon.Entypo name="star" color={theme.color.buttonLinerGC1} size={18}/>
</View>

<View style={{width:"73%",flexDirection:"row",alignItems:"center",justifyContent:"space-evenly"}}>
<theme.Text numberOfLines={1} ellipsizeMode="tail"  style={{fontSize:14,color:"silver",fontFamily:theme.fonts.fontMedium,textTransform:"capitalize",width:"95%"}}> 
  Earn: <theme.Text  style={{fontSize:14,color:"black",fontFamily:theme.fonts.fontMedium,textTransform:"capitalize"}}>{request.rent} pkr | cash</theme.Text>
 </theme.Text>
</View>
  

</View>

  
<TouchableOpacity style={{alignItems:"center",justifyContent:"center",padding:5,width:"100%",height:"33%"}} 
onPress={()=>{onClickAccept()}}>
<theme.Text   style={{fontSize:14,color:theme.color.buttonLinerGC1,fontFamily:theme.fonts.fontBold}}> 
 Tap to accept
 </theme.Text>
 
 <Progress.Bar animated style={{position:"absolute",bottom:0}} progress={p}  color={theme.color.buttonLinerGC1} width={300} />
</TouchableOpacity>
  
</View>


</ImageBackground>
    </View>

      </View>
  
    </Modal>
    )
}

  //markers

  const currentMarker=()=>{
    return(
    <Marker 
    title={'your current location'}
    description={''}
    coordinate={cl} pinColor="green">

       <View style={{alignItems:"center",justifyContent:"center"}}>

  {!isInternet &&(
	<View style={{backgroundColor:"white",paddingHorizontal:5,paddingVertical:3,elevation:5,alignSelf:"center"}}>
     <Text style={{fontSize:12,color:"black",borderRadius:5}}>No internet connection !</Text>
	</View>
)}
 
      <utils.vectorIcon.MaterialCommunityIcons name="car-hatchback" color="green" size={30} />
 </View>

    </Marker>
    )
  }

  const destinationMarker=()=>{
    return(
    <Marker    
    title={'Destination marker'}
    description={search.name}
      draggable  coordinate={search.location} pinColor={theme.color.buttonLinerGC1}>

  

      <TouchableOpacity  style={{width:25,height:25,borderRadius:12.5,borderWidth:1,borderColor:theme.color.buttonLinerGC1,alignItems:"center",justifyContent:"center",backgroundColor:theme.color.buttonLinerGC1}}>
        <utils.vectorIcon.Entypo name="location-pin" color="white" size={18}/>
      </TouchableOpacity>
   
 
  
    </Marker>
    )
  }
 
  const pickupMarker=(mark)=>{
    return(
    <Marker 
    title={'customer pickup location'}
    description={''}
    draggable  coordinate={mark} pinColor="green">
      <View style={{width:30,height:30,borderRadius:15,borderWidth:1,borderColor:theme.color.buttonLinerGC1,alignItems:"center",justifyContent:"center",backgroundColor:"white"}}>
      <Image source={require("../../../assets/userPin.png")} style={{width:25,height:25}} />
      </View>
    </Marker>
    )
  }

  const dropoffMarker=(mark)=>{
    return(
    <Marker 
    title={'customer dropoff location'}
    draggable  coordinate={mark} pinColor="green">
      <View style={{width:25,height:25,borderRadius:12.5,borderWidth:1,borderColor:theme.color.buttonLinerGC1,alignItems:"center",justifyContent:"center",backgroundColor:"green"}}>
   <utils.vectorIcon.Entypo name="location-pin" color="white" size={18}/>
      </View>
    </Marker>
    )
  }
 
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

 
  return(
  <SafeAreaView style={{flex:1}}>  
    
     <MapView
       provider={PROVIDER_GOOGLE} // remove if not using Google Maps
       style={styless.map}
      initialRegion={{ 
        latitude: 37.78825,
				longitude: -122.4324,
				latitudeDelta: 0.0922,
			longitudeDelta: 0.0421}}
      ref={mapRef}
      onMapReady={()=>setmr(true)}
      showsBuildings={true}
      showsCompass={false}
      zoomEnabled={true}
      maxZoomLevel={100}
     >

{cl!="" && currentMarker()}
{(!accept && search!="") && destinationMarker() }
{(accept && !arrive  && request) &&   pickupMarker(request.pickup.location)}
{(accept && arrive && !endride && request ) && dropoffMarker(request.dropoff.location)}
 
 {/* <Circle
                      center={{
                        latitude: region.latitude,
                        longitude: region.longitude
                      }}
                      radius={10000}
                      fillColor='rgba(0,0,0,0.2)'
                      strokeWidth={0}
/> */}

     </MapView> 
    
{accept && isl==false  && <utils.TopMessage msg="Please turn on location" />}    
{accept && tripdetailmodal &&  renderTripDetailModal()} 
{accept && renderShowLocation()} 
{accept && renderclIndactor()} 
{accept && renderShowButton()}

{!accept&&<Header setLoader={(c)=>setl(c)}  setActiveChecked={(t)=>setActiveChecked(t)}  propsH={props.propsH} />}
{!accept &&<SearchBox gotoCurrentLoc={()=>gotoCurrentLoc()}  Search={search} accept={accept} propsH={props.propsH} setSearch={(t)=>setsearch(t)} /> }
{(!accept && ridemodal==false ) && <Footer   active={activeChecked}/>}
{(!accept &&  ridemodal==true) && renderRideRequestModal() }

 <utils.Loader   loader={l} />
 
 </SafeAreaView>
)
    
}

const styless = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
 });
  