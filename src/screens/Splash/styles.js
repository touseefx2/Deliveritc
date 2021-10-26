 import {StyleSheet} from "react-native";
import theme from "../../themes/index"
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
 
export const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:theme.color.mainColor,padding:10,justifyContent:"center",alignItems:"center"}
});
