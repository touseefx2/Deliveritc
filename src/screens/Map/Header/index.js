import React ,{useEffect,useState} from 'react';
import {View,Alert,AppState} from 'react-native';
import styles from './styles';
import theme from "../../../themes/index"
import utils from "../../../utils/index"
import { Switch } from 'react-native-switch';
import AsyncStorage from '@react-native-async-storage/async-storage'
import moment from 'moment';
import db from "../../../database/index" 

import { inject, observer } from "mobx-react"; 
  
export default inject("userStore","generalStore","carStore")(observer(Header));

   function Header (props)   {
   
	// const {user,changeuser,setuser,isInternet ,setac} = props.store;

	const {isInternet,appState} = props.generalStore;
	const {user,setUser,authToken,online,setonline} = props.userStore;
	const {cars,setCars} = props.carStore;

	const [newState, setnewState] = useState(AppState.currentState);
	const [activeChecked, setActiveChecked] = useState(online);
	 
	 
// 	useEffect(() => {
	 
// 	 if (appState === "active") {
			
// 			let u  = {...user}
		 
// 			u.online=activeChecked
			
// 		   if(activeChecked==true){
	
	
//     if(u.onlineTime.length>0){
// 	  let c=false;

// 	  u.onlineTime.map((e,i,a)=>{
// 		//  console.log("eeee if ac true : ",e)
	
// 		 let ddd=new Date();
// 		 var sd =  moment(ddd).format("ddd D MMM");
	
// 		 if(sd==e.sdate){
	
// 		  if(e.online==true){
// 		    c=true
// 		  }
	
	
// 		 }
	
	
// 	  })

// 	if(c==false){
// 	  let ddd=new Date();
// 	  var sd =  moment(ddd).format("ddd D MMM");
// 	  var st =  moment(ddd).format('hh:mm:ss a')  
	 
	
// 	  const d={sdate:sd,edate:"",stime:st,etime:"",online:activeChecked,seconds:0,sd:ddd,ed:""}
// 	  u.onlineTime.push(d)
// 	  storeUserData(u)
// 	}
// 	}
		 
// 		  } 
// 		}

// 		if (appState === "background") {
		 

// 			let u  = {...user}
		 
		 
// 			if(activeChecked==true){


// 				if(u.onlineTime.length>0){
 
// 					u.onlineTime.map((e,i,a)=>{
					  
				
// 					   let ddd=new Date();
// 					   var sd =  moment(ddd).format("ddd D MMM");
				 
// 					   if(sd==e.sdate){
				
// 						if(e.edate=="" &&  e.online==true){
							 
// 							let ddd=new Date();
// 							var ed =  moment(ddd).format("ddd D MMM");
// 							var et =  moment(ddd).format('hh:mm:ss a')  
						   
// 							var sst = moment(e.stime, "hh:mm:ss a");
// 							var eet = moment(et, "hh:mm:ss a");
// 							var duration = moment.duration(eet.diff(sst));
// 							var sec = parseInt(duration.asSeconds());
						
		
		
// 						u.onlineTime[i].edate=ed
// 						u.onlineTime[i].ed=ddd
// 						u.onlineTime[i].etime=et
// 						u.onlineTime[i].seconds=sec
// 						u.onlineTime[i].online=false

// 						storeUserData(u)
						
// 									}
				
				
// 					   }
				
				
// 					})
	              
// 				}


// 			}

		
// 		}

// 		if (appState === "inactive") {
		   
// 		}

// console.log("AppState ",appState)		
// 	}, [appState])

 useEffect(() => {
 props.setActiveChecked(online)
 setActiveChecked(online)
 }, [online])
   
	 

	const checkTime=(achk)=>{
		let u  = {...user}
		u.online=achk
		
	   if(achk==true){

if(u.onlineTime.length<=0){

  let ddd=new Date();
  var sd =  moment(ddd).format("ddd D MMM");
  var st =  moment(ddd).format('hh:mm:ss a')  
 

  const d={sdate:sd,edate:"",stime:st,etime:"",online:achk,seconds:0,sd:ddd,ed:""}
  u.onlineTime.push(d)

}else{
  let c=false;
  u.onlineTime.map((e,i,a)=>{
	//  console.log("eeee if ac true : ",e)

	 let ddd=new Date();
	 var sd =  moment(ddd).format("ddd D MMM");

	 if(sd==e.sdate){

	  if(e.online==true){
	  c=true
	  }


	 }


  })
if(c==false){
  let ddd=new Date();
  var sd =  moment(ddd).format("ddd D MMM");
  var st =  moment(ddd).format('hh:mm:ss a')  
 

  const d={sdate:sd,edate:"",stime:st,etime:"",online:achk,seconds:0,sd:ddd,ed:""}
  u.onlineTime.push(d)
}
}
	 
	  } 


	  if(achk==false){

		  if(u.onlineTime.length<=0){
		  
			  // let ddd=new Date();
			  // var sd =  moment(ddd).format("ddd D MMM");
			  // var st =  moment(ddd).format('hh:mm a')  
			 
		  
			  // const d={sdate:sd,edate:"",stime:st,etime:"",online:activeChecked,seconds:0}
			  // u.onlineTime.push(d)
		  
		  }else{
		  
			  u.onlineTime.map((e,i,a)=>{
				//  console.log("eeee if ac false : ",e)
		  
				 let ddd=new Date();
				 var sd =  moment(ddd).format("ddd D MMM");
		   
				 if(sd==e.sdate){
		  
				  if(e.edate=="" &&  e.online==true){
				   
		  let ddd=new Date();
		  var ed =  moment(ddd).format("ddd D MMM");
		  var et =  moment(ddd).format('hh:mm:ss a')  
		 
		  var sst = moment(e.stime, "hh:mm:ss a");
		  var eet = moment(et, "hh:mm:ss a");
		  var duration = moment.duration(eet.diff(sst));
		  var sec = parseInt(duration.asSeconds());
	  
	  u.onlineTime[i].edate=ed
	  u.onlineTime[i].ed=ddd
	  u.onlineTime[i].etime=et
	  u.onlineTime[i].online=achk
	  u.onlineTime[i].seconds=sec

				  }
		  
		  
				 }
		  
		  
			  })
		  
		  }
				   
				  
				  
				  } 
  
				  storeUserData(u)
	 }

	 const  storeUserData = async (u) => {
	 
		try {
		  
		  await AsyncStorage.setItem('userData', JSON.stringify(u))
		  console.log("u onlinetime : ",u.onlineTime)

		  console.log("store user data success in actv chk : ") 
		//   changeuser("ofdetect",activeChecked) //online ofline detect
		   setuser(u)
 
		} catch (e) {
		  console.log("store user data error : ", e)
		}
	  } 

	const CustomComponent= ()=> {
		return(
			<utils.vectorIcon.Entypo size={15} name={activeChecked?"check":"cross"} color={activeChecked?"#19b05e":"#7d989e"} />
		)
	}

	const goOffline=(s)=>{

		if(isInternet){
			UpdateUser(s)	 
		}else{
			let msg="Please connect internet"
			utils.ToastAndroid.ToastAndroid_SBC(msg)
		}
	

	}

	const UpdateUser =(s)=>{
        
		props.setLoader(true);

        //update user
          let uid= user._id
          const bodyData={is_online:s}
          const header= authToken;
         
           // method, path, body, header
           db.api.apiCall("put",db.link.updateUser+uid,bodyData,header )
          .then((response) => {
               
            console.log("Update user  response : " , response);
            
                if(response.data){
                  setUser(response.data)
				  setonline(response.data.is_online)
				  setActiveChecked(response.data.is_online)
				  props.setLoader(false);
                  return
                  }
        
                 if(!response.data){
					props.setLoader(false);
                    utils.AlertMessage("",response.message)
                   return
                  }
    
            	  props.setLoader(false);
                return
         
          }).catch((e) => {
			props.setLoader(false);
             utilsS.AlertMessage("","Network request failed");
             console.error("Update user   catch error : ", e)
            return;
          })
    
    
        
          }

	const goOnline=(s)=>{
	if(isInternet){
      UpdateUser(s)		    
		}else{
			let msg="Please connect internet"
			utils.ToastAndroid.ToastAndroid_SBC(msg)
		}
	}
	
	const toggleActive=(s)=>{
    
		if(activeChecked==true){
			Alert.alert(
				"Go offline now ?",
				"You won't get any bookings.",
				[
				  {
					text: "STAY ONLINE",
					onPress: () => console.log("Cancel Pressed"),
					style: "cancel"
				  },
				  { text: "GO OFFLINE", onPress: () =>  {goOffline(s)} }
				]
			  );

		}else{

			Alert.alert(
				"Go online now ?",
				"You want get more bookings.",
				[
				  {
					text: "STAY OFFLINE",
					onPress: () => console.log("Cancel Pressed"),
					style: "cancel"
				  },
				  { text: "GO ONLINE", onPress: () =>  {goOnline(s)} }
				]
			  );


		}



	
	}
 	 
 
  return(
 
  <View style={styles.Box}>  
 

 <Switch
    value={activeChecked}
    onValueChange={(s)=>toggleActive(s)}
    disabled={false}
    activeText={'Online'}
    inActiveText={'Offline'}
    circleSize={25}
    barHeight={35}
    circleBorderWidth={0}
    backgroundActive={'#19b05e'}
    backgroundInactive={'#7d989e'}
    circleActiveColor={'white'}
    circleInActiveColor={'white'}
    changeValueImmediately={true}
    renderInsideCircle={() => <CustomComponent />} // custom component to render inside the Switch circle (Text, Image, etc.)
    changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
    innerCircleStyle={{ alignItems: "center", justifyContent: "center" }} // style for inner animated circle for what you (may) be rendering inside the circle
    outerCircleStyle={{}} // style for outer animated circle
    renderActiveText={true}
    renderInActiveText={true}
	activeTextStyle={{fontSize:12,fontFamily:theme.fonts.fontMedium}}
	inactiveTextStyle={{fontSize:12,fontFamily:theme.fonts.fontMedium}}
    switchLeftPx={3.5} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
    switchRightPx={3.5} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
    switchWidthMultiplier={3.5} // multipled by the `circleSize` prop to calculate total width of the Switch
    switchBorderRadius={20} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
  />


  </View>
  
)
    
}

 