import React   from "react";
import { View,Text} from "react-native";
 
export function CheckError(props){
 
  const showeErrorColor=props.textColor;
  const showeErrorFonstSize=12

  
    const renderShowError = (error)=>{
        return(
          <View style={{padding:7,marginLeft:30}}>
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
   
      {props.phoneF  &&  renderShowError("Please enter phone")}
      {props.phoneV &&  renderShowError(phoneError)}
      
     
      </View>
      )
    }

 
      