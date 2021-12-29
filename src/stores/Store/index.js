import { observable,makeObservable,action   } from "mobx";
 
  
class  Store {

constructor(){
    makeObservable(this) 
  }
 
  @observable ac= ""   //activecheck
  @observable user= ""
  @observable cars = []  //wislist
  @observable trip = []  //all detail data captain portal

  
  @observable request = "";
  
  @observable cl=""  //curretn location position
  @observable isl="chk"  //location detection on or off
 
  @observable apiLevel=""
  @observable ip="" 
  @observable isInternet= null
 
  @action setuser =(obj)=>{ 
    this.user=obj
   }

   @action changeuser =(c,v)=>{ 
    
    if(c=="ofdetect"){
      this.user.online=v
     }
    
     if(c=="selectcar"){
      this.user.selectedCar=v
     }

     if(c=="optin"){
      this.user.optin=v
     }

   }
   
   @action setcars =(obj)=>{ 
    this.cars=obj
   }

   @action setac =(obj)=>{ 
    this.ac=obj
   }

   @action settrip =(obj)=>{ 
    this.trip=obj
   }

   @action changetrip =(ind,obj)=>{ 
    this.trip[ind].captainTripDispute=obj
   }

   @action addtrip =(obj)=>{ 
    this.trip.push(obj)
   }

   @action setrequest =(obj)=>{ 
    this.request=obj
   }

   @action changerequest =(obj,uid,cid,rs,wt,ds,tt,sc)=>{ 
    if(obj=="cash"){
      this.request.normalPay=true;
      this.request.collectcash=rs;
    }

    if(obj=="finish"){
      this.request.finish=true;
      this.request.userrate= sc
    }

    if(obj=="createdAt"){
      
      this.request.createdAt= new Date();
      // this.request.id= Math.random(100,1000);
    }

    if(obj=="skip"){
      this.request.status= "skip";
      this.request.cancelby= "captain";
      this.request.captainid= uid;
      this.request.captaincarid= cid;
    }

    if(obj=="reject"){
      this.request.status= "reject";
      this.request.cancelby= "captain";
      this.request.captainid= uid;
      this.request.captaincarid= cid;
    }

    if(obj=="accept"){
      this.request.status= "accept";
      this.request.accept= true;
      this.request.captainid= uid;
      this.request.captaincarid= cid;
    }

    if(obj=="cancelunPaid"){
      this.request.status= "cancel"
      this.request.cancelStatus= "unPaid"; //is wait time is not over  or any other erergency
      this.request.cancelby= "captain";
    }

    if(obj=="cancelunPaidcut"){
      this.request.status= "cancel"
      this.request.cancelStatus= "unPaidcut"; //if canceltrip after 2 min
      this.request.cancelby= "captain";
    }

    if(obj=="cancelPaid"){
      this.request.status= "cancel"
      this.request.cancelStatus= "Paid";  //if wait time is over
      this.request.cancelby= "captain";
      this.request.wait_time=wt
    }

    if(obj=="startRide"){
        this.request.startride=true
        this.request.wait_time=wt
         this.request.startRideTime=new Date()
    }

    if(obj=="endRide"){
      this.request.endride=true
      this.request.endRideTime=new Date()
  }

   if(obj=="TotalDistancendTime")
   {
    this.request.total_distance=ds
    this.request.total_time=tt
     }
      
   }

   @action setcl =(obj)=>{ 
    this.cl=obj
   }
   @action setisl =(obj)=>{ 
    this.isl=obj
   }

   @action setapiLevel =(obj)=>{ 
    this.apiLevel=obj
   }

   @action setip =(obj)=>{ 
    this.ip=obj
   }
 
  @action setisInternet=(obj)=>{ 
    this.isInternet=obj;
  }
 
}
 
 export default new  Store();

 
 