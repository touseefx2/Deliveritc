import React ,{useEffect,useRef,useState} from 'react';
import {SafeAreaView,View,Text,ScrollView,ActivityIndicator,TouchableOpacity,Alert,Keyboard} from 'react-native';
import utils from "../../../utils/index"
import LinearGradient from 'react-native-linear-gradient';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { inject, observer } from "mobx-react"; 
import theme  from "../../../themes/index";
import styles from "./styles"
import moment from 'moment';
import Modal from 'react-native-modal';
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFetchBlob from 'rn-fetch-blob'
import db from "../../../database/index" 

 
  let cutPercent=20  

  const audioRecorderPlayer =   new AudioRecorderPlayer();
  function ieo(obj){
    //check object is empty or not
    return JSON.stringify(obj) === '{}';
  }
   

  export default inject("userStore","generalStore","carStore","tripStore")(observer(TripDetail));

 function TripDetail(props)   {
  //  const {  trip,changetrip} = props.store;

  let trip=[]

  const {e} =props.route.params;  //trip


  const {user,authToken,setUser,setcl,cl,Logout,setonline} = props.userStore;
  const {cars,setCars} =  props.carStore;
  const {setrequest,accept,request,getReqById,setatime,setaccept,getreqloader,setgetreqloader,gro,setgro,endride} = props.tripStore;
  const {setLocation,isLocation,isInternet} = props.generalStore;



  const [dispute,setdispute]=useState("null")
  const [getdispOnce,setgetdispOnce]=useState(false);
  
  const [trnsctn,settrnsctn]=useState(false)
 

  const [isserverErr,setisserverErr]=useState(false);
  const [refresh,setrefresh]=useState(false);
  const [l,setl]=useState(false);

  const [loader,setloader]=useState(false);
  const [dispmodal,setdispmodal]=useState(false);

  const [ad,setad]=useState(false);  //arow down

  const [ada,setada]=useState(false);  //arow down audio


  const [sm,setsm]=useState("Total distance is incorrect");  //select msg
 
  const [s,sets]=useState("");
 
  const [isrs,setisrs]=useState(false);  //is record is start

  
  let message1="Total distance is incorrect"
  let message2="I will explain it with text/voice recording"


  const [audio,setaudio]=useState("");  //select msg
  const [paudio,setpaudio]=useState("");  //select msg   //play/pause audio

  const [comment,setcomment]=useState("");  //select msg


 
 useEffect(() => {
  
  if(paudio==""){
    audioRecorderPlayer.removePlayBackListener()
  }
   
 }, [paudio])

 useEffect(() => {
  if(refresh){
     setl(false);setgetdispOnce(false);setisserverErr(false);
     setdispute("null");settrnsctn(false)
     setrefresh(false);
  }
 }, [refresh])
  
   useEffect(() => {
      
       if(isInternet&&!refresh){
        if(!getdispOnce){
          getDispute()
          }
      }
    
   }, [isInternet,refresh,getdispOnce])
  
 const clearaudio=()=>{
   setaudio("");
   setpaudio("");
   sets("");
   audioRecorderPlayer.stopRecorder();
   audioRecorderPlayer.stopPlayer();
   audioRecorderPlayer.removePlayBackListener();
 }

const clearall=()=>{
  stopAudio()
  clearaudio();
  setsm(message1)
  setcomment("")
  setad(false)
  setada(false)
  sets("");
  setdispmodal(!dispmodal);

}

const onLogout=()=>{
  setCars(false) 
  Logout();
 }

 const onFileUpload=(method,bodyData,header)=>{
 
  setl(true)
  db.api.apiCall(method,db.link.uploadFile,bodyData,header)
  .then((response) => {
    setl(false);
    console.log("uploadFile response : " , response);
  
  if(response){
   addDispute(response)
   return;
   }else{   
    utils.AlertMessage("","Error upload file")
     return;
   }
 
}).catch((e) => {
setl(false);
// utils.AlertMessage("","Network request failed");
console.error("uploadFile  catch error : ", e)
return;
})

}

const addDispute=(file)=>{
   setl(true)
  
  const bodyData={
     trip:e._id,
     message:sm==message1?sm:comment,
     sender:user.user_role,
     audio:sm==message2?file:""
    
}
  const header=authToken;
 
  // method, path, body, header
  db.api.apiCall("post",db.link.addTripDispute,bodyData,header)
  .then((response) => {
       setl(false);
       
         console.log("addTripDispute response : " , response);
    
         if(response.msg=="Invalid Token"){
           utils.AlertMessage("",response.msg) ;
           onLogout()
          return;
         }

         if(!response.success){
          utils.AlertMessage("",response.message) ;
           return;
         }
  

         if(response.success){
          setdispute(response.data);
          utils.ToastAndroid.ToastAndroid_SB("Submit Success !")
          clearall();
           return;
         }

       return;
   
  }).catch((e) => {
      setl(false);
     console.error("addTripDispute catch error : ", e)
    return;
  })
}

const getDispute=()=>{
       
  setl(true);
  setisserverErr(false);
  setgetdispOnce(false);

  const bodyData=false
  const header=authToken;
  const tid=e._id
 
  // method, path, body, header
  db.api.apiCall("get",db.link.getTripDispute+tid,bodyData,header)
  .then((response) => {
       setl(false);
       setisserverErr(false);

       console.log("getTripDispute response : " , response);
    
         if(response.msg=="Invalid Token"){
           utils.AlertMessage("",response.msg) ;
           onLogout()
          return;
         }

       if(!response.data){
        setgetdispOnce(false)
        setdispute("null");
        return;
       }
  
  
       if(response.data){  
        getTransaction()
        
        if(response.data.length>0)
        setdispute(response.data[0]);
        else
        setdispute(response.data);
       
        setgetdispOnce(true)
         return;
       }
    
     
       return;
   
  }).catch((e) => {
      setl(false);
      setisserverErr(true)
      setdispute("null")
      setgetdispOnce(false)
     console.error("getTripDispute catch error : ", e)
    return;
  })
}

const getTransaction=()=>{
 
  const bodyData=false
  const header=authToken;
  const tid=e._id
 
  db.api.apiCall("get",db.link.getTripTransctionHistory+tid,bodyData,header)
  .then((response) => {
      
       console.log("getTripTransctionHistory response : " , response);
        
       if(!response.data){
        settrnsctn(false)
       }

       if(response.message=="No records found"){
        settrnsctn(false)
         return;
      }
  
       if(response.data){  
        settrnsctn(response.data[0]);
         return;
       }
    
     
       return;
   
  }).catch((e) => {
     settrnsctn(false)
     console.error("getTripTransctionHistory catch error : ", e)
    return;
  })
}

  const Sep=()=>{
    return  <View style={{height:10}} />
  }

  const SepLine=()=>{
   return   <View style={{width:"100%",backgroundColor:"gray",height:0.5,alignSelf:"center",opacity:0.3}} />
  }
 
  const soundRecordStart= async ()=>{
    
     const dirs = RNFetchBlob.fs.dirs;
     let name=Math.floor(Math.random() * (200000 - 50000) + 50000)+"rec.mp3"
     let sound=`${dirs.CacheDir}`+name
     const path = Platform.select({
      ios: 'record.m4a',
      android:sound,
    });
 


    const result = await  audioRecorderPlayer.startRecorder(path);
    sets(result)
    setisrs(true)
    // console.log("start rec : ",result);

  }

  const soundRecordStop=async ()=>{
    
      const result = await  audioRecorderPlayer.stopRecorder();
      if(result!=="Already stopped"){setaudio(result);}
      setpaudio("")
      setisrs(false)
      // console.log("stop rec : ",result);
  }

  const PlayAud=async (p)=>{
    let msg;
    if(p!=""){
      msg = await  audioRecorderPlayer.startPlayer(p);
    }else{
      msg = await  audioRecorderPlayer.startPlayer(s);
    }
   
    audioRecorderPlayer.addPlayBackListener((e) => {
      
     if(e.currentPosition>=e.duration){
      setpaudio("") 
     }
      return;
    });
    setpaudio("play") 
    // console.log("play  : ",msg);
  }

  const playAudio= async(p)=>{
  
  if(dispute.length<=0 ){
    PlayAud(p)
  }else{
if(isInternet){
  PlayAud(p)
}else{
  utils.AlertMessage("","Please connect internet !")
}
  }
  

  }

  const pauseAudio=async()=>{
    const msg = await  audioRecorderPlayer.pausePlayer()
    setpaudio("pause") 
    // console.log("pause : ",msg);
  }

  const stopAudio=async()=>{
    const msg = await  audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener()
    setpaudio("") 
    // console.log("stop : ",msg);
  }

  const YesClickSubmit=()=>{
 
    if(isInternet){

      if(sm==message1){
      addDispute("");
      return;
      }
    
      if(sm==message2){
       if(audio=="" && comment==""){
         utils.AlertMessage("","Please enter comment or record audio");
         return;
       } 

       if(audio!=""){
       
        const bodyData = new FormData();
        const newFile = {
           uri:audio,
           type:"audio/mp3",
           name:"rec.mp3",
        }
        bodyData.append('files', newFile)
        const header="upload" 

         onFileUpload("post",bodyData,header)
         
         return;
       }

       addDispute("");

       }

    }else{
      utils.AlertMessage("","Please connect internet !")
    }
   
  
  }

const SubmitClick=()=>{
  Keyboard.dismiss()
  Alert.alert(
    "Confirmation",
    "Are you sure you want to submit comment ?",
    [
      {
        text: "No",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      },
      { text: "Yes", onPress: () =>  {YesClickSubmit()} }
    ]
  );

 
 
}

const renderButton=()=>{
   let msg=dispute.length<=0?"Dispute":"View Dispute"
  return(
    <TouchableOpacity onPress={()=>{setdispmodal(!dispmodal)}} style={styles.BottomButton}>
    <LinearGradient colors={[theme.color.buttonLinerGC1,theme.color.buttonLinerGC2]} style={styles.LinearGradient}>
            <View style={styles.ButtonRight}>
             {loader==false&&(<Text style={styles.buttonText}>{msg}</Text>)}
             {loader&&(<ActivityIndicator size={25} color={"white"} />)}
             </View>
     </LinearGradient>
     </TouchableOpacity>
  )
}

const renderButtonDispute=()=>{
  return(
    <TouchableOpacity 
    onPress={()=>{SubmitClick()}} style={styles.BottomButton}>
    <LinearGradient colors={[theme.color.buttonLinerGC1,theme.color.buttonLinerGC2]} style={styles.LinearGradient}>
            <View style={styles.ButtonRight}>
             <Text style={styles.buttonText}>Submit</Text> 
             </View>
     </LinearGradient>
     </TouchableOpacity>
  )
}

function secondsToHms(d) {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor(d % 3600 / 60);
  var s = Math.floor(d % 3600 % 60);

  var hDisplay = h > 0 ? h + (h == 1 ? " h, " : " h, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " min, " : " min, ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " sec" : " sec") : "";
  return hDisplay + mDisplay + sDisplay; 
}

const renderdetail=()=>{
    
    let fs=14
    var  t =  moment(e.createdAt).format('hh:mm a')  
    var date =  moment(e.createdAt).format("ddd D MMM");   //9 july 2021
    let createdAt= date+", "+t

    let pymntm=e.payment_mode
 
  //  let waitingTime=   e.waiting_time

   let cancelmsg=e.cancellation_reason
 
 
   let amount= 0;

   let status=e.status[e.status.length-1].status

   let cc=0;  //colect cash

   if(pymntm=="cash"&& status=="ended" && trnsctn){
    if(trnsctn.debit==0 && trnsctn.credit==0){
      cc=e.rent;
    }
    if(trnsctn.debit>0){
      cc=e.rent+trnsctn.debit;
 
    }
    if(trnsctn.credit>0){
      cc=e.rent-trnsctn.credit;
    }
   }

   if(status=="ended"){amount=e.rent}
   if(status=="cancelled"){amount=e.amt_paid}
 
 
  let startridetime=""
  let endridetime=""
 
   if(status=="ended"){

   
    var  t =  moment(e.start_time).format('hh:mm a')  
    var date =  moment(e.start_time).format("ddd D MMM");   //9 july 2021
    startridetime= t

    var  tt=  moment(e.end_time).format('hh:mm a')  
    var date =  moment(e.end_time).format("ddd D MMM");   //9 july 2021
    endridetime=  tt
 
   }
  
return(
<View style={{marginTop:40}}>
 
<View style={{flexDirection:"row",alignItems:"center",width:"100%",alignSelf:"center",justifyContent:"space-between"}}>
 <theme.Text numberOfLines={2} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20,width:"40%"}}>Trip ID</theme.Text>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"50%"}}>{e.t_id}</theme.Text>
 </View>

 {Sep()}
 {SepLine()}
 {Sep()}

 <View style={{flexDirection:"row",alignItems:"center",width:"100%",alignSelf:"center",justifyContent:"space-between"}}>
 <theme.Text numberOfLines={2} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20,width:"40%"}}>Date, Time</theme.Text>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"50%"}}>{createdAt}</theme.Text>
 </View>



