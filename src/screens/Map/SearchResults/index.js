import React ,{useEffect,useRef,useState} from 'react';
import { StyleSheet,TouchableOpacity,View,SafeAreaView,Text} from 'react-native';
import styles from './styles';
import theme from "../../../themes/index"
import utils from "../../../utils/index"
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { InputGroup, Input } from "native-base";
import { View, List, ListItem, Left, Body } from "native-base";
 


import { inject, observer } from "mobx-react"; 

  
   function SearchResults  ({predictions, getSelectedAddress}) 
   {

	function handleSelectedAddress(placeID){
		getSelectedAddress(placeID)
	}

		return(
			<View style={styles.searchResultsWrapper} >
				<List 
					dataArray={predictions}
					renderRow={(item)=>
						<View>
							<ListItem onPress={()=>handleSelectedAddress(item.placeID)} button avatar>
								<Left style={styles.leftContainer}>
									<utils.vectorIcon.MaterialIcons  style={styles.leftIcon} name="location-on" />
								</Left>
								<Body>
									<Text style={styles.primaryText}>{item.primaryText}</Text>
									<Text style={styles.secondaryText}>{item.secondaryText}</Text>
								</Body>
							</ListItem>
						</View>
					}
				/>
			</View>

		);
};


export default SearchResults ;