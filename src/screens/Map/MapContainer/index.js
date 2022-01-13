import React ,{useEffect,useRef,useState,useCallback} from 'react';
import { StyleSheet,TouchableOpacity,View,Linking,SafeAreaView,Text,ImageBackground,BackHandler,Image,Alert,ScrollView,TouchableWithoutFeedback} from 'react-native';
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
import db from "../../../database/index"
import  Modal  from 'react-native-modal';
import { ActivityIndicator, TextInput } from 'react-native-paper';
import Geocoder from 'react-native-geocoding';

 
export default inject("userStore","generalStore","carStore","tripStore")(observer(MapContainer));
 

   function MapContainer (props)   {
 
    const gapikey="AIzaSyAJeMjKbTTRvoZJe0YoJc48VhaqbtoTmug"
 
    //before arrive after accept
    let ctnotcuttimeba=10  //2min or 120 sec no cut charges if captain cancel trip before 2 min so not cut charges otherwise cut charges
    let ctcfba=40 //amount paid before arrive after then 2 min in after acpt
    let ctcfaa=90 //amount paid  +  after arrive and cancel after grace time or amound paid - before gracetime

  
  const {cars,setCars} =  props.carStore;
  const { user,setUser,cl,online,authToken,Logout} = props.userStore;
  const {request,changerequest,setrequest,accept,setaccept,atime,setatime,arrive,setarrive,startride,setstartride,endride,setendride,setwaitTime,waitTime,arvtime,setarvtime,ar,setar,ridemodal,setridemodal,tcp,dpd,tpd,settcp,setdcp,dcp,setdpd,settpd,normalPay,setnormalPay ,normalPaycash,setnormalPaycash} = props.tripStore;
  const {isInternet,isLocation} = props.generalStore;

  let isl=isLocation

  const [mr, setmr] = useState(false);

    //after arrive captain captain w8 60 sec for user if cancel after 40 secor red time captn earn 90 rs else captain paid 50 rs
    let wt=60        //    60 sec
    let cancelTime=40     //     sec  
    const [ct, setct] = useState(wt);  //w8 time unti se nechy ktna time rah gya wo

 
  const [loader, setloader] = useState(false); //loading indctr in button
  const [l, setl] = useState(false); //loading 

  const [ll, setll] = useState(false); //loading geting user walet
  const [cw, setcw] = useState("f"); //customer wallet info

  const [search,setsearch] = useState(""); //destntn adress st from google places
  const [showLoc,setshowLoc] = useState(false); //destntn adress st from google places

  const [activeChecked, setActiveChecked] = useState(online);

  const [tripdetailmodal,settripdetailmodal] = useState(false);

  const [csh,setcsh] = useState("");
  const [cash,setcash] = useState(0);
  const [cashconfirmMV, setcashconfirmMV] = useState(false);
  const [cashG, setcashG] = useState(false);  // colctd cash i sgret or lower than  total rent amount
  const [checkBox, setcheckBox] = useState(false);  // colctd cash i sgret or lower than  total rent amount
 

  // const [atime,setatime] = useState("");  //trip acept time jb acpt kr lya us k bad ktne time ho gya wo chk krta

  const [skip,setskip] = useState(false);

  const [p,setp] = useState(0); //progress //0 to 10 sec after 10 sec skip/rjct click

  const [nolpl,setnolpl] = useState(0); //numofline in pickup location in trip modal

  const [starCount,setstarCount] = useState(0);
  
  const mapRef = useRef();
   
  useEffect(() => {
    const subscription  = BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
   
    return () => {
    BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    subscription.remove(); 
   }
  
  },[normalPay])
  
  function handleBackButtonClick() {

    if (!props.propsH.navigation.isFocused()) {
      return false;
    }else{
      if(!normalPay)
      {
      goBack()
      }else{
        clearallFields() 
        utils.ToastAndroid.ToastAndroid_SB("Trip Complete :)");
      }
      return true;
    }  
  
   
  }

  const goBack=()=>{
    Alert.alert(
      "Confirmation",
      "Are you sure tou want to exit app ?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => BackHandler.exitApp()}
      ]
    );
  }
 
  const clearallFields=()=>{
    settripdetailmodal(false)
    setridemodal(false);
    setaccept(false);
    setrequest(false)
    setarrive(false);
    setstartride(false);
    setendride(false);
    setp(0);
    setct(wt);
    setatime("");
    settcp("...");
    setdcp("...")
    settpd("...");
    setdpd("...");
    setnolpl(0);
    setwaitTime("f");
    setarvtime("");
    setl(false)
    setar(0);
    setskip(false);
    setnormalPay(false)
    setstartride(false);
    setll(false);
    setcw("f")
    setendride(false);
    setnormalPay(false)
    setnormalPaycash("---");
    setcashconfirmMV(false);
    setcashG(false);
    setcheckBox(false)
    setcash("")
    setstarCount(0);
  
  }
 
  useEffect(() => {
    Geocoder.init(gapikey,{language : "en"});
  }, [])

  useEffect(() => {
    if(request){
      setridemodal(true)
     } 
     if(!request){
       clearallFields()
     }
    }, [request])

    useEffect(() => {
     if(!accept)
     {
      setp(0);
      setwaitTime("f");
      setar(0);
      clearallFields()
     }
    }, [accept])
   
  useEffect(() => {

    if(accept && !mr && !arrive && request){

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
          {top: 300,
          right:100,
          bottom:300,
          left: 100}
            }
        
        );

    }

    if(accept && !mr && arrive && request){

      let mark1={
        latitude:  cl.latitude,
        longitude: cl.longitude,
      }
    
      let mark2={
      latitude: request.dropoff.location.latitude,
      longitude:request.dropoff.location.longitude ,
      }
    
       mapRef?.current?.fitToCoordinates([mark1,mark2], 
          {  
          animated: true,
          edgePadding: 
          {top: 300,
          right:100,
          bottom:300,
          left: 100}
            }
        
        );

    }
 
  }, [accept,mr,arrive,request])

  useEffect(() => {
if(arvtime!=""){
  
let at=moment(arvtime).format("hh:mm:ss a");
let ct=moment(new Date()).format("hh:mm:ss a");

 
var arriveTime = moment(at, "HH:mm:ss a");
var crntTime = moment(ct, "HH:mm:ss a");
var duration = moment.duration(crntTime.diff(arriveTime));
var sec = parseInt(duration.asSeconds());

 
if(sec>=wt){
 setwaitTime(0);
 setct(0)
}else{
 setwaitTime(wt-sec);
 setct(wt-sec)
}
     }else{
       setwaitTime("f");
     }
  }, [arvtime])

  useEffect(() => {
     if(mr && cl!=""){
       mapRef?.current?.animateToCoordinate(cl,1000)
       setmr(false)
    }
  }, [mr,cl])

  const getcustomerWalletinfo=()=>{

    setll(true);
    setcw("f")
    const bodyData=false
    const header=authToken;
    const cid=request.customer._id
     
    // method, path, body, header
    db.api.apiCall("get",db.link.getcustomerWalletinfo+cid,bodyData,header)
    .then((response) => {
         setll(false)
         console.log("getcustomerWalletinforesponse : " , response);
  
         if(response.msg=="Invalid Token"){
          utils.AlertMessage("", response.msg ) ;
          onLogout();
          return;
          }

          if(response.data){
             
            if(response.data.length<=0){
              setcw(0)
              return;
            }
            let r=response.data[0]
            setcw(r.balance)
            return;
           }

         if(!response.data){
           setcw(false)
           utils.AlertMessage("", response.message ) ;
          return;
         }
    
        
      
    }).catch((e) => {
      setcw("false")
      setll(false);
      //  utils.AlertMessage("","Network request failed")
       console.error("getcustomerWalletinforesponse catch error : ", e)
      return;
    })

  }

  useEffect(() => {
 if(checkBox){
getcustomerWalletinfo();
 }else{
setll(false);
setcw("f")
 }
  }, [checkBox])

  useEffect(() => {
   if(cl!=""&&startride&&request){
 
    // fetchDistanceBetweenPointsOnline(
    //   cl.latitude,
    //   cl.longitude,
    //  request.dropoff.location.latitude,
    //  request.dropoff.location.longitude,
    //  "startridedynamic")
  
    }

  }, [cl,request,startride])

  useEffect(() => {
   if(startride){

     fetchDistanceBetweenPointsOnline(
      cl.latitude,
      cl.longitude,
     request.dropoff.location.latitude,
     request.dropoff.location.longitude,
     "startridedynamic")
    

       setwaitTime("f");
       setct(wt);
   }
  }, [startride])
 
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
 
  if(ridemodal){

  const interval = setInterval(() => {
      setp(p+0.1)
  }, 1000);

  //15 second left to skip/accept trip
  if(p>=1.5){
      clearInterval(interval)
      onclickSkip()
      }

      if(skip || accept){
        setp(0)
        clearInterval(interval);
      }

  return () => {
    clearInterval(interval)
   }

  }

   
}, [p,ridemodal,skip,accept])


  const fetchDistanceBetweenPointsOnline = (lat1, lng1, lat2, lng2,c) => {  
      
    var urlToFetchDistance = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=metric?mode=driving&origins='+lat1+','+lng1+'&destinations='+lat2+'%2C'+lng2+'&key='+gapikey;
     
      if(c=="requestride"){
        fetch(urlToFetchDistance)
        .then(res => {
        return res.json()
})
.then(res => {
 
   
         var distanceString = res.rows[0].elements[0].distance.text;
         var timeString = res.rows[0].elements[0].duration.text;
         var timeSecond = res.rows[0].elements[0].duration.value;
         let s=timeSecond
         var travelTime = moment(new Date()).add(s, 'seconds').format('h : mm A')

         settcp(timeString)
         setdcp(distanceString). //distance  captain curent loc  to user  pickup loc
         return;
     
       

})
.catch(error => {
       //  utils.AlertMessage("Fetch distance api error","Network request failed"),   
        console.log("Problem occurred fetchdsistancematric : ",error);
});
      }else 
      if(c=="startridedynamic"){
        try {
        alert("strt ride dynmc callllll")
         
          .then(res => {       
          return res.json()
  })
  .then(res => {
   
       
        var distanceString = res.rows[0].elements[0].distance.text;
        var timeString = res.rows[0].elements[0].duration.text;
        var timeSecond = res.rows[0].elements[0].duration.value;
        let s=timeSecond
        var travelTime = moment(new Date()).add(s, 'seconds').format('h : mm A')
        setdpd(distanceString)
        settpd(travelTime)
       
        return;
    
      
  
  })
  .catch(error => {
         //  utils.AlertMessage("Fetch distance api error","Network request failed"),   
          console.log("Problem occurred fetchdsistancematric : ",error);
  });

        } catch (error) {
          console.log("start ride dynamic fetchDistanceBetweenPointsOnline api error ",error)
        }
      }
      else
      if(c=="endride"){
   
        try {
          
          setl(true);
          fetch(urlToFetchDistance)
          .then(res => {
                return res.json()
        })
        .then(res => {
       
              
              let distanceInMeter= res.rows[0].elements[0].distance.value;  //in meter
              let distanceInKm= distanceInMeter/1000;  //in meter to km
              // console.log("pickup se captn k cl ka distance in endride  ",distanceInKm)
             
              let loc={latitude:lat2,longitude :lng2}

              Geocoder.from(loc)
              .then(json => {
                 
                
                let  name=json.results[0].formatted_address;
                let address=json.results[0].formatted_address;
            
               
                let data={
                  name:name,
                  address:address,
                  location:{
                    longitude:lng2,
                    latitude:lat2
                  }
                  }
            
                  onClickEnd(distanceInKm,data);
                  
                return;
              
            
            
             
              })
              .catch(error => {
                setl(false);
                if(error.code==4){
                  utils.AlertMessage("","Please enable billing account on your google map api key")
                }
                console.warn("geocoder error : ",error);
                return;
            });
        
         
        
        
        })
        .catch(error => {
               setl(false);
                utils.AlertMessage("Fetch distance api error","Network request failed"),   
                console.log("Problem occurred fetchdsistancematric : ",error);
        });

        } catch (error) {
          setl(false);
          console.log("end ride fetchDistanceBetweenPointsOnline api error ",error)
        }
    
  }
 
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
    setskip(true)

    const bodyData={captain:user._id,vehicle:cars._id,current_location:{longitude:cl.longitude,latitude:cl.latitude}}
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
              setridemodal(false)
              setatime(new Date()) 
 
              return;
              }

           if(!response.success){
                utils.AlertMessage("",response.message);
                onclickSkip();
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

const onClickArrive=()=>{
  
  if(isInternet){ 
    setl(true);  

    const bodyData={current_location:{longitude:cl.longitude,latitude:cl.latitude}}
    const header=authToken;
    // method, path, body, header
    db.api.apiCall("put",db.link.arriveTrip+request._id,bodyData,header)
    .then((response) => {
          
           console.log("Arrive trip response : " , response);
           setl(false);

          if(response.msg=="Invalid Token"){
            utils.AlertMessage("", response.msg ) ;
            onLogout();
            return;
            }
  
          if(response.success){
            setarvtime(new Date());
            setarrive(true);
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
       console.error("Arrive trip catch error : ", e)
      return;
    })
    

  }else{
    utils.AlertMessage("","Please connect internet")
  }
 
}

const onClickStart=()=>{
  setl(true);
  const bodyData={current_location:{longitude:cl.longitude,latitude:cl.latitude}}
  const header=authToken;
 // method, path, body, header
 db.api.apiCall("put",db.link.startTrip+request._id,bodyData,header)
 .then((response) => {
       
        console.log("Start trip response : " , response);
        setl(false);

       if(response.msg=="Invalid Token"){
         utils.AlertMessage("", response.msg ) ;
         onLogout();
         return;
         }

       if(response.success){
         setstartride(true)
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
    console.error("Start trip catch error : ", e)
   return;
 })
}

const  ClickStart=()=>{
 
  if(isInternet){ 
   onClickStart()
  }else{
    utils.AlertMessage("","Please connect internet")
  }
 
}
 
const onClickEnd=(dist,DropOff)=>{
  
  if(isInternet){ 
   
    const bodyData={
      distance:dist,
      current_location:{longitude:DropOff.location.longitude,latitude:DropOff.location.latitude},
      dropoff:DropOff
    }

    const header=authToken;
    // method, path, body, header
    db.api.apiCall("put",db.link.endTrip+request._id,bodyData,header)
    .then((response) => {
          
           console.log("End trip response : " , response);
           setl(false);

          if(response.msg=="Invalid Token"){
            utils.AlertMessage("", response.msg ) ;
            onLogout();
            return;
            }
  
          if(response.success){
            setendride(true);
            setnormalPaycash(response.data.rent)
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
       console.error("End trip catch error : ", e)
      return;
    })
    

  }else{
    utils.AlertMessage("","Please connect internet")
  }
 
}

const onClickcancelTrip=(r,wt,cf)=>{
  setl(true)

  const bodyData={
    cancellation_reason:r,
    waiting_time:wt,
    canceling_fee:cf,
    current_location:{longitude:cl.longitude,latitude:cl.latitude}
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
      let cf= sec<=ctnotcuttimeba ? 0 : !arrive?ctcfba:ctcfaa;
     

      if(accept&&!arrive){
        onClickcancelTrip("Emergency (Canceling before arrive)",sec,cf==0?cf:-cf);
        return;
      }

      if(arrive && !startride){
        onClickcancelTrip("Emergency (Canceling after arrive brfore gracetime)",sec,cf==0?cf:-cf);
        return;
      }
     
      if(startride){
        onClickcancelTrip("Emergency (Canceling after startride)",sec,cf==0?cf:-cf);
        return;
      }

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
    //after arrive for pickup and cancel after grace time bonus +90 
    if(isInternet){

      let at=moment(arvtime).format("hh:mm:ss a");
      let ct=moment(new Date()).format("hh:mm:ss a");
      
       
      var arriveTime = moment(at, "HH:mm:ss a");
      var crntTime = moment(ct, "HH:mm:ss a");
      var duration = moment.duration(crntTime.diff(arriveTime));
      var sec = parseInt(duration.asSeconds()); //arived to start w8 time
 
      onClickcancelTrip("Emergency (Canceling after arrive after gracetime)",sec,+ctcfaa);

    }else{
      utils.AlertMessage("","Please connect internet !")
    }
 
 
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
 
  const clickArrivePickup=()=>{

    Alert.alert(
      "Confirmation",
      "Are you sure you want arrive customer pickup location ?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Yes", onPress: () =>  {

          if(isl==true){
           onClickArrive();
          }else if(isl==false){
            utils.AlertMessage("","Please turn on location !")
          }

         
        } }
      ]
    );

   
  }

  const clickStartRide=()=>{

    Alert.alert(
      "Confirmation",
      "Are you sure you want Start ride to reach customer droppoff location ?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Yes", onPress: () =>  {

          if(isl==true){
            ClickStart();
           }else if(isl==false){
             utils.AlertMessage("","Please turn on location !")
           }
            
        } }
      ]
    );

   
  }

  const clickEndRide=()=>{

    Alert.alert(
      "Confirmation",
      "Are you sure you want End ride ?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Yes", onPress: () =>  {
          if(isl==true){
           if(isInternet){
            fetchDistanceBetweenPointsOnline(
              request.pickup.location.latitude,
              request.pickup.location.longitude,
              cl.latitude,
              cl.longitude,
              "endride"
             )
           }else{
             utils.AlertMessage("","Please connect internet !")
           }
   
           }else if(isl==false){
             utils.AlertMessage("","Please turn on location !")
           }
        } }
      ]
    );
 
  }
  
