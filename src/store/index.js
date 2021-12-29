import userstore from './user_store';
import carstore from './car_store';
import generalstore from './general_store';
import tripstore from './trip_store';
 
const userStore = new userstore()
const carStore = new carstore()
const tripStore = new tripstore()
const generalStore = new generalstore()
 
   
export  default {
    userStore,
    carStore,
    generalStore,
    tripStore
    };