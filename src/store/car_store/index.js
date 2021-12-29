import { observable,makeObservable,action } from "mobx";
import {  persist } from 'mobx-persist'

  
export default  class  carstore {

constructor(){
  makeObservable(this) 
  }
  
  @persist('object') @observable cars = false;
    
  @action setCars =(obj)=>{ 
    this.cars=obj
   }
 
}
 
  
 
 