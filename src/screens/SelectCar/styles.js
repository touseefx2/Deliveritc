import theme from '../../themes/index'
import { StyleSheet} from 'react-native'
 
 
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor:"#e8e8e8",
		padding:10,
	  },
	  BottomButton:{
		flexDirection:'row',
		height:45,
		width:"100%",
        alignSelf:'center',  
		justifyContent:"center", 
		marginTop:40,  
	},
	LinearGradient:{
		height:'100%',
		width:'100%',
		borderRadius:4,
		justifyContent:'center',
		alignItems:'center'
	},
	ButtonRight:{
		width:'100%',
		borderRadius:4,
		height:45,
		justifyContent:'center',
		alignItems:'center',
	},buttonText:{
		color:theme.color.buttonLinerTextColor,
		fontSize:theme.fonts.buttonLinerfontSize,
		fontFamily:theme.fonts.fontMedium,
		textTransform:"capitalize"
	},

	BottomButtona:{
		flexDirection:'row',
		height:45,
		width:"100%",
        alignSelf:'center',  
		justifyContent:"center", 
		marginTop:15,  
	},
	LinearGradienta:{
		width:'100%',
		borderRadius:4,
		justifyContent:'center',
		alignItems:'center'
	},

	
})

export default styles;