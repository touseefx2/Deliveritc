import { observable,makeObservable,action } from "mobx";
import {  persist } from 'mobx-persist'
import db from "../../database/index"
import utils from "../../utils";
import userStore from "../index";  
import carstore from "../index";
import moment from "moment"
import userstore from "../user_store";

export default  class  tripstore {

constructor(){
  makeObservable(this) 
  }
  
  
  @persist('object') @observable request = false;   //trips
 
  @persist('object')  @observable  accept = false;    
  @persist('object')  @observable  atime = "";      //acept trip time
  @persist('object')   @observable  arvtime = "";      //arrive trip time

  @persist('object')   @observable  tcp = "...";  
  @persist('object')   @observable  dcp = "...";  

  @persist('object')   @observable  dpd = "...";  
  @persist('object')   @observable  tpd = "...";  
 
  // const [tcp,settcp] = useState("..."); // time from current loc to pickup location      reqesr modal
  // const [dpd,setdpd] = useState("..."); // distance from    pickup location to dropofloce  startride true
  // const [tpd,settpd] = useState("..."); // time from  pickup location to dropofloce  startride true

   
    @observable  ridemodal = false;

    @observable  waitTime = "f";
   
  @persist('object') @observable  arrive = false; 
  @persist('object')  @observable  startride = false; 
  @persist('object') @observable  endride = false; 
  @persist('object') @observable  normalPay = false; 
  @persist('object') @observable  normalPaycash = "---";
  
  @persist('object') @observable  ar = 0;   //req user avg rating

  @observable  getreqloader= false; 

  @observable  gro= false; 

  @action setgro=(obj)=>{         //set trip
    this.gro=obj
   }

   @action settcp=(obj)=>{         //set trip
    this.tcp=obj
   }

   @action setdcp=(obj)=>{         //set trip
    this.dcp=obj
   }

   @action setdpd=(obj)=>{         //set trip
    this.dpd=obj
   }

   @action settpd=(obj)=>{         //set trip
    this.tpd=obj
   }

   @action setnormalPay=(obj)=>{         //set trip
    this.normalPay=obj
   }

   @action setnormalPaycash=(obj)=>{         //set trip
    this.normalPaycash=obj
   }

   @action setridemodal=(obj)=>{         //set trip
    this.ridemodal=obj
   }

  @action setgetreqloader=(obj)=>{          
    this.getreqloader=obj 
  }

  @action.bound
  setar(val) {
   this.ar = val;
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
          this.setar(0);
          this.setarrive(false)
          this.setrequest(false);
          this.startride(false);
          this.endride(false);
       
          utils.ToastAndroid.ToastAndroid_SBC("Customer cancel this trip !")
         }

	 
      
		  return;
	  }).catch((e) => {
	   
		       console.error("Update  user intrip responecatch error : ", e)
	        	return;
	  })
	
		}

    @action getAvgRate=(id)=>{         //get new trip by id
      const bodyData=false
      const header= userStore.userStore.authToken;
     
      // method, path, body, header
      db.api.apiCall("get",db.link.getAvgRating+id,bodyData,header)
      .then((response) => {
        
             console.log("Get avg rating res : " , response);
        
             if(response.msg=="Invalid Token"){
              utils.AlertMessage("",response.msg) ;
              onLogout()
              return;
             }

             if(!response.data){
              // utils.AlertMessage("",response.message) ;
              return;
             }
    
             if(response.data){
               if(response.data.length>0){
                this.setar(response.data[0].ratingAvg);
                return;
               }
               this.setar(response.data.ratingAvg);
             }
          
             return;
     
      }).catch((e) => {
        // utilsS.AlertMessage("","Network request failed");
         console.error("Get avg rating catch error : ", e)
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
       this.setgro(true);
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

              let res=response.data[0]
              this.getAvgRate(res.customer._id)
              this.setrequest(res);
              return;
             }else{

              let req=response.data[0];

              if(req.cancelled_by=="customer"){
                this.updateUserTS();
                return;
              }
    
              this.getAvgRate(req.customer._id)
              this.setrequest(req);
              this.setnormalPaycash(req.rent)

               if(req.status.length>0){
                 req.status.map((e,i,a)=>{

                  if(e.status=="accepted"){
                    this.setatime(e.date)
                    this.setaccept(true)
                  }
                  
                    if(e.status=="arrived"){
                       this.setarvtime(e.date)
                       this.setarrive(true)
                   }
                
                  if(e.status=="started"){
                    this.setstartride(true)
                  }

                  if(e.status=="ended"){
                    this.setendride(true)
                  }

 
 
                 })
               }
              
               

               return;

             }
             
           }
        
           return;
   
    }).catch((e) => {
      this.setgetreqloader(false);
      this.setgro(false);
      // utilsS.AlertMessage("","Network request failed");
       console.error("Get req by id catch error : ", e)
       return;
    })
   }
   
}
 
  
 
 