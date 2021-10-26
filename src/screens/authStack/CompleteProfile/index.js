import React   from "react";
import {Button} from 'react-native-paper';
import { View,TouchableOpacity,Keyboard,Modal,KeyboardAvoidingView, ScrollView,Platform} from "react-native";
import { Container, Content, Item, Input ,Text } from 'native-base';
import NetInfo from "@react-native-community/netinfo";
import AwesomeAlert from 'react-native-awesome-alerts';
import utils from "../../utils/index"
import GV from "./Global_Var"
import {styles} from "./styles";
import GVs from "../../store/Global_Var";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

  
//Validation 
let emailValidate=true
let passwordValidate=true
 
export default  class Login extends React.Component {
   

  constructor(props)
{
super(props);
this.state=
{
email : "",
password : "",
isInternetConnected:null,
emailF:false,
emailV:false,
isHidePassword:true,
passwordV:false,
passwordF:false,
showAlert:false,
setUserData:false,
uid:null,
//out focus color of input field
emailInputFieldborderColor:"#007069",
passwordInputFieldborderColor:"#007069",
loader:false
};
 
}

 
   __logIn(email,password){ 
    this.setState({loader:true})
 
   if(GVs.users.length>0){
    let p= false;
    let e=false;
    let data=""
    GVs.users.map((d,i,a)=>{
      if(d.email == email ){

  
        e=true;

       if(password==d.password) {
        p=true; 
        data=d
       }
 
      }
    })
   
   if(e&&p){
      this.setState({loader:false});
      this.props.navigation.replace("Loading",{data:data,s:"yes",skills:""})
   }
   if(!e&&!p){
 this.setState({loader:false});
utils.AlertMessage("","User not found")
   } 

   if(e&&!p){
    this.setState({loader:false});
   utils.AlertMessage("","Password not correct")
      } 
    
  
  }else{
    this.setState({loader:false});
utils.AlertMessage("","no any User not found in database")
  }

 
  }

  
 
goToNextScreen(screenName){
  this.props.navigation.navigate(screenName)
  this.clearFields(); 
} 
 
checkEmptyFields= ( email,password)=>
{

  //validation
  {email !="" && ( emailValidate     =  utils.Validation.EmailValidate(email) )}  
  {password!="" && ( passwordValidate =   utils.Validation.PasswordValidate(password) )}

  
    this.setState({
      emailV: emailValidate ? false : true ,
      passwordV: passwordValidate ? false : true ,
    })
 
 

    if(email=="" || password=="" ){
      this.setState({
        emailF:email=="" ? true : false,
        passwordF:password=="" ? true : false, 
      })
      return false;
    } else{
      return true;
    }

 
 


 
}

clearFields = () =>
{
  this.state=
{
email : "",
password : "",
emailF:false,
emailV:false,
passwordV:false,
passwordF:false,
setUserData:false,
showAlert:false,
//out focus color of input field
emailInputFieldborderColor:null,
passwordInputFieldborderColor:null,
};
}
 
 handleInternetConnectivityChange = state => {
  if (state.isConnected) {
    this.setState({isInternetConnected:true})
  } else {
    this.setState({isInternetConnected:false})
  }
};

