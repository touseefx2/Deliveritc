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


  let  paidearn=90
  let  cutearn=50
  let cutPercent=20  

  const audioRecorderPlayer =   new AudioRecorderPlayer();


export default inject("store")(observer(TripDetail));
 
 function TripDetail(props)   {
  const { user,setuser,setcl,cl,isl,setisl,setrequest,request,trip,settrip,cars,changetrip} = props.store;
  const [loader,setloader]=useState(false);
  const [dispmodal,setdispmodal]=useState(false);

  const [ad,setad]=useState(false);  //arow down

  const [sm,setsm]=useState("Total distance is incorrect");  //select msg
 
  const [s,sets]=useState("");
 
  const [isrs,setisrs]=useState(false);  //is record is start

  const {e}=props.route.params;

  let message1="Total distance is incorrect"
  let message2="I will explain it with text/voice recording"


  const [audio,setaudio]=useState("");  //select msg
  const [paudio,setpaudio]=useState("");  //select msg

  const [comment,setcomment]=useState("");  //select msg


 useEffect(() => {
    if(!dispmodal){
    clearall()
    }
 }, [dispmodal])
 
 useEffect(() => {
  
  if(paudio==""){
    audioRecorderPlayer.removePlayBackListener()
  }
   
 }, [paudio])

 const clearaudio=()=>{
   setaudio("");
   setpaudio("");
   sets("");
   audioRecorderPlayer.stopRecorder();
   audioRecorderPlayer.stopPlayer();
   audioRecorderPlayer.removePlayBackListener();
 }

const clearall=()=>{
  clearaudio();
  setsm(message1)
  setcomment("")
  setad(false)
  sets("")
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
    console.log("start rec : ",result);

  }

  const soundRecordStop=async ()=>{
    
      const result = await  audioRecorderPlayer.stopRecorder();
      if(result!=="Already stopped"){setaudio(result);}
      setpaudio("")
      setisrs(false)
      console.log("stop rec : ",result);
  }

  const playAudio= async(p)=>{
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
    console.log("play  : ",msg);
  }

  const pauseAudio=async()=>{
    const msg = await  audioRecorderPlayer.pausePlayer()
    setpaudio("pause") 
    console.log("pause : ",msg);
  }

  const stopAudio=async()=>{
    const msg = await  audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener()
    setpaudio("") 
    console.log("stop : ",msg);
  }

  const YesClickSubmit=()=>{
 
    if(sm==message1){
      setloader(true);
   
      setTimeout(() => {
        

        if(trip.length>0){
          trip.map((ee,i,a)=>{
          if(e.id==ee.id && e.captainid==ee.captainid && e.captaincarid ==ee.captaincarid){
            const obj={
              comment:sm,
                audio:""
            }
            changetrip(i,obj);
            }
          })
        }
   
         setloader(false);
        clearall();
        setdispmodal(false)
        utils.ToastAndroid.ToastAndroid_SB("Submit Success !")
      }, 1200);
   
    }
  
    if(sm==message2){
  
      if(audio!=="" || comment!=="")
  {
    setloader(true);
    setTimeout(() => {


      if(trip.length>0){
        trip.map((ee,i,a)=>{
        if(e.id==ee.id && e.captainid==ee.captainid && e.captaincarid ==ee.captaincarid){
          const obj={
            comment:comment,
              audio:audio
          }
          changetrip(i,obj);
          }
        })
      }
  
      setloader(false);
      clearall();
      setdispmodal(false)
      utils.ToastAndroid.ToastAndroid_SB("Submit Success !")
    }, 1200);
    
  }else{
    
    utils.AlertMessage("","Please enter comment or record audio")
  }
    
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
  let msg=(e.captainTripDispute.comment==""&&e.captainTripDispute.audio=="")?"Dispute":"View Dispute"
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
            {loader==false&&(<Text style={styles.buttonText}>Submit</Text>)}
             {loader&&(<ActivityIndicator size={25} color={"white"} />)}
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

    let tt= e.normalPay==true?"Cash Trip Payment"          //tranctn type
            :e.normalPay==true?"Card Payment"
            :""  

   let amount= e.cancelStatus=="Paid"?parseFloat(paidearn).toFixed(2):e.cancelStatus=="unPaid"?"0.00":e.cancelStatus=="unPaidcut"?"- "+parseFloat(cutearn).toFixed(2):"0.00"    /// cancel k case me  amount   
 
   let waitingTime=   secondsToHms(e.wait_time)

   let cancelmsg=e.cancelStatus=="unPaid"?"Cancel before grace time":"Cancel after grace time"
 
   let startridetime=""
   let endridetime=""
  let estimateTime=""
   if(e.endride==true){
    var  t =  moment(e.startRideTime).format('hh:mm a')  
    var date =  moment(e.startRideTime).format("ddd D MMM");   //9 july 2021
    startridetime= t

    var  t =  moment(e.endRideTime).format('hh:mm a')  
    var date =  moment(e.endRideTime).format("ddd D MMM");   //9 july 2021
    endridetime=  t

    estimateTime=secondsToHms(e.total_time)
   }
   

return(
<View style={{marginTop:40}}>
 
<View style={{flexDirection:"row",alignItems:"center",width:"100%",alignSelf:"center",justifyContent:"space-between"}}>
 <theme.Text numberOfLines={2} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20,width:"40%"}}>Booking ID</theme.Text>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"50%"}}>{e.id}</theme.Text>
 </View>

 {Sep()}
 {SepLine()}
 {Sep()}

 <View style={{flexDirection:"row",alignItems:"center",width:"100%",alignSelf:"center",justifyContent:"space-between"}}>
 <theme.Text numberOfLines={2} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20,width:"40%"}}>Date, Time</theme.Text>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"50%"}}>{createdAt}</theme.Text>
 </View>



