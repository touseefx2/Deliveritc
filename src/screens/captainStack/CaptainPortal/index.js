import React ,{useEffect,useRef,useState} from 'react';
import {Platform,Dimensions,Alert,TouchableOpacity,SafeAreaView,View,Text,ScrollView,ActivityIndicator} from 'react-native';
import utils from "../../../utils/index"
import LinearGradient from 'react-native-linear-gradient';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import GVs from '../../../stores/Global_Var';
import { inject, observer } from "mobx-react"; 
import MapContainer from '../../Map/MapContainer/index';
import { Container,NativeBaseProvider } from 'native-base';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Geolocation from '@react-native-community/geolocation';
import theme  from "../../../themes/index";
import ConnectivityManager from 'react-native-connectivity-status'
import styles from "./styles"
import moment from 'moment';
import db from "../../../database/index" 

let bc="silver"
let bckc="white"
let br=5
let w="32%"
let h=120
let bw=0.5
  
export default inject("userStore","generalStore","carStore","tripStore")(observer(CaptainPortal));

 
// function dateCheck(from,to,check) {
// //check  specific date exist btw two dates
//   var dateFrom = from;
//   var dateTo = to;
//   var dateCheck = check;
  
//   var d1 = dateFrom.split("/");
//   var d2 = dateTo.split("/");
//   var c = dateCheck.split("/");
  
//   var from = new Date(d1[2], parseInt(d1[1])-1, d1[0]);  // -1 because months are from 0 to 11
//   var to   = new Date(d2[2], parseInt(d2[1])-1, d2[0]);
//   var check = new Date(c[2], parseInt(c[1])-1, c[0]);
  