{(status=="ended") &&(
  <View>

 {Sep()}
 {SepLine()}
 {Sep()}

 <View style={{flexDirection:"row",alignItems:"center",width:"100%",alignSelf:"center",justifyContent:"space-between"}}>
 <theme.Text numberOfLines={2} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20,width:"30%"}}>Pickup location</theme.Text>
 <theme.Text numberOfLines={5} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"60%"}}>{e.pickup.name}</theme.Text>
 </View>

 {Sep()}
 {SepLine()}
 {Sep()}

 <View style={{flexDirection:"row",alignItems:"center",width:"100%",alignSelf:"center",justifyContent:"space-between"}}>
 <theme.Text numberOfLines={2} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20,width:"30%"}}>Dropoff location</theme.Text>
 <theme.Text numberOfLines={5} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"60%"}}>{e.dropoff.name}</theme.Text>
 </View>
 
 {Sep()}
 {SepLine()}
 {Sep()}

 <View style={{flexDirection:"row",alignItems:"center",width:"100%",alignSelf:"center",justifyContent:"space-between"}}>
 <theme.Text numberOfLines={2} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20,width:"40%"}}>Start ride</theme.Text>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"50%"}}>{startridetime}</theme.Text>
 </View>

 {Sep()}
 {SepLine()}
 {Sep()}

 <View style={{flexDirection:"row",alignItems:"center",width:"100%",alignSelf:"center",justifyContent:"space-between"}}>
 <theme.Text numberOfLines={2} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20,width:"40%"}}>End ride</theme.Text>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"50%"}}>{endridetime}</theme.Text>
 </View>

 {Sep()}
 {SepLine()}
 {Sep()}

 <View style={{flexDirection:"row",alignItems:"center",width:"100%",alignSelf:"center",justifyContent:"space-between"}}>
 <theme.Text numberOfLines={2} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20,width:"40%"}}>Total distance</theme.Text>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"50%"}}>{e.distance.toFixed(2)} km</theme.Text>
 </View>

  
 {Sep()}
 {SepLine()}
 {Sep()}

 <View style={{flexDirection:"row",alignItems:"center",width:"100%",alignSelf:"center",justifyContent:"space-between"}}>
 <theme.Text numberOfLines={2} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20,width:"40%"}}>Payment mode</theme.Text>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"50%"}}>{pymntm}</theme.Text>
 </View>

 {Sep()}
 {SepLine()}
 {Sep()}

 <View style={{flexDirection:"row",alignItems:"center",width:"100%",alignSelf:"center",justifyContent:"space-between"}}>
 <theme.Text numberOfLines={2} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20,width:"40%"}}>Rent</theme.Text>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"50%"}}>PKR {amount.toFixed()}</theme.Text>
 </View>

 {pymntm=="cash"&&(
    <View>
  {Sep()}
  {SepLine()}
  {Sep()}
  
   <View style={{flexDirection:"row",alignItems:"center",width:"100%",alignSelf:"center",justifyContent:"space-between"}}>
   <theme.Text numberOfLines={2} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20,width:"40%"}}>Collect Cash</theme.Text>
   <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"50%"}}>PKR {cc.toFixed()}</theme.Text>
   </View>
  
   {trnsctn.debit>0&&(
     <View>
  {Sep()}
  {SepLine()}
  {Sep()}
   <View style={{flexDirection:"row",width:"100%",alignSelf:"center",justifyContent:"space-between"}}>
   <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20,width:"25%"}}>Remaining</theme.Text>
   <theme.Text numberOfLines={2} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"70%"}}>PKR {trnsctn.debit.toFixed()} has added to customer wallet</theme.Text>
   </View>
     </View>
   )}
  
  {trnsctn.credit>0&&(
     <View>
  {Sep()}
  {SepLine()}
  {Sep()}
   <View style={{flexDirection:"row",width:"100%",alignSelf:"center",justifyContent:"space-between"}}>
   <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20,width:"25%"}}>Remaining</theme.Text>
   <theme.Text numberOfLines={2} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"70%"}}>PKR {trnsctn.credit.toFixed()} has cut from customer wallet</theme.Text>
   </View>
     </View>
   )}
  
  
    </View>
  )}


 
  </View>
)}

  
{(status=="cancelled" ) &&(
  <View>
 {Sep()}
 {SepLine()}
 {Sep()}

 <View style={{flexDirection:"row",alignItems:"center",width:"100%",alignSelf:"center",justifyContent:"space-between"}}>
 <theme.Text numberOfLines={2} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20,width:"40%"}}>Status</theme.Text>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"50%",textTransform:"capitalize"}}>{status}</theme.Text>
 </View>

 {Sep()}
 {SepLine()}
 {Sep()}

 <View style={{flexDirection:"row",alignItems:"center",width:"100%",alignSelf:"center",justifyContent:"space-between"}}>
 <theme.Text numberOfLines={2} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20,width:"40%"}}>Cancel By</theme.Text>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"50%",textTransform:"capitalize"}}>{e.cancelled_by}</theme.Text>
 </View>

 {Sep()}
 {SepLine()}
 {Sep()}
 
  <View>
 <View style={{flexDirection:"row",alignItems:"center",width:"100%",alignSelf:"center",justifyContent:"space-between"}}>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20,width:"20%"}}>Reason</theme.Text>
 <theme.Text numberOfLines={2} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"60%"}}>{cancelmsg}</theme.Text>
 </View>
{Sep()}
{SepLine()}
{Sep()}
  </View>
 
  
 
 <View style={{flexDirection:"row",alignItems:"center",width:"100%",alignSelf:"center",justifyContent:"space-between"}}>
 <theme.Text numberOfLines={2} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20,width:"40%"}}>Cancellation Fee</theme.Text>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"50%"}}>PKR {amount}</theme.Text>
 </View>

 
  </View>

)}



 {Sep()}
 {Sep()}