const  onCashsubmit=(c,ra)=>{

  console.log("remiang amount : ",ra)
  
    if(c=="normal"){
        setcashconfirmMV(false);
        setl(true);
       
       const bodyData={amt_paid:normalPaycash}
       const header=authToken;
 
    db.api.apiCall("put",db.link.paycashEqual+request._id,bodyData,header)
    .then((response) => {
          
           console.log("paycashEqual response : " , response);
           setl(false);

          if(response.msg=="Invalid Token"){
            utils.AlertMessage("", response.msg ) ;
            onLogout();
            return;
            }
  
          if(response.success){
            setnormalPay(true);
            utils.ToastAndroid.ToastAndroid_SB("Done")
             return;
             }

           if(!response.success){
                utils.AlertMessage("",response.message)
               return;
               }
   

 
    }).catch((e) => {
         setl(false);
      //  utils.AlertMessage("","Network request failed");
       console.error("paycashEqual catch error : ", e)
      return;
    })


      return;
    }

    if(c=="cutt"){
       setcashconfirmMV(false);
       setl(true);
       
       const bodyData={amt_paid:normalPaycash,credit:ra}
       const header=authToken;
 
    db.api.apiCall("put",db.link.paycashLess+request._id,bodyData,header)
    .then((response) => {
          
           console.log("paycashLess response : " , response);
           setl(false);

          if(response.msg=="Invalid Token"){
            utils.AlertMessage("", response.msg ) ;
            onLogout();
            return;
            }
  
          if(response.success){
           setnormalPay(true)
            utils.ToastAndroid.ToastAndroid_SB("Done")
             return;
             }

           if(!response.success){
                utils.AlertMessage("",response.message)
               return;
               }
   

 
    }).catch((e) => {
         setl(false);
      //  utils.AlertMessage("","Network request failed");
       console.error("paycashLess catch error : ", e)
      return;
    })


      return;
    }


    if(c=="add"){
       setcashconfirmMV(false);
       setl(true);
       
       const bodyData={amt_paid:normalPaycash,debit:ra}
       const header=authToken;
 
    db.api.apiCall("put",db.link.paycashExtra+request._id,bodyData,header)
    .then((response) => {
          
           console.log("paycashExtra response : " , response);
           setl(false);

          if(response.msg=="Invalid Token"){
            utils.AlertMessage("", response.msg ) ;
            onLogout();
            return;
            }
  
          if(response.success){
           setnormalPay(true)
            utils.ToastAndroid.ToastAndroid_SB("Done")
             return;
             }

           if(!response.success){
                utils.AlertMessage("",response.message)
               return;
               }
   

 
    }).catch((e) => {
         setl(false);
      //  utils.AlertMessage("","Network request failed");
       console.error("paycashExtra catch error : ", e)
      return;
    })


      return;
    }
  
  } 

  const onTripRating=()=>{

    setl(true)
	  let bodyData=   {rating:starCount}
	  const header= authToken
 
	    db.api.apiCall("put",db.link.addTripRating+request._id ,bodyData,header)
	     .then((response) => {
	     setl(false)
		  console.log("onTripRating response : " , response);
	 
      if(response.msg=="Invalid Token"){
        utils.AlertMessage("", response.msg ) ;
        onLogout();
        return;
        }
   
		  if(response.success){
			  clearallFields() 
        utils.ToastAndroid.ToastAndroid_SB("Trip Complete :)");
			  return;
		  }
 
		  if(!response.success){
		  utilsS.AlertMessage("",response.message);
		   return;
	   }
 
   }).catch((e) => {
	  setl(false);
	  utilsS.AlertMessage("","Network request failed");
	  console.error("onTripRating catch error : ", e)
	 return;
   })
 
 }

  const onclickDoneRide=()=>{
    
    if(starCount>0){
      if(isInternet){
        onTripRating();
      }else{
       utils.AlertMessage("","Please connect internet .")
      }
    }else{
      clearallFields() 
      utils.ToastAndroid.ToastAndroid_SB("Trip Complete :)");
    }
    
   
    
    }
  
