import React ,{useEffect,useRef,useState} from 'react';
import {Platform,Dimensions,Alert,TouchableOpacity,View} from 'react-native';
import utils from "../../../utils/index"
import LinearGradient from 'react-native-linear-gradient';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import GVs from '../../../store/Global_Var';
import { inject, observer } from "mobx-react"; 
import MapContainer from '../../Map/MapContainer/index';
import { Container,NativeBaseProvider, } from 'native-base';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Geolocation from '@react-native-community/geolocation';
import theme  from "../../../themes/index";
import ConnectivityManager from 'react-native-connectivity-status'
  
export default inject("store")(observer(Home));
  
 function Home (props)   {
  const {setisl} = props.store;
  const [loaderT,setloaderT]=useState(false);
  const [position,setposition]=useState("");
  const [region,setregion]=useState("");
  const [err,seterr]=useState("");

  let watchID=null;

   
//   const subscribeLocation = () => {
//     watchID= Geolocation.watchPosition((position) => 
//     {
//       //  console.log("geo location wathc postn then  : ",position);
    
//      const window = Dimensions.get('window');
//      const { width, height }  = window
//      const LATITUD_DELTA = 0.0922
//      const LONGITUDE_DELTA = LATITUD_DELTA + (width / height) 

     
//  const r= 
//     {
//      latitude: position.coords.latitude ,
//      longitude: position.coords.longitude  ,
//      latitudeDelta:LATITUD_DELTA,
//      longitudeDelta: LONGITUDE_DELTA,
//    }
//        setcl(r)
//     },
//     (error) => {
//       console.log("geo location watch postn error : ",error)
//     },
//     { 
//       accuracy: {
//         android: 'high',
//         ios: 'best',
//       },
//         enableHighAccuracy: true,
//         maximumAge: 1000,
//         timeout:10000,
//         distanceFilter:10,  //10 meter
//        showsBackgroundLocationIndicator:true
//     }
//     )
  
//   }
 
  const getCurrentLocation =async  ()=>{
 
     setloaderT(true)
    Geolocation.getCurrentPosition(
    (position) => {       
       setposition(position)
       setloaderT(false)
      },
      (error) => {
        setloaderT(false)
        console.log("geo location error : ",error)
  
        if(error.code==3){
        
          Alert.alert(
            "",
            "Get Location Request Timeout !",
            [
              // {
              //   text: "No",
              //   onPress: () => console.log("Cancel Pressed"),
              //   style: "cancel"
              // },
              { text: "Retry", onPress: () =>  { setloaderT(true);locationEnabler()  }}
            ]
          );
      
        }
  
        if(error.code==2  ){
          locationEnabler()
        }
  
  
      },
      {
        enableHighAccuracy: false,
        timeout: 20000,
        maximumAge: 3600000 }
  );
   
   
  }  

  const locationEnabler=()=>{

    RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
      interval: 10000,
      fastInterval: 5000,
    }).then((data) => {
     
        seterr(""),
        setisl(true)
         getCurrentLocation();
        //  subscribeLocation();
        
      }).catch((err) => {
  console.log("location enabler popup error : ",err)
   let msg="";
   seterr(1)
  msg="Please Turn On Location"
  utils.ToastAndroid.ToastAndroid_LB(msg)
  
        // The user has not accepted to enable the location services or something went wrong during the process
        // "err" : { "code" : "ERR00|ERR01|ERR02|ERR03", "message" : "message"}
        // codes :
        //  - ERR00 : The user has clicked on Cancel button in the popup
        //  - ERR01 : If the Settings change are unavailable
        //  - ERR02 : If the popup has failed to open
        //  - ERR03 : Internal error
      });
  }
 
  useEffect(()=>{
    // setRequest();
    if(GVs.trips.length>0){
      // settrip() //get all trips of this captain accrdng 
    }

  },[])
 
  useEffect(() => {
 
    if (Platform.OS === 'ios') {
         getCurrentLocation();
         subscribeLocation();
         fcmService.registerAppwithFCM();//forios
    } else{
      locationEnabler();
    }

    const connectivityStatusSubscription = ConnectivityManager.addStatusListener(({ eventType, status }) => {
      switch (eventType) {
        case 'location':
              // console.log(`Location Services are ${status ? 'AVAILABLE' : 'NOT available'}`)
              setisl(status)
            break
      }
    })

    return () => {
     Geolocation.clearWatch(watchID);
     connectivityStatusSubscription.remove()
    }
  }, [])

  
  useEffect(() => {
   
    if(position!=""){

      const window = Dimensions.get('window');
      const { width, height }  = window
      const LATITUD_DELTA = 0.0922
      const LONGITUDE_DELTA = LATITUD_DELTA + (width / height) 

      
  const r= 
     {
      latitude: position.coords.latitude ,
      longitude: position.coords.longitude  ,
      latitudeDelta:LATITUD_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    }
  

  // setcl(r)
  setregion(r)

}

  }, [position])
  
    

  return(
 <NativeBaseProvider>
<utils.Loader location={true} loader={loaderT} />
{region!="" && err=="" &&(<MapContainer propsH={props}    region={region}/>  )}
{region=="" && err=="" && (<theme.Text style={{position:"absolute",marginTop:hp("50%"),fontSize:16,color:"black",alignSelf:"center"}}> Map is Loading ...</theme.Text>)}
{err==1&& (
 <TouchableOpacity 
 onPress={()=>{locationEnabler()}}
 style={{backgroundColor:theme.color.buttonLinerGC1,position:"absolute",marginTop:hp("50%"),alignSelf:"center",width:150,height:40,alignItems:"center",justifyContent:"center"}}>
<theme.Text style={{fontSize:15,color:"white"}}>Turn On Location</theme.Text>
 </TouchableOpacity> 
  )}
</NativeBaseProvider>
)
    
  }