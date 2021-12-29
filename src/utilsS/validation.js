

   function  NameValidate (name){
    var reg = /^[a-zA-Z ]{3,40}$/;
    if (reg.test(name) === false)
      return false;
     else
       return true;
     }
  
   function  EmailValidate (email)
   {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(email) === false)
     return false;
    else 
      return true;
   }

   function  CnicValidate (cnic)
   {
    let reg = /\d{5}\d{7}\d/;
    if (reg.test(cnic) === false)
     return false;
    else 
      return true;
   }
  
   function   PasswordValidate  (password)
   {
  if(password.length < 6)
    return false;
  else   
    return true
   }
  
   function   PhoneValidate (phone,selectedCountryCode)
   {
     let phoneLength=phone.length
     let length=null;
     let reg =null;
 
  //india/pak
     if(selectedCountryCode=="+92" || selectedCountryCode=="+91") {
      reg = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
      length=13
     }
     //vitenam
     else if(selectedCountryCode=="+84") {
      reg = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
      length=12
    }
    //armenia
     else if(selectedCountryCode=="+374") {
      reg = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3,5}$/;
      length=10
    }

     
    if (reg.test(phone) === false || phoneLength< length || phone.length >length  ) {
      return false;
    }
    else {
      return true;
    }
   }
  
   function   MatchPassword (password,cpassword)  {
  if(password != cpassword)
    return false;
  else 
    return true;
   }

   const validation={
     NameValidate,
     EmailValidate,
     CnicValidate,
     PasswordValidate,
     PhoneValidate,
     MatchPassword
   }

   export default validation;