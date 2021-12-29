import React ,{useEffect,useRef,useState} from 'react';
import {ScrollView,KeyboardAvoidingView,Platform,StyleSheet,Text,View,TouchableOpacity, Keyboard, ActivityIndicator} from 'react-native';
import {
  ApplicationProvider,
  Button,
  Icon,
  IconRegistry,
  Layout,
} from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import * as eva from '@eva-design/eva';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';
import theme from "../../../themes/index"
import GVs from '../../../stores/Global_Var';
import utils from "../../../utils/index"
import LinearGradient from 'react-native-linear-gradient';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {
	CodeField,
	Cursor,
	useBlurOnFulfill,
	useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { inject, observer } from "mobx-react"; 
import {fcmService} from "../../../services/Notification/FCMService"  //firebase cloud mesaging
 

export default inject("store")(observer(SigninPin));

  function SigninPin (props) {
 
  const {isInternet,setisInternet, setapiLevel,setip,setuser,setcars,changeuser}=props.store;
  const [isis,setisis] = useState(false)
  let cellCount=4
  let phone=props.route.params.phone
  let d=props.route.params.d
  let user=props.route.params.user
   
  const [value, setValue] = useState('');
  const [err, seterr] = useState(0);
  const [loader, setloader] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
 
  const ref = useBlurOnFulfill({value, cellCount: cellCount});
  const [propsS, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  

  const onRegister = (token) =>
{
  console.log("[App] onRegister :", token);
  if(token!=null)
 { 
  //  this.saveTokenToDatabase(token);
  setTimeout(() => {
    seterr(0);
    setloader(false);
    user.sigin=true;
    user.notificationToken=token
    storeUserData(user);
    setModalVisible(!isModalVisible)
  }, 1500); 
  }
}
 
 const renderButton=()=>{
   return(
     <View style={{flexDirection:"row",justifyContent:"flex-end",bottom:10}}>

    <TouchableOpacity onPress={()=>{props.navigation.navigate("ResetPin",d)}} style={styles.BottomButton}>
  		<LinearGradient colors={[theme.color.mainColor,theme.color.mainColor]} style={styles.LinearGradient}>
  			  		<View style={styles.ButtonRight}>
  						<Text style={styles.buttonText,{color:theme.color.buttonLinerGC1 }}>Forgot PIN</Text>
 			      	</View>
 			</LinearGradient>
 			</TouchableOpacity>

       <TouchableOpacity onPress={()=>{Next()}} style={styles.BottomButton}>
  		<LinearGradient colors={[theme.color.buttonLinerGC1,theme.color.buttonLinerGC2]} style={styles.LinearGradient}>
  			  		<View style={styles.ButtonRight}>
  				   	{loader==false&&(<Text style={styles.buttonText}>Next</Text>)}
               {loader&&(<ActivityIndicator size={25} color={"white"} />)}
 			      	</View>
 			</LinearGradient>
 			</TouchableOpacity>

     </View>
   )
 }

 const renderAccepttermsButton=()=>{
  return(
   <TouchableOpacity onPress={()=>{AcceptTerms()}} style={styles.BottomButtona}>
     <LinearGradient colors={[theme.color.buttonLinerGC1,theme.color.buttonLinerGC2]} style={styles.LinearGradienta}>
             <View style={styles.ButtonRighta}>
              {loader==false&&(<Text style={styles.buttonText}>Accept</Text>)}
              {loader&&(<ActivityIndicator size={25} color={"white"} />)}
              </View>
      </LinearGradient>
      </TouchableOpacity>
  )
}

const  storeUserData = async (value) => {
  try {
    await AsyncStorage.setItem('userData', JSON.stringify(value))
    console.log("store user data success : ")
  } catch (e) {
    console.log("store user data error : ", e)
  }
}

 const Continue=()=>{
  Keyboard.dismiss();
  Next();
 }

 const AcceptTerms=()=>{
  let car=[]
  if(GVs.cars.length>0){
    GVs.cars.map((e,i,a)=>{
      if(e.uid==user.id){
        car.push(e)
      }
    })
  }
 user.acceptterm=true;
 setuser(user)   //set user data with selected car
 setcars(car)   //set all user cars
 storeUserData(user)  
 setModalVisible(!isModalVisible);
 }

 const Next=()=>{
  
  if(value.length<cellCount){
    seterr(2);
  }else{

    if(isInternet==false){
      setisis(true);
      setTimeout(() => {
        setisis(false)
      }, 1500);
    }else{
      setloader(true);
      if(value==user.pin){
  
        if(Platform.OS=="ios"){
          fcmService.registerAppwithFCM();//forios
        }else{
          fcmService.register(onRegister);
        }
        
  
      }else{
  
        setTimeout(() => {
          seterr(1);
          setloader(false);
        }, 1500);
  
      }
    }

   

  }
 }

 useEffect(() => {
    seterr(0)
 }, [value])

 const renderTermsModal=()=>{
   return(
    <Modal isVisible={isModalVisible}
    backdropOpacity={0.6}
    animationIn="fadeInUp"
    animationOut="fadeOutDown"
    animationInTiming={1200}
    animationOutTiming={1200}
    onRequestClose={() => { setModalVisible(!isModalVisible) }}
    backdropTransitionInTiming={600}
    backdropTransitionOutTiming={600}>

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

 let errmessage=""
 if(err==1){errmessage="Incorrect PIN !"}
 if(err==2){errmessage="Please Enter Full PIN !"}

  return( 
      <Layout style={styles.container}>
{isis  && <utils.TopMessage  msg="Please connect internet"/>}
   <utils.StackHeader p={props} />
   {renderTermsModal()}
   <KeyboardAvoidingView
    keyboardVerticalOffset={Platform.OS == "ios" ? 10 : 0}
    behavior={Platform.OS == "ios" ? "padding" : ""} style={{ flex: 1,marginTop:15}} >
<ScrollView>  
    
     <theme.Text style={{fontSize:27,fontFamily:theme.fonts.fontMedium,color:"black",width:"100%" }}> 
     Enter PIN
     </theme.Text> 

     <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:15,color:theme.color.mainPlaceholderColor,width:"100%" }}> 
     For phone number {phone}
     </theme.Text> 

     <View style={{ width: '100%', alignSelf: 'center'   }}>
				<CodeField
					ref={ref}
				   {...propsS}
           value={value}
          onChangeText={setValue}
					onEndEditing={()=>{Continue()}}
					cellCount={cellCount}
					rootStyle={styles.codeFieldRoot}
					keyboardType="number-pad"
					textContentType="oneTimeCode"
					renderCell={({ index, symbol, isFocused }) => (
						<Text
							key={index}
							style={[styles.cell,{borderBottomColor:err==0?theme.color.buttonLinerGC1:"red"}, isFocused && styles.focusCell]}
							onLayout={getCellOnLayoutHandler(index)}>
							{symbol || (isFocused ? <Cursor /> : null)}
						</Text>
					)}
				/>
			</View>

{err!=0&&(
  <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:16,color:"red",width:"100%",marginTop:30}}> 
  {errmessage}
  </theme.Text>
)}

</ScrollView>  

        
        {renderButton()}
        

  
   </KeyboardAvoidingView>
 

      </Layout>
 )


  }