const confirmCashSubmit=(c,ra)=>{
  Alert.alert(
    "Confirmation",
    "Are you sure submit this amount ?",
    [
      {
        text: "No",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      },
      { text: "Yes", onPress: () =>  {
        if(isInternet){
             onCashsubmit(c,ra)
        }
        else{
          utils.AlertMessage("","Please connect internet")
        }
        //  setl(true);

        //  if(trip.length>0){
        //   trip.map((e,i,a)=>{
        //   if(e.id==request.id){
        //     trip[i].normalPay=true
        //     trip[i].collectcash=cash
        //     }
        //   })
        // }
        //  changerequest("cash","","",cash);

        // setTimeout(() => {
        //   setl(false);
        //   setcash("")
        // }, 1200);
      } }
    ]
  );
}

 const  clickCashSubmit=()=>{

 if(csh==""){
   utils.AlertMessage("","Please enter amont")
 }else{
  let npc=normalPaycash.toFixed()
  if(cash<npc){
    setcashG(false)
    setcashconfirmMV(true)
}else if(cash>npc){
  setcashG(true)
  setcashconfirmMV(true);
}else
{
 confirmCashSubmit("normal",0)
}


 }

  
 }
 
 const renderIcon = (props) => (
 
  <TouchableWithoutFeedback onPress={()=>setcash("")} >
   <utils.vectorIcon.Entypo name="cross" size={22} color="gray" />
  </TouchableWithoutFeedback>
);
 
