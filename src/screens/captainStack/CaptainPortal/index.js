import React ,{useEffect,useRef,useState} from 'react';
import {Platform,Dimensions,Alert,TouchableOpacity,SafeAreaView,View,Text,ScrollView} from 'react-native';
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

let bc="silver"
let bckc="white"
let br=5
let w="47%"
let h=120
let bw=0.5
  
export default inject("store")(observer(CaptainPortal));

 
function dateCheck(from,to,check) {
//check  specific date exist btw two dates
  var dateFrom = from;
  var dateTo = to;
  var dateCheck = check;
  
  var d1 = dateFrom.split("/");
  var d2 = dateTo.split("/");
  var c = dateCheck.split("/");
  
  var from = new Date(d1[2], parseInt(d1[1])-1, d1[0]);  // -1 because months are from 0 to 11
  var to   = new Date(d2[2], parseInt(d2[1])-1, d2[0]);
  var check = new Date(c[2], parseInt(c[1])-1, c[0]);
  
  return (check >= from && check <= to)
}
   
 function CaptainPortal(props)   {
  const { user,setuser,isl,setisl,setrequest,request,trip,settrip,ac,setac} = props.store;
  const [loader,setloader]=useState(false);
  //week base 
  const [weeknum,setweeknum]=useState(0);
  const [startDate,setstartDate]=useState(moment().add(weeknum, 'weeks').startOf('week'));
  const [endDate,setendDate]=useState(moment().add(weeknum, 'weeks').endOf('week'));
  const [tcheck,settcheck]=useState(true);
  
 
  let earn=0.00;                  //sara kch mila kr ktna kamaya deliver it ka tax cut kr or jo be cut ho ra   or jo extra kamaya wo be

  let totalcompletetrip=0.00     //in a week
  let totalearn=0.00            //20 person deliverit ka nikla kr
  let finaltotalearn=0.00      //total kamaya ktna cash me without cuts tax
  let companyearn=0.00
  let cutPercent=20        
  
  let cancelTrips=0.00;
  let totalCancelEarn=0.00;
  let totalCancelCut=0.00;

  let fulltripDetail=[];

  let  paidearn=90
  let  cutearn=50

  let acceptanceRate="---"
  let completionRate="---"
  let captainRating="---"

  let time=0;  //avaialabe hourse base on week cycle

  useEffect(() => {
    setstartDate(moment().add(weeknum, 'weeks').startOf('week'));
    setendDate(moment().add(weeknum, 'weeks').endOf('week'));
  }, [weeknum])

  const renderTitle=()=>{
return(
  <View style={{width:"100%",marginTop:20}}>
     <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:26,fontFamily:theme.fonts.fontMedium,color:"black"}}> 
          Captain Portal
  </theme.Text>
  <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:16,color:"gray",width:"95%",lineHeight:20,marginTop:-8}}> 
           {user.name}
  </theme.Text>
  </View>
)
  }

  
  const renderCycle=()=>{
 
   let c=  moment(endDate.format('YYYY-MM-DD')).isSameOrAfter(new Date(), 'day'); //check curent date is greater than last wekk end date or not
    
    
    return(
      <View style={{width:"100%",marginTop:20,backgroundColor:"white",flexDirection:"row",alignItems:"center",justifyContent:"space-between",paddingHorizontal:5,borderRadius:5,borderColor:"silver",borderWidth:0.5}}>


    <TouchableOpacity onPress={()=>setweeknum(weeknum-1)}>
      <utils.vectorIcon.Ionicons name="chevron-back-outline" color={theme.color.buttonLinerGC1} size={25}/>
    </TouchableOpacity>

    <theme.Text  style={{fontSize:14,color:"gray"}}> 
          {startDate.format('DD MMM YYYY ')}-{endDate.format(' DD MMM YYYY')} 
    </theme.Text>

{c&&(
  <View style={{width:5,height:5}}/>
)}

{!c&&(
   <TouchableOpacity  onPress={()=>setweeknum(weeknum+1)}>
      <utils.vectorIcon.Ionicons name="chevron-forward" color={theme.color.buttonLinerGC1} size={25}/>
    </TouchableOpacity>
)}
   

      </View>
    )
      }