  LoginClick(email,password,isInternetConnected)//
{
  Keyboard.dismiss();
  emailValidate=true
  passwordValidate=true

  let  color=  GV.InputFieldborderColor
  this.setState({ 
  emailInputFieldborderColor:color,
  passwordInputFieldborderColor:color,
      })

//CheckEmptyField  
var checkEmptyFields = this.checkEmptyFields( email,password)
if(checkEmptyFields)
{
  
  if( emailValidate && passwordValidate ) 
  { 
    
 if(isInternetConnected)
    {

      var e=email.toLowerCase();
     this.__logIn(e,password);
    }
    else{
     this.setState({showAlert:true})
    }    
  

 } 

}
 

}
 
   
ForgottenPaswwordClick(){
this.goToNextScreen("ForgotPassword")
}
 
componentDidMount()
{
 
  let  color= GV.InputFieldborderColor
  this.setState({
  emailInputFieldborderColor:color,
  passwordInputFieldborderColor:color,
      })

  this.unsubscribe = NetInfo.addEventListener(this.handleInternetConnectivityChange)
 
}
 

componentWillUnmount() {
  if (this.unsubscribe){this.unsubscribe()}
  }
 
renderShowInternetErrorAlert(title,message){
const {showAlert}= this.state;
return(
  <AwesomeAlert
  show={showAlert}
  showProgress={false}
  title={title}
  message={message}
  closeOnTouchOutside={true}
  closeOnHardwareBackPress={false}
  showConfirmButton={true}
  confirmText="OK"
  confirmButtonColor="#DD6B55"
  onConfirmPressed={() => {
    this.setState({showAlert:false})
  }}
/>
)
}

_scrollToInput =(reactNode)=> {
  // Add a 'scroll' ref to your ScrollView
  this.scroll.props.scrollToFocusedInput(reactNode)
}

renderLogin()
{
  const { email,password,isHidePassword,emailF,passwordF,emailV,passwordV,emailInputFieldborderColor,
  passwordInputFieldborderColor} = this.state;
  
  return(
    
   
    <View style={{padding:10,margin:10}}>

        <View>
          <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
          <utils.vectorIcon.Ionicons name="arrow-back" color="black" size={30} />
          </TouchableOpacity>
<Text style={styles.title1}>Login to your account</Text>
<Text style={styles.title2}>Enter your username and password to login into your account.</Text>
      </View>

 
        <View   style={styles.inputContainer}>
 
           <Item style={[styles.Item,{borderColor: (emailF || emailV ) ? ( GV.InputFieldborderErrorColor) : emailInputFieldborderColor,backgroundColor: GV.inputItemBackgroundColor  }]} rounded>
            <Input  style={[styles.Input,{color: GV.InputFieldTextColor}]}
            placeholder='E-mail' placeholderTextColor={GV.inputPlaceholderTextColor} value={email}  
            autoCapitalize = 'none'   
             onChangeText={(txt)=>this.setState({email:txt,emailF:false,emailV:false})} />
            </Item>
            <utils.CheckError emailF={emailF} emailV={emailV} textColor={GV.errorTextColor}/>           

            <Item style={[styles.Item,{marginTop:20,borderColor: (passwordF || passwordV ) ? ( GV.InputFieldborderErrorColor): passwordInputFieldborderColor,backgroundColor: GV.inputItemBackgroundColor}]} rounded>
            <Input style={[styles.Input,{color: GV.InputFieldTextColor}]}
            placeholder='Password'  value={password}  secureTextEntry={isHidePassword} defaultValue={password}  
            placeholderTextColor={GV.inputPlaceholderTextColor}  onChangeText={(txt)=>this.setState({password:txt,passwordF:false,passwordV:false})} />
           {password.length >0 && ( <utils.vectorIcon.MaterialCommunityIcons style={{marginRight:6}}
           name= {isHidePassword ? "eye-off-outline" : "eye-outline" } 
           onPress={()=>this.setState({isHidePassword:!isHidePassword})} color="silver" size={GV.InputFieldIconSize}/>)}
            </Item>
            <utils.CheckError passwordF={passwordF} passwordV={passwordV} textColor={GV.errorTextColor} />
 
  
            <TouchableOpacity style={{marginTop:20,marginLeft:3}} onPress={()=>this.goToNextScreen("ForgotPassword")}>
             <Text style={{fontSize:GV.button2FontSize,color:"#007069"}}>Forgot Password?</Text>
            </TouchableOpacity>

           
</View>

   </View>
  

 
  )
}

renderButton(){
  const { email,password,isInternetConnected} = this.state;
    
 
  return(
 <View style={{ justifyContent: 'flex-end',marginBottom: 15,alignSelf:"center",marginTop:10}}>
<Button   compact={true} dark={false}   mode="contained" labelStyle={styles.button1Text} color="#007069" style={styles.button1}  onPress={()=>{this.LoginClick(email,password,isInternetConnected)}}>
Continue  
</Button>
</View>
    )
  

}

    render() {
      const  {isInternetConnected,loader} = this.state;
 
      return (
        <View style={styles.container}> 

         {!isInternetConnected && this.renderShowInternetErrorAlert("No internet connection","Please connect internet.")} 
         <utils.Loader loader={loader} />
       
         <KeyboardAvoidingView
    keyboardVerticalOffset={Platform.OS == "ios" ? 10 : 0}
    behavior={Platform.OS == "ios" ? "padding" : ""} style={{ flex: 1 }} >

 

<ScrollView>  
          {this.renderLogin()} 
</ScrollView>  

          {this.renderButton()}
  
   </KeyboardAvoidingView>

       
          
        </View>
      )
     }
    }
  

 