const renderShowLocation=()=>{

  //when acpt  request
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

 // when arrive for pickup true

 if (accept && arrive && !startride  && !endride){
  const title=request.dropoff.name
  const title2= request.dropoff.address

   let textcolor= ct>cancelTime?"#1CC625":"red"
   let  bbc = ct>cancelTime?"gray":theme.color.buttonLinerGC1                          //button backkgrnd color

  return(

    <View style={{position:"absolute",top:0,left:10,right:10}}> 


<View style={{width:wp("80%"),height:80,borderRadius:10,padding:5,backgroundColor:"white",elevation:3,flexDirection:"row",alignItems:"center"}}>
 
 <View style={{width:"79.5%",height:"100%",padding:5,marginTop:20}}>
<theme.Text  numberOfLines={1} ellipsizeMode="tail" style={{fontSize:17,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20}}> 
{title}
</theme.Text>  
<theme.Text  numberOfLines={1} ellipsizeMode="tail" style={{fontSize:14,color:"gray",lineHeight:20}}> 
{title2}
</theme.Text> 
 </View>

 <View style={{backgroundColor:"silver",width:"0.5%",height:"100%",opacity:0.4}} />


<TouchableOpacity  onPress={()=>{navigatetoGoogleMaps("dropoff")}}  style={{width:"20%",height:"100%",padding:5,alignItems:"center",justifyContent:"center"}} >

<Image  source={require("../../../assets/Navigate/navigate.png")} style={{width:35,height:35,opacity:0.8}} />

<theme.Text  style={{fontSize:14,color:theme.color.buttonLinerGC1,fontFamily:theme.fonts.fontMedium}}> 
START
</theme.Text>

</TouchableOpacity>


    </View>


   <View style={{width:wp("95%"),borderRadius:10,padding:10,marginTop:5,backgroundColor:"white",elevation:3,flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>

<View style={{flexDirection:"row",alignItems:"center"}}>
<theme.Text   style={{fontSize:14,color:"black",fontFamily:theme.fonts.fontMedium}}> 
Waiting Time
</theme.Text>

{waitTime!="f" &&(
  <CountDown
    size={10}
    style={{marginLeft:5}}
    until={waitTime}  //num of second
    onFinish={() => {}}
    onChange={(t)=>{setct(t)}}
    digitStyle={{backgroundColor: '#FFF', borderWidth: 0, borderColor:theme.color.buttonLinerGC1}}
    digitTxtStyle={{color: textcolor ,fontSize:14}}
    timeLabelStyle={{color: 'red', fontWeight: 'bold'}}
    separatorStyle={{color: '#1CC625'}}
    timeToShow={['M', 'S']}
    timeLabels={{m: null, s: null}}
    showSeparator
  />
)}


</View> 

<TouchableOpacity
disabled={bbc=="gray"?true:false}
onPress={()=>{cancelJob()}}
style={{backgroundColor:bbc,width:90,height:30,borderRadius:5,alignItems:"center",justifyContent:"center"}}>
<theme.Text   style={{fontSize:12,color:"white",fontFamily:theme.fonts.fontMedium}}> 
CANCEL JOB
</theme.Text>
</TouchableOpacity>

    </View>

  
    </View>


  )
 }


// when start ride
     if(arrive && startride && accept && !endride){
      
      
      const title=request.dropoff.name
      const title2= request.dropoff.address


      return(

        <View style={{position:"absolute",top:0,left:10,right:10}}> 


<View style={{width:wp("80%"),height:80,borderRadius:10,padding:5,backgroundColor:"white",elevation:3,flexDirection:"row",alignItems:"center"}}>
 
     <View style={{width:"79.5%",height:"100%",padding:5,marginTop:20}}>
    <theme.Text  numberOfLines={1} ellipsizeMode="tail" style={{fontSize:17,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20}}> 
    {title}
   </theme.Text>  
   <theme.Text  numberOfLines={1} ellipsizeMode="tail" style={{fontSize:14,color:"gray",lineHeight:20}}> 
    {title2}
   </theme.Text> 
     </View>

     <View style={{backgroundColor:"silver",width:"0.5%",height:"100%",opacity:0.4}} />


    <TouchableOpacity  onPress={()=>{navigatetoGoogleMaps("dropoff")}}  style={{width:"20%",height:"100%",padding:5,alignItems:"center",justifyContent:"center"}} >

    <Image  source={require("../../../assets/Navigate/navigate.png")} style={{width:35,height:35,opacity:0.8}} />

   <theme.Text  style={{fontSize:14,color:theme.color.buttonLinerGC1,fontFamily:theme.fonts.fontMedium}}> 
    START
   </theme.Text>

   </TouchableOpacity>


        </View>


   <View style={{width:wp("95%"),borderRadius:10,paddingVertical:2,paddingHorizontal:5,marginTop:5,backgroundColor:"white",elevation:3,flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>

   <View style={{alignItems:"center",justifyContent:"center",width:"49%" }}>
   <theme.Text numberOfLines={1} ellipsizeMode="tail"  style={{fontSize:14,color:"gray",fontFamily:theme.fonts.fontMedium,textTransform:"uppercase",lineHeight:25}}> 
    Est Travel Time
   </theme.Text>
   <theme.Text   numberOfLines={1} ellipsizeMode="tail"  style={{fontSize:14,color:"black",fontFamily:theme.fonts.fontMedium,textTransform:"uppercase",lineHeight:25}}> 
    {tpd} 
    </theme.Text>
   </View>

<View style={{backgroundColor:"silver",width:"0.5%",height:"60%"}} />

   <View style={{alignItems:"center",justifyContent:"center",width:"49%"  }}>
   <theme.Text  numberOfLines={1} ellipsizeMode="tail"  style={{fontSize:14,color:"gray",fontFamily:theme.fonts.fontMedium,textTransform:"uppercase",lineHeight:25}}> 
    Est Total distance
   </theme.Text>
   <theme.Text  numberOfLines={1} ellipsizeMode="tail"  style={{fontSize:14,color:"black",fontFamily:theme.fonts.fontMedium,textTransform:"uppercase",lineHeight:25}}> 
   {dpd}
   </theme.Text>
   </View>

    </View>

  
        </View>
 
      )
     }


}
 
  const  renderShowButton=()=>{
    let msg=""
    let c=0;

    if(accept && !arrive && !startride && !endride && request){
     msg="Arrived for pickup"
     c=0;
    }
      else if(accept && arrive && !startride && !endride && request){
      msg="Start Ride"
      c=1;
     }
     else if(accept && arrive && startride && !endride && request){
      msg="End trip"
      c=2;
    }else if(accept && arrive && startride && endride && request){
        //  c=4
      // if(request.cardPay==true )
      // {
      //   msg="Finish"
      //   c=3
      // }
      
      // if(request.cardPay==false)
      // {
      // msg="submit"
      //  c=4  
      // }

      // if(request.normalPay==true )
      // {
      //   msg="Finish"
      //   c=5
      // }

      if(!normalPay){msg="submit";c=4}else{msg="finish";c=5}
      
    }

//  if card pay done already
//    if(c==3){
//     return(
// null
//       // <View style={{position:"absolute",bottom:0,width:wp("95%"),alignSelf:"center",padding:10}}>
      
 
//       //   <View style={{backgroundColor:"white",width:"100%",borderRadius:4,padding:10,marginBottom:10,elevation:5,flexDirection:"row"}}>
       
//       //  <View style={{marginTop:-4}}>
//       //  <utils.vectorIcon.SimpleLineIcons name="credit-card" color="black" size={30} />
//       //  </View>
       
//       //  <View style={{marginLeft:10,width:"85%"}}> 
      
//       //  <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:20,fontFamily:theme.fonts.fontMedium,color:"black",lineHeight:25}}>
//       //   Trip paid by card
//       //  </theme.Text>
      
//       //  <theme.Text  style={{fontSize:16,fontFamily:theme.fonts.fontMedium,color:"gray",marginTop:10}}>
//       //   You can view yours earnings in captain portal.
//       //  </theme.Text>
      
//       //  </View>
       
//       // </View>
      
//       // <View style={{backgroundColor:"white",width:"100%",borderRadius:4,padding:10,marginBottom:10,elevation:5}}>
//       //  <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:22,fontFamily:theme.fonts.fontMedium,color:"black",textTransform:"capitalize",lineHeight:25}}>
//       //   Rate {request.name}
//       //  </theme.Text>
      
//       //  <StarRating
//       //          containerStyle={{marginVertical:15}}
//       //         disabled={false}
//       //         maxStars={5}
//       //         starStyle={{borderWidth:0}}
//       //         fullStarColor={theme.color.buttonLinerGC1}
//       //         rating={starCount}
//       //         selectedStar={(rating) => setstarCount(rating)}
//       //       />
      
//       // </View>
      
//       //       <TouchableOpacity onPress={()=>{clickFinish()}} style={[styles.BottomButton,{width:"100%"}]}>
//       //       <LinearGradient colors={[theme.color.buttonLinerGC1,theme.color.buttonLinerGC2]} style={styles.LinearGradient}>
//       //               <View style={[styles.ButtonRight,{width:"100%"}]}>
//       //               <Text style={styles.buttonText}>{msg}</Text> 
//       //                </View>
//       //        </LinearGradient>
//       //        </TouchableOpacity>
   
//       // </View>
      
//           )
 
//    }
// else
  //  if colect cash in hand normal pay false
  if(c==4){

    return(
       <View style={{position:"absolute",bottom:0,width:wp("95%"),alignSelf:"center",padding:10}}>
      
        <View style={{backgroundColor:"white",width:"100%",borderRadius:4,padding:10,marginBottom:10,elevation:5}}>
          
      
       <theme.Text  style={{fontSize:20,fontFamily:theme.fonts.fontMedium,color:"black" }}>
        Collect cash
       </theme.Text>
      
       <theme.Text numberOfLines={1} ellipsizeMode="tail"  style={{fontSize:16,fontFamily:theme.fonts.fontMedium,color:"gray",textTransform:"capitalize",lineHeight:20,width:"95%"}}>
        from {request.customer.fullname}
       </theme.Text>

       <View style={{flexDirection:"row",alignItems:"center",width:"100%" ,justifyContent:"space-between",marginTop:20}}>

       <theme.Text numberOfLines={1} ellipsizeMode="tail"  style={{fontSize:16,fontFamily:theme.fonts.fontMedium,color:"gray",textTransform:"capitalize",lineHeight:20,width:"30%"}}>
        Total fare
       </theme.Text>
 
      <theme.Text numberOfLines={1} ellipsizeMode="tail"  style={{fontSize:22,lineHeight:30,fontFamily:theme.fonts.fontMedium,color:"#383838",textAlign:"right",width:"65%", }}>
              PKR {normalPaycash}
      </theme.Text>
  

       </View>
      
       </View>
       
       
      <View style={{backgroundColor:"white",width:"100%",borderRadius:4,padding:10,marginBottom:10,elevation:5}}>
       <theme.Text   style={{fontSize:20,fontFamily:theme.fonts.fontMedium,color:"black",lineHeight:25}}>
       Enter amount collected
       </theme.Text>
 
      <Input
      value={csh}
      keyboardType="number-pad"
      placeholder={"0"}
      accessoryRight={csh!=""?renderIcon:null}
      onChangeText={nextValue =>{setcsh(nextValue.replace(/\D/gm, ''));setcash(parseInt(nextValue))}}
    />
     
      
      </View>
      
            <TouchableOpacity disabled={csh==""?true:false} onPress={()=>{clickCashSubmit()}} style={[styles.BottomButton,{width:"100%"}]}>
            <LinearGradient colors={[theme.color.buttonLinerGC1,theme.color.buttonLinerGC2]} style={styles.LinearGradient}>
                    <View style={[styles.ButtonRight,{width:"100%"}]}>
                    <Text style={[styles.buttonText,{color:(csh=="")?"silver":"white"}]}>{msg}</Text> 
                     </View>
             </LinearGradient>
             </TouchableOpacity>
   
      </View>
      
          )

   }

   else
  //  done submit cash normal pay true
    if(c==5){
    return(
 
      <View style={{position:"absolute",bottom:0,width:wp("95%"),alignSelf:"center",padding:10}}>
      
 
        <View style={{backgroundColor:"white",width:"100%",borderRadius:4,padding:10,marginBottom:10,elevation:5,flexDirection:"row"}}>
       
       <View style={{marginTop:-4}}>
       <utils.vectorIcon.MaterialIcons name="payments" color="black" size={30} />
       </View>
       
       <View style={{marginLeft:10,width:"85%"}}> 
      
       <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:20,fontFamily:theme.fonts.fontMedium,color:"black",lineHeight:25}}>
        Route eranings
       </theme.Text>
      
       <theme.Text  style={{fontSize:16,fontFamily:theme.fonts.fontMedium,color:"gray",marginTop:10}}>
        You can view yours earnings in captain portal.
       </theme.Text>
      
       </View>
       
      </View>
      
      <View style={{backgroundColor:"white",width:"100%",borderRadius:4,padding:10,marginBottom:10,elevation:5}}>
       <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:22,fontFamily:theme.fonts.fontMedium,color:"black",textTransform:"capitalize",lineHeight:25}}>
        Rate {request.customer.fullnmae}
       </theme.Text>
      
       <StarRating
               containerStyle={{marginVertical:15}}
              disabled={false}
              maxStars={5}
              starStyle={{borderWidth:0}}
              fullStarColor={theme.color.buttonLinerGC1}
              rating={starCount}
              selectedStar={(rating) => setstarCount(rating)}
            />

      </View>
      
            <TouchableOpacity onPress={()=>{onclickDoneRide()}} style={[styles.BottomButton,{width:"100%"}]}>
            <LinearGradient colors={[theme.color.buttonLinerGC1,theme.color.buttonLinerGC2]} style={styles.LinearGradient}>
                    <View style={[styles.ButtonRight,{width:"100%"}]}>
                    <Text style={styles.buttonText}>{msg}</Text> 
                     </View>
             </LinearGradient>
             </TouchableOpacity>
   
      </View>
      
          )
 
   } 

  // c==0 , c==1 , c==2 
  
  else{
   
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

    } 
 
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

{ct>cancelTime && !startride &&(
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
      isVisible={ridemodal}
      backdropOpacity={0.9}
      animationIn="fadeInUp"
      animationOut="fadeOutDown"
      animationInTiming={110}
      animationOutTiming={100}
      backdropTransitionInTiming={100}
      backdropTransitionOutTiming={100}
      onRequestClose={() => { console.log("c")}}
   >
  
  <View style={{ flex: 1,justifyContent: 'center', alignItems: 'center' }}>
    
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
{tcp} | {dcp}
 </theme.Text>
</View>
 
<View style={{flexDirection:"row",alignItems:"center",justifyContent:"center",padding:5,width:"100%",height:"25%"}}>

  <View style={{backgroundColor:"silver",width:40,height:40,borderRadius:20,alignItems:"center",justifyContent:"center"}}>
  <utils.vectorIcon.MaterialIcons name="location-searching" size={25} color="blue"/>
  </View>

  <theme.Text  numberOfLines={1} ellipsizeMode="tail"  style={{fontSize:17,marginLeft:10,color:"black",fontFamily:theme.fonts.fontMedium,textTransform:"capitalize",width:"83%"}}> 
  DeliverIt - Mini
 </theme.Text>

</View>


<View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",padding:5,width:"100%",height:"35%"}}>
{/* custmr rating  */}
<View style={{width:"27%",flexDirection:"row",alignItems:"center",justifyContent:"space-evenly" }}>
<utils.vectorIcon.Entypo name="user" color="silver" size={18}/>
<Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:14,lineHeight:20,top:2}}>{ar.toFixed(1)}</Text> 
<utils.vectorIcon.Entypo name="star"  color={theme.color.buttonLinerGC1} size={18}/>
</View>

<View style={{width:"70%",flexDirection:"row",alignItems:"center", justifyContent:"space-between"}}>
<theme.Text numberOfLines={1} ellipsizeMode="tail"  style={{fontSize:14,color:"silver",fontFamily:theme.fonts.fontMedium,textTransform:"capitalize",width:"22%",lineHeight:20}}> Earn:</theme.Text>
<theme.Text numberOfLines={1} ellipsizeMode="tail"  style={{fontSize:14,color:"black",fontFamily:theme.fonts.fontMedium,textTransform:"capitalize",width:"76%",lineHeight:20}}>{request.rent} pkr</theme.Text>
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

const renderCashConfirmModal=()=>{
// let npc=normalPaycash!="---"?normalPaycash.toFixed():normalPaycash
let npc=normalPaycash
let ra= !cashG?(npc-cash):(cash-npc)  //remaining amount

let uwta=0;  //user walet totoal amount
if(cw!=false && cw!=="f"){
  uwta=cw
}

  return(
    <Modal 
    isVisible={cashconfirmMV}
    backdropOpacity={0.7}
    
    animationIn="fadeInUp"
    animationOut="fadeOutDown"
    animationInTiming={600}
    animationOutTiming={600}
    backdropTransitionInTiming={600}
    backdropTransitionOutTiming={600}
    onRequestClose={() => { setcashconfirmMV(false);setcheckBox(false) }}
 >

    <View style=
    {{
    backgroundColor:"white", 
    padding:10,
    width:"100%",
    borderRadius:5,
    alignSelf: 'center'
    }}>

 <TouchableOpacity onPress={()=>{setcashconfirmMV(false);setcheckBox(false)}} style={{alignSelf:"flex-end"}}> 
  <utils.vectorIcon.Entypo name={"cross"} color={"#0e47a1"}  size={26}/> 
 </TouchableOpacity>
 <Text style={{fontSize:18,color:"#0e47a1",fontWeight:"bold"}}>{cashG?"Collected cash amount is greater than fare rupees":"Collected cash amount is less than fare rupees"}</Text>


  {/* <ScrollView style={{width:"100%"}}>  */}

 
{cashG&&(
<View>

<View style={{flexDirection:"row",width:"100%",justifyContent:"space-between",alignItems:"center",marginTop:30}}>
<Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:15,color:"grey",width:"30%",lineHeight:20}}>Total Fare</Text> 
<Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:15,color:"black",width:"65%",textAlign:"right",lineHeight:20}}>PKR {npc}</Text> 
</View>
<View style={{flexDirection:"row",width:"100%",justifyContent:"space-between",alignItems:"center",marginTop:5}}>
<Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:15,color:"grey",width:"40%",lineHeight:20}}>Collected Cash</Text> 
<Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:15,color:"black",width:"55%",textAlign:"right",lineHeight:20}}>PKR {cash}</Text> 
</View>
<View style={{flexDirection:"row",width:"100%",justifyContent:"space-between",alignItems:"center",marginTop:5}}>
<Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:15,color:"grey",width:"40%",lineHeight:20}}>Extra amount</Text> 
<Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:15,color:"green",width:"55%",textAlign:"right",lineHeight:20}}>PKR {ra}</Text> 
</View>