</View>
)
}

const renderRecorder=()=>{
  return(
      <View style={{marginTop:15,borderColor:"silver",borderWidth:0.5,borderRadius:5,padding:10,alignItems:"center",justifyContent:"center"}}>

{audio==""&&(
<View style={{alignItems:"center",justifyContent:"center"}}>
<theme.Text  style={{fontSize:15,color:"black",textAlign:"center"}}>Tap and hold to record, {"\n"} or type your comment below</theme.Text>
<TouchableOpacity  
 onLongPress={()=>{soundRecordStart()}}
 onPressOut={()=>{soundRecordStop()}}
style={{marginVertical:20}}>
<utils.vectorIcon.Ionicons  name='mic-circle-sharp' size={65} color={!isrs?theme.color.buttonLinerGC1:"green"}/>
</TouchableOpacity>
</View>
)}

{audio!=""&&(

<View style={{flexDirection:"row",alignItems:"center",width:"70%",marginVertical:15,alignSelf:"center"}}>

<View style={{padding:5,backgroundColor:theme.color.buttonLinerGC1,flexDirection:"row",alignItems:"center",borderRadius:5,alignSelf:"center"}}>
  
  <View style={{width:"35%",flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>

{paudio==""&&(
<TouchableOpacity onPress={()=>{playAudio("")}}>
<utils.vectorIcon.Entypo  size={25} color="white"  name="controller-play" /> 
</TouchableOpacity>
)}


  {paudio=="play" &&
  <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
  <TouchableOpacity onPress={()=>  pauseAudio()}>
  <utils.vectorIcon.AntDesign    size={22} color="white"   name="pausecircle" />
  </TouchableOpacity>
  <TouchableOpacity onPress={()=>{stopAudio()}}>
<utils.vectorIcon.Entypo style={{marginLeft:7}}  size={25} color="red"   name="controller-stop" />
</TouchableOpacity>
  </View>}

  {paudio=="pause" &&
  <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
 <TouchableOpacity onPress={()=>{playAudio("")}}>
<utils.vectorIcon.Entypo  size={25} color="white"  name="controller-play" /> 
</TouchableOpacity>
  <TouchableOpacity onPress={()=>{stopAudio()}}>
<utils.vectorIcon.Entypo style={{marginLeft:7}}  size={25} color="red"   name="controller-stop" />
</TouchableOpacity>
  </View>}

  </View>

<View style={{width:"48%"}}>
<theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:13,color:"white",fontFamily:theme.fonts.fontMedium,lineHeight:20 }}>Record.mp3</theme.Text>
</View>
 
 </View>

 <TouchableOpacity
 onPress={()=>{clearaudio()}}
 style={{width:"15%",paddingLeft:10}}>
<utils.vectorIcon.Entypo name="cross" color="red" size={30} />
 </TouchableOpacity>

</View>


)}

 
<AutoGrowingTextInput 
    onChangeText={(text) => {setcomment(text)}}
    placeholder={"Comments"}
    placeholderTextColor='#C7C7CD'
    style={{backgroundColor:"white",width:"100%",padding:5,elevation:5,borderRadius:5}}
    minHeight={50}
    maxHeight={180}
    value={comment}
/>

      </View>

  )
}
 
