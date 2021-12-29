import React ,{useEffect,useRef,useState} from 'react';
import { StyleSheet,TouchableOpacity,View,Text,TextInput,Keyboard,Image, ScrollView,KeyboardAvoidingView,ActivityIndicator} from 'react-native';
import {
  ApplicationProvider,
  Button,
  Icon,
  Input,
  IconRegistry,
  Layout,
} from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import * as eva from '@eva-design/eva';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';
import theme from "../../../themes/index"
import ModalSelector from 'react-native-modal-selector'
import utils from "../../../utils/index"
import LinearGradient from 'react-native-linear-gradient';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { inject, observer } from "mobx-react"; 
import AsyncStorage from '@react-native-async-storage/async-storage'
import GVs from '../../../stores/Global_Var';

  export default inject("store")(observer(ChangePin));

   function ChangePin (props) {
  
  
  const {isInternet,user,setuser} = props.store;
  const [loader, setloader] = useState(false);
  const [cp, setcp] =   useState('');    //current pin
  const [np, setnp] =   useState('');   //new pin
  const [rp, setrp] =   useState('');  //rpeatt pin
 
  const [err, seterr] =   useState('');  //rpeatt pin
  

  useEffect(() => {
    if(err!="")
    {
      setTimeout(() => {
        seterr("")
      }, 1500);
   
    }
 }, [err])
 
 
       const  checkEmptyFields= ()=>
       {
            
           if(cp=="" || np=="" || rp==""   ){  
             return true;
           } else{
             return false;
           }
        
       }

       const  storeUserData = async () => {
        try {
          //  user.pin=np
        //  console.log("user after pin chng : ",user)
        //  console.log("Gv after pin chng : ",GVs.user)
          // await AsyncStorage.setItem('userData', JSON.stringify(user))
          setloader(false)
          clearFields()
          Keyboard.dismiss();
          utils.ToastAndroid.ToastAndroid_SBC("Change PIN Successfully.")
          console.log("store user data success : ")
        } catch (e) {
          console.log("store user data error : ", e)
          setloader(false)
        }
      }

     const checkPin=()=>{
        
      setloader(true)
         try {
          
          setTimeout(() => {
            
            if(cp==user.pin){
            
              if(np==rp){

          // if(GVs.user.length>0){
          //   GVs.user.map((e,i,a)=>{
          //     if(e.id==user.id){
          //      e.pin=np;
          //     }
          //   })
          // }  
           storeUserData();
              
            
            }else{
              setloader(false);
              seterr("Repeat pin doesn't match.")
            }


            }else{
              setloader(false);
              seterr("Your current pin in incorrect.")
            }


          }, 1500);

        

           
         } catch (error) {
          setloader(false);
          console.log("checkpin cath error : ",error)
         }

       }

      const ChangePin=()=>{
        Keyboard.dismiss();
        let c= checkEmptyFields();
        if(c==true){
          seterr("Please fill empty fields.")
        }else{
          
          if(isInternet==true){
            checkPin()
          }else{
            seterr("Please connect inetrnet.")
          }

        }
      }

      const clearFields=()=>{
        setnp("");setcp("");setrp("");seterr("")
      }


 const renderButton=()=>{
   return(
     <View style={{ justifyContent:"flex-end",bottom:10}}>
 
       <TouchableOpacity onPress={()=>{ChangePin()}} style={styles.BottomButton}>
  		<LinearGradient colors={[theme.color.buttonLinerGC1,theme.color.buttonLinerGC2]} style={styles.LinearGradient}>
  			  		<View style={styles.ButtonRight}>
  				   	{loader==false&&(<Text style={styles.buttonText}>Change PIN</Text>)}
               {loader&&(<ActivityIndicator size={25} color={"white"} />)}
 			      	</View>
 			</LinearGradient>
 			</TouchableOpacity>

     </View>
   )
 }
   
 
const renderFields=()=>{
  return(
    <View style={{padding:10,margin:10}}>

<View style={{height:15}} />

 <Input
      value={cp}
      keyboardType="number-pad"
      maxLength={4}
      label='Current PIN'
      placeholder='Enter Current PIN'
      onChangeText={t => setcp(t)}
    />

<View style={{height:15}} />

<Input
      value={np}
      keyboardType="number-pad"
      maxLength={4}
      label='New PIN'
      placeholder='Enter New PIN'
      onChangeText={t => setnp(t)}
    />

<View style={{height:15}} />

<Input
      value={rp}
      keyboardType="number-pad"
      maxLength={4}
      label='Repeat PIN'
      placeholder='Enter Repeat PIN'
      onChangeText={t => setrp(t)}
    />

 

    </View>
  )
}

 
 
  return( 
      <Layout style={styles.container}>
     {err!=""&&<utils.TopMessage msg={err} /> }
     <utils.DrawerHeader p={props} title="Change Pin" /> 
     
   <KeyboardAvoidingView
    keyboardVerticalOffset={Platform.OS == "ios" ? 10 : 0}
    behavior={Platform.OS == "ios" ? "padding" : ""} style={{ flex: 1 }} >
 <ScrollView>  
 {renderFields()}
</ScrollView>  

        
   {renderButton()}

  
   </KeyboardAvoidingView>
 
 
      </Layout>
 )

  }


  const styless = StyleSheet.create({
    captionContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    captionIcon: {
      width: 10,
      height: 10,
      marginRight: 5
    },
    captionText: {
      fontSize: 12,
      fontWeight: "400",
      fontFamily: "opensans-regular",
      color: "#8F9BB3",
    }
  });