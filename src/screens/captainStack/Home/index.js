import React ,{useEffect,useRef,useState} from 'react';
import {Platform, PermissionsAndroid,Dimensions,Alert,TouchableOpacity,View,Text,ScrollView,BackHandler} from 'react-native';
import utils from "../../../utils/index"
import { inject, observer } from "mobx-react"; 
import MapContainer from '../../Map/MapContainer/index';
import { Container,NativeBaseProvider, } from 'native-base';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
// import Geolocation from '@react-native-community/geolocation';
import Geolocation from 'react-native-geolocation-service';
import db from "../../../database/index" 
import Modal from 'react-native-modal';
import io from "socket.io-client";
import { acc } from 'react-native-reanimated';


export default inject("userStore","generalStore","carStore","tripStore")(observer(Home));
 
  
 function Home (props)   {

  const {user,authToken,setUser,setcl,cl,Logout,setonline} = props.userStore;
  const {cars,setCars} =  props.carStore;
  const {setrequest,accept,request,getReqById,setatime,setaccept,getreqloader,setgetreqloader,gro,setgro,endride,normalPay} = props.tripStore;
  const {setLocation,isLocation,isInternet} = props.generalStore;
  const [loaderT,setloaderT]=useState(false);
  
  
  const [isServerError,setisServerError]=useState("A");
 

	const [refresh,setrefresh]=useState(false);
  const [getcarDataonce,setgetcarDataonce]=useState(false);
 

  const window = Dimensions.get('window');
	const { width, height }  = window
	const LATITUDE_DELTA = 0.0922
	const LONGITUDE_DELTA = LATITUDE_DELTA + (width / height) 

  
  let watchID=null;
 
  async function requestPermissions() {
		if (Platform.OS === 'ios') {
		  Geolocation.requestAuthorization();
		  Geolocation.setRNConfiguration({
			skipPermissionRequests: false,
		   authorizationLevel: 'whenInUse',
		 });
		}
	  
		if (Platform.OS === 'android') {
		  let g= await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
		  );

       
      if (g === PermissionsAndroid.RESULTS.GRANTED || g =="granted") {
       setLocation(true);
       getCurrentLocationOne();
      //  subscribeLocation();
       return;
      }
		    
      let msg=""
		  if (g ==="denied") {
		  	msg = "Please allow permision to use location"
		  }

		  if (g === "never_ask_again") {
        msg= "Please allow permision to use location in setting in device or reinstall app and allow permission to continue";
		  }
     
      setLocation(false);

      Alert.alert(
        '',
        msg,
        [
        {text: 'OK', onPress: () => {  locationEnabler()}},
        ], 
        { cancelable: false }
        )
   return;

		}


	  }
 
    const socket = io(db.link.socket);
    const SocketOn=()=>{
      socket.on("connect", () => {
        console.log(`"Socket : I'm connected with the back-end`);
        });
    }
    const SocketOff=()=>{
      console.log("Socket off");
        socket.emit("stop_sharing_location",{socket:socket.id});
    }
 
    useEffect(() => {
      if(normalPay){
       setrequest(false)
       }
   
    }, [])
   
  useEffect(() => {
    if(refresh){
      if(isInternet){
      setloaderT(false);setgetcarDataonce(false); 
      setisServerError("A");setrefresh(false);
      getCar();skipTrip()

      if(cl!=""){
       
          const bodyData={
            type:"Point",
            coordinates: [cl.longitude,cl.latitude]  //long , lat
        }
           
          UpdateUser(bodyData,false,false,false)
      }


      }else{
        setrefresh(false);
        utils.AlertMessage("","Please connect internet !")
      }
       
    }
  
  }, [refresh])
 

  useEffect(() => {
    if(isInternet ){
      if(!request){
       skipTrip()
      }
    }
  }, [request,isInternet])

  useEffect(() => {
    
    if(!accept){
        setrequest(false);
        setatime("");
       setgro(false)
    
    }
  }, [accept])

  useEffect(() => {
    if(accept&&isInternet&&!endride){
      SocketOn()
    }
    if(!accept||!isInternet||!request || endride){
       SocketOff()
    }
  }, [accept,isInternet,endride,request])
 
 
  useEffect(() => {
    
     if(accept && cl!=""){
       if(isInternet  && !gro){

        if(request!=false){
           setgetreqloader(true)
           getReqById(request._id,"check");
          }
    
       }
     }

  }, [accept,isInternet,cl,request])

  
  const skipTrip=()=>{
 
      const bodyData={}
      const uid=user._id
      const header=authToken;
      // method, path, body, header
      db.api.apiCall("put",db.link.skipTrip+uid,bodyData,header)
      .then((response) => {
            
        console.log("Skip trip response : " , response);
            
            if(response.success){
            // utils.ToastAndroid.ToastAndroid_SB("Skip") ;
            
            return;
             }
   
             if(!response.success){
                  // utils.AlertMessage("",response.message)
                 return;
                 }
     
          return;
      }).catch((e) => {
        
        //  utils.AlertMessage("","Network request failed");
         console.error("Skip trip   catch error : ", e)
        return;
      })

 
  }

  const subscribeLocation = () => {
    watchID= Geolocation.watchPosition((position) => 
   {
setloaderT(false);
 
  const r= 
  {
  latitude: position.coords.latitude ,
  longitude: position.coords.longitude    ,
  latitudeDelta:LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
  }
  setcl(r)
 
   },
   (error) => {
     console.log("geo location watch postn error : ",error)
   },
   { 
       showsBackgroundLocationIndicator:true,
        enableHighAccuracy: true, timeout: 20000, maximumAge: 10000  ,
        distanceFilter:10,
     
   }
   )
 
 }
 
 useEffect(() => {
   if(cl!="" && isInternet ){
     
    const bodyData={
        type:"Point",
        coordinates: [cl.longitude,cl.latitude]  //long , lat
    }
UpdateUser(bodyData,false,accept,endride)  
   }
 }, [cl,accept,endride,isInternet])

 const onLogout=()=>{
  setCars(false) 
  Logout();
 }
 