const renderDiputeModal=()=>{
 
  if((dispute.length<=0 && dispute!="null")){
    return(
      <Modal 
      isVisible={dispmodal}
      style={{flex:1,width:wp("100%"),height:hp("100%"),margin: 0}}
      backdropOpacity={0.6}
      animationInTiming={600}
      animationOutTiming={600}
      onRequestClose={() => {setdispmodal(!dispmodal)}}
      backdropTransitionInTiming={300}
      backdropTransitionOutTiming={300}>
  
  
  <View style={{flex:1,backgroundColor:'white'}}>
  
  
  <View style={{ height:hp("6%"),flexDirection:"row",alignItems:"center",width:"100%",padding:5,borderRadius:5}}> 
  <TouchableOpacity style={{width:40,height:"100%"}}  onPress={()=>{setdispmodal(!dispmodal)}} >
  <utils.vectorIcon.Ionicons style={{opacity:0.8}}  name="arrow-back-outline" size={30} color="black"   /> 
  </TouchableOpacity>
  </View>  
  
   
  <ScrollView>
  <View style={{padding:10}}>
  
  <View style={{width:"100%",padding:10,alignItems:"center",flexDirection:"row",justifyContent:"space-between",backgroundColor:"white",borderRadius:5,elevation:3}}>
  <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:15,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20,width:"25%" }}>Trip</theme.Text>
   <theme.Text numberOfLines={2} ellipsizeMode="tail" style={{fontSize:15,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20,width:"72%" }}>{e.t_id}</theme.Text>
  </View>
  
  
  <TouchableOpacity
  onPress={()=>{setsm(message1)}}
  style={{width:"100%",padding:10,marginTop:40,alignItems:"center",flexDirection:"row",justifyContent:"space-between",backgroundColor:"white",borderRadius:5,elevation:3}}>
   <View style={{width:"10%"}}>
   <utils.vectorIcon.MaterialCommunityIcons name='circle-double' size={25} color={sm==message1?theme.color.buttonLinerGC1:"silver"}/>
   </View>
   <theme.Text numberOfLines={2} ellipsizeMode="tail" style={{fontSize:15,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20,width:"85%" }}>{message1}</theme.Text>
  </TouchableOpacity>
  
  <TouchableOpacity 
  onPress={()=>{setsm(message2)}}
  style={{width:"100%",padding:10,marginTop:15,alignItems:"center",flexDirection:"row",justifyContent:"space-between",backgroundColor:"white",borderRadius:5,elevation:3}}>
   <View style={{width:"10%"}}>
   <utils.vectorIcon.MaterialCommunityIcons name='circle-double' size={25} color={sm==message2?theme.color.buttonLinerGC1:"silver"} />
   </View>
   <theme.Text numberOfLines={2} ellipsizeMode="tail" style={{fontSize:15,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20,width:"85%" }}>{message2}</theme.Text>
  </TouchableOpacity>
  
  
  {sm==message2 && renderRecorder()}
  
  
  </View>
  </ScrollView> 
  <View style={{padding:10}}>
  {renderButtonDispute()}
  </View>
  
   
  </View>
  
    </Modal>
    )
  }
  else if(!ieo(dispute) && dispute!="null"){

    let cmnt=""
    let audio=""

    if(dispute.comments.length>0){
      dispute.comments.map((e,i,a)=>{
        if(e.sender==user.user_role){
         cmnt=e.message;
         audio=e.audio
         return;
        }
      })
    }

 
    return(
      <Modal 
      isVisible={dispmodal}
      style={{flex:1,width:wp("100%"),height:hp("100%"),margin: 0}}
      backdropOpacity={0.6}
      animationInTiming={600}
      animationOutTiming={300}
      onRequestClose={() => {clearall()}}
      backdropTransitionInTiming={600}
      backdropTransitionOutTiming={300}>
  
  
  <View style={{flex:1,backgroundColor:'white'}}>
   
  <View style={{ height:hp("6%"),flexDirection:"row",alignItems:"center",width:"100%",padding:5,borderRadius:5}}> 
  <TouchableOpacity style={{width:40,height:"100%"}}  onPress={()=>{setdispmodal(!dispmodal)}} >
  <utils.vectorIcon.Ionicons style={{opacity:0.8}}  name="arrow-back-outline" size={30} color="black"   /> 
  </TouchableOpacity>
  </View>  
   
  <ScrollView>
  <View style={{padding:10,alignItems:"center",justifyContent:"center"}}>
  
  <View style={{width:"100%",alignItems:"center",flexDirection:"row",justifyContent:"space-between",backgroundColor:"white",borderRadius:5,elevation:5,padding:5}}>
  <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:15,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20,width:"25%" }}>Trip ID</theme.Text>
   <theme.Text numberOfLines={2} ellipsizeMode="tail" style={{fontSize:15,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20,width:"72%" }}>{e.t_id}</theme.Text>
  </View>


  {/* {audio!=""&&(
<View style={{padding:5,backgroundColor:theme.color.buttonLinerGC1,flexDirection:"row", borderRadius:5,alignSelf:"center",width:"60%",flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginTop:30}}>
   
{paudio==""&&(
<TouchableOpacity style={{width:"38%" }} onPress={()=>{playAudio(audio)}}>
<utils.vectorIcon.Entypo  size={25} color="white"  name="controller-play" /> 
</TouchableOpacity>
)}


  {paudio=="play" &&
  <View style={{flexDirection:"row",alignItems:"center",width:"38%" }}>
  <TouchableOpacity onPress={()=>  pauseAudio()}>
  <utils.vectorIcon.AntDesign    size={22} color="white"   name="pausecircle" />
  </TouchableOpacity>
  <TouchableOpacity onPress={()=>{stopAudio()}}>
<utils.vectorIcon.Entypo style={{marginLeft:12}}  size={25} color="red"   name="controller-stop" />
</TouchableOpacity>
  </View>}

  {paudio=="pause" &&
  <View style={{flexDirection:"row",alignItems:"center",width:"38%" }}>
 <TouchableOpacity onPress={()=>{playAudio("")}}>
<utils.vectorIcon.Entypo  size={25} color="white"  name="controller-play" /> 
</TouchableOpacity>
  <TouchableOpacity onPress={()=>{stopAudio()}}>
<utils.vectorIcon.Entypo style={{marginLeft:12}}  size={25} color="red"   name="controller-stop" />
</TouchableOpacity>
  </View>}

 <View style={{width:"60%" }}>
<theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:13,color:"white",fontFamily:theme.fonts.fontMedium,lineHeight:20 }}>Record.mp3</theme.Text>
</View>

  </View>
)} */}

