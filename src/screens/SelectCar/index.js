import React ,{useEffect,useState} from 'react';
import {TouchableOpacity,View,KeyboardAvoidingView,ScrollView ,Text,BackHandler} from 'react-native';
import {Layout} from '@ui-kitten/components';
import styles from './styles';
import theme from "../../themes/index"
import utils from "../../utils/index"
import LinearGradient from 'react-native-linear-gradient';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import GVs from '../../stores/Global_Var';
import ToggleSwitch from 'toggle-switch-react-native'
import { inject, observer } from "mobx-react"; 
import db from "../../database/index" 
import utilsS from "../../utilsS/index"
import Modal from 'react-native-modal';


export default inject("userStore","generalStore","carStore")(observer(SelectCar));

function SelectCar (props)   {

 
const {isInternet}   =  props.generalStore;
const {user,authToken,Logout,setUser,setonline} =  props.userStore;
const {setCars,cars} =  props.carStore;

const [car, setCar] = useState("a");

const [loader, setloader] = useState(false);
const [isModalVisible, setModalVisible] = useState(false);

const [activeChecked, setActiveChecked] = useState(true);

 const onActiveCheckedChange = (isChecked) => {
   setActiveChecked(isChecked);
 };
 
 useEffect(() => {
   if(isInternet){
    getCar();
   }
 }, [isInternet])
 
 const getCar=()=>{
  setloader(true);
  let uid=user._id
  const bodyData=false
  const header=authToken;
 
  // method, path, body, header
  db.api.apiCall("get",db.link.getCar+uid,bodyData,header)
  .then((response) => {
	       setloader(false);
         console.log("Get car response : " , response);
    
         if(!response.data){
          setCar(false);
          // utils.AlertMessage("",response.message) ;
          return;
         }


         if(response.data){
           setCar(response.data[0]);
           return;
         }
      
 
  }).catch((e) => {
     setloader(false);
     setCar("e")
    //  utilsS.AlertMessage("","Network request failed");
     console.error("Get car catch error : ", e)
    return;
  })

 }

 const onLogout=()=>{
  setCars(false) 
  Logout();
 }
 
  const renderOptin=()=>{
    return(
      <View style={{marginTop:15,backgroundColor:theme.color.mainColor,elevation:5,padding:10,borderRadius:4,flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>

<utils.vectorIcon.FontAwesome5 name="car" color="black" size={35} />
 
 <View style={{width:"70%"}}>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:16,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20}}> 
Opt-in
 </theme.Text>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:13,color:theme.color.mainPlaceholderColor,lineHeight:20}}> 
Enable to get more bookings
 </theme.Text>
 </View>
       
 <ToggleSwitch
  isOn={activeChecked}
  onColor="#35cf2d"
  offColor="silver"
  size="small"
  onToggle={(t)=>onActiveCheckedChange(t)}
/>
 
      </View>
    )
  }

  const renderButton=()=>{
    return(
      <TouchableOpacity disabled={loader} onPress={()=>{setModalVisible(true)}} style={styles.BottomButton}>
  		<LinearGradient colors={[theme.color.buttonLinerGC1,theme.color.buttonLinerGC2]} style={styles.LinearGradient}>
  			  		<View style={styles.ButtonRight}>
             <Text style={styles.buttonText}>Continue</Text> 
 			      	</View>
 			</LinearGradient>
 			</TouchableOpacity>
    )
  }

  const UpdateUseracptTerm=()=>{
    setloader(true)
    
    //update user
      let uid= user._id
      const bodyData=false
      const header= authToken;
     
       // method, path, body, header
       db.api.apiCall("put",db.link.updateTerms+uid,bodyData,header )
      .then((response) => {
           
        console.log("Update user termacpt response : " , response);
        
          if(response.data){
             UpdateUser()
             return;
             }
    
             if(!response.data){
               setloader(false)
               utilsS.AlertMessage("",response.message);
               return
              }

            setloader(false)
            return
     
      }).catch((e) => {
         setloader(false)
         utilsS.AlertMessage("","Network request failed");
         console.error("Update user termacpt catch error : ", e)
        return;
      })


    
      }

      const UpdateUser =()=>{
         
        //update user
          let uid= user._id
          const bodyData={is_online:activeChecked}
          const header= authToken;
         
           // method, path, body, header
           db.api.apiCall("put",db.link.updateUser+uid,bodyData,header )
          .then((response) => {
               
            console.log("Update user  response : " , response);
            
                if(response.data){
                  setModalVisible(false)
                  setloader(false)
                  setUser(response.data)
                  setonline(response.data.is_online)
                  setCars(car)
                  return
                  }
        
                 if(!response.data){
                   setloader(false)
                   utilsS.AlertMessage("",response.message)
                   return
                  }
    
                setloader(false)
                return
         
          }).catch((e) => {
             setloader(false)
             utilsS.AlertMessage("","Network request failed");
             console.error("Update user   catch error : ", e)
            return;
          })
    
    
        
          }

  const AcceptTerms=()=>{
    if(!isInternet){
          utils.AlertMessage("","Please connect internet !")
         }
     else{
          UpdateUseracptTerm()
         }
 
  }

 const  renderShowCar=()=>{
 
  return(
    
    <View style={{marginTop:20}}>

  <View style={{backgroundColor:theme.color.mainColor,padding:7,borderRadius:4,flexDirection:"row",alignItems:"center"}}>
     
  <utils.vectorIcon.Ionicons name="ios-car-sport-outline" color="black" size={70} />
 
 <View style={{width:"80%",marginLeft:10}}> 
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:17,color:"black",fontFamily:theme.fonts.fontMedium,textTransform:"capitalize",lineHeight:20}}> 
{car.car_name.name || "-----"}
 </theme.Text>  
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:15,color:theme.color.mainPlaceholderColor,textTransform:"capitalize",lineHeight:20}}> 
  {car.registration_number}
 </theme.Text>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:15,color:theme.color.mainPlaceholderColor,textTransform:"capitalize",lineHeight:20}}> 
  {car.type.type}
 </theme.Text>
 </View>
 
 </View>



 </View>
    )
  }
  
  const renderTermsModal=()=>{
    return(
     <Modal isVisible={isModalVisible}
     backdropOpacity={0.6}
     animationIn="fadeInUp"
     animationOut="fadeOutDown"
     animationInTiming={1200}
     animationOutTiming={1200}
     backdropTransitionInTiming={600}
     backdropTransitionOutTiming={600}
     onRequestClose={() => { setModalVisible(!isModalVisible) }}
  >
 
     <View style=
     {{
     flex:1,
     backgroundColor:"white", 
     padding:10,
     height:hp("100%"), 
     width:wp('95%'), 
     alignSelf: 'center'
     }}>
 
 <ScrollView>
 
 <theme.Text style={{fontSize:28,fontFamily:theme.fonts.fontMedium,color:"black"}}> 
      Terms of use
  </theme.Text> 
 
   <theme.Text  style={{fontSize:14,color:theme.color.mainPlaceholderColor}}> 
      You need to read and accept DeliverIt terms and conditions before you start driving
   </theme.Text> 
 
 
   <theme.Text style={{fontSize:22,fontFamily:theme.fonts.fontMedium,color:"black",alignSelf:"center",marginTop:20}}> 
      DeliverIt Captain Terms Of Use
  </theme.Text>
 
 
  <theme.Text  style={{fontSize:14,color:"black",marginTop:20,lineHeight:25}}> 
 
 Uber acquired substantially all the assets of Careem Inc a company with its registered office at P.O. Box 146, Road Town, Tortola, British Virgin Islands (Registration number 1723752) in January 2020. Careem Networks FZ LLC (subsidiary of Careem Inc) with its registered office at Shatha Tower, Dubai Media City, P. O. Box. 50024, Dubai, United Arab Emirates and its subsidiaries (excluding Qatar, Morocco, and Palestine which remain part of the Careem Inc group until they are transferred) now form part of the Uber group of companies which collectively are defined as (“Careem”, “we”, “us” or “our”), and by which expression includes Careem’s relevant legal representatives, administrators, successors-in-interest, permitted assigns and affiliates (“Affiliates”).
 
 These terms of service constitute a legally binding agreement (the “Agreement”) between you and your local Careem entity.
 
 This Agreement governs your use of the Careem application, website, call centre and technology platform (collectively, the “Careem Platform”). Generally, the right to operate the Careem Platform is licensed by Careem to its relevant Affiliates, and the relevant Affiliate in your jurisdiction provides you the right to access and use the Careem Platform in your jurisdiction.
 
 PLEASE READ THIS AGREEMENT CAREFULLY BEFORE ACCESSING OR USING THE CAREEM PLATFORM. IF YOU DO NOT AGREE TO BE BOUND BY THE TERMS AND CONDITIONS OF THIS AGREEMENT, YOU MAY NOT USE OR ACCESS THE CAREEM PLATFORM.
 
 Your access and use of the Careem Platform constitutes your agreement to be bound by this Agreement, which establishes a contractual relationship between you and Careem. Careem may immediately terminate this Agreement with respect to you, or generally cease offering or deny access to the Careem Platform or any portion thereof, at any time for any reason without notice.
 
 Supplemental terms may apply to certain Services (as defined below), such as policies for a particular event, loyalty programme, activity or promotion, and such supplemental terms will be disclosed to you in connection with the applicable Services. Supplemental terms are in addition to, and shall be deemed a part of, this Agreement for the purposes of the applicable Services. Supplemental terms shall prevail over this Agreement in the event of a conflict with respect to the applicable Services.
 
 Careem may amend this Agreement from time to time. Amendments will be effective upon Careem’s posting of an updated Agreement at this location or the amended policies or supplemental terms on the applicable Service. Your continued access or use of the Careem Platform after such posting constitutes your consent to be bound by this Agreement, as amended.
 
 
   </theme.Text> 
 
 </ScrollView>
       
 {renderAccepttermsButton()}
 
 
     </View>
   </Modal>
    )
  }

  const renderAccepttermsButton=()=>{
    return(
     <TouchableOpacity onPress={()=>{AcceptTerms()}} style={styles.BottomButtona}>
       <LinearGradient colors={[theme.color.buttonLinerGC1,theme.color.buttonLinerGC2]} style={styles.LinearGradienta}>
               <View style={styles.ButtonRight}>
             <Text style={styles.buttonText}>Accept</Text> 
             
                </View>
        </LinearGradient>
        </TouchableOpacity>
    )
  }
 

