import theme from '../../../themes/index'
import { StyleSheet} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

 
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor:theme.color.mainColor,
		padding:10,
	  },
	  phoneinput:{
		  fontSize:17,width:65,padding:6,
		  textAlign:"center",borderRadius:4,
		  marginLeft:8,borderWidth:1
		},
	Bottom:{
        // backgroundColor:"yellow",
		position:"absolute",
		bottom:20,
		marginTop:30,
		alignSelf:"center"
	},
	BottomButton:{
		flexDirection:'row',
		height:45,
		width:"50%",
        alignSelf:'center',  
		justifyContent:"center", 
		marginTop:40,  
	},
	BottomButtona:{
		flexDirection:'row',
		height:45,
		width:"100%",
        alignSelf:'center',  
		justifyContent:"center", 
		marginTop:15,  
	},
    ButtonRight:{
		width:'50%',
		borderRadius:4,
		height:45,
		justifyContent:'center',
		alignItems:'center',
	},
	ButtonRight:{
		width:'100%',
		borderRadius:4,
		height:45,
		justifyContent:'center',
		alignItems:'center',
	},
	buttonText:{
		color:theme.color.buttonLinerTextColor,
		fontSize:theme.fonts.buttonLinerfontSize,
		fontFamily:theme.fonts.fontMedium
	},
	LinearGradient:{
		height:'100%',
		width:'100%',
		borderRadius:4,
		justifyContent:'center',
		alignItems:'center'
	},
	LinearGradienta:{
		width:'100%',
		borderRadius:4,
		justifyContent:'center',
		alignItems:'center'
	},
	root: { 
		flex: 1, 
		padding: 10 
	},
	codeFieldRoot: { 
		marginTop: 30 
	},
	cell: {
		width: "22%",
		height: 50,
		lineHeight: 60,
		fontSize: 40,
		borderBottomWidth: 2,
		borderBottomColor: theme.color.buttonLinerGC1,
		textAlign: 'center',
		color:"black",
		fontFamily:theme.fonts.fontNormal
	},
	focusCell: {
		borderColor: '#fff',
	},
})

export default styles;