<View style={{flexDirection:"row",width:"100%",marginTop:30,justifyContent:"space-between"}}>
 <TouchableOpacity onPress={()=>{if(isInternet){setcheckBox(!checkBox)}else{utils.AlertMessage("","Please connect internet")}}} style={{width:"5%",top:5}}> 
{!checkBox ?(
  <utils.vectorIcon.Entypo name={"circle"} color={"silver"}  size={15}/> 
  ):(
<utils.vectorIcon.FontAwesome name={"circle"} color={"#0e47a1"}  size={15}/> 
  )}
 </TouchableOpacity>
 <TouchableOpacity onPress={()=>{if(isInternet){setcheckBox(!checkBox)}else{utils.AlertMessage("","Please connect internet")}}}style={{width:"92%"}}>
 <Text  style={{fontSize:15,color:!checkBox?"silver":"black"}}>Add extra amount in user wallet</Text> 
 </TouchableOpacity>
</View>

{checkBox  &&(
<View style={{marginTop:20}}>

{cw!=="f" && cw!=="false" && !ll &&
<View>
<View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",width:"100%"}}>
<utils.vectorIcon.AntDesign name={"wallet"} color={"#0e47a1"}  size={28} style={{width:"10%"}}/> 
<Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:17,color:"#0e47a1",width:"88%",lineHeight:20,textTransform:"capitalize"}}>{request.customer.fullname}</Text> 
</View>

<View style={{marginTop:10}}>
<View style={{flexDirection:"row",width:"100%",justifyContent:"space-between",alignItems:"center",marginTop:5}}>
<Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:15,color:"grey",width:"40%",lineHeight:20}}>Total amont</Text> 
<Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:15,color:"black",width:"55%",textAlign:"right",lineHeight:20}}>PKR {uwta}</Text> 
</View>
<View style={{flexDirection:"row",width:"100%",justifyContent:"space-between",alignItems:"center",marginTop:5}}>
<Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:15,color:"grey",width:"40%",lineHeight:20}}>New amount</Text> 
<Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:15,color:"black",width:"55%",textAlign:"right",lineHeight:20}}>PKR {uwta+ra}</Text> 
</View>
</View>