const renderGeneralDetail=()=>{
  
return(
  <View style={{width:"100%",flexDirection:"row",alignItems:"center",justifyContent:"space-between",flexShrink:1,flexWrap:"wrap",paddingVertical:10}}>

  <TouchableOpacity style={{width:w,backgroundColor:bckc,borderColor:bc,borderWidth:bw,height:h,borderRadius:br,alignItems:"center",justifyContent:"center",padding:5}}>
     <utils.vectorIcon.Fontisto name="clock" size={24} color={theme.color.buttonLinerGC1} />
     <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:13,color:"gray",width:"95%",fontFamily:theme.fonts.fontMedium,lineHeight:20,alignSelf:"center",textAlign:"center",marginTop:5,textTransform:"uppercase"}}> 
      Available Hours
    </theme.Text>
    <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:12,color:"black",width:"95%",fontFamily:theme.fonts.fontMedium,lineHeight:20,alignSelf:"center",textAlign:"center",marginTop:5,textTransform:"uppercase"}}> 
     {time==0 ?"0 sec":secondsToHms(time)}
    </theme.Text>
  </TouchableOpacity>

  <TouchableOpacity style={{width:w,backgroundColor:bckc,borderColor:bc,borderWidth:bw,height:h,borderRadius:br,alignItems:"center",justifyContent:"center",padding:5}}>
     <utils.vectorIcon.Ionicons name="star" size={24} color={theme.color.buttonLinerGC1} />
     <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:13,color:"gray",width:"95%",fontFamily:theme.fonts.fontMedium,lineHeight:20,alignSelf:"center",textAlign:"center",marginTop:5,textTransform:"uppercase"}}> 
      Captain rating
    </theme.Text>
    <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:12,color:"black",width:"95%",fontFamily:theme.fonts.fontMedium,lineHeight:20,alignSelf:"center",textAlign:"center",marginTop:5,textTransform:"uppercase"}}> 
     {captainRating}
    </theme.Text>
  </TouchableOpacity>

  
   <TouchableOpacity style={{width:w,backgroundColor:bckc,borderColor:bc,borderWidth:bw,height:h,borderRadius:br,alignItems:"center",justifyContent:"center",padding:5,marginTop:20}}>
     <utils.vectorIcon.Ionicons name="checkmark-done-sharp" size={24} color={theme.color.buttonLinerGC1} />
     <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:13,color:"gray",width:"95%",fontFamily:theme.fonts.fontMedium,lineHeight:20,alignSelf:"center",textAlign:"center",marginTop:5,textTransform:"uppercase"}}> 
      completion rate
    </theme.Text>
    <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:12,color:"black",width:"95%",fontFamily:theme.fonts.fontMedium,lineHeight:20,alignSelf:"center",textAlign:"center",marginTop:5,textTransform:"uppercase"}}> 
     {completionRate} %
    </theme.Text>
  </TouchableOpacity>
   

<TouchableOpacity style={{width:w,backgroundColor:bckc,borderColor:bc,borderWidth:bw,height:h,borderRadius:br,alignItems:"center",justifyContent:"center",padding:5,marginTop:20}}>
     <utils.vectorIcon.Ionicons name="checkmark-circle" size={24} color={theme.color.buttonLinerGC1} />
     <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:13,color:"gray",width:"95%",fontFamily:theme.fonts.fontMedium,lineHeight:20,alignSelf:"center",textAlign:"center",marginTop:5,textTransform:"uppercase"}}> 
      Acceptance rate
    </theme.Text>
    <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:12,color:"black",width:"95%",fontFamily:theme.fonts.fontMedium,lineHeight:20,alignSelf:"center",textAlign:"center",marginTop:5,textTransform:"uppercase"}}> 
     {acceptanceRate} %
    </theme.Text>
  </TouchableOpacity>
    
 
  
    </View>
)
}