{audio!=""&&(
 <View style={{width:"100%",elevation:5,backgroundColor:"white",padding:7,marginTop:40,borderRadius:5,marginBottom:20}}>
 <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
  <theme.Text style={{fontSize:15,color:"black",fontFamily:theme.fonts.fontMedium,width:"70%"}}>Audio</theme.Text>
 <TouchableOpacity 
 onPress={()=>setada(!ada)}
 style={{width:"20%",alignItems:"center",justifyContent:"center"}}>
 <utils.vectorIcon.AntDesign name={!ad?"down":"up"} color={theme.color.buttonLinerGC1} size={24} />
</TouchableOpacity>
 </View>
 {ada&&(
 <View>
 {Sep()}
 {SepLine()}
 {Sep()}
 {Sep()}
 <View style={{padding:5,backgroundColor:theme.color.buttonLinerGC1,flexDirection:"row", borderRadius:5,alignSelf:"center",width:"60%",flexDirection:"row",alignItems:"center",justifyContent:"space-between" }}>
   
   {paudio==""&&(
   <TouchableOpacity style={{width:"38%" }} onPress={()=>{playAudio(audio)}}>
   <utils.vectorIcon.Entypo  size={25} color="white"  name="controller-play" /> 
   </TouchableOpacity>
   )}
   
   
     {paudio=="play" &&
     <View style={{flexDirection:"row",alignItems:"center",width:"38%" }}>
     <TouchableOpacity onPress={()=>  pauseAudio()}>
     <utils.vectorIcon.AntDesign    size={22} color="white"   name="pausecircle" />
     </TouchableOpacity>
     <TouchableOpacity onPress={()=>{stopAudio()}}>
   <utils.vectorIcon.Entypo style={{marginLeft:12}}  size={25} color="red"   name="controller-stop" />
   </TouchableOpacity>
     </View>}
   
     {paudio=="pause" &&
     <View style={{flexDirection:"row",alignItems:"center",width:"38%" }}>
    <TouchableOpacity onPress={()=>{playAudio("")}}>
   <utils.vectorIcon.Entypo  size={25} color="white"  name="controller-play" /> 
   </TouchableOpacity>
     <TouchableOpacity onPress={()=>{stopAudio()}}>
   <utils.vectorIcon.Entypo style={{marginLeft:12}}  size={25} color="red"   name="controller-stop" />
   </TouchableOpacity>
     </View>}
   
    <View style={{width:"60%" }}>
   <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:13,color:"white",fontFamily:theme.fonts.fontMedium,lineHeight:20 }}>Record.mp3</theme.Text>
   </View>
   
 </View>
 {Sep()}
 </View>
)}
 </View>
)}
 
