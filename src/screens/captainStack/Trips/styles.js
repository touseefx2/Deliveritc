import {StyleSheet} from "react-native";
import theme  from "../../../themes/index";
 
export default  styles = StyleSheet.create({
   container:{backgroundColor:theme.color.mainColor,flex:1},
   dp:
    {flexDirection:"row",alignItems:"center",backgroundColor:"#007069" ,borderTopLeftRadius:200,height:170,
    elevation:15,shadowColor:"black",
    shadowOffset:{width:0,height:10},
    shadowOpacity:.3,
    shadowRadius:20,
    },
    searchbar:{backgroundColor:"white",height:45,width:"84%"},

    avatar: 
    {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 2,
      borderColor:"white",
    },
    name:
    {
      color: "white",
      fontWeight:"bold",
      fontSize:20,
      textTransform: 'capitalize',
    },
    textInput:
    {
    marginTop:15,
    textTransform:"capitalize"
},
cardtitle:{
  fontSize:20,color:"gray",fontFamily:theme.fonts.fontBold,marginTop:"15%" 
},

 
});