function secondsToHms(d) {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor(d % 3600 / 60);
  var s = Math.floor(d % 3600 % 60);

  var hDisplay = h > 0 ? h + (h == 1 ? " h, " : " h, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " m, " : " m, ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " s" : " s") : "";
  return hDisplay + mDisplay + sDisplay; 
}

const renderLine=()=>{
  return(
<View style={{width:"95%",backgroundColor:"silver",height:0.5,alignSelf:"center"}} />
  )
}

 const rendertripPayDetail=()=>{
 
  let fontSize=14.5
  let textcolor1= parseFloat(totalearn)>=0 ? "black":"red"
  let textcolor2= parseFloat(totalCancelEarn)>=0 ? "black":"red"

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
     PKR {parseFloat(totalearn).toFixed(2)}
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
     PKR {parseFloat(totalCancelEarn).toFixed(2)}
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
</TouchableOpacity>

  </View>
)
 }

 const renderShowTrips=()=>{
   //siraf wo detail show hn gi jo end trip wali hn gi yani collectcash ya end ride true
   let fontSize=12
   let textcolor2= "red"

   const  t= fulltripDetail.map((e,i,a)=>{

    let textcolor1=  (e.status!="cancel" || e.cancelStatus=="unPaid")?"black":e.cancelStatus=="unPaidcut"?"red":"green" 

    var  t =  moment(e.createdAt).format('hh:mm a')  
    var date =  moment(e.createdAt).format("ddd D MMM");   //9 july 2021
    let createdAt= date+", "+t
    let tid=e.id   //trip id
    let tcc=parseFloat(e.rs).toFixed(2) //total amount in trip
    let myearn= 
    e.status!="cancel" ?parseFloat(tcc - ((cutPercent/100)*(tcc))).toFixed(2)
    :e.cancelStatus=="unPaidcut"?"- "+parseFloat(cutearn).toFixed(2)
    :e.cancelStatus=="Paid"?"+ "+parseFloat(paidearn).toFixed(2)
    :"0.00"

    let T=e.status=="cancel"?"Trip Cancel":e.status=="reject"?"Trip Reject":e.status=="skip"?"Trip Skip":"Trip"

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
    <theme.Text numberOfLines={1} ellipsizeMode="tail"  style={{fontSize:fontSize,color:"gray" ,lineHeight:15 }}> 
      {T} {tid}
    </theme.Text>
    </View>
    <theme.Text numberOfLines={1} ellipsizeMode="tail"  style={{fontSize:fontSize,color:textcolor1,width:"40%" ,lineHeight:20,textAlign:"right",textTransform:"uppercase"}}> 
    {(e.status=="reject" || e.status=="skip") ?"0.00" : myearn}
    </theme.Text>
    </View>
    {e.normalPay==true&&(
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
    )}

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

{fulltripDetail.length>0 ? (
renderShowTrips()
):(
  <View style={{alignItems:"center",justifyContent:"center",paddingVertical:15}}>
  <theme.Text   style={{fontSize:14,color:"black"}}> 
  Empty
</theme.Text>
</View>
)}
    


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

 if(trip.length>0){

  let totaltrips=0;
  let totalacepttrips=0;
  let totalaccept=0;
 
   
  totalcompletetrip=0.00     //in a week
  totalearn=0.00            //20 person deliverit ka nikla kr
  companyearn=0.00
  cutPercent=20 
 
 cancelTrips=0.00;
 totalCancelEarn=0.00;
 totalCancelCut=0.00;

 acceptanceRate=0  
 completionRate=0     
 captainRating=parseFloat(0).toFixed(2)

   trip.map((e,i,a)=>{

   
     if(e.captainid==user.id && e.captaincarid==user.selectedCar)
     {
        
let c= false;
if(dateCheck(startDate.format('DD/MM/YYYY'),endDate.format('DD/MM/YYYY'),moment(e.createdAt).format("DD/MM/YYYY")))
    c=true; //yes exist
else
    c=false;

    //yani curent date us hafte k dates k between or same me ati
if(c==true){

  totaltrips=a.length
  
  //if ride acept and coolect cash add
  if(e.endride==true){
    totalcompletetrip=totalcompletetrip+1
    totalearn=parseFloat(totalearn)+parseFloat(e.rs)
   
   }

   if((e.status=="cancel" && e.cancelby=="captain")|| e.endride==true || (e.status=="skip" && e.cancelby=="captain" )|| (e.status=="reject" && e.cancelby=="captain")){
    fulltripDetail.push(e)
   }

   if(e.accept==true){
    totalacepttrips= totalacepttrips+1
    totalaccept=totalaccept+1;
    if(e.status=="cancel"){
    cancelTrips=cancelTrips+1

    if(e.cancelby="captain"){

      if(e.cancelStatus=="unPaid"){
//  captain cancel trip within 2 min so no masla
      }

      if(e.cancelStatus=="unPaidcut"){
 //captain cancel trip after 2 min so cut your pay 50 rs
         totalCancelCut= parseFloat(totalCancelCut)+cutearn
      }

      if(e.cancelStatus=="Paid"){
  //captain cancel job after 20  sec so compny pay 90 rs
       totalCancelEarn=parseFloat(totalCancelEarn)+paidearn
          }

    }

    if(e.cancelby=="user"){

      if(e.cancelStatus=="unPaid"){
//user cancel trip within 2 min so no masla
      }

      if(e.cancelStatus=="unPaidcut"){
 //user cancel trip after 2 min so compny   pay 50 rs for captan and cut 50 rs for user
        totalCancelEarn=parseFloat(totalCancelEarn)+cutearn
      }

      if(e.cancelStatus=="Paid"){
  //user cancel job after arrive driver   so compny   pay 90 rs for captan and cut 90 rs for user
       totalCancelEarn=parseFloat(totalCancelEarn)+paidearn
      }

    }

    }

   
  }
 
}
       

     }
   })

    

   if(totaltrips>0){
     let t= 100/totaltrips
     
     let af= parseFloat(totalaccept*t).toFixed(2)
      acceptanceRate=af
 
   }

   if(totalacepttrips>0){
    let t= 100/totalacepttrips
   
     let at= parseFloat(totalcompletetrip*t).toFixed(2)
     completionRate=at
 
  }
 
   if(totalearn>0){
     finaltotalearn=totalearn;       //full earn without cut any tax
     companyearn= (cutPercent/100)*(totalearn)
     totalearn = parseFloat(totalearn-companyearn).toFixed(2)  //cut tex with finaltotal earn
 
   }
 
   

    totalCancelEarn=totalCancelEarn-totalCancelCut
   
   earn= (parseFloat(totalearn)+parseFloat(totalCancelEarn)).toFixed(2) 
 }


 if(user.onlineTime.length>0){
  time=0;
  let seconds =0;
  let check =false;
 

  user.onlineTime.map((e,i,a)=>{
    
   
   let c= false;

   
   if(dateCheck(startDate.format('DD/MM/YYYY'),endDate.format('DD/MM/YYYY'),moment(e.sd).format("DD/MM/YYYY")))
       c=true; //yes exist
   else
       c=false  



       if(c){
              
          if(e.online==false){
             seconds=seconds+e.seconds
          
            }

         if(e.online==true){
           check=true;
          let ddd=e.sd;
          var st =  moment(ddd).format('hh:mm:ss a')  

          let cdate=new Date();
          var ct =  moment(cdate).format('hh:mm:ss a')


      var sst = moment(st, "hh:mm:ss a");
      var cct = moment(ct, "hh:mm:ss a");
      var duration = moment.duration(cct.diff(sst));
      var sec = seconds +  parseInt(duration.asSeconds());
      
      

         time=sec
               
            }

       }

     

})


if(check==false){
 time=seconds
}
 

 }

 
  return(
 <SafeAreaView style={styles.container}>
 <utils.DrawerHeader p={props} title="" /> 
 <ScrollView showsVerticalScrollIndicator={false}>
 {renderTitle()}
 {renderCycle()}
 {renderGeneralDetail()}
 {rendertripPayDetail()}
 {rendertripDetail()}
 </ScrollView>
 </SafeAreaView>
)
    
  }