//   return (check >= from && check <= to)
// }
   
 function CaptainPortal(props)   {
  // const { user,setuser,isl,setisl,setrequest,request,trip,settrip,ac,setac} = props.store;

  const {user,authToken,setUser,setcl,cl,Logout,setonline} = props.userStore;
  const {cars,setCars} =  props.carStore;
  const {setrequest,accept,request,getReqById,setatime,setaccept,getreqloader,setgetreqloader,gro,setgro,endride} = props.tripStore;
  const {setLocation,isLocation,isInternet} = props.generalStore;


  const [trip,settrip]=useState(false);
  const [portal,setportal]=useState(false);
  const [total,settotal]=useState(false);

  const [gettripOnce,setgettripOnce]=useState(false);
  const [isserverErr,setisserverErr]=useState(false);
  const [refresh,setrefresh]=useState(false);

  const [loader,setloader]=useState(false);
  //week base 
  const [weeknum,setweeknum]=useState(0);
  const [startDate,setstartDate]=useState(moment().add(weeknum, 'weeks').startOf('week'));
  const [endDate,setendDate]=useState(moment().add(weeknum, 'weeks').endOf('week'));
  const [tcheck,settcheck]=useState(true);
  
 
  let earn=0.00;                  //sara kch mila kr ktna kamaya deliver it ka tax cut kr or jo be cut ho ra   or jo extra kamaya wo be
  let acceptedTrips=0;
  let totalTrips=0;
  let totalcompletetrip=0.00     //in a week
  let totalearn=0.00           //total kamaya ktnacmplt trips without cuts tax 
  let finaltotalearn=0.00     //20 person deliverit ka   ktna hwa cmplt trips me se
 
  let totalCancelEarn=0.00;

   let companyearn=0.00
  
  let cutPercent=20        
  
  let cancelTrips=0.00;

  let totalCancelCut=0.00;

  let fulltripDetail=[];

  let  paidearn=90
  let  cutearn=50

  let acceptanceRate="---"
  let completionRate="---"
  let captainRating="---"

  let time=0;  //avaialabe hourse base on week cycle

 const onLogout=()=>{
  Logout();
 }

 const getTotal=(sd,ed)=>{
  
  const bodyData=false
  const header=authToken;
  const uid=user._id
  let route = uid+"&start="+moment(sd).format("Y-M-D")+"&end="+moment(ed).format("Y-M-D")

  
  // method, path, body, header
  db.api.apiCall("get",db.link.gettotaltripCalculationwithDate+route,bodyData,header)
  .then((response) => {
      
       console.log("getTotalwithDate response : " , response);
      

       if(response.data.length<=0){
        // utils.AlertMessage("", response.message ) ;
           settotal(false)
       }

      //  if(!response.message=="No records found"){
      //    settotal(false)
      //   return;
      //  }
  
  
       if(response.data.length>0){
        settotal(response.data[0])
       return;
       }
    
     
       return;
   
  }).catch((e) => {
    settotal(false)
     console.error("getTotalwithDate catch error : ", e)
    return;
  })
}

 const getPortal=(sd,ed)=>{
  
  const bodyData=false
  const header=authToken;
  const uid=user._id
  let route = uid+"&start="+moment(sd).format("Y-M-D")+"&end="+moment(ed).format("Y-M-D")

  console.log(db.link.getportalwithDate+route)

  // method, path, body, header
  db.api.apiCall("get",db.link.getportalwithDate+route,bodyData,header)
  .then((response) => {
      
       console.log("getportalwithDate response : " , response);
      

       if(!response.data){
        // utils.AlertMessage("", response.message ) ;
        setportal(false)
       }

       if(response.message=="No records found"){
         setportal(false)
        return;
       }
  
  
       if(response.data){
        setportal(response.data[0])
       return;
       }
    
     
       return;
   
  }).catch((e) => {
    setportal(false)
     console.error("getportalwithDate catch error : ", e)
    return;
  })
}

const getTrips=(sd,ed)=>{
       
      setloader(true);
      setisserverErr(false);
      setgettripOnce(false)
      settrip(false)
      const bodyData=false
      const header=authToken;
      const uid=user._id
      let route = uid+"&start="+moment(sd).format("Y-M-D")+"&end="+moment(ed).format("Y-M-D")

      // method, path, body, header
      db.api.apiCall("get",db.link.gettripbyUserwithDate+route,bodyData,header)
      .then((response) => {
           setloader(false);
           setisserverErr(false);

           console.log("getTripsbydate response : " , response);
        
             if(response.msg=="Invalid Token"){
               utils.AlertMessage("",response.msg) ;
               onLogout()
              return;
             }

           if(!response.data){
            utils.AlertMessage("", response.message ) ;
            setgettripOnce(false)
            return;
           }
      
      
           if(response.data){
            getPortal(sd,ed)
            getTotal(sd,ed)
            setgettripOnce(true)

            if(response.data=="No record found"){
              settrip([]);
              return;
            }

            if(response.data.length>0){

              let arr=[];
    
              response.data.map((e,i,a)=>{
 
               let c= e.status.filter(obj => {
              return (obj.status === "cancelled" || obj.status === "ended" ) ? true :false
              })
            
           
              if(c.length>0){
                arr.push(e)
               }
    
              })
    
              let tr=[];
    
              if(arr.length>0){
                tr =arr.sort((a, b) => {
                  var timeA = b.createdAt;
                  var timeB = a.createdAt;             
                  return (moment(timeA)).diff(moment(timeB)) 
                  });
              }else{
                           tr=arr
              }
               
    
              settrip(tr);
              return;
              }

  
           }
        
         
           return;
       
      }).catch((e) => {
          setloader(false);
          settrip(false)
          setisserverErr(true);
          setgettripOnce(false)
         console.error("getTripsbydate catch error : ", e)
        return;
      })
}

useEffect(() => {
 if(refresh){
   setloader(false);setgettripOnce(false);setisserverErr(false);
   settrip(false);setportal(false);settotal(false);
    setrefresh(false);
 }
}, [refresh])

 
  useEffect(() => {
 
     let sd=moment().add(weeknum, 'weeks').startOf('week');
     let ed=moment().add(weeknum, 'weeks').endOf('week');
     setstartDate(sd);
     setendDate(ed);
      if(isInternet&&!refresh){
       if(!gettripOnce){
         console.log("get trip ssssssssssss")
          getTrips(sd,ed)
       }
     }
   
  }, [weeknum,isInternet,refresh,gettripOnce])

  
  const renderTitle=()=>{
return(
  <View style={{width:"100%",marginTop:20}}>
     <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:26,fontFamily:theme.fonts.fontMedium,color:"black"}}> 
          Captain Portal
  </theme.Text>
  <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:16,color:"gray",width:"95%",lineHeight:20,marginTop:-8}}> 
           {user.fullname}
  </theme.Text>
  </View>
)
  }

  const renderCycle=()=>{
 
   let c=  moment(endDate.format('YYYY-MM-DD')).isSameOrAfter(new Date(), 'day'); //check curent date is greater than last wekk end date or not
    
    
    return(
      <View style={{width:"100%",marginTop:20,backgroundColor:"white",flexDirection:"row",alignItems:"center",justifyContent:"space-between",paddingHorizontal:5,borderRadius:5,borderColor:"silver",borderWidth:0.5}}>


    <TouchableOpacity onPress={()=>{changeWeek("sub")}}>
      <utils.vectorIcon.Ionicons name="chevron-back-outline" color={theme.color.buttonLinerGC1} size={25}/>
    </TouchableOpacity>

    <theme.Text  style={{fontSize:14,color:"gray"}}> 
          {startDate.format('DD MMM YYYY ')}-{endDate.format(' DD MMM YYYY')} 
    </theme.Text>

{c&&(
  <View style={{width:5,height:5}}/>
)}

{!c&&(
   <TouchableOpacity  onPress={()=>{changeWeek("add")}}>
      <utils.vectorIcon.Ionicons name="chevron-forward" color={theme.color.buttonLinerGC1} size={25}/>
    </TouchableOpacity>
)}
   
 
      </View>
    )
      }
 
