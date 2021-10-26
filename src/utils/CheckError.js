import React   from "react";
import { View,Text} from "react-native";
 
export function CheckError(props){
 
  const showeErrorColor=props.textColor;
  const showeErrorFonstSize=14

  
    const renderShowError = (error)=>{
        return(
          <View style={{padding:7}}>
            <Text style={{fontSize:showeErrorFonstSize,color:showeErrorColor}}>{error}</Text>
          </View>
        )
      }
      
      const countryCode=props.countryCode;
      let phonePattern= "";
           if(countryCode=="+92"){phonePattern="+92 300 1234 567"}
      else if(countryCode=="+91"){phonePattern="+91 300 1234 567"}
      else if(countryCode=="+84"){phonePattern="+84 300 1234 56"}
      else if(countryCode=="+374"){phonePattern="+345 307 123"}
      let phoneError="Please enter correct phone pattern  \n Example : "+phonePattern;
 

      return(
      <View>
      {props.nameF && renderShowError("Please enter name")}
      {props.nameV && renderShowError("Please enter correct name \nexample: abc12")}
      
      {props.emailF &&  renderShowError("Please enter email")}
      {props.emailV &&  renderShowError("Please enter correct email \nexample: a@a.com")}
      
      {props.passwordF &&  renderShowError("Please enter password")}
      {props.passwordV &&  renderShowError("Password length must be greater than 5")}

      {props.cpasswordF &&  renderShowError("Please enter Confirm password")}
      {props.matchpasswordV &&  renderShowError("Confirm Password does not match")}

      {props.phoneF  &&  renderShowError("Please enter phone")}
      {props.phoneV &&  renderShowError(phoneError)}
      
     
      </View>
      )
    }

 
      