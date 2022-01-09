import React ,{useEffect,useRef,useState} from 'react';
import {Image,SafeAreaView,View,Text,ScrollView} from 'react-native';
import { TextInput,Button } from 'react-native-paper';
import utils from "../../../utils/index"
import LinearGradient from 'react-native-linear-gradient';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { inject, observer } from "mobx-react"; 
import MapContainer from '../../Map/MapContainer/index';
import { Container,NativeBaseProvider } from 'native-base';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Geolocation from '@react-native-community/geolocation';
import theme  from "../../../themes/index";
import ConnectivityManager from 'react-native-connectivity-status'
import styles from "./styles"
import { formatDistance, subDays ,startOfWeek,endOfWeek} from 'date-fns'
import moment from 'moment';

 
export default inject("userStore","generalStore","carStore","tripStore")(observer(Notification));
 
 
 function Notification(props)   {
  // const { user,setuser,setcl,cl,isl,setisl,setrequest,request,trip,settrip,cars} = props.store;
  const [loader,setloader]=useState(false);
 
 
  return(
 <SafeAreaView style={styles.container}>
 <utils.StackHeader p={props} title="Notifications" /> 
 <ScrollView>
 <View style={{padding:10}}> 
 
 </View>
 </ScrollView>
 </SafeAreaView>
)
    
  }