{cmnt!=""&&(
 <View style={{width:"100%",elevation:5,backgroundColor:"white",padding:7,borderRadius:5,marginBottom:20}}>
 <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
  <theme.Text style={{fontSize:15,color:"black",fontFamily:theme.fonts.fontMedium,width:"70%"}}>Comment</theme.Text>
 <TouchableOpacity 
 onPress={()=>setad(!ad)}
 style={{width:"20%",alignItems:"center",justifyContent:"center"}}>
 <utils.vectorIcon.AntDesign name={!ad?"down":"up"} color={theme.color.buttonLinerGC1} size={24} />
</TouchableOpacity>
 </View>
 {ad&&(
 <View>
 {Sep()}
 {SepLine()}
 {Sep()}
 {Sep()}
 <theme.Text style={{fontSize:13,color:"black",lineHeight:25 }}>{cmnt}</theme.Text>
 {Sep()}
 </View>
)}
 </View>
)}
 
 
  </View>
  </ScrollView> 
 
   
  </View>
  
    </Modal>
    )
  }


}
 
const renderInternetErr=()=>{
  return <Text style={{position:"absolute",top:"45%",color:"grey",fontSize:15,alignSelf:"center"}}>No internet connection !</Text>
}

const renderServerErr=()=>{
 return  (
   <View style={{marginTop:"40%"}}>
   <Text style={{color:"grey",fontSize:15,alignSelf:"center",marginBottom:5}}>Server not respond !</Text>
   <TouchableOpacity   onPress={()=>{ if(isInternet){setrefresh(true)}else{utils.AlertMessage("","Please connect internet !")} }}>
   <Text  style={{color:theme.color.buttonLinerGC1,fontSize:15,textDecorationLine:"underline",alignSelf:"center"}}>Retry</Text>
   </TouchableOpacity>
   </View>
 )
}
 
  return(
 <SafeAreaView style={styles.container}>
   {renderDiputeModal()}
  <utils.Loader  loader={l} />
  {!isInternet && !isserverErr && (dispute=="null") && !l && renderInternetErr()} 
 <utils.StackHeader p={props} title="Trip Detail" /> 
 {!isInternet && !isserverErr && !l  && dispute!=="null" && <utils.TopMessage msg="No internet connection ! "/> } 
 <ScrollView style={{}}>
 {isserverErr   && !l && renderServerErr()}
 {!l && dispute!="null"  && !isserverErr &&(
  <View style={{padding:10}}> 
 {renderdetail()}   
 </View>
 )}
 </ScrollView>
 <View style={{padding:10}}>
 {!l && dispute!="null"  && !isserverErr && renderButton()}
 </View>
 
 </SafeAreaView>
)
    
  }