<TouchableOpacity   onPress={()=>{confirmCashSubmit("add",ra)}} style={[styles.BottomButton,{width:"100%",marginTop:30}]}>
            <LinearGradient colors={[theme.color.buttonLinerGC1,theme.color.buttonLinerGC2]} style={styles.LinearGradient}>
                    <View style={[styles.ButtonRight,{width:"100%"}]}>
                    <Text style={[styles.buttonText,{color:"white"}]}>Submit</Text> 
                     </View>
             </LinearGradient>
             </TouchableOpacity>
</View>
}

{cw=="f" && ll&&
  <View style={{width:"100%",alignItems:"center",justifyContent:"center"}}>
  <ActivityIndicator color='green' size={20} />
  </View>
}
 
{cw=="false" && cw!=0 && !ll &&
  <View style={{width:"100%",alignItems:"center",justifyContent:"center"}}>
    <Text  style={{fontSize:16,color:"black"}}>Server error</Text> 
  <TouchableOpacity onPress={()=>{if(isInternet){getcustomerWalletinfo()}else{utils.AlertMessage("","Please connect internet")}}} >
 <Text  style={{fontSize:15,color:"red",textDecorationLine:"underline"}}>Retry</Text> 
 </TouchableOpacity>
  </View>
}
 
</View>)}
 
