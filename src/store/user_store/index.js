import { observable,makeObservable,action } from "mobx";
import {  persist } from 'mobx-persist'
import carstore from "../index";

export default  class  userstore {

constructor(){
    makeObservable(this) 
  }
 
  @observable  loader= true 

  @observable  cl= ""
  
 
  @persist('object') @observable user = false;

  @persist('object') @observable online = false;

  @persist @observable notificationToken = ""
  @persist @observable authToken  = ""

 
   
  @action setLoader =(obj)=>{ 
    this.loader=obj
   }

   @action setonline =(obj)=>{ 
    this.online=obj
   }

   @action setcl =(obj)=>{ 
    this.cl=obj
   }
 
  
 
 
   @action.bound
   setUser(val) {
      this.user=val
   }

   @action.bound
   addnotificationToken(n) {
       this.notificationToken = n;
   }

   @action.bound
   addauthToken(n) {
       this.authToken = n;
   }
  
   @action.bound
    Logout() {
       this.notificationToken='';
       this.authToken='';
       this.user = false;
       this.isterms_accepted=false;
       carstore.carStore.setCars(false)
   }

   
}
 
  
 
 