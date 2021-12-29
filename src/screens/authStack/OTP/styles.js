import theme from '../../../themes/index'

import { StyleSheet } from 'react-native'
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	logo: {
		height: 96,
		width: 96,
		top: 10,
		left: 32
	},
	title: {
		color: '#000',
		fontSize: 24,
		width: '90%',
		marginTop: 10,
		alignSelf: 'center',
		lineHeight: 32,
		fontFamily:'Inter-Regular',
		marginBottom:20
	},
	subtitle: {
		color: '#000',
		fontSize: 14,
		width: '90%',
		alignSelf: 'center',
		lineHeight: 19,
		fontFamily:'Inter-Regular'
	},
	BottomButton: {
		width: '90%',
		flexDirection: 'row',
		position: 'absolute',
		bottom: 10,
		alignSelf: 'center',
		justifyContent: 'center'
	},
	ButtonLeft: {
		backgroundColor: '#fff',
		width: 160,
		borderRadius: 4,
		height: 48,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 5
	},
	ButtonRight: {
		backgroundColor: '#fff',
		width: 160,
		borderRadius: 4,
		height: 48,
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: 5
	},
	buttonText: {
		color: '#0E47A1',
		fontSize: 16,
		lineHeight: 19.36,
		fontFamily:'Inter-Bold'
	},
	status: {
		backgroundColor: '#fff'
	},
	Header: {
		height: 70,
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center'
	},
	ArrowBack: {
		height: 24,
		width: 24,
	},
	BackButton: {
		height: 30,
		width: 30,
		left: 20
	},
	ConfirmButton: {
		backgroundColor: '#fff',
		borderRadius: 4,
		height: 48,
		justifyContent: 'center',
		top: 80,
		width: '85%',
		alignSelf: 'center'
	},
	ButtonText: {
		alignSelf: 'center',
		color: '#0E47A1',
		lineHeight: 20,
		fontSize: 16,
		fontFamily:'Inter-Regular'
	},
	ResendButton: {
		backgroundColor: '#fff',
		borderRadius: 4,
		height: 48,
		justifyContent: 'center',
		top:20,
		width: '85%',
		alignSelf: 'center',
		fontFamily:'Inter-Regular'
	},
	Timer: {
		flexDirection: 'row',
		alignItems: 'center',
		alignSelf: 'center',
		marginTop: 20
	},
	TimerText: {
		fontSize: 14,
		color: 'grey',
		fontFamily:'Inter-Regular'
	},
	root: { 
		flex: 1, 
		padding: 10 
	},
	codeFieldRoot: { 
		marginTop: 20 
	},
	cell: {
		width: 50,
		height: 50,
		lineHeight: 40,
		fontSize: 40,
		borderBottomWidth: 2,
		borderBottomColor: 'silver',
		textAlign: 'center',
		color:'grey',
		fontFamily:'Inter-Regular'
	},
	focusCell: {
		borderColor: '#fff',
	},
})

export default styles;