const renderGeneralDetail=()=>{
  
return(
  <View style={{width:"100%",flexDirection:"row",alignItems:"center",justifyContent:"space-between",paddingVertical:10}}>

  {/* <TouchableOpacity style={{width:w,backgroundColor:bckc,borderColor:bc,borderWidth:bw,height:h,borderRadius:br,alignItems:"center",justifyContent:"center",padding:5}}>
     <utils.vectorIcon.Fontisto name="clock" size={24} color={theme.color.buttonLinerGC1} />
     <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:13,color:"gray",width:"95%",fontFamily:theme.fonts.fontMedium,lineHeight:20,alignSelf:"center",textAlign:"center",marginTop:5,textTransform:"uppercase"}}> 
      Available Hours
    </theme.Text>
    <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:12,color:"black",width:"95%",fontFamily:theme.fonts.fontMedium,lineHeight:20,alignSelf:"center",textAlign:"center",marginTop:5,textTransform:"uppercase"}}> 
     {time==0 ?"0 sec":secondsToHms(time)}
    </theme.Text>
  </TouchableOpacity> */}

  <TouchableOpacity style={{width:w,backgroundColor:bckc,borderColor:bc,borderWidth:bw,height:h,borderRadius:br,alignItems:"center",justifyContent:"center",padding:5}}>
     <utils.vectorIcon.Ionicons name="star" size={24} color={theme.color.buttonLinerGC1} />
     <theme.Text numberOfLines={2} ellipsizeMode="tail" style={{fontSize:12,color:"gray",width:"95%",fontFamily:theme.fonts.fontMedium,lineHeight:20,alignSelf:"center",textAlign:"center",marginTop:5,textTransform:"uppercase"}}> 
      Captain rating
    </theme.Text>
    {loader?(
      <ActivityIndicator color={theme.color.buttonLinerGC1} size={14} />
    ):(
   <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:11,color:"black",width:"95%",fontFamily:theme.fonts.fontMedium,lineHeight:20,alignSelf:"center",textAlign:"center",marginTop:5,textTransform:"uppercase"}}> 
     {captainRating}
    </theme.Text>
    )}
  </TouchableOpacity>

  
   <TouchableOpacity style={{width:w,backgroundColor:bckc,borderColor:bc,borderWidth:bw,height:h,borderRadius:br,alignItems:"center",justifyContent:"center",padding:5}}>
     <utils.vectorIcon.Ionicons name="checkmark-done-sharp" size={24} color={theme.color.buttonLinerGC1} />
     <theme.Text numberOfLines={2} ellipsizeMode="tail" style={{fontSize:12,color:"gray",width:"95%",fontFamily:theme.fonts.fontMedium,lineHeight:20,alignSelf:"center",textAlign:"center",marginTop:5,textTransform:"uppercase"}}> 
      completion rate
    </theme.Text>
      {loader?(
      <ActivityIndicator color={theme.color.buttonLinerGC1} size={14} />
    ):(
    <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:11,color:"black",width:"95%",fontFamily:theme.fonts.fontMedium,lineHeight:20,alignSelf:"center",textAlign:"center",marginTop:5,textTransform:"uppercase"}}> 
     {completionRate} %
    </theme.Text>
    )}
  </TouchableOpacity>
   

