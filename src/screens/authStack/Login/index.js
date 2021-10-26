 import React ,{useEffect,useRef,useState} from 'react';
 import { StyleSheet,TouchableOpacity,View,Text,TextInput,Keyboard,ActivityIndicator} from 'react-native';
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
import ModalSelector from 'react-native-modal-selector'
import utils from "../../../utils/index"
import LinearGradient from 'react-native-linear-gradient';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import GVs from '../../../store/Global_Var';
import { inject, observer } from "mobx-react"; 

 
let phoneValidate=true
 //Custom Phone Modal Data
 let index=0;
 const data = [
 { key:index++, section: true, label: 'Country Code',},
 { key:index++, label: '+92',component:<utils.PhoneModalComponent    countryCode="+92" country="pakistan" color="white"  image={require('../../../assets/flag/pk.png')}   />},
 { key:index++, label: '+91',component:<utils.PhoneModalComponent    countryCode="+91" country="india" color="white"     image={require('../../../assets/flag/ind.png')}  />},
 { key:index++, label: '+84',component:<utils.PhoneModalComponent    countryCode="+84" country="vietnam" color="white"   image={require('../../../assets/flag/vtn.png')}  />},
 { key:index++, label: '+374',component:<utils.PhoneModalComponent   countryCode="+374" country="armenia" color="white" image={require('../../../assets/flag/armn.png')}  />},

];


  export default inject("store")(observer(Login));

  function Login (props) {
  
      
  let modalPicker = useRef(); 
  let phoneInput_1 = useRef(); 
  let phoneInput_2 = useRef(); 
  let  phoneInput_3 = useRef(); 

  const {isInternet}=props.store;
  const [isis,setisis] = useState(false)

  const [loader, setloader] = useState(false);
  //phone
  const [selectedCountryCode,setselectedCountryCode] = useState("+92")
  const [phone1,setphone1] = useState("")
  const [phone2,setphone2] = useState("")  
  const [phone3,setphone3] = useState("")
  const [phn1PlaceHolder,setphn1PlaceHolder] = useState("300")
  const [phn2PlaceHolder,setphn2PlaceHolder] = useState("1122")
  const [phn3PlaceHolder,setphn3PlaceHolder] = useState("234")
  const [phn1MaxLength,setphn1MaxLength] = useState(3)
  const [phn2MaxLength,setphn2MaxLength] = useState(4)
  const [phn3MaxLength,setphn3MaxLength] = useState(3)
  const [phoneFields,setphoneFields] = useState(3)
  const [ phoneInputFieldborderColor1,setphoneInputFieldborderColor1] = useState(theme.color.mainPlaceholderColor)
  const [ phoneInputFieldborderColor2,setphoneInputFieldborderColor2] = useState(theme.color.mainPlaceholderColor)
  const [ phoneInputFieldborderColor3,setphoneInputFieldborderColor3] = useState(theme.color.mainPlaceholderColor)
  const [phoneF,setphoneF] = useState(false)
  const [phoneV,setphoneV] = useState(false)
  
  const focusField= (field) =>{

    let  unfocuscolor = theme.color.mainPlaceholderColor
    let  focuscolor   = theme.color.buttonLinerGC1
   
      if(field == "phone1"){
        // setphone2("");setphone3("");
        setphoneInputFieldborderColor1(focuscolor);
        setphoneInputFieldborderColor2(unfocuscolor);
        setphoneInputFieldborderColor3(unfocuscolor); 
     }
     else if(field == "phone2"){
      // setphone3("")
      setphoneInputFieldborderColor1(unfocuscolor);
        setphoneInputFieldborderColor2(focuscolor);
        setphoneInputFieldborderColor3(unfocuscolor);
     }
     else if(field == "phone3"){
        setphoneInputFieldborderColor1(unfocuscolor);
        setphoneInputFieldborderColor2(unfocuscolor);
        setphoneInputFieldborderColor3( focuscolor);
     }
     }

     useEffect(() => {
      if(selectedCountryCode!=""){
        setphone1("");setphone2("");setphone3("");
        let  unfocuscolor = theme.color.mainPlaceholderColor
        setphoneInputFieldborderColor1(unfocuscolor);
        setphoneInputFieldborderColor2(unfocuscolor);
        setphoneInputFieldborderColor3(unfocuscolor); 
        phoneNumFormate();
      }
     }, [selectedCountryCode])

     const setPhoneInput=(txt,p)=>{
     if(p=="phone1"){
      setphone1(txt);setphoneF(false),setphoneV(false)
      if (txt.length == phn1MaxLength) {phoneInput_2 && phoneInput_2.focus()} 
     }

     if(p=="phone2"){
      setphone2(txt);setphoneF(false),setphoneV(false) 
      if ((txt.length == phn2MaxLength && phoneFields==3)) {phoneInput_3 && phoneInput_3.focus()}  
      if ((txt.length == "")) {phoneInput_1 && phoneInput_1.focus()}
    }

    if(p=="phone3"){
      setphone3(txt);setphoneF(false),setphoneV(false)
      if ((txt.length == "")) {phoneInput_2 && phoneInput_2.focus()}
    }

     }

     const  phoneNumFormate = () => {
      //india/Pakistan
       if(selectedCountryCode=="+92"|| selectedCountryCode=="+91"){
         setphn1MaxLength(3); setphn2MaxLength(4); setphn3MaxLength(3);
         setphn1PlaceHolder("300"); setphn2PlaceHolder("1122"); setphn3PlaceHolder("234");
         setphoneFields(3);
        }
      //vietnam
        if(selectedCountryCode=="+84"){
          setphn1MaxLength(3); setphn2MaxLength(4); setphn3MaxLength(2);
          setphn1PlaceHolder("355");  setphn2PlaceHolder("5528");  setphn3PlaceHolder("71");
           setphoneFields(3);
        }
      //armenia
        if(selectedCountryCode=="+374"){
         setphn1MaxLength(3);  setphn2MaxLength(3); setphn3MaxLength(null);
          setphn1PlaceHolder("355"); setphn2PlaceHolder("552");  setphn3PlaceHolder(null);
          setphoneFields(2);
        }
       }

       const  checkEmptyFields= ()=>
       {
          
         if(phoneFields==3 )
         {
           if(phone1!="" && phone2!="" && phone3!="" && selectedCountryCode!=""){
           let Phone= selectedCountryCode+phone1+phone2+phone3
           phoneValidate = utils.Validation.PhoneValidate(Phone,selectedCountryCode)
           }
         }else if (phoneFields==2 ){
           if (phone1!="" && phone2!=""  && selectedCountryCode!=""){
           let Phone = selectedCountryCode+phone1+phone2
           phoneValidate = utils.Validation.PhoneValidate(Phone,selectedCountryCode)
           }
         }
       
         setphoneV(phoneValidate ? false : true)
       
         //check empty fields
         if(phoneFields==3){
       
           if( selectedCountryCode=="" || phone1=="" || phone2=="" || phone3=="" ){
            setphoneF(true)
             return false;
           } else{
             setphoneF(false)
             return true;
           }
       
         }else if (phoneFields==2){
       
           if(selectedCountryCode=="" || phone1=="" || phone2==""   ){
             setphoneF(true)
             return false;
           } else{
             setphoneF(false)
             return true;
           }
       
         }
        
       
       
        
       }
  
       const _signIn=(phone)=>{
 if(isInternet==false){
   setisis(true);
   setTimeout(() => {
     setisis(false)
   }, 1500);
 }else{
  if(GVs.user.length>0){

    setloader(true);


    let c=false;
    let user=null;

    GVs.user.map((e,i,a)=>{          
      if(e.phone==phone){
        user=e;
        user.selectedCar="";
        user.sigin=false;
        user.notificationToken="";
        user.acceptterm=false;
        user.optin=false;
        user.online=true;
        user.onlineTime=[]
        c=true;
        return false;
      } 
    })


    setTimeout(() => {
      setloader(false);
      if(c){
        const obj={phone:phone,d:{p1:phone1,p2:phone2,p3:phone3,pf:phoneFields,cc:selectedCountryCode},user}
        props.navigation.navigate("SigninPin",obj)
      }else{
        utils.AlertMessage("","No User Found")
      }
    }, 1200);
   

  }else{
      utils.AlertMessage("","No User Found in Database")
    }
    
 }
        
    
       
           }
  
    const SigninClick = ()=>
     {
       Keyboard.dismiss();
       phoneValidate=true  
       let  unfocuscolor = theme.color.mainPlaceholderColor
       setphoneInputFieldborderColor1(unfocuscolor);
       setphoneInputFieldborderColor2(unfocuscolor);
       setphoneInputFieldborderColor3(unfocuscolor); 
 
     if(checkEmptyFields())
     {
       if(phoneValidate) 
       { 
        let Phone= selectedCountryCode+phone1+phone2+phone3
         _signIn(Phone);
       } 
     
     }
      
     
     }
  
   return(
     
 <Layout style={styles.container}>
{isis  && <utils.TopMessage  msg="Please connect internet"/>}
<View style={styles.Bottom}>
      <theme.Text style={{fontSize:16,color:theme.color.mainPlaceholderColor}}>Enter phone number</theme.Text>
    <View style={{ marginTop:10,padding:2,alignItems:"center",flexDirection:"row"}} >
            <utils.FlagIcon countryCode={selectedCountryCode} />
                   <ModalSelector
                    animationType="slide"
                    data={data}
                    ref={modalPicker}
                    overlayStyle={{flex: 1, padding: '5%', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.8)'}}
                    scrollViewAccessible={true}
                    sectionTextStyle={{fontSize:26,color:"white",fontWeight:"bold"}} 
                    cancelTextStyle={{fontSize:22,color:"white"}}
                    initValue={selectedCountryCode} 
                    selectStyle={{borderColor:theme.color.mainPlaceholderColor,backgroundColor:"white"
                    ,padding:5,borderRadius:4,width:65,marginLeft:10}}
                    optionContainerStyle={{backgroundColor:"#1f1f1f",borderRadius:20,width:300,alignSelf:"center"}}
                    initValueTextStyle={{color:theme.color.buttonLinerGC1,fontSize:17}}
                    backdropPressToClose={true}
                    cancelStyle={{backgroundColor:theme.color.buttonLinerGC1,borderRadius:20,width:280,alignSelf:"center"}}
                    onChange={(option)=>{setselectedCountryCode(option.label)}} />

            <TextInput
            ref={r=>phoneInput_1=r}
            keyboardType="number-pad"   placeholder={phn1PlaceHolder}  value={phone1} maxLength={phn1MaxLength}     defaultValue={phone1} onFocus={() => focusField("phone1") } 
            placeholderTextColor={theme.color.mainPlaceholderColor} style={[styles.phoneinput,{borderColor:(phoneF||phoneV)?"red":phoneInputFieldborderColor1,backgroundColor:"white",color:"black"}]}
            onChangeText={(txt)=>{setPhoneInput(txt,"phone1")}}/>
            
           <TextInput
          ref={r=>phoneInput_2=r}
           keyboardType="number-pad" placeholder={phn2PlaceHolder}  value={phone2} maxLength={phn2MaxLength}     defaultValue={phone2} onFocus={() =>  focusField("phone2") } 
           placeholderTextColor={theme.color.mainPlaceholderColor} style={[styles.phoneinput,{borderColor:(phoneF||phoneV)?"red":phoneInputFieldborderColor2,backgroundColor:"white",color:"black"}]}
           onChangeText={(txt)=>{setPhoneInput(txt,"phone2")}}/>
         
           {phoneFields==3 &&(  
           <TextInput
           ref={r=>phoneInput_3=r}
           keyboardType="number-pad" placeholder={phn3PlaceHolder}  value={phone3} maxLength={phn3MaxLength}     defaultValue={phone3} onFocus={() =>  focusField("phone3") } 
           placeholderTextColor={theme.color.mainPlaceholderColor} style={[styles.phoneinput,{borderColor:(phoneF||phoneV)?"red":phoneInputFieldborderColor3 ,backgroundColor:"white",color:"black"}]} 
           onChangeText={(txt)=>{setPhoneInput(txt,"phone3")}}/>
            )}
  </View>
    
     <utils.CheckError phoneF={phoneF} phoneV={phoneV} countryCode={selectedCountryCode} textColor={"red"}/>       
     
     <TouchableOpacity onPress={()=>{SigninClick()}} style={styles.BottomButton}>
  		<LinearGradient colors={[theme.color.buttonLinerGC1,theme.color.buttonLinerGC2]} style={styles.LinearGradient}>
  			  		<View style={styles.ButtonRight}>
              {loader==false&&(<Text style={styles.buttonText}>Sign in</Text>)}
               {loader&&(<ActivityIndicator size={25} color={"white"} />)}
 			      	</View>
 			</LinearGradient>
 			</TouchableOpacity>

       <theme.Text style={{fontSize:17,color:theme.color.buttonLinerGC1,alignSelf:"center",marginTop:15,fontFamily:theme.fonts.fontMedium}}>Become a captain</theme.Text>

       </View> 

   

       </Layout>
 
  )
 
   }
 
 