import { observable,makeObservable,action } from "mobx";
import {  persist } from 'mobx-persist'
import db from "../../database/index"
import userStore from "../index";  
import carstore from "../index";

export default  class  tripstore {

constructor(){
  makeObservable(this) 
  }
  
  
  @persist('object') @observable request = false;   //trips
 
  @persist('object')  @observable  accept = false;    
  @persist('object')  @observable  atime = "";      //acept trip time
  
  

  @action changerequest=(obj)=>{         //set trip
     this.request=obj 
   }
 
   @action setrequest=(obj)=>{         //set trip
    this.request=obj 
   }

   @action setaccept=(obj)=>{         //set trip
    this.accept=obj
   }

   @action setatime=(obj)=>{         //set trip
    this.atime=obj
   }

   @action getReqById=(tid)=>{         //get new trip by id
    const bodyData=false
    const header=userStore.userStore.authToken;
   
    // method, path, body, header
    db.api.apiCall("get",db.link.getTripsbyId+tid,bodyData,header)
    .then((response) => {
      
           console.log("Get req by id response : " , response);
      
           if(response.msg=="Invalid Token"){
             utils.AlertMessage("",response.msg) ;
             carstore.carStore.setCars(false)
             userStore.userStore.Logout();
            return;
           }

           if(!response.data){
            // utils.AlertMessage("",response.message) ;
            return;
           }
  
           if(response.data){
             this.setrequest(response.data[0])
             return;
           }
        
           return;
   
    }).catch((e) => {
      // utilsS.AlertMessage("","Network request failed");
       console.error("Get req by id catch error : ", e)
       return;
    })
   }
   
}
 
  
 
 