const getCurrentLocationOne=()=>{
setloaderT(true)
Geolocation.getCurrentPosition(
  
async (position) => {

console.log("cpstn : ",position)
setloaderT(false);

 
  
  // utils.AlertMessage("","Please connect internet ! ")
  const r= 
  {
  latitude: position.coords.latitude ,
  longitude: position.coords.longitude    ,
  latitudeDelta:LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
  }
  setcl(r);
  
  subscribeLocation()
   
  },
  (error) => {
    setloaderT(false)
    if(error.code==3){
      if(cl==""){
           getCurrentLocationOne()
      }
    
      }

   console.log("get crnt loc one error : ",error.message);

   
  },
  {
      // enableHighAccuracy: false,
      // timeout: 30000,
      // maximumAge:3000
     
       enableHighAccuracy: true, timeout: 20000, maximumAge: 10000  
  },
  );
 
}

const UpdateUser=(location,suc,a,e)=>{

  
  	//update user
	  let uid= user._id
	  const bodyData= {location:location}
	  const header= authToken;
 
    if(!a || e){
	  // method, path, body, header
	  db.api.apiCall("put",db.link.updateUser+uid,bodyData,header)
	  .then((response) => {
		     
		  	 console.log("Update user location response : " , response.data.location);
        
			 
         if(response.msg=="Invalid Token"){
          utils.AlertMessage("",response.msg) ;
          onLogout()
          return;
         }

			 if(response.data){
			     
			  	 setUser(response.data);
         
			  
			if(suc){
					// subscribeLocation()
				}
			  
				 
			 }
	
			 if(!response.data){
        //  utils.ToastAndroid.ToastAndroid_SB(response.message)
        return;	 
		  }
 
      
		  return;
	  }).catch((e) => {
	   
           utils.ToastAndroid.ToastAndroid_SB("Server error location not upate in backend")
		       console.error("Update user location catch error : ", e)
	        	return;
	  })
    }else if(a&&!e){
      console.log("send captn  loc to socket : ",location)
       socket.emit("receive_location_from_captain", {
        id: socket.id,
        user_id: uid,
        location:location
      });
    }

	
		}

    useEffect(() => {
      locationEnabler();
    }, [])
   
    useEffect(() => {

      
      if(!isLocation){
        Geolocation.clearWatch(watchID);
        Geolocation.stopObserving()
        watchID=null;
      }
  
    }, [isLocation])
    
    const getCar=()=>{
     
      setisServerError("A")
      let uid=user._id
      const bodyData=false
      const header=authToken;

      
      // method, path, body, header
      db.api.apiCall("get",db.link.getCar+uid,bodyData,header)
      .then((response) => {

             setisServerError(false)
             console.log("Get car response : " , response);
        
             if(response.msg=="Invalid Token"){
               utils.AlertMessage("",response.msg) ;
               onLogout()
              return;
             }

             if(!response.data){
              // utils.AlertMessage("",response.message) ;
              return;
             }
    
             if(response.data){
               setCars(response.data[0]);
               setgetcarDataonce(true);
               getUser()
               return;
             }
          
             return;
     
      }).catch((e) => {
          setisServerError(true)
        // utilsS.AlertMessage("","Network request failed");
         console.error("Get car catch error : ", e)
         return;
      })
    
     }

     const getUser=()=>{
		  
      const bodyData=false
      const header=authToken;
      const uid=user._id
  
      // method, path, body, header
      db.api.apiCall("get",db.link.getUserById+uid,bodyData,header)
      .then((response) => {
           
           console.log("getuser response : " , response);
   
           if(!response.data){
          //  utils.AlertMessage("", response.message ) ;
          return;
           }
      
      
           if(response.data){
              setUser(response.data[0]);
              setonline(response.data[0].is_online);
            
           return;
           }
        
         
           return;
       
      }).catch((e) => {
  
         console.error("getuser catch error : ", e)
        return;
      })
  
      }

     useEffect(() => {
       if(isInternet  ){


         if(!getcarDataonce){
           getCar()
           }
  

       }

       if(!isInternet){
         setgro(false)
       }
 
     }, [isInternet ])

  
    useEffect(() => {
     
      return()=>{
        Geolocation.clearWatch(watchID);
        Geolocation.stopObserving()
        watchID=null;
      }
    }, [])
  
  const locationEnabler=()=>{

    RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
      interval: 10000,
      fastInterval: 5000,
    }).then((data) => { 
      requestPermissions()
      }).catch((err) => {
    console.log("location enabler popup error : ",err)
   
    setTimeout(() => {
      locationEnabler()
    }, 5000);
      
      });
  }
  
  useEffect(() => {
 
    if (Platform.OS === 'ios') {
       
    } else{
      locationEnabler();
    }
 
    return () => {
     Geolocation.clearWatch(watchID);
    }
  }, [])

  const renderServerError=()=>{
    return(
      <Modal 
	  isVisible={isServerError==true?true:false}
      backdropOpacity={0.7}
      animationIn="fadeInUp"
      animationOut="fadeOutDown"
      animationInTiming={400}
      animationOutTiming={0}
      backdropTransitionInTiming={400}
      backdropTransitionOutTiming={0}
      onRequestClose={() => { 
        console.log("yes")
        // setisServerError(false)
       }}
   >
  
      <View style=
      {{
      backgroundColor:"white", 
      borderRadius:10,
      padding:20,
      alignSelf: 'center',
	  width:300,
      }}>
 
     
     <Text  style={{fontSize:17,color:"black"}}> 
      Server not respond
    </Text> 

	<View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",width:"100%",marginTop:40,alignSelf:"center"}}>

	<View style={{width:"60%",alignItems:"flex-end"}}>
	<TouchableOpacity onPress={()=>{BackHandler.exitApp()}}>
	<Text style={{fontSize:18,color:"black",textTransform:"capitalize"}}> 
		exit
	</Text>
	</TouchableOpacity> 
	</View>

	<View style={{width:"25%",alignItems:"flex-end"}}>
	<TouchableOpacity onPress={()=>{setrefresh(true)}}>
	<Text style={{fontSize:18,color:"black",textTransform:"capitalize"}}> 
		retry
	</Text>
	</TouchableOpacity> 
	</View>


	</View>
 
      </View>
    </Modal>
    )
  }
 
return(
 <NativeBaseProvider>
{!loaderT && renderServerError()}
<utils.Loader location={true} loader={loaderT} />
<utils.Loader  loader={getreqloader} />
<MapContainer propsH={props}   /> 
</NativeBaseProvider>
)
    
  }