</View>
 )}


{!cashG&&(
<View>

<View style={{flexDirection:"row",width:"100%",justifyContent:"space-between",alignItems:"center",marginTop:30}}>
<Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:15,color:"grey",width:"30%",lineHeight:20}}>Total Fare</Text> 
<Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:15,color:"black",width:"65%",textAlign:"right",lineHeight:20}}>PKR {npc}</Text> 
</View>
<View style={{flexDirection:"row",width:"100%",justifyContent:"space-between",alignItems:"center",marginTop:5}}>
<Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:15,color:"grey",width:"40%",lineHeight:20}}>Collected Cash</Text> 
<Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:15,color:"black",width:"55%",textAlign:"right",lineHeight:20}}>PKR {cash}</Text> 
</View>
<View style={{flexDirection:"row",width:"100%",justifyContent:"space-between",alignItems:"center",marginTop:5}}>
<Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:15,color:"grey",width:"40%",lineHeight:20}}>Remaining</Text> 
<Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:15,color:"red",width:"55%",textAlign:"right",lineHeight:20}}>PKR {ra}</Text> 
</View>


<View style={{flexDirection:"row",width:"100%",justifyContent:"space-between",marginTop:30}}>
 <TouchableOpacity onPress={()=>{if(isInternet){setcheckBox(!checkBox)}else{utils.AlertMessage("","Please connect internet")}}} style={{width:"5%",top:5}}> 
{!checkBox ?(
  <utils.vectorIcon.Entypo name={"circle"} color={"silver"}  size={15}/> 
  ):(
<utils.vectorIcon.FontAwesome name={"circle"} color={"#0e47a1"}  size={15}/> 
  )}
 </TouchableOpacity>
 <TouchableOpacity onPress={()=>{if(isInternet){setcheckBox(!checkBox)}else{utils.AlertMessage("","Please connect internet")}}} style={{width:"92%"}}>
 <Text  style={{fontSize:15,color:!checkBox?"silver":"black"}}>Cut remaining amount from user wallet</Text> 
 </TouchableOpacity>