<TouchableOpacity style={{width:w,backgroundColor:bckc,borderColor:bc,borderWidth:bw,height:h,borderRadius:br,alignItems:"center",justifyContent:"center",padding:5}}>
     <utils.vectorIcon.Ionicons name="checkmark-circle" size={24} color={theme.color.buttonLinerGC1} />
     <theme.Text numberOfLines={2} ellipsizeMode="tail" style={{fontSize:12,color:"gray",width:"95%",fontFamily:theme.fonts.fontMedium,lineHeight:20,alignSelf:"center",textAlign:"center",marginTop:5,textTransform:"uppercase"}}> 
      Acceptance rate
    </theme.Text>
     {loader?(
      <ActivityIndicator color={theme.color.buttonLinerGC1} size={14} />
    ):(
    <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:11,color:"black",width:"95%",fontFamily:theme.fonts.fontMedium,lineHeight:20,alignSelf:"center",textAlign:"center",marginTop:5,textTransform:"uppercase"}}> 
     {acceptanceRate} %
    </theme.Text>
    )}
  </TouchableOpacity>
    
 
  
    </View>
)
}

const changeWeek=(c)=>{
 
  
totalTrips=0;
totalcompletetrip=0.00     //in a week
cancelTrips=0.00;
acceptedTrips=0;

earn=0.00;                  //sara kch mila kr ktna kamaya deliver it ka tax cut kr or jo be cut ho ra   or jo extra kamaya wo be
totalearn=0.00            //20 person deliverit ka nikla kr
finaltotalearn=0.00      //total kamaya ktna cash me without cuts tax
companyearn=0.00
cutPercent=20        


totalCancelEarn=0.00;
totalCancelCut=0.00;

fulltripDetail=[];

paidearn=90
cutearn=40

acceptanceRate="---"
completionRate="---"
captainRating="---"

time=0;  //avaialabe hourse base on week cycle


settrip(false);
setportal(false);
settotal(false);
   

  let chk=c=="add"?weeknum+1:weeknum-1
  setweeknum(chk); 
  setgettripOnce(false)

}

// function secondsToHms(d) {
//   d = Number(d);
//   var h = Math.floor(d / 3600);
//   var m = Math.floor(d % 3600 / 60);
//   var s = Math.floor(d % 3600 % 60);

//   var hDisplay = h > 0 ? h + (h == 1 ? " h, " : " h, ") : "";
//   var mDisplay = m > 0 ? m + (m == 1 ? " m, " : " m, ") : "";
//   var sDisplay = s > 0 ? s + (s == 1 ? " s" : " s") : "";
//   return hDisplay + mDisplay + sDisplay; 
// }

