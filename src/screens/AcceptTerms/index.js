import React ,{useEffect,useRef,useState} from 'react';
import {ScrollView,KeyboardAvoidingView,Platform,StyleSheet,Text,View,TouchableOpacity, Keyboard, ActivityIndicator} from 'react-native';
import {
 
  Layout,
} from '@ui-kitten/components';
 
import styles from './styles';
import theme from "../../themes/index"
import GVs from '../../store/Global_Var';
import utils from "../../utils/index"
import LinearGradient from 'react-native-linear-gradient';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
 
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { inject, observer } from "mobx-react"; 

export default inject("store")(observer(AcceptTerms));

  function AcceptTerms (props) {
 
  const {isInternet,setisInternet, setapiLevel,setip,setuser,setcars,user}=props.store;
 
 
   
  const [loader, setloader] = useState(false);
  const [isModalVisible, setModalVisible] = useState(true);
  const [isis,setisis] = useState(false)
 
 

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
    user.acceptterm=true
    console.log("store user data success : ")
  } catch (e) {
    console.log("store user data error : ", e)
  }
}


 

 const AcceptTerms=()=>{
   if(isInternet==false){
     utils.AlertMessage("","Please connect internet")
   }else{
    let car=[]
    if(GVs.cars.length>0){
      GVs.cars.map((e,i,a)=>{
        if(e.uid==user.id){
          car.push(e)
        }
      })
    }
   

   let u  = {...user}
   u.acceptterm=true;
    

   storeUserData(u) 
   setuser(user)   //set user data with selected car
   setcars(car)   //set all user cars
  //  setModalVisible(!isModalVisible);
   }

 }
 
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
 
  return( 
      <Layout style={styles.container}>
   {renderTermsModal()}
      </Layout>
 )


  }