{(e.status!="cancel" && e.status!=="skip" && e.status!=="reject" && e.endride==true) &&(
  <View>

 {Sep()}
 {SepLine()}
 {Sep()}

 <View style={{flexDirection:"row",alignItems:"center",width:"100%",alignSelf:"center",justifyContent:"space-between"}}>
 <theme.Text numberOfLines={2} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20,width:"30%"}}>Pickup location</theme.Text>
 <theme.Text numberOfLines={5} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"60%"}}>{e.pickupLocation.name}</theme.Text>
 </View>

 {Sep()}
 {SepLine()}
 {Sep()}

 <View style={{flexDirection:"row",alignItems:"center",width:"100%",alignSelf:"center",justifyContent:"space-between"}}>
 <theme.Text numberOfLines={2} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20,width:"30%"}}>Dropoff location</theme.Text>
 <theme.Text numberOfLines={5} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"60%"}}>{e.dropoffLocation.name}</theme.Text>
 </View>

 {Sep()}
 {SepLine()}
 {Sep()}

 <View style={{flexDirection:"row",alignItems:"center",width:"100%",alignSelf:"center",justifyContent:"space-between"}}>
 <theme.Text numberOfLines={2} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20,width:"30%"}}>Waiting time</theme.Text>
 <theme.Text numberOfLines={5} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"60%"}}>{waitingTime}</theme.Text>
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
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"50%"}}>{e.total_distance}</theme.Text>
 </View>

 {Sep()}
 {SepLine()}
 {Sep()}

 <View style={{flexDirection:"row",alignItems:"center",width:"100%",alignSelf:"center",justifyContent:"space-between"}}>
 <theme.Text numberOfLines={2} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20,width:"40%"}}>Estimate time</theme.Text>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"50%"}}>{estimateTime}</theme.Text>
 </View>

 {Sep()}
 {SepLine()}
 {Sep()}

 <View style={{flexDirection:"row",alignItems:"center",width:"100%",alignSelf:"center",justifyContent:"space-between"}}>
 <theme.Text numberOfLines={2} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20,width:"40%"}}>Transaction type</theme.Text>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"50%"}}>{tt}</theme.Text>
 </View>

 {Sep()}
 {SepLine()}
 {Sep()}

 <View style={{flexDirection:"row",alignItems:"center",width:"100%",alignSelf:"center",justifyContent:"space-between"}}>
 <theme.Text numberOfLines={2} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20,width:"40%"}}>Collect cash</theme.Text>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"50%"}}>{parseFloat(e.collectcash).toFixed(2)} PKR</theme.Text>
 </View>

 {Sep()}
 {SepLine()}
 {Sep()}

 <View style={{flexDirection:"row",alignItems:"center",width:"100%",alignSelf:"center",justifyContent:"space-between"}}>
 <theme.Text numberOfLines={2} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20,width:"40%"}}>Total amount </theme.Text>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"50%"}}>{parseFloat(e.rs).toFixed(2)} PKR</theme.Text>
 </View>

 {Sep()}
 {SepLine()}
 {Sep()}

 <View style={{flexDirection:"row",alignItems:"center",width:"100%",alignSelf:"center",justifyContent:"space-between"}}>
 <theme.Text numberOfLines={2} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20,width:"40%"}}>Captain earnings</theme.Text>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"50%"}}>{parseFloat(e.rs - ((cutPercent/100)*(e.rs ))).toFixed(2)} PKR</theme.Text>
 </View>

  </View>
)}

  
{(e.status=="cancel" ) &&(
  <View>

 {Sep()}
 {SepLine()}
 {Sep()}

 <View style={{flexDirection:"row",alignItems:"center",width:"100%",alignSelf:"center",justifyContent:"space-between"}}>
 <theme.Text numberOfLines={2} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20,width:"40%"}}>Status</theme.Text>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"50%"}}>{e.status}</theme.Text>
 </View>

 {Sep()}
 {SepLine()}
 {Sep()}