const renderLine=()=>{
  return(
<View style={{width:"95%",backgroundColor:"silver",height:0.5,alignSelf:"center"}} />
  )
}

 const rendertripPayDetail=()=>{
 
  let fontSize=14.5
  let textcolor1= parseFloat(totalearn)>=0 ? "black":"red"
  let textcolor2="black"
return(
 <View style={{borderColor:bc,borderWidth:bw,borderRadius:br}}>

<TouchableOpacity style={{width:"100%", padding:5}}>
   <theme.Text  style={{fontSize:14,color:"gray",fontFamily:theme.fonts.fontMedium }}> 
      Trip
    </theme.Text>
    <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",width:"96%",alignSelf:"center"}}>
    <theme.Text numberOfLines={1} ellipsizeMode="tail"  style={{fontSize:fontSize,color:"black",fontFamily:theme.fonts.fontMedium,width:"34%" ,lineHeight:20}}> 
      x {totalcompletetrip}
    </theme.Text>
    <theme.Text numberOfLines={1} ellipsizeMode="tail"  style={{fontSize:fontSize,color:textcolor1,fontFamily:theme.fonts.fontMedium,width:"58%" ,lineHeight:20,textTransform:"uppercase",textAlign:"right"}}> 
     PKR {parseFloat(totalearn).toFixed()}
    </theme.Text>
    </View>
</TouchableOpacity>

{renderLine()}

<TouchableOpacity style={{width:"100%", padding:5}}>
   <theme.Text  style={{fontSize:14,color:"gray",fontFamily:theme.fonts.fontMedium }}> 
      Cancelled Trip
    </theme.Text>
    <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",width:"96%",alignSelf:"center"}}>
    <theme.Text numberOfLines={1} ellipsizeMode="tail"  style={{fontSize:fontSize,color:"black",fontFamily:theme.fonts.fontMedium,width:"34%" ,lineHeight:20}}> 
      x {cancelTrips}
    </theme.Text>
    <theme.Text numberOfLines={1} ellipsizeMode="tail"  style={{fontSize:fontSize,color:textcolor2,fontFamily:theme.fonts.fontMedium,width:"58%" ,lineHeight:20,textTransform:"uppercase",textAlign:"right"}}> 
     PKR {parseFloat(totalCancelEarn).toFixed()}
    </theme.Text>
    </View>
</TouchableOpacity>

{renderLine()}

<TouchableOpacity style={{width:"100%", padding:5}}>
   <theme.Text  style={{fontSize:14,color:"gray",fontFamily:theme.fonts.fontMedium }}> 
      Cash Trip Payment
    </theme.Text>
    <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",width:"96%",alignSelf:"center"}}>
    <theme.Text numberOfLines={1} ellipsizeMode="tail"  style={{fontSize:fontSize,color:"black",fontFamily:theme.fonts.fontMedium,width:"34%" ,lineHeight:20}}> 
      x {totalcompletetrip}
    </theme.Text>
    <theme.Text numberOfLines={1} ellipsizeMode="tail"  style={{fontSize:fontSize,color:"red",fontFamily:theme.fonts.fontMedium,width:"58%" ,lineHeight:20,textTransform:"uppercase",textAlign:"right"}}> 
     PKR {parseFloat(finaltotalearn).toFixed()}
    </theme.Text>
    </View>
</TouchableOpacity>

{renderLine()}

<TouchableOpacity style={{width:"100%", paddingHorizontal:5,paddingVertical:10}}>
    <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",width:"96%",alignSelf:"center"}}>
    <theme.Text numberOfLines={1} ellipsizeMode="tail"  style={{fontSize:fontSize,color:"black",fontFamily:theme.fonts.fontMedium,width:"34%" ,lineHeight:20}}> 
    Total
    </theme.Text>
    <theme.Text numberOfLines={1} ellipsizeMode="tail"  style={{fontSize:fontSize,color:"black",fontFamily:theme.fonts.fontMedium,width:"58%" ,lineHeight:20,textTransform:"uppercase",textAlign:"right"}}> 
     PKR {parseFloat(earn).toFixed()}
    </theme.Text>
    </View>
</TouchableOpacity>

  </View>
)
 }

 const renderShowTrips=()=>{
   //siraf wo detail show hn gi jo end trip wali hn gi yani collectcash ya end ride true
   let fontSize=12
   let textcolor2= "red"
  
 
   const  t=trip.map((e,i,a)=>{
   
    let status=e.status[e.status.length-1].status
    let textcolor1="black"
    // let textcolor1=  (status!="cancelled")?"black":e.cancelStatus=="unPaidcut"?"red":"green" 

    var  t =  moment(e.createdAt).format('hh:mm a')  
    var date =  moment(e.createdAt).format("ddd D MMM");   //9 july 2021
    let createdAt= date+", "+t
    let tid=e.t_id   //trip id
    let rent=0  //total amount in trip
   
    if(status=="ended"){rent=e.rent}

    let statuss=status=="ended"?"complete":status
    let statusColor= "gray"
    let rentColor= "green"
    
    if( status=="cancelled"){
    
      if(e.amt_paid==0){rentColor="gray"}

      if(e.cancelled_by=="captain" ){
        if(e.amt_paid>0){
          rentColor="green";
          rent=e.amt_paid
        }
        if(e.amt_paid<0){
          rentColor="red"
          rent=e.amt_paid
        }
      }

      if(e.cancelled_by=="customer" ){
        if(e.amt_paid>0 ){
          rentColor="green";
          rent=e.amt_paid 
        }
      }
      
    }
 
    return(
      <View> 
   <TouchableOpacity  
  style={{width:"100%"}} 
   disabled={e.status=="reject"?true:e.status=="skip"?true:false}
   onPress={()=>{props.navigation.navigate("TripDetail",{e})}}>
   <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",width:"100%",alignSelf:"center",padding:5}}>
    <View style={{width:"57%"}}>
    <theme.Text numberOfLines={1} ellipsizeMode="tail"  style={{fontSize:fontSize,color:"black",lineHeight:18,textTransform:"uppercase"}}> 
     {createdAt}
    </theme.Text>
    <theme.Text numberOfLines={1} ellipsizeMode="tail"  style={{fontSize:fontSize,color:"gray",lineHeight:15 }}> 
      Trip {tid}
    </theme.Text>
    <theme.Text numberOfLines={1} ellipsizeMode="tail"  style={{fontSize:fontSize,color:statusColor,textTransform:"capitalize",lineHeight:15 }}> 
     {statuss} {e.cancelled_by}
    </theme.Text>
    </View>
    <theme.Text numberOfLines={1} ellipsizeMode="tail"  style={{fontSize:fontSize,color:rentColor,width:"40%" ,lineHeight:20,textAlign:"right",textTransform:"uppercase"}}> 
     {rent}
    </theme.Text>
    </View>
    {/* {e.normalPay==true&&(
    <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",width:"100%",alignSelf:"center",padding:5}}>
    <View style={{width:"57%"}}>
      <theme.Text numberOfLines={1} ellipsizeMode="tail"  style={{fontSize:fontSize,color:"black",lineHeight:18,textTransform:"uppercase" }}> 
       {createdAt}
      </theme.Text>
      <theme.Text numberOfLines={1} ellipsizeMode="tail"  style={{fontSize:fontSize,color:"gray" ,lineHeight:15}}> 
       Cash Trip Payment {tid}
      </theme.Text>
    </View>
    <theme.Text numberOfLines={1} ellipsizeMode="tail"  style={{fontSize:fontSize,color:textcolor2,width:"42%" ,lineHeight:20,textAlign:"right",textTransform:"uppercase"}}> 
      - {tcc}
      </theme.Text>
    </View>
    )} */}

    </TouchableOpacity>
 
    {i!=a.length-1 && renderLine()}
    </View>
    )
    
      })

      return t;
 }

 const rendertripDetail=()=>{
  

  let textcolor1= parseFloat(totalearn)>=0 ? "black":"red"
  let textcolor2= parseFloat(totalCancelEarn)>=0 ? "black":"red"

return(
 <View style={{borderColor:bc,borderWidth:bw,borderRadius:br,marginTop:15}}>

 
    <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",width:"100%",alignSelf:"center",padding:5}}>
    <theme.Text numberOfLines={1} ellipsizeMode="tail"  style={{fontSize:14,color:"black",fontFamily:theme.fonts.fontMedium,width:"52%" ,lineHeight:20 }}> 
      Date, Time
    </theme.Text>
    <theme.Text numberOfLines={1} ellipsizeMode="tail"  style={{fontSize:14,color:"black",fontFamily:theme.fonts.fontMedium,width:"45%" ,lineHeight:20,textAlign:"right"}}> 
       PKR
    </theme.Text>
    </View>
 
{renderLine()}
{renderShowTrips()}
  
{/* 
{renderLine()}

<TouchableOpacity style={{width:"100%", padding:5}}>
   <theme.Text  style={{fontSize:14,color:"gray",fontFamily:theme.fonts.fontMedium }}> 
      Cash Trip Payment
    </theme.Text>
    <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",width:"96%",alignSelf:"center"}}>
    <theme.Text numberOfLines={1} ellipsizeMode="tail"  style={{fontSize:fontSize,color:"black",fontFamily:theme.fonts.fontMedium,width:"34%" ,lineHeight:20}}> 
      x {totalcompletetrip}
    </theme.Text>
    <theme.Text numberOfLines={1} ellipsizeMode="tail"  style={{fontSize:fontSize,color:"red",fontFamily:theme.fonts.fontMedium,width:"58%" ,lineHeight:20,textTransform:"uppercase",textAlign:"right"}}> 
     - PKR {parseFloat(finaltotalearn).toFixed(2)}
    </theme.Text>
    </View>
</TouchableOpacity>

{renderLine()}

<TouchableOpacity style={{width:"100%", paddingHorizontal:5,paddingVertical:10}}>
    <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",width:"96%",alignSelf:"center"}}>
    <theme.Text numberOfLines={1} ellipsizeMode="tail"  style={{fontSize:fontSize,color:"black",fontFamily:theme.fonts.fontMedium,width:"34%" ,lineHeight:20}}> 
    Total
    </theme.Text>
    <theme.Text numberOfLines={1} ellipsizeMode="tail"  style={{fontSize:fontSize,color:"black",fontFamily:theme.fonts.fontMedium,width:"58%" ,lineHeight:20,textTransform:"uppercase",textAlign:"right"}}> 
     PKR {parseFloat(earn).toFixed(2)}
    </theme.Text>
    </View>
</TouchableOpacity> */}

  </View>
)
 }

 const renderInternetErr=()=>{
   return <Text style={{position:"absolute",top:"60%",color:"grey",fontSize:15,alignSelf:"center"}}>No internet connection !</Text>
 }

 const renderServerErr=()=>{
  return  (
    <View style={{marginTop:80}}>
    <Text style={{color:"grey",fontSize:15,alignSelf:"center",marginBottom:5}}>Server not respond !</Text>
    <TouchableOpacity   onPress={()=>{ if(isInternet){setrefresh(true)}else{utils.AlertMessage("","Please connect internet !")} }}>
    <Text  style={{color:theme.color.buttonLinerGC1,fontSize:15,textDecorationLine:"underline",alignSelf:"center"}}>Retry</Text>
    </TouchableOpacity>
    </View>
  )
}
 