return(
<Layout style={styles.container}>
  
  {renderTermsModal()}
  
   {(!isInternet) &&(
      <View style={{position:"absolute",marginTop:"80%",alignSelf:"center",padding:10}}>
       <theme.Text style={{fontSize:15,fontFamily:theme.fonts.fontNormal,color:"red"}}> 
          Please connect internet
     </theme.Text> 
      </View>
    ) }



     <KeyboardAvoidingView
  keyboardVerticalOffset={Platform.OS == "ios" ? 10 : 0}
  behavior={Platform.OS == "ios" ? "padding" : ""} 
  style={{ flex: 1}} >
    <ScrollView showsVerticalScrollIndicator={false}>
    <utils.Loader  loader={loader} />
  
  <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginTop:10}}>
<theme.Text style={{fontSize:25,fontFamily:theme.fonts.fontMedium,color:"black"}}> 
     Car
  </theme.Text>

 <TouchableOpacity onPress={()=>onLogout()} >
<theme.Text style={{fontSize:14,color:"red",textDecorationLine:"underline"}}> 
 Sign out
</theme.Text>
</TouchableOpacity>
  </View>
    


     {renderOptin()}

     
   {(car=="e" && isInternet) &&(
      <View style={{ marginTop:"50%",alignSelf:"center",padding:10}}>

       <theme.Text style={{fontSize:15,fontFamily:theme.fonts.fontNormal,color:"grey"}}> 
       Network request failed 
     </theme.Text> 

    <TouchableOpacity onPress={()=>getCar()} style={{marginTop:20,alignSelf:"center"}} >
    <theme.Text style={{fontSize:14,color:"red",textDecorationLine:"underline" }}> 
       Retry
    </theme.Text>
    </TouchableOpacity>

      </View>
    ) }
   
  {((car==false && car!="e") && !loader && isInternet )&&(
    <View>
 <theme.Text style={{fontSize:16,fontFamily:theme.fonts.fontMedium,color:"black",marginTop:20}}> 
 No car found
</theme.Text>

<theme.Text style={{fontSize:14,fontFamily:theme.fonts.fontMedium,color:"grey",marginTop:30}}> 
 Please ask admin to register your car 
</theme.Text>

  
</View>
    )}

  {((car!=false)  && car!="e" && car!=="a" && !loader && isInternet) &&(
  <View>
  <theme.Text style={{fontSize:16,fontFamily:theme.fonts.fontMedium,color:"black",marginTop:20}}> 
  Dedicated Car
 </theme.Text>
 {renderShowCar()}  
  </View>
    )}
    
    </ScrollView>

     </KeyboardAvoidingView> 

     {((car) && !loader && isInternet) && renderButton()}
 

  </Layout>
)
    
}

