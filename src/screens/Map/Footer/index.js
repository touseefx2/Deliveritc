import React ,{useEffect,useRef,useState} from 'react';
import { StyleSheet,TouchableOpacity,View,Image,Alert,Text,Dimensions} from 'react-native';
import styles from './styles';
import theme from "../../../themes/index"
import utils from "../../../utils/index"
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { inject, observer } from "mobx-react"; 
import PushNotification from "react-native-push-notification";

   export default inject("store")(observer(Footer));

   function Footer (props)   {
   
	const { user,setuser,isInternet,isl,changerequest,trip,settrip,addtrip,request,setrequest} = props.store;
	const [rideModal,setrideModal] = useState(false);
	const activeChecked  = props.active;

	const setRequest=()=>{
		const window = Dimensions.get('window');
		const {width, height }  = window
		const LATITUD_DELTA = 0.0922
		const LONGITUDE_DELTA = LATITUD_DELTA + (width / height) 
	  
	 const r=   {
		//   id:"",
		  id: Math.floor(Math.random() * (200000 - 50000) + 50000),   //trip id
		  //captain
		  captainid:"",  //wo captain k id ae gi jo aceept kre ga ride
		  captaincarid:"",
		  captainTripDispute:{
			  comment:"",
			  audio:""
		  },
		  //user info
		  uid:321, //customer user id
		  name:"Touseef Amjad",
		  number:"+923075839836",
		  rating:"4.7", //user k total rating
		  //ride info
		  rideType:"car",
		  pickupLocation:{
			name:"Blue Area, Islamabad Capital Territory, Pakistan",
			region:{
			  latitude:33.71816,
			  longitude: 73.07136,
			  latitudeDelta:LATITUD_DELTA,
			  longitudeDelta: LONGITUDE_DELTA,
			}
		  },
		 dropoffLocation:{
			name:"Pakistan Monument Museum, Srinagar Highway",
			region:{
			  latitude:33.69260 ,
			  longitude:73.06954 ,
			  latitudeDelta:LATITUD_DELTA,
			  longitudeDelta: LONGITUDE_DELTA,
			}
		  },
		  rs:"400",
		  //trip 
		  createdAt:new Date(),
		  collectcash:"",
		  cardPay:false,
		  normalPay:false,
		  finish:false,
		  captainrate:0,        //wo rate jo user captan ko de ga
		  userrate:0,          //wo rate jo captn user ko de ga
		  wait_time:"",        //in seconds jo arrive true krne k bad pickup loc pr user ka karna hta wo
		  total_distance:"",
		  total_time:"",       //estimat travel time google
		  status:"",
		  cancelStatus:"",
		  cancelby:"", 
		  startRideTime:"",
		  endRideTime:"",
		  //status
		  accept:false,
		  arrive:false,
		  startride:false,
		  endride:false
		}
		setrequest(r);
		addtrip(r)
 	
	  }


const sendMessage=()=>{

// 	const admin = require('firebase-admin');
// 	admin.initializeApp();
	
//   const payload = {
//     notification: {
//       title:'D Hospital',
//       priority: 'high'
//     }
//   };


//   admin.messaging().sendToDevice(user.notificationToken,payload).then(response => {
//     console.log('Successfully sent notifctn message:', response);
//   })
//   .catch(error => {
//     console.log('Error sending notfctn message:', error);
//   });
}

const showlocalnoti=()=>{
	PushNotification.localNotification({
		channelId:"default-channel-id",
		 showWhen:true,
		soundName: "notification.mp3",
		playSound: true,
		when:new Date(),
		ignoreInForeground: false,
		message: "new trip request",
		//   timeoutAfter: 1500,
		title:   "Request",
		foreground: true, // BOOLEAN: If the notification was received in foreground or not
		 
	});
}


	useEffect(() => {
		props.setridemodal(rideModal)
	}, [rideModal])


	let msg=""
	if(activeChecked==true && isInternet==true && isl==true){msg="Looking for customers"}
	if(activeChecked==true  && isInternet!=true  ){msg="No internet connection"}
	if(activeChecked!=true &&  (isInternet!=true)){msg="No internet connection"}
	if(activeChecked!=true &&  (isInternet==true)){msg="You are offline"}
	if(isInternet==true && activeChecked==true && isl==false){msg="Please turn on location"}
 
	if(activeChecked==true && isInternet==true && isl==true){ 
		return( 
			<View style={styles.Box}>  
			
			<TouchableOpacity onPress={()=>{
				setrideModal(!rideModal);setRequest();sendMessage()
			     showlocalnoti()
				}}>
			<theme.Text style={{fontSize:16,alignSelf:"center",color:"black"}}>{msg}</theme.Text>
			</TouchableOpacity>
			<Image style={{marginTop:5,width:wp("90%"),height:40,resizeMode:"contain"}} source={require("../../../assets/loaded.gif")} />

			  </View>
		)	  
	}
 else {

	return( 
		<View style={styles.Box}>  
		
		<theme.Text style={{fontSize:16,alignSelf:"center",color:theme.color.mainPlaceholderColor}}>{msg}</theme.Text>
		
		  </View>
	)	
    
	}


   }
 