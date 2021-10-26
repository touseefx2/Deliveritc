import React ,{useEffect,useRef,useState} from 'react';
import {Image,SafeAreaView,View,Text,ScrollView,TouchableOpacity,Keyboard,BackHandler} from 'react-native';
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
import { Searchbar } from 'react-native-paper'; 
import Dialog, { DialogContent,DialogFooter,DialogButton,SlideAnimation,DialogTitle} from 'react-native-popup-dialog';

// let sdt="Disputed trips"
let sta="From old to new"
let std="From new to old"


let bc="silver"
let br=5
let bw=0.5

export default inject("store")(observer(Trips));
 
 function Trips(props)   {

  const { user,setuser,setcl,cl,isl,setisl,setrequest,request,trip,settrip,cars} = props.store;
  const [loader,setloader]=useState(false);
  const [search,setSearch]=useState("");
 
  const [sort,setsort]=useState(false);

  const [ds,setds]=useState("From old to new");  //select sort

  let cutPercent=20        
  let  paidearn=90
  let  cutearn=50


  function handleBackButtonClickk() {
    setsort(false)   
    return true;
   }

   useEffect(() => {
    if(sort==true){
       BackHandler.addEventListener('hardwareBackPressS', handleBackButtonClickk);
    }
    if(!sort){
      BackHandler.removeEventListener('hardwareBackPressS', handleBackButtonClickk);
    }
    
    return () => {  
     BackHandler.removeEventListener('hardwareBackPressS', handleBackButtonClickk);
    };
  }, [sort]);
 
  const Sep=()=>{
    return  <View style={{height:10}} />
  }

  const renderLine=()=>{
    return(
  <View style={{width:"95%",backgroundColor:"silver",height:0.5,alignSelf:"center"}} />
    )
  }

  const renderSeachBar=()=>{
    return(
      <View style={{padding:10}}>

      <View style={{flexDirection:"row",height:40,alignItems:"center",backgroundColor:"white",justifyContent:"space-between" }}>
    
      <Searchbar
      placeholder="Search by booking id"
      onChangeText={(t)=>{setSearch(t)}}
      value={search}
      keyboardType="number-pad"
      style={styles.searchbar}
      inputStyle={{color:"black"}}
      placeholderTextColor={"silver"}
      iconColor={theme.color.buttonLinerGC1}
    />
  
  
   <TouchableOpacity style={{ height:45,width:"14%",alignItems:"center",justifyContent:"center" }} onPress={()=>{ setsort(true);Keyboard.dismiss()}}>
   <utils.vectorIcon.MaterialCommunityIcons name="sort" color={theme.color.buttonLinerGC1} style={{opacity:0.7}}   size={26} />
   </TouchableOpacity>
    </View> 
    </View>
    )
  }

  const Sortdialog=()=>{
    let titlefz=20
    let optionfz=16
    let optioncolor="black"

return(
    <Dialog
      visible={sort}
      dialogStyle={{width:wp("90%"),backgroundColor:"white",alignSelf:"center"}}
      containerStyle={{justifyContent:"flex-end"}}
      hasOverlay={true}
      onTouchOutside={()=>{setsort(false)}}
      overlayOpacity={0.7}
      //  onHardwareBackPress={()=>false}
      dialogAnimation={new SlideAnimation({
        slideFrom: 'bottom',
        initialValue: 0, // optional
        animationDuration:50, // optional
        useNativeDriver: true // Add This line
      })}
    >
<DialogContent style={{padding:15,paddingBottom:Platform.OS=="ios"?40:10}} >

<theme.Text style={{fontFamily:theme.fonts.fontMedium,color:theme.color.buttonLinerGC1,fontSize:titlefz,alignSelf:"center"}}>Sort</theme.Text>

{/* <TouchableOpacity 
onPress={()=>{setds(sdt);setsort(false)}}
style={{marginTop:30,flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
<theme.Text style={{color:ds==sdt?theme.color.buttonLinerGC1:optioncolor,fontSize:optionfz,alignSelf:"center"}}>{sdt}</theme.Text>
{ds==sdt&&(
  <utils.vectorIcon.AntDesign name="check" color={theme.color.buttonLinerGC1} size={titlefz}/>
)}
  </TouchableOpacity>   */}

   
 <TouchableOpacity 
 onPress={()=>{setds(sta);setsort(false)}}
 style={{marginTop:30,flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>

 <theme.Text style={{color:ds==sta?theme.color.buttonLinerGC1:optioncolor,fontSize:optionfz,alignSelf:"center"}}>{sta}</theme.Text>
{ds==sta&&(
 <utils.vectorIcon.AntDesign name="check"  color={theme.color.buttonLinerGC1} size={titlefz}/>
)}
</TouchableOpacity>


<TouchableOpacity 
 onPress={()=>{setds(std);setsort(false)}}
 style={{marginTop:30,flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>

 <theme.Text style={{color:ds==std?theme.color.buttonLinerGC1:optioncolor,fontSize:optionfz,alignSelf:"center"}}>{std}</theme.Text>
{ds==std&&(
 <utils.vectorIcon.AntDesign name="check"  color={theme.color.buttonLinerGC1} size={titlefz}/>
)}
</TouchableOpacity>
 


       </DialogContent>
    </Dialog>
    )
  }

  const renderShowTrips=(trip)=>{
   
    if(ds==sta){
      trip.sort((a, b) => {
         var timeA = a.createdAt;
         var timeB = b.createdAt;             
         return (moment(timeA)).diff(moment(timeB)) 
      });
   }

   if(ds==std){
    trip.sort((a, b) => {
       var timeA = b.createdAt;
       var timeB = a.createdAt;             
       return (moment(timeA)).diff(moment(timeB)) 
    });
 }

    const  t= trip.map((e,i,a)=>{
 
      if(search=="")
       {
         return showTrip(e,i,a)
        }
        else{
          let Search=  search.toLowerCase()
          let id= JSON.stringify(e.id).toLowerCase()
          let searchLength = Search.length; 
         
          let s=   id.substr(0, searchLength);
         
        
          if(s==Search){
            return showTrip(e,i,a)
          } 
  
        }
       
      })
   
        if(t.length<=0 && t[0]==undefined){
          const style={marginTop:20,alignSelf:"center"}
          return  utils.message.ShowEmptyRecords("No record found.",style)
        }else{
          return t
        }
  }

  const showTrip=(e,i,a)=>{
    let fontSize=12
    let textcolor2= "red"
 
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
  }

  const rendertripDetail=(t)=>{
 
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
     {renderShowTrips(t)}
    </View>
  )
   }

  let tripS=[]
  if(trip.length>0){
     tripS=[]

     trip.map((e,i,a)=>{
       if(e.captainid==user.id && e.captaincarid==user.selectedCar)
       {
        if((e.status=="cancel" && e.cancelby=="captain")|| e.endride==true || (e.status=="skip" && e.cancelby=="captain" )|| (e.status=="reject" && e.cancelby=="captain")){
          tripS.push(e)
         }
         
       } 
   })
  }
  
 
  return(
 < View style={styles.container}>
 <utils.StackHeader p={props} title="Trips" /> 

 {tripS.length>0&&(
   <View>
 {renderSeachBar()}
 {Sortdialog()}
 <ScrollView>
 <View style={{padding:10,marginTop:30}}> 
 {rendertripDetail(tripS)}
 </View>
 </ScrollView>
   </View>
 )}

{tripS.length<=0&&(
  <theme.Text style={{fontSize:25,color:"silver",marginTop:hp("40%"),alignSelf:"center",position:"absolute"}} >Empty</theme.Text>
 )}

 </ View>
)
    
  }