if(portal&&total){

totalTrips=portal.offered_trips
totalcompletetrip=portal.completed_trips;
cancelTrips=portal.canceled_trips;
acceptedTrips=portal.accepted_trips

 totalearn=(total.total_completed_trips).toFixed()        //complt trip ka total without cut company  tax  
 finaltotalearn=-Math.abs(((cutPercent/100)*totalearn).toFixed())   //cplt trip me se cmpny ka ktna hwa                     
 totalCancelEarn=total.total_cancelled_trips_bycaptain + total.total_cancelled_trips_bycustomer
 earn=parseInt(totalearn)+parseInt(finaltotalearn)+parseInt(totalCancelEarn)


//captain rating
captainRating= portal.rating!=null?portal.rating.toFixed(1):(0).toFixed(1)
//get acptnce rate of week cyycle
let t= 100/totalTrips
let ar= parseFloat(acceptedTrips*t).toFixed(1)
 acceptanceRate=ar
//get completion rate
let tt= 100/(acceptedTrips-total.count_cancelled_trips_bycustomer)  //acpt trip se minus ho gi wo trip jo user ne cancel ke
let cr= parseFloat(totalcompletetrip*tt).toFixed(1)
completionRate=cr
}
 
// console.log("trip : ",trip)
// console.log("portal : ",portal)
  //  console.log("total : ",total)
 
  return(
 <SafeAreaView style={styles.container}>
 <utils.DrawerHeader p={props} title="" />
 {!isInternet && !isserverErr && !loader  && trip!=false && <utils.TopMessage msg="No internet connection ! "/> } 
 {!isInternet && !isserverErr && (!trip) && !loader && renderInternetErr()} 
 <ScrollView showsVerticalScrollIndicator={false}   >
 {renderTitle()}
 {renderCycle()}
 {renderGeneralDetail()}
{isserverErr   && !loader && renderServerErr()}
{loader && <ActivityIndicator style={{marginTop:100,alignSelf:"center"}} size={25} color={theme.color.buttonLinerGC1} />}

{!loader && trip && trip.length>0 && portal && total && !isserverErr &&(
   <View>
 {rendertripPayDetail()}
 {rendertripDetail()}
   </View>
 )}

  {!loader && trip && trip.length <=0 && !isserverErr &&(
   <View style={{flexDirection:"row",marginTop:110,alignItems:"center",alignSelf:"center"}}>
  <utils.vectorIcon.Foundation name="page-doc"  size={20} color={"grey"} />
  <Text style={{color:"grey",fontSize:15,alignSelf:"center",marginLeft:15,top:2.5}}>No Record Found !</Text>
   </View>
 )}

 </ScrollView>
 </SafeAreaView>
)
    
  }