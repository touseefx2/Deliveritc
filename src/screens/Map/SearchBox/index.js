import React ,{useEffect,useRef,useState} from 'react';
import { StyleSheet,TouchableOpacity,View,Image,Keyboard,Text,Dimensions} from 'react-native';
import styles from './styles';
import theme from "../../../themes/index"
import utils from "../../../utils/index"
import RNGooglePlaces from 'react-native-google-places';

import { inject, observer } from "mobx-react"; 
 

export default inject("userStore","generalStore","carStore")(observer(SearchBox));

   function SearchBox (props)   {

  // const { user,setuser} = props.store;
//  const accept=props.accept

// const {isInternet,isLocation}  = props.generalStore;
// const {user,setUser} = props.userStore;
// const {cars,setCars} = props.carStore;


 const search=props.Search;
  
  const GooglePlacesInput = () => {
      RNGooglePlaces.openAutocompleteModal({
      initialQuery:"", 
      country: 'PK',
      
  },   ['placeID', 'location', 'name', 'address']

  // ['placeID', 'location', 'name', 'address', 'types', 'openingHours', 'plusCode', 'rating', 'userRatingsTotal', 'viewport']
)
.then((place) => {

  
  const window = Dimensions.get('window');
  const { width, height }  = window
  const LATITUD_DELTA = 0.0922
  const LONGITUDE_DELTA = LATITUD_DELTA + (width / height) 


  const data={
    name:place.name,
    address:place.address,
    location:{
      latitude: place.location.latitude ,
      longitude: place.location.longitude  ,
      latitudeDelta:LATITUD_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    }
  }

	props.setSearch(data)
  //  console.log("google places : ",data);
})
.catch(error => console.log(error.message));
 
};
 
  return(
  <View style={styles.searchBox}>  
 	 
	     <TouchableOpacity style={{width:"12%"}}  onPress={()=>{Keyboard.dismiss();props.propsH.navigation.openDrawer()}}>
       <utils.vectorIcon.Ionicons  name="md-menu" size={30} color="black" />
       </TouchableOpacity>

 {search==""&&(
<TouchableOpacity style={styles.inputWrapper} onPress={()=>GooglePlacesInput()}> 
<utils.vectorIcon.MaterialIcons name="location-on" size={25} color={theme.color.buttonLinerGC1} /> 
<theme.Text style={{fontSize:14,marginLeft:5}}>Add destination</theme.Text>
</TouchableOpacity>
 )}
 
{search!=""&&(
  <View style={styles.inputWrapper} > 
<theme.Text numberOfLines={1} ellipsizeMode="tail"  style={{fontSize:13,width:"85%"}}>{search.name}</theme.Text>
<TouchableOpacity onPress={()=>{props.setSearch("")}}>
<utils.vectorIcon.Entypo style={{marginLeft:3}} name="cross" size={25} color={theme.color.buttonLinerGC1} /> 
</TouchableOpacity>
</View >
 )}

    <TouchableOpacity   style={{width:"12%",backgroundColor:"white",opacity:0.8,borderRadius:5,alignItems:"center",justifyContent:"center",paddingHorizontal:3,height:40}}   onPress={()=>props.gotoCurrentLoc()} >	 
	   <utils.vectorIcon.MaterialIcons name="my-location" color="#0E47A1" size={27} />
	   </TouchableOpacity>

	 		 
  </View>
)
    
}

 