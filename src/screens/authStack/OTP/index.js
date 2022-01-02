import React, { useState,useEffect } from 'react';
import { Text, View, StyleSheet, Image, StatusBar, TouchableOpacity, SafeAreaView,Platform} from 'react-native'
import styles from './styles'
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import utils from '../../../utils';
import CountDown from 'react-native-countdown-component';
import {
	CodeField,
	Cursor,
	useBlurOnFulfill,
	useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import auth from '@react-native-firebase/auth';
import db from "../../../database/index" 
import utilsS from "../../../utilsS/index"
import { inject, observer } from "mobx-react";

const CELL_COUNT = 6;

export default inject("userStore","generalStore")(observer(Otp));

 function Otp (prop) {
 
	  const {isInternet}   =  prop.generalStore;
	  const {setUser, addnotificationToken,addauthToken,setisterms_accepted } =  prop.userStore;
	  const {userd,nt,at,mobile}=prop.route.params;

	const [loader, setloader] = useState(false);
 
	const [isFinish, setFinish] = useState(false);
 
	const [confirm, setConfirm] = useState(null);

	const [value, setValue] = useState('');
	const [props, getCellOnLayoutHandler] = useClearByFocusCell({
		value,
		setValue,
	});
	const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT });

	async function signInWithPhoneNumber(phoneNumber) {
		try {
			setloader(true);
			const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
			setConfirm(confirmation);
			setloader(false)
		} catch (error) {
		     	console.log('signInWithPhoneNumber error : ',error);
			    setValue("");
				setConfirm(null)
				setloader(false)
				var errorMessage = error.message;
				var si  = errorMessage.indexOf("]")+1
				var  ei  = errorMessage.length -1
				const msg = errorMessage.substr(si,ei)
				utils.AlertMessage("",msg)
				
		}
		
	  }

	async function confirmCode() {
		//   if(confirm!=null){
		// 	try {
		// 		 setloader(true)
		// 		  await confirm.confirm(value);
		// 	      Continue();
		// 	  } catch (error) {
		// 		console.log('Invalid  code : ',error);
		// 		setloader(false)
		// 		setValue("");
		// 		let errorMessage=""

		// 		if(error.code =='auth/invalid-verification-code'){
        //           errorMessage="Invalid verification code, Please enter correct confirmation code !"
		// 		  }else
		// 		if(error.code =='auth/session-expired'){
		// 			errorMessage="The sms code has expired or to many invalid code attempt. Please re-send the verification code to try again"
		// 		  }else
		// 		if(error.code =='auth/network-request-failed'){
		// 			errorMessage="Please connect internet and renter confirmation code ! "
		// 		  }else{
		// 			var em = error.message;
		// 			var si  = em.indexOf("]")+1
		// 			var  ei  = em.length -1
		// 			errorMessage = em.substr(si,ei)
		// 		  }
 
		// 	 	utils.AlertMessage("",errorMessage)
	 	
		// 	  }
		//   }else{
		// 	  setValue("")
		//   }
	 
	   setloader(true);
	  Continue();

	}

	const goBack = () => {
		prop.navigation.goBack();
	}

	const Continue = (c) => {
   
	    	 
				// auth().currentUser?.delete();
				// auth().signOut();
			 

			
					 addauthToken(at);addnotificationToken(nt);
					 
				 setTimeout(() => {
				     setUser(userd);
					setloader(false);
				}, 1000);
	 
	}

	const reSend=()=>{
		if(isInternet){
			setFinish(false);
			setValue("");
			setConfirm(null);
			setloader(false);
			// signInWithPhoneNumber(mobile);
		}else{
			utils.AlertMessage("","Please connect internet !")
		}

	}

	useEffect(() => {
//  signInWithPhoneNumber(mobile);
 
	// 	const Subscribe =  auth().onAuthStateChanged( async (user)=> {
	// 		if (user)  {
	// 		setloader(true);	
	// 		setTimeout(() => {
	// 		 Continue()	
	// 		}, 500);
		
	// 			} 
	// 	});	
	 
 	// return()=>{
	// 			Subscribe(); //remove listener
	// 		}

 

		},[])
  
	return (
       <SafeAreaView style={styles.container}>
 
 <utils.Loader loader={loader} n={true} />

 

			<StatusBar
				animated={true}
				barStyle="dark-content"
				backgroundColor={'#fff'}
			/>
			{!isInternet && <utils.TopMessage msg={"Please Connect internet !"} />}
			<View style={styles.Header}>
				<TouchableOpacity onPress={goBack} style={styles.BackButton}>
					{/* <Image source={require('../../assets/images/back.png')} style={styles.ArrowBack} /> */}
					<Icon name={'arrow-back-ios'} size={16} color={'#000'} />
				</TouchableOpacity>

			</View>
			<Text style={styles.title}>Enter your code</Text>
			<Text style={styles.subtitle}>You will recieve a sms with verification pin on</Text>
			<Text style={styles.subtitle}>+92 3*****{mobile.substring(9, 13)}.</Text>
			<View style={{ width: '90%', alignSelf: 'center' }}>
				<CodeField
					ref={ref}
					{...props}
					value={value}
					// editable={confirm==null?false:true}
					onChangeText={setValue}
					onEndEditing={()=>confirmCode()}
					cellCount={CELL_COUNT}
					rootStyle={styles.codeFieldRoot}
					keyboardType="number-pad"
					textContentType="oneTimeCode"
					renderCell={({ index, symbol, isFocused }) => (
						<Text
							key={index}
							style={[styles.cell, isFocused && styles.focusCell]}
							onLayout={getCellOnLayoutHandler(index)}>
							{symbol || (isFocused ? <Cursor /> : null)}
						</Text>
					)}
				/>
			</View>

			{isFinish ? (
				<View>
					<View style={styles.Timer}>
						<Text style={styles.TimerText}>Did't recieve code? Resend code</Text>
					</View>
						<TouchableOpacity onPress={reSend} style={{ width: '90%', height: 40, backgroundColor: '#0E47A1', borderRadius: 4, alignItems: 'center', justifyContent: 'center',alignSelf:"center",marginTop:10}}>
							<Text style={{ color: '#fff', fontSize: 16,fontFamily:'Inter-Regular' }}>Resend Code</Text>
						</TouchableOpacity>
				</View>
			) : (
				<View style={styles.Timer}>
				<Text style={styles.TimerText}>Resend code:</Text>
					<CountDown
						size={14}
						until={60}
						onFinish={() => setFinish(true)}
						digitStyle={{ backgroundColor: 'transparent' }}
						digitTxtStyle={{ color: 'grey' }}
						timeToShow={['S']}
						timeLabels={{ s: null }}
						showSeparator
					/>
				</View>
			)}

		</SafeAreaView>
	);
}
 