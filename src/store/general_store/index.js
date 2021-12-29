import { observable,makeObservable,action } from "mobx";
 
  
export default  class  generalstore {

constructor(){
    makeObservable(this) 
  }
 
  @observable  isInternet= false 
  @observable  isLocation= false
  @observable  deviceApi="" 
  @observable  appState="" 
  
 
  @action setInternet =(obj)=>{ 
    this.isInternet=obj
   }

   @action setLocation =(obj)=>{ 
    this.isLocation=obj
   }

   @action setdeviceApi =(obj)=>{ 
    this.deviceApi=obj
   }

   @action setappState =(obj)=>{ 
    this.appState=obj
   }
  
}
 
  
 
 