{e.cancelStatus=="Paid"&&(
  <View>
 <View style={{flexDirection:"row",alignItems:"center",width:"100%",alignSelf:"center",justifyContent:"space-between"}}>
 <theme.Text numberOfLines={2} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20,width:"40%"}}>Waiting time</theme.Text>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"50%"}}>{waitingTime}</theme.Text>
 </View>
{Sep()}
{SepLine()}
{Sep()}
  </View>
)}

{(e.cancelStatus=="unPaid" || "unPaidcut")&&(
  <View>
 <View style={{flexDirection:"row",alignItems:"center",width:"100%",alignSelf:"center",justifyContent:"space-between"}}>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20,width:"20%"}}>Detail</theme.Text>
 <theme.Text numberOfLines={2} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"60%"}}>{cancelmsg}</theme.Text>
 </View>
{Sep()}
{SepLine()}
{Sep()}
  </View>
)}
  
 
 <View style={{flexDirection:"row",alignItems:"center",width:"100%",alignSelf:"center",justifyContent:"space-between"}}>
 <theme.Text numberOfLines={2} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20,width:"40%"}}>Amount</theme.Text>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:fs,color:"black",fontFamily:theme.fonts.fontMedium,textAlign:"right",lineHeight:20,width:"50%"}}>{amount} PKR</theme.Text>
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
 
  if((e.captainTripDispute.comment==""&e.captainTripDispute.audio=="")){
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
  <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:15,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20,width:"25%" }}>Booking</theme.Text>
   <theme.Text numberOfLines={2} ellipsizeMode="tail" style={{fontSize:15,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20,width:"72%" }}>{e.id}</theme.Text>
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
  }else{
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
  <View style={{padding:10,alignItems:"center",justifyContent:"center"}}>
  
  <View style={{width:"100%",alignItems:"center",flexDirection:"row",justifyContent:"space-between",backgroundColor:"white",borderRadius:5,elevation:5,padding:5}}>
  <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:15,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20,width:"25%" }}>Booking</theme.Text>
   <theme.Text numberOfLines={2} ellipsizeMode="tail" style={{fontSize:15,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20,width:"72%" }}>{e.id}</theme.Text>
  </View>


  {e.captainTripDispute.audio!=""&&(
<View style={{padding:5,backgroundColor:theme.color.buttonLinerGC1,flexDirection:"row", borderRadius:5,alignSelf:"center",width:"60%",flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginTop:30}}>
   
{paudio==""&&(
<TouchableOpacity style={{width:"38%" }} onPress={()=>{playAudio(e.captainTripDispute.audio)}}>
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
)}
 
{e.captainTripDispute.comment!=""&&(
 <View style={{width:"100%",elevation:5,backgroundColor:"white",padding:5,marginTop:30,borderRadius:5,marginBottom:20}}>
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
 {Sep()}
 {SepLine()}
 {Sep()}
 {Sep()}
 <theme.Text style={{fontSize:13,color:"black",lineHeight:25 }}>{e.captainTripDispute.comment}</theme.Text>
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

 
  return(
 <SafeAreaView style={styles.container}>
   {renderDiputeModal()}
 <utils.StackHeader p={props} title="Trip Detail" /> 
 <ScrollView style={{}}>
 <View style={{padding:10}}> 
 {renderdetail()}   
 </View>
 </ScrollView>
 <View style={{padding:10}}>
 {renderButton()}
 </View>
 
 </SafeAreaView>
)
    
  }