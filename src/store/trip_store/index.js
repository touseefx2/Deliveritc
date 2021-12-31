import { observable,makeObservable,action } from "mobx";
import {  persist } from 'mobx-persist'
import db from "../../database/index"
import utils from "../../utils";
import userStore from "../index";  
import carstore from "../index";
import moment from "moment"

export default  class  tripstore {

constructor(){
  makeObservable(this) 
  }
  
  
  @persist('object') @observable request = false;   //trips
 
  @persist('object')  @observable  accept = false;    
  @persist('object')  @observable  atime = "";      //acept trip time
  @persist('object')  @observable  arvtime = "";      //arrive trip time

  // @persist('object')  @observable  captainwt = 0;  

    @observable  ct = 0;   //after arrive cap ka until w8 time se ktna time rah gya tha 
    @observable  waitTime = 60;
   
  @persist('object') @observable  arrive = false; 
  @observable  startride = false; 
  @observable  endride = false; 
  
  @observable  getreqloader= false; 


  @action setgetreqloader=(obj)=>{          
    this.getreqloader=obj 
  }


  @action changerequest=(obj)=>{          
     this.request=obj 
   }
 
   @action setrequest=(obj)=>{         //set trip
    this.request=obj 
   }

   @action setaccept=(obj)=>{         
    this.accept=obj
   }

   @action setatime=(obj)=>{         
    this.atime=obj
   }

   @action setarvtime=(obj)=>{         
    this.arvtime=obj
   }

  //  @action setcaptainwt=(obj)=>{         
  //   this.captainwt=obj
  //  }

   @action setwaitTime=(obj)=>{         
    this.waitTime=obj
   }

   @action setct=(obj)=>{         
    this.ct =obj
   }

   @action setarrive=(obj)=>{          
    this.arrive =obj
   }

   @action setstartride=(obj)=>{          
    this.startride=obj
   }
 
   @action setendride=(obj)=>{       
    this.endride =obj
   }


   @action updateUserTS=()=>{
  	//update user
	  let uid= userStore.userStore.user._id
	  const bodyData= {is_inTrip:false}
	  const header= userStore.userStore.authToken
 
	  // method, path, body, header
	  db.api.apiCall("put",db.link.updateUser+uid,bodyData,header)
	  .then((response) => {
		     
		  	 console.log("Update user intrip respone : " , response);
        
			 
         if(response.msg=="Invalid Token"){
          utils.AlertMessage("",response.msg) ;
          onLogout()
          return;
         }

         if(response.success){
          this.setaccept(false);
          this.setatime("");
          this.setrequest(false);
          utils.ToastAndroid.ToastAndroid_SBC("Customer cancel this trip !")
         }

	 
      
		  return;
	  }).catch((e) => {
	   
		       console.error("Update  user intrip responecatch error : ", e)
	        	return;
	  })
	
		}

   @action getReqById=(tid,c)=>{         //get new trip by id
    const bodyData=false
    const header=userStore.userStore.authToken;
   
    // method, path, body, header
    db.api.apiCall("get",db.link.getTripsbyId+tid,bodyData,header)
    .then((response) => {
           
      this.setgetreqloader(false);

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
          
            if(c!=="check"){
              this.setrequest(response.data[0]);
              return;
             }else{

              let req=response.data[0];

              if(req.cancelled_by=="customer"){
                this.updateUserTS();
                return;
              }
 
            
               if(req.status.length>0){
                 req.status.map((e,i,a)=>{
                    if(e.status=="arrived"){
                       this.setarvtime(e.date)
                   }

                   if(e.status=="accepted"){
                    this.setatime(e.date)
                  }


                 })
               }
              
               this.setrequest(req);
               return;

             }
             
           }
        
           return;
   
    }).catch((e) => {
      this.setgetreqloader(false);
      // utilsS.AlertMessage("","Network request failed");
       console.error("Get req by id catch error : ", e)
       return;
    })
   }
   
}
 
  
 
 