</View>

{checkBox&&(
<View style={{marginTop:20}}>

{cw!=="f" && cw!=="false" && !ll &&(
  <View>
<View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",width:"100%"}}>
<utils.vectorIcon.AntDesign name={"wallet"} color={"#0e47a1"}  size={28} style={{width:"10%"}}/> 
<Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:17,color:"#0e47a1",width:"88%",lineHeight:20,textTransform:"capitalize"}}>{request.customer.fullname}</Text> 
</View>

<View style={{marginTop:10}}>
<View style={{flexDirection:"row",width:"100%",justifyContent:"space-between",alignItems:"center",marginTop:5}}>
<Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:15,color:"grey",width:"40%",lineHeight:20}}>Total amont</Text> 
<Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:15,color:"black",width:"55%",textAlign:"right",lineHeight:20}}>PKR {uwta}</Text> 
</View>
{uwta>=ra?(
<View>
<View style={{flexDirection:"row",width:"100%",justifyContent:"space-between",alignItems:"center",marginTop:5}}>
<Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:15,color:"grey",width:"40%",lineHeight:20}}>New amount</Text> 
<Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:15,color:"black",width:"55%",textAlign:"right",lineHeight:20}}>PKR {uwta-ra}</Text> 
</View>

            <TouchableOpacity   onPress={()=>{confirmCashSubmit("cutt",ra)}} style={[styles.BottomButton,{width:"100%",marginTop:30}]}>
            <LinearGradient colors={[theme.color.buttonLinerGC1,theme.color.buttonLinerGC2]} style={styles.LinearGradient}>
                    <View style={[styles.ButtonRight,{width:"100%"}]}>
                    <Text style={[styles.buttonText,{color:"white"}]}>Submit</Text> 
                     </View>
             </LinearGradient>
             </TouchableOpacity>
</View>
):(
  <Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:15,color:"red",marginTop:10}}>Sorry user have no wallet amount</Text> 
)}

</View>
 </View>
)}


{cw=="f" && ll&&
  <View style={{width:"100%",alignItems:"center",justifyContent:"center"}}>
  <ActivityIndicator color='green' size={20} />
  </View>
}
 
{cw=="false"  && !ll &&
  <View style={{width:"100%",alignItems:"center",justifyContent:"center"}}>
   <Text  style={{fontSize:16,color:"black"}}>Server error</Text>
  <TouchableOpacity onPress={()=>{if(isInternet){getcustomerWalletinfo()}else{utils.AlertMessage("","Please connect internet")}}} >
 <Text  style={{fontSize:15,color:"red",textDecorationLine:"underline"}}>Retry</Text> 
 </TouchableOpacity>
  </View>
}
 
</View>)}
 
 
</View>
 )}

{/* </ScrollView> */}
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
 
  console.log("tpd ",tpd)
  console.log("dpd ",dpd)
  
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
{accept  && renderclIndactor()} 
{accept && request && renderShowButton()}

{!accept&&<Header setLoader={(c)=>setl(c)}  setActiveChecked={(t)=>setActiveChecked(t)}  propsH={props.propsH} />}
{!accept &&<SearchBox gotoCurrentLoc={()=>gotoCurrentLoc()}  Search={search} accept={accept} propsH={props.propsH} setSearch={(t)=>setsearch(t)} /> }
{(!accept && ridemodal==false ) && <Footer   active={activeChecked}/>}
{(!accept &&  request) && renderRideRequestModal() }
{renderCashConfirmModal()}
 
 <utils.Loader   loader={l} />
 
 </SafeAreaView>
)
    
}

const styless = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
 });
  