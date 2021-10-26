import React ,{useEffect,useRef,useState} from 'react';
import { Alert,TouchableOpacity,View,KeyboardAvoidingView,ScrollView } from 'react-native';
import {Layout} from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import * as eva from '@eva-design/eva';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';
import theme from "../../themes/index"
import ModalSelector from 'react-native-modal-selector'
import utils from "../../utils/index"
import LinearGradient from 'react-native-linear-gradient';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import GVs from '../../store/Global_Var';
import ToggleSwitch from 'toggle-switch-react-native'
import { Searchbar } from 'react-native-paper'; 
import AsyncStorage from '@react-native-async-storage/async-storage'
import { inject, observer } from "mobx-react"; 

  export default inject("store")(observer(SelectCar));

function SelectCar (props)   {

 const {cars,setcars,user,setuser,changeuser} = props.store;
  
 const [loader,setloader]=useState(true);
 const [search,setSearch]=useState("");
 const [activeChecked, setActiveChecked] = useState(false);

 const onActiveCheckedChange = (isChecked) => {
   setActiveChecked(isChecked);
 };
 
 useEffect(() => {
   setTimeout(() => {
    setloader(false)
   }, 2000);
 }, [])

 const  storeUserData = async (s,o) => {
  try {

       let u  = {...user}
       u.selectedCar=s
       u.optin=o
       
    await AsyncStorage.setItem('userData', JSON.stringify(u))

    changeuser("selectcar",s)
    changeuser("optin",o)

   
    setloader(false)
    console.log("store user data success : ")
  } catch (e) {
    console.log("store user data error : ", e)
    setloader(false)
  }
}

  const renderOptin=()=>{
    return(
      <View style={{marginTop:15,backgroundColor:theme.color.mainColor,elevation:5,padding:10,borderRadius:4,flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>

<utils.vectorIcon.FontAwesome5 name="car" color="black" size={35} />
 
 <View style={{width:"70%"}}>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:16,color:"black",fontFamily:theme.fonts.fontMedium,lineHeight:20}}> 
Opt-in
 </theme.Text>
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:13,color:theme.color.mainPlaceholderColor,lineHeight:20}}> 
Enable to get more bookings
 </theme.Text>
 </View>
       
 <ToggleSwitch
  isOn={activeChecked}
  onColor="#35cf2d"
  offColor="silver"
  size="small"
  onToggle={(t)=>onActiveCheckedChange(t)}
/>
 
      </View>
    )
  }

  const renderSearchBar=()=>{
    return(
      // <View style={{flexDirection:"row",height:45,alignItems:"center",backgroundColor:theme.color.AppHeaderColor}}>
      <Searchbar
      placeholder="Search for plate number"
      onChangeText={(t)=>{setSearch(t)}}
      value={search}
      style={{borderRadius:4,marginTop:5}}
      inputStyle={{color:theme.color.mainTextColor}}
      placeholderTextColor={theme.color.mainPlaceholderColor}
      iconColor={theme.color.mainTextColor}
    />
    // </View> 
      )
  }

  const gotoHome=(id)=>{
    setloader(true);
    let carId=id;
 
    let selecteCar=carId
    let  optin=activeChecked
     storeUserData(selecteCar,optin)
      
  

  }

  const SelectCar=(id)=>{
    Alert.alert(
      "Confirmation",
      "Are you sure you want to select this car ?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Yes", onPress: () =>  {gotoHome(id)} }
      ]
    );
  }

 const  renderShowCars=(i,name,number,id)=>{
 
  return(
    <TouchableOpacity onPress={()=>{SelectCar(id)}}>
    <View style={{marginTop:i==0?0:20,backgroundColor:theme.color.mainColor,padding:10,borderRadius:4,flexDirection:"row",alignItems:"center"}}>
     
  <utils.vectorIcon.Ionicons name="ios-car-sport-outline" color="black" size={50} />
 
 <View style={{width:"82%",marginLeft:5}}> 
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:17,color:"black",fontFamily:theme.fonts.fontMedium,textTransform:"capitalize",lineHeight:20}}> 
{name}
 </theme.Text>  
 <theme.Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:15,color:theme.color.mainPlaceholderColor,textTransform:"capitalize",lineHeight:20}}> 
  {number}
 </theme.Text>
 </View>

 

 </View>
   </TouchableOpacity>
    )
  }
  
  const renderAllCars=()=>{
 
    let c=  cars.map((e,i,a)=>{
      let id=e.id
      let name=e.name || ""
      let number= e.number || ""


      if(search==""){
        return renderShowCars(i,name,number,id)
      }else{
    
        let Search= search.toLowerCase();
        let searchLength = Search.length; 
        let Number = number.toLowerCase() 
        let s=  Number.substr(0, searchLength);
       
        if(s==Search){
          return renderShowCars(i,name,number,id)
        } 

      }
     
    })
 
      if(c.length<=0 && c[0]==undefined){
        const style={marginTop:hp("10%"),alignSelf:"center"}
        return  utils.message.ShowEmptyRecords("Car not found.",style)
      }else{
        return c
      }
    
   
  }

  const rendercars=()=>{
if(cars.length>0){
return(
  <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingVertical:20}}  >
  {renderAllCars()}
  </ScrollView>
)
}else{
     const style={marginTop:hp("55%"),position:"absolute",alignSelf:"center"}
     return  utils.message.ShowEmptyRecords("Empty",style)
   }
 
  }

  return(
<Layout style={styles.container}>
  <KeyboardAvoidingView
  keyboardVerticalOffset={Platform.OS == "ios" ? 10 : 0}
  behavior={Platform.OS == "ios" ? "padding" : ""} 
  style={{ flex: 1}} >
  <utils.Loader  loader={loader} />
  
    <theme.Text style={{fontSize:25,fontFamily:theme.fonts.fontMedium,color:"black",marginTop:10}}> 
      Select Car
     </theme.Text>
    {renderOptin()}
    {renderSearchBar()}
 

    <theme.Text style={{fontSize:16,fontFamily:theme.fonts.fontMedium,color:"black",marginTop:20}}> 
      Dedicated Car
     </theme.Text>
     {rendercars()}

     </KeyboardAvoidingView> 
  </